import { createFileRoute } from "@tanstack/react-router"
import { useState, useCallback } from "react"
import { ManageLayout } from "@/components/manage"
import { Container, PageHeader, DataTable, StatusBadge, SkeletonTable, Button, Tabs, DropdownMenu, FormDrawer, ConfirmDialog, useToast } from "@/components/manage/ui"
import { t } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"
import { useManageCrud } from "@/lib/hooks/use-manage-crud"
import { crudConfigs } from "@/components/manage/crud-configs"
import { Plus } from "@medusajs/icons"

const config = crudConfigs["commissions"]

export const Route = createFileRoute("/$tenant/$locale/manage/commissions")({
  component: ManageCommissionsPage,
})

const STATUS_FILTERS = ["all", "pending", "calculated", "paid"] as const

function ManageCommissionsPage() {
  const { locale: routeLocale } = Route.useParams()
  const { locale: ctxLocale } = useTenant()
  const locale = routeLocale || ctxLocale || "en"
  const { addToast } = useToast()

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [formValues, setFormValues] = useState<Record<string, any>>(config.defaultValues)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const { data, isLoading } = useQuery({
    queryKey: ["manage", config.moduleKey],
    queryFn: async () => {
      const response = await sdk.client.fetch(config.apiEndpoint, { method: "GET" })
      return response
    },
    enabled: typeof window !== "undefined",
  })

  const { createMutation, updateMutation, deleteMutation } = useManageCrud({
    moduleKey: config.moduleKey,
    apiEndpoint: config.apiEndpoint,
  })

  const handleCreate = useCallback(() => {
    setEditingItem(null)
    setFormValues({ ...config.defaultValues })
    setDrawerOpen(true)
  }, [])

  const handleEdit = useCallback((row: any) => {
    setEditingItem(row)
    const values: Record<string, any> = {}
    config.fields.forEach((f) => { values[f.key] = row[f.key] ?? config.defaultValues[f.key] ?? "" })
    setFormValues(values)
    setDrawerOpen(true)
  }, [])

  const handleFormChange = useCallback((key: string, value: any) => {
    setFormValues((prev) => ({ ...prev, [key]: value }))
  }, [])

  const handleSubmit = useCallback(async () => {
    try {
      if (editingItem) {
        await updateMutation.mutateAsync({ id: editingItem.id, ...formValues })
        addToast("success", `${config.singularLabel} updated successfully`)
      } else {
        await createMutation.mutateAsync(formValues)
        addToast("success", `${config.singularLabel} created successfully`)
      }
      setDrawerOpen(false)
      setEditingItem(null)
    } catch (e) {
      addToast("error", `Failed to save ${config.singularLabel.toLowerCase()}`)
    }
  }, [editingItem, formValues, updateMutation, createMutation, addToast])

  const handleDelete = useCallback(async () => {
    if (!deleteId) return
    try {
      await deleteMutation.mutateAsync(deleteId)
      addToast("success", `${config.singularLabel} deleted successfully`)
      setDeleteId(null)
    } catch (e) {
      addToast("error", `Failed to delete ${config.singularLabel.toLowerCase()}`)
    }
  }, [deleteId, deleteMutation, addToast])

  const allCommissions = ((data as any)?.transactions || []).map((c: any) => ({
    id: c.id,
    vendor_id: c.vendor_id || "",
    vendor: c.vendor?.company_name || c.vendor_name || "—",
    order_id: c.order_id ? `#${c.order_id}`.slice(0, 12) : "—",
    amount: c.amount ? `$${(c.amount / 100).toFixed(2)}` : "$0.00",
    rate: c.commission_rate || c.rate || 0,
    commission_rate: c.commission_rate ? `${c.commission_rate}%` : "—",
    commission_amount: c.commission_amount ? `$${(c.commission_amount / 100).toFixed(2)}` : "$0.00",
    type: c.type || "percentage",
    status: c.status || "pending",
    date: c.created_at ? new Date(c.created_at).toLocaleDateString() : "—",
  }))

  const commissions = statusFilter === "all"
    ? allCommissions
    : allCommissions.filter((c: any) => c.status === statusFilter)

  const columns = [
    {
      key: "vendor",
      header: t(locale, "manage.vendor"),
      render: (val: unknown) => <span className="font-medium">{val as string}</span>,
    },
    {
      key: "order_id",
      header: t(locale, "manage.order_number"),
    },
    {
      key: "amount",
      header: t(locale, "manage.amount"),
      align: "end" as const,
    },
    {
      key: "commission_rate",
      header: t(locale, "manage.commission_rate"),
      align: "end" as const,
    },
    {
      key: "commission_amount",
      header: t(locale, "manage.commission_amount"),
      align: "end" as const,
    },
    {
      key: "status",
      header: t(locale, "manage.status"),
      render: (val: unknown) => <StatusBadge status={val as string} />,
    },
    {
      key: "date",
      header: t(locale, "manage.date"),
    },
    {
      key: "actions",
      header: t(locale, "manage.actions"),
      align: "end" as const,
      render: (_: unknown, row: any) => (
        <DropdownMenu
          items={[
            { label: t(locale, "manage.edit"), onClick: () => handleEdit(row) },
            { type: "separator" as const },
            { label: t(locale, "manage.delete"), onClick: () => setDeleteId(row.id), variant: "danger" as const },
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
        <PageHeader
          title={t(locale, "manage.commissions")}
          subtitle={t(locale, "manage.commissions_subtitle")}
          actions={
            config.canCreate !== false ? (
              <Button variant="primary" size="base" onClick={handleCreate}>
                <Plus className="w-4 h-4" />
                Add {config.singularLabel}
              </Button>
            ) : undefined
          }
        />

        <Tabs
          tabs={STATUS_FILTERS.map((s) => ({
            id: s,
            label: s === "all" ? t(locale, "manage.all_statuses") : s.replace(/_/g, " "),
          }))}
          activeTab={statusFilter}
          onTabChange={setStatusFilter}
          className="mb-4"
        />

        <DataTable
          columns={columns}
          data={commissions}
          emptyTitle={t(locale, "manage.no_commissions")}
          countLabel={t(locale, "manage.commissions").toLowerCase()}
        />
      </Container>

      <FormDrawer
        open={drawerOpen}
        onClose={() => { setDrawerOpen(false); setEditingItem(null) }}
        title={editingItem ? `Edit ${config.singularLabel}` : `Add ${config.singularLabel}`}
        fields={config.fields}
        values={formValues}
        onChange={handleFormChange}
        onSubmit={handleSubmit}
        loading={createMutation.isPending || updateMutation.isPending}
        submitLabel={editingItem ? t(locale, "common.actions.update", "Update") : t(locale, "common.actions.create", "Create")}
      />

      {config.canDelete !== false && (
        <ConfirmDialog
          open={!!deleteId}
          onClose={() => setDeleteId(null)}
          onConfirm={handleDelete}
          title={`Delete ${config.singularLabel}`}
          description={`Are you sure you want to delete this ${config.singularLabel.toLowerCase()}? This action cannot be undone.`}
          loading={deleteMutation.isPending}
        />
      )}
    </ManageLayout>
  )
}
