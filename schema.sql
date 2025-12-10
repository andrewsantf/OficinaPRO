-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create Enums
create type subscription_status as enum ('active', 'trialing', 'past_due', 'canceled', 'incomplete', 'incomplete_expired', 'unpaid', 'paused');
create type user_role as enum ('owner', 'manager', 'mechanic');
create type doc_type as enum ('CPF', 'CNPJ');
create type os_status as enum ('draft', 'pending_approval', 'approved', 'in_progress', 'waiting_parts', 'finished', 'paid');
create type item_type as enum ('product', 'service');

-- Organizations (Tenants)
create table organizations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  document text unique not null, -- CNPJ
  stripe_customer_id text,
  subscription_status subscription_status default 'trialing',
  settings jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- Profiles (Users)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  organization_id uuid references organizations(id),
  role user_role default 'mechanic',
  full_name text,
  created_at timestamptz default now()
);

-- Customers
create table customers (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid references organizations(id) not null,
  name text not null,
  doc_type doc_type not null,
  doc_number text not null,
  phone text,
  email text,
  created_at timestamptz default now(),
  unique (organization_id, doc_number)
);

-- Vehicles
create table vehicles (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid references organizations(id) not null,
  customer_id uuid references customers(id) on delete cascade not null,
  plate text not null,
  brand text,
  model text,
  year integer,
  color text,
  fipe_code text,
  created_at timestamptz default now()
);
create index vehicles_plate_idx on vehicles(plate);

-- Service Orders
create table service_orders (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid references organizations(id) not null,
  vehicle_id uuid references vehicles(id) not null,
  status os_status default 'draft',
  odometer integer,
  notes text,
  total_amount_cents integer default 0,
  created_at timestamptz default now()
);

-- Service Items
create table service_items (
  id uuid primary key default uuid_generate_v4(),
  service_order_id uuid references service_orders(id) on delete cascade not null,
  type item_type not null,
  description text not null,
  quantity numeric default 1,
  unit_price_cents integer not null,
  cost_price_cents integer,
  created_at timestamptz default now()
);

-- RLS & Security

-- Helper function to get current user's organization_id
create or replace function get_current_org_id()
returns uuid
language sql
security definer
stable
as $$
  select organization_id
  from public.profiles
  where id = auth.uid()
$$;

-- Enable RLS on all tables
alter table organizations enable row level security;
alter table profiles enable row level security;
alter table customers enable row level security;
alter table vehicles enable row level security;
alter table service_orders enable row level security;
alter table service_items enable row level security;

-- Policies

-- Organizations: Users can view their own organization
create policy "Users can view own organization"
  on organizations
  for select
  using (id = get_current_org_id());
  
-- Profiles: Users can view profiles in their organization
create policy "Users can view profiles in own organization"
  on profiles
  for select
  using (organization_id = get_current_org_id());

-- Update own profile? or owner update others? Keeping it simple for MVP select
create policy "Users can update own profile"
  on profiles
  for update
  using (id = auth.uid());

-- Customers
create policy "Users can view customers in own organization"
  on customers
  for all
  using (organization_id = get_current_org_id());

-- Vehicles
create policy "Users can view vehicles in own organization"
  on vehicles
  for all
  using (organization_id = get_current_org_id());

-- Service Orders
create policy "Users can view service orders in own organization"
  on service_orders
  for all
  using (organization_id = get_current_org_id());

-- Service Items
-- For items, we check the related service order's organization
create policy "Users can view service items in own organization"
  on service_items
  for all
  using (
    exists (
      select 1 from service_orders
      where service_orders.id = service_items.service_order_id
      and service_orders.organization_id = get_current_org_id()
    )
  );
