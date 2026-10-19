import { Order, OrderStatus } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { getStoredOrders, saveStoredOrders } from '../lib/storage';

export const orderService = {
  /**
   * Fetch all orders for admin
   */
  async getOrders(): Promise<Order[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*, items:order_items(*)')
          .order('created_at', { ascending: false });

        if (!error && data) {
          return data as Order[];
        }
      } catch (err) {
        console.warn('Supabase getOrders failed, fallback to local:', err);
      }
    }
    return getStoredOrders();
  },

  /**
   * Get single order by ID
   */
  async getOrderById(id: string): Promise<Order | null> {
    const orders = await this.getOrders();
    return orders.find(o => o.id === id) || null;
  },

  /**
   * Customer public order tracking lookup
   * Only returns the matching order if order number and phone match
   */
  async lookupOrder(orderNumber: string, phone: string): Promise<Order | null> {
    const orders = await this.getOrders();
    const cleanPhone = phone.replace(/\D/g, '');
    const cleanSearchNum = orderNumber.trim().toUpperCase();

    return orders.find(o => {
      const matchNum = o.order_number.toUpperCase() === cleanSearchNum;
      const orderPhone = o.customer_phone.replace(/\D/g, '');
      const matchPhone = orderPhone.endsWith(cleanPhone) || cleanPhone.endsWith(orderPhone);
      return matchNum && matchPhone;
    }) || null;
  },

  /**
   * Update order status
   */
  async updateStatus(orderId: string, status: OrderStatus): Promise<Order | null> {
    const orders = getStoredOrders();
    const index = orders.findIndex(o => o.id === orderId);
    if (index === -1) return null;

    const currentOrder = orders[index];
    const now = new Date().toISOString();
    
    // Auto-update financial & payment status on delivery
    let paymentStatus = currentOrder.payment_status;
    let codReceived = currentOrder.cod_received_pkr;
    let deliveredAt = currentOrder.delivered_at;
    let dispatchedAt = currentOrder.dispatched_at;

    if (status === 'delivered') {
      paymentStatus = 'paid';
      codReceived = currentOrder.total_amount_pkr;
      deliveredAt = now;
    } else if (status === 'dispatched' && !dispatchedAt) {
      dispatchedAt = now;
    }

    const updated: Order = {
      ...currentOrder,
      order_status: status,
      payment_status: paymentStatus,
      cod_received_pkr: codReceived,
      cod_shortfall_pkr: Math.max(0, currentOrder.cod_expected_pkr - codReceived),
      dispatched_at: dispatchedAt,
      delivered_at: deliveredAt,
      updated_at: now
    };

    orders[index] = updated;
    saveStoredOrders(orders);

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase
          .from('orders')
          .update({
            order_status: status,
            payment_status: paymentStatus,
            cod_received_pkr: codReceived,
            cod_shortfall_pkr: updated.cod_shortfall_pkr,
            dispatched_at: dispatchedAt,
            delivered_at: deliveredAt,
            updated_at: now
          })
          .eq('id', orderId);
      } catch (err) {
        console.warn('Supabase status update failed:', err);
      }
    }

    return updated;
  },

  /**
   * Update courier tracking information
   */
  async updateCourier(
    orderId: string, 
    partner: string, 
    trackingNumber: string, 
    trackingUrl?: string
  ): Promise<Order | null> {
    const orders = getStoredOrders();
    const index = orders.findIndex(o => o.id === orderId);
    if (index === -1) return null;

    const updated: Order = {
      ...orders[index],
      courier_partner: partner,
      tracking_number: trackingNumber.trim(),
      tracking_url: trackingUrl?.trim() || undefined,
      order_status: orders[index].order_status === 'pending_confirmation' ? 'dispatched' : orders[index].order_status,
      dispatched_at: orders[index].dispatched_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    orders[index] = updated;
    saveStoredOrders(orders);

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase
          .from('orders')
          .update({
            courier_partner: partner,
            tracking_number: trackingNumber.trim(),
            tracking_url: trackingUrl?.trim() || null,
            updated_at: updated.updated_at
          })
          .eq('id', orderId);
      } catch (err) {
        console.warn('Supabase courier update failed:', err);
      }
    }

    return updated;
  },

  /**
   * Update COD Reconciliation (Expected vs Received & Shortfalls)
   */
  async updateCodLedger(
    orderId: string, 
    codReceived: number, 
    courierHandlingFee: number
  ): Promise<Order | null> {
    const orders = getStoredOrders();
    const index = orders.findIndex(o => o.id === orderId);
    if (index === -1) return null;

    const ord = orders[index];
    const shortfall = Math.max(0, ord.cod_expected_pkr - codReceived);
    const updated: Order = {
      ...ord,
      cod_received_pkr: codReceived,
      cod_shortfall_pkr: shortfall,
      courier_handling_fee_pkr: courierHandlingFee,
      payment_status: codReceived >= ord.cod_expected_pkr ? 'paid' : ord.payment_status,
      updated_at: new Date().toISOString()
    };

    orders[index] = updated;
    saveStoredOrders(orders);

    return updated;
  },

  /**
   * Export orders formatted for Pakistan courier booking & accounts (CSV)
   */
  exportToCsv(orders: Order[]): string {
    const headers = [
      'Order Number',
      'Date',
      'Customer Name',
      'Phone Number',
      'City',
      'Address',
      'COD Amount (PKR)',
      'Order Status',
      'Courier',
      'Tracking Number',
      'Items Summary',
      'Customer Notes'
    ];

    const rows = orders.map(o => {
      const itemsSummary = (o.items || [])
        .map(i => `${i.product_title} (${i.selected_variant || ''}) x${i.quantity}`)
        .join('; ');

      return [
        `"${o.order_number}"`,
        `"${new Date(o.created_at).toISOString().slice(0, 10)}"`,
        `"${o.customer_name.replace(/"/g, '""')}"`,
        `"${o.customer_phone}"`,
        `"${o.shipping_city}"`,
        `"${o.shipping_address.replace(/"/g, '""')}"`,
        o.total_amount_pkr,
        `"${o.order_status}"`,
        `"${o.courier_partner || 'Unassigned'}"`,
        `"${o.tracking_number || ''}"`,
        `"${itemsSummary.replace(/"/g, '""')}"`,
        `"${(o.order_notes || '').replace(/"/g, '""')}"`
      ].join(',');
    });

    return [headers.join(','), ...rows].join('\n');
  }
};
