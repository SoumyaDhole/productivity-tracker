import { supabase } from "@/src/lib/supabase";

type AuthCredentials = {
  email: string;
  password: string;
};

/**
 * Parse and format Supabase error messages for users
 */
function formatAuthError(error: unknown): string {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    // Map common Supabase errors to user-friendly messages
    if (message.includes("invalid login credentials")) {
      return "Invalid email or password";
    }
    if (message.includes("user already registered")) {
      return "Email already registered. Try logging in instead.";
    }
    if (message.includes("password")) {
      return "Password must be at least 6 characters";
    }
    if (message.includes("invalid email")) {
      return "Please enter a valid email address";
    }
    if (message.includes("network")) {
      return "Network error. Check your connection and try again.";
    }
    if (message.includes("invalid path")) {
      return "Supabase configuration error. Check your project URL and API key.";
    }

    // Return original message if no match
    return error.message;
  }

  return "An unexpected error occurred";
}

/**
 * Test Supabase connection
 */
export async function testConnection(): Promise<boolean> {
  try {
    console.log("🔍 Testing Supabase connection...");
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error("❌ Supabase connection failed:", error.message);
      return false;
    }

    console.log("✅ Supabase connection successful");
    console.log("📊 Session status:", data.session ? "Active" : "None");
    return true;
  } catch (err) {
    console.error("❌ Supabase test error:", err);
    return false;
  }
}

export async function signUp({ email, password }: AuthCredentials) {
  console.log("Starting signup for email:", email);

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error("Signup error from Supabase:", error.message);
      throw new Error(formatAuthError(error));
    }

    console.log("Signup successful for:", email);
    return data;
  } catch (err) {
    console.error("Signup exception:", err);
    throw new Error(
      err instanceof Error ? formatAuthError(err) : "Signup failed",
    );
  }
}

export async function signIn({ email, password }: AuthCredentials) {
  console.log("Starting signin for email:", email);

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Signin error from Supabase:", error.message);
      throw new Error(formatAuthError(error));
    }

    console.log("Signin successful for:", email);
    return data;
  } catch (err) {
    console.error("Signin exception:", err);
    throw new Error(
      err instanceof Error ? formatAuthError(err) : "Login failed",
    );
  }
}
