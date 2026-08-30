import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const serviceSchema = z.object({
  name: z.string().min(1, 'Service name is required'),
  shortDescription: z.string().default(''),
  description: z.string().default(''),
  coverImage: z.string().optional().nullable(),
  displayOrder: z.number().int().optional(),
  isPublished: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
});

export const itemSchema = z.object({
  serviceId: z.string().min(1, 'Service ID is required'),
  name: z.string().min(1, 'Item name is required'),
  shortDescription: z.string().default(''),
  description: z.string().default(''),
  category: z.string().optional().nullable(),
  material: z.string().optional().nullable(),
  specifications: z.string().optional().nullable(),
  isPublished: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  displayOrder: z.number().int().optional(),
  images: z.array(z.string()).optional(),
  youtubeUrls: z.array(z.string()).optional(),
  youtubeUrl: z.string().optional().nullable(),
});

export const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  location: z.string().optional().nullable(),
  projectType: z.string().optional().nullable(),
  description: z.string().default(''),
  coverImage: z.string().optional().nullable(),
  servicesInvolved: z.string().optional().nullable(),
  isPublished: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  displayOrder: z.number().int().optional(),
  images: z.array(z.string()).optional(),
  youtubeUrls: z.array(z.string()).optional(),
  youtubeUrl: z.string().optional().nullable(),
});

export const inquirySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().min(7, 'Valid phone number is required'),
  email: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
  serviceId: z.string().optional().nullable(),
  message: z.string().optional().default(''),
});

export const mediaYouTubeSchema = z.object({
  youtubeUrl: z.string().url('Invalid YouTube URL'),
  title: z.string().optional(),
  entityType: z.enum(['ITEM', 'PROJECT', 'GALLERY']),
  entityId: z.string().optional(),
});

export const settingsSchema = z.object({
  businessName: z.string().optional(),
  legalName: z.string().optional(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  email: z.string().email().optional(),
  address: z.string().optional(),
  googleMapsUrl: z.string().optional().nullable(),
  instagramUrl: z.string().optional().nullable(),
  facebookUrl: z.string().optional().nullable(),
  youtubeUrl: z.string().optional().nullable(),
  footerText: z.string().optional().nullable(),
  defaultSeoTitle: z.string().optional(),
  defaultSeoDescription: z.string().optional(),
});
