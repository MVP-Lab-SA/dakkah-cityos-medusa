import { type ReactNode } from "react"
import { useAuth } from "@/lib/context/auth-context"
import { useTenant } from "@/lib/context/tenant-context"
import { t } from "@/lib/i18n"
import { RBAC_ROLE_WEIGHTS, type RbacRole } from "@/lib/types/tenant-admin"
import { Link } from "@tanstack/react-router"
import { sdk } from "@/lib/utils/sdk"
import { useQuery } from "@tanstack/react-query"
import { LoginForm } from "@/components/auth/login-form"

const MIN_MANAGE_WEIGHT = 40

interface RoleGuardProps {
  children: ReactNode
  locale?: string
}

function resolveRole(tenantUserRole: RbacRole | null, customerMetadataRole: RbacRole | null): RbacRole | null {
  if (tenantUserRole && tenantUserRole in RBAC_ROLE_WEIGHTS) return tenantUserRole
  if (customerMetadataRole && customerMetadataRole in RBAC_ROLE_WEIGHTS) return customerMetadataRole
  return null
}

function useTenantUserRole(tenantSlug: string, customerId: string | undefined) {
  return useQuery({
    queryKey: ["tenant-user-role", tenantSlug, customerId],
    queryFn: async () => {
      try {
        const response = await sdk.client.fetch(`/platform/${tenantSlug}/context`, { method: "GET" })
        const data = response as any
        const userRole = data?.user?.role || data?.tenantUser?.role
        if (userRole && userRole in RBAC_ROLE_WEIGHTS) {
          return userRole as RbacRole
        }
        return null
      } catch {
        return null
      }
    },
    enabled: !!customerId && !!tenantSlug,
    staleTime: 1000 * 60 * 5,
    retry: false,
  })
}

function LoadingState({ locale }: { locale: string }) {
  return (
    <div className="min-h-screen bg-ds-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-8 h-8 border-2 border-ds-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-ds-muted">{t(locale, "common.loading")}</p>
      </div>
    </div>
  )
}

function LoginRequired({ locale, tenantSlug }: { locale: string; tenantSlug: string }) {
  return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white border border-ds-border rounded-lg p-8 space-y-6">
          {/* Header */}
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold text-ds-text">
              {t(locale, "manage.log_in")}
            </h1>
            <p className="text-sm text-ds-muted">
              {t(locale, "manage.log_in_subtitle")}
            </p>
          </div>

          {/* Login Form */}
          <LoginForm />

          {/* Back to Store Link */}
          <div className="text-center pt-4 border-t border-ds-border">
            <Link
              to={`/${tenantSlug}/${locale}` as any}
              className="text-sm text-ds-muted-foreground hover:text-ds-foreground transition-colors"
            >
              {t(locale, "manage.back_to_store")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function AccessDenied({ locale, tenantSlug }: { locale: string; tenantSlug: string }) {
  return (
    <div className="min-h-screen bg-ds-background flex items-center justify-center">
      <div className="bg-ds-card border border-ds-border rounded-lg p-8 max-w-md w-full mx-4 text-center space-y-4">
        <div className="w-16 h-16 bg-ds-destructive/10 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-ds-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-ds-text">{t(locale, "manage.access_denied")}</h2>
        <p className="text-ds-muted text-sm">{t(locale, "manage.unauthorized_message")}</p>
        <p className="text-ds-muted text-xs">{t(locale, "manage.role_required")}</p>
        <Link
          to={`/${tenantSlug}/${locale}` as any}
          className="inline-block px-6 py-2 bg-ds-primary text-ds-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          {t(locale, "manage.back_to_store")}
        </Link>
      </div>
    </div>
  )
}

function AuthenticatedRoleCheck({ children, locale, tenantSlug, customer }: { children: ReactNode; locale: string; tenantSlug: string; customer: any }) {
  const { data: tenantRole, isLoading: isRoleLoading } = useTenantUserRole(tenantSlug, customer?.id)
  const metadataRole = customer?.metadata?.role as RbacRole | undefined
  const role = resolveRole(tenantRole ?? null, metadataRole && metadataRole in RBAC_ROLE_WEIGHTS ? metadataRole : null)
  const weight = role ? RBAC_ROLE_WEIGHTS[role] : 0

  if (isRoleLoading) {
    return <LoadingState locale={locale} />
  }

  if (weight < MIN_MANAGE_WEIGHT) {
    return <AccessDenied locale={locale} tenantSlug={tenantSlug} />
  }

  return <>{children}</>
}

export function RoleGuard({ children, locale: localeProp }: RoleGuardProps) {
  const { locale: ctxLocale, tenantSlug } = useTenant()
  const locale = localeProp || ctxLocale || "en"
  const { customer, isLoading, isAuthenticated } = useAuth()

  if (typeof window === "undefined") {
    return <LoadingState locale={locale} />
  }

  if (isLoading) {
    return <LoadingState locale={locale} />
  }

  if (!isAuthenticated) {
    return <LoginRequired locale={locale} tenantSlug={tenantSlug} />
  }

  return (
    <AuthenticatedRoleCheck locale={locale} tenantSlug={tenantSlug} customer={customer}>
      {children}
    </AuthenticatedRoleCheck>
  )
}

export function useManageRole() {
  const { customer } = useAuth()
  const { tenantSlug } = useTenant()
  const { data: tenantRole } = useTenantUserRole(tenantSlug, customer?.id)
  const metadataRole = customer?.metadata?.role as RbacRole | undefined
  const role = resolveRole(tenantRole ?? null, metadataRole && metadataRole in RBAC_ROLE_WEIGHTS ? metadataRole : null)
  const weight = role ? RBAC_ROLE_WEIGHTS[role] : 0
  return {
    role,
    weight,
    hasAccess: weight >= MIN_MANAGE_WEIGHT,
    isSuperAdmin: role === "super-admin",
    isManager: weight >= 70,
  }
}
