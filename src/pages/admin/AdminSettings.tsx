import React, { useState } from 'react';
import { Settings as SettingsIcon, Send, CheckCircle2, AlertCircle, Loader2, Save, ExternalLink } from 'lucide-react';
import { SiteSettings } from '../../types';
import { api } from '../../services/api';
import { ImageUploader } from '../../components/ImageUploader';

interface AdminSettingsProps {
  settings: SiteSettings;
  onRefreshSettings: () => void;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({ settings, onRefreshSettings }) => {
  const [formData, setFormData] = useState({
    companyName: settings.companyName || 'Mercy Shopes',
    phone: settings.phone || '+251 965 449 976',
    email: settings.email || 'mihretfikre67@gmail.com',
    location: settings.location || 'Maxico Shabele',
    telegramBotToken: settings.telegramBotToken || '',
    telegramChatId: settings.telegramChatId || '',
    businessHours: settings.businessHours || 'Monday - Saturday: 8:00 AM - 7:00 PM',
    heroHeadline: settings.heroHeadline || 'Quality Cosmetics, Jewelry, Clothes, Shoes & Building Materials',
    heroSubheadline: settings.heroSubheadline || 'Mercy Shopes provides cosmetics, Habesha jewelry, traditional clothes, handcrafted shoes, and materials.',
    heroBannerImage: settings.heroBannerImage || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1200&auto=format&fit=crop&q=80'
  });

  const [saving, setSaving] = useState(false);
  const [testingTelegram, setTestingTelegram] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    try {
      setSaving(true);
      await api.updateSettings({
        ...formData,
        socialLinks: {
          ...settings.socialLinks,
          telegram: 'https://t.me/Mercyyy_07'
        }
      });
      setSaving(false);
      setMessage({ type: 'success', text: 'Site settings updated successfully!' });
      onRefreshSettings();
    } catch (err: any) {
      setSaving(false);
      setMessage({ type: 'error', text: err.message || 'Failed to update settings.' });
    }
  };

  const handleTestTelegram = async () => {
    setMessage(null);
    try {
      setTestingTelegram(true);
      const res = await api.testTelegram(formData.telegramBotToken, formData.telegramChatId);
      setTestingTelegram(false);

      if (res.success) {
        setMessage({
          type: 'success',
          text: 'Telegram test message sent successfully! Check Telegram app (@Mercyyy_07).'
        });
      } else {
        setMessage({
          type: 'error',
          text: `Telegram API Error: ${res.error || 'Check Bot Token and Chat ID.'}`
        });
      }
    } catch (err: any) {
      setTestingTelegram(false);
      setMessage({ type: 'error', text: err.message || 'Network error testing Telegram.' });
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-stone-900 flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-emerald-700" />
            <span>Store & Telegram Bot Settings</span>
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Configure Mercy Shopes contact info, hero text, and Telegram notification bot (@Mercyyy_07).
          </p>
        </div>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl text-xs font-bold flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
              : 'bg-rose-50 text-rose-900 border border-rose-200'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Telegram Notification Bot Card */}
      <div className="bg-gradient-to-r from-sky-900 to-blue-950 text-white p-6 rounded-2xl shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-sky-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-300 flex items-center justify-center font-bold">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Telegram Integration (@Mercyyy_07)</h3>
              <p className="text-xs text-sky-200">Automatically forwards every customer product inquiry to Telegram.</p>
            </div>
          </div>
          <a
            href="https://t.me/Mercyyy_07"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
          >
            <span>Open @Mercyyy_07</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-sky-300 mb-1">
              Telegram Bot Token
            </label>
            <input
              type="password"
              placeholder="123456789:ABCdefGHIjklMNO..."
              value={formData.telegramBotToken}
              onChange={e => setFormData({ ...formData, telegramBotToken: e.target.value })}
              className="w-full bg-sky-950/80 border border-sky-700/60 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-sky-300 mb-1">
              Telegram Admin Chat ID
            </label>
            <input
              type="text"
              placeholder="e.g. 729414541"
              value={formData.telegramChatId}
              onChange={e => setFormData({ ...formData, telegramChatId: e.target.value })}
              className="w-full bg-sky-950/80 border border-sky-700/60 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
          <p className="text-[11px] text-sky-300">
            Target Telegram Admin Username: <strong className="text-white">@Mercyyy_07</strong>
          </p>
          <button
            type="button"
            onClick={handleTestTelegram}
            disabled={testingTelegram}
            className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors shadow-sm"
          >
            {testingTelegram ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            <span>Send Test Telegram Message</span>
          </button>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-6">
        <h3 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-3">
          Business & Store Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
              Company Name
            </label>
            <input
              type="text"
              value={formData.companyName}
              onChange={e => setFormData({ ...formData, companyName: e.target.value })}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-emerald-700 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
              Phone Number
            </label>
            <input
              type="text"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-emerald-700 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-emerald-700 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
              Shop Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={e => setFormData({ ...formData, location: e.target.value })}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-emerald-700 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
              Hero Headline
            </label>
            <input
              type="text"
              value={formData.heroHeadline}
              onChange={e => setFormData({ ...formData, heroHeadline: e.target.value })}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-emerald-700 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
              Hero Subheadline
            </label>
            <textarea
              rows={2}
              value={formData.heroSubheadline}
              onChange={e => setFormData({ ...formData, heroSubheadline: e.target.value })}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-emerald-700 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <ImageUploader
              label="Homepage Hero Banner Image"
              description="Upload main banner background or showcase image for the homepage hero section."
              value={formData.heroBannerImage}
              onChange={url => setFormData({ ...formData, heroBannerImage: url })}
            />
          </div>
        </div>

        <div className="pt-4 border-t border-stone-100 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-colors shadow-sm"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Settings</span>
          </button>
        </div>
      </form>

    </div>
  );
};
