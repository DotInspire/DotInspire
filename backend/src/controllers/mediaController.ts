import { Request, Response } from 'express';
import { prisma } from '../config/db';
import { extractYouTubeId } from '../utils/helpers';
import { mediaYouTubeSchema } from '../validators/schemas';
import { sendSuccess, sendError } from '../utils/response';
import { deleteCloudinaryImage } from '../utils/cloudinaryCleanup';

export const addImageMedia = async (req: Request, res: Response) => {
  try {
    const { url, entityType, entityId, title } = req.body;
    if (!url || !entityType || !entityId) {
      return sendError(res, 'URL, entityType (ITEM/PROJECT), and entityId are required', 400);
    }

    if (entityType === 'ITEM') {
      const media = await prisma.itemMedia.create({
        data: {
          itemId: entityId,
          type: 'IMAGE',
          url,
          title: title || 'Item Image',
        },
      });
      return sendSuccess(res, media, 'Image attached to Item successfully', 201);
    } else if (entityType === 'PROJECT') {
      const media = await prisma.projectMedia.create({
        data: {
          projectId: entityId,
          type: 'IMAGE',
          url,
          title: title || 'Project Image',
        },
      });
      return sendSuccess(res, media, 'Image attached to Project successfully', 201);
    }

    return sendError(res, 'Invalid entityType. Must be ITEM or PROJECT', 400);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to attach image media', 500);
  }
};

export const addYouTubeMedia = async (req: Request, res: Response) => {
  try {
    const validated = mediaYouTubeSchema.parse(req.body);
    const videoId = extractYouTubeId(validated.youtubeUrl);

    if (!videoId) {
      return sendError(res, 'Could not extract valid YouTube video ID from provided URL', 400);
    }

    const embedUrl = `https://www.youtube.com/embed/${videoId}`;

    if (validated.entityType === 'ITEM' && validated.entityId) {
      const media = await prisma.itemMedia.create({
        data: {
          itemId: validated.entityId,
          type: 'YOUTUBE',
          url: embedUrl,
          youtubeVideoId: videoId,
          title: validated.title || 'YouTube Video',
        },
      });
      return sendSuccess(res, media, 'YouTube video attached to Item successfully', 201);
    } else if (validated.entityType === 'PROJECT' && validated.entityId) {
      const media = await prisma.projectMedia.create({
        data: {
          projectId: validated.entityId,
          type: 'YOUTUBE',
          url: embedUrl,
          youtubeVideoId: videoId,
          title: validated.title || 'YouTube Video',
        },
      });
      return sendSuccess(res, media, 'YouTube video attached to Project successfully', 201);
    } else if (validated.entityType === 'GALLERY') {
      const galleryItem = await prisma.galleryItem.create({
        data: {
          title: validated.title || 'YouTube Gallery Showcase',
          type: 'YOUTUBE',
          url: embedUrl,
          youtubeVideoId: videoId,
        },
      });
      return sendSuccess(res, galleryItem, 'YouTube video added to Gallery successfully', 201);
    }

    return sendError(res, 'Entity type or Entity ID missing', 400);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return sendError(res, 'Validation error', 400, error.errors);
    }
    return sendError(res, error.message || 'Failed to add YouTube media', 500);
  }
};

export const deleteMedia = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { type } = req.query; // 'ITEM', 'PROJECT', or 'GALLERY'

    let mediaUrl: string | null = null;
    let isImage = false;

    if (type === 'ITEM') {
      const existing = await prisma.itemMedia.findUnique({ where: { id } });
      if (existing) {
        mediaUrl = existing.url;
        isImage = existing.type === 'IMAGE';
      }
      await prisma.itemMedia.delete({ where: { id } });
    } else if (type === 'PROJECT') {
      const existing = await prisma.projectMedia.findUnique({ where: { id } });
      if (existing) {
        mediaUrl = existing.url;
        isImage = existing.type === 'IMAGE';
      }
      await prisma.projectMedia.delete({ where: { id } });
    } else if (type === 'GALLERY') {
      const existing = await prisma.galleryItem.findUnique({ where: { id } });
      if (existing) {
        mediaUrl = existing.url;
        isImage = existing.type === 'IMAGE';
      }
      await prisma.galleryItem.delete({ where: { id } });
    } else {
      // Try to find and delete across models
      try {
        const existing = await prisma.itemMedia.findUnique({ where: { id } });
        if (existing) {
          mediaUrl = existing.url;
          isImage = existing.type === 'IMAGE';
        }
        await prisma.itemMedia.delete({ where: { id } });
      } catch {
        try {
          const existing = await prisma.projectMedia.findUnique({ where: { id } });
          if (existing) {
            mediaUrl = existing.url;
            isImage = existing.type === 'IMAGE';
          }
          await prisma.projectMedia.delete({ where: { id } });
        } catch {
          const existing = await prisma.galleryItem.findUnique({ where: { id } });
          if (existing) {
            mediaUrl = existing.url;
            isImage = existing.type === 'IMAGE';
          }
          await prisma.galleryItem.delete({ where: { id } });
        }
      }
    }

    if (isImage && mediaUrl) {
      deleteCloudinaryImage(mediaUrl).catch(() => {});
    }

    return sendSuccess(res, null, 'Media deleted successfully');
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to delete media', 500);
  }
};
