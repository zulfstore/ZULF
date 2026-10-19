import React, { useState } from 'react';
import { StoreSettings, Product, Order } from '../../types';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { OrderManager } from './OrderManager';
import { ProductManager } from './ProductManager';
import { StoreSettingsView } from './StoreSettingsView';
import { 
  TrendingUp, 
  ShoppingBag, 
  Layers, 
  Settings, 
  Layout, 
  ExternalLink, 
  LogOut, 
  Shield, 
  Menu, 
  X,
  Store,
  ChevronRight
} from 'lucide-react';

interface AdminLayoutProps {
  settings: StoreSettings;
  products: Product[];
  orders: Order[];
  adminEmail: string;
  onLogout: () => void;
  onGoToStorefront: () => void;
  onGoToBuilder: () => void;
  onProductsUpdated: (products: Product[]) => void;
  onOrdersUpdated: (orders: Order[]) => void;
  onSettingsUpdated: (settings: StoreSettings) => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  settings,
  products,
  orders,
  adminEmail,
  onLogout,
  onGoToStorefront,
  onGoToBuilder,
  onProductsUpdated,
  onOrdersUpdated,
  onSettingsUpdated
}) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'orders' | 'products' | 'settings'>('analytics');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const pendingOrdersCount = orders.filter(
    o => o.order_status === 'pending_confirmation' || o.order_status === 'confirmed'
  ).length;

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex">
      {/* 1. Sidebar (Desktop) */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-zinc-200 flex-col justify-between shrink-0 fixed inset-y-0 z-30">
        <div>
          {/* Logo / Brand header */}
          <div className="p-5 border-b border-zinc-200">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-zinc-950 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                Z
              </div>
              <div>
                <h1 className="font-bold text-sm text-zinc-950 font-heading">
                  {settings.store_name}
                </h1>
                <span className="text-[10px] text-zinc-500 font-mono block -mt-0.5">
                  Merchant Console
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 text-xs">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-medium transition-colors cursor-pointer ${
                activeTab === 'analytics'
                  ? 'bg-zinc-950 text-white shadow-xs'
                  : 'text-zinc-600 hover:bg-zinc-100 hover:text-black'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <TrendingUp className="w-4 h-4" />
                <span>Analytics & Revenue</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-medium transition-colors cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-zinc-950 text-white shadow-xs'
                  : 'text-zinc-600 hover:bg-zinc-100 hover:text-black'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-4 h-4" />
                <span>Orders & Fulfillment</span>
              </div>
              {pendingOrdersCount > 0 && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  activeTab === 'orders' ? 'bg-white text-zinc-950' : 'bg-amber-100 text-amber-800'
                }`}>
                  {pendingOrdersCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-medium transition-colors cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-zinc-950 text-white shadow-xs'
                  : 'text-zinc-600 hover:bg-zinc-100 hover:text-black'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Layers className="w-4 h-4" />
                <span>Products & Catalog</span>
              </div>
              <span className="text-[10px] text-zinc-400 font-mono">
                {products.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-medium transition-colors cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-zinc-950 text-white shadow-xs'
                  : 'text-zinc-600 hover:bg-zinc-100 hover:text-black'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Settings className="w-4 h-4" />
                <span>Store & Shipping Settings</span>
              </div>
            </button>
          </nav>

          {/* Quick shortcuts */}
          <div className="px-3 pt-4 border-t border-zinc-100 space-y-1 text-xs">
            <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
              Storefront Tools
            </span>
            <button
              onClick={onGoToBuilder}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-zinc-600 hover:bg-zinc-100 hover:text-black rounded-lg transition-colors cursor-pointer"
            >
              <Layout className="w-4 h-4 text-zinc-500" />
              <span>Visual Page Builder</span>
            </button>
            <button
              onClick={onGoToStorefront}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-zinc-600 hover:bg-zinc-100 hover:text-black rounded-lg transition-colors cursor-pointer"
            >
              <ExternalLink className="w-4 h-4 text-zinc-500" />
              <span>View Live Storefront</span>
            </button>
          </div>
        </div>

        {/* User & Logout footer */}
        <div className="p-4 border-t border-zinc-200 bg-zinc-50/50">
          <div className="flex items-center justify-between">
            <div className="overflow-hidden">
              <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">
                Signed in as
              </span>
              <p className="text-xs font-semibold text-zinc-900 truncate">
                {adminEmail}
              </p>
            </div>
            <button
              onClick={onLogout}
              className="p-1.5 text-zinc-500 hover:text-rose-600 rounded hover:bg-zinc-200/60 transition-colors cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <main className="flex-1 lg:pl-64 flex flex-col min-w-0">
        
        {/* Top Navbar */}
        <header className="bg-white border-b border-zinc-200 px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-1.5 text-zinc-600 lg:hidden rounded hover:bg-zinc-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-zinc-500 font-medium">ZULF STORE</span>
              <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
              <span className="font-bold text-zinc-950 uppercase tracking-wider">
                {activeTab}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onGoToBuilder}
              className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Layout className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Page Builder</span>
            </button>

            <button
              onClick={onGoToStorefront}
              className="px-3 py-1.5 bg-zinc-950 hover:bg-black text-white rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Store className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Storefront</span>
            </button>
          </div>
        </header>

        {/* View Container */}
        <div className="p-4 sm:p-8 max-w-7xl mx-auto w-full flex-1">
          {activeTab === 'analytics' && (
            <AnalyticsDashboard
              orders={orders}
              products={products}
              onSelectProductTab={() => setActiveTab('products')}
              onSelectOrderTab={() => setActiveTab('orders')}
            />
          )}

          {activeTab === 'orders' && (
            <OrderManager
              orders={orders}
              onOrdersUpdated={onOrdersUpdated}
            />
          )}

          {activeTab === 'products' && (
            <ProductManager
              products={products}
              onProductsUpdated={onProductsUpdated}
            />
          )}

          {activeTab === 'settings' && (
            <StoreSettingsView
              settings={settings}
              onSettingsUpdated={onSettingsUpdated}
            />
          )}
        </div>

      </main>

      {/* Mobile Sidebar overlay */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-64 bg-white p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
                <span className="font-bold text-sm text-zinc-950">ZULF STORE Admin</span>
                <button onClick={() => setIsMobileSidebarOpen(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="pt-4 space-y-1 text-xs">
                <button
                  onClick={() => { setActiveTab('analytics'); setIsMobileSidebarOpen(false); }}
                  className={`w-full text-left px-3 py-2 rounded-md font-medium ${
                    activeTab === 'analytics' ? 'bg-zinc-950 text-white' : 'text-zinc-600'
                  }`}
                >
                  Analytics & Revenue
                </button>
                <button
                  onClick={() => { setActiveTab('orders'); setIsMobileSidebarOpen(false); }}
                  className={`w-full text-left px-3 py-2 rounded-md font-medium ${
                    activeTab === 'orders' ? 'bg-zinc-950 text-white' : 'text-zinc-600'
                  }`}
                >
                  Orders & Fulfillment ({pendingOrdersCount})
                </button>
                <button
                  onClick={() => { setActiveTab('products'); setIsMobileSidebarOpen(false); }}
                  className={`w-full text-left px-3 py-2 rounded-md font-medium ${
                    activeTab === 'products' ? 'bg-zinc-950 text-white' : 'text-zinc-600'
                  }`}
                >
                  Products & Catalog ({products.length})
                </button>
                <button
                  onClick={() => { setActiveTab('settings'); setIsMobileSidebarOpen(false); }}
                  className={`w-full text-left px-3 py-2 rounded-md font-medium ${
                    activeTab === 'settings' ? 'bg-zinc-950 text-white' : 'text-zinc-600'
                  }`}
                >
                  Store Settings
                </button>
              </nav>
            </div>

            <button
              onClick={() => { onLogout(); setIsMobileSidebarOpen(false); }}
              className="w-full py-2 text-xs font-semibold text-rose-600 border border-rose-200 rounded-md"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
