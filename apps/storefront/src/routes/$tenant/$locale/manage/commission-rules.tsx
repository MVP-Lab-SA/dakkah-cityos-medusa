// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router"
import { useState, useCallback } from "react"
import { ManageLayout } from "@/components/manage"
import { Container, PageHeader, DataTable, StatusBadge, SkeletonTable, Button, DropdownMenu, FormDrawer, ConfirmDialog, useToast, Tabs } from "@/components/manage/ui"
import { t } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"
import { useManageCrud } from "@/lib/hooks/use-manage-crud"
import { Plus } from "@medusajs/icons"

export const Route = createFileRoute("/$tenant/$locale/manage/commission-rules")({
  component: ManageCommissionRulesPage,
})

const config = {
  moduleKey: "commission-rules",
  singularLabel: "Commission Rule",
  pluralLabel: "Commission Rules",
  label: "Commission Rules",
  apiEndpoint: "/admin/commission-rules",
  fields: [
    { key: "name", label: "Name", type: "text" as const, required: true, placeholder: "Rule name" },
    { key: "vendor_type", label: "Vendor Type", type: "select" as const, options: [
      { value: "all", label: t(locale, 'verticals.all_vendors') },
      { value: "standard", label: "Standard" },
      { value: "premium", label: "Premium" },
      { value: "enterprise", label: "Enterprise" },
    ]},
    { key: "rate", label: "Rate (%)", type: "number" as const, required: true, placeholder: "0" },
    { key: "min_amount", label: "Min Amount", type: "number" as const, placeholder: "0" },
    { key: "max_amount", label: "Max Amount", type: "number" as const, placeholder: "0" },
    { key: "status", label: "Status", type: "select" as const, options: [
      { value: "active", label: "Active" },
      { value: "inactive", label: "Inactive" },
    ]},
  ],
  defaultValues: { name: "", vendor_type: "all", rate: 0, min_amount: 0, max_amount: 0, status: "active" },
}

const STATUS_FILTERS = ["all", "active", "inactive"] as const

function ManageCommissionRulesPage() {
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

  const allItems = ((data as any)?.items || (data as any)?.commission_rules || []).map((item: any) => ({
    id: item.id,
    name: item.name || "—",
    vendor_type: item.vendor_type || "—",
    rate: item.rate != null ? `${item.rate}%` : "—",
    min_amount: item.min_amount ?? "—",
    max_amount: item.max_amount ?? "—",
    status: item.status || "active",
  }))

  const items = statusFilter === "all"
    ? allItems
    : allItems.filter((i: any) => i.status === statusFilter)

  const columns = [
    {
      key: "name",
      header: t(locale, "manage.name"),
      render: (val: unknown) => <span className="font-medium">{val as string}</span>,
    },
    { key: "vendor_type", header: "Vendor Type" },
    { key: "rate", header: "Rate" },
    { key: "min_amount", header: "Min Amount" },
    { key: "max_amount", header: "Max Amount" },
    {
      key: "status",
      header: t(locale, "manage.status"),
      render: (val: unknown) => <StatusBadge status={val as string} />,
    },
    {
      key: "actions",
      header: t(locale, "manage.actions"),
      align: "end" as const,
      render: (_: unknown, row: any) => (
        <DropdownMenu
          items={[
            { label: t(locale, "common.actions.edit", "Edit"), onClick: () => handleEdit(row) },
            { type: "separator" as const },
            { label: t(locale, "common.actions.delete", "Delete"), onClick: () => setDeleteId(row.id), variant: "danger" as const },
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
          title={config.label}
          subtitle="Manage commission rules for vendors"
          actions={
            <Button variant="primary" size="base" onClick={handleCreate}>
              <Plus className="w-4 h-4" />
              Add {config.singularLabel}
            </Button>
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

        <DataTable columns={columns} data={items} emptyTitle="No commission rules found" countLabel="rules" />
      </Container>

      <FormDrawer
        open={drawerOpen}
        onClose={() => { setDrawerOpen(false); setEditingItem(null) }}
        title={editingItem ? `Edit ${config.singularLabel}` : `Create ${config.singularLabel}`}
        fields={config.fields}
        values={formValues}
        onChange={handleFormChange}
        onSubmit={handleSubmit}
        loading={createMutation.isPending || updateMutation.isPending}
        submitLabel={editingItem ? t(locale, "common.actions.saveChanges", "Save changes") : t(locale, "common.actions.create", "Create")}
      />

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title={`Delete ${config.singularLabel}`}
        description={`Are you sure you want to delete this ${config.singularLabel.toLowerCase()}? This action cannot be undone.`}
        loading={deleteMutation.isPending}
      />
    </ManageLayout>
  )
}
