#!/usr/bin/env node

/**
 * Supabase Configuration Test Script
 *
 * Run this to verify your Supabase setup:
 * node scripts/test-supabase.js
 */

const https = require("https");
const fs = require("fs");
const path = require("path");

// Load .env file manually
const envPath = path.join(__dirname, "..", ".env");
let SUPABASE_URL, SUPABASE_ANON_KEY;

try {
  const envContent = fs.readFileSync(envPath, "utf8");
  const envLines = envContent.split("\n");

  for (const line of envLines) {
    const [key, ...valueParts] = line.split("=");
    const value = valueParts.join("=").trim();

    if (key === "EXPO_PUBLIC_SUPABASE_URL") {
      SUPABASE_URL = value;
    } else if (key === "EXPO_PUBLIC_SUPABASE_ANON_KEY") {
      SUPABASE_ANON_KEY = value;
    }
  }
} catch (err) {
  console.error("❌ Could not read .env file:", err.message);
  process.exit(1);
}

console.log("🔍 Testing Supabase Configuration...\n");

// Check environment variables
if (!SUPABASE_URL) {
  console.error("❌ EXPO_PUBLIC_SUPABASE_URL is not set");
  process.exit(1);
}

if (!SUPABASE_ANON_KEY) {
  console.error("❌ EXPO_PUBLIC_SUPABASE_ANON_KEY is not set");
  process.exit(1);
}

console.log("✅ Environment variables loaded");
console.log("📍 URL:", SUPABASE_URL);

// Check URL format
if (
  !SUPABASE_URL.startsWith("https://") ||
  !SUPABASE_URL.includes(".supabase.co")
) {
  console.error(
    "❌ Invalid Supabase URL format. Should be: https://[project-ref].supabase.co",
  );
  console.log(
    "💡 Get your URL from: https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api",
  );
  process.exit(1);
}

// Check anon key format
if (!SUPABASE_ANON_KEY.startsWith("eyJ")) {
  console.error(
    '❌ Invalid Supabase anon key format. Should start with "eyJ" (JWT format)',
  );
  console.log(
    "💡 Get your anon key from: https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api",
  );
  console.log(
    "💡 Current key starts with:",
    SUPABASE_ANON_KEY.substring(0, 10) + "...",
  );
  process.exit(1);
}

console.log("✅ URL format is correct");
console.log("✅ Anon key format is correct");

// Test URL accessibility
console.log("\n🌐 Testing URL accessibility...");

const url = new URL(SUPABASE_URL);
const options = {
  hostname: url.hostname,
  path: "/rest/v1/",
  method: "GET",
  headers: {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  },
};

const req = https.request(options, (res) => {
  console.log("📊 Response status:", res.statusCode);

  if (res.statusCode === 200 || res.statusCode === 401) {
    console.log("✅ Supabase URL is accessible");
    console.log("✅ Configuration appears correct");
    console.log("\n🎉 Ready to test authentication in the app!");
  } else {
    console.error("❌ Unexpected response from Supabase");
    console.log("💡 Check your project exists and is active");
  }
});

req.on("error", (err) => {
  console.error("❌ Network error:", err.message);
  console.log("💡 Check your internet connection");
});

req.setTimeout(5000, () => {
  console.error("❌ Request timeout");
  req.destroy();
});

req.end();
