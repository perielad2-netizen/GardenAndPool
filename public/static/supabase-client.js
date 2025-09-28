// Lightweight Supabase client loader for frontend only
// Inject URL and ANON KEY from Cloudflare Pages vars (PUBLIC_*) via env replacement
export function getSupabaseEnv() {
  return {
    url: (typeof PUBLIC_SUPABASE_URL !== 'undefined' ? PUBLIC_SUPABASE_URL : ''),
    anon: (typeof PUBLIC_SUPABASE_ANON_KEY !== 'undefined' ? PUBLIC_SUPABASE_ANON_KEY : '')
  }
}
