import React from 'react';
import { Product } from '../../types';
import { formatPKR } from '../../lib/utils';
import { Plus, Check, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onQuickAdd
}) => {
  const hasDiscount = product.compare_at_price_pkr && product.compare_at_price_pkr > product.price_pkr;
  const discountPercent = hasDiscount 
    ? Math.round(((product.compare_at_price_pkr! - product.price_pkr) / product.compare_at_price_pkr!) * 100) 
    : 0;

  const isOutOfStock = product.inventory_quantity <= 0;
  const isLowStock = !isOutOfStock && product.inventory_quantity <= 5;
  const mainImage = product.images[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="group relative flex flex-col bg-white border border-zinc-200/80 rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md hover:border-zinc-300">
      {/* Image Container with Badges */}
      <div 
        onClick={() => onSelect(product)}
        className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-100 cursor-pointer"
      >
        <img
          src={mainImage}
          alt={product.title}
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 items-start">
          {hasDiscount && (
            <span className="bg-zinc-950 text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-wider uppercase">
              Save {discountPercent}%
            </span>
          )}
          {product.is_featured && !hasDiscount && (
            <span className="bg-white/95 text-zinc-900 border border-zinc-200 text-[10px] font-semibold px-2 py-0.5 rounded tracking-wider uppercase backdrop-blur-xs">
              Curated
            </span>
          )}
          {isOutOfStock ? (
            <span className="bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
              Sold Out
            </span>
          ) : isLowStock ? (
            <span className="bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-semibold px-2 py-0.5 rounded">
              Only {product.inventory_quantity} left
            </span>
          ) : null}
        </div>

        {/* Quick View overlay button */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(product);
            }}
            className="bg-white/95 text-zinc-900 text-xs font-semibold px-3 py-2 rounded-md shadow-sm border border-zinc-200 flex items-center gap-1.5 hover:bg-white transition-all transform translate-y-2 group-hover:translate-y-0 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-600 mb-1">
            {product.category}
          </p>
          <h3 
            onClick={() => onSelect(product)}
            className="text-sm font-semibold text-zinc-900 line-clamp-1 group-hover:text-black cursor-pointer"
            title={product.title}
          >
            {product.title}
          </h3>
        </div>

        {/* Price & Action */}
        <div className="flex items-center justify-between pt-1 border-t border-zinc-100">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-zinc-950">
              {formatPKR(product.price_pkr)}
            </span>
            {hasDiscount && (
              <span className="text-[11px] text-zinc-600 line-through">
                {formatPKR(product.compare_at_price_pkr!)}
              </span>
            )}
          </div>

          <button
            onClick={() => {
              if (product.variants && product.variants.length > 0) {
                // If product has variants, open modal so user can pick size/color
                onSelect(product);
              } else {
                onQuickAdd(product);
              }
            }}
            disabled={isOutOfStock}
            className={`p-2 rounded-md border text-xs font-medium transition-colors cursor-pointer ${
              isOutOfStock
                ? 'bg-zinc-100 text-zinc-600 border-zinc-200 cursor-not-allowed'
                : 'bg-zinc-900 text-white border-zinc-900 hover:bg-black'
            }`}
            title={isOutOfStock ? 'Sold Out' : 'Add to Cart'}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
