# Supabase Setup Guide for PSST Vodka Order System

## 1. Create a Supabase Project

1. Sign up or log in at [supabase.com](https://supabase.com)
2. Create a new project by clicking "New Project"
3. Enter your project details and create your database

## 2. Set Up Database Table

Run the following SQL in the Supabase SQL Editor to create the orders table:

```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  delivery_date DATE,
  notes TEXT,
  address TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'delivered', 'cancelled'))
);

-- Create RLS policy to allow inserting orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anonymous users to insert
CREATE POLICY "Allow anonymous inserts to orders" ON orders FOR INSERT WITH CHECK (true);

-- Optionally, create a policy to allow authenticated users to read all orders
CREATE POLICY "Allow authenticated users to read orders" ON orders FOR SELECT USING (auth.role() = 'authenticated');
```

## 3. Get Your API Keys

1. In your Supabase project dashboard, go to Project Settings > API
2. Copy the URL and anon/public key

## 4. Configure Your Environment

Create a `.env.local` file in your project root with:

```
NEXT_PUBLIC_SUPABASE_URL=your-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## 5. Modify the Code (if needed)

Update the database field names in `app/order/page.tsx` if you used different column names in your table:

```typescript
// Format the data for insertion
const orderData = {
  company_name: formData.companyName,
  contact_name: formData.contactName,
  email: formData.email,
  phone: formData.phone,
  quantity: formData.quantity,
  delivery_date: formData.deliveryDate,
  notes: formData.notes,
  address: formData.address,
  status: 'pending'
};
```

## 6. Testing

After configuring your environment variables and ensuring your Supabase project is set up correctly, submit a test order through your form to verify everything works correctly.

## 7. Accessing Submitted Orders

You can view all submitted orders through:

1. Supabase Dashboard > Table Editor > orders
2. Build an admin dashboard that fetches the orders using authenticated API calls 