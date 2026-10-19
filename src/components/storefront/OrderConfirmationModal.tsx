import React from 'react';
import { CheckoutResult, StoreSettings } from '../../types';
import { formatPKR, createWhatsAppLink } from '../../lib/utils';
import { CheckCircle2, Truck, MessageSquare, Printer, ArrowRight, ShieldCheck } from 'lucide-react';

interface OrderConfirmationModalProps {
  result: CheckoutResult | null;
  settings: StoreSettings;
  onClose: () => void;
  onOpenTracking: (orderNumber: string) => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  result,
  settings,
  onClose,
  onOpenTracking
}) => {
  if (!result) return null;

  const whatsappMessage = `Assalam-o-Alaikum! I have placed Order ${result.order_number} on ${settings.store_name} for ${formatPKR(result.total_amount_pkr)} via Cash on Delivery. Please confirm dispatch details.`;
  const whatsappUrl = createWhatsAppLink(settings.support_whatsapp || '03001234567', whatsappMessage);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-zinc-200 z-10 p-6 sm:p-8 text-center space-y-6">
        
        {/* Success Icon */}
        <div className="mx-auto w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Order Successfully Placed
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-950 font-heading mt-1">
            Thank you for shopping with ZULF STORE!
          </h2>
          <p className="text-xs text-zinc-500 mt-1.5">
            Your Cash on Delivery order has been registered and inventory has been reserved.
          </p>
        </div>

        {/* Order Card */}
        <div className="p-4 bg-zinc-50 rounded-lg border border-zinc-200 text-left space-y-2.5">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
            <span className="text-xs text-zinc-500 font-medium">Public Order Number:</span>
            <span className="font-mono font-bold text-sm text-zinc-950 tracking-wider">
              {result.order_number}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-500">Payment Method:</span>
            <span className="font-semibold text-zinc-900 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Cash on Delivery (COD)</span>
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-500">Shipping Delivery:</span>
            <span className="font-semibold text-zinc-900">
              {result.shipping_fee_pkr === 0 ? 'FREE' : formatPKR(result.shipping_fee_pkr)}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm font-bold text-zinc-950 pt-2 border-t border-zinc-200">
            <span>Payable at Doorstep:</span>
            <span className="text-emerald-700">{formatPKR(result.total_amount_pkr)}</span>
          </div>
        </div>

        {/* Dispatch notice */}
        <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg text-left flex items-start gap-3 text-xs text-blue-900">
          <Truck className="w-4 h-4 shrink-0 text-blue-700 mt-0.5" />
          <p>
            Our dispatch team will call or WhatsApp you to verify delivery address prior to booking with Trax / TCS. Standard transit takes <strong>2-4 business days</strong>.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-2.5 pt-1">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Confirm Order on WhatsApp</span>
          </a>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenTracking(result.order_number);
              }}
              className="py-2.5 px-3 border border-zinc-200 hover:border-zinc-300 text-zinc-700 rounded-lg font-medium text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Track Status</span>
            </button>

            <button
              onClick={() => window.print()}
              className="py-2.5 px-3 border border-zinc-200 hover:border-zinc-300 text-zinc-700 rounded-lg font-medium text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Receipt</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2.5 text-xs font-semibold text-zinc-500 hover:text-black transition-colors cursor-pointer"
          >
            Continue Browsing ZULF STORE
          </button>
        </div>

      </div>
    </div>
  );
};
