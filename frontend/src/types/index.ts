export interface WebsiteSettings {
  id: string;
  businessName: string;
  legalName: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  googleMapsUrl?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  youtubeUrl?: string;
  footerText?: string;
  defaultSeoTitle?: string;
  defaultSeoDescription?: string;
}

export interface Service {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  coverImage?: string;
  displayOrder: number;
  isPublished: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: { items: number };
  items?: Item[];
}

export interface ItemMedia {
  id: string;
  type: 'IMAGE' | 'YOUTUBE';
  url: string;
  cloudinaryPublicId?: string;
  youtubeVideoId?: string;
  title?: string;
  displayOrder: number;
}

export interface Item {
  id: string;
  serviceId: string;
  service?: { id: string; name: string; slug: string };
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  category?: string;
  material?: string;
  specifications?: string;
  isPublished: boolean;
  isFeatured: boolean;
  displayOrder: number;
  createdAt: string;
  media?: ItemMedia[];
}

export interface ProjectMedia {
  id: string;
  type: 'IMAGE' | 'YOUTUBE';
  url: string;
  cloudinaryPublicId?: string;
  youtubeVideoId?: string;
  title?: string;
  displayOrder: number;
}

export interface Project {
  id: string;
  name: string;
  slug: string;
  location?: string;
  projectType?: string;
  description: string;
  coverImage?: string;
  servicesInvolved?: string;
  isPublished: boolean;
  isFeatured: boolean;
  displayOrder: number;
  createdAt: string;
  media?: ProjectMedia[];
}

export interface GalleryItem {
  id: string;
  title?: string;
  description?: string;
  type: 'IMAGE' | 'YOUTUBE';
  url: string;
  cloudinaryPublicId?: string;
  youtubeVideoId?: string;
  sourceType?: 'SERVICE' | 'PROJECT' | 'ITEM' | 'PROJECT_MEDIA' | 'ITEM_MEDIA' | 'GALLERY';
  sourceId?: string;
  sourceName?: string;
  targetUrl?: string;
  adminEditUrl?: string;
  displayOrder?: number;
  isPublished?: boolean;
  createdAt: string;
}

export interface Inquiry {
  id: string;
  name: string;
  phone: string;
  email?: string;
  serviceId?: string;
  service?: { id: string; name: string };
  message: string;
  status: 'UNREAD' | 'READ' | 'CONTACTED';
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}
