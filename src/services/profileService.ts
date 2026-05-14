import { supabase } from "@/src/lib/supabase";
import type { ProfileRow, ProfileUpdate } from "@/src/types/database";
import { ServiceError, toServiceError } from "./errors";

export async function fetchProfile(userId: string): Promise<ProfileRow> {
  const { data, error } = await supabase
    .from("profiles")
    .select(
      "id, username, full_name, avatar_url, level, xp, created_at",
    )
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw toServiceError("fetchProfile", error);
  }
  if (!data) {
    throw new ServiceError("fetchProfile: profile not found");
  }
  return data as ProfileRow;
}

export async function updateProfile(
  userId: string,
  updates: ProfileUpdate,
): Promise<ProfileRow> {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select(
      "id, username, full_name, avatar_url, level, xp, created_at",
    )
    .single();

  if (error) {
    throw toServiceError("updateProfile", error);
  }
  if (!data) {
    throw new ServiceError("updateProfile: no row returned");
  }
  return data as ProfileRow;
}
