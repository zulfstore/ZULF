-- ==============================================================================
-- ZULF STORE - Supabase PostgreSQL Schema & Security Policies
-- Target: Supabase Postgres with Row Level Security (RLS)
-- Features: Transactional stock reservation, COD order engine, audit logs, RLS
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sku VARCHAR(64) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    price_pkr NUMERIC(12, 2) NOT NULL CHECK (price_pkr >= 0),
    compare_at_price_pkr NUMERIC(12, 2) CHECK (compare_at_price_pkr >= price_pkr OR compare_at_price_pkr IS NULL),
    inventory_quantity INTEGER NOT NULL DEFAULT 0 CHECK (inventory_quantity >= 0),
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    images TEXT[] NOT NULL DEFAULT '{}',
    variants JSONB DEFAULT '[]'::jsonb, -- e.g. [{"name": "Size", "options": ["S", "M", "L", "XL"]}]
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indexing for high-speed storefront queries
CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_sku ON public.products(sku);

-- 3. STORE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.store_settings (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'current_store',
    store_name VARCHAR(255) NOT NULL DEFAULT 'ZULF STORE',
    store_tagline VARCHAR(255) DEFAULT 'Modern Essentials for Pakistan',
    currency VARCHAR(10) NOT NULL DEFAULT 'PKR',
    support_email VARCHAR(255) NOT NULL DEFAULT 'zulfstore4@gmail.com',
    support_phone VARCHAR(50) DEFAULT '+92 300 1234567',
    support_whatsapp VARCHAR(50) DEFAULT '+92 300 1234567',
    store_address TEXT DEFAULT 'Main Boulevard, Gulberg III, Lahore, Pakistan',
    standard_shipping_fee NUMERIC(10, 2) NOT NULL DEFAULT 250.00,
    free_shipping_threshold NUMERIC(10, 2) NOT NULL DEFAULT 3500.00,
    cod_enabled BOOLEAN NOT NULL DEFAULT true,
    cod_max_limit NUMERIC(10, 2) NOT NULL DEFAULT 50000.00,
    theme_tokens JSONB NOT NULL DEFAULT '{
        "primary_color": "#18181B",
        "accent_color": "#27272A",
        "background_color": "#FAFAFA",
        "font_family": "Plus Jakarta Sans",
        "button_radius": "md",
        "announcement_bg": "#18181B",
        "announcement_text": "#FFFFFF"
    }'::jsonb,
    homepage_sections JSONB NOT NULL DEFAULT '[]'::jsonb,
    draft_homepage_sections JSONB DEFAULT NULL,
    policies JSONB NOT NULL DEFAULT '{
        "shipping_policy": "Standard nationwide delivery across Pakistan takes 2-4 business days. Flat delivery charge PKR 250, free on orders above PKR 3,500.",
        "return_policy": "7-day hassle-free return and exchange policy. Items must be unworn with original tags attached.",
        "cod_policy": "Cash on Delivery available nationwide. Please have exact change ready for the courier rider."
    }'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(32) UNIQUE NOT NULL, -- e.g. ZULF-10023
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(32) NOT NULL,
    customer_email VARCHAR(255),
    shipping_address TEXT NOT NULL,
    shipping_city VARCHAR(100) NOT NULL,
    shipping_postal_code VARCHAR(20),
    order_notes TEXT,
    payment_method VARCHAR(50) NOT NULL DEFAULT 'COD', -- 'COD', 'PAYFAST_PENDING'
    payment_status VARCHAR(50) NOT NULL DEFAULT 'unpaid', -- 'unpaid', 'paid', 'refunded'
    order_status VARCHAR(50) NOT NULL DEFAULT 'pending_confirmation', 
    -- statuses: pending_confirmation, confirmed, packed, dispatched, delivered, cancelled, returned
    subtotal_pkr NUMERIC(12, 2) NOT NULL CHECK (subtotal_pkr >= 0),
    shipping_fee_pkr NUMERIC(10, 2) NOT NULL CHECK (shipping_fee_pkr >= 0),
    total_amount_pkr NUMERIC(12, 2) NOT NULL CHECK (total_amount_pkr >= 0),
    
    -- Courier fulfillment fields
    courier_partner VARCHAR(50) DEFAULT NULL, -- 'Trax', 'TCS', 'Leopard', 'Call Courier', 'PostEx', 'M&P'
    tracking_number VARCHAR(100) DEFAULT NULL,
    tracking_url TEXT DEFAULT NULL,
    dispatched_at TIMESTAMPTZ DEFAULT NULL,
    delivered_at TIMESTAMPTZ DEFAULT NULL,

    -- COD Financial reconciliation fields
    cod_expected_pkr NUMERIC(12, 2) DEFAULT 0.00,
    cod_received_pkr NUMERIC(12, 2) DEFAULT 0.00,
    cod_shortfall_pkr NUMERIC(12, 2) DEFAULT 0.00,
    courier_handling_fee_pkr NUMERIC(10, 2) DEFAULT 0.00,

    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_phone ON public.orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

