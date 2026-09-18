-- ============================================================================
-- Logistics + Infrastructure ERP — Initial schema
-- Postgres / Supabase. Run in order; this is migration 0001.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- Enums
-- ----------------------------------------------------------------------------

create type app_role as enum (
  'SUPER_ADMIN',
  'STAFF'
);

create type user_status as enum ('ACTIVE', 'SUSPENDED', 'INVITED');
create type labour_status as enum ('ACTIVE', 'ON_LEAVE', 'SUSPENDED', 'EXITED');
create type truck_status as enum ('ACTIVE', 'IN_MAINTENANCE', 'IDLE', 'RETIRED');
create type vehicle_session_status as enum ('OPEN', 'CLOSED', 'FORCE_CLOSED');
create type trip_status as enum ('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
create type expense_category as enum (
  'FUEL', 'TOLL', 'MAINTENANCE', 'TYRE', 'DRIVER_ALLOWANCE', 'PERMIT', 'FINE', 'OTHER'
);
create type maintenance_status as enum ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
create type tyre_status as enum ('IN_USE', 'IN_STORAGE', 'RETREADED', 'SCRAPPED');
create type project_status as enum ('PLANNED', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'CANCELLED');
create type tender_status as enum (
  'IDENTIFIED', 'PREPARING', 'SUBMITTED', 'UNDER_EVALUATION', 'WON', 'LOST', 'WITHDRAWN'
);
create type invoice_status as enum ('DRAFT', 'SENT', 'PARTIALLY_PAID', 'PAID', 'OVERDUE', 'VOID');
create type payment_method as enum ('CASH', 'BANK_TRANSFER', 'UPI', 'CHEQUE', 'CARD', 'OTHER');
create type account_type as enum ('CASH', 'BANK', 'UPI');
create type transaction_direction as enum ('CREDIT', 'DEBIT');
create type document_owner_type as enum (
  'TRUCK', 'LABOUR', 'VENDOR', 'CUSTOMER', 'PROJECT', 'TENDER', 'INVOICE', 'USER'
);
create type notification_channel as enum ('IN_APP', 'SMS', 'EMAIL', 'WHATSAPP');

-- ----------------------------------------------------------------------------
-- Identity, roles, permissions
-- ----------------------------------------------------------------------------

create table users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique, -- references auth.users(id) in Supabase, kept loosely coupled
  full_name text not null,
  email text unique,
  phone text unique,
  role app_role not null,
  status user_status not null default 'ACTIVE',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index idx_users_role on users(role) where deleted_at is null;
create index idx_users_auth_user_id on users(auth_user_id);

create table permissions (
  id uuid primary key default gen_random_uuid(),
  code text unique not null, -- e.g. 'trucks.read'
  module text not null,      -- e.g. 'trucks'
  description text,
  created_at timestamptz not null default now()
);

create table role_permissions (
  role app_role not null,
  permission_id uuid not null references permissions(id) on delete cascade,
  primary key (role, permission_id)
);

-- ----------------------------------------------------------------------------
-- Labour / driver accounts (separate identity space from `users`)
-- ----------------------------------------------------------------------------

create table labours (
  id uuid primary key default gen_random_uuid(),
  labour_code text unique not null, -- e.g. 'LAB001'
  full_name text not null,
  phone text not null,
  address text,
  licence_number text,
  licence_expiry date,
  joining_date date not null default current_date,
  language text not null default 'en',
  status labour_status not null default 'ACTIVE',
  photo_url text,
  created_by uuid references users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index idx_labours_status on labours(status) where deleted_at is null;

-- Login key is never stored in plaintext. Only its hash is stored.
create table labour_credentials (
  labour_id uuid primary key references labours(id) on delete cascade,
  login_key_hash text not null,
  login_key_last_rotated_at timestamptz not null default now(),
  failed_attempts int not null default 0,
  locked_until timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table driver_documents (
  id uuid primary key default gen_random_uuid(),
  labour_id uuid not null references labours(id) on delete cascade,
  doc_type text not null, -- 'LICENCE', 'AADHAAR', 'MEDICAL_CERT', etc.
  file_path text not null, -- Supabase Storage object path
  expiry_date date,
  uploaded_by uuid references users(id),
  created_at timestamptz not null default now()
);
create index idx_driver_documents_labour on driver_documents(labour_id);

-- ----------------------------------------------------------------------------
-- Fleet (vehicles + their documents)
-- ----------------------------------------------------------------------------

create table trucks (
  id uuid primary key default gen_random_uuid(),
  registration_number text unique not null, -- e.g. 'KA01AB1234'
  make text,
  model text,
  year_of_manufacture int,
  capacity_tons numeric(8,2),
  fuel_type text,
  status truck_status not null default 'ACTIVE',
  current_odometer numeric(10,1) not null default 0,
  purchase_date date,
  owned boolean not null default true, -- false = hired/leased truck
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index idx_trucks_status on trucks(status) where deleted_at is null;

create table truck_documents (
  id uuid primary key default gen_random_uuid(),
  truck_id uuid not null references trucks(id) on delete cascade,
  doc_type text not null, -- 'RC', 'INSURANCE', 'PERMIT', 'FITNESS', 'PUC'
  file_path text not null,
  expiry_date date,
  uploaded_by uuid references users(id),
  created_at timestamptz not null default now()
);
create index idx_truck_documents_truck on truck_documents(truck_id);
create index idx_truck_documents_expiry on truck_documents(expiry_date);

-- ----------------------------------------------------------------------------
-- Customers, vendors, accounts, projects
-- (defined before trips/expenses/maintenance, which reference them)
-- ----------------------------------------------------------------------------

create table customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact_person text,
  phone text,
  email text,
  gstin text,
  billing_address text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table vendors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text, -- 'FUEL', 'MAINTENANCE', 'TYRE', 'MATERIAL_SUPPLIER', 'CONTRACTOR', 'OTHER'
  contact_person text,
  phone text,
  email text,
  gstin text,
  address text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table accounts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type account_type not null,
  account_number text,
  ifsc_code text,
  opening_balance numeric(14,2) not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code text unique,
  customer_id uuid references customers(id),
  location text,
  status project_status not null default 'PLANNED',
  contract_value numeric(14,2),
  start_date date,
  end_date date,
  project_manager_id uuid references users(id),
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index idx_projects_status on projects(status) where deleted_at is null;

-- ----------------------------------------------------------------------------
-- Vehicle sessions — a labour is never permanently bound to a truck. Each
-- day/shift they select a truck from what's available and a session opens;
-- historical sessions keep their original truck_id forever.
-- ----------------------------------------------------------------------------

create table vehicle_sessions (
  id uuid primary key default gen_random_uuid(),
  labour_id uuid not null references labours(id),
  truck_id uuid not null references trucks(id),
  status vehicle_session_status not null default 'OPEN',
  opening_odometer numeric(10,1) not null,
  closing_odometer numeric(10,1),
  opened_at timestamptz not null default now(),
  closed_at timestamptz,
  closed_by uuid references users(id), -- set when force-closed by an admin
  notes text,
  constraint chk_closing_odometer check (
    closing_odometer is null or closing_odometer >= opening_odometer
  )
);
create index idx_vehicle_sessions_truck on vehicle_sessions(truck_id);
create index idx_vehicle_sessions_labour on vehicle_sessions(labour_id);
-- A truck can have at most one OPEN session at a time.
create unique index uq_one_open_session_per_truck
  on vehicle_sessions(truck_id) where status = 'OPEN';
-- A labour can have at most one OPEN session at a time.
create unique index uq_one_open_session_per_labour
  on vehicle_sessions(labour_id) where status = 'OPEN';

-- ----------------------------------------------------------------------------
-- Trips (distance derived from odometer delta — no GPS)
-- ----------------------------------------------------------------------------

create table trips (
  id uuid primary key default gen_random_uuid(),
  vehicle_session_id uuid not null references vehicle_sessions(id),
  truck_id uuid not null references trucks(id),
  labour_id uuid not null references labours(id),
  customer_id uuid references customers(id),
  project_id uuid references projects(id),
  origin text,
  destination text,
  starting_odometer numeric(10,1) not null,
  ending_odometer numeric(10,1),
  distance_km numeric(10,1) generated always as (
    case when ending_odometer is not null then ending_odometer - starting_odometer else null end
  ) stored,
  cargo_description text,
  cargo_weight_tons numeric(8,2),
  freight_amount numeric(12,2),
  status trip_status not null default 'PLANNED',
  started_at timestamptz,
  ended_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint chk_ending_odometer check (
    ending_odometer is null or ending_odometer >= starting_odometer
  )
);
create index idx_trips_truck on trips(truck_id);
create index idx_trips_labour on trips(labour_id);
create index idx_trips_status on trips(status);
create index idx_trips_project on trips(project_id);

-- ----------------------------------------------------------------------------
-- Fuel & expenses
-- ----------------------------------------------------------------------------

create table fuel_transactions (
  id uuid primary key default gen_random_uuid(),
  truck_id uuid not null references trucks(id),
  vehicle_session_id uuid references vehicle_sessions(id),
  trip_id uuid references trips(id),
  odometer_at_fill numeric(10,1) not null,
  litres numeric(8,2) not null,
  rate_per_litre numeric(8,2) not null,
  total_amount numeric(12,2) generated always as (litres * rate_per_litre) stored,
  fuel_station text,
  filled_by uuid references labours(id),
  recorded_by uuid references users(id),
  receipt_document_id uuid,
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
create index idx_fuel_truck on fuel_transactions(truck_id);
create index idx_fuel_occurred_at on fuel_transactions(occurred_at);

create table expenses (
  id uuid primary key default gen_random_uuid(),
  category expense_category not null,
  truck_id uuid references trucks(id),
  trip_id uuid references trips(id),
  project_id uuid references projects(id),
  vendor_id uuid references vendors(id),
  amount numeric(12,2) not null,
  description text,
  incurred_on date not null default current_date,
  recorded_by uuid references users(id),
  approved_by uuid references users(id),
  created_at timestamptz not null default now()
);
create index idx_expenses_truck on expenses(truck_id);
create index idx_expenses_project on expenses(project_id);
create index idx_expenses_category on expenses(category);

-- ----------------------------------------------------------------------------
-- Maintenance & tyres
-- ----------------------------------------------------------------------------

create table maintenance (
  id uuid primary key default gen_random_uuid(),
  truck_id uuid not null references trucks(id),
  work_description text not null,
  status maintenance_status not null default 'SCHEDULED',
  odometer_at_service numeric(10,1),
  vendor_id uuid references vendors(id),
  cost numeric(12,2),
  scheduled_date date,
  completed_date date,
  next_due_odometer numeric(10,1),
  next_due_date date,
  created_by uuid references users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_maintenance_truck on maintenance(truck_id);
create index idx_maintenance_status on maintenance(status);

create table tyres (
  id uuid primary key default gen_random_uuid(),
  serial_number text unique,
  truck_id uuid references trucks(id),
  position text, -- e.g. 'FRONT_LEFT', 'REAR_RIGHT_OUTER'
  brand text,
  fitted_odometer numeric(10,1),
  fitted_date date,
  removed_odometer numeric(10,1),
  removed_date date,
  status tyre_status not null default 'IN_USE',
  cost numeric(12,2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_tyres_truck on tyres(truck_id);

-- ----------------------------------------------------------------------------
-- Project cost roll-up
-- ----------------------------------------------------------------------------

create table project_expenses (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  expense_id uuid references expenses(id),
  category text not null,
  amount numeric(12,2) not null,
  description text,
  incurred_on date not null default current_date,
  recorded_by uuid references users(id),
  created_at timestamptz not null default now()
);
create index idx_project_expenses_project on project_expenses(project_id);

-- ----------------------------------------------------------------------------
-- Tenders
-- ----------------------------------------------------------------------------

create table tenders (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  reference_number text unique,
  issuing_authority text,
  is_government boolean not null default false,
  estimated_value numeric(14,2),
  emd_amount numeric(12,2),
  submission_deadline timestamptz,
  status tender_status not null default 'IDENTIFIED',
  awarded_project_id uuid references projects(id),
  owner_id uuid references users(id),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index idx_tenders_status on tenders(status) where deleted_at is null;

create table tender_documents (
  id uuid primary key default gen_random_uuid(),
  tender_id uuid not null references tenders(id) on delete cascade,
  doc_type text not null,
  file_path text not null,
  uploaded_by uuid references users(id),
  created_at timestamptz not null default now()
);

create table tender_checklist_items (
  id uuid primary key default gen_random_uuid(),
  tender_id uuid not null references tenders(id) on delete cascade,
  item text not null,
  is_required boolean not null default true,
  is_complete boolean not null default false,
  completed_at timestamptz,
  completed_by uuid references users(id),
  sort_order int not null default 0
);
create index idx_tender_checklist_tender on tender_checklist_items(tender_id);

-- ----------------------------------------------------------------------------
-- Invoicing & payments
-- ----------------------------------------------------------------------------

create table invoices (
  id uuid primary key default gen_random_uuid(),
  invoice_number text unique not null,
  customer_id uuid not null references customers(id),
  project_id uuid references projects(id),
  status invoice_status not null default 'DRAFT',
  issue_date date not null default current_date,
  due_date date,
  subtotal numeric(14,2) not null default 0,
  tax_amount numeric(14,2) not null default 0,
  total_amount numeric(14,2) not null default 0,
  amount_paid numeric(14,2) not null default 0,
  notes text,
  created_by uuid references users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index idx_invoices_customer on invoices(customer_id);
create index idx_invoices_status on invoices(status) where deleted_at is null;

create table invoice_items (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references invoices(id) on delete cascade,
  trip_id uuid references trips(id),
  description text not null,
  quantity numeric(10,2) not null default 1,
  unit_price numeric(12,2) not null,
  line_total numeric(14,2) generated always as (quantity * unit_price) stored,
  sort_order int not null default 0
);
create index idx_invoice_items_invoice on invoice_items(invoice_id);

create table payments (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid references invoices(id),
  vendor_id uuid references vendors(id), -- for outgoing payments to vendors
  direction transaction_direction not null, -- CREDIT = money in, DEBIT = money out
  amount numeric(14,2) not null,
  method payment_method not null,
  account_id uuid references accounts(id),
  reference_number text,
  paid_on date not null default current_date,
  recorded_by uuid references users(id),
  notes text,
  created_at timestamptz not null default now()
);
create index idx_payments_invoice on payments(invoice_id);
create index idx_payments_account on payments(account_id);

create table account_transactions (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references accounts(id),
  direction transaction_direction not null,
  amount numeric(14,2) not null,
  balance_after numeric(14,2),
  reference_type text, -- 'PAYMENT', 'EXPENSE', 'MANUAL', etc.
  reference_id uuid,
  description text,
  occurred_at timestamptz not null default now(),
  recorded_by uuid references users(id),
  created_at timestamptz not null default now()
);
create index idx_account_txn_account on account_transactions(account_id);
create index idx_account_txn_occurred_at on account_transactions(occurred_at);

-- ----------------------------------------------------------------------------
-- Documents, notifications, audit
-- ----------------------------------------------------------------------------

create table documents (
  id uuid primary key default gen_random_uuid(),
  owner_type document_owner_type not null,
  owner_id uuid not null,
  doc_type text not null,
  file_path text not null,
  file_size_bytes bigint,
  mime_type text,
  expiry_date date,
  uploaded_by uuid references users(id),
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index idx_documents_owner on documents(owner_type, owner_id);
create index idx_documents_expiry on documents(expiry_date);

create table notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_user_id uuid references users(id),
  recipient_labour_id uuid references labours(id),
  channel notification_channel not null default 'IN_APP',
  title text not null,
  body text,
  is_read boolean not null default false,
  read_at timestamptz,
  related_entity_type text,
  related_entity_id uuid,
  created_at timestamptz not null default now(),
  constraint chk_notification_recipient check (
    recipient_user_id is not null or recipient_labour_id is not null
  )
);
create index idx_notifications_user on notifications(recipient_user_id) where is_read = false;
create index idx_notifications_labour on notifications(recipient_labour_id) where is_read = false;

create table audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references users(id),
  actor_labour_id uuid references labours(id),
  action text not null, -- e.g. 'CREATE', 'UPDATE', 'DELETE', 'LOGIN'
  entity_type text not null,
  entity_id uuid,
  before_data jsonb,
  after_data jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz not null default now()
);
create index idx_audit_logs_entity on audit_logs(entity_type, entity_id);
create index idx_audit_logs_actor on audit_logs(actor_user_id);
create index idx_audit_logs_created_at on audit_logs(created_at);

-- ----------------------------------------------------------------------------
-- updated_at trigger helper
-- ----------------------------------------------------------------------------

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

do $$
declare
  t text;
begin
  foreach t in array array[
    'users','labours','labour_credentials','trucks','vehicle_sessions','trips',
    'maintenance','tyres','customers','vendors','projects','tenders',
    'invoices','accounts'
  ]
  loop
    execute format(
      'create trigger trg_set_updated_at before update on %I
       for each row execute function set_updated_at();', t
    );
  end loop;
end $$;
