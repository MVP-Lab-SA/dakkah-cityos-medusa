import { type ReactNode } from "react"
import { useQuery } from "@tanstack/react-query"
import { ManageLayout } from "@/components/manage"
import { Container } from "./container"
import { PageHeader } from "./page-header"
import { DataTable } from "./data-table"
import { StatsGrid } from "./stats-grid"
import { useTenant } from "@/lib/context/tenant-context"
import { sdk } from "@/lib/utils/sdk"

interface Column<T = Record<string, unknown>> {
  key: string
  header: string
  render?: (value: unknown, row: T) => ReactNode
  align?: "start" | "center" | "end"
}

interface CrudPageProps {
  locale: string
  moduleKey: string
  title: string
  subtitle?: string
  icon?: React.ComponentType<{ className?: string }>
  columns: Column[]
  data: any[]
  isLoading: boolean
  searchable?: boolean
  searchKey?: string
  searchPlaceholder?: string
  emptyTitle?: string
  emptyDescription?: string
  countLabel?: string
  actions?: ReactNode
  filters?: ReactNode
  stats?: Array<{ label: string; value: string | number; trend?: { value: number; positive: boolean } }>
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 bg-ds-muted/20 rounded-lg w-48" />
      <div className="h-4 bg-ds-muted/20 rounded-lg w-32" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="h-24 bg-ds-muted/20 rounded-lg" />
        <div className="h-24 bg-ds-muted/20 rounded-lg" />
        <div className="h-24 bg-ds-muted/20 rounded-lg" />
        <div className="h-24 bg-ds-muted/20 rounded-lg" />
      </div>
      <div className="h-64 bg-ds-muted/20 rounded-lg" />
    </div>
  )
}

export function CrudPage({
  locale,
  moduleKey,
  title,
  subtitle,
  icon: Icon,
  columns,
  data,
  isLoading,
  searchable = false,
  searchKey,
  searchPlaceholder,
  emptyTitle,
  emptyDescription,
  countLabel,
  actions,
  filters,
  stats,
}: CrudPageProps) {
  if (isLoading) {
    return (
      <ManageLayout locale={locale}>
        <Container>
          <LoadingSkeleton />
        </Container>
      </ManageLayout>
    )
  }

  return (
    <ManageLayout locale={locale}>
      <Container>
        {Icon ? (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <Icon className="w-6 h-6 text-ds-muted" />
              <div>
                <h2 className="text-2xl font-semibold text-ds-text">{title}</h2>
                {subtitle && (
                  <p className="mt-1 text-sm text-ds-muted">{subtitle}</p>
                )}
              </div>
            </div>
            {actions && (
              <div className="flex items-center gap-2 sm:justify-end">
                {actions}
              </div>
            )}
          </div>
        ) : (
          <PageHeader
            title={title}
            subtitle={subtitle}
            actions={actions}
          />
        )}

        {stats && stats.length > 0 && (
          <StatsGrid stats={stats} />
        )}

        {filters && (
          <div className="flex items-center gap-3 flex-wrap">
            {filters}
          </div>
        )}

        <DataTable
          columns={columns}
          data={data}
          searchable={searchable}
          searchPlaceholder={searchPlaceholder}
          searchKey={searchKey}
          emptyTitle={emptyTitle}
          emptyDescription={emptyDescription}
          countLabel={countLabel}
        />
      </Container>
    </ManageLayout>
  )
}

interface ManageModulePageProps {
  moduleKey: string
  apiEndpoint: string
  columns: Column[]
  title: string
  subtitle?: string
  icon?: React.ComponentType<{ className?: string }>
  searchable?: boolean
  searchKey?: string
  searchPlaceholder?: string
  emptyTitle?: string
  emptyDescription?: string
  countLabel?: string
  addLabel?: string
  actions?: ReactNode
  filters?: ReactNode
  stats?: Array<{ label: string; value: string | number; trend?: { value: number; positive: boolean } }>
  transformData?: (response: any) => any[]
  queryParams?: Record<string, unknown>
}

export function ManageModulePage({
  moduleKey,
  apiEndpoint,
  columns,
  title,
  subtitle,
  icon,
  searchable = false,
  searchKey,
  searchPlaceholder,
  emptyTitle,
  emptyDescription,
  countLabel,
  addLabel,
  actions,
  filters,
  stats,
  transformData,
  queryParams,
}: ManageModulePageProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = ctxLocale || "en"

  const { data: response, isLoading } = useQuery({
    queryKey: ["manage", moduleKey, apiEndpoint, queryParams],
    queryFn: async () => {
      const res = await sdk.client.fetch(apiEndpoint, {
        method: "GET",
        query: queryParams,
      })
      return res
    },
    enabled: typeof window !== "undefined",
  })

  const data = transformData
    ? transformData(response)
    : (response as any)?.[moduleKey] || (response as any)?.data || []

  const resolvedActions = addLabel ? (
    <button
      type="button"
      className="px-4 py-2 bg-ds-primary text-white rounded-lg text-sm font-medium hover:bg-ds-primary/90 transition-colors flex items-center gap-2"
    >
      {addLabel}
    </button>
  ) : actions

  return (
    <CrudPage
      locale={locale}
      moduleKey={moduleKey}
      title={title}
      subtitle={subtitle}
      icon={icon}
      columns={columns}
      data={data}
      isLoading={isLoading}
      searchable={searchable}
      searchKey={searchKey}
      searchPlaceholder={searchPlaceholder}
      emptyTitle={emptyTitle}
      emptyDescription={emptyDescription}
      countLabel={countLabel}
      actions={resolvedActions}
      filters={filters}
      stats={stats}
    />
  )
}

export type { CrudPageProps, ManageModulePageProps, Column }
