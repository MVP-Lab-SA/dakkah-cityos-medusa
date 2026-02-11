import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { ManageLayout } from "@/components/manage"
import { Container, PageHeader, DataTable, StatusBadge } from "@/components/manage/ui"
import { t } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"

export const Route = createFileRoute("/$tenant/$locale/manage/social-commerce")({
  component: ManageSocialCommercePage,
})

const STATUS_FILTERS = ["all", "published", "draft", "scheduled"] as const

function ManageSocialCommercePage() {
  const { locale: routeLocale } = Route.useParams()
  const { locale: ctxLocale } = useTenant()
  const locale = routeLocale || ctxLocale || "en"
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const { data, isLoading } = useQuery({
    queryKey: ["manage", "social-commerce"],
    queryFn: async () => {
      const response = await sdk.client.fetch("/admin/social-commerce", { method: "GET" })
      return response
    },
    enabled: typeof window !== "undefined",
  })

  const allPosts = ((data as any)?.posts || (data as any)?.social_commerce || []).map((item: any) => ({
    id: item.id,
    title: item.title || item.name || "—",
    platform: item.platform || "—",
    products_linked: item.products_linked ?? item.products_count ?? 0,
    likes: item.likes ?? 0,
    shares: item.shares ?? 0,
    status: item.status || "draft",
  }))

  const posts = statusFilter === "all"
    ? allPosts
    : allPosts.filter((i: any) => i.status === statusFilter)

  const columns = [
    {
      key: "title",
      header: t(locale, "manage.title"),
      render: (val: unknown) => <span className="font-medium">{val as string}</span>,
    },
    {
      key: "platform",
      header: t(locale, "manage.platform"),
    },
    {
      key: "products_linked",
      header: t(locale, "manage.products_linked"),
      align: "end" as const,
    },
    {
      key: "likes",
      header: t(locale, "manage.likes"),
      align: "end" as const,
    },
    {
      key: "shares",
      header: t(locale, "manage.shares"),
      align: "end" as const,
    },
    {
      key: "status",
      header: t(locale, "manage.status"),
      render: (val: unknown) => <StatusBadge status={val as string} />,
    },
    {
      key: "actions",
      header: t(locale, "manage.actions"),
      align: "end" as const,
      render: () => (
        <div className="flex items-center justify-end">
          <button type="button" className="px-3 py-1.5 text-sm text-ds-muted hover:text-ds-text hover:bg-ds-background rounded-lg transition-colors">
            {t(locale, "manage.view")}
          </button>
        </div>
      ),
    },
  ]

  if (isLoading) {
    return (
      <ManageLayout locale={locale}>
        <Container>
          <div className="space-y-4 animate-pulse">
            <div className="h-8 bg-ds-muted/20 rounded-lg w-48" />
            <div className="h-4 bg-ds-muted/20 rounded-lg w-32" />
            <div className="h-64 bg-ds-muted/20 rounded-lg" />
          </div>
        </Container>
      </ManageLayout>
    )
  }

  return (
    <ManageLayout locale={locale}>
      <Container>
        <PageHeader title={t(locale, "manage.social_commerce")} subtitle="Manage social commerce posts" />

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-colors ${
                statusFilter === s
                  ? "bg-ds-card border border-ds-border text-ds-text font-medium"
                  : "text-ds-muted hover:text-ds-text"
              }`}
            >
              {s === "all" ? t(locale, "manage.all_statuses") : s.replace(/_/g, " ")}
            </button>
          ))}
        </div>

        <DataTable columns={columns} data={posts} emptyTitle="No social commerce posts found" countLabel="posts" />
      </Container>
    </ManageLayout>
  )
}
