/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Product, StoreSettings, Order, CartItem, CheckoutResult } from './types';
import { storeService } from './services/storeService';
import { orderService } from './services/orderService';
import { INITIAL_STORE_SETTINGS } from './data/mockData';

// Common Components
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { SetupBanner } from './components/common/SetupBanner';
import { SystemStatusModal } from './components/common/SystemStatusModal';

// Storefront Components
import { HomepageSectionRenderer } from './components/storefront/HomepageSectionRenderer';
import { ProductGrid } from './components/storefront/ProductGrid';
import { ProductModal } from './components/storefront/ProductModal';
import { CartDrawer } from './components/storefront/CartDrawer';
import { CheckoutModal } from './components/storefront/CheckoutModal';
import { OrderConfirmationModal } from './components/storefront/OrderConfirmationModal';
import { StaticPagesModal } from './components/storefront/StaticPagesModal';

// Admin & Builder Components
import { AdminAuthModal } from './components/admin/AdminAuthModal';
import { AdminLayout } from './components/admin/AdminLayout';
import { PageBuilder } from './components/builder/PageBuilder';

export default function App() {
  const [activeView, setActiveView] = useState<'storefront' | 'admin' | 'builder'>('storefront');

  // Main data states
  const [settings, setSettings] = useState<StoreSettings>(INITIAL_STORE_SETTINGS);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Storefront navigation & filtering
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const [searchQuery, setSearchQuery] = useState('');

  // Cart & checkout states
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [orderConfirmationResult, setOrderConfirmationResult] = useState<CheckoutResult | null>(null);

  // Modals
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [staticPageModalTab, setStaticPageModalTab] = useState<'shipping' | 'return' | 'contact' | 'tracking' | null>(null);
  const [trackingLookupNumber, setTrackingLookupNumber] = useState('');
  const [isSystemStatusOpen, setIsSystemStatusOpen] = useState(false);

  // Admin session authentication
  const [adminEmail, setAdminEmail] = useState<string | null>(() => {
    return sessionStorage.getItem('zulf_admin_session') || null;
  });
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState(false);

  // 1. Initial Load of Products, Settings, and Orders
  useEffect(() => {
    async function loadInitialData() {
      try {
        setIsLoading(true);
        const [loadedSettings, loadedProducts, loadedOrders] = await Promise.all([
          storeService.getSettings(),
          storeService.getActiveProducts(),
          orderService.getOrders()
        ]);

        setSettings(loadedSettings);
        setProducts(loadedProducts);
        setOrders(loadedOrders);
      } catch (err) {
        console.error('Failed to load store data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadInitialData();
  }, []);

  // Sync products when switching between views
  const refreshProducts = async () => {
    const list = activeView === 'admin' 
      ? await storeService.getAllProducts() 
      : await storeService.getActiveProducts();
    setProducts(list);
  };

  const refreshOrders = async () => {
    const list = await orderService.getOrders();
    setOrders(list);
  };

  // 2. Cart Operations
  const handleAddToCart = (product: Product, quantity = 1, selectedVariant?: string) => {
    setCartItems(prev => {
      const existingIdx = prev.findIndex(
        i => i.product.id === product.id && i.selectedVariant === selectedVariant
      );
      if (existingIdx > -1) {
        const copy = [...prev];
        copy[existingIdx].quantity += quantity;
        return copy;
      }
      return [...prev, { product, quantity, selectedVariant }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (productId: string, variant: string | undefined, delta: number) => {
    setCartItems(prev => {
      return prev
        .map(i => {
          if (i.product.id === productId && i.selectedVariant === variant) {
            const nextQty = i.quantity + delta;
            return nextQty > 0 ? { ...i, quantity: nextQty } : null;
          }
          return i;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveFromCart = (productId: string, variant: string | undefined) => {
    setCartItems(prev =>
      prev.filter(i => !(i.product.id === productId && i.selectedVariant === variant))
    );
  };

  const handleDirectBuy = (product: Product, quantity = 1, selectedVariant?: string) => {
    handleAddToCart(product, quantity, selectedVariant);
    setSelectedProduct(null);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  // 3. Checkout Completion Handler
  const handleOrderSuccess = async (result: CheckoutResult) => {
    setIsCheckoutOpen(false);
    setCartItems([]); // Empty cart on successful order
    setOrderConfirmationResult(result);
    // Refresh products to reflect decremented inventory
    await refreshProducts();
    await refreshOrders();
  };

  // 4. View Switching with Auth Protection for Admin
  const handleGoToAdmin = () => {
    if (adminEmail) {
      setActiveView('admin');
    } else {
      setIsAdminAuthModalOpen(true);
    }
  };

  const handleAdminAuthSuccess = (email: string) => {
    sessionStorage.setItem('zulf_admin_session', email);
    setAdminEmail(email);
    setIsAdminAuthModalOpen(false);
    setActiveView('admin');
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem('zulf_admin_session');
    setAdminEmail(null);
    setActiveView('storefront');
  };

  const totalCartCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);

  // Loading Screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin mb-4" />
        <h2 className="text-sm font-bold tracking-widest uppercase font-heading text-zinc-900">
          ZULF STORE
        </h2>
        <p className="text-xs text-zinc-500 mt-1">Preparing Pakistan-first experience...</p>
      </div>
    );
  }

  // VIEW 1: VISUAL HOMEPAGE BUILDER
  if (activeView === 'builder') {
    return (
      <PageBuilder
        settings={settings}
        products={products}
        onSettingsUpdated={(newSettings) => setSettings(newSettings)}
        onExitBuilder={() => setActiveView('storefront')}
        onSelectProduct={(p) => setSelectedProduct(p)}
        onQuickAdd={(p) => handleAddToCart(p, 1)}
      />
    );
  }

  // VIEW 2: ADMIN MANAGEMENT PORTAL
  if (activeView === 'admin' && adminEmail) {
    return (
      <AdminLayout
        settings={settings}
        products={products}
        orders={orders}
        adminEmail={adminEmail}
        onLogout={handleAdminLogout}
        onGoToStorefront={() => setActiveView('storefront')}
        onGoToBuilder={() => setActiveView('builder')}
        onProductsUpdated={(updated) => setProducts(updated)}
        onOrdersUpdated={(updated) => setOrders(updated)}
        onSettingsUpdated={(updated) => setSettings(updated)}
      />
    );
  }

  // VIEW 3: STOREFRONT (DEFAULT)
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#1E1E1E] flex flex-col selection:bg-zinc-950 selection:text-white">
      {/* 1. Setup status notice (if Supabase credentials are absent) */}
      <SetupBanner onOpenSystemStatus={() => setIsSystemStatusOpen(true)} />

      {/* 2. Header */}
      <Header
        settings={settings}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => {
          const el = document.getElementById('products');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenTracking={() => {
          setTrackingLookupNumber('');
          setStaticPageModalTab('tracking');
        }}
        onOpenPolicy={(tab) => setStaticPageModalTab(tab)}
        onNavigateCategory={(cat) => {
          setSelectedCategory(cat);
          const el = document.getElementById('products');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onGoToAdmin={handleGoToAdmin}
        onGoToBuilder={() => setActiveView('builder')}
        activeView={activeView}
      />

      {/* 3. Main Homepage Content: Whitelisted Sections + Catalog */}
      <main className="flex-1 space-y-12 sm:space-y-16">
        {/* Dynamic Builder Sections */}
        <HomepageSectionRenderer
          sections={settings.homepage_sections || []}
          products={products}
          settings={settings}
          onSelectProduct={(p) => setSelectedProduct(p)}
          onQuickAdd={(p) => handleAddToCart(p, 1)}
          onNavigateCategory={(cat) => {
            setSelectedCategory(cat);
            const el = document.getElementById('products');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* The Catalog Grid Section */}
        <ProductGrid
          products={products}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onSelectProduct={(p) => setSelectedProduct(p)}
          onQuickAdd={(p) => handleAddToCart(p, 1)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </main>

      {/* 4. Footer */}
      <Footer
        settings={settings}
        onOpenPolicy={(tab) => setStaticPageModalTab(tab)}
        onOpenTracking={() => {
          setTrackingLookupNumber('');
          setStaticPageModalTab('tracking');
        }}
        onNavigateCategory={(cat) => {
          setSelectedCategory(cat);
          const el = document.getElementById('products');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 5. Drawers and Modals */}
      
      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          onDirectBuy={handleDirectBuy}
        />
      )}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        settings={settings}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        settings={settings}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Order Confirmation Screen */}
      <OrderConfirmationModal
        result={orderConfirmationResult}
        settings={settings}
        onClose={() => setOrderConfirmationResult(null)}
        onOpenTracking={(ordNum) => {
          setOrderConfirmationResult(null);
          setTrackingLookupNumber(ordNum);
          setStaticPageModalTab('tracking');
        }}
      />

      {/* Static Policies & Order Tracking Modal */}
      {staticPageModalTab && (
        <StaticPagesModal
          initialTab={staticPageModalTab}
          initialOrderNumber={trackingLookupNumber}
          settings={settings}
          onClose={() => setStaticPageModalTab(null)}
        />
      )}

      {/* Admin Login Modal */}
      <AdminAuthModal
        isOpen={isAdminAuthModalOpen}
        onSuccess={handleAdminAuthSuccess}
        onCancel={() => setIsAdminAuthModalOpen(false)}
      />

      {/* System Status / Setup Guide Modal */}
      <SystemStatusModal
        isOpen={isSystemStatusOpen}
        onClose={() => setIsSystemStatusOpen(false)}
      />

    </div>
  );
}
