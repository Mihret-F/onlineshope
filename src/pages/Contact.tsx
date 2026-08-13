import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send as TelegramIcon, Send, MessageSquare, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { SiteSettings } from '../types';
import { api } from '../services/api';

interface ContactProps {
  settings: SiteSettings;
  onRequestInquiry?: () => void;
  onNavigate?: (path: string) => void;
}

export const Contact: React.FC<ContactProps> = ({ settings, onRequestInquiry = () => {}, onNavigate = (_path: string) => {} }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '+251 ',
    email: '',
    subject: 'General Question',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim() || !formData.phone.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      setLoading(true);
      await api.sendMessage(formData);
      setLoading(false);
      setSubmitted(true);
      setFormData({ name: '', phone: '+251 ', email: '', subject: 'General Question', message: '' });
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Failed to send message. Please try again.');
    }
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* Header Banner */}
      <section className="bg-stone-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="bg-emerald-800 text-emerald-200 text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            Get in Touch
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Contact Mercy Shopes
          </h1>
          <p className="text-stone-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Have a question about our building materials, cosmetics, or household merchandise? Reach out directly via phone, email, Telegram, or visit our shop at Maxico Shabele.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Contact Details Cards & Fast CTAs */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm space-y-6">
              <h2 className="text-xl font-bold text-stone-900 border-b border-stone-100 pb-4">
                Company Details
              </h2>

              <ul className="space-y-5">
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-1">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold uppercase tracking-wider text-stone-400">Phone Number</span>
                    <a href={`tel:${settings.phone.replace(/\s+/g, '')}`} className="text-base font-extrabold text-stone-900 hover:text-emerald-700 transition-colors">
                      {settings.phone}
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-1">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold uppercase tracking-wider text-stone-400">Email Address</span>
                    <a href={`mailto:${settings.email}`} className="text-base font-bold text-stone-900 hover:text-emerald-700 transition-colors break-all">
                      {settings.email}
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-1">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold uppercase tracking-wider text-stone-400">Location / Address</span>
                    <span className="text-base font-bold text-stone-900">
                      {settings.location}
                    </span>
                  </div>
                </li>
              </ul>

              {/* Instant Social / Telegram Contact Action */}
              <div className="pt-4 border-t border-stone-100 space-y-2">
                <span className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">Direct Contact Actions</span>
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                    className="flex items-center justify-center gap-1.5 bg-emerald-800 text-white py-2.5 px-3 rounded-xl text-xs font-bold hover:bg-emerald-900 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Now</span>
                  </a>

                  <a
                    href="https://t.me/Mercyyy_07"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 bg-sky-600 text-white py-2.5 px-3 rounded-xl text-xs font-bold hover:bg-sky-700 transition-colors"
                  >
                    <TelegramIcon className="w-3.5 h-3.5" />
                    <span>@Mercyyy_07</span>
                  </a>
                </div>
              </div>

            </div>

            {/* Telegram Admin Contact Highlight */}
            <div className="bg-gradient-to-r from-sky-600 to-blue-700 text-white rounded-3xl p-6 shadow-md space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-white shrink-0">
                  <TelegramIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Direct Admin Telegram</h3>
                  <p className="text-xs text-sky-100">Contact administrator directly</p>
                </div>
              </div>
              <p className="text-xs text-sky-100 leading-relaxed">
                Connect directly with <strong>@Mercyyy_07</strong> on Telegram for fast inquiries, cosmetics orders, jewelry availability, clothing & shoe sizes, or building materials.
              </p>
              <a
                href="https://t.me/Mercyyy_07"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-white text-sky-700 font-extrabold py-3 px-4 rounded-xl text-xs hover:bg-sky-50 transition-colors shadow"
              >
                <TelegramIcon className="w-4 h-4 text-sky-600" />
                <span>Open Telegram @Mercyyy_07</span>
              </a>
            </div>

            {/* Inquiry Card Callout */}
            <div className="bg-gradient-to-br from-emerald-900 to-teal-900 text-white rounded-3xl p-8 space-y-3 shadow-lg">
              <h3 className="text-lg font-bold text-white">Looking for a Specific Product Quote?</h3>
              <p className="text-xs text-stone-200 leading-relaxed">
                Use our dedicated inquiry form to specify quantity, size, and custom specifications for fast routing.
              </p>
              <button
                onClick={onRequestInquiry}
                className="w-full flex items-center justify-center gap-2 bg-white text-emerald-900 font-bold py-3 px-4 rounded-xl text-xs hover:bg-stone-100 transition-colors"
              >
                <Send className="w-4 h-4 text-emerald-700" />
                <span>Open Product Inquiry Form</span>
              </button>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm space-y-6">
              <div>
                <h2 className="text-xl font-bold text-stone-900">Send Us a Direct Message</h2>
                <p className="text-xs text-stone-500 mt-1">
                  Fill out the form below. We save your message securely and follow up promptly.
                </p>
              </div>

              {submitted ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-700 mx-auto" />
                  <h3 className="text-lg font-bold text-emerald-900">Message Sent Successfully!</h3>
                  <p className="text-xs text-emerald-800 leading-relaxed max-w-sm mx-auto">
                    Thank you for reaching out to Mercy Shopes. We have received your message and will get back to you shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl hover:bg-emerald-800 transition-colors mt-2"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-semibold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="+251 911 234 567"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Subject
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Product Inquiry / Pricing"
                        value={formData.subject}
                        onChange={e => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Your Message *
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Type your message here..."
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 disabled:bg-stone-300 text-white font-bold py-3.5 px-6 rounded-2xl shadow-md transition-all"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-emerald-200" />
                        <span>Submit Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Google Maps Section for Maxico Shabele */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-700" />
            <span>Store Location — Maxico Shabele</span>
          </h2>
          <span className="text-xs text-stone-500 font-semibold">{settings.location}</span>
        </div>

        <div className="aspect-[21/9] w-full rounded-3xl overflow-hidden border border-stone-200 shadow-md bg-stone-100">
          <iframe
            title="Mercy Shopes Location Map"
            src={settings.mapUrl || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.5489720485667!2d38.7491!3d9.0125!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOcKwMDAnNDUuMCJOIDM4wrA0NCc1Ni44IkU!5e0!3m2!1sen!2set!4v1620000000000!5m2!1sen!2set'}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>

    </div>
  );
};
