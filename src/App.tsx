import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { InquiryModal } from './components/InquiryModal';
import { InquirySuccessModal } from './components/InquirySuccessModal';
import { ProductDetailsModal } from './components/ProductDetailsModal';

// Pages
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Products } from './pages/Products';
import { Services } from './pages/Services';
import { Gallery } from './pages/Gallery';
import { Projects } from './pages/Projects';
import { Contact } from './pages/Contact';
import { InquiryPage } from './pages/InquiryPage';

// Admin Pages
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminCategories } from './pages/admin/AdminCategories';
import { AdminInquiries } from './pages/admin/AdminInquiries';
import { AdminSettings } from './pages/admin/AdminSettings';

// Services
import { api, getAuthToken, removeAuthToken } from './services/api';
import { SiteSettings, Category, Product, ServiceItem, GalleryItem, ProjectItem, Inquiry, AdminUser } from './types';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>('/');
  const [loading, setLoading] = useState<boolean>(true);

  // Core Data State
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);

  // Modals & Active Selections
  const [inquiryModalOpen, setInquiryModalOpen] = useState<boolean>(false);
  const [selectedProductForInquiry, setSelectedProductForInquiry] = useState<Product | null>(null);
  const [submittedInquiry, setSubmittedInquiry] = useState<Inquiry | null>(null);
  const [selectedProductForDetails, setSelectedProductForDetails] = useState<Product | null>(null);

  // Admin Auth & Tab State
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [adminTab, setAdminTab] = useState<string>('dashboard');

  useEffect(() => {
    loadAppData();
    checkAdminAuth();
  }, []);

  const loadAppData = async () => {
    try {
      setLoading(true);
      const [s, c, p, srv, g, prj] = await Promise.all([
        api.getSettings(),
        api.getCategories(),
        api.getProducts(),
        api.getServices(),
        api.getGallery(),
        api.getProjects()
      ]);
      setSettings(s);
      setCategories(c || []);
      setProducts(p || []);
      setServices(srv || []);
      setGalleryItems(g || []);
      setProjects(prj || []);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load initial site data:', err);
      setLoading(false);
    }
  };

  const checkAdminAuth = async () => {
    const token = getAuthToken();
    if (token) {
      try {
        const res = await api.getMe();
        setAdminUser(res.user);
      } catch (e) {
        removeAuthToken();
        setAdminUser(null);
      }
    }
  };

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenInquiry = (product?: Product | null) => {
    setSelectedProductForInquiry(product || null);
    setInquiryModalOpen(true);
  };

  const handleInquirySuccess = (inquiry: Inquiry) => {
    setInquiryModalOpen(false);
    setSelectedProductForInquiry(null);
    setSubmittedInquiry(inquiry);
  };

  const handleLoginSuccess = (user: AdminUser) => {
    setAdminUser(user);
    setCurrentPath('/admin');
    setAdminTab('dashboard');
  };

  const handleLogout = () => {
    removeAuthToken();
    setAdminUser(null);
    setCurrentPath('/');
  };

  if (loading || !settings) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-6 space-y-4">
        <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-bold tracking-widest uppercase text-teal-400">Loading Mercy Shopes...</p>
      </div>
    );
  }

  // --- Admin Route ---
  if (currentPath.startsWith('/admin')) {
    if (!adminUser) {
      return (
        <AdminLogin
          settings={settings}
          onLoginSuccess={handleLoginSuccess}
          onNavigateSite={handleNavigate}
        />
      );
    }

    return (
      <AdminLayout
        user={adminUser}
        settings={settings}
        activeTab={adminTab}
        setActiveTab={setAdminTab}
        onLogout={handleLogout}
        onNavigateSite={handleNavigate}
      >
        {adminTab === 'dashboard' && (
          <AdminDashboard onNavigateTab={setAdminTab} />
        )}
        {adminTab === 'products' && (
          <AdminProducts products={products} categories={categories} onRefresh={loadAppData} />
        )}
        {adminTab === 'categories' && (
          <AdminCategories onRefreshCategories={loadAppData} />
        )}
        {adminTab === 'inquiries' && (
          <AdminInquiries />
        )}
        {adminTab === 'settings' && (
          <AdminSettings settings={settings} onRefreshSettings={loadAppData} />
        )}
        {adminTab !== 'dashboard' && adminTab !== 'products' && adminTab !== 'categories' && adminTab !== 'inquiries' && adminTab !== 'settings' && (
          <div className="bg-white p-8 rounded-2xl border border-stone-200">
            <h2 className="text-lg font-bold text-stone-900 uppercase tracking-wider mb-2">
              {adminTab} Management
            </h2>
            <p className="text-xs text-stone-600 mb-6">
              Manage your store data, settings, and inquiries from this panel.
            </p>
          </div>
        )}
      </AdminLayout>
    );
  }

  // --- Public Site Routes ---
  const featuredProducts = products.filter(p => p.featured);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 selection:bg-teal-600 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        settings={settings}
        currentPath={currentPath}
        onNavigate={handleNavigate}
        onRequestInquiry={() => handleOpenInquiry(null)}
        isLoggedIn={!!adminUser}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {currentPath === '/' && (
          <Home
            settings={settings}
            categories={categories}
            featuredProducts={featuredProducts}
            services={services}
            onNavigate={handleNavigate}
            onRequestInquiry={handleOpenInquiry}
            onViewProductDetails={setSelectedProductForDetails}
          />
        )}

        {currentPath === '/about' && (
          <About
            settings={settings}
            onRequestInquiry={() => handleOpenInquiry(null)}
            onNavigate={handleNavigate}
          />
        )}

        {currentPath === '/products' && (
          <Products
            products={products}
            categories={categories}
            onViewProductDetails={setSelectedProductForDetails}
            onRequestInquiry={handleOpenInquiry}
          />
        )}

        {currentPath === '/services' && (
          <Services
            services={services}
            onRequestInquiry={() => handleOpenInquiry(null)}
            onNavigate={handleNavigate}
          />
        )}

        {currentPath === '/gallery' && (
          <Gallery
            galleryItems={galleryItems}
            onNavigate={handleNavigate}
          />
        )}

        {currentPath === '/projects' && (
          <Projects
            projects={projects}
            onRequestInquiry={() => handleOpenInquiry(null)}
            onNavigate={handleNavigate}
          />
        )}

        {currentPath === '/contact' && (
          <Contact
            settings={settings}
            onRequestInquiry={() => handleOpenInquiry(null)}
            onNavigate={handleNavigate}
          />
        )}

        {currentPath === '/inquiry' && (
          <InquiryPage
            products={products}
            onSuccess={handleInquirySuccess}
            onNavigate={handleNavigate}
          />
        )}
      </main>

      {/* Global Footer */}
      <Footer
        settings={settings}
        onNavigate={handleNavigate}
        onRequestInquiry={() => handleOpenInquiry(null)}
      />

      {/* Product Details Modal */}
      {selectedProductForDetails && (
        <ProductDetailsModal
          product={selectedProductForDetails}
          allProducts={products}
          onClose={() => setSelectedProductForDetails(null)}
          onRequestInquiry={(p) => {
            setSelectedProductForDetails(null);
            handleOpenInquiry(p);
          }}
          onSelectProduct={setSelectedProductForDetails}
        />
      )}

      {/* Customer Inquiry Modal */}
      {inquiryModalOpen && (
        <InquiryModal
          selectedProduct={selectedProductForInquiry}
          productsList={products}
          onClose={() => setInquiryModalOpen(false)}
          onSuccess={handleInquirySuccess}
        />
      )}

      {/* Success Confirmation Modal */}
      {submittedInquiry && (
        <InquirySuccessModal
          inquiry={submittedInquiry}
          onClose={() => setSubmittedInquiry(null)}
          onNavigate={handleNavigate}
        />
      )}
    </div>
  );
}
