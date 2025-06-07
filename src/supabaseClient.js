// supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sbwphqvlybwnawayitio.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNid3BocXZseWJ3bmF3YXlpdGlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4ODM0NTcsImV4cCI6MjA2MzQ1OTQ1N30.ihSTAam7gg1EoEVsMSjUrtURJxxJHwZL4zAdDVcqX44';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
