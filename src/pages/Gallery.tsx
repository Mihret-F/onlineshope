import React, { useState } from 'react';
import { GalleryItem } from '../types';
import { X, Eye, Image as ImageIcon } from 'lucide-react';

interface GalleryProps {
  galleryItems?: GalleryItem[];
  onNavigate?: (path: string) => void;
}

export const Gallery: React.FC<GalleryProps> = ({ galleryItems = [], onNavigate = (_path: string) => {} }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [lightboxImage, setLightboxImage] = useState<GalleryItem | null>(null);

  const categories = ['All', 'Products', 'Store', 'Events', 'Customers', 'Behind the Scenes'];

  const filteredItems = selectedCategory === 'All'
    ? galleryItems
    : galleryItems.filter(item => item.category === selectedCategory);

  return (
    <div className="space-y-12 pb-16">
      
      {/* Header Banner */}
      <section className="bg-stone-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="bg-emerald-800 text-emerald-200 text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            Mercy Shopes Gallery
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Photo Gallery & Store Showcase
          </h1>
          <p className="text-stone-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Explore photos of our products, store inventory at Maxico Shabele, customer deliveries, and behind the scenes.
          </p>
        </div>
      </section>

      {/* Main Gallery Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-800 text-white shadow-md'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry / Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map(item => (
              <div
                key={item.id}
                onClick={() => setLightboxImage(item)}
                className="group relative rounded-3xl overflow-hidden aspect-[4/3] bg-stone-100 cursor-pointer shadow-sm hover:shadow-xl transition-all border border-stone-200"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-white">
                  <span className="bg-emerald-700/90 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider self-start mb-1.5">
                    {item.category}
                  </span>
                  <h3 className="text-base font-bold text-white leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs text-stone-300 line-clamp-2 mt-1">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 max-w-md mx-auto space-y-3">
            <ImageIcon className="w-10 h-10 text-stone-300 mx-auto" />
            <h3 className="text-base font-bold text-stone-800">No Gallery Photos</h3>
            <p className="text-xs text-stone-500">No images available for category: {selectedCategory}</p>
          </div>
        )}

      </div>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div className="fixed inset-0 z-50 bg-stone-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative max-w-4xl w-full bg-stone-900 rounded-3xl overflow-hidden border border-stone-800 shadow-2xl">
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/60 hover:bg-black text-white rounded-full flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="aspect-[16/10] bg-black">
              <img
                src={lightboxImage.image}
                alt={lightboxImage.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="p-6 bg-stone-900 text-white space-y-1">
              <span className="bg-emerald-700 text-emerald-100 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {lightboxImage.category}
              </span>
              <h3 className="text-xl font-bold">{lightboxImage.title}</h3>
              <p className="text-xs text-stone-300">{lightboxImage.description}</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
