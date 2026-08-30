import { Request, Response } from 'express';
import { prisma } from '../config/db';
import { projectSchema } from '../validators/schemas';
import { sendSuccess, sendError } from '../utils/response';
import { slugify, extractYouTubeId } from '../utils/helpers';
import { deleteCloudinaryImage, deleteMultipleCloudinaryImages } from '../utils/cloudinaryCleanup';

export const getProjects = async (req: Request, res: Response) => {
  try {
    const { includeUnpublished, featured } = req.query;

    let whereCondition: any = {};

    if (includeUnpublished !== 'true') {
      whereCondition.isPublished = true;
    }

    if (featured === 'true') {
      whereCondition.isFeatured = true;
    }

    const projects = await prisma.project.findMany({
      where: whereCondition,
      orderBy: { displayOrder: 'asc' },
      include: {
        media: { orderBy: { displayOrder: 'asc' } },
      },
    });

    return sendSuccess(res, projects);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch projects', 500);
  }
};

export const getProjectBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const project = await prisma.project.findUnique({
      where: { slug },
      include: {
        media: { orderBy: { displayOrder: 'asc' } },
      },
    });

    if (!project) {
      return sendError(res, 'Project not found', 404);
    }

    return sendSuccess(res, project);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch project', 500);
  }
};

export const createProject = async (req: Request, res: Response) => {
  try {
    const validated = projectSchema.parse(req.body);
    const { images, youtubeUrls, youtubeUrl, ...projectData } = validated;
    const slug = slugify(projectData.name);

    const allVideos = Array.from(new Set([
      ...(youtubeUrls || []),
      ...(youtubeUrl ? [youtubeUrl] : []),
    ])).filter(Boolean);

    const mediaToCreate: any[] = [];

    (images || []).forEach((imgUrl, idx) => {
      mediaToCreate.push({
        type: 'IMAGE' as const,
        url: imgUrl,
        title: `${projectData.name} Photo ${idx + 1}`,
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
          title: `${projectData.name} Video Tour ${idx + 1}`,
          displayOrder: 100 + idx,
        });
      }
    });

    const cover = projectData.coverImage || (images && images.length > 0 ? images[0] : null);

    const project = await prisma.project.create({
      data: {
        ...projectData,
        coverImage: cover,
        slug,
        media: {
          create: mediaToCreate,
        },
      },
      include: { media: true },
    });

    return sendSuccess(res, project, 'Project created successfully', 201);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return sendError(res, 'Validation error', 400, error.errors);
    }
    return sendError(res, error.message || 'Failed to create project', 500);
  }
};

export const updateProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validated = projectSchema.partial().parse(req.body);
    const { images, youtubeUrls, youtubeUrl, ...projectData } = validated;

    let slugData = {};
    if (projectData.name) {
      slugData = { slug: slugify(projectData.name) };
    }

    if (images && Array.isArray(images)) {
      // Find previous images that are no longer in the updated images array
      const existingMedia = await prisma.projectMedia.findMany({
        where: { projectId: id, type: 'IMAGE' },
        select: { url: true },
      });

      const removedImages = existingMedia
        .map((m) => m.url)
        .filter((url) => !images.includes(url));

      if (removedImages.length > 0) {
        deleteMultipleCloudinaryImages(removedImages).catch(() => {});
      }

      await prisma.projectMedia.deleteMany({
        where: { projectId: id, type: 'IMAGE' },
      });

      if (images.length > 0) {
        await prisma.projectMedia.createMany({
          data: images.map((imgUrl, idx) => ({
            projectId: id,
            type: 'IMAGE',
            url: imgUrl,
            title: `Project Photo ${idx + 1}`,
            displayOrder: idx,
          })),
        });
      }
    }

    // Also check if coverImage was replaced
    if (projectData.coverImage) {
      const existingProj = await prisma.project.findUnique({ where: { id }, select: { coverImage: true } });
      if (existingProj?.coverImage && existingProj.coverImage !== projectData.coverImage) {
        // If not in new images list, delete it
        if (!images || !images.includes(existingProj.coverImage)) {
          deleteCloudinaryImage(existingProj.coverImage).catch(() => {});
        }
      }
    }

    if (youtubeUrls && Array.isArray(youtubeUrls)) {
      await prisma.projectMedia.deleteMany({
        where: { projectId: id, type: 'YOUTUBE' },
      });

      for (let idx = 0; idx < youtubeUrls.length; idx++) {
        const vidUrl = youtubeUrls[idx];
        const videoId = extractYouTubeId(vidUrl);
        if (videoId) {
          await prisma.projectMedia.create({
            data: {
              projectId: id,
              type: 'YOUTUBE',
              url: `https://www.youtube.com/embed/${videoId}`,
              youtubeVideoId: videoId,
              title: `Project Video Tour ${idx + 1}`,
              displayOrder: 100 + idx,
            },
          });
        }
      }
    }

    const project = await prisma.project.update({
      where: { id },
      data: {
        ...projectData,
        ...slugData,
      },
      include: { media: true },
    });

    return sendSuccess(res, project, 'Project updated successfully');
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return sendError(res, 'Validation error', 400, error.errors);
    }
    return sendError(res, error.message || 'Failed to update project', 500);
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Fetch existing project media and coverImage before deletion
    const existing = await prisma.project.findUnique({
      where: { id },
      include: { media: true },
    });

    if (existing) {
      const urlsToDelete: string[] = [];
      if (existing.coverImage) urlsToDelete.push(existing.coverImage);
      
      existing.media.forEach((m) => {
        if (m.type === 'IMAGE' && m.url) urlsToDelete.push(m.url);
      });

      if (urlsToDelete.length > 0) {
        deleteMultipleCloudinaryImages(urlsToDelete).catch(() => {});
      }
    }

    await prisma.project.delete({ where: { id } });
    return sendSuccess(res, null, 'Project deleted successfully');
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to delete project', 500);
  }
};
