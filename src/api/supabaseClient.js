import { createClient } from "@supabase/supabase-js";

// Replace these with your actual project credentials from https://app.supabase.com
const supabaseUrl = "https://wyiaixaodiqxxxmnthwv.supabase.co";
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);
