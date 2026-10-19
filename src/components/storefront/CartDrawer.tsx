import React from 'react';
import { CartItem, StoreSettings } from '../../types';
import { formatPKR } from '../../lib/utils';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Truck } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  settings: StoreSettings;
  onUpdateQuantity: (productId: string, variant: string | undefined, delta: number) => void;
  onRemoveItem: (productId: string, variant: string | undefined) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  settings,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout
}) => {
  if (!isOpen) return null;

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price_pkr * item.quantity,
    0
  );

  const freeShippingThreshold = settings.free_shipping_threshold || 3500;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  const shippingFee = items.length === 0 ? 0 : (isFreeShipping ? 0 : settings.standard_shipping_fee);
  const total = subtotal + shippingFee;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity" 
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-zinc-200">
          
          {/* 1. Header */}
          <div className="p-4 sm:p-5 border-b border-zinc-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-zinc-900" />
              <h3 className="text-base font-bold text-zinc-900 font-heading">
                Shopping Cart ({items.reduce((acc, i) => acc + i.quantity, 0)})
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-600 hover:text-black rounded-md hover:bg-zinc-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 2. Free Delivery Threshold Banner */}
          <div className="bg-zinc-50 px-5 py-3 border-b border-zinc-200 text-xs">
            {isFreeShipping ? (
              <div className="flex items-center gap-2 text-emerald-800 font-semibold">
                <Truck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>You unlocked FREE Nationwide Delivery across Pakistan!</span>
              </div>
            ) : (
              <div>
                <p className="text-zinc-600 mb-1.5 font-medium">
                  Add <span className="font-bold text-zinc-900">{formatPKR(amountNeededForFreeShipping)}</span> more for <strong className="text-zinc-900">FREE delivery</strong>!
                </p>
                <div className="w-full bg-zinc-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-zinc-900 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* 3. Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-zinc-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-600">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-semibold text-zinc-900">Your cart is empty</h4>
                <p className="text-xs text-zinc-600 max-w-xs">
                  Discover our raw linen kurtas, handcrafted Peshawari chappals, and everyday Pakistani essentials.
                </p>
                <button
                  onClick={onClose}
                  className="mt-2 text-xs font-semibold px-4 py-2 bg-zinc-900 text-white rounded-md hover:bg-black transition-colors cursor-pointer"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              items.map((item, idx) => (
                <div key={`${item.product.id}-${item.selectedVariant || ''}-${idx}`} className="py-4 flex gap-3">
                  {/* Thumbnail */}
                  <img
                    src={item.product.images[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=300&q=80'}
                    alt={item.product.title}
                    className="w-16 h-20 object-cover rounded bg-zinc-100 border border-zinc-200 shrink-0"
                  />

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-zinc-900 line-clamp-1">
                          {item.product.title}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.product.id, item.selectedVariant)}
                          className="text-zinc-600 hover:text-rose-600 p-0.5 cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {item.selectedVariant && (
                        <p className="text-[11px] text-zinc-600 mt-0.5">
                          {item.selectedVariant}
                        </p>
                      )}

                      <p className="text-xs font-bold text-zinc-950 mt-1">
                        {formatPKR(item.product.price_pkr)}
                      </p>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="inline-flex items-center border border-zinc-200 rounded bg-zinc-50">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.selectedVariant, -1)}
                          className="p-1 text-zinc-600 hover:text-black cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-semibold text-zinc-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.selectedVariant, 1)}
                          disabled={item.quantity >= item.product.inventory_quantity}
                          className="p-1 text-zinc-600 hover:text-black disabled:opacity-30 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-semibold text-zinc-800">
                        {formatPKR(item.product.price_pkr * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* 4. Footer Summary & Checkout */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-zinc-200 bg-zinc-50/50 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-zinc-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-zinc-900">{formatPKR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>Nationwide Delivery</span>
                  <span className="font-semibold text-zinc-900">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-700 font-bold uppercase tracking-wider text-[11px]">Free</span>
                    ) : (
                      formatPKR(shippingFee)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-zinc-950 pt-2 border-t border-zinc-200">
                  <span>Total Amount</span>
                  <span>{formatPKR(total)}</span>
                </div>
              </div>

              {/* COD reassurance */}
              <div className="flex items-center gap-1.5 text-[11px] text-zinc-600 bg-white p-2 rounded border border-zinc-200">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Cash on Delivery active. No advance payment required.</span>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full py-3 px-4 bg-zinc-950 text-white rounded-lg font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-black transition-colors shadow-sm cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
