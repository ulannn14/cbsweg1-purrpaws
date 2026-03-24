const { createClient } = require("@supabase/supabase-js");

// Read values from environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Optional: sanity check to catch missing env variables
if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in your .env file"
  );
}

// Create a single Supabase client instance
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;