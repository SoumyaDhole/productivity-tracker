import { User } from "../types/user";

export const fetchUserProfile = async (userId: string): Promise<User> => {
  // Placeholder for API integration.
  return {
    id: userId,
    name: "Productivity User",
    email: "user@example.com",
  };
};
