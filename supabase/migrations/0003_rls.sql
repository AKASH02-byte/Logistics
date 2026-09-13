-- ============================================================================
-- Row Level Security
--
-- Model: admin/staff users authenticate via Supabase Auth, so auth.uid() is
-- populated for them and RLS applies directly. Labour/driver accounts do NOT
-- use Supabase Auth (Labour ID + Login Key instead) — their requests are
-- served by server-only Next.js API routes using the service role key, which
-- bypasses RLS by design. Those routes must therefore do their own
-- authorization in application code (see docs/RBAC.md). RLS here is the
-- defense-in-depth layer for the admin/staff surface and for any direct
-- client access via the Supabase client.
-- ============================================================================

create or replace function app_user_id()
returns uuid
language sql stable
as $$
  select id from users where auth_user_id = auth.uid() and deleted_at is null;
$$;

create or replace function app_role()
returns app_role
language sql stable
as $$
  select role from users where auth_user_id = auth.uid() and deleted_at is null;
$$;

create or replace function has_permission(perm_code text)
returns boolean
language sql stable
as $$
  select exists (
    select 1
    from role_permissions rp
    join permissions p on p.id = rp.permission_id
    where rp.role = app_role() and p.code = perm_code
  );
$$;

-- ----------------------------------------------------------------------------
-- Enable RLS everywhere
-- ----------------------------------------------------------------------------

do $$
declare
  t text;
begin
  foreach t in array array[
    'users','permissions','role_permissions',
    'labours','labour_credentials','driver_documents',
    'trucks','truck_documents',
    'customers','vendors','accounts','projects',
    'vehicle_sessions','trips','fuel_transactions','expenses',
    'maintenance','tyres','project_expenses',
    'tenders','tender_documents','tender_checklist_items',
    'invoices','invoice_items','payments','account_transactions',
    'documents','notifications','audit_logs'
  ]
  loop
    execute format('alter table %I enable row level security;', t);
  end loop;
end $$;

-- ----------------------------------------------------------------------------
-- users / permissions / role_permissions
-- ----------------------------------------------------------------------------

create policy users_select on users for select
  using (id = app_user_id() or has_permission('users.read'));
create policy users_insert on users for insert
  with check (has_permission('users.create'));
create policy users_update on users for update
  using (id = app_user_id() or has_permission('users.update'));

create policy permissions_select on permissions for select using (auth.uid() is not null);
create policy role_permissions_select on role_permissions for select using (auth.uid() is not null);

-- ----------------------------------------------------------------------------
-- labours / credentials / driver documents
-- ----------------------------------------------------------------------------

create policy labours_select on labours for select using (has_permission('drivers.read'));
create policy labours_insert on labours for insert with check (has_permission('drivers.create'));
create policy labours_update on labours for update using (has_permission('drivers.update'));

create policy labour_credentials_select on labour_credentials for select
  using (has_permission('drivers.update'));
create policy labour_credentials_write on labour_credentials for all
  using (has_permission('drivers.update')) with check (has_permission('drivers.update'));

create policy driver_documents_select on driver_documents for select using (has_permission('drivers.read'));
create policy driver_documents_write on driver_documents for insert with check (has_permission('drivers.update'));

-- ----------------------------------------------------------------------------
-- trucks / truck documents
-- ----------------------------------------------------------------------------

create policy trucks_select on trucks for select using (has_permission('trucks.read'));
create policy trucks_insert on trucks for insert with check (has_permission('trucks.create'));
create policy trucks_update on trucks for update using (has_permission('trucks.update'));
create policy trucks_delete on trucks for delete using (has_permission('trucks.delete'));

create policy truck_documents_select on truck_documents for select using (has_permission('trucks.read'));
create policy truck_documents_write on truck_documents for insert with check (has_permission('trucks.update'));

-- ----------------------------------------------------------------------------
-- customers / vendors / accounts / projects
-- ----------------------------------------------------------------------------

create policy customers_select on customers for select using (has_permission('customers.read'));
create policy customers_insert on customers for insert with check (has_permission('customers.create'));
create policy customers_update on customers for update using (has_permission('customers.update'));

create policy vendors_select on vendors for select using (has_permission('vendors.read'));
create policy vendors_insert on vendors for insert with check (has_permission('vendors.create'));
create policy vendors_update on vendors for update using (has_permission('vendors.update'));

