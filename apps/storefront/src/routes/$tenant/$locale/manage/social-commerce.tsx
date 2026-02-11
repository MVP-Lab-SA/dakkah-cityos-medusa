import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { ManageLayout } from "@/components/manage"
import { Container, PageHeader, DataTable, StatusBadge, SkeletonTable, Tabs, DropdownMenu } from "@/components/manage/ui"
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
        <DropdownMenu
          items={[
            { label: t(locale, "manage.view"), onClick: () => {} },
          ]}
        />
      ),
    },
  ]

  if (isLoading) {
    return (
      <ManageLayout locale={locale}>
        <Container>
          <SkeletonTable rows={8} cols={7} />
        </Container>
      </ManageLayout>
    )
  }

  return (
    <ManageLayout locale={locale}>
      <Container>
        <PageHeader title={t(locale, "manage.social_commerce")} subtitle="Manage social commerce posts" />

        <Tabs
          tabs={STATUS_FILTERS.map((s) => ({
            id: s,
            label: s === "all" ? t(locale, "manage.all_statuses") : s.replace(/_/g, " "),
          }))}
          activeTab={statusFilter}
          onTabChange={setStatusFilter}
          className="mb-4"
        />

        <DataTable columns={columns} data={posts} emptyTitle="No social commerce posts found" countLabel="posts" />
      </Container>
    </ManageLayout>
  )
}
