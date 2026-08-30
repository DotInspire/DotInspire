import { Request, Response } from 'express';
import { prisma } from '../config/db';
import { sendSuccess, sendError } from '../utils/response';
import { deleteCloudinaryImage } from '../utils/cloudinaryCleanup';

export interface UnifiedGalleryItem {
  id: string;
  type: 'IMAGE' | 'YOUTUBE';
  url: string;
  youtubeVideoId?: string | null;
  title: string;
  description?: string | null;
  sourceType: 'SERVICE' | 'PROJECT' | 'ITEM' | 'PROJECT_MEDIA' | 'ITEM_MEDIA' | 'GALLERY';
  sourceId: string;
  sourceName: string;
  targetUrl: string;
  adminEditUrl: string;
  isPublished: boolean;
  createdAt: Date;
}

// Fisher-Yates random shuffle helper
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export const getGallery = async (req: Request, res: Response) => {
  try {
    const { includeUnpublished, randomize } = req.query;
    const isPublic = includeUnpublished !== 'true';

    const [services, projects, items, galleryItems] = await Promise.all([
      prisma.service.findMany({
        where: isPublic ? { isPublished: true } : {},
        orderBy: { createdAt: 'desc' },
      }),
      prisma.project.findMany({
        where: isPublic ? { isPublished: true } : {},
        include: { media: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.item.findMany({
        where: isPublic ? { isPublished: true } : {},
        include: { service: true, media: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.galleryItem.findMany({
        where: isPublic ? { isPublished: true } : {},
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const unifiedList: UnifiedGalleryItem[] = [];

    // 1. Service Cover Images
    for (const s of services) {
      if (s.coverImage && s.coverImage.trim() !== '') {
        unifiedList.push({
          id: `service-${s.id}`,
          type: 'IMAGE',
          url: s.coverImage,
          title: s.name,
          description: s.shortDescription,
          sourceType: 'SERVICE',
          sourceId: s.id,
          sourceName: `Service: ${s.name}`,
          targetUrl: `/services#${s.slug}`,
          adminEditUrl: `/admin/services?edit=${s.id}`,
          isPublished: s.isPublished,
          createdAt: s.createdAt,
        });
      }
    }

    // 2. Project / Works Cover Images & Videos
    for (const p of projects) {
      if (p.coverImage && p.coverImage.trim() !== '') {
        unifiedList.push({
          id: `project-${p.id}`,
          type: 'IMAGE',
          url: p.coverImage,
          title: p.name,
          description: `${p.location || 'Kerala'} • ${p.projectType || 'Project'}`,
          sourceType: 'PROJECT',
          sourceId: p.id,
          sourceName: `Work: ${p.name}`,
          targetUrl: `/our-works/${p.slug}`,
          adminEditUrl: `/admin/projects?edit=${p.id}`,
          isPublished: p.isPublished,
          createdAt: p.createdAt,
        });
      }

      if (p.media && p.media.length > 0) {
        for (const m of p.media) {
          unifiedList.push({
            id: `project-media-${m.id}`,
            type: m.type,
            url: m.url,
            youtubeVideoId: m.youtubeVideoId,
            title: m.title || `${p.name} Video Showcase`,
            description: p.name,
            sourceType: 'PROJECT_MEDIA',
            sourceId: p.id,
            sourceName: `Work: ${p.name}`,
            targetUrl: `/our-works/${p.slug}`,
            adminEditUrl: `/admin/projects?edit=${p.id}`,
            isPublished: p.isPublished,
            createdAt: m.createdAt,
          });
        }
      }
    }

    // 3. Catalog Items Images & Videos
    for (const it of items) {
      if (it.media && it.media.length > 0) {
        for (const m of it.media) {
          unifiedList.push({
            id: `item-media-${m.id}`,
            type: m.type,
            url: m.url,
            youtubeVideoId: m.youtubeVideoId,
            title: m.title || it.name,
            description: `${it.service?.name ? it.service.name + ' • ' : ''}${it.shortDescription}`,
            sourceType: 'ITEM_MEDIA',
            sourceId: it.id,
            sourceName: `Item: ${it.name}`,
            targetUrl: `/services#${it.service?.slug || ''}`,
            adminEditUrl: `/admin/items?edit=${it.id}`,
            isPublished: it.isPublished,
            createdAt: m.createdAt,
          });
        }
      }
    }

    // 4. Standalone Gallery Items (if any exist)
    for (const g of galleryItems) {
      if (g.url && g.url.trim() !== '') {
        unifiedList.push({
          id: `gallery-${g.id}`,
          type: g.type,
          url: g.url,
          youtubeVideoId: g.youtubeVideoId,
          title: g.title || 'Studio Showcase',
          description: g.description,
          sourceType: 'GALLERY',
          sourceId: g.id,
          sourceName: g.title || 'Visual Gallery',
          targetUrl: `/gallery`,
          adminEditUrl: `/admin/gallery`,
          isPublished: g.isPublished,
          createdAt: g.createdAt,
        });
      }
    }

    // Deduplicate by media url so identical URLs don't show twice
    const seenUrls = new Set<string>();
    const deduplicated = unifiedList.filter((item) => {
      if (seenUrls.has(item.url)) return false;
      seenUrls.add(item.url);
      return true;
    });

    // Randomize order on public requests (or when requested)
    const result = randomize === 'false' ? deduplicated : shuffleArray(deduplicated);

    return sendSuccess(res, result);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch unified gallery', 500);
  }
};

export const createGalleryItem = async (req: Request, res: Response) => {
  try {
    const { title, description, type, url, cloudinaryPublicId, youtubeVideoId, displayOrder } = req.body;

    const item = await prisma.galleryItem.create({
      data: {
        title,
        description,
        type: type || 'IMAGE',
        url,
        cloudinaryPublicId,
        youtubeVideoId,
        displayOrder: displayOrder ? parseInt(displayOrder, 10) : 0,
      },
    });

    return sendSuccess(res, item, 'Gallery item created successfully', 201);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to create gallery item', 500);
  }
};

export const deleteGalleryItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Handle composite IDs or raw UUIDs
    if (id.startsWith('gallery-')) {
      const rawId = id.replace('gallery-', '');
      const existing = await prisma.galleryItem.findUnique({ where: { id: rawId } });
      if (existing && existing.type === 'IMAGE' && existing.url) {
        deleteCloudinaryImage(existing.url).catch(() => {});
      }
      await prisma.galleryItem.delete({ where: { id: rawId } });
    } else if (id.startsWith('project-media-')) {
      const rawId = id.replace('project-media-', '');
      const existing = await prisma.projectMedia.findUnique({ where: { id: rawId } });
      if (existing && existing.type === 'IMAGE' && existing.url) {
        deleteCloudinaryImage(existing.url).catch(() => {});
      }
      await prisma.projectMedia.delete({ where: { id: rawId } });
    } else if (id.startsWith('item-media-')) {
      const rawId = id.replace('item-media-', '');
      const existing = await prisma.itemMedia.findUnique({ where: { id: rawId } });
      if (existing && existing.type === 'IMAGE' && existing.url) {
        deleteCloudinaryImage(existing.url).catch(() => {});
      }
      await prisma.itemMedia.delete({ where: { id: rawId } });
    } else {
      // Direct deletion try
      try {
        const existing = await prisma.galleryItem.findUnique({ where: { id } });
        if (existing && existing.type === 'IMAGE' && existing.url) {
          deleteCloudinaryImage(existing.url).catch(() => {});
        }
        await prisma.galleryItem.delete({ where: { id } });
      } catch {
        // ignore
      }
    }

    return sendSuccess(res, null, 'Gallery item removed successfully');
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to delete gallery item', 500);
  }
};
