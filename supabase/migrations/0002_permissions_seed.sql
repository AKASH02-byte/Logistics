-- ============================================================================
-- Permission catalogue + default role -> permission grants.
-- ============================================================================

insert into permissions (code, module, description) values
  ('trucks.read',      'trucks',      'View trucks and their documents'),
  ('trucks.create',    'trucks',      'Add trucks to the fleet'),
  ('trucks.update',    'trucks',      'Edit truck details and status'),
  ('trucks.delete',    'trucks',      'Retire/remove trucks'),

  ('drivers.read',     'drivers',     'View labour/driver records'),
  ('drivers.create',   'drivers',     'Create labour accounts and login keys'),
  ('drivers.update',   'drivers',     'Edit labour records, reset login keys'),
  ('drivers.delete',   'drivers',     'Deactivate labour accounts'),

  ('sessions.read',    'sessions',    'View vehicle sessions'),
  ('sessions.manage',  'sessions',    'Force-close or reassign vehicle sessions'),

  ('trips.read',       'trips',       'View trips'),
  ('trips.create',     'trips',       'Create trips'),
  ('trips.update',     'trips',       'Edit/close trips'),

  ('fuel.read',        'fuel',        'View fuel transactions'),
  ('fuel.create',      'fuel',        'Log fuel transactions'),

  ('expenses.read',    'expenses',    'View expenses'),
  ('expenses.create',  'expenses',    'Log expenses'),
  ('expenses.approve', 'expenses',    'Approve recorded expenses'),

  ('maintenance.read',   'maintenance', 'View maintenance records'),
  ('maintenance.create', 'maintenance', 'Schedule/record maintenance'),
  ('maintenance.update', 'maintenance', 'Update maintenance records'),

  ('tyres.read',   'tyres', 'View tyre records'),
  ('tyres.manage', 'tyres', 'Fit/remove/scrap tyres'),

  ('customers.read',   'customers', 'View customers'),
  ('customers.create', 'customers', 'Add customers'),
  ('customers.update', 'customers', 'Edit customers'),

  ('vendors.read',   'vendors', 'View vendors'),
  ('vendors.create', 'vendors', 'Add vendors'),
  ('vendors.update', 'vendors', 'Edit vendors'),

  ('projects.read',   'projects', 'View projects'),
  ('projects.create', 'projects', 'Create projects'),
  ('projects.update', 'projects', 'Edit projects'),

  ('tenders.read',   'tenders', 'View tenders'),
  ('tenders.create', 'tenders', 'Create tenders'),
  ('tenders.update', 'tenders', 'Edit tenders/checklists'),

  ('invoices.read',   'invoices', 'View invoices'),
  ('invoices.create', 'invoices', 'Create/edit invoices'),
  ('invoices.update', 'invoices', 'Update invoice status'),
  ('invoices.void',   'invoices', 'Void invoices'),

  ('finance.read',   'finance', 'View accounts, payments and ledgers'),
  ('finance.create', 'finance', 'Record payments and account transactions'),
  ('finance.update', 'finance', 'Edit financial records'),

  ('reports.read',   'reports', 'View analytics and reports'),

  ('users.read',    'users', 'View admin/staff users'),
  ('users.create',  'users', 'Invite/create admin/staff users'),
  ('users.update',  'users', 'Edit user roles and status'),

  ('settings.manage', 'settings', 'Manage system settings'),
  ('audit.read',      'audit',    'View audit logs')
on conflict (code) do nothing;

-- ----------------------------------------------------------------------------
-- Role grants. SUPER_ADMIN gets everything; STAFF is read-only.
-- ----------------------------------------------------------------------------

insert into role_permissions (role, permission_id)
select 'SUPER_ADMIN', id from permissions
on conflict do nothing;

insert into role_permissions (role, permission_id)
select 'STAFF', id from permissions
where code in (
  'trucks.read', 'drivers.read', 'trips.read', 'fuel.read', 'expenses.read',
  'maintenance.read', 'tyres.read', 'customers.read', 'vendors.read',
  'projects.read', 'reports.read'
)
on conflict do nothing;

-- LABOUR gets no entries here: their app surface (trip logging, fuel entry,
-- session open/close) is governed by dedicated driver-scoped API routes,
-- not the general permission matrix.
