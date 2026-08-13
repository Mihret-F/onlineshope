import React from 'react';
import { Send, ShoppingBag, PhoneCall, ArrowRight, Award, HeartHandshake, CheckCircle2 } from 'lucide-react';
import { SiteSettings, Category, Product, ServiceItem } from '../types';
import { ProductCard } from '../components/ProductCard';

interface HomeProps {
  settings: SiteSettings;
  categories: Category[];
  featuredProducts: Product[];
  services: ServiceItem[];
  onNavigate: (path: string) => void;
  onRequestInquiry: (product?: Product) => void;
  onViewProductDetails: (product: Product) => void;
}

export const Home: React.FC<HomeProps> = ({
  settings,
  categories,
  featuredProducts,
  services,
  onNavigate,
  onRequestInquiry,
  onViewProductDetails
}) => {
  return (
    <div className="space-y-16 pb-16 font-sans text-slate-800">
      
      {/* 1. HERO SECTION */}
      <section className="bg-slate-900 text-white py-16 lg:py-24 border-b border-slate-800 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-block bg-teal-900/80 border border-teal-700/60 px-3 py-1 rounded-sm text-[10px] font-bold text-teal-300 uppercase tracking-widest">
                Official E-Commerce Catalog
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white uppercase">
                {settings.heroHeadline}
              </h1>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto lg:mx-0">
                {settings.heroSubheadline}
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <button
                  onClick={() => onNavigate('/products')}
                  className="flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-3 rounded-sm text-xs uppercase tracking-wider transition-all"
                >
                  <ShoppingBag className="w-4 h-4 text-teal-100" />
                  <span>Explore Products</span>
                </button>

                <button
                  onClick={() => onRequestInquiry()}
                  className="flex items-center justify-center gap-2 bg-white text-slate-900 hover:bg-slate-100 font-bold px-6 py-3 rounded-sm text-xs uppercase tracking-wider transition-all"
                >
                  <Send className="w-4 h-4 text-teal-700" />
                  <span>Request Inquiry</span>
                </button>

                <button
                  onClick={() => onNavigate('/contact')}
                  className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-5 py-3 rounded-sm text-xs border border-slate-700 uppercase tracking-wider transition-colors"
                >
                  <PhoneCall className="w-4 h-4 text-teal-400" />
                  <span>Contact</span>
                </button>
              </div>

              {/* Contact Quick Badge */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400 border-t border-slate-800">
                <p className="uppercase tracking-wider text-[11px]">
                  <strong className="text-slate-200">Location:</strong> {settings.location}
                </p>
                <p className="uppercase tracking-wider text-[11px]">
                  <strong className="text-slate-200">Phone:</strong> {settings.phone}
                </p>
              </div>
            </div>

            {/* Right Hero Visual Banner */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="aspect-[4/3] rounded-sm overflow-hidden border border-slate-700 bg-slate-800 relative group">
                  <img
                    src={settings.heroBannerImage}
                    alt="Mercy Shopes Products Showcase"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  
                  <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 p-3 rounded-sm border border-slate-800 text-xs space-y-1">
                    <p className="font-bold text-white uppercase tracking-wider text-xs">Mercy Shopes</p>
                    <p className="text-teal-400 font-semibold text-[10px] uppercase tracking-widest">Materials • Cosmetics • Household</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. BUSINESS HIGHLIGHTS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-slate-200 rounded-sm p-6 sm:p-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
            
            <div className="space-y-1 p-2">
              <div className="w-8 h-8 bg-teal-50 text-teal-600 rounded-sm flex items-center justify-center mx-auto mb-2">
                <Award className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">Quality Assured</h3>
              <p className="text-[10px] text-slate-500 uppercase tracking-wide">Verified Sourcing</p>
            </div>

            <div className="space-y-1 p-2">
              <div className="w-8 h-8 bg-teal-50 text-teal-600 rounded-sm flex items-center justify-center mx-auto mb-2">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">Multi Category</h3>
              <p className="text-[10px] text-slate-500 uppercase tracking-wide">Materials & Beauty</p>
            </div>

            <div className="space-y-1 p-2">
              <div className="w-8 h-8 bg-teal-50 text-teal-600 rounded-sm flex items-center justify-center mx-auto mb-2">
                <PhoneCall className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">Direct Support</h3>
              <p className="text-[10px] text-slate-500 uppercase tracking-wide">Fast Guidance</p>
            </div>

            <div className="space-y-1 p-2">
              <div className="w-8 h-8 bg-teal-50 text-teal-600 rounded-sm flex items-center justify-center mx-auto mb-2">
                <Send className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">Fast Inquiry</h3>
              <p className="text-[10px] text-slate-500 uppercase tracking-wide">Telegram Sync</p>
            </div>

            <div className="space-y-1 p-2 col-span-2 md:col-span-1">
              <div className="w-8 h-8 bg-teal-50 text-teal-600 rounded-sm flex items-center justify-center mx-auto mb-2">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">Trusted Store</h3>
              <p className="text-[10px] text-slate-500 uppercase tracking-wide">Maxico Shabele</p>
            </div>

          </div>
        </div>
      </section>

      {/* 3. PRODUCT CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-slate-100 pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-teal-600">
              01 / Collections
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1 uppercase tracking-tight">
              Product Categories
            </h2>
          </div>
          <button
            onClick={() => onNavigate('/products')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-600 hover:text-teal-700 uppercase tracking-wider transition-colors"
          >
            <span>All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map(cat => (
            <div
              key={cat.id}
              onClick={() => onNavigate(`/products?category=${cat.id}`)}
              className="group relative rounded-sm overflow-hidden aspect-[4/3] cursor-pointer border border-slate-200"
            >
              <img
                src={cat.image || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80'}
                alt={cat.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />
              
              <div className="absolute bottom-5 left-5 right-5 text-white space-y-1">
                <h3 className="text-lg font-bold text-white group-hover:text-teal-400 transition-colors uppercase tracking-wide">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-300 line-clamp-2">
                  {cat.description}
                </p>
                <div className="pt-2 flex items-center gap-1 text-[11px] font-bold text-teal-400 uppercase tracking-wider">
                  <span>Explore Category</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. FEATURED PRODUCTS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-slate-100 pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-teal-600">
              02 / Featured
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1 uppercase tracking-tight">
              Featured Merchandise
            </h2>
          </div>
          <button
            onClick={() => onNavigate('/products')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-600 hover:text-teal-700 uppercase tracking-wider transition-colors"
          >
            <span>Complete Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.slice(0, 4).map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onViewDetails={onViewProductDetails}
              onRequestInquiry={onRequestInquiry}
            />
          ))}
        </div>
      </section>

      {/* 5. SERVICES OVERVIEW */}
      <section className="bg-slate-50 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-teal-600">
              03 / Services
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 uppercase tracking-tight">
              Our Value Added Services
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm">
              Mercy Shopes provides comprehensive product sourcing, bulk ordering, and direct inquiry support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.slice(0, 3).map(srv => (
              <div key={srv.id} className="bg-white p-6 rounded-sm border border-slate-200 space-y-3">
                <div className="w-8 h-8 rounded-sm bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900 uppercase tracking-wide">{srv.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{srv.shortDescription}</p>
                <button
                  onClick={() => onNavigate('/services')}
                  className="inline-flex items-center gap-1 text-xs font-bold text-teal-600 hover:text-teal-700 pt-1 uppercase tracking-wider"
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION / INQUIRY BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-sm p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 border border-slate-800">
          <div className="space-y-3 max-w-2xl text-center md:text-left">
            <span className="bg-teal-900 text-teal-300 text-[10px] font-bold px-2.5 py-1 rounded-sm uppercase tracking-widest">
              Direct Inquiries
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              Send Your Product Requirement to Mercy Shopes
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Fill out our simple inquiry form. Our team will verify availability and respond via Telegram or Phone immediately.
            </p>
          </div>

          <div className="shrink-0">
            <button
              onClick={() => onRequestInquiry()}
              className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-8 py-3.5 rounded-sm text-xs uppercase tracking-wider transition-all"
            >
              <Send className="w-4 h-4 text-teal-100" />
              <span>Send Inquiry</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
