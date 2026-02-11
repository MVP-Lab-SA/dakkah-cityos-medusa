import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Button, Badge, Input, toast, Label } from "@medusajs/ui"
import { Users, Plus, PencilSquare, Trash } from "@medusajs/icons"
import { useState } from "react"
import { usePersonas, useCreatePersona, useUpdatePersona, useDeletePersona, Persona } from "../../hooks/use-personas"
import { DataTable } from "../../components/tables/data-table"
import { StatusBadge } from "../../components/common"
import { StatsGrid } from "../../components/charts/stats-grid"
import { FormDrawer } from "../../components/forms/form-drawer"
import { ConfirmModal } from "../../components/modals/confirm-modal"

const PERSONA_TYPES = ["consumer", "merchant", "government", "enterprise", "visitor", "operator"] as const

const getTypeBadgeColor = (type: string) => {
  switch (type) {
    case "consumer": return "blue"
    case "merchant": return "green"
    case "government": return "purple"
    case "enterprise": return "orange"
    case "visitor": return "grey"
    case "operator": return "red"
    default: return "grey"
  }
}

const PersonasPage = () => {
  const [showCreateDrawer, setShowCreateDrawer] = useState(false)
  const [editingPersona, setEditingPersona] = useState<Persona | null>(null)
  const [deletingPersona, setDeletingPersona] = useState<Persona | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    type: "consumer" as Persona["type"],
    axes: "",
    tenant_id: "",
    priority: 0,
    description: "",
  })

  const { data: personasData, isLoading } = usePersonas()
  const createPersona = useCreatePersona()
  const updatePersona = useUpdatePersona()
  const deletePersona = useDeletePersona()

  const personas = personasData?.personas || []

  const stats = [
    { label: "Total Personas", value: personas.length, icon: <Users className="w-5 h-5" /> },
    { label: "Consumer", value: personas.filter(p => p.type === "consumer").length, color: "blue" as const },
    { label: "Merchant", value: personas.filter(p => p.type === "merchant").length, color: "green" as const },
    { label: "Enterprise", value: personas.filter(p => p.type === "enterprise").length, color: "orange" as const },
  ]

  const handleCreate = async () => {
    try {
      let axes: Record<string, unknown> | undefined
      if (formData.axes) {
        try { axes = JSON.parse(formData.axes) } catch { toast.error("Invalid JSON for axes config"); return }
      }
      await createPersona.mutateAsync({ ...formData, priority: Number(formData.priority), axes })
      toast.success("Persona created successfully")
      setShowCreateDrawer(false)
      resetForm()
    } catch (error) {
      toast.error("Failed to create persona")
    }
  }

  const handleUpdate = async () => {
    if (!editingPersona) return
    try {
      let axes: Record<string, unknown> | undefined
      if (formData.axes) {
        try { axes = JSON.parse(formData.axes) } catch { toast.error("Invalid JSON for axes config"); return }
      }
      await updatePersona.mutateAsync({ id: editingPersona.id, ...formData, priority: Number(formData.priority), axes })
      toast.success("Persona updated successfully")
      setEditingPersona(null)
      resetForm()
    } catch (error) {
      toast.error("Failed to update persona")
    }
  }

  const handleDelete = async () => {
    if (!deletingPersona) return
    try {
      await deletePersona.mutateAsync(deletingPersona.id)
      toast.success("Persona deleted")
      setDeletingPersona(null)
    } catch (error) {
      toast.error("Failed to delete persona")
    }
  }

  const resetForm = () => {
    setFormData({ name: "", type: "consumer", axes: "", tenant_id: "", priority: 0, description: "" })
  }

  const openEditDrawer = (persona: Persona) => {
    setFormData({
      name: persona.name,
      type: persona.type,
      axes: persona.axes ? JSON.stringify(persona.axes, null, 2) : "",
      tenant_id: persona.tenant_id || "",
      priority: persona.priority || 0,
      description: persona.description || "",
    })
    setEditingPersona(persona)
  }

  const columns = [
    { key: "name", header: "Name", sortable: true, cell: (p: Persona) => (
      <div><Text className="font-medium">{p.name}</Text>{p.description && <Text className="text-ui-fg-muted text-sm">{p.description}</Text>}</div>
    )},
    { key: "type", header: "Type", cell: (p: Persona) => <Badge color={getTypeBadgeColor(p.type)}>{p.type}</Badge> },
    { key: "dimensions", header: "Axes/Dimensions", cell: (p: Persona) => <Text>{p.axes ? Object.keys(p.axes).length : 0} axes</Text> },
    { key: "tenant_id", header: "Tenant", cell: (p: Persona) => <Text>{p.tenant_name || p.tenant_id || "-"}</Text> },
    { key: "status", header: "Status", cell: (p: Persona) => <StatusBadge status={p.status} /> },
    { key: "created_at", header: "Created", sortable: true, cell: (p: Persona) => new Date(p.created_at).toLocaleDateString() },
    { key: "actions", header: "", width: "100px", cell: (p: Persona) => (
      <div className="flex gap-1">
        <Button variant="transparent" size="small" onClick={() => openEditDrawer(p)}><PencilSquare className="w-4 h-4" /></Button>
        <Button variant="transparent" size="small" onClick={() => setDeletingPersona(p)}><Trash className="w-4 h-4 text-ui-tag-red-icon" /></Button>
      </div>
    )},
  ]

  return (
    <Container className="p-0">
      <div className="p-6 border-b border-ui-border-base">
        <div className="flex items-center justify-between">
          <div><Heading level="h1">Personas</Heading><Text className="text-ui-fg-muted">Manage 6-axis persona system</Text></div>
          <Button onClick={() => setShowCreateDrawer(true)}><Plus className="w-4 h-4 mr-2" />Add Persona</Button>
        </div>
      </div>

      <div className="p-6"><StatsGrid stats={stats} columns={4} /></div>

      <div className="px-6 pb-6">
        <DataTable data={personas} columns={columns} searchable searchPlaceholder="Search personas..." searchKeys={["name", "type", "description"]} loading={isLoading} emptyMessage="No personas found" />
      </div>

      <FormDrawer
        open={showCreateDrawer || !!editingPersona}
        onOpenChange={(open) => { if (!open) { setShowCreateDrawer(false); setEditingPersona(null); resetForm() } }}
        title={editingPersona ? "Edit Persona" : "Create Persona"}
        onSubmit={editingPersona ? handleUpdate : handleCreate}
        submitLabel={editingPersona ? "Update" : "Create"}
        loading={createPersona.isPending || updatePersona.isPending}
      >
        <div className="space-y-4">
          <div><Label htmlFor="name">Name</Label><Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Persona name" /></div>
          <div>
            <Label htmlFor="type">Type</Label>
            <select id="type" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value as Persona["type"] })} className="w-full border border-ui-border-base rounded-md px-3 py-2 bg-ui-bg-base">
              {PERSONA_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
            </select>
          </div>
          <div>
            <Label htmlFor="axes">Axes Configuration (JSON)</Label>
            <textarea id="axes" value={formData.axes} onChange={(e) => setFormData({ ...formData, axes: e.target.value })} placeholder='{"economic": 0.8, "social": 0.5}' className="w-full border border-ui-border-base rounded-md px-3 py-2 bg-ui-bg-base min-h-[100px] font-mono text-sm" />
          </div>
          <div><Label htmlFor="tenant_id">Tenant ID</Label><Input id="tenant_id" value={formData.tenant_id} onChange={(e) => setFormData({ ...formData, tenant_id: e.target.value })} placeholder="Tenant ID" /></div>
          <div><Label htmlFor="priority">Priority</Label><Input id="priority" type="number" value={String(formData.priority)} onChange={(e) => setFormData({ ...formData, priority: Number(e.target.value) })} /></div>
          <div><Label htmlFor="description">Description</Label><Input id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Description" /></div>
        </div>
      </FormDrawer>

      <ConfirmModal open={!!deletingPersona} onOpenChange={() => setDeletingPersona(null)} title="Delete Persona" description={`Delete "${deletingPersona?.name}"? This action cannot be undone.`} onConfirm={handleDelete} confirmLabel="Delete" variant="danger" loading={deletePersona.isPending} />
    </Container>
  )
}

export const config = defineRouteConfig({ label: "Personas", icon: Users })
export default PersonasPage
