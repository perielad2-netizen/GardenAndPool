How to apply these migrations in Supabase (SQL Editor):

1) Open Supabase project → SQL Editor.
2) Paste and run 0001_initial_schema.sql.
3) Paste and run 0002_rls_policies.sql.

Notes:
- profiles.id references auth.users(id). Create a profile row after sign-up.
- Policies assume a custom JWT claim `role` with possible values: customer, technician, admin.
- Storage for images is recommended via Supabase Storage (buckets e.g., `pool_photos`).
