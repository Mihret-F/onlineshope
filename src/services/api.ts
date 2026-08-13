import {
  AdminUser,
  Category,
  Product,
  Inquiry,
  Customer,
  GalleryItem,
  ProjectItem,
  ServiceItem,
  ContactMessage,
  SiteSettings,
  DashboardStats
} from '../types';

const API_BASE = '/api';

export function getAuthToken(): string | null {
  return localStorage.getItem('mercy_admin_token');
}

export function setAuthToken(token: string): void {
  localStorage.setItem('mercy_admin_token', token);
}

export function removeAuthToken(): void {
  localStorage.removeItem('mercy_admin_token');
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `HTTP error! status: ${response.status}`);
  }

  return data as T;
}

export const api = {
  // Auth
  login: (email: string, pass: string) =>
    request<{ token: string; user: AdminUser }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password: pass })
    }),

  getMe: () => request<{ user: AdminUser }>('/auth/me'),

  getAdminUsers: () => request<AdminUser[]>('/auth/users'),

  createAdminUser: (userData: { name: string; email: string; password: string; role?: string }) =>
    request<AdminUser>('/auth/users', {
      method: 'POST',
      body: JSON.stringify(userData)
    }),

  deleteAdminUser: (id: string) =>
    request<{ success: boolean }>(`/auth/users/${id}`, { method: 'DELETE' }),

  changePassword: (currentPassword: string, newPassword: string) =>
    request<{ success: boolean; message: string }>('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword })
    }),

  // Settings
  getSettings: () => request<SiteSettings>('/settings'),

  updateSettings: (settings: Partial<SiteSettings>) =>
    request<SiteSettings>('/settings', {
      method: 'PUT',
      body: JSON.stringify(settings)
    }),

  // Categories
  getCategories: () => request<Category[]>('/categories'),

  createCategory: (cat: Omit<Category, 'id' | 'createdAt'>) =>
    request<Category>('/categories', {
      method: 'POST',
      body: JSON.stringify(cat)
    }),

  updateCategory: (id: string, cat: Partial<Category>) =>
    request<Category>(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(cat)
    }),

  deleteCategory: (id: string) =>
    request<{ success: boolean }>(`/categories/${id}`, { method: 'DELETE' }),

  // Products
  getProducts: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return request<Product[]>(`/products${query}`);
  },

  getProductById: (id: string) => request<Product>(`/products/${id}`),

  createProduct: (prod: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) =>
    request<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(prod)
    }),

  updateProduct: (id: string, prod: Partial<Product>) =>
    request<Product>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(prod)
    }),

  deleteProduct: (id: string) =>
    request<{ success: boolean }>(`/products/${id}`, { method: 'DELETE' }),

  // Inquiries
  getInquiries: () => request<Inquiry[]>('/inquiries'),

  getInquiryById: (id: string) => request<Inquiry>(`/inquiries/${id}`),

  createInquiry: (inquiryData: Partial<Inquiry>) =>
    request<{ inquiry: Inquiry; telegramNotification: { success: boolean; error?: string } }>('/inquiries', {
      method: 'POST',
      body: JSON.stringify(inquiryData)
    }),

  updateInquiryStatus: (id: string, status: Inquiry['status'], adminNotes?: string) =>
    request<Inquiry>(`/inquiries/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, adminNotes })
    }),

  deleteInquiry: (id: string) =>
    request<{ success: boolean }>(`/inquiries/${id}`, { method: 'DELETE' }),

  // Customers
  getCustomers: () => request<Customer[]>('/customers'),

  // Gallery
  getGallery: () => request<GalleryItem[]>('/gallery'),

  createGalleryItem: (item: Omit<GalleryItem, 'id' | 'createdAt'>) =>
    request<GalleryItem>('/gallery', {
      method: 'POST',
      body: JSON.stringify(item)
    }),

  updateGalleryItem: (id: string, item: Partial<GalleryItem>) =>
    request<GalleryItem>(`/gallery/${id}`, {
      method: 'PUT',
      body: JSON.stringify(item)
    }),

  deleteGalleryItem: (id: string) =>
    request<{ success: boolean }>(`/gallery/${id}`, { method: 'DELETE' }),

  // Projects
  getProjects: () => request<ProjectItem[]>('/projects'),

  createProject: (proj: Omit<ProjectItem, 'id' | 'createdAt'>) =>
    request<ProjectItem>('/projects', {
      method: 'POST',
      body: JSON.stringify(proj)
    }),

  updateProject: (id: string, proj: Partial<ProjectItem>) =>
    request<ProjectItem>(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(proj)
    }),

  deleteProject: (id: string) =>
    request<{ success: boolean }>(`/projects/${id}`, { method: 'DELETE' }),

  // Services
  getServices: () => request<ServiceItem[]>('/services'),

  createService: (srv: Omit<ServiceItem, 'id'>) =>
    request<ServiceItem>('/services', {
      method: 'POST',
      body: JSON.stringify(srv)
    }),

  updateService: (id: string, srv: Partial<ServiceItem>) =>
    request<ServiceItem>(`/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(srv)
    }),

  deleteService: (id: string) =>
    request<{ success: boolean }>(`/services/${id}`, { method: 'DELETE' }),

  // Messages
  getMessages: () => request<ContactMessage[]>('/messages'),

  sendMessage: (msg: Partial<ContactMessage>) =>
    request<ContactMessage>('/messages', {
      method: 'POST',
      body: JSON.stringify(msg)
    }),

  updateMessageStatus: (id: string, status: ContactMessage['status']) =>
    request<ContactMessage>(`/messages/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    }),

  deleteMessage: (id: string) =>
    request<{ success: boolean }>(`/messages/${id}`, { method: 'DELETE' }),

  // Stats
  getStats: () => request<DashboardStats>('/stats'),

  // Telegram test
  testTelegram: (token?: string, chatId?: string) =>
    request<{ success: boolean; error?: string }>('/telegram/test', {
      method: 'POST',
      body: JSON.stringify({ token, chatId })
    }),

  // Image Upload
  uploadImage: (imageData: string, filename?: string) =>
    request<{ url: string }>('/upload', {
      method: 'POST',
      body: JSON.stringify({ image: imageData, filename })
    })
};
