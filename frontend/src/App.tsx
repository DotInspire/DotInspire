import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { PublicLayout } from './layouts/PublicLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { AboutPage } from './pages/public/AboutPage';
import { ServicesPage } from './pages/public/ServicesPage';
import { ServiceDetailPage } from './pages/public/ServiceDetailPage';
import { ItemDetailPage } from './pages/public/ItemDetailPage';
import { OurWorksPage } from './pages/public/OurWorksPage';
import { ProjectDetailPage } from './pages/public/ProjectDetailPage';
import { GalleryPage } from './pages/public/GalleryPage';
import { ContactPage } from './pages/public/ContactPage';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminServicesPage } from './pages/admin/AdminServicesPage';
import { AdminItemsPage } from './pages/admin/AdminItemsPage';
import { AdminProjectsPage } from './pages/admin/AdminProjectsPage';
import { AdminGalleryPage } from './pages/admin/AdminGalleryPage';
import { AdminInquiriesPage } from './pages/admin/AdminInquiriesPage';

export const App: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="services/:slug" element={<ServiceDetailPage />} />
        <Route path="items/:slug" element={<ItemDetailPage />} />
        <Route path="our-works" element={<OurWorksPage />} />
        <Route path="our-works/:slug" element={<ProjectDetailPage />} />
        <Route path="gallery" element={<GalleryPage />} />
        <Route path="contact" element={<ContactPage />} />
      </Route>

      {/* Admin Portal Authentication */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* Protected Admin Portal */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="services" element={<AdminServicesPage />} />
        <Route path="items" element={<AdminItemsPage />} />
        <Route path="projects" element={<AdminProjectsPage />} />
        <Route path="gallery" element={<AdminGalleryPage />} />
        <Route path="inquiries" element={<AdminInquiriesPage />} />
      </Route>

      {/* Fallback Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
