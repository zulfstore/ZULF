import React, { useState } from 'react';
import { Order, OrderStatus } from '../../types';
import { orderService } from '../../services/orderService';
import { formatPKR, formatDate, formatPhoneDisplay, createWhatsAppLink } from '../../lib/utils';
import { ORDER_STATUS_CONFIG, COURIER_PARTNERS } from '../../lib/constants';
import { 
  Search, 
  Download, 
  Truck, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  MessageSquare, 
  Printer, 
  X, 
  Save, 
  RefreshCw,
  ShieldCheck,
  Phone,
  MapPin,
  FileSpreadsheet
} from 'lucide-react';

interface OrderManagerProps {
  orders: Order[];
  onOrdersUpdated: (orders: Order[]) => void;
}

export const OrderManager: React.FC<OrderManagerProps> = ({
  orders,
  onOrdersUpdated
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Filter orders
  const filteredOrders = orders.filter(o => {
    const matchesStatus = statusFilter === 'all' || o.order_status === statusFilter;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch = 
      !query ||
      o.order_number.toLowerCase().includes(query) ||
      o.customer_name.toLowerCase().includes(query) ||
      o.customer_phone.includes(query) ||
      o.shipping_city.toLowerCase().includes(query) ||
      (o.tracking_number && o.tracking_number.toLowerCase().includes(query));

    return matchesStatus && matchesSearch;
  });

  const handleExportCsv = () => {
    const csvContent = orderService.exportToCsv(filteredOrders);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `zulf_store_orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    const updated = await orderService.updateStatus(orderId, newStatus);
    if (updated) {
      const all = await orderService.getOrders();
      onOrdersUpdated(all);
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(updated);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-950 font-heading">
            Orders & COD Fulfillment
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Total {orders.length} orders • Real-time status transitions, courier booking & cash reconciliation.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="px-3.5 py-2 bg-white border border-zinc-300 hover:bg-zinc-50 text-zinc-800 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors shadow-xs cursor-pointer self-start sm:self-auto"
          title="Export orders to CSV for Trax/Leopards/TCS portal upload"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
          <span>Export Courier CSV</span>
        </button>
      </div>

      {/* 2. Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            statusFilter === 'all'
              ? 'bg-zinc-950 text-white'
              : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50'
          }`}
        >
          All Orders ({orders.length})
        </button>

        {Object.entries(ORDER_STATUS_CONFIG).map(([key, cfg]) => {
          const count = orders.filter(o => o.order_status === key).length;
          return (
            <button
              key={key}
              onClick={() => setStatusFilter(key)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                statusFilter === key
                  ? 'bg-zinc-950 text-white'
                  : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50'
              }`}
            >
              <span>{cfg.label}</span>
              <span className="text-[10px] opacity-75 font-mono">({count})</span>
            </button>
          );
        })}
      </div>

      {/* 3. Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          placeholder="Search by order #, phone, customer, city or CN..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-zinc-200 rounded-md focus:outline-none focus:border-zinc-950"
        />
      </div>

      {/* 4. Orders Table */}
      <div className="bg-white rounded-lg border border-zinc-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Order #</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3">City</th>
                <th className="py-3 px-3">COD Amount</th>
                <th className="py-3 px-3">Fulfillment Status</th>
                <th className="py-3 px-3">Courier</th>
                <th className="py-3 px-4 text-right">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-zinc-500">
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const statusCfg = ORDER_STATUS_CONFIG[order.order_status] || {
                    label: order.order_status,
                    badgeClass: 'bg-zinc-100 text-zinc-800'
                  };

                  return (
                    <tr 
                      key={order.id} 
                      onClick={() => setSelectedOrder(order)}
                      className="hover:bg-zinc-50/80 transition-colors cursor-pointer"
                    >
                      <td className="py-3 px-4 font-mono font-bold text-zinc-950">
                        {order.order_number}
                      </td>

                      <td className="py-3 px-3 text-zinc-500 whitespace-nowrap">
                        {formatDate(order.created_at)}
                      </td>

                      <td className="py-3 px-3">
                        <p className="font-semibold text-zinc-900">{order.customer_name}</p>
                        <p className="text-[11px] text-zinc-500 font-mono">
                          {formatPhoneDisplay(order.customer_phone)}
                        </p>
                      </td>

                      <td className="py-3 px-3 text-zinc-700 font-medium">
                        {order.shipping_city}
                      </td>

                      <td className="py-3 px-3 font-bold text-zinc-950">
                        {formatPKR(order.total_amount_pkr)}
                      </td>

                      <td className="py-3 px-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${statusCfg.badgeClass}`}>
                          {statusCfg.label}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        {order.tracking_number ? (
                          <div className="font-mono text-[11px] text-zinc-800">
                            <span className="text-zinc-500 text-[10px] block">{order.courier_partner}</span>
                            {order.tracking_number}
                          </div>
                        ) : (
                          <span className="text-zinc-400 text-[11px] italic">Unassigned</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOrder(order);
                          }}
                          className="px-2.5 py-1 text-xs font-semibold text-zinc-700 hover:text-black bg-zinc-100 hover:bg-zinc-200 rounded transition-colors cursor-pointer"
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Detailed Order Drawer / Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusChange={handleStatusChange}
          onOrderUpdated={(updated) => {
            setSelectedOrder(updated);
            orderService.getOrders().then(onOrdersUpdated);
          }}
        />
      )}

    </div>
  );
};

// ORDER DETAIL MODAL
interface OrderDetailModalProps {
  order: Order;
  onClose: () => void;
  onStatusChange: (id: string, status: OrderStatus) => Promise<void>;
  onOrderUpdated: (order: Order) => void;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  order,
  onClose,
  onStatusChange,
  onOrderUpdated
}) => {
  const [courierPartner, setCourierPartner] = useState(order.courier_partner || COURIER_PARTNERS[0].id);
  const [trackingNumber, setTrackingNumber] = useState(order.tracking_number || '');
  const [codReceived, setCodReceived] = useState(String(order.cod_received_pkr || 0));
  const [courierFee, setCourierFee] = useState(String(order.courier_handling_fee_pkr || 0));
  const [isSavingCourier, setIsSavingCourier] = useState(false);
  const [isSavingLedger, setIsSavingLedger] = useState(false);

  const statusCfg = ORDER_STATUS_CONFIG[order.order_status] || {
    label: order.order_status,
    badgeClass: 'bg-zinc-100 text-zinc-800'
  };

  const whatsappMessage = `Assalam-o-Alaikum ${order.customer_name}! This is ZULF STORE regarding your Cash on Delivery Order ${order.order_number} (Amount: ${formatPKR(order.total_amount_pkr)}).`;
  const whatsappUrl = createWhatsAppLink(order.customer_phone, whatsappMessage);

  const handleSaveCourier = async () => {
    if (!trackingNumber.trim()) return;
    setIsSavingCourier(true);
    try {
      const partnerObj = COURIER_PARTNERS.find(c => c.id === courierPartner);
      const trackingUrl = courierPartner === 'Trax' 
        ? `https://trax.pk/tracking?cn=${trackingNumber.trim()}`
        : courierPartner === 'Leopard'
        ? `https://leopardscourier.com/tracking?cn=${trackingNumber.trim()}`
        : `https://www.tcsexpress.com/tracking?cn=${trackingNumber.trim()}`;

      const updated = await orderService.updateCourier(
        order.id,
        partnerObj?.name || courierPartner,
        trackingNumber.trim(),
        trackingUrl
      );
      if (updated) onOrderUpdated(updated);
    } finally {
      setIsSavingCourier(false);
    }
  };

  const handleSaveLedger = async () => {
    setIsSavingLedger(true);
    try {
      const updated = await orderService.updateCodLedger(
        order.id,
        Number(codReceived) || 0,
        Number(courierFee) || 0
      );
      if (updated) onOrderUpdated(updated);
    } finally {
      setIsSavingLedger(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden border border-zinc-200 z-10 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-200 flex items-center justify-between bg-zinc-50">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-sm text-zinc-950">
                {order.order_number}
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${statusCfg.badgeClass}`}>
                {statusCfg.label}
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              Placed on {formatDate(order.created_at)}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="p-1.5 text-zinc-600 hover:text-black rounded hover:bg-zinc-200 transition-colors cursor-pointer"
              title="Print Order / Packing Slip"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-500 hover:text-black rounded hover:bg-zinc-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* Quick status updater */}
          <div className="p-3.5 bg-zinc-50 rounded-lg border border-zinc-200 flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="font-bold text-zinc-900 block">Transition Order Workflow Status:</span>
              <span className="text-[11px] text-zinc-500">{statusCfg.desc}</span>
            </div>

            <select
              value={order.order_status}
              onChange={(e) => onStatusChange(order.id, e.target.value as OrderStatus)}
              className="px-3 py-1.5 text-xs font-semibold bg-white border border-zinc-300 rounded-md focus:outline-none focus:border-zinc-950 cursor-pointer shadow-xs"
            >
              {Object.entries(ORDER_STATUS_CONFIG).map(([val, cfg]) => (
                <option key={val} value={val}>
                  {cfg.label}
                </option>
              ))}
            </select>
          </div>

          {/* Customer & Shipping Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-lg border border-zinc-200 bg-white">
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                Customer Information
              </span>
              <p className="font-bold text-zinc-950 text-sm">{order.customer_name}</p>
              <div className="flex items-center gap-1.5 text-zinc-700">
                <Phone className="w-3.5 h-3.5 text-zinc-400" />
                <span className="font-mono font-medium">{formatPhoneDisplay(order.customer_phone)}</span>
              </div>
              {order.customer_email && (
                <p className="text-zinc-500">{order.customer_email}</p>
              )}
              <div className="pt-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded font-semibold text-[11px] transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Send WhatsApp Message</span>
                </a>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                Delivery Destination
              </span>
              <div className="flex items-start gap-1.5 text-zinc-700">
                <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-zinc-950">{order.shipping_city}, Pakistan</p>
                  <p className="text-zinc-600 leading-relaxed mt-0.5">{order.shipping_address}</p>
                </div>
              </div>
              {order.order_notes && (
                <div className="p-2 bg-amber-50 rounded border border-amber-200 text-amber-900 mt-2">
                  <span className="font-bold">Customer Note:</span> {order.order_notes}
                </div>
              )}
            </div>
          </div>

          {/* Line Items */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              Ordered Products
            </span>
            <div className="divide-y divide-zinc-100 border border-zinc-200 rounded-lg overflow-hidden bg-white">
              {(order.items || []).map((item, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product_image_url || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=120&q=80'}
                      alt=""
                      className="w-10 h-12 object-cover rounded bg-zinc-100 border border-zinc-200"
                    />
                    <div>
                      <h5 className="font-bold text-zinc-950">{item.product_title}</h5>
                      <p className="text-[11px] text-zinc-500 font-mono">
                        SKU: {item.product_sku} {item.selected_variant ? `• ${item.selected_variant}` : ''}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-bold text-zinc-950">{formatPKR(item.line_total_pkr)}</span>
                    <span className="text-[11px] text-zinc-400 block">
                      {formatPKR(item.unit_price_pkr)} x {item.quantity}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Subtotal & Delivery calculations */}
            <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200 space-y-1">
              <div className="flex justify-between text-zinc-600">
                <span>Items Subtotal:</span>
                <span className="font-semibold text-zinc-900">{formatPKR(order.subtotal_pkr)}</span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>Nationwide Shipping:</span>
                <span className="font-semibold text-zinc-900">
                  {order.shipping_fee_pkr === 0 ? 'FREE' : formatPKR(order.shipping_fee_pkr)}
                </span>
              </div>
              <div className="flex justify-between font-bold text-zinc-950 pt-1 border-t border-zinc-200 text-sm">
                <span>Total Payable at Doorstep (COD):</span>
                <span>{formatPKR(order.total_amount_pkr)}</span>
              </div>
            </div>
          </div>

          {/* Courier Fulfillment Section */}
          <div className="p-4 bg-white rounded-lg border border-zinc-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                Courier Booking & Consignment Number (CN)
              </span>
              <span className="text-[10px] text-zinc-500">Trax, TCS, Leopards</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                  Courier Partner
                </label>
                <select
                  value={courierPartner}
                  onChange={(e) => setCourierPartner(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-md font-medium"
                >
                  {COURIER_PARTNERS.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                  Consignment Tracking Number
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. TRX-9481920 or LCS-849102"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs bg-white border border-zinc-200 rounded-md font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleSaveCourier}
                    disabled={isSavingCourier}
                    className="px-3 py-1.5 bg-zinc-950 text-white rounded-md font-semibold text-xs uppercase tracking-wider hover:bg-black transition-colors cursor-pointer"
                  >
                    {isSavingCourier ? 'Saving...' : 'Update CN'}
                  </button>
                </div>
              </div>
            </div>

            {order.tracking_url && (
              <a
                href={order.tracking_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-emerald-700 font-semibold hover:underline text-[11px]"
              >
                <span>Open Tracking on Courier Portal</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          {/* COD Financial Reconciliation */}
          <div className="p-4 bg-zinc-50 rounded-lg border border-zinc-200 space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              COD Cash Reconciliation
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <span className="text-[10px] text-zinc-500 block">Expected COD:</span>
                <span className="font-bold text-zinc-950">{formatPKR(order.cod_expected_pkr)}</span>
              </div>

              <div>
                <label className="text-[10px] text-zinc-500 block mb-0.5">Cash Realized (PKR):</label>
                <input
                  type="number"
                  value={codReceived}
                  onChange={(e) => setCodReceived(e.target.value)}
                  className="w-full px-2 py-1 bg-white border border-zinc-200 rounded text-xs font-semibold"
                />
              </div>

              <div>
                <label className="text-[10px] text-zinc-500 block mb-0.5">Courier Deduction (PKR):</label>
                <input
                  type="number"
                  value={courierFee}
                  onChange={(e) => setCourierFee(e.target.value)}
                  className="w-full px-2 py-1 bg-white border border-zinc-200 rounded text-xs font-semibold"
                />
              </div>

              <div>
                <span className="text-[10px] text-zinc-500 block">Shortfall/Deficit:</span>
                <span className={`font-bold ${order.cod_shortfall_pkr > 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                  {formatPKR(order.cod_shortfall_pkr)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSaveLedger}
              disabled={isSavingLedger}
              className="px-3 py-1.5 bg-zinc-900 text-white text-[11px] font-semibold rounded hover:bg-black transition-colors cursor-pointer"
            >
              {isSavingLedger ? 'Saving Ledger...' : 'Update Cash Ledger'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
