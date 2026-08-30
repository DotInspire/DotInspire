import { Request, Response } from 'express';
import { prisma } from '../config/db';
import { itemSchema } from '../validators/schemas';
import { sendSuccess, sendError } from '../utils/response';
import { slugify, extractYouTubeId } from '../utils/helpers';
import { deleteMultipleCloudinaryImages } from '../utils/cloudinaryCleanup';

export const getItems = async (req: Request, res: Response) => {
  try {
    const { serviceId, serviceSlug, category, includeUnpublished, featured } = req.query;

    let whereCondition: any = {};

    if (includeUnpublished !== 'true') {
      whereCondition.isPublished = true;
    }

    if (featured === 'true') {
      whereCondition.isFeatured = true;
    }

    if (serviceId) {
      whereCondition.serviceId = String(serviceId);
    } else if (serviceSlug) {
      whereCondition.service = { slug: String(serviceSlug) };
    }

    if (category) {
      whereCondition.category = String(category);
    }

    const items = await prisma.item.findMany({
      where: whereCondition,
      orderBy: { displayOrder: 'asc' },
      include: {
        service: { select: { id: true, name: true, slug: true } },
        media: { orderBy: { displayOrder: 'asc' } },
      },
    });

    return sendSuccess(res, items);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch items', 500);
  }
};

export const getItemBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const item = await prisma.item.findUnique({
      where: { slug },
      include: {
        service: { select: { id: true, name: true, slug: true } },
        media: { orderBy: { displayOrder: 'asc' } },
      },
    });

    if (!item) {
      return sendError(res, 'Item not found', 404);
    }

    const relatedItems = await prisma.item.findMany({
      where: {
        serviceId: item.serviceId,
        id: { not: item.id },
        isPublished: true,
      },
      take: 4,
      include: { media: true, service: { select: { name: true, slug: true } } },
    });

    return sendSuccess(res, { item, relatedItems });
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch item', 500);
  }
};

export const createItem = async (req: Request, res: Response) => {
  try {
    const validated = itemSchema.parse(req.body);
    const { images, youtubeUrls, youtubeUrl, ...itemData } = validated;
    const slug = slugify(`${itemData.name}-${Date.now().toString().slice(-4)}`);

    const allVideos = Array.from(new Set([
      ...(youtubeUrls || []),
      ...(youtubeUrl ? [youtubeUrl] : []),
    ])).filter(Boolean);

    const mediaToCreate: any[] = [];

    (images || []).forEach((imgUrl, idx) => {
      mediaToCreate.push({
        type: 'IMAGE' as const,
        url: imgUrl,
        title: `${itemData.name} Photo ${idx + 1}`,
        displayOrder: idx,
      });
    });

    allVideos.forEach((vidUrl, idx) => {
      const videoId = extractYouTubeId(vidUrl);
      if (videoId) {
        mediaToCreate.push({
          type: 'YOUTUBE' as const,
          url: `https://www.youtube.com/embed/${videoId}`,
          youtubeVideoId: videoId,
          title: `${itemData.name} Video ${idx + 1}`,
          displayOrder: 100 + idx,
        });
      }
    });

    const item = await prisma.item.create({
      data: {
        ...itemData,
        slug,
        media: {
          create: mediaToCreate,
        },
      },
      include: { service: true, media: true },
    });

    return sendSuccess(res, item, 'Item created successfully', 201);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return sendError(res, 'Validation error', 400, error.errors);
    }
    return sendError(res, error.message || 'Failed to create item', 500);
  }
};

export const updateItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validated = itemSchema.partial().parse(req.body);
    const { images, youtubeUrls, youtubeUrl, ...itemData } = validated;

    // If images array is supplied, replace/sync item media
    if (images && Array.isArray(images)) {
      const existingMedia = await prisma.itemMedia.findMany({
        where: { itemId: id, type: 'IMAGE' },
        select: { url: true },
      });

      const removedImages = existingMedia
        .map((m) => m.url)
        .filter((url) => !images.includes(url));

      if (removedImages.length > 0) {
        deleteMultipleCloudinaryImages(removedImages).catch(() => {});
      }

      await prisma.itemMedia.deleteMany({
        where: { itemId: id, type: 'IMAGE' },
      });

      if (images.length > 0) {
        await prisma.itemMedia.createMany({
          data: images.map((imgUrl, idx) => ({
            itemId: id,
            type: 'IMAGE',
            url: imgUrl,
            title: `Item Photo ${idx + 1}`,
            displayOrder: idx,
          })),
        });
      }
    }

    if (youtubeUrls && Array.isArray(youtubeUrls)) {
      await prisma.itemMedia.deleteMany({
        where: { itemId: id, type: 'YOUTUBE' },
      });

      for (let idx = 0; idx < youtubeUrls.length; idx++) {
        const vidUrl = youtubeUrls[idx];
        const videoId = extractYouTubeId(vidUrl);
        if (videoId) {
          await prisma.itemMedia.create({
            data: {
              itemId: id,
              type: 'YOUTUBE',
              url: `https://www.youtube.com/embed/${videoId}`,
              youtubeVideoId: videoId,
              title: `Item Video ${idx + 1}`,
              displayOrder: 100 + idx,
            },
          });
        }
      }
    }

    const item = await prisma.item.update({
      where: { id },
      data: itemData,
      include: { service: true, media: true },
    });

    return sendSuccess(res, item, 'Item updated successfully');
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return sendError(res, 'Validation error', 400, error.errors);
    }
    return sendError(res, error.message || 'Failed to update item', 500);
  }
};

export const deleteItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Fetch item media before deletion
    const existing = await prisma.item.findUnique({
      where: { id },
      include: { media: true },
    });

    if (existing) {
      const urlsToDelete = existing.media
        .filter((m) => m.type === 'IMAGE' && m.url)
        .map((m) => m.url);

      if (urlsToDelete.length > 0) {
        deleteMultipleCloudinaryImages(urlsToDelete).catch(() => {});
      }
    }

    await prisma.item.delete({ where: { id } });
    return sendSuccess(res, null, 'Item deleted successfully');
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to delete item', 500);
  }
};
