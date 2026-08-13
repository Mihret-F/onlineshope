import React from 'react';
import { Eye, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  onRequestInquiry: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onViewDetails,
  onRequestInquiry
}) => {
  const isAvailable = product.availability === 'Available';
  const primaryImage = product.images?.[0] || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80';

  return (
    <div className="group bg-white rounded-sm border border-slate-200 hover:border-teal-600 transition-all duration-200 flex flex-col overflow-hidden h-full">
      {/* Product Image Section */}
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        <img
          src={primaryImage}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />

        {/* Badge Overlay */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {product.badge && (
            <span className="bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">
              {product.badge}
            </span>
          )}
          {product.isNew && !product.badge && (
            <span className="bg-teal-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">
              New
            </span>
          )}
          {product.featured && !product.badge && !product.isNew && (
            <span className="bg-slate-800 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">
              Featured
            </span>
          )}
        </div>

        {/* Status Badge */}
        <div className="absolute top-2 right-2 z-10">
          <span
            className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider ${
              isAvailable
                ? 'bg-teal-600 text-white'
                : 'bg-slate-900 text-slate-300'
            }`}
          >
            {isAvailable ? (
              <CheckCircle2 className="w-3 h-3 text-white" />
            ) : (
              <AlertCircle className="w-3 h-3 text-amber-400" />
            )}
            <span>{product.availability}</span>
          </span>
        </div>
      </div>

      {/* Card Content Section */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Category & Brand */}
        <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
          <span className="text-teal-600 font-bold uppercase tracking-wider text-[10px]">
            {product.categoryName || 'General'}
          </span>
          {product.brand && (
            <span className="bg-slate-100 px-1.5 py-0.5 rounded-sm text-[10px] font-semibold text-slate-600 uppercase tracking-wide">
              {product.brand}
            </span>
          )}
        </div>

        {/* Product Title */}
        <h3
          onClick={() => onViewDetails(product)}
          className="text-sm font-bold text-slate-900 group-hover:text-teal-600 transition-colors cursor-pointer line-clamp-2 mb-2 leading-snug"
        >
          {product.name}
        </h3>

        {/* Short Description */}
        <p className="text-slate-600 text-xs leading-relaxed line-clamp-2 mb-4 flex-grow">
          {product.shortDescription || product.description}
        </p>

        {/* Price Tag */}
        <div className="pt-2.5 border-t border-slate-100 mb-3 flex items-baseline gap-2">
          {product.discountPrice ? (
            <>
              <span className="text-base font-extrabold text-teal-700">
                ETB {product.discountPrice.toLocaleString()}
              </span>
              <span className="text-xs text-slate-400 line-through font-medium">
                ETB {product.price.toLocaleString()}
              </span>
            </>
          ) : (
            <span className="text-base font-extrabold text-slate-900">
              ETB {product.price.toLocaleString()}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 mt-auto">
          <button
            onClick={() => onViewDetails(product)}
            className="flex items-center justify-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-2 px-2.5 rounded-sm transition-colors uppercase tracking-wider"
          >
            <Eye className="w-3.5 h-3.5 text-slate-600" />
            <span>Details</span>
          </button>

          <button
            onClick={() => onRequestInquiry(product)}
            className="flex items-center justify-center gap-1 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold py-2 px-2.5 rounded-sm transition-all uppercase tracking-wider"
          >
            <Send className="w-3.5 h-3.5 text-teal-100" />
            <span>Inquire</span>
          </button>
        </div>
      </div>
    </div>
  );
};