-- 5. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    product_sku VARCHAR(64) NOT NULL,
    product_title VARCHAR(255) NOT NULL,
    selected_variant VARCHAR(100), -- e.g. "Size: L | Color: Charcoal"
    unit_price_pkr NUMERIC(12, 2) NOT NULL CHECK (unit_price_pkr >= 0),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    line_total_pkr NUMERIC(12, 2) NOT NULL CHECK (line_total_pkr >= 0),
    product_image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);

-- 6. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL, -- 'order', 'product', 'settings', 'auth'
    entity_id VARCHAR(100),
    actor_id VARCHAR(100) DEFAULT 'system',
    details JSONB DEFAULT '{}'::jsonb,
    ip_address VARCHAR(45),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Strict security: Public users can only read active products & published settings
-- Customer PII and Orders are protected and accessible only to authenticated admin
-- ==============================================================================

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- PRODUCTS:
-- Public can only view active products
DROP POLICY IF EXISTS "Public can view active products" ON public.products;
CREATE POLICY "Public can view active products"
    ON public.products FOR SELECT
    USING (is_active = true);

-- Authenticated admins can view, insert, update, delete all products
DROP POLICY IF EXISTS "Admins have full access to products" ON public.products;
CREATE POLICY "Admins have full access to products"
    ON public.products FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- STORE SETTINGS:
-- Public can only view published store settings
DROP POLICY IF EXISTS "Public can read store settings" ON public.store_settings;
CREATE POLICY "Public can read store settings"
    ON public.store_settings FOR SELECT
    USING (true);

-- Admins can update store settings
DROP POLICY IF EXISTS "Admins can update store settings" ON public.store_settings;
CREATE POLICY "Admins can update store settings"
    ON public.store_settings FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- ORDERS & ORDER ITEMS:
-- Public cannot browse orders directly (prevents customer PII leaks)
-- Checkout is performed via secure server-side endpoint or SECURITY DEFINER RPC
DROP POLICY IF EXISTS "Admins have full access to orders" ON public.orders;
CREATE POLICY "Admins have full access to orders"
    ON public.orders FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Admins have full access to order items" ON public.order_items;
CREATE POLICY "Admins have full access to order items"
    ON public.order_items FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- AUDIT LOGS:
-- Authenticated admins can view audit logs
DROP POLICY IF EXISTS "Admins can view audit logs" ON public.audit_logs;
CREATE POLICY "Admins can view audit logs"
    ON public.audit_logs FOR SELECT
    TO authenticated
    USING (true);

