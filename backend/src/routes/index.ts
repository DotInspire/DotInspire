import { Router } from 'express';
import { login, logout, getMe } from '../controllers/authController';
import { getServices, getServiceBySlug, createService, updateService, deleteService } from '../controllers/serviceController';
import { getItems, getItemBySlug, createItem, updateItem, deleteItem } from '../controllers/itemController';
import { getProjects, getProjectBySlug, createProject, updateProject, deleteProject } from '../controllers/projectController';
import { addImageMedia, addYouTubeMedia, deleteMedia } from '../controllers/mediaController';
import { getGallery, createGalleryItem, deleteGalleryItem } from '../controllers/galleryController';
import { uploadMiddleware, uploadImage, uploadMultipleImages } from '../controllers/uploadController';
import { createInquiry, getInquiries, updateInquiryStatus, deleteInquiry } from '../controllers/inquiryController';
import { getSettings, updateSettings } from '../controllers/settingsController';
import { chatWithAI } from '../controllers/chatController';
import { authenticateJwt } from '../middlewares/auth';

const router = Router();

// Public AI Chatbot Route
router.post('/chat', chatWithAI);

// Auth Routes
router.post('/auth/login', login);
router.post('/auth/logout', logout);
router.get('/auth/me', authenticateJwt, getMe);

// Upload Routes (Cloudinary)
router.post('/upload/image', authenticateJwt, uploadMiddleware.single('image'), uploadImage);
router.post('/upload/images', authenticateJwt, uploadMiddleware.array('images', 20), uploadMultipleImages);

// Services Routes
router.get('/services', getServices);
router.get('/services/:slug', getServiceBySlug);
router.post('/services', authenticateJwt, createService);
router.patch('/services/:id', authenticateJwt, updateService);
router.delete('/services/:id', authenticateJwt, deleteService);

// Items Routes
router.get('/items', getItems);
router.get('/items/:slug', getItemBySlug);
router.post('/items', authenticateJwt, createItem);
router.patch('/items/:id', authenticateJwt, updateItem);
router.delete('/items/:id', authenticateJwt, deleteItem);

// Projects Routes
router.get('/projects', getProjects);
router.get('/projects/:slug', getProjectBySlug);
router.post('/projects', authenticateJwt, createProject);
router.patch('/projects/:id', authenticateJwt, updateProject);
router.delete('/projects/:id', authenticateJwt, deleteProject);

// Media Routes
router.post('/media/image', authenticateJwt, addImageMedia);
router.post('/media/youtube', authenticateJwt, addYouTubeMedia);
router.delete('/media/:id', authenticateJwt, deleteMedia);

// Gallery Routes
router.get('/gallery', getGallery);
router.post('/gallery', authenticateJwt, createGalleryItem);
router.delete('/gallery/:id', authenticateJwt, deleteGalleryItem);

// Inquiry Routes
router.post('/inquiries', createInquiry);
router.get('/inquiries', authenticateJwt, getInquiries);
router.patch('/inquiries/:id', authenticateJwt, updateInquiryStatus);
router.delete('/inquiries/:id', authenticateJwt, deleteInquiry);

// Settings Routes
router.get('/settings', getSettings);
router.patch('/settings', authenticateJwt, updateSettings);

export default router;
