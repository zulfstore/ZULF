import React, { useState } from 'react';
import { Product } from '../../types';
import { formatPKR } from '../../lib/utils';
import { X, ShieldCheck, Truck, RefreshCw, Minus, Plus, ShoppingBag, Check } from 'lucide-react';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, selectedVariant?: string) => void;
  onDirectBuy: (product: Product, quantity: number, selectedVariant?: string) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onDirectBuy
}) => {
  if (!product) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    if (product.variants) {
      product.variants.forEach(v => {
        if (v.options && v.options.length > 0) {
          initial[v.name] = v.options[0];
        }
      });
    }
    return initial;
  });

  const [activeTab, setActiveTab] = useState<'desc' | 'shipping' | 'sizing'>('desc');
  const [isAddedFeedback, setIsAddedFeedback] = useState(false);

  const images = product.images && product.images.length > 0
    ? product.images
    : ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80'];

  const hasDiscount = product.compare_at_price_pkr && product.compare_at_price_pkr > product.price_pkr;
  const savingsPkr = hasDiscount ? product.compare_at_price_pkr! - product.price_pkr : 0;
  const isOutOfStock = product.inventory_quantity <= 0;

  const variantString = Object.entries(selectedVariants)
    .map(([key, val]) => `${key}: ${val}`)
    .join(' | ');

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    onAddToCart(product, quantity, variantString || undefined);
    setIsAddedFeedback(true);
    setTimeout(() => {
      setIsAddedFeedback(false);
    }, 1800);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    onDirectBuy(product, quantity, variantString || undefined);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      {/* Modal backdrop */}
      <div className="fixed inset-0" onClick={onClose}></div>

      {/* Modal Content */}
      <div className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full overflow-hidden border border-zinc-200 z-10 max-h-[92vh] flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 p-2 bg-white/90 hover:bg-white text-zinc-500 hover:text-black rounded-full shadow-xs border border-zinc-200 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left Column: Image Gallery */}
        <div className="md:w-1/2 p-4 sm:p-6 bg-zinc-50 flex flex-col justify-between border-b md:border-b-0 md:border-r border-zinc-200">
          <div className="aspect-[3/4] w-full rounded-lg overflow-hidden bg-white border border-zinc-200 shadow-xs relative">
            <img
              src={images[activeImageIndex] || images[0]}
              alt={product.title}
              className="w-full h-full object-cover object-center"
            />
            {hasDiscount && (
              <span className="absolute top-3 left-3 bg-zinc-950 text-white text-[11px] font-bold px-2.5 py-1 rounded tracking-wider uppercase">
                Save {formatPKR(savingsPkr)}
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-16 h-16 rounded-md overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                    activeImageIndex === idx ? 'border-zinc-950 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Info & Actions */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto max-h-[60vh] md:max-h-[85vh]">
          <div className="space-y-5">
            {/* Category & Title */}
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-600">
                  {product.category}
                </span>
                <span className="text-[11px] font-mono text-zinc-600">SKU: {product.sku}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 font-heading mt-1">
                {product.title}
              </h2>
            </div>

            {/* Price section */}
            <div className="flex items-baseline gap-3 pb-3 border-b border-zinc-100">
              <span className="text-2xl font-bold text-zinc-950">
                {formatPKR(product.price_pkr)}
              </span>
              {hasDiscount && (
                <span className="text-sm text-zinc-600 line-through">
                  {formatPKR(product.compare_at_price_pkr!)}
                </span>
              )}
              {isOutOfStock ? (
                <span className="ml-auto text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded">
                  Out of Stock
                </span>
              ) : (
                <span className="ml-auto text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded">
                  In Stock ({product.inventory_quantity} available)
                </span>
              )}
            </div>

            {/* Variants Selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-4 pt-1">
                {product.variants.map((v) => (
                  <div key={v.name} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-zinc-800">Select {v.name}:</span>
                      <span className="text-zinc-600 font-medium">{selectedVariants[v.name]}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {v.options.map((opt) => {
                        const isSelected = selectedVariants[v.name] === opt;
                        return (
                          <button
                            key={opt}
                            onClick={() => setSelectedVariants(prev => ({ ...prev, [v.name]: opt }))}
                            className={`px-3 py-1.5 text-xs font-medium rounded border transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-zinc-950 text-white border-zinc-950 shadow-xs'
                                : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-400'
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 pt-1">
              <span className="text-xs font-semibold text-zinc-800">Quantity:</span>
              <div className="inline-flex items-center border border-zinc-200 rounded-md bg-zinc-50">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="p-2 text-zinc-600 hover:text-black disabled:opacity-30 cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center text-xs font-bold text-zinc-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.inventory_quantity, quantity + 1))}
                  disabled={quantity >= product.inventory_quantity || isOutOfStock}
                  className="p-2 text-zinc-600 hover:text-black disabled:opacity-30 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Actions: Add to Cart & Buy Now */}
            <div className="space-y-2.5 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`w-full py-3 px-4 rounded-lg font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isOutOfStock
                    ? 'bg-zinc-200 text-zinc-600 cursor-not-allowed'
                    : isAddedFeedback
                    ? 'bg-emerald-600 text-white'
                    : 'bg-zinc-950 text-white hover:bg-black shadow-sm'
                }`}
              >
                {isAddedFeedback ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>{isOutOfStock ? 'Sold Out' : 'Add to Cart'}</span>
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="w-full py-2.5 px-4 rounded-lg font-semibold text-xs tracking-wider uppercase border border-zinc-300 text-zinc-800 hover:bg-zinc-50 transition-colors cursor-pointer"
              >
                Order with Cash on Delivery
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-2 pt-3 text-[11px] text-zinc-600 border-t border-zinc-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-zinc-700 shrink-0" />
                <span>Cash on Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-zinc-700 shrink-0" />
                <span>2-4 Days Trax/TCS</span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-zinc-700 shrink-0" />
                <span>7-Day Easy Exchange</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 flex items-center justify-center text-xs font-bold text-zinc-700">🇵🇰</span>
                <span>Crafted for Pakistan</span>
              </div>
            </div>

            {/* Details tabs */}
            <div className="pt-3 border-t border-zinc-100 text-xs">
              <div className="flex gap-4 border-b border-zinc-200 pb-2 mb-3">
                <button
                  onClick={() => setActiveTab('desc')}
                  className={`font-semibold pb-1 border-b-2 transition-colors cursor-pointer ${
                    activeTab === 'desc' ? 'border-zinc-950 text-zinc-950' : 'border-transparent text-zinc-600'
                  }`}
                >
                  Description
                </button>
                <button
                  onClick={() => setActiveTab('shipping')}
                  className={`font-semibold pb-1 border-b-2 transition-colors cursor-pointer ${
                    activeTab === 'shipping' ? 'border-zinc-950 text-zinc-950' : 'border-transparent text-zinc-600'
                  }`}
                >
                  Shipping & COD
                </button>
              </div>

              {activeTab === 'desc' && (
                <p className="text-zinc-600 leading-relaxed">
                  {product.description || 'Premium material and minimalist craftsmanship designed for longevity.'}
                </p>
              )}

              {activeTab === 'shipping' && (
                <p className="text-zinc-600 leading-relaxed">
                  Fast delivery across all cities in Pakistan via our verified courier partners (Trax, Leopard, TCS). Cash on delivery is accepted at your doorstep. Standard delivery PKR 250, free on orders above PKR 3,500.
                </p>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
