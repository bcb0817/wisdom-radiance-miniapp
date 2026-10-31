import {createClient} from "@supabase/supabase-js";
// User-specific and moderated data must never reuse Next.js's persistent fetch cache.
export const adminSupabase=process.env.SUPABASE_SERVICE_ROLE_KEY?createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.SUPABASE_SERVICE_ROLE_KEY,{auth:{autoRefreshToken:false,persistSession:false},global:{fetch:(input,init)=>fetch(input,{...init,cache:"no-store"})}}):null;
