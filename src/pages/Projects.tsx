import React from 'react';
import { ProjectItem } from '../types';
import { MapPin, Calendar, CheckCircle2, Send, Building } from 'lucide-react';

interface ProjectsProps {
  projects?: ProjectItem[];
  onRequestInquiry?: () => void;
  onNavigate?: (path: string) => void;
}

export const Projects: React.FC<ProjectsProps> = ({ projects = [], onRequestInquiry = () => {}, onNavigate = (_path: string) => {} }) => {
  return (
    <div className="space-y-12 pb-16">
      
      {/* Header Banner */}
      <section className="bg-stone-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="bg-emerald-800 text-emerald-200 text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            Mercy Shopes Projects
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Supply & Merchandise Projects
          </h1>
          <p className="text-stone-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Highlights of major material supplies, retail batch dispatches, and business contracts completed by Mercy Shopes.
          </p>
        </div>
      </section>

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map(proj => (
            <div
              key={proj.id}
              className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Project Image */}
                <div className="relative aspect-[16/9] overflow-hidden bg-stone-100">
                  <img
                    src={proj.images?.[0] || 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=800&auto=format&fit=crop&q=80'}
                    alt={proj.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="bg-emerald-800 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                      {proj.category}
                    </span>
                    <span className="bg-stone-900/80 backdrop-blur-md text-emerald-300 text-[10px] font-bold px-2.5 py-1 rounded-full">
                      {proj.status}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6 space-y-3">
                  <h3 className="text-xl font-bold text-stone-900">
                    {proj.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500 font-medium">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      {proj.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                      {proj.date}
                    </span>
                  </div>

                  <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                    {proj.description}
                  </p>
                </div>
              </div>

              {/* Action */}
              <div className="p-6 pt-0">
                <button
                  onClick={onRequestInquiry}
                  className="w-full flex items-center justify-center gap-2 bg-stone-100 hover:bg-emerald-700 hover:text-white text-stone-800 font-bold py-2.5 px-4 rounded-xl text-xs transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Inquire for Similar Project Supply</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
