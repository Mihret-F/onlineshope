import React, { useState } from 'react';
import { Phone, Mail, MapPin, Menu, X, ShoppingBag, Send, User } from 'lucide-react';
import { SiteSettings } from '../types';

interface NavbarProps {
  settings: SiteSettings;
  currentPath: string;
  onNavigate: (path: string) => void;
  onRequestInquiry: () => void;
  isLoggedIn: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  currentPath = '/',
  onNavigate = (_path: string) => {},
  onRequestInquiry = () => {},
  isLoggedIn = false
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Products', path: '/products' },
    { label: 'Services', path: '/services' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'Projects', path: '/projects' },
    { label: 'Contact', path: '/contact' }
  ];

  const handleNavClick = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-100 font-sans text-slate-800">
      {/* Top Bar for Contact & Business Info */}
      <div className="bg-slate-900 text-slate-300 py-2 px-4 sm:px-8 text-xs font-medium border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <a
              href={`tel:${settings.phone.replace(/\s+/g, '')}`}
              className="flex items-center gap-1.5 hover:text-teal-400 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-teal-500" />
              <span>{settings.phone}</span>
            </a>
            <a
              href="https://t.me/Mercyyy_07"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-400/30 px-2 py-0.5 rounded-md text-[11px] font-bold transition-colors"
            >
              <Send className="w-3 h-3 text-sky-300" />
              <span>Telegram: @Mercyyy_07</span>
            </a>
            <a
              href={`mailto:${settings.email}`}
              className="hidden md:flex items-center gap-1.5 hover:text-teal-400 transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-teal-500" />
              <span>{settings.email}</span>
            </a>
            <div className="hidden lg:flex items-center gap-1.5 text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-teal-500" />
              <span>{settings.location}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <span className="hidden lg:inline text-slate-400 text-[11px] uppercase tracking-wider">{settings.businessHours}</span>
            {isLoggedIn ? (
              <button
                onClick={() => handleNavClick('/admin')}
                className="flex items-center gap-1 bg-teal-600 hover:bg-teal-700 px-2.5 py-1 rounded-sm text-[11px] font-bold text-white uppercase tracking-wider transition-colors"
              >
                <User className="w-3 h-3" />
                <span>Admin Panel</span>
              </button>
            ) : (
              <button
                onClick={() => handleNavClick('/admin')}
                className="text-slate-400 hover:text-white transition-colors text-[11px] uppercase tracking-wider font-semibold"
              >
                Admin Login
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Company Brand Logo */}
          <div
            onClick={() => handleNavClick('/')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <img
              src={settings.logo || '/logo.png'}
              alt={settings.companyName}
              className="w-11 h-11 object-contain rounded-full border-2 border-amber-400 bg-white p-0.5 shadow-sm group-hover:scale-105 transition-transform shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/logo.png';
              }}
            />
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tight uppercase text-stone-900 group-hover:text-amber-700 transition-colors leading-none">
                {settings.companyName}
              </span>
              <span className="text-[10px] text-amber-700 font-bold uppercase tracking-widest mt-1">
                Quality Products
              </span>
            </div>
          </div>

          {/* Desktop Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium h-16">
            {navItems.map(item => {
              const isActive = currentPath === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavClick(item.path)}
                  className={`h-16 border-b-2 flex items-center transition-colors px-1 text-sm font-semibold tracking-wide ${
                    isActive
                      ? 'text-teal-600 border-teal-600 font-bold'
                      : 'border-transparent text-slate-700 hover:text-teal-600'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Action CTA Button */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={onRequestInquiry}
              className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 rounded-sm text-sm font-bold tracking-wide transition-all uppercase"
            >
              Request Inquiry
            </button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={onRequestInquiry}
              className="sm:hidden bg-teal-600 text-white px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wide"
            >
              Inquiry
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-teal-600 rounded-sm transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-100 px-4 pt-2 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-1">
            {navItems.map(item => {
              const isActive = currentPath === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavClick(item.path)}
                  className={`text-left px-4 py-2.5 rounded-sm font-semibold text-sm transition-colors ${
                    isActive
                      ? 'bg-teal-50 text-teal-900 border-l-4 border-teal-600 font-bold'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-teal-600'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onRequestInquiry();
              }}
              className="w-full bg-teal-600 text-white py-2.5 rounded-sm font-bold text-xs uppercase tracking-wider shadow-sm"
            >
              Request Product Inquiry
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
