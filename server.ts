import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { store } from './src/server/store.js';
import { sendTelegramInquiryNotification, sendTestTelegramNotification } from './src/server/telegram.js';
import { Inquiry } from './src/types.js';

export const app = express();
const PORT = 3000;

// Static Uploads Directory
const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

  // --- Simple Auth Middleware Helper ---
  const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized. Auth token missing.' });
    }
    const token = authHeader.split(' ')[1];
    // Token format: adminId:timestamp
    const [userId] = token.split(':');
    const user = store.getAdminById(userId);
    if (!user) {
      return res.status(401).json({ error: 'Invalid authentication token.' });
    }
    (req as any).user = user;
    next();
  };

  // --- Health Check ---
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', appName: 'Mercy Shopes API', time: new Date().toISOString() });
  });

  // --- File Upload Endpoint ---
  app.post('/api/upload', authMiddleware, (req, res) => {
    const { image, filename } = req.body;
    if (!image) {
      return res.status(400).json({ error: 'No image data provided.' });
    }

    try {
      // If already a URL, return it directly
      if (image.startsWith('http://') || image.startsWith('https://') || image.startsWith('/uploads/')) {
        return res.json({ url: image });
      }

      const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        return res.status(400).json({ error: 'Invalid base64 image data.' });
      }

      const mimeType = matches[1];
      const base64Data = matches[2];
      let ext = 'png';
      if (mimeType.includes('jpeg') || mimeType.includes('jpg')) ext = 'jpg';
      else if (mimeType.includes('png')) ext = 'png';
      else if (mimeType.includes('webp')) ext = 'webp';
      else if (mimeType.includes('gif')) ext = 'gif';
      else if (mimeType.includes('svg')) ext = 'svg';

      const buffer = Buffer.from(base64Data, 'base64');
      const safeName = filename
        ? `${Date.now()}-${filename.toLowerCase().replace(/[^a-z0-9.-]/g, '_')}`
        : `img-${Date.now()}.${ext}`;

      const filePath = path.join(uploadsDir, safeName);
      fs.writeFileSync(filePath, buffer);

      const publicUrl = `/uploads/${safeName}`;
      return res.json({ url: publicUrl });
    } catch (err: any) {
      console.error('Error handling file upload:', err);
      // Fallback to base64 URL directly if writing file failed
      return res.json({ url: image });
    }
  });

  // --- Auth Endpoints ---
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const admin = store.getAdminByEmail(email);
    if (!admin) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isValid = store.verifyAdminPassword(admin.id, password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = `${admin.id}:${Date.now()}`;
    res.json({ token, user: admin });
  });

  app.get('/api/auth/me', authMiddleware, (req, res) => {
    res.json({ user: (req as any).user });
  });

  app.get('/api/auth/users', authMiddleware, (req, res) => {
    res.json(store.getAdminUsers());
  });

  app.post('/api/auth/users', authMiddleware, (req, res) => {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }
    const newUser = store.addAdminUser({ name, email, role: role || 'admin' }, password);
    res.status(201).json(newUser);
  });

  app.delete('/api/auth/users/:id', authMiddleware, (req, res) => {
    const success = store.deleteAdminUser(req.params.id);
    if (!success) {
      return res.status(400).json({ error: 'Cannot delete user or last admin.' });
    }
    res.json({ success: true });
  });

  app.put('/api/auth/change-password', authMiddleware, (req, res) => {
    const user = (req as any).user;
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required.' });
    }
    const isValid = store.verifyAdminPassword(user.id, currentPassword);
    if (!isValid) {
      return res.status(400).json({ error: 'Current password is incorrect.' });
    }
    store.updateAdminPassword(user.id, newPassword);
    res.json({ success: true, message: 'Password updated successfully.' });
  });

  // --- Site Settings ---
  app.get('/api/settings', (req, res) => {
    const settings = store.getSettings();
    // Hide full telegram token from public frontend unless authenticated admin
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      const publicSettings = { ...settings };
      if (publicSettings.telegramBotToken) {
        publicSettings.telegramBotToken = publicSettings.telegramBotToken.slice(0, 5) + '***';
      }
      return res.json(publicSettings);
    }
    res.json(settings);
  });

  app.put('/api/settings', authMiddleware, (req, res) => {
    const updated = store.updateSettings(req.body);
    res.json(updated);
  });

  // --- Categories ---
  app.get('/api/categories', (req, res) => {
    res.json(store.getCategories());
  });

  app.post('/api/categories', authMiddleware, (req, res) => {
    const newCat = store.createCategory(req.body);
    res.status(201).json(newCat);
  });

  app.put('/api/categories/:id', authMiddleware, (req, res) => {
    const updated = store.updateCategory(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Category not found' });
    res.json(updated);
  });

  app.delete('/api/categories/:id', authMiddleware, (req, res) => {
    const deleted = store.deleteCategory(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Category not found' });
    res.json({ success: true });
  });

  // --- Products ---
  app.get('/api/products', (req, res) => {
    let products = store.getProducts();

    // Query filters
    const { category, search, featured, isNew, availability, minPrice, maxPrice } = req.query;

    if (category && typeof category === 'string' && category !== 'all') {
      products = products.filter(
        p => p.categoryId === category || p.categoryName?.toLowerCase() === category.toLowerCase()
      );
    }

    if (featured === 'true') {
      products = products.filter(p => p.featured);
    }

    if (isNew === 'true') {
      products = products.filter(p => p.isNew);
    }

    if (availability && typeof availability === 'string') {
      products = products.filter(p => p.availability.toLowerCase() === availability.toLowerCase());
    }

    if (search && typeof search === 'string' && search.trim()) {
      const q = search.toLowerCase().trim();
      products = products.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags?.some(t => t.toLowerCase().includes(q))
      );
    }

    if (minPrice && !isNaN(Number(minPrice))) {
      products = products.filter(p => p.price >= Number(minPrice));
    }

    if (maxPrice && !isNaN(Number(maxPrice))) {
      products = products.filter(p => p.price <= Number(maxPrice));
    }

    res.json(products);
  });

  app.get('/api/products/:id', (req, res) => {
    const product = store.getProductById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  });

  app.post('/api/products', authMiddleware, (req, res) => {
    const newProduct = store.createProduct(req.body);
    res.status(201).json(newProduct);
  });

  app.put('/api/products/:id', authMiddleware, (req, res) => {
    const updated = store.updateProduct(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Product not found' });
    res.json(updated);
  });

  app.delete('/api/products/:id', authMiddleware, (req, res) => {
    const deleted = store.deleteProduct(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Product not found' });
    res.json({ success: true });
  });

  // --- Inquiries ---
  app.get('/api/inquiries', authMiddleware, (req, res) => {
    res.json(store.getInquiries());
  });

  app.get('/api/inquiries/:id', (req, res) => {
    const inquiry = store.getInquiryById(req.params.id);
    if (!inquiry) return res.status(404).json({ error: 'Inquiry not found' });
    res.json(inquiry);
  });

  app.post('/api/inquiries', async (req, res) => {
    const { customerName, phone, email, quantity, message } = req.body;
    if (!customerName || !phone || !email || !quantity || !message) {
      return res.status(400).json({
        error: 'Required fields missing: customerName, phone, email, quantity, and message are required.'
      });
    }

    const inquiry = store.createInquiry(req.body);

    // Send Telegram Notification asynchronously
    const telegramResult = await sendTelegramInquiryNotification(inquiry);

    res.status(201).json({
      inquiry,
      telegramNotification: telegramResult
    });
  });

  app.post('/api/test-telegram', authMiddleware, async (req, res) => {
    const testInquiry: Inquiry = {
      id: 'test-inquiry',
      inquiryNumber: 'MS-TEST-001',
      customerName: 'Telegram Integration Test',
      phone: '+251 965 449 976',
      telegramUsername: '@Mercyyy_07',
      email: 'mihretfikre67@gmail.com',
      productName: 'Habesha Traditional Dress & Gold Jewelry Test Item',
      productCategory: 'Clothes & Jewelry',
      quantity: 1,
      location: 'Addis Ababa (Maxico Shabele)',
      preferredContact: 'Telegram',
      message: 'This is a test notification verifying the Mercy Shopes Telegram bot integration for administrator @Mercyyy_07.',
      status: 'New',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const telegramResult = await sendTelegramInquiryNotification(testInquiry);
    res.json(telegramResult);
  });

  app.put('/api/inquiries/:id/status', authMiddleware, (req, res) => {
    const { status, adminNotes } = req.body;
    if (!status) return res.status(400).json({ error: 'Status is required.' });
    const updated = store.updateInquiryStatus(req.params.id, status, adminNotes);
    if (!updated) return res.status(404).json({ error: 'Inquiry not found' });
    res.json(updated);
  });

  app.delete('/api/inquiries/:id', authMiddleware, (req, res) => {
    const deleted = store.deleteInquiry(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Inquiry not found' });
    res.json({ success: true });
  });

  // --- Customers ---
  app.get('/api/customers', authMiddleware, (req, res) => {
    res.json(store.getCustomers());
  });

  // --- Gallery ---
  app.get('/api/gallery', (req, res) => {
    const items = store.getGallery();
    // Filter published for public unless admin header present
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.json(items.filter(i => i.status === 'published'));
    }
    res.json(items);
  });

  app.post('/api/gallery', authMiddleware, (req, res) => {
    const newItem = store.createGalleryItem(req.body);
    res.status(201).json(newItem);
  });

  app.put('/api/gallery/:id', authMiddleware, (req, res) => {
    const updated = store.updateGalleryItem(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Gallery item not found' });
    res.json(updated);
  });

  app.delete('/api/gallery/:id', authMiddleware, (req, res) => {
    const deleted = store.deleteGalleryItem(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Gallery item not found' });
    res.json({ success: true });
  });

  // --- Projects ---
  app.get('/api/projects', (req, res) => {
    res.json(store.getProjects());
  });

  app.post('/api/projects', authMiddleware, (req, res) => {
    const newProj = store.createProject(req.body);
    res.status(201).json(newProj);
  });

  app.put('/api/projects/:id', authMiddleware, (req, res) => {
    const updated = store.updateProject(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Project not found' });
    res.json(updated);
  });

  app.delete('/api/projects/:id', authMiddleware, (req, res) => {
    const deleted = store.deleteProject(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Project not found' });
    res.json({ success: true });
  });

  // --- Services ---
  app.get('/api/services', (req, res) => {
    res.json(store.getServices());
  });

  app.post('/api/services', authMiddleware, (req, res) => {
    const newSrv = store.createService(req.body);
    res.status(201).json(newSrv);
  });

  app.put('/api/services/:id', authMiddleware, (req, res) => {
    const updated = store.updateService(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Service not found' });
    res.json(updated);
  });

  app.delete('/api/services/:id', authMiddleware, (req, res) => {
    const deleted = store.deleteService(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Service not found' });
    res.json({ success: true });
  });

  // --- Messages ---
  app.get('/api/messages', authMiddleware, (req, res) => {
    res.json(store.getMessages());
  });

  app.post('/api/messages', (req, res) => {
    const { name, phone, email, message } = req.body;
    if (!name || !phone || !email || !message) {
      return res.status(400).json({ error: 'Name, phone, email, and message are required.' });
    }
    const newMsg = store.createMessage(req.body);
    res.status(201).json(newMsg);
  });

  app.put('/api/messages/:id/status', authMiddleware, (req, res) => {
    const updated = store.updateMessageStatus(req.params.id, req.body.status);
    if (!updated) return res.status(404).json({ error: 'Message not found' });
    res.json(updated);
  });

  app.delete('/api/messages/:id', authMiddleware, (req, res) => {
    const deleted = store.deleteMessage(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Message not found' });
    res.json({ success: true });
  });

  // --- Admin Stats ---
  app.get('/api/stats', authMiddleware, (req, res) => {
    const products = store.getProducts();
    const categories = store.getCategories();
    const inquiries = store.getInquiries();

    const activeProducts = products.filter(p => p.availability === 'Available').length;
    const outOfStockProducts = products.filter(p => p.availability === 'Out of Stock').length;

    const newInquiries = inquiries.filter(i => i.status === 'New').length;
    const pendingInquiries = inquiries.filter(i => i.status === 'Contacted' || i.status === 'Processing').length;
    const completedInquiries = inquiries.filter(i => i.status === 'Completed').length;

    // Group inquiries by date
    const dateMap: Record<string, number> = {};
    inquiries.forEach(i => {
      const d = i.createdAt.split('T')[0];
      dateMap[d] = (dateMap[d] || 0) + 1;
    });

    const inquiriesOverTime = Object.keys(dateMap)
      .sort()
      .slice(-7)
      .map(date => ({ date, count: dateMap[date] }));

    // Group products by category
    const catMap: Record<string, number> = {};
    products.forEach(p => {
      const name = p.categoryName || 'General';
      catMap[name] = (catMap[name] || 0) + 1;
    });

    const productsByCategory = Object.keys(catMap).map(category => ({
      category,
      count: catMap[category]
    }));

    // Most requested products
    const prodInqMap: Record<string, number> = {};
    inquiries.forEach(i => {
      if (i.productName) {
        prodInqMap[i.productName] = (prodInqMap[i.productName] || 0) + 1;
      }
    });

    const mostRequestedProducts = Object.keys(prodInqMap)
      .map(name => ({ name, inquiriesCount: prodInqMap[name] }))
      .sort((a, b) => b.inquiriesCount - a.inquiriesCount)
      .slice(0, 5);

    res.json({
      totalProducts: products.length,
      activeProducts,
      outOfStockProducts,
      totalCategories: categories.length,
      totalInquiries: inquiries.length,
      newInquiries,
      pendingInquiries,
      completedInquiries,
      inquiriesOverTime,
      productsByCategory,
      mostRequestedProducts
    });
  });

  // --- Telegram Test Trigger ---
  app.post('/api/telegram/test', authMiddleware, async (req, res) => {
    const { token, chatId } = req.body;
    const result = await sendTestTelegramNotification(token, chatId);
    res.json(result);
  });

  // --- Vite Dev or Production Static Serving ---
  if (process.env.NODE_ENV !== 'production') {
    createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    }).then((vite) => {
      app.use(vite.middlewares);
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  if (process.env.VERCEL !== '1') {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Mercy Shopes Server running on http://localhost:${PORT}`);
    });
  }
