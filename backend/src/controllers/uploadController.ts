import { Request, Response } from 'express';
import multer from 'multer';
import { cloudinary } from '../config/cloudinary';
import { sendSuccess, sendError } from '../utils/response';

// Configure multer memory storage
const storage = multer.memoryStorage();
export const uploadMiddleware = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max image size
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed.'));
    }
  },
});

export const uploadImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return sendError(res, 'No image file provided', 400);
    }

    const result = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'dot_inspire',
          resource_type: 'image',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file!.buffer);
    });

    return sendSuccess(
      res,
      {
        url: result.secure_url,
        publicId: result.public_id,
        format: result.format,
        width: result.width,
        height: result.height,
      },
      'Image uploaded successfully to Cloudinary',
      201
    );
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to upload image', 500);
  }
};

export const uploadMultipleImages = async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return sendError(res, 'No image files provided', 400);
    }

    const uploadPromises = files.map((file) => {
      return new Promise<string>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'dot_inspire',
            resource_type: 'image',
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result!.secure_url);
          }
        );
        uploadStream.end(file.buffer);
      });
    });

    const urls = await Promise.all(uploadPromises);

    return sendSuccess(
      res,
      { urls },
      `Successfully uploaded ${urls.length} images to Cloudinary`,
      201
    );
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to upload multiple images', 500);
  }
};
