// Re-export auth hooks from context for convenience
export { useAuth, useRequireAuth } from "@/lib/context/auth-context"
export type { 
  Customer, 
  LoginCredentials, 
  RegisterData, 
  AuthContextType 
} from "@/lib/context/auth-context"
