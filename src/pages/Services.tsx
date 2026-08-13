import React from 'react';
import { ServiceItem } from '../types';
import { Send, CheckCircle2, PackageCheck, Boxes, MessageSquareText, Building2, Headphones, Sparkles } from 'lucide-react';

interface ServicesProps {
  services?: ServiceItem[];
  onRequestInquiry?: () => void;
  onNavigate?: (path: string) => void;
}

export const Services: React.FC<ServicesProps> = ({ services = [], onRequestInquiry = () => {}, onNavigate = (_path: string) => {} }) => {
  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'PackageCheck': return <PackageCheck className="w-6 h-6 text-emerald-700" />;
      case 'Boxes': return <Boxes className="w-6 h-6 text-emerald-700" />;
      case 'MessageSquareText': return <MessageSquareText className="w-6 h-6 text-emerald-700" />;
      case 'Building2': return <Building2 className="w-6 h-6 text-emerald-700" />;
      case 'Headphones': return <Headphones className="w-6 h-6 text-emerald-700" />;
      case 'Sparkles': return <Sparkles className="w-6 h-6 text-emerald-700" />;
      default: return <CheckCircle2 className="w-6 h-6 text-emerald-700" />;
    }
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* Header Banner */}
      <section className="bg-stone-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="bg-emerald-800 text-emerald-200 text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            Mercy Shopes Services
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Professional Supply & Inquiry Services
          </h1>
          <p className="text-stone-300 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            From bulk construction material orders to specialized cosmetic sourcing and personalized customer support, explore how Mercy Shopes fulfills your needs.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map(srv => (
            <div
              key={srv.id}
              className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                  {getServiceIcon(srv.iconName)}
                </div>

                <h3 className="text-xl font-bold text-stone-900">
                  {srv.title}
                </h3>

                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                  {srv.fullDescription || srv.shortDescription}
                </p>

                {srv.features && srv.features.length > 0 && (
                  <div className="pt-2 space-y-2">
                    {srv.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-stone-700 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-stone-100 mt-6">
                <button
                  onClick={onRequestInquiry}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors shadow-sm"
                >
                  <Send className="w-3.5 h-3.5 text-emerald-200" />
                  <span>Inquire for {srv.title}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Inquiry CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-emerald-900 text-white p-8 sm:p-12 rounded-3xl text-center space-y-4 shadow-xl border border-emerald-800">
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Need a Customized Product Supply Solution?
          </h2>
          <p className="text-stone-200 text-xs sm:text-sm max-w-xl mx-auto">
            Contact Mercy Shopes at Maxico Shabele directly or send us an inquiry for wholesale rates and custom sourcing.
          </p>
          <div className="pt-2">
            <button
              onClick={onRequestInquiry}
              className="inline-flex items-center gap-2 bg-white text-emerald-900 hover:bg-stone-100 font-bold px-8 py-3.5 rounded-2xl shadow-lg transition-all"
            >
              <Send className="w-4 h-4 text-emerald-700" />
              <span>Send Special Inquiry</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
