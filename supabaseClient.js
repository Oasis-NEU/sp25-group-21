import {createClient} from "@supabase/supabase-js";




const supabaseUrl= "https://cymnggruwyndnwbbsrtv.supabase.co";
const supabaseKey= "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5bW5nZ3J1d3luZG53YmJzcnR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzMzQ5NDcsImV4cCI6MjA1NTkxMDk0N30.ICmQNhkIrtrrbTTtlOwh_rzZYIMW13G02CrX4sZzHlk";

export const supabase = createClient(supabaseUrl, supabaseKey);