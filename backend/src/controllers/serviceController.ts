import { Request, Response } from 'express';
import { prisma } from '../config/db';
import { serviceSchema } from '../validators/schemas';
import { sendSuccess, sendError } from '../utils/response';
import { slugify } from '../utils/helpers';
import { deleteCloudinaryImage, deleteMultipleCloudinaryImages } from '../utils/cloudinaryCleanup';

export const getServices = async (req: Request, res: Response) => {
  try {
    const { includeUnpublished } = req.query;

    const whereCondition = includeUnpublished === 'true' ? {} : { isPublished: true };

    const services = await prisma.service.findMany({
      where: whereCondition,
      orderBy: { displayOrder: 'asc' },
      include: {
        _count: {
          select: { items: true },
        },
      },
    });

    return sendSuccess(res, services);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch services', 500);
  }
};

export const getServiceBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const service = await prisma.service.findUnique({
      where: { slug },
      include: {
        items: {
          where: { isPublished: true },
          orderBy: { displayOrder: 'asc' },
          include: { media: { orderBy: { displayOrder: 'asc' } } },
        },
      },
    });

    if (!service) {
      return sendError(res, 'Service not found', 404);
    }

    return sendSuccess(res, service);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch service', 500);
  }
};

export const createService = async (req: Request, res: Response) => {
  try {
    const validated = serviceSchema.parse(req.body);
    const slug = slugify(validated.name);

    const existing = await prisma.service.findUnique({ where: { slug } });
    if (existing) {
      return sendError(res, 'A service with this name/slug already exists', 400);
    }

    const service = await prisma.service.create({
      data: {
        ...validated,
        slug,
      },
    });

    return sendSuccess(res, service, 'Service created successfully', 201);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return sendError(res, 'Validation error', 400, error.errors);
    }
    return sendError(res, error.message || 'Failed to create service', 500);
  }
};

export const updateService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validated = serviceSchema.partial().parse(req.body);

    let slugData = {};
    if (validated.name) {
      slugData = { slug: slugify(validated.name) };
    }

    // If coverImage changed, delete the previous image from Cloudinary
    if (validated.coverImage) {
      const existing = await prisma.service.findUnique({ where: { id }, select: { coverImage: true } });
      if (existing?.coverImage && existing.coverImage !== validated.coverImage) {
        deleteCloudinaryImage(existing.coverImage).catch(() => {});
      }
    }

    const service = await prisma.service.update({
      where: { id },
      data: {
        ...validated,
        ...slugData,
      },
    });

    return sendSuccess(res, service, 'Service updated successfully');
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return sendError(res, 'Validation error', 400, error.errors);
    }
    return sendError(res, error.message || 'Failed to update service', 500);
  }
};

export const deleteService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Fetch existing service and its items' media before deletion
    const existing = await prisma.service.findUnique({
      where: { id },
      include: {
        items: {
          include: { media: true },
        },
      },
    });

    if (existing) {
      const urlsToDelete: string[] = [];
      if (existing.coverImage) urlsToDelete.push(existing.coverImage);
      
      existing.items.forEach((item) => {
        item.media.forEach((m) => {
          if (m.type === 'IMAGE' && m.url) urlsToDelete.push(m.url);
        });
      });

      // Clear from Cloudinary asynchronously
      if (urlsToDelete.length > 0) {
        deleteMultipleCloudinaryImages(urlsToDelete).catch(() => {});
      }
    }

    await prisma.service.delete({ where: { id } });

    return sendSuccess(res, null, 'Service deleted successfully');
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to delete service', 500);
  }
};
