-- Create products table
create table if not exists products (
    id uuid default gen_random_uuid() primary key,
    organization_id uuid references organizations(id) on delete cascade not null,
    code text,
    name text not null,
    description text,
    buy_price_cents integer default 0,
    sell_price_cents integer default 0,
    stock_quantity integer default 0,
    min_stock integer default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index for faster lookups by code (NFe import)
create index if not exists idx_products_code_org on products(organization_id, code);

-- RLS Policies
alter table products enable row level security;

create policy "Users can view products of their organization"
    on products for select
    using (organization_id in (
        select organization_id from profiles where id = auth.uid()
    ));

create policy "Users can insert products for their organization"
    on products for insert
    with check (organization_id in (
        select organization_id from profiles where id = auth.uid()
    ));

create policy "Users can update products of their organization"
    on products for update
    using (organization_id in (
        select organization_id from profiles where id = auth.uid()
    ));

create policy "Users can delete products of their organization"
    on products for delete
    using (organization_id in (
        select organization_id from profiles where id = auth.uid()
    ));
