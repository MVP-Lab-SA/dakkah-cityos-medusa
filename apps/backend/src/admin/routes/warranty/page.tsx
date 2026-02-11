import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Button, Badge, Input, toast, Label } from "@medusajs/ui"
import { ShieldCheck, Plus, PencilSquare, Trash } from "@medusajs/icons"
import { useState } from "react"
import { useWarrantyTemplates, useCreateWarrantyTemplate, useUpdateWarrantyTemplate, useDeleteWarrantyTemplate, WarrantyTemplate } from "../../hooks/use-warranty"
import { DataTable } from "../../components/tables/data-table"
import { StatusBadge } from "../../components/common"
import { StatsGrid } from "../../components/charts/stats-grid"
import { ConfirmModal } from "../../components/modals/confirm-modal"
import { FormDrawer } from "../../components/forms/form-drawer"

const WarrantyPage = () => {
  const [showCreateDrawer, setShowCreateDrawer] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<WarrantyTemplate | null>(null)
  const [deletingTemplate, setDeletingTemplate] = useState<WarrantyTemplate | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    duration_months: 12,
    coverage_type: "full" as "full" | "limited" | "extended",
    terms: "",
    applicable_categories: "",
    status: "active" as "active" | "inactive" | "draft",
  })

  const { data: templatesData, isLoading } = useWarrantyTemplates()
  const createTemplate = useCreateWarrantyTemplate()
  const updateTemplate = useUpdateWarrantyTemplate()
  const deleteTemplate = useDeleteWarrantyTemplate()

  const templates = templatesData?.templates || []

  const stats = [
    { label: "Total Templates", value: templates.length, icon: <ShieldCheck className="w-5 h-5" /> },
    { label: "Active", value: templates.filter(t => t.status === "active").length, color: "green" as const },
    { label: "Full Coverage", value: templates.filter(t => t.coverage_type === "full").length, color: "blue" as const },
    { label: "Extended Coverage", value: templates.filter(t => t.coverage_type === "extended").length, color: "purple" as const },
  ]

  const getCoverageBadgeColor = (type: string) => {
    switch (type) {
      case "full": return "green"
      case "limited": return "orange"
      case "extended": return "purple"
      default: return "grey"
    }
  }

  const handleCreateTemplate = async () => {
    try {
      const categories = formData.applicable_categories
        .split(",")
        .map(c => c.trim())
        .filter(Boolean)
      await createTemplate.mutateAsync({
        name: formData.name,
        description: formData.description || undefined,
        duration_months: formData.duration_months,
        coverage_type: formData.coverage_type,
        terms: formData.terms || undefined,
        applicable_categories: categories,
        status: formData.status,
      })
      toast.success("Warranty template created")
      setShowCreateDrawer(false)
      resetForm()
    } catch (error) {
      toast.error("Failed to create warranty template")
    }
  }

  const handleUpdateTemplate = async () => {
    if (!editingTemplate) return
    try {
      const categories = formData.applicable_categories
        .split(",")
        .map(c => c.trim())
        .filter(Boolean)
      await updateTemplate.mutateAsync({
        id: editingTemplate.id,
        name: formData.name,
        description: formData.description || undefined,
        duration_months: formData.duration_months,
        coverage_type: formData.coverage_type,
        terms: formData.terms || undefined,
        applicable_categories: categories,
        status: formData.status,
      })
      toast.success("Warranty template updated")
      setEditingTemplate(null)
      resetForm()
    } catch (error) {
      toast.error("Failed to update warranty template")
    }
  }

  const handleDeleteTemplate = async () => {
    if (!deletingTemplate) return
    try {
      await deleteTemplate.mutateAsync(deletingTemplate.id)
      toast.success("Warranty template deleted")
      setDeletingTemplate(null)
    } catch (error) {
      toast.error("Failed to delete warranty template")
    }
  }

  const resetForm = () => {
    setFormData({ name: "", description: "", duration_months: 12, coverage_type: "full", terms: "", applicable_categories: "", status: "active" })
  }

  const openEditDrawer = (template: WarrantyTemplate) => {
    setFormData({
      name: template.name,
      description: template.description || "",
      duration_months: template.duration_months,
      coverage_type: template.coverage_type,
      terms: template.terms || "",
      applicable_categories: (template.applicable_categories || []).join(", "),
      status: template.status,
    })
    setEditingTemplate(template)
  }

  const columns = [
    { key: "name", header: "Template Name", sortable: true, cell: (t: WarrantyTemplate) => (
      <div>
        <Text className="font-medium">{t.name}</Text>
        {t.description && <Text className="text-ui-fg-muted text-sm">{t.description}</Text>}
      </div>
    )},
    { key: "coverage_type", header: "Coverage", cell: (t: WarrantyTemplate) => (
      <Badge color={getCoverageBadgeColor(t.coverage_type) as any}>{t.coverage_type.charAt(0).toUpperCase() + t.coverage_type.slice(1)}</Badge>
    )},
    { key: "duration_months", header: "Duration", sortable: true, cell: (t: WarrantyTemplate) => `${t.duration_months} months` },
    { key: "applicable_categories", header: "Categories", cell: (t: WarrantyTemplate) => (
      <Badge color="grey">{(t.applicable_categories || []).length} categories</Badge>
    )},
    { key: "status", header: "Status", cell: (t: WarrantyTemplate) => <StatusBadge status={t.status} /> },
    { key: "actions", header: "", width: "100px", cell: (t: WarrantyTemplate) => (
      <div className="flex gap-1">
        <Button variant="transparent" size="small" onClick={() => openEditDrawer(t)}><PencilSquare className="w-4 h-4" /></Button>
        <Button variant="transparent" size="small" onClick={() => setDeletingTemplate(t)}><Trash className="w-4 h-4 text-ui-tag-red-icon" /></Button>
      </div>
    )},
  ]

  return (
    <Container className="p-0">
      <div className="p-6 border-b border-ui-border-base">
        <div className="flex items-center justify-between">
          <div><Heading level="h1">Warranty Templates</Heading><Text className="text-ui-fg-muted">Manage global warranty templates and coverage policies</Text></div>
          <Button onClick={() => setShowCreateDrawer(true)}><Plus className="w-4 h-4 mr-2" />Add Template</Button>
        </div>
      </div>

      <div className="p-6"><StatsGrid stats={stats} columns={4} /></div>

      <div className="px-6 pb-6">
        <DataTable data={templates} columns={columns} searchable searchPlaceholder="Search templates..." searchKeys={["name"]} loading={isLoading} emptyMessage="No warranty templates found" />
      </div>

      <FormDrawer
        open={showCreateDrawer || !!editingTemplate}
        onOpenChange={(open) => { if (!open) { setShowCreateDrawer(false); setEditingTemplate(null); resetForm() } }}
        title={editingTemplate ? "Edit Warranty Template" : "Create Warranty Template"}
        onSubmit={editingTemplate ? handleUpdateTemplate : handleCreateTemplate}
        submitLabel={editingTemplate ? "Update" : "Create"}
        loading={createTemplate.isPending || updateTemplate.isPending}
      >
        <div className="space-y-4">
          <div><Label htmlFor="name">Template Name</Label><Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Standard Warranty" /></div>
          <div><Label htmlFor="description">Description</Label><Input id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Coverage description" /></div>
          <div>
            <Label htmlFor="coverage_type">Coverage Type</Label>
            <select id="coverage_type" value={formData.coverage_type} onChange={(e) => setFormData({ ...formData, coverage_type: e.target.value as any })} className="w-full border border-ui-border-base rounded-md px-3 py-2 bg-ui-bg-base">
              <option value="full">Full Coverage</option>
              <option value="limited">Limited Coverage</option>
              <option value="extended">Extended Coverage</option>
            </select>
          </div>
          <div><Label htmlFor="duration_months">Duration (Months)</Label><Input id="duration_months" type="number" value={formData.duration_months} onChange={(e) => setFormData({ ...formData, duration_months: Number(e.target.value) })} /></div>
          <div>
            <Label htmlFor="terms">Terms & Conditions</Label>
            <textarea id="terms" value={formData.terms} onChange={(e) => setFormData({ ...formData, terms: e.target.value })} placeholder="Warranty terms and conditions..." className="w-full border border-ui-border-base rounded-md px-3 py-2 bg-ui-bg-base min-h-[100px] resize-y" />
          </div>
          <div><Label htmlFor="applicable_categories">Applicable Categories</Label><Input id="applicable_categories" value={formData.applicable_categories} onChange={(e) => setFormData({ ...formData, applicable_categories: e.target.value })} placeholder="electronics, furniture, appliances" /><Text className="text-ui-fg-muted text-xs mt-1">Comma-separated category names</Text></div>
          <div>
            <Label htmlFor="status">Status</Label>
            <select id="status" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as any })} className="w-full border border-ui-border-base rounded-md px-3 py-2 bg-ui-bg-base">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
      </FormDrawer>

      <ConfirmModal open={!!deletingTemplate} onOpenChange={() => setDeletingTemplate(null)} title="Delete Template" description={`Delete warranty template "${deletingTemplate?.name}"?`} onConfirm={handleDeleteTemplate} confirmLabel="Delete" variant="danger" loading={deleteTemplate.isPending} />
    </Container>
  )
}

export const config = defineRouteConfig({ label: "Warranty", icon: ShieldCheck })
export default WarrantyPage
