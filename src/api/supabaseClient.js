import { createClient } from "@supabase/supabase-js";

// Replace these with your actual project credentials from https://app.supabase.com
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);
