import { createClient } from "@supabase/supabase-js";

// Replace these with your actual project credentials from https://app.supabase.com
const supabaseUrl = "https://wyiaixaodiqxxxmnthwv.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5aWFpeGFvZGlxeHh4bW50aHd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxMjAyNzUsImV4cCI6MjA2NzY5NjI3NX0.MifUvHphb3RZ2eRri7bJ63dy8oz1ud1AQu03Yee20Zs";

export const supabase = createClient(supabaseUrl, supabaseKey);
