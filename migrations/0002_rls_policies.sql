-- Enable RLS
alter table profiles enable row level security;
alter table properties enable row level security;
alter table subscriptions enable row level security;
alter table appointments enable row level security;
alter table service_requests enable row level security;
alter table invoices enable row level security;
alter table work_reports enable row level security;
alter table notifications enable row level security;
alter table files enable row level security;

-- Helper for checking admin role via jwt (Supabase custom JWT claims)
-- Expect claim: role in jwt
create or replace function auth_role() returns text language sql stable as $$
  select coalesce(nullif(current_setting('request.jwt.claims', true)::jsonb->>'role',''), 'customer');
$$;

-- PROFILES: owner can select/update own row
create policy profiles_select_self on profiles for select using ( auth.uid() = id or auth_role() = 'admin' );
create policy profiles_update_self on profiles for update using ( auth.uid() = id or auth_role() = 'admin' );
create policy profiles_insert_self on profiles for insert with check ( auth.uid() = id or auth_role() = 'admin' );

-- PROPERTIES: only owner (or admin) can CRUD
create policy properties_all_owner on properties for all
  using ( owner_id = auth.uid() or auth_role() = 'admin' )
  with check ( owner_id = auth.uid() or auth_role() = 'admin' );

-- SUBSCRIPTIONS: user owns
create policy subscriptions_all_owner on subscriptions for all
  using ( user_id = auth.uid() or auth_role() = 'admin' )
  with check ( user_id = auth.uid() or auth_role() = 'admin' );

-- APPOINTMENTS: owner of property OR assigned technician OR admin can select; technician/admin can update
create policy appointments_select on appointments for select using (
  auth_role() = 'admin'
  or exists (select 1 from properties p where p.id = appointments.property_id and p.owner_id = auth.uid())
  or technician_id = auth.uid()
);
create policy appointments_insert on appointments for insert with check (
  auth_role() = 'admin' or technician_id = auth.uid()
);
create policy appointments_update on appointments for update using (
  auth_role() = 'admin' or technician_id = auth.uid()
);

-- SERVICE REQUESTS: owner can CRUD own requests; assigned tech/admin can select/update
create policy sr_select on service_requests for select using (
  auth_role() = 'admin' or user_id = auth.uid() or assigned_technician = auth.uid()
);
create policy sr_insert on service_requests for insert with check (
  user_id = auth.uid() or auth_role() = 'admin'
);
create policy sr_update on service_requests for update using (
  auth_role() = 'admin' or user_id = auth.uid() or assigned_technician = auth.uid()
);

-- INVOICES: owner or admin
create policy invoices_all on invoices for all using ( user_id = auth.uid() or auth_role() = 'admin' );

-- WORK REPORTS: technician/admin can insert/update; owner can select reports tied to their appointment
create policy reports_select on work_reports for select using (
  auth_role() = 'admin' or technician_id = auth.uid() or exists (
    select 1 from appointments a join properties p on p.id = a.property_id
    where a.id = work_reports.appointment_id and p.owner_id = auth.uid()
  )
);
create policy reports_write on work_reports for insert with check ( auth_role() = 'admin' or technician_id = auth.uid() );
create policy reports_update on work_reports for update using ( auth_role() = 'admin' or technician_id = auth.uid() );

-- NOTIFICATIONS: owner or admin
create policy notifications_all on notifications for all using ( user_id = auth.uid() or auth_role() = 'admin' );

-- FILES: owner or admin
create policy files_all on files for all using ( user_id = auth.uid() or auth_role() = 'admin' );
