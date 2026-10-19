import React from 'react';
import { Order, Product } from '../../types';
import { analyticsService } from '../../services/analyticsService';
import { formatPKR } from '../../lib/utils';
import { 
  TrendingUp, 
  ShoppingBag, 
  Truck, 
  RefreshCw, 
  AlertTriangle, 
  MapPin, 
  ShieldAlert,
  Coins,
  CheckCircle2,
  DollarSign
} from 'lucide-react';

interface AnalyticsDashboardProps {
  orders: Order[];
  products: Product[];
  onSelectProductTab: () => void;
  onSelectOrderTab: () => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  orders,
  products,
  onSelectProductTab,
  onSelectOrderTab
}) => {
  const metrics = analyticsService.calculateMetrics(orders, products);

  const lowStockProducts = products.filter(p => p.inventory_quantity <= 5);

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div>
        <h2 className="text-xl font-bold text-zinc-950 font-heading">
          Store Operations & Financial Analytics
        </h2>
        <p className="text-xs text-zinc-500 mt-0.5">
          Authoritative real-time metrics for Pakistan operations. Note: Delivered Cash Sales represent collected COD revenue; Gross Bookings represent initial order values before courier settlement.
        </p>
      </div>

      {/* 2. Top KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Delivered Net Sales */}
        <div className="p-4 bg-white rounded-xl border border-zinc-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-[10px] font-bold uppercase tracking-wider">Delivered Realized Sales</span>
            <div className="p-1.5 bg-emerald-50 text-emerald-700 rounded-md">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-zinc-950 font-heading">
            {formatPKR(metrics.deliveredNetSalesPkr)}
          </p>
          <p className="text-[11px] text-emerald-800 font-medium">
            Cash collected from {metrics.deliveredOrdersCount} fulfilled orders
          </p>
        </div>

        {/* Gross Booked Value */}
        <div className="p-4 bg-white rounded-xl border border-zinc-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-[10px] font-bold uppercase tracking-wider">Gross Booked Value</span>
            <div className="p-1.5 bg-zinc-100 text-zinc-700 rounded-md">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-zinc-950 font-heading">
            {formatPKR(metrics.grossBookedValuePkr)}
          </p>
          <p className="text-[11px] text-zinc-600">
            Total of all {metrics.totalOrdersCount} placed orders
          </p>
        </div>

        {/* Pending Fulfillment */}
        <div className="p-4 bg-white rounded-xl border border-zinc-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-[10px] font-bold uppercase tracking-wider">Pending Fulfillment</span>
            <div className="p-1.5 bg-amber-50 text-amber-700 rounded-md">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-zinc-950 font-heading">
            {metrics.pendingFulfillmentCount}
          </p>
          <p className="text-[11px] text-amber-800 font-medium">
            Awaiting phone confirmation or packaging
          </p>
        </div>

        {/* Return Rate % */}
        <div className="p-4 bg-white rounded-xl border border-zinc-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-[10px] font-bold uppercase tracking-wider">Return Rate (RTO)</span>
            <div className="p-1.5 bg-rose-50 text-rose-700 rounded-md">
              <RefreshCw className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-zinc-950 font-heading">
            {metrics.returnRatePercentage}%
          </p>
          <p className="text-[11px] text-zinc-600">
            {metrics.returnedOrdersCount} returned of {metrics.deliveredOrdersCount + metrics.returnedOrdersCount} completed
          </p>
        </div>
      </div>

      {/* 3. Middle Grid: Order Pipeline & Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Pipeline & City Breakdown */}
        <div className="p-5 bg-white rounded-xl border border-zinc-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-zinc-950 uppercase tracking-wider font-heading">
            Top Destination Cities in Pakistan
          </h3>

          <div className="space-y-3">
            {metrics.topCities.map((item, idx) => {
              const maxCity = metrics.topCities[0]?.count || 1;
              const percent = Math.round((item.count / maxCity) * 100);

              return (
                <div key={item.city} className="space-y-1 text-xs">
                  <div className="flex justify-between items-center text-zinc-800">
                    <span className="font-semibold flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{item.city}</span>
                    </span>
                    <span className="font-mono text-zinc-500">
                      {item.count} order{item.count > 1 ? 's' : ''} ({formatPKR(item.totalPkr)})
                    </span>
                  </div>
                  <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-zinc-900 h-1.5 rounded-full"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
            <span>In-Transit Active Parcels: <strong>{metrics.inTransitCount}</strong></span>
            <button
              onClick={onSelectOrderTab}
              className="text-zinc-900 font-bold hover:underline"
            >
              View Order Pipeline →
            </button>
          </div>
        </div>

        {/* Low Stock Warning */}
        <div className="p-5 bg-white rounded-xl border border-zinc-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-950 uppercase tracking-wider font-heading flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Inventory Stock Urgency</span>
            </h3>
            <span className="text-xs bg-amber-50 text-amber-800 border border-amber-200 font-bold px-2 py-0.5 rounded">
              {lowStockProducts.length} Needs Attention
            </span>
          </div>

          {lowStockProducts.length === 0 ? (
            <div className="py-8 text-center text-xs text-zinc-500">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <p className="font-semibold text-zinc-800">All products have sufficient inventory.</p>
            </div>
          ) : (
            <div className="divide-y divide-zinc-100 max-h-56 overflow-y-auto">
              {lowStockProducts.map(p => (
                <div key={p.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-zinc-900">{p.title}</p>
                    <p className="text-[10px] text-zinc-400 font-mono">SKU: {p.sku}</p>
                  </div>
                  <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                    p.inventory_quantity === 0
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}>
                    {p.inventory_quantity === 0 ? 'SOLD OUT' : `${p.inventory_quantity} left`}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="pt-2 border-t border-zinc-100 flex justify-end">
            <button
              onClick={onSelectProductTab}
              className="text-xs text-zinc-900 font-bold hover:underline"
            >
              Update Inventory Counts →
            </button>
          </div>
        </div>

      </div>

      {/* 4. Business Constraint Check: Budget & Lean Setup */}
      <div className="p-4 bg-zinc-900 text-white rounded-xl text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border border-zinc-800">
        <div className="space-y-0.5">
          <p className="font-bold flex items-center gap-1.5 text-white">
            <Coins className="w-4 h-4 text-emerald-400" />
            <span>Store Budget Constraint: Under PKR 30,000 Setup Budget</span>
          </p>
          <p className="text-zinc-400 text-[11px]">
            Serverless Vercel host + Supabase free tier Postgres/Auth/Storage + zero initial gateway fees via COD.
          </p>
        </div>
        <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 px-2.5 py-1 rounded text-[11px] font-bold">
          Budget Healthy: ~Rs. 0 Incurred
        </span>
      </div>

    </div>
  );
};
