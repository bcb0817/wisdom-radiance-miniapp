import {createClient} from "@supabase/supabase-js";
export const adminSupabase=process.env.SUPABASE_SERVICE_ROLE_KEY?createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.SUPABASE_SERVICE_ROLE_KEY,{auth:{autoRefreshToken:false,persistSession:false}}):null;
