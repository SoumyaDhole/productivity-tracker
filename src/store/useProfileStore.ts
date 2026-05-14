import { create } from "zustand";

import { fetchProfile, updateProfile } from "@/src/services/profileService";
import { ServiceError } from "@/src/services/errors";
import type { ProfileRow, ProfileUpdate } from "@/src/types/database";

function formatLoadError(err: unknown): string {
  if (err instanceof ServiceError) {
    return err.message;
  }
  if (err instanceof Error) {
    return err.message;
  }
  return "Failed to load profile";
}

interface ProfileState {
  profile: ProfileRow | null;
  loading: boolean;
  error: string | null;
  loadProfile: (userId: string) => Promise<void>;
  patchProfile: (userId: string, updates: ProfileUpdate) => Promise<void>;
  reset: () => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  loading: false,
  error: null,

  loadProfile: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const profile = await fetchProfile(userId);
      set({ profile, loading: false, error: null });
    } catch (err) {
      set({
        profile: null,
        loading: false,
        error: formatLoadError(err),
      });
    }
  },

  patchProfile: async (userId: string, updates: ProfileUpdate) => {
    set({ loading: true, error: null });
    try {
      const profile = await updateProfile(userId, updates);
      set({ profile, loading: false, error: null });
    } catch (err) {
      set((s) => ({
        ...s,
        loading: false,
        error: formatLoadError(err),
      }));
    }
  },

  reset: () => {
    set({ profile: null, loading: false, error: null });
  },
}));
