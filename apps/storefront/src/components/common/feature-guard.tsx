import { ReactNode } from "react"
import { Navigate } from "@tanstack/react-router"
import { useFeatures, FeatureFlags } from "../../lib/context/feature-context"
import { useTenantPrefix } from "@/lib/context/tenant-context"

type FeatureKey = keyof Omit<FeatureFlags, 'config' | 'homepage' | 'navigation'>

interface FeatureGuardProps {
  /** The feature that must be enabled */
  feature: FeatureKey
  /** Content to show when feature is enabled */
  children: ReactNode
  /** Where to redirect if feature is disabled (optional) */
  redirectTo?: string
  /** Fallback content if feature is disabled and no redirect */
  fallback?: ReactNode
}

/**
 * FeatureGuard - Conditionally render content based on feature flags
 * 
 * Usage:
 * <FeatureGuard feature="marketplace">
 *   <VendorPage />
 * </FeatureGuard>
 * 
 * With redirect:
 * <FeatureGuard feature="b2b" redirectTo="/">
 *   <BusinessPortal />
 * </FeatureGuard>
 * 
 * With fallback:
 * <FeatureGuard feature="reviews" fallback={<NoReviewsMessage />}>
 *   <ReviewsList />
 * </FeatureGuard>
 */
export function FeatureGuard({ 
  feature, 
  children, 
  redirectTo, 
  fallback 
}: FeatureGuardProps) {
  const { isEnabled, loading } = useFeatures()
  const prefix = useTenantPrefix()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ds-foreground"></div>
      </div>
    )
  }

  if (!isEnabled(feature)) {
    if (redirectTo) {
      const path = `${prefix}${redirectTo}`
      return <Navigate to={path} />
    }
    
    if (fallback) {
      return <>{fallback}</>
    }
    
    return null
  }

  return <>{children}</>
}

/**
 * ConditionalFeature - Show/hide content based on feature flag (no redirect)
 * 
 * Usage:
 * <ConditionalFeature feature="marketplace">
 *   <VendorLink />
 * </ConditionalFeature>
 */
export function ConditionalFeature({ 
  feature, 
  children 
}: { 
  feature: FeatureKey
  children: ReactNode 
}) {
  const { isEnabled } = useFeatures()
  
  if (!isEnabled(feature)) {
    return null
  }
  
  return <>{children}</>
}

/**
 * MultiFeatureGuard - Require multiple features to be enabled
 * 
 * Usage:
 * <MultiFeatureGuard features={['b2b', 'quotes']}>
 *   <QuotesPage />
 * </MultiFeatureGuard>
 */
export function MultiFeatureGuard({ 
  features, 
  children, 
  requireAll = true,
  fallback 
}: { 
  features: FeatureKey[]
  children: ReactNode
  requireAll?: boolean // true = all must be enabled, false = any one enabled
  fallback?: ReactNode
}) {
  const { isEnabled, loading } = useFeatures()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ds-foreground"></div>
      </div>
    )
  }

  const enabled = requireAll
    ? features.every(f => isEnabled(f))
    : features.some(f => isEnabled(f))

  if (!enabled) {
    return fallback ? <>{fallback}</> : null
  }

  return <>{children}</>
}

/**
 * FeatureDisabledMessage - Standard message for disabled features
 */
export function FeatureDisabledMessage({ 
  title = "Feature Not Available",
  message = "This feature is not currently enabled for this store."
}: { 
  title?: string
  message?: string 
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
      <div className="w-16 h-16 bg-ds-muted rounded-full flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-ds-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-ds-foreground mb-2">{title}</h2>
      <p className="text-ds-muted-foreground max-w-md">{message}</p>
    </div>
  )
}
