import React from 'react';
import { Phone, Mail, MapPin, Send, ShieldCheck, ArrowRight } from 'lucide-react';
import { SiteSettings } from '../types';

interface FooterProps {
  settings: SiteSettings;
  onNavigate: (path: string) => void;
  onRequestInquiry: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onNavigate = (_path: string) => {},
  onRequestInquiry = () => {}
}) => {
  const handleLink = (path: string) => {
    onNavigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand & Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={settings.logo || '/logo.png'}
                alt={settings.companyName}
                className="w-12 h-12 object-contain rounded-full border-2 border-amber-400 bg-white p-0.5 shadow-md shrink-0"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/logo.png';
                }}
              />
              <div className="flex flex-col">
                <span className="text-xl font-black text-white tracking-tight uppercase leading-none">
                  {settings.companyName}
                </span>
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest mt-1">
                  Quality Products
                </span>
              </div>
            </div>
            
            <p className="text-slate-400 text-xs leading-relaxed">
              Quality materials, cosmetics, and selected merchandise for individual, commercial, and enterprise clients.
            </p>

            <div className="pt-2">
              <button
                onClick={onRequestInquiry}
                className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-4 py-2 rounded-sm transition-colors uppercase tracking-wider"
              >
                <Send className="w-3.5 h-3.5 text-teal-100" />
                <span>Send Inquiry</span>
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-xs font-bold uppercase tracking-widest mb-4 border-l-2 border-teal-500 pl-2">
              Quick Links
            </h3>
            <ul className="space-y-2 text-xs">
              {[
                { label: 'Home', path: '/' },
                { label: 'About', path: '/about' },
                { label: 'Products', path: '/products' },
                { label: 'Services', path: '/services' },
                { label: 'Gallery', path: '/gallery' },
                { label: 'Projects', path: '/projects' },
                { label: 'Contact', path: '/contact' }
              ].map(link => (
                <li key={link.path}>
                  <button
                    onClick={() => handleLink(link.path)}
                    className="hover:text-teal-400 text-slate-400 transition-colors flex items-center gap-1.5"
                  >
                    <ArrowRight className="w-3 h-3 text-teal-500" />
                    <span>{link.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Products Categories */}
          <div>
            <h3 className="text-white text-xs font-bold uppercase tracking-widest mb-4 border-l-2 border-teal-500 pl-2">
              Categories
            </h3>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => handleLink('/products?category=cat-materials')} className="hover:text-teal-400 transition-colors">
                  Materials & Building Supplies
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('/products?category=cat-cosmetics')} className="hover:text-teal-400 transition-colors">
                  Cosmetics & Skincare
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('/products?category=cat-cosmetics')} className="hover:text-teal-400 transition-colors">
                  Personal Care & Hair Therapy
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('/products?category=cat-other')} className="hover:text-teal-400 transition-colors">
                  Household Products
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('/products?category=cat-other')} className="hover:text-teal-400 transition-colors">
                  Other Selected Merchandise
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-white text-xs font-bold uppercase tracking-widest mb-4 border-l-2 border-teal-500 pl-2">
              Contact Us
            </h3>
            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2.5">
                <Phone className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[10px] text-slate-500 uppercase tracking-wider">Phone:</span>
                  <a href={`tel:${settings.phone.replace(/\s+/g, '')}`} className="font-semibold hover:text-white transition-colors">
                    {settings.phone}
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-2.5">
                <Mail className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[10px] text-slate-500 uppercase tracking-wider">Email:</span>
                  <a href={`mailto:${settings.email}`} className="font-semibold hover:text-white transition-colors break-all">
                    {settings.email}
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-2.5">
                <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[10px] text-slate-500 uppercase tracking-wider">Location:</span>
                  <span className="font-semibold text-slate-200">
                    {settings.location}
                  </span>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 {settings.companyName}. All Rights Reserved.</p>
          
          <div className="flex items-center gap-6">
            <button
              onClick={() => handleLink('/admin')}
              className="text-slate-400 hover:text-teal-400 font-medium transition-colors flex items-center gap-1 text-[11px] uppercase tracking-wider"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-teal-500" />
              <span>Admin Panel</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
