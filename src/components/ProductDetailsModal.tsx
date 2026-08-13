import React, { useState } from 'react';
import { X, Send, CheckCircle2, AlertCircle, Shield, Tag, Package, ChevronRight } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailsModalProps {
  product: Product | null;
  allProducts?: Product[];
  onClose: () => void;
  onRequestInquiry?: (product: Product) => void;
  onSelectProduct?: (product: Product) => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  product,
  allProducts = [],
  onClose,
  onRequestInquiry = (_product: Product) => {},
  onSelectProduct = (_product: Product) => {}
}) => {
  if (!product) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const images = product.images && product.images.length > 0
    ? product.images
    : ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80'];

  const isAvailable = product.availability === 'Available';

  const relatedProducts = allProducts
    .filter(p => p.id !== product.id && (p.categoryId === product.categoryId || p.categoryName === product.categoryName))
    .slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-stone-100 my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 bg-white/90 hover:bg-stone-100 text-stone-700 rounded-full flex items-center justify-center shadow-md transition-all"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 max-h-[85vh] overflow-y-auto space-y-8">
          {/* Main Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Left Column: Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-stone-100 border border-stone-200">
                <img
                  src={images[activeImageIndex]}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                />
                {product.badge && (
                  <span className="absolute top-4 left-4 bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md uppercase">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                        activeImageIndex === idx ? 'border-emerald-600 ring-2 ring-emerald-100' : 'border-stone-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`Thumbnail ${idx}`} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Information */}
            <div className="flex flex-col space-y-5">
              
              {/* Category & SKU */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="bg-emerald-50 text-emerald-900 font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {product.categoryName || 'General'}
                </span>
                <span className="text-stone-400 font-mono font-medium">
                  SKU: {product.sku}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-extrabold text-stone-900 leading-tight">
                {product.name}
              </h2>

              {/* Brand */}
              {product.brand && (
                <p className="text-xs text-stone-500 font-medium">
                  Brand: <span className="font-bold text-stone-800">{product.brand}</span>
                </p>
              )}

              {/* Price & Availability */}
              <div className="p-4 bg-stone-50 rounded-2xl flex items-center justify-between border border-stone-100">
                <div>
                  <span className="text-xs text-stone-500 block font-medium">Price:</span>
                  {product.discountPrice ? (
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-emerald-800">
                        ETB {product.discountPrice.toLocaleString()}
                      </span>
                      <span className="text-sm text-stone-400 line-through font-medium">
                        ETB {product.price.toLocaleString()}
                      </span>
                    </div>
                  ) : (
                    <span className="text-2xl font-black text-stone-900">
                      ETB {product.price.toLocaleString()}
                    </span>
                  )}
                </div>

                <div className="text-right">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                      isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-700'
                    }`}
                  >
                    {isAvailable ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                    <span>{product.availability}</span>
                  </span>
                  {product.stock > 0 && (
                    <span className="block text-[11px] text-stone-500 mt-1">
                      In Stock: {product.stock} units
                    </span>
                  )}
                </div>
              </div>

              {/* Sizes and Colors */}
              {(product.sizes?.length || product.colors?.length) && (
                <div className="space-y-3 pt-1">
                  {product.sizes && product.sizes.length > 0 && (
                    <div>
                      <span className="text-xs font-bold text-stone-700 block mb-1.5">Available Sizes:</span>
                      <div className="flex flex-wrap gap-2">
                        {product.sizes.map((s, idx) => (
                          <span key={idx} className="bg-stone-100 border border-stone-200 px-2.5 py-1 rounded-lg text-xs font-semibold text-stone-800">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {product.colors && product.colors.length > 0 && (
                    <div>
                      <span className="text-xs font-bold text-stone-700 block mb-1.5">Available Colors:</span>
                      <div className="flex flex-wrap gap-2">
                        {product.colors.map((c, idx) => (
                          <span key={idx} className="bg-stone-100 border border-stone-200 px-2.5 py-1 rounded-lg text-xs font-semibold text-stone-800">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Description */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Description</h4>
                <p className="text-stone-700 text-sm leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>

              {/* Inquiry Action Button */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    onClose();
                    onRequestInquiry(product);
                  }}
                  className="w-full flex items-center justify-center gap-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all active:scale-98"
                >
                  <Send className="w-5 h-5 text-emerald-200" />
                  <span>Request Product Inquiry</span>
                </button>
              </div>

            </div>
          </div>

          {/* Specifications Table */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="pt-6 border-t border-stone-200">
              <h3 className="text-base font-bold text-stone-900 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-emerald-700" />
                <span>Technical Specifications</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-stone-50 p-4 rounded-2xl border border-stone-200">
                {Object.entries(product.specifications).map(([key, val]) => (
                  <div key={key} className="flex justify-between py-1.5 border-b border-stone-200/60 text-xs">
                    <span className="font-semibold text-stone-600">{key}:</span>
                    <span className="font-bold text-stone-900">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="pt-6 border-t border-stone-200">
              <h3 className="text-base font-bold text-stone-900 mb-4">Related Products</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedProducts.map(rel => (
                  <div
                    key={rel.id}
                    onClick={() => {
                      setActiveImageIndex(0);
                      onSelectProduct(rel);
                    }}
                    className="group bg-stone-50 rounded-xl p-3 border border-stone-200 hover:border-emerald-600 transition-all cursor-pointer flex items-center gap-3"
                  >
                    <img
                      src={rel.images?.[0] || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200&auto=format&fit=crop&q=80'}
                      alt={rel.name}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 object-cover rounded-lg shrink-0"
                    />
                    <div className="overflow-hidden">
                      <h4 className="text-xs font-bold text-stone-900 group-hover:text-emerald-700 truncate">
                        {rel.name}
                      </h4>
                      <p className="text-[11px] font-bold text-emerald-800 mt-0.5">
                        ETB {rel.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
