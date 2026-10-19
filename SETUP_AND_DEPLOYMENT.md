# ZULF STORE — Setup & Deployment Guide

ZULF STORE is a high-performance, minimalist e-commerce platform built specifically for the Pakistani market, with Cash on Delivery (COD) as the primary checkout method, a drag-and-drop Visual Homepage Builder, automated inventory reservation, and full admin operations.

---

## 1. Architecture & Pakistani Business Constraints

- **Budget Target**: Under **PKR 30,000** total setup cost.
  - Zero upfront hosting cost on **Vercel** serverless free tier.
  - Zero upfront database cost on **Supabase** free tier (PostgreSQL + Auth + 1GB Storage).
  - Zero gateway onboarding fee for **Cash on Delivery (COD)**.
- **First Checkout Method**: **Pakistan Cash on Delivery (COD)** with 03xx mobile number validation and anti-spam protection.
- **PayFast & Courier APIs**: Marked as **Phase 2** onboarding. No fake integrations or mock charges. Orders can be exported as a standard CSV for bulk booking directly into Trax Logistics or Leopards Courier portals.

---

## 2. Supabase Database & Storage Setup

1. **Create a Free Project** on [Supabase](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase dashboard.
3. Open `supabase/schema.sql` from this repository, paste the entire file into the SQL Editor, and click **Run**.
   - This sets up:
     - `products` table with indexing
     - `store_settings` with JSONB theme tokens and homepage layout sections
     - `orders` and `order_items` tables with Pakistani city tracking and COD reconciliation
     - `audit_logs`
     - Row Level Security (RLS) policies allowing public read of active products, while restricting orders and customer PII to authenticated admins
     - `process_cod_checkout` stored procedure (RPC) with `SELECT ... FOR UPDATE` row-level locks and transactional inventory decrementing.
4. Go to **Storage** -> **Create New Bucket**:
   - Name: `product-images`
   - Set to **Public Bucket** so images can be displayed on storefront.
   - Allowed MIME types: `image/jpeg`, `image/png`, `image/webp`.
5. Copy your **Project URL** and **Anon Key** from `Project Settings -> API`.

---

## 3. Environment Variables Configuration

In your `.env` or Vercel Environment Variables:

```bash
VITE_SUPABASE_URL="https://your-project-id.supabase.co"
VITE_SUPABASE_ANON_KEY="eyJhbGciOi..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOi..." # Server-side only
```

> **Note**: If credentials are not yet configured, ZULF STORE will automatically run in local zero-latency sandbox mode, allowing you to test products, visual homepage builder changes, and COD orders immediately.

---

## 4. Deploying to Vercel

1. Push your code to your GitHub repository.
2. Log in to [Vercel](https://vercel.com) and click **Add New Project**.
3. Select your repository.
4. Framework Preset: **Vite** (or Next.js if migrating).
5. Add the environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
6. Click **Deploy**.

---

## 5. Operations & Order Fulfillment Workflow

1. **Customer Checkout**:
   - Customer adds items to cart and enters delivery details (Karachi, Lahore, Islamabad, etc.).
   - Client-supplied prices are ignored; totals are strictly recalculated from the database catalog.
   - Order number is generated (`ZULF-YYMM-XXXXX`).
   - Stock is decremented transactionally.
2. **Admin Operations**:
   - Navigate to **Admin Suite** from the header.
   - Filter orders by status: `Pending Confirmation`, `Confirmed`, `Packed`, `Dispatched`, `Delivered`, `Returned`.
   - Click **Export Courier CSV** to download ready-to-import dispatch lists for Trax or Leopards portals.
   - Update Consignment Tracking Numbers (CN) to allow customers to track parcels directly on the courier's site.
   - Perform COD financial reconciliation (Expected Cash vs. Received Cash vs. Courier deductions).

---

## 6. Visual Homepage Builder

1. Click **Page Builder** in the top navigation.
2. Reorder sections using the Up/Down controls.
3. Toggle visibility or customize section contents (Hero banner, Trust badges, Featured collection, Editorial split, Newsletter).
4. Save layout as **Draft** or click **Publish Live** to push verified JSON to the public storefront.
