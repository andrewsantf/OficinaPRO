-- Optimizing performance with Indexes

-- 1. Indexes on Organization ID (Critical for RLS and multitenancy)
CREATE INDEX IF NOT EXISTS idx_organizations_id ON organizations(id);
CREATE INDEX IF NOT EXISTS idx_customers_organization_id ON customers(organization_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_organization_id ON vehicles(organization_id);
CREATE INDEX IF NOT EXISTS idx_service_orders_organization_id ON service_orders(organization_id);
CREATE INDEX IF NOT EXISTS idx_expenses_organization_id ON expenses(organization_id);

-- 2. Foreign Key Indexes (Optimize Joins)
CREATE INDEX IF NOT EXISTS idx_vehicles_customer_id ON vehicles(customer_id);
CREATE INDEX IF NOT EXISTS idx_service_orders_vehicle_id ON service_orders(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_service_items_service_order_id ON service_items(service_order_id);

-- 3. Filter/Status Indexes (Optimize Lists)
CREATE INDEX IF NOT EXISTS idx_service_orders_status ON service_orders(status);
CREATE INDEX IF NOT EXISTS idx_expenses_status ON expenses(status);
CREATE INDEX IF NOT EXISTS idx_customers_name ON customers(name);
CREATE INDEX IF NOT EXISTS idx_vehicles_plate ON vehicles(plate);

-- 4. Date Indexes (Optimize Range Queries and Sorting)
CREATE INDEX IF NOT EXISTS idx_service_orders_created_at ON service_orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_expenses_payment_date ON expenses(payment_date DESC);
CREATE INDEX IF NOT EXISTS idx_expenses_due_date ON expenses(due_date);

-- 5. Text Search Indexes (Optional but good for search fields)
CREATE INDEX IF NOT EXISTS idx_customers_search_name ON customers USING gin(to_tsvector('portuguese', name));
CREATE INDEX IF NOT EXISTS idx_vehicles_search_plate ON vehicles USING gin(to_tsvector('simple', plate));
