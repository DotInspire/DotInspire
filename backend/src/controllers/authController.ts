import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/db';
import { config } from '../config/env';
import { loginSchema } from '../validators/schemas';
import { sendSuccess, sendError } from '../utils/response';
import { AuthRequest } from '../middlewares/auth';

export const login = async (req: Request, res: Response) => {
  try {
    const validated = loginSchema.parse(req.body);

    const user = await prisma.adminUser.findUnique({
      where: { email: validated.email },
    });

    if (!user || !user.isActive) {
      return sendError(res, 'Invalid credentials or inactive account', 401);
    }

    const isMatch = await bcrypt.compare(validated.password, user.passwordHash);
    if (!isMatch) {
      return sendError(res, 'Invalid credentials', 401);
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    const isProduction = config.env === 'production';

    res.cookie('token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return sendSuccess(res, {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    }, 'Login successful');
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return sendError(res, 'Validation failed', 400, error.errors);
    }
    return sendError(res, error.message || 'Login failed', 500);
  }
};

export const logout = async (req: Request, res: Response) => {
  const isProduction = config.env === 'production';
  res.clearCookie('token', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
  });
  return sendSuccess(res, null, 'Logged out successfully');
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return sendError(res, 'Unauthorized', 401);
    }

    const user = await prisma.adminUser.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    if (!user) {
      return sendError(res, 'User not found', 444);
    }

    return sendSuccess(res, user);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch user profile', 500);
  }
};
