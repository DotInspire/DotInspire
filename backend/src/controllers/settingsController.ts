import { Request, Response } from 'express';
import { prisma } from '../config/db';
import { settingsSchema } from '../validators/schemas';
import { sendSuccess, sendError } from '../utils/response';

export const getSettings = async (req: Request, res: Response) => {
  try {
    let settings = await prisma.websiteSettings.findUnique({
      where: { id: 'default' },
    });

    if (!settings) {
      settings = await prisma.websiteSettings.create({
        data: { id: 'default' },
      });
    }

    return sendSuccess(res, settings);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch settings', 500);
  }
};

export const updateSettings = async (req: Request, res: Response) => {
  try {
    const validated = settingsSchema.parse(req.body);

    const settings = await prisma.websiteSettings.upsert({
      where: { id: 'default' },
      update: validated,
      create: {
        id: 'default',
        ...validated,
      },
    });

    return sendSuccess(res, settings, 'Website settings updated successfully');
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return sendError(res, 'Validation error', 400, error.errors);
    }
    return sendError(res, error.message || 'Failed to update settings', 500);
  }
};
