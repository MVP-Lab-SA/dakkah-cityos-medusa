import { useEffect, type ReactNode } from "react"
import { useNavigate, useLocation } from "@tanstack/react-router"
import { useRequireAuth } from "@/lib/context/auth-context"
import { useTenantPrefix } from "@/lib/context/tenant-context"
import { Spinner } from "@medusajs/icons"

interface AuthGuardProps {
  children: ReactNode
  requireB2B?: boolean
  fallbackPath?: string
}

export function AuthGuard({ children, requireB2B = false, fallbackPath }: AuthGuardProps) {
  if (typeof window === "undefined") {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <p className="text-sm text-zinc-500">Loading...</p>
      </div>
    )
  }

  return <ClientAuthGuard requireB2B={requireB2B} fallbackPath={fallbackPath}>{children}</ClientAuthGuard>
}

function ClientAuthGuard({ children, requireB2B = false, fallbackPath }: AuthGuardProps) {
  const { isAuthenticated, isB2B, isLoading } = useRequireAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const prefix = useTenantPrefix()

  useEffect(() => {
    if (isLoading) return

    if (!isAuthenticated) {
      const redirectPath = fallbackPath || `${prefix}/login`
      navigate({
        to: redirectPath as any,
      })
      return
    }

    if (requireB2B && !isB2B) {
      navigate({ to: `${prefix}/account` as any })
    }
  }, [isAuthenticated, isB2B, isLoading, requireB2B, navigate, location.pathname, prefix, fallbackPath])

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Spinner className="w-8 h-8 animate-spin text-zinc-400 mx-auto" />
          <p className="text-sm text-zinc-500">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  if (requireB2B && !isB2B) {
    return null
  }

  return <>{children}</>
}

export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options?: { requireB2B?: boolean; fallbackPath?: string }
) {
  return function AuthenticatedComponent(props: P) {
    return (
      <AuthGuard requireB2B={options?.requireB2B} fallbackPath={options?.fallbackPath}>
        <Component {...props} />
      </AuthGuard>
    )
  }
}
