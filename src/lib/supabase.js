import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://pcioiyrdwgjgubdvkine.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjaW9peXJkd2dqZ3ViZHZraW5lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxNDQyNjYsImV4cCI6MjA4MTcyMDI2Nn0.0erR7jr8VBFqBVPLVxs4Jwyl8s5-nHxsp2fBP-Wgwic";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
