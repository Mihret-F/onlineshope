export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'superadmin' | 'admin' | 'editor';
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  categoryId: string;
  categoryName?: string;
  brand: string;
  description: string;
  shortDescription: string;
  price: number;
  discountPrice?: number;
  stock: number;
  availability: 'Available' | 'Out of Stock' | 'Pre-order' | 'On Request';
  featured: boolean;
  isNew: boolean;
  images: string[];
  specifications: Record<string, string>;
  sizes?: string[];
  colors?: string[];
  tags?: string[];
  badge?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Inquiry {
  id: string;
  inquiryNumber: string;
  customerName: string;
  phone: string;
  telegramUsername?: string;
  email: string;
  location?: string;
  productId?: string;
  productName?: string;
  productCategory?: string;
  quantity: number;
  message: string;
  preferredContact?: string;
  additionalRequirements?: string;
  attachment?: string;
  status: 'New' | 'Contacted' | 'Processing' | 'Completed' | 'Cancelled';
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  fullName: string;
  phone: string;
  telegramUsername?: string;
  email: string;
  location?: string;
  totalInquiries: number;
  lastInquiryDate: string;
  createdAt: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  image: string;
  category: 'Products' | 'Store' | 'Events' | 'Customers' | 'Behind the Scenes' | 'Other';
  status: 'published' | 'draft';
  createdAt: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  category: 'Supply Projects' | 'Business Projects' | 'Customer Projects' | 'Events' | 'Other';
  images: string[];
  status: 'Completed' | 'In Progress' | 'Planned';
  createdAt: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  iconName: string;
  features: string[];
  status: 'active' | 'inactive';
}

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  createdAt: string;
}

export interface SiteSettings {
  companyName: string;
  logo: string;
  phone: string;
  email: string;
  location: string;
  mapUrl: string;
  aboutStory: string;
  mission: string;
  vision: string;
  values: Array<{ title: string; description: string; icon: string }>;
  socialLinks: {
    telegram?: string;
    whatsapp?: string;
    facebook?: string;
    instagram?: string;
    tiktok?: string;
  };
  telegramBotToken?: string;
  telegramChatId?: string;
  businessHours: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroBannerImage: string;
}

export interface DashboardStats {
  totalProducts: number;
  activeProducts: number;
  outOfStockProducts: number;
  totalCategories: number;
  totalInquiries: number;
  newInquiries: number;
  pendingInquiries: number;
  completedInquiries: number;
  inquiriesOverTime: { date: string; count: number }[];
  productsByCategory: { category: string; count: number }[];
  mostRequestedProducts: { name: string; inquiriesCount: number }[];
}
