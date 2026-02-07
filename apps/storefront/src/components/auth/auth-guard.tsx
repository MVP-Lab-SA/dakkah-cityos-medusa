import { useEffect, type ReactNode } from "react"
import { useNavigate, useLocation } from "@tanstack/react-router"
import { useRequireAuth } from "@/lib/context/auth-context"
import { getCountryCodeFromPath } from "@/lib/utils/region"
import { Spinner } from "@medusajs/icons"

interface AuthGuardProps {
  children: ReactNode
  requireB2B?: boolean
  fallbackPath?: string
}

export function AuthGuard({ children, requireB2B = false, fallbackPath }: AuthGuardProps) {
  const { isAuthenticated, isB2B, isLoading } = useRequireAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const countryCode = getCountryCodeFromPath(location.pathname)
  const baseHref = countryCode ? `/${countryCode}` : ""

  useEffect(() => {
    if (isLoading) return

    if (!isAuthenticated) {
      const redirectPath = fallbackPath || `${baseHref}/login`
      navigate({
        to: redirectPath as any,
      })
      return
    }

    if (requireB2B && !isB2B) {
      navigate({ to: `${baseHref}/account` as any })
    }
  }, [isAuthenticated, isB2B, isLoading, requireB2B, navigate, location.pathname, baseHref, fallbackPath])

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

// HOC version for route components
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
