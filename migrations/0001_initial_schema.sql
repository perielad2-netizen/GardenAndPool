-- Enable required extensions
create extension if not exists pgcrypto;

-- Users and Authentication (profiles linked to auth.users)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  phone text,
  address text,
  pool_type text,
  pool_size text,
  special_instructions text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Properties/Pools
create table if not exists properties (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references profiles(id) on delete cascade,
  name text not null,
  address text not null,
  pool_type text,
  pool_size text,
  equipment_details jsonb,
  special_notes text,
  created_at timestamptz default now()
);

-- Subscriptions
create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  plan_type text not null,
  status text default 'active',
  start_date date not null,
  end_date date,
  price numeric(10,2),
  auto_renew boolean default true,
  created_at timestamptz default now()
);

-- Service Appointments
create table if not exists appointments (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references properties(id) on delete set null,
  technician_id uuid references profiles(id) on delete set null,
  service_type text not null,
  scheduled_date timestamptz not null,
  status text default 'scheduled',
  notes text,
  before_photos text[],
  after_photos text[],
  work_performed text,
  next_visit_date date,
  created_at timestamptz default now()
);

-- Service Requests
create table if not exists service_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  property_id uuid references properties(id) on delete set null,
  request_type text not null,
  description text not null,
  photos text[],
  priority text default 'normal',
  status text default 'pending',
  assigned_technician uuid references profiles(id) on delete set null,
  created_at timestamptz default now()
);

-- Invoices and Payments
create table if not exists invoices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  subscription_id uuid references subscriptions(id) on delete set null,
  amount numeric(10,2) not null,
  tax_amount numeric(10,2),
  status text default 'pending',
  due_date date not null,
  paid_at timestamptz,
  payment_method text,
  invoice_number text unique,
  created_at timestamptz default now()
);

-- Work Reports
create table if not exists work_reports (
  id uuid primary key default gen_random_uuid(),
  appointment_id uuid references appointments(id) on delete cascade,
  technician_id uuid references profiles(id) on delete set null,
  work_description text not null,
  chemicals_used jsonb,
  equipment_checked jsonb,
  issues_found text,
  recommendations text,
  customer_signature text,
  report_date timestamptz default now()
);

-- Notifications
create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  type text not null,
  title text not null,
  message text not null,
  read boolean default false,
  action_url text,
  created_at timestamptz default now()
);

-- File Storage
create table if not exists files (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  file_name text not null,
  file_url text not null,
  file_type text,
  category text,
  related_id uuid,
  created_at timestamptz default now()
);
