import React, { useState, useEffect } from 'react';
import { X, Send, Package, User, Phone, Send as TelegramIcon, Mail, MapPin, Hash, AlertCircle, Loader2 } from 'lucide-react';
import { Product, Inquiry } from '../types';
import { api } from '../services/api';

interface InquiryModalProps {
  selectedProduct?: Product | null;
  productsList?: Product[];
  onClose: () => void;
  onSuccess: (inquiry: Inquiry) => void;
}

export const InquiryModal: React.FC<InquiryModalProps> = ({
  selectedProduct,
  productsList = [],
  onClose,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '+251 ',
    telegramUsername: '',
    email: '',
    productId: selectedProduct ? selectedProduct.id : '',
    productName: selectedProduct ? selectedProduct.name : '',
    productCategory: selectedProduct ? selectedProduct.categoryName : '',
    quantity: 1,
    location: 'Addis Ababa',
    preferredContact: 'Phone',
    message: selectedProduct ? `I would like to inquire about ${selectedProduct.name}. Please provide availability and quote.` : '',
    additionalRequirements: '',
    attachment: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedProduct) {
      setFormData(prev => ({
        ...prev,
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        productCategory: selectedProduct.categoryName || '',
        message: prev.message || `I would like to inquire about ${selectedProduct.name}. Please provide availability and quote.`
      }));
    }
  }, [selectedProduct]);

  const handleProductChange = (productId: string) => {
    const p = productsList.find(item => item.id === productId);
    if (p) {
      setFormData(prev => ({
        ...prev,
        productId: p.id,
        productName: p.name,
        productCategory: p.categoryName || '',
        message: `I would like to inquire about ${p.name}. Please provide pricing and availability.`
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        productId: '',
        productName: 'General Inquiry',
        productCategory: 'General'
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.customerName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!formData.phone.trim() || formData.phone.trim() === '+251') {
      setError('Please enter a valid phone number.');
      return;
    }
    if (!formData.telegramUsername.trim()) {
      setError('Please enter your Telegram username (e.g. @username).');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (formData.quantity < 1) {
      setError('Quantity must be at least 1.');
      return;
    }
    if (!formData.message.trim()) {
      setError('Please enter a message or description for your inquiry.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.createInquiry({
        customerName: formData.customerName,
        phone: formData.phone,
        telegramUsername: formData.telegramUsername,
        email: formData.email,
        productId: formData.productId || undefined,
        productName: formData.productName || 'General Inquiry',
        productCategory: formData.productCategory || 'General',
        quantity: Number(formData.quantity),
        location: formData.location,
        preferredContact: formData.preferredContact,
        message: formData.message,
        additionalRequirements: formData.additionalRequirements,
        attachment: formData.attachment
      });

      setLoading(false);
      onSuccess(res.inquiry);
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Failed to submit inquiry. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-stone-100 my-8">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-emerald-200">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Request Product Inquiry</h2>
              <p className="text-xs text-emerald-200">
                Mercy Shopes • Instant Telegram Notification to @Mercyyy_07
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Telegram Direct Admin Notice */}
        <div className="bg-sky-50 px-6 py-2.5 border-b border-sky-100 flex flex-wrap items-center justify-between gap-2 text-xs text-sky-900">
          <div className="flex items-center gap-2">
            <TelegramIcon className="w-4 h-4 text-sky-600" />
            <span>Instant Admin Telegram Notification: <strong>@Mercyyy_07</strong></span>
          </div>
          <a
            href="https://t.me/Mercyyy_07"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-700 hover:text-sky-900 underline"
          >
            Open Telegram App
          </a>
        </div>

        {/* Selected Product Banner */}
        {formData.productName && (
          <div className="bg-emerald-50 px-6 py-3 border-b border-emerald-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-emerald-700" />
              <span className="font-medium text-stone-600">Inquiring about:</span>
              <span className="font-bold text-emerald-900">{formData.productName}</span>
            </div>
            {formData.productCategory && (
              <span className="bg-emerald-200/80 text-emerald-900 font-bold px-2 py-0.5 rounded text-[10px]">
                {formData.productCategory}
              </span>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Product Selection if not preselected */}
          {!selectedProduct && productsList.length > 0 && (
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Select Product (Optional)
              </label>
              <select
                value={formData.productId}
                onChange={e => handleProductChange(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              >
                <option value="">General Product Inquiry</option>
                {productsList.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} — ETB {p.price.toLocaleString()} ({p.categoryName})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Customer Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Abebe Bikila"
                  value={formData.customerName}
                  onChange={e => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                <input
                  type="text"
                  required
                  placeholder="+251 911 234 567"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Telegram Username <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <TelegramIcon className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                <input
                  type="text"
                  required
                  placeholder="@username"
                  value={formData.telegramUsername}
                  onChange={e => setFormData({ ...formData, telegramUsername: e.target.value })}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                <input
                  type="email"
                  required
                  placeholder="customer@email.com"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>
          </div>

          {/* Quantity & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Quantity Required <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Hash className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                <input
                  type="number"
                  min="1"
                  required
                  value={formData.quantity}
                  onChange={e => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Your Location
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                <input
                  type="text"
                  placeholder="e.g. Maxico Shabele, Addis Ababa"
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>
          </div>

          {/* Preferred Contact Method */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Preferred Contact Method
            </label>
            <div className="grid grid-cols-4 gap-2">
              {['Phone', 'Telegram', 'Email', 'WhatsApp'].map(method => (
                <button
                  type="button"
                  key={method}
                  onClick={() => setFormData({ ...formData, preferredContact: method })}
                  className={`py-2 px-2 text-xs font-bold rounded-xl border transition-all ${
                    formData.preferredContact === method
                      ? 'bg-emerald-700 text-white border-emerald-700'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          {/* Message / Description */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              Inquiry Details / Message <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              required
              placeholder="Describe what product or specifications you require, delivery preference, or custom requests..."
              value={formData.message}
              onChange={e => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          {/* Additional Requirements */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              Additional Requirements or Reference Link (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Specific shade or grade requirements"
              value={formData.additionalRequirements}
              onChange={e => setFormData({ ...formData, additionalRequirements: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          {/* Submit CTA */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 disabled:bg-stone-300 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg transition-all active:scale-98"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Submitting Inquiry...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 text-emerald-200" />
                  <span>Send Inquiry Now</span>
                </>
              )}
            </button>
            <p className="text-[11px] text-center text-stone-400 mt-2">
              Your inquiry will be logged securely and instantly notified to Mercy Shopes on Telegram.
            </p>
          </div>

        </form>
      </div>
    </div>
  );
};
