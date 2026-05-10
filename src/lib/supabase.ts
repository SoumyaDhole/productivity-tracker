import "react-native-url-polyfill/auto";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  const error =
    "❌ Missing Supabase environment variables. Check EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in .env";
  console.error(error);
  throw new Error(error);
}

// Validate URL format
if (
  !supabaseUrl.startsWith("https://") ||
  !supabaseUrl.includes(".supabase.co")
) {
  const error = `❌ Invalid Supabase URL format: ${supabaseUrl}. Should be https://[project-ref].supabase.co`;
  console.error(error);
  throw new Error(error);
}

// Validate anon key format (should be JWT starting with eyJ)
if (!supabaseAnonKey.startsWith("eyJ")) {
  const error = `❌ Invalid Supabase anon key format. Should start with 'eyJ'. Current key starts with: ${supabaseAnonKey.substring(0, 10)}...`;
  console.error(error);
  throw new Error(error);
}

// Debug: Log configuration (keys are masked for security)
console.log("✅ Supabase initialized successfully");
console.log("📍 URL:", supabaseUrl);
console.log(
  "🔑 Key format:",
  supabaseAnonKey.startsWith("eyJ") ? "JWT" : "Unknown",
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
