import React, { useState, useMemo } from 'react';
import { Product } from '../../types';
import { ProductCard } from './ProductCard';
import { PRODUCT_CATEGORIES } from '../../lib/constants';
import { SlidersHorizontal, Search, ArrowUpDown, X } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  selectedCategory,
  onSelectCategory,
  onSelectProduct,
  onQuickAdd,
  searchQuery,
  onSearchChange
}) => {
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'newest'>('featured');

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Category match
      const matchesCategory = 
        selectedCategory === 'All Products' || p.category === selectedCategory;

      // Search match
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch = 
        !query || 
        p.title.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query) ||
        p.sku?.toLowerCase().includes(query) ||
        p.category?.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price_pkr - b.price_pkr;
      if (sortBy === 'price-desc') return b.price_pkr - a.price_pkr;
      if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      // default: featured first
      return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
    });
  }, [products, selectedCategory, searchQuery, sortBy]);

  return (
    <section id="products" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* 1. Header with Title & Result Count */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-zinc-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-600">The Catalog</span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 font-heading mt-0.5">
            {selectedCategory === 'All Products' ? 'All Essentials' : selectedCategory}
          </h2>
        </div>

        {/* Search input & Sort dropdown */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 text-zinc-600 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search kurtas, leather, shoes..."
              className="w-full pl-9 pr-8 py-2 text-xs bg-white border border-zinc-200 rounded-md focus:outline-none focus:border-zinc-900 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-black cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="relative inline-flex items-center">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="appearance-none bg-white border border-zinc-200 text-zinc-800 text-xs py-2 pl-3 pr-8 rounded-md focus:outline-none focus:border-zinc-900 cursor-pointer font-medium"
            >
              <option value="featured">Featured First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">New Arrivals</option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 text-zinc-600 absolute right-2.5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* 2. Category Selector Pills */}
      <div className="py-6 flex items-center gap-2 overflow-x-auto no-scrollbar">
        {PRODUCT_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* 3. Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
              onQuickAdd={onQuickAdd}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="py-20 text-center bg-zinc-50 rounded-lg border border-dashed border-zinc-200 max-w-lg mx-auto">
          <p className="text-zinc-700 font-semibold text-base">No items found</p>
          <p className="text-xs text-zinc-600 mt-1">
            We couldn't find any products matching your current category or search filter.
          </p>
          <div className="mt-4 flex justify-center gap-3">
            <button
              onClick={() => {
                onSelectCategory('All Products');
                onSearchChange('');
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-zinc-900 rounded-md hover:bg-black transition-colors cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
