import React, { useState } from 'react';
import { CartItem, StoreSettings, CheckoutResult } from '../../types';
import { formatPKR, validatePakistaniPhone } from '../../lib/utils';
import { PAKISTAN_CITIES } from '../../lib/constants';
import { checkoutService } from '../../services/checkoutService';
import { 
  X, 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  AlertCircle, 
  Lock, 
  CheckCircle2,
  ChevronRight,
  Info
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  settings: StoreSettings;
  onOrderSuccess: (result: CheckoutResult) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  settings,
  onOrderSuccess
}) => {
  if (!isOpen) return null;

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [shippingCity, setShippingCity] = useState(PAKISTAN_CITIES[0] || 'Karachi');
  const [orderNotes, setOrderNotes] = useState('');

  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'PAYFAST_PENDING'>('COD');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Phone validation check in real-time
  const phoneValidation = validatePakistaniPhone(customerPhone);

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price_pkr * item.quantity,
    0
  );
  const isFreeShipping = subtotal >= (settings.free_shipping_threshold || 3500);
  const shippingFee = isFreeShipping ? 0 : settings.standard_shipping_fee;
  const totalAmount = subtotal + shippingFee;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (items.length === 0) {
      setErrorMessage('Your cart is empty.');
      return;
    }

    if (!customerName.trim()) {
      setErrorMessage('Please provide your full name for courier delivery.');
      return;
    }

    if (!phoneValidation.isValid) {
      setErrorMessage(phoneValidation.error || 'Please enter a valid Pakistani mobile number.');
      return;
    }

    if (!shippingAddress.trim() || shippingAddress.trim().length < 8) {
      setErrorMessage('Please provide a complete street address with house/flat number.');
      return;
    }

    if (!shippingCity) {
      setErrorMessage('Please select a destination city.');
      return;
    }

    if (paymentMethod === 'PAYFAST_PENDING') {
      setErrorMessage('PayFast online gateway is currently pending merchant credential onboarding. Please select Cash on Delivery.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await checkoutService.processCheckout({
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_email: customerEmail || undefined,
        shipping_address: shippingAddress,
        shipping_city: shippingCity,
        order_notes: orderNotes || undefined,
        items: items.map(i => ({
          product_id: i.product.id,
          quantity: i.quantity,
          variant: i.selectedVariant
        }))
      });

      if (!result.success) {
        setErrorMessage(result.error || 'Failed to place order. Please try again.');
        setIsSubmitting(false);
      } else {
        setIsSubmitting(false);
        onOrderSuccess(result);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred during checkout.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden border border-zinc-200 z-10 max-h-[94vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-200 flex items-center justify-between bg-zinc-50/70">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-600">Secure Checkout</span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>Pakistan COD Active</span>
              </span>
            </div>
            <h3 className="text-lg font-bold text-zinc-950 font-heading">
              Complete Your Order
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-600 hover:text-black rounded-md hover:bg-zinc-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmitOrder} className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Error Message banner */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-2.5 text-xs text-rose-800">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Section 1: Customer Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 flex items-center gap-2">
              <span>1. Contact & Delivery Information</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-800 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Muhammad Zeeshan"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-md focus:outline-none focus:border-zinc-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-800 mb-1">
                  Mobile Number (for Courier SMS/Call) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="0300 1234567"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className={`w-full px-3 py-2 text-xs bg-white border rounded-md focus:outline-none ${
                    customerPhone && !phoneValidation.isValid
                      ? 'border-rose-400 focus:border-rose-500'
                      : 'border-zinc-200 focus:border-zinc-900'
                  }`}
                />
                {customerPhone && !phoneValidation.isValid ? (
                  <p className="text-[10px] text-rose-600 mt-1">{phoneValidation.error}</p>
                ) : (
                  <p className="text-[10px] text-zinc-600 mt-0.5">Format: 0300 1234567</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-800 mb-1">
                Email Address (Optional for e-receipt)
              </label>
              <input
                type="email"
                placeholder="zeeshan@example.com"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-md focus:outline-none focus:border-zinc-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-zinc-800 mb-1">
                  Complete Street Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="House #, Street #, Sector / Colony / Area"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-md focus:outline-none focus:border-zinc-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-800 mb-1">
                  City <span className="text-rose-500">*</span>
                </label>
                <select
                  value={shippingCity}
                  onChange={(e) => setShippingCity(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-md focus:outline-none focus:border-zinc-900 cursor-pointer font-medium"
                >
                  {PAKISTAN_CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-800 mb-1">
                Delivery Notes & Landmark (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Near Shell Pump, Call rider upon arrival"
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-md focus:outline-none focus:border-zinc-900"
              />
            </div>
          </div>

          {/* Section 2: Payment Method */}
          <div className="space-y-2.5 pt-2 border-t border-zinc-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
              2. Select Payment Method
            </h4>

            {/* COD Option */}
            <label className={`block p-3.5 border rounded-lg cursor-pointer transition-all ${
              paymentMethod === 'COD'
                ? 'border-zinc-950 bg-zinc-50 shadow-xs'
                : 'border-zinc-200 bg-white hover:border-zinc-300'
            }`}>
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'COD'}
                  onChange={() => setPaymentMethod('COD')}
                  className="mt-0.5 text-zinc-950 focus:ring-0"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-zinc-800" />
                      <span>Cash on Delivery (COD)</span>
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                      Recommended
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-0.5">
                    Pay the courier rider in cash when the parcel reaches your door. Trax, TCS or Leopard tracking code provided.
                  </p>
                </div>
              </div>
            </label>

            {/* PayFast Option (Honest setup phase - not fake success) */}
            <label className="block p-3.5 border border-zinc-200 bg-zinc-50/50 rounded-lg cursor-not-allowed opacity-75">
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name="paymentMethod"
                  disabled
                  checked={paymentMethod === 'PAYFAST_PENDING'}
                  onChange={() => setPaymentMethod('PAYFAST_PENDING')}
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-zinc-700 flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-zinc-500" />
                      <span>PayFast Digital Gateway (Cards / Wallets)</span>
                    </span>
                    <span className="text-[10px] bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded">
                      Phase 2 Integration
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Requires live PayFast Merchant ID & Secured Key. Only authentic Cash on Delivery is active for this checkout.
                  </p>
                </div>
              </div>
            </label>
          </div>

          {/* Section 3: Authoritative Order Summary */}
          <div className="pt-2 border-t border-zinc-200 space-y-2 bg-zinc-50 p-3.5 rounded-lg border">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
              3. Order Summary ({items.length} item{items.length > 1 ? 's' : ''})
            </h4>

            <div className="space-y-1.5 text-xs text-zinc-600">
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span className="font-semibold text-zinc-900">{formatPKR(subtotal)}</span>
              </div>

              <div className="flex justify-between items-center">
                <span>Nationwide Shipping ({shippingCity}):</span>
                <span className="font-semibold text-zinc-900">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-700 font-bold">FREE (Above Rs. {settings.free_shipping_threshold.toLocaleString()})</span>
                  ) : (
                    formatPKR(shippingFee)
                  )}
                </span>
              </div>

              <div className="flex justify-between text-sm font-bold text-zinc-950 pt-2 border-t border-zinc-200">
                <span>Total Payable at Doorstep:</span>
                <span className="text-base text-zinc-950">{formatPKR(totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Action button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 bg-zinc-950 text-white rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-black transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Reserving Stock & Placing COD Order...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm Cash on Delivery Order — {formatPKR(totalAmount)}</span>
              </>
            )}
          </button>

          <p className="text-[11px] text-center text-zinc-600">
            By placing this order, you agree to receive SMS/WhatsApp delivery updates. Prices and inventory are verified by the server.
          </p>

        </form>
      </div>
    </div>
  );
};