-- ==============================================================================
-- SAFE TRANSACTIONAL CHECKOUT RPC
-- Recalculates product prices, checks inventory with row-locking, decrements stock,
-- generates public order number, and creates order + order_items atomically.
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.process_cod_checkout(
    p_customer_name TEXT,
    p_customer_phone TEXT,
    p_customer_email TEXT,
    p_shipping_address TEXT,
    p_shipping_city TEXT,
    p_order_notes TEXT,
    p_items JSONB -- Array of {"product_id": "uuid", "quantity": int, "variant": "str"}
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_order_id UUID;
    v_order_number TEXT;
    v_item RECORD;
    v_prod RECORD;
    v_subtotal NUMERIC(12, 2) := 0.00;
    v_shipping_fee NUMERIC(10, 2) := 250.00;
    v_free_threshold NUMERIC(10, 2) := 3500.00;
    v_total NUMERIC(12, 2) := 0.00;
    v_line_total NUMERIC(12, 2);
    v_settings RECORD;
    v_random_code TEXT;
BEGIN
    -- 1. Fetch shipping rules from settings
    SELECT standard_shipping_fee, free_shipping_threshold, cod_enabled, cod_max_limit
    INTO v_settings
    FROM public.store_settings
    WHERE id = 'current_store'
    LIMIT 1;

    IF v_settings.cod_enabled IS FALSE THEN
        RAISE EXCEPTION 'Cash on Delivery is temporarily disabled.';
    END IF;

    IF v_settings.standard_shipping_fee IS NOT NULL THEN
        v_shipping_fee := v_settings.standard_shipping_fee;
    END IF;
    IF v_settings.free_shipping_threshold IS NOT NULL THEN
        v_free_threshold := v_settings.free_shipping_threshold;
    END IF;

    -- 2. Validate items array
    IF jsonb_array_length(p_items) = 0 THEN
        RAISE EXCEPTION 'Cart is empty. Please select at least one item.';
    END IF;

    -- 3. Calculate subtotal & verify stock with row locking (FOR UPDATE)
    FOR v_item IN SELECT * FROM jsonb_to_recordset(p_items) AS x(product_id UUID, quantity INT, variant TEXT)
    LOOP
        SELECT id, sku, title, price_pkr, inventory_quantity, is_active, images
        INTO v_prod
        FROM public.products
        WHERE id = v_item.product_id
        FOR UPDATE; -- Prevents race conditions / overselling

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Product with ID % not found.', v_item.product_id;
        END IF;

        IF v_prod.is_active IS FALSE THEN
            RAISE EXCEPTION 'Product "%" is currently unavailable.', v_prod.title;
        END IF;

        IF v_prod.inventory_quantity < v_item.quantity THEN
            RAISE EXCEPTION 'Insufficient stock for "%". Available: %, Requested: %', v_prod.title, v_prod.inventory_quantity, v_item.quantity;
        END IF;

        v_line_total := v_prod.price_pkr * v_item.quantity;
        v_subtotal := v_subtotal + v_line_total;
    END LOOP;

    -- 4. Apply free shipping rule
    IF v_subtotal >= v_free_threshold THEN
        v_shipping_fee := 0.00;
    END IF;

    v_total := v_subtotal + v_shipping_fee;

    -- 5. Anti-fraud check: COD max limit
    IF v_settings.cod_max_limit IS NOT NULL AND v_total > v_settings.cod_max_limit THEN
        RAISE EXCEPTION 'Orders above PKR % cannot be placed via Cash on Delivery. Please contact support.', v_settings.cod_max_limit;
    END IF;

    -- 6. Generate human-readable Order Number (e.g. ZULF-74921)
    v_random_code := upper(substring(md5(random()::text || clock_timestamp()::text) from 1 for 5));
    v_order_number := 'ZULF-' || to_char(now(), 'YYMM') || '-' || v_random_code;

    -- 7. Insert order
    INSERT INTO public.orders (
        order_number,
        customer_name,
        customer_phone,
        customer_email,
        shipping_address,
        shipping_city,
        order_notes,
        payment_method,
        payment_status,
        order_status,
        subtotal_pkr,
        shipping_fee_pkr,
        total_amount_pkr,
        cod_expected_pkr
    ) VALUES (
        v_order_number,
        p_customer_name,
        p_customer_phone,
        p_customer_email,
        p_shipping_address,
        p_shipping_city,
        p_order_notes,
        'COD',
        'unpaid',
        'pending_confirmation',
        v_subtotal,
        v_shipping_fee,
        v_total,
        v_total
    ) RETURNING id INTO v_order_id;

    -- 8. Insert order items & decrement stock
    FOR v_item IN SELECT * FROM jsonb_to_recordset(p_items) AS x(product_id UUID, quantity INT, variant TEXT)
    LOOP
        SELECT id, sku, title, price_pkr, images[1] as main_image
        INTO v_prod
        FROM public.products
        WHERE id = v_item.product_id;

        v_line_total := v_prod.price_pkr * v_item.quantity;

        INSERT INTO public.order_items (
            order_id,
            product_id,
            product_sku,
            product_title,
            selected_variant,
            unit_price_pkr,
            quantity,
            line_total_pkr,
            product_image_url
        ) VALUES (
            v_order_id,
            v_item.product_id,
            v_prod.sku,
            v_prod.title,
            v_item.variant,
            v_prod.price_pkr,
            v_item.quantity,
            v_line_total,
            v_prod.main_image
        );

        -- Decrement inventory atomically
        UPDATE public.products
        SET inventory_quantity = inventory_quantity - v_item.quantity,
            updated_at = timezone('utc'::text, now())
        WHERE id = v_item.product_id;
    END LOOP;

    -- 9. Log audit trail
    INSERT INTO public.audit_logs (
        action,
        entity_type,
        entity_id,
        actor_id,
        details
    ) VALUES (
        'order_placed_cod',
        'order',
        v_order_id::text,
        p_customer_phone,
        jsonb_build_object(
            'order_number', v_order_number,
            'total_amount', v_total,
            'city', p_shipping_city
        )
    );

    RETURN jsonb_build_object(
        'success', true,
        'order_id', v_order_id,
        'order_number', v_order_number,
        'subtotal_pkr', v_subtotal,
        'shipping_fee_pkr', v_shipping_fee,
        'total_amount_pkr', v_total,
        'payment_method', 'COD',
        'status', 'pending_confirmation'
    );
END;
$$;
