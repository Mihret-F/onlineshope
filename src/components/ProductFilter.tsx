import React from 'react';
import { Search, RotateCcw, ArrowUpDown } from 'lucide-react';
import { Category } from '../types';

interface ProductFilterProps {
  categories?: Category[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  availabilityFilter: string;
  setAvailabilityFilter: (status: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  minPrice: string;
  setMinPrice: (p: string) => void;
  maxPrice: string;
  setMaxPrice: (p: string) => void;
  onReset: () => void;
}

export const ProductFilter: React.FC<ProductFilterProps> = ({
  categories = [],
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  availabilityFilter,
  setAvailabilityFilter,
  sortBy,
  setSortBy,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  onReset
}) => {
  return (
    <div className="bg-white rounded-sm border border-slate-200 p-4 space-y-4 font-sans">
      {/* Top Search Bar & Sort */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        {/* Search Input */}
        <div className="md:col-span-7 relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search products by name, brand, SKU code..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-sm text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-600"
          />
        </div>

        {/* Sort By Dropdown */}
        <div className="md:col-span-3 relative">
          <ArrowUpDown className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-sm text-xs font-bold text-slate-800 uppercase tracking-wider focus:outline-none focus:border-teal-600 appearance-none"
          >
            <option value="newest">Sort: Newest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="featured">Featured First</option>
            <option value="popular">Popular First</option>
          </select>
        </div>

        {/* Reset Button */}
        <div className="md:col-span-2">
          <button
            onClick={onReset}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Categories Bar & Quick Filter Chips */}
      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
        {/* Category Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-all ${
              selectedCategory === 'all'
                ? 'bg-teal-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Products
          </button>

          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-all ${
                selectedCategory === cat.id
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Availability Select & Price Controls */}
        <div className="flex flex-wrap items-center gap-3 ml-auto text-xs">
          <div className="flex items-center gap-1">
            <span className="text-slate-500 font-bold text-[10px] uppercase tracking-wider">Status:</span>
            <select
              value={availabilityFilter}
              onChange={e => setAvailabilityFilter(e.target.value)}
              className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-sm font-semibold text-slate-800 text-xs focus:outline-none focus:border-teal-600"
            >
              <option value="all">All Statuses</option>
              <option value="Available">Available</option>
              <option value="Out of Stock">Out of Stock</option>
              <option value="Pre-order">Pre-order</option>
            </select>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-slate-500 font-bold text-[10px] uppercase tracking-wider">Price ETB:</span>
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={e => setMinPrice(e.target.value)}
              className="w-16 px-2 py-1 bg-slate-50 border border-slate-200 rounded-sm text-xs font-medium focus:outline-none focus:border-teal-600"
            />
            <span className="text-slate-400">-</span>
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={e => setMaxPrice(e.target.value)}
              className="w-16 px-2 py-1 bg-slate-50 border border-slate-200 rounded-sm text-xs font-medium focus:outline-none focus:border-teal-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
