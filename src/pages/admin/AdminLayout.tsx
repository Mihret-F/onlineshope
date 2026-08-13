import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  Layers,
  Send,
  Users,
  Image as ImageIcon,
  FolderGit2,
  Wrench,
  Mail,
  FileText,
  Settings as SettingsIcon,
  UserCheck,
  LogOut,
  Menu,
  X,
  ShoppingBag,
  ExternalLink
} from 'lucide-react';
import { AdminUser, SiteSettings } from '../../types';

interface AdminLayoutProps {
  user: AdminUser;
  settings: SiteSettings;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  onNavigateSite: (path: string) => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  user,
  settings,
  activeTab,
  setActiveTab,
  onLogout,
  onNavigateSite,
  children
}) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'categories', label: 'Categories', icon: Layers },
    { id: 'inquiries', label: 'Inquiries', icon: Send },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon },
    { id: 'projects', label: 'Projects', icon: FolderGit2 },
    { id: 'services', label: 'Services', icon: Wrench },
    { id: 'messages', label: 'Contact Messages', icon: Mail },
    { id: 'content', label: 'Site Content', icon: FileText },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
    { id: 'users', label: 'Admin Users', icon: UserCheck }
  ];

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col md:flex-row">
      
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-stone-900 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-2.5">
          <img
            src={settings.logo || '/logo.png'}
            alt="Mercy Shopes"
            className="w-8 h-8 object-contain rounded-full border border-amber-400 bg-white p-0.5 shrink-0"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/logo.png';
            }}
          />
          <span className="font-bold text-sm">Mercy Shopes Admin</span>
        </div>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-1.5 text-stone-300 hover:text-white"
        >
          {mobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-stone-900 text-stone-300 flex flex-col justify-between transition-transform duration-200 transform ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Sidebar Header */}
          <div className="p-6 border-b border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={settings.logo || '/logo.png'}
                alt="Mercy Shopes"
                className="w-10 h-10 object-contain rounded-full border-2 border-amber-400 bg-white p-0.5 shadow-md shrink-0"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/logo.png';
                }}
              />
              <div>
                <h2 className="text-sm font-black text-white tracking-tight uppercase">Mercy Shopes</h2>
                <p className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Admin Control</p>
              </div>
            </div>
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="md:hidden text-stone-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Items */}
          <nav className="p-3 space-y-1 max-h-[calc(100vh-180px)] overflow-y-auto">
            {menuItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-emerald-800 text-white font-bold shadow-sm'
                      : 'text-stone-400 hover:bg-stone-800 hover:text-stone-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-300' : 'text-stone-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-stone-800 space-y-2">
          <button
            onClick={() => onNavigateSite('/')}
            className="w-full flex items-center justify-center gap-2 bg-stone-800 hover:bg-stone-700 text-stone-200 py-2 px-3 rounded-xl text-xs font-semibold transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
            <span>View Live Website</span>
          </button>

          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 bg-rose-950/80 hover:bg-rose-900 text-rose-200 py-2 px-3 rounded-xl text-xs font-bold transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>

      </aside>

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Header Bar */}
        <header className="bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20 shadow-xs">
          <div>
            <h1 className="text-lg font-black text-stone-900 capitalize">
              {menuItems.find(m => m.id === activeTab)?.label || 'Dashboard'}
            </h1>
            <p className="text-[11px] text-stone-500 font-medium">
              Mercy Shopes Administration • Logged in as <strong className="text-stone-800">{user.name}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="bg-emerald-100 text-emerald-900 text-[11px] font-bold px-2.5 py-1 rounded-full border border-emerald-200">
              {user.role}
            </span>
          </div>
        </header>

        {/* Tab Body */}
        <main className="p-6 flex-1 overflow-y-auto">
          {children}
        </main>

      </div>

    </div>
  );
};