create policy accounts_select on accounts for select using (has_permission('finance.read'));
create policy accounts_write on accounts for insert with check (has_permission('finance.create'));
create policy accounts_update on accounts for update using (has_permission('finance.update'));

create policy projects_select on projects for select using (has_permission('projects.read'));
create policy projects_insert on projects for insert with check (has_permission('projects.create'));
create policy projects_update on projects for update using (has_permission('projects.update'));

-- ----------------------------------------------------------------------------
-- vehicle sessions / trips / fuel / expenses
-- ----------------------------------------------------------------------------

create policy vehicle_sessions_select on vehicle_sessions for select using (has_permission('sessions.read'));
create policy vehicle_sessions_write on vehicle_sessions for all
  using (has_permission('sessions.manage')) with check (has_permission('sessions.manage'));

create policy trips_select on trips for select using (has_permission('trips.read'));
create policy trips_insert on trips for insert with check (has_permission('trips.create'));
create policy trips_update on trips for update using (has_permission('trips.update'));

create policy fuel_select on fuel_transactions for select using (has_permission('fuel.read'));
create policy fuel_insert on fuel_transactions for insert with check (has_permission('fuel.create'));

create policy expenses_select on expenses for select using (has_permission('expenses.read'));
create policy expenses_insert on expenses for insert with check (has_permission('expenses.create'));
create policy expenses_update on expenses for update using (has_permission('expenses.approve'));

-- ----------------------------------------------------------------------------
-- maintenance / tyres / project expenses
-- ----------------------------------------------------------------------------

create policy maintenance_select on maintenance for select using (has_permission('maintenance.read'));
create policy maintenance_insert on maintenance for insert with check (has_permission('maintenance.create'));
create policy maintenance_update on maintenance for update using (has_permission('maintenance.update'));

create policy tyres_select on tyres for select using (has_permission('tyres.read'));
create policy tyres_write on tyres for all
  using (has_permission('tyres.manage')) with check (has_permission('tyres.manage'));

create policy project_expenses_select on project_expenses for select using (has_permission('projects.read'));
create policy project_expenses_insert on project_expenses for insert with check (has_permission('expenses.create'));

-- ----------------------------------------------------------------------------
-- tenders
-- ----------------------------------------------------------------------------

create policy tenders_select on tenders for select using (has_permission('tenders.read'));
create policy tenders_insert on tenders for insert with check (has_permission('tenders.create'));
create policy tenders_update on tenders for update using (has_permission('tenders.update'));

create policy tender_documents_select on tender_documents for select using (has_permission('tenders.read'));
create policy tender_documents_write on tender_documents for insert with check (has_permission('tenders.update'));

create policy tender_checklist_select on tender_checklist_items for select using (has_permission('tenders.read'));
create policy tender_checklist_write on tender_checklist_items for all
  using (has_permission('tenders.update')) with check (has_permission('tenders.update'));

-- ----------------------------------------------------------------------------
-- invoicing / payments / account transactions
-- ----------------------------------------------------------------------------

create policy invoices_select on invoices for select using (has_permission('invoices.read'));
create policy invoices_insert on invoices for insert with check (has_permission('invoices.create'));
create policy invoices_update on invoices for update using (has_permission('invoices.update'));

create policy invoice_items_select on invoice_items for select using (has_permission('invoices.read'));
create policy invoice_items_write on invoice_items for all
  using (has_permission('invoices.create')) with check (has_permission('invoices.create'));

create policy payments_select on payments for select using (has_permission('finance.read'));
create policy payments_insert on payments for insert with check (has_permission('finance.create'));

create policy account_txn_select on account_transactions for select using (has_permission('finance.read'));
create policy account_txn_insert on account_transactions for insert with check (has_permission('finance.create'));

-- ----------------------------------------------------------------------------
-- documents / notifications / audit
-- ----------------------------------------------------------------------------

create policy documents_select on documents for select using (auth.uid() is not null);
create policy documents_insert on documents for insert with check (auth.uid() is not null);

create policy notifications_select on notifications for select
  using (recipient_user_id = app_user_id());
create policy notifications_update on notifications for update
  using (recipient_user_id = app_user_id());

create policy audit_logs_select on audit_logs for select using (has_permission('audit.read'));
