# Supabase Authentication Setup

## 🚨 CRITICAL: Fix Your Supabase Configuration

Your Supabase authentication is failing because the anon key format is incorrect.

### The Problem

- Current anon key starts with: `sb_publishable_...`
- Supabase requires JWT format starting with: `eyJ...`

### How to Fix

1. **Go to your Supabase Dashboard:**
   - Visit: https://supabase.com/dashboard
   - Select your project

2. **Get the correct API keys:**
   - Go to: Settings → API
   - Copy the **anon/public** key (should start with `eyJ`)
   - Copy the **Project URL** (should be `https://[project-ref].supabase.co`)

3. **Update your `.env` file:**

   ```env
   EXPO_PUBLIC_SUPABASE_URL=https://your-actual-project-ref.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

4. **Test the configuration:**

   ```bash
   node scripts/test-supabase.js
   ```

5. **Restart your Expo app:**
   ```bash
   npx expo start --clear
   ```

### Verification

Once fixed, you should see:

- ✅ URL format is correct
- ✅ Anon key format is correct
- ✅ Supabase URL is accessible
- ✅ Authentication works in the app

### Current Status

❌ **BROKEN**: Invalid anon key format
🔄 **ACTION NEEDED**: Update `.env` with correct Supabase values
