import { Request, Response } from 'express';
import { prisma } from '../config/db';
import { inquirySchema } from '../validators/schemas';
import { sendSuccess, sendError } from '../utils/response';

export const createInquiry = async (req: Request, res: Response) => {
  try {
    const validated = inquirySchema.parse(req.body);

    const inquiry = await prisma.inquiry.create({
      data: {
        name: validated.name,
        phone: validated.phone,
        email: validated.email || null,
        serviceId: validated.serviceId || null,
        message: validated.message,
      },
      include: {
        service: { select: { name: true } },
      },
    });

    return sendSuccess(res, inquiry, 'Inquiry submitted successfully', 201);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      const firstError = error.errors?.[0]?.message || 'Validation failed';
      return sendError(res, firstError, 400, error.errors);
    }
    return sendError(res, error.message || 'Failed to submit inquiry', 500);
  }
};

export const getInquiries = async (req: Request, res: Response) => {
  try {
    const inquiries = await prisma.inquiry.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        service: { select: { id: true, name: true } },
      },
    });

    return sendSuccess(res, inquiries);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch inquiries', 500);
  }
};

export const updateInquiryStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['UNREAD', 'READ', 'CONTACTED'].includes(status)) {
      return sendError(res, 'Invalid status value', 400);
    }

    const inquiry = await prisma.inquiry.update({
      where: { id },
      data: { status },
    });

    return sendSuccess(res, inquiry, 'Inquiry status updated successfully');
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to update inquiry', 500);
  }
};

export const deleteInquiry = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.inquiry.delete({ where: { id } });
    return sendSuccess(res, null, 'Inquiry deleted successfully');
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to delete inquiry', 500);
  }
};
