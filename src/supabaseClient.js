import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wkgiskznchivzajrksna.supabase.co'; // Replace with your Project URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrZ2lza3puY2hpdnphanJrc25hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM4NTI3MDksImV4cCI6MjA0OTQyODcwOX0.ds4VvsHgmSSPdfxY4SpfEd7P64HtF4HQJqI4xDEmYs8'; // Replace with your API Key
export const supabase = createClient(supabaseUrl, supabaseKey);
