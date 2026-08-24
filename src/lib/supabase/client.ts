import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://rlobdamkovasoaijiisk.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_78HPrr6lQ8N_Ta4Ww8Es0Q_rQYOnOd0";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
