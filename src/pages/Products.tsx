import React, { useState, useMemo } from 'react';
import { Product, Category } from '../types';
import { ProductCard } from '../components/ProductCard';
import { ProductFilter } from '../components/ProductFilter';
import { PackageX } from 'lucide-react';

interface ProductsProps {
  products?: Product[];
  categories?: Category[];
  initialCategory?: string;
  onViewProductDetails?: (product: Product) => void;
  onRequestInquiry?: (product: Product) => void;
}

export const Products: React.FC<ProductsProps> = ({
  products = [],
  categories = [],
  initialCategory = 'all',
  onViewProductDetails = (_product: Product) => {},
  onRequestInquiry = (_product: Product) => {}
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.categoryName?.toLowerCase().includes(q) ||
          p.tags?.some(t => t.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter(
        p => p.categoryId === selectedCategory || p.categoryName?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Availability filter
    if (availabilityFilter !== 'all') {
      result = result.filter(p => p.availability.toLowerCase() === availabilityFilter.toLowerCase());
    }

    // Price filters
    if (minPrice && !isNaN(Number(minPrice))) {
      result = result.filter(p => (p.discountPrice || p.price) >= Number(minPrice));
    }
    if (maxPrice && !isNaN(Number(maxPrice))) {
      result = result.filter(p => (p.discountPrice || p.price) <= Number(maxPrice));
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'price-asc') {
        return (a.discountPrice || a.price) - (b.discountPrice || b.price);
      }
      if (sortBy === 'price-desc') {
        return (b.discountPrice || b.price) - (a.discountPrice || a.price);
      }
      if (sortBy === 'featured') {
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      }
      if (sortBy === 'popular') {
        return (b.stock || 0) - (a.stock || 0);
      }
      // default: newest
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return result;
  }, [products, searchQuery, selectedCategory, availabilityFilter, sortBy, minPrice, maxPrice]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setAvailabilityFilter('all');
    setSortBy('newest');
    setMinPrice('');
    setMaxPrice('');
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-emerald-950 via-stone-900 to-emerald-950 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="bg-emerald-800 text-emerald-200 text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            Mercy Shopes Catalog
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Quality Products & Materials
          </h1>
          <p className="text-stone-300 text-xs sm:text-sm max-w-xl mx-auto">
            Browse our full range of cosmetics, construction materials, household goods, and personal care products. Send an inquiry for instant pricing and delivery.
          </p>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Search & Filter Component */}
        <ProductFilter
          categories={categories}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          availabilityFilter={availabilityFilter}
          setAvailabilityFilter={setAvailabilityFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          minPrice={minPrice}
          setMinPrice={setMinPrice}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          onReset={handleResetFilters}
        />

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-stone-500 font-semibold px-1">
          <span>
            Showing <strong className="text-stone-900">{filteredProducts.length}</strong> products
          </span>
          {selectedCategory !== 'all' && (
            <span className="text-emerald-800 font-bold">
              Filtered by Category
            </span>
          )}
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={onViewProductDetails}
                onRequestInquiry={onRequestInquiry}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 space-y-4 max-w-md mx-auto my-12">
            <div className="w-16 h-16 bg-stone-100 text-stone-400 rounded-2xl flex items-center justify-center mx-auto">
              <PackageX className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-stone-900">No Products Found</h3>
            <p className="text-xs text-stone-500">
              We couldn't find any products matching your current search terms or filters.
            </p>
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-2 bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-emerald-800 transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
