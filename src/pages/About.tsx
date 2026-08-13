import React from 'react';
import { Award, Smile, ShieldCheck, Clock, Sparkles, ShoppingBag, Target, Eye, Send } from 'lucide-react';
import { SiteSettings } from '../types';

interface AboutProps {
  settings: SiteSettings;
  onRequestInquiry?: () => void;
  onNavigate?: (path: string) => void;
}

export const About: React.FC<AboutProps> = ({ settings, onRequestInquiry = () => {}, onNavigate = (_path: string) => {} }) => {
  const valuesList = settings.values || [
    { title: 'Quality', description: 'We source and provide top-grade products for long-lasting satisfaction.', icon: 'Award' },
    { title: 'Customer Satisfaction', description: 'Our highest priority is ensuring every customer order and inquiry is fulfilled seamlessly.', icon: 'Smile' },
    { title: 'Integrity', description: 'Honest pricing, clear product information, and dependable service in all transactions.', icon: 'ShieldCheck' },
    { title: 'Reliability', description: 'Dependable supply chain and consistent communication for individual and business clients.', icon: 'Clock' },
    { title: 'Innovation', description: 'Continuously expanding our product catalog and modernizing product discovery.', icon: 'Sparkles' },
    { title: 'Convenience', description: 'Effortless product inquiries, quick Telegram updates, and direct delivery support.', icon: 'ShoppingBag' }
  ];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Award': return <Award className="w-6 h-6 text-emerald-700" />;
      case 'Smile': return <Smile className="w-6 h-6 text-emerald-700" />;
      case 'ShieldCheck': return <ShieldCheck className="w-6 h-6 text-emerald-700" />;
      case 'Clock': return <Clock className="w-6 h-6 text-emerald-700" />;
      case 'Sparkles': return <Sparkles className="w-6 h-6 text-emerald-700" />;
      default: return <ShoppingBag className="w-6 h-6 text-emerald-700" />;
    }
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Header */}
      <section className="bg-stone-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="bg-emerald-800 text-emerald-200 text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            About Mercy Shopes
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Quality Products, Personal Care & Building Materials
          </h1>
          <p className="text-stone-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Located at Maxico Shabele, Mercy Shopes connects customers and businesses with high-grade products across materials, cosmetics, and household merchandise.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              Our Journey
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
              Our Story
            </h2>
            <p className="text-stone-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
              {settings.aboutStory}
            </p>
            <div className="pt-2">
              <button
                onClick={onRequestInquiry}
                className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-5 py-3 rounded-xl text-xs transition-colors"
              >
                <Send className="w-4 h-4 text-emerald-200" />
                <span>Send Product Inquiry</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-lg border border-stone-200 bg-stone-100">
              <img
                src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80"
                alt="Mercy Shopes Store Story"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Mission */}
          <div className="bg-emerald-900 text-white p-8 rounded-3xl space-y-4 shadow-lg border border-emerald-800">
            <div className="w-12 h-12 bg-emerald-800 text-emerald-200 rounded-2xl flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-white">Our Mission</h3>
            <p className="text-emerald-100 text-sm leading-relaxed">
              {settings.mission}
            </p>
          </div>

          {/* Vision */}
          <div className="bg-stone-900 text-white p-8 rounded-3xl space-y-4 shadow-lg border border-stone-800">
            <div className="w-12 h-12 bg-stone-800 text-emerald-400 rounded-2xl flex items-center justify-center">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-white">Our Vision</h3>
            <p className="text-stone-300 text-sm leading-relaxed">
              {settings.vision}
            </p>
          </div>

        </div>
      </section>

      {/* 6 Core Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Guiding Principles
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
            Our 6 Core Values
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm">
            Everything we do at Mercy Shopes is anchored in these six foundational commitments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {valuesList.map((val, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-3 hover:border-emerald-600 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                {getIcon(val.icon)}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-800 font-mono">0{idx + 1}.</span>
                <h3 className="text-lg font-bold text-stone-900">{val.title}</h3>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                {val.description}
              </p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
