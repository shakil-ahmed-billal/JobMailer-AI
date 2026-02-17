import { useAuthContext } from "@/lib/auth/auth-context";

// Re-exporting the context hook for consistent import paths
export const useAuth = () => {
  return useAuthContext();
};
