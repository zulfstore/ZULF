import React, { useState } from 'react';
import { StoreSettings, Order } from '../../types';
import { orderService } from '../../services/orderService';
import { formatPKR, formatDate, createWhatsAppLink } from '../../lib/utils';
import { ORDER_STATUS_CONFIG } from '../../lib/constants';
import { 
  X, 
  Truck, 
  RefreshCw, 
  Phone, 
  Search, 
  CheckCircle2, 
  ExternalLink,
  MapPin,
  Mail,
  Clock,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface StaticPagesModalProps {
  initialTab?: 'shipping' | 'return' | 'contact' | 'tracking';
  initialOrderNumber?: string;
  settings: StoreSettings;
  onClose: () => void;
}

export const StaticPagesModal: React.FC<StaticPagesModalProps> = ({
  initialTab = 'shipping',
  initialOrderNumber = '',
  settings,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'shipping' | 'return' | 'contact' | 'tracking'>(initialTab);
  
  // Tracking form states
  const [trackOrderNumber, setTrackOrderNumber] = useState(initialOrderNumber);
  const [trackPhone, setTrackPhone] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleSearchOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError(null);
    setSearchedOrder(null);

    if (!trackOrderNumber.trim()) {
      setSearchError('Please enter your order number (e.g. ZULF-2610-A91B2)');
      return;
    }

    if (!trackPhone.trim()) {
      setSearchError('Please enter the mobile phone number used during checkout.');
      return;
    }

    setIsSearching(true);
    try {
      const found = await orderService.lookupOrder(trackOrderNumber, trackPhone);
      if (found) {
        setSearchedOrder(found);
      } else {
        setSearchError('No matching order found. Please verify your order number and phone number.');
      }
    } catch {
      setSearchError('Failed to lookup order status. Please contact support.');
    } finally {
      setIsSearching(false);
    }
  };

  const whatsappUrl = createWhatsAppLink(
    settings.support_whatsapp || '03001234567',
    'Hello ZULF STORE team, I need assistance with an order or product inquiry.'
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden border border-zinc-200 z-10 max-h-[92vh] flex flex-col">
        {/* Modal Header & Tabs */}
        <div className="p-4 sm:p-5 border-b border-zinc-200 bg-zinc-50 flex items-center justify-between">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('tracking')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'tracking' ? 'bg-zinc-950 text-white' : 'text-zinc-600 hover:text-black hover:bg-zinc-200/50'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Track Order</span>
            </button>
            <button
              onClick={() => setActiveTab('shipping')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                activeTab === 'shipping' ? 'bg-zinc-950 text-white' : 'text-zinc-600 hover:text-black hover:bg-zinc-200/50'
              }`}
            >
              Shipping & COD
            </button>
            <button
              onClick={() => setActiveTab('return')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                activeTab === 'return' ? 'bg-zinc-950 text-white' : 'text-zinc-600 hover:text-black hover:bg-zinc-200/50'
              }`}
            >
              7-Day Returns
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                activeTab === 'contact' ? 'bg-zinc-950 text-white' : 'text-zinc-600 hover:text-black hover:bg-zinc-200/50'
              }`}
            >
              Contact Us
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-500 hover:text-black rounded-md hover:bg-zinc-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* TAB 1: ORDER TRACKING */}
          {activeTab === 'tracking' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-bold text-zinc-950 font-heading">
                  Track Your Parcel
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Check live dispatch, courier consignment number, and transit progress across Pakistan.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSearchOrder} className="p-4 bg-zinc-50 rounded-lg border border-zinc-200 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-800 mb-1">
                      Order Number
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. ZULF-2610-A91B2"
                      value={trackOrderNumber}
                      onChange={(e) => setTrackOrderNumber(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-md focus:outline-none focus:border-zinc-900 font-mono uppercase"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-800 mb-1">
                      Customer Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="0300 1234567"
                      value={trackPhone}
                      onChange={(e) => setTrackPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-md focus:outline-none focus:border-zinc-900"
                    />
                  </div>
                </div>

                {searchError && (
                  <p className="text-xs text-rose-600 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{searchError}</span>
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSearching}
                  className="w-full py-2.5 px-4 bg-zinc-950 text-white rounded-md font-semibold text-xs uppercase tracking-wider hover:bg-black transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>{isSearching ? 'Looking up order...' : 'Check Live Status'}</span>
                </button>
              </form>

              {/* Tracking Result Card */}
              {searchedOrder && (
                <div className="p-4 bg-white border-2 border-zinc-900 rounded-lg space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-zinc-200">
                    <div>
                      <span className="text-xs font-mono font-bold text-zinc-950">
                        {searchedOrder.order_number}
                      </span>
                      <p className="text-[11px] text-zinc-500">
                        Placed on {formatDate(searchedOrder.created_at)}
                      </p>
                    </div>

                    <span className={`text-xs font-bold px-2.5 py-1 rounded-md border ${
                      ORDER_STATUS_CONFIG[searchedOrder.order_status]?.badgeClass || 'bg-zinc-100 text-zinc-800'
                    }`}>
                      {ORDER_STATUS_CONFIG[searchedOrder.order_status]?.label || searchedOrder.order_status}
                    </span>
                  </div>

                  {/* Status description */}
                  <p className="text-xs text-zinc-700 bg-zinc-50 p-2.5 rounded border border-zinc-200">
                    {ORDER_STATUS_CONFIG[searchedOrder.order_status]?.desc}
                  </p>

                  {/* Courier Consignment Info */}
                  {searchedOrder.tracking_number ? (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs space-y-1">
                      <div className="flex items-center justify-between font-semibold text-emerald-950">
                        <span>Courier: {searchedOrder.courier_partner || 'Trax Logistics'}</span>
                        <span className="font-mono">{searchedOrder.tracking_number}</span>
                      </div>
                      {searchedOrder.tracking_url && (
                        <a
                          href={searchedOrder.tracking_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-emerald-700 font-bold hover:underline pt-1"
                        >
                          <span>Open Courier Website Tracking</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  ) : (
                    <div className="p-2.5 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800">
                      Courier consignment number will be issued once the parcel is packed and scanned by Trax/TCS riders.
                    </div>
                  )}

                  {/* Order Financials */}
                  <div className="text-xs space-y-1 text-zinc-600 pt-1 border-t border-zinc-100">
                    <div className="flex justify-between">
                      <span>Destination City:</span>
                      <span className="font-semibold text-zinc-900">{searchedOrder.shipping_city}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cash on Delivery Amount:</span>
                      <span className="font-bold text-zinc-950">{formatPKR(searchedOrder.total_amount_pkr)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SHIPPING & DELIVERY POLICY */}
          {activeTab === 'shipping' && (
            <div className="space-y-4 text-xs leading-relaxed text-zinc-600">
              <h3 className="text-base font-bold text-zinc-950 font-heading">
                Shipping & Cash on Delivery (Pakistan)
              </h3>
              
              <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg space-y-1">
                <p className="font-semibold text-zinc-900">Standard Delivery Timeline:</p>
                <p>2 to 4 business days across Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, and 100+ other cities.</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-zinc-900">Delivery Rates & Rules</h4>
                <ul className="list-disc list-inside space-y-1 pl-1">
                  <li>Flat delivery fee: <strong>Rs. {settings.standard_shipping_fee}</strong> nationwide.</li>
                  <li><strong>FREE Nationwide Delivery</strong> on all orders equal to or exceeding <strong>Rs. {settings.free_shipping_threshold.toLocaleString()}</strong>.</li>
                  <li>No hidden charges or fuel surcharges at doorstep.</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-zinc-900">Cash on Delivery (COD) Guidelines</h4>
                <ul className="list-disc list-inside space-y-1 pl-1">
                  <li>Please ensure exact payment is ready when the courier rider arrives.</li>
                  <li>Our rider will provide you with the official printed courier receipt upon collecting cash.</li>
                  <li>Maximum COD order value is capped at Rs. {settings.cod_max_limit.toLocaleString()} to curb fraudulent booking.</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-zinc-900">Authorized Logistics Partners</h4>
                <p>We work exclusively with certified tier-1 Pakistani logistics companies: Trax Logistics, TCS Express, Leopards Courier, and Call Courier.</p>
              </div>
            </div>
          )}

          {/* TAB 3: 7-DAY RETURN & EXCHANGE */}
          {activeTab === 'return' && (
            <div className="space-y-4 text-xs leading-relaxed text-zinc-600">
              <h3 className="text-base font-bold text-zinc-950 font-heading">
                7-Day Hassle-Free Exchange Policy
              </h3>

              <p>
                We want you to be completely satisfied with your ZULF STORE wardrobe. If an item does not fit or arrives flawed, we offer an easy 7-day replacement guarantee.
              </p>

              <div className="space-y-2">
                <h4 className="font-bold text-zinc-900">Eligibility Criteria:</h4>
                <ul className="list-disc list-inside space-y-1 pl-1">
                  <li>Item must be unworn, unwashed, and in its original packaging with tags intact.</li>
                  <li>Exchange request must be initiated within 7 calendar days of courier delivery.</li>
                  <li>Shoes/Chappals must be tried on carpeted surfaces with no sole scuffs.</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-zinc-900">How to Initiate:</h4>
                <p>
                  Simply send your order number and desired replacement size to our official WhatsApp support at <strong>{settings.support_whatsapp}</strong> or email <strong>{settings.support_email}</strong>. Our logistics team will arrange reverse-pickup or guidance within 24 hours.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: CONTACT & HELPLINE */}
          {activeTab === 'contact' && (
            <div className="space-y-5 text-xs text-zinc-600">
              <div>
                <h3 className="text-base font-bold text-zinc-950 font-heading">
                  Contact ZULF STORE Team
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Our customer service team is based in Lahore, Pakistan and active 6 days a week.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 bg-zinc-50 rounded-lg border border-zinc-200 space-y-1">
                  <div className="flex items-center gap-2 text-zinc-900 font-bold">
                    <Mail className="w-4 h-4 text-zinc-700" />
                    <span>Support Email</span>
                  </div>
                  <p className="text-zinc-600">{settings.support_email}</p>
                </div>

                <div className="p-3.5 bg-zinc-50 rounded-lg border border-zinc-200 space-y-1">
                  <div className="flex items-center gap-2 text-zinc-900 font-bold">
                    <Phone className="w-4 h-4 text-zinc-700" />
                    <span>Helpline Phone</span>
                  </div>
                  <p className="text-zinc-600">{settings.support_phone}</p>
                </div>

                <div className="p-3.5 bg-zinc-50 rounded-lg border border-zinc-200 space-y-1 sm:col-span-2">
                  <div className="flex items-center gap-2 text-zinc-900 font-bold">
                    <MapPin className="w-4 h-4 text-zinc-700" />
                    <span>Headquarters & Fulfillment Center</span>
                  </div>
                  <p className="text-zinc-600">{settings.store_address}</p>
                </div>
              </div>

              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-950 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <p className="font-bold">Need instant support regarding an active parcel?</p>
                  <p className="text-[11px] text-emerald-800">Our WhatsApp desk is active Mon-Sat (10:00 AM - 7:00 PM PKT).</p>
                </div>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-md uppercase tracking-wider shrink-0 transition-colors cursor-pointer"
                >
                  Open WhatsApp Chat
                </a>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
