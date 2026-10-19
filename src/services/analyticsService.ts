import { Order, Product } from '../types';

export interface AnalyticsSummary {
  deliveredNetSalesPkr: number; // Actual cash collected from fulfilled/delivered orders
  grossBookedValuePkr: number; // Total value of all orders placed
  totalOrdersCount: number;
  deliveredOrdersCount: number;
  pendingFulfillmentCount: number;
  inTransitCount: number;
  returnedOrdersCount: number;
  returnRatePercentage: number;
  totalProductsCount: number;
  lowStockCount: number;
  outOfStockCount: number;
  topCities: { city: string; count: number; totalPkr: number }[];
}

export const analyticsService = {
  calculateMetrics(orders: Order[], products: Product[]): AnalyticsSummary {
    const totalOrdersCount = orders.length;

    let deliveredNetSalesPkr = 0;
    let grossBookedValuePkr = 0;
    let deliveredOrdersCount = 0;
    let inTransitCount = 0;
    let returnedOrdersCount = 0;
    let pendingFulfillmentCount = 0;

    const cityMap = new Map<string, { count: number; totalPkr: number }>();

    for (const ord of orders) {
      grossBookedValuePkr += ord.total_amount_pkr;

      if (ord.order_status === 'delivered') {
        deliveredOrdersCount++;
        deliveredNetSalesPkr += ord.cod_received_pkr || ord.total_amount_pkr;
      } else if (ord.order_status === 'dispatched') {
        inTransitCount++;
      } else if (ord.order_status === 'returned') {
        returnedOrdersCount++;
      } else if (ord.order_status === 'pending_confirmation' || ord.order_status === 'confirmed' || ord.order_status === 'packed') {
        pendingFulfillmentCount++;
      }

      // City aggregation
      const city = ord.shipping_city || 'Other';
      const existing = cityMap.get(city) || { count: 0, totalPkr: 0 };
      cityMap.set(city, {
        count: existing.count + 1,
        totalPkr: existing.totalPkr + ord.total_amount_pkr
      });
    }

    const completedOrReturned = deliveredOrdersCount + returnedOrdersCount;
    const returnRatePercentage = completedOrReturned > 0 
      ? Math.round((returnedOrdersCount / completedOrReturned) * 100 * 10) / 10 
      : 0;

    // Inventory metrics
    let lowStockCount = 0;
    let outOfStockCount = 0;

    for (const p of products) {
      if (p.inventory_quantity === 0) {
        outOfStockCount++;
      } else if (p.inventory_quantity <= 5) {
        lowStockCount++;
      }
    }

    const topCities = Array.from(cityMap.entries())
      .map(([city, stats]) => ({ city, ...stats }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      deliveredNetSalesPkr,
      grossBookedValuePkr,
      totalOrdersCount,
      deliveredOrdersCount,
      pendingFulfillmentCount,
      inTransitCount,
      returnedOrdersCount,
      returnRatePercentage,
      totalProductsCount: products.length,
      lowStockCount,
      outOfStockCount,
      topCities
    };
  }
};
