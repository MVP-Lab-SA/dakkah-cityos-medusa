import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Button, Badge, Input, toast, Label } from "@medusajs/ui"
import { EllipsisHorizontal, Plus, PencilSquare, Trash } from "@medusajs/icons"
import { useState } from "react"
import { useRegionZones, useCreateRegionZone, useUpdateRegionZone, useDeleteRegionZone, RegionZone } from "../../hooks/use-region-zones.js"
import { DataTable } from "../../components/tables/data-table.js"
import { StatusBadge } from "../../components/common.js"
import { StatsGrid } from "../../components/charts/stats-grid.js"
import { FormDrawer } from "../../components/forms/form-drawer.js"
import { ConfirmModal } from "../../components/modals/confirm-modal.js"

const ZONE_CODES = ["GCC_EU", "MENA", "APAC", "AMERICAS", "GLOBAL"] as const

const getZoneBadgeColor = (code: string) => {
  switch (code) {
    case "GCC_EU": return "blue"
    case "MENA": return "green"
    case "APAC": return "orange"
    case "AMERICAS": return "purple"
    case "GLOBAL": return "grey"
    default: return "grey"
  }
}

const RegionZonesPage = () => {
  const [showCreateDrawer, setShowCreateDrawer] = useState(false)
  const [editingZone, setEditingZone] = useState<RegionZone | null>(null)
  const [deletingZone, setDeletingZone] = useState<RegionZone | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    zone_code: "GLOBAL" as RegionZone["zone_code"],
    countries: "",
    data_residency: "",
    description: "",
  })

  const { data: zonesData, isLoading } = useRegionZones()
  const createZone = useCreateRegionZone()
  const updateZone = useUpdateRegionZone()
  const deleteZone = useDeleteRegionZone()

  const zones = zonesData?.region_zones || []
  const totalCountries = zones.reduce((sum, z) => sum + (z.countries?.length || 0), 0)

  const stats = [
    { label: "Total Zones", value: zones.length, icon: <EllipsisHorizontal className="w-5 h-5" /> },
    { label: "Countries Mapped", value: totalCountries, color: "blue" as const },
    { label: "Active Zones", value: zones.filter(z => z.status === "active").length, color: "green" as const },
    { label: "Global", value: zones.filter(z => z.zone_code === "GLOBAL").length, color: "purple" as const },
  ]

  const handleCreate = async () => {
    try {
      let data_residency: Record<string, unknown> | undefined
      if (formData.data_residency) {
        try { data_residency = JSON.parse(formData.data_residency) } catch { toast.error("Invalid JSON for data residency rules"); return }
      }
      const countries = formData.countries.split(",").map(c => c.trim()).filter(Boolean)
      await createZone.mutateAsync({ ...formData, countries, data_residency })
      toast.success("Region zone created successfully")
      setShowCreateDrawer(false)
      resetForm()
    } catch (error) {
      toast.error("Failed to create region zone")
    }
  }

  const handleUpdate = async () => {
    if (!editingZone) return
    try {
      let data_residency: Record<string, unknown> | undefined
      if (formData.data_residency) {
        try { data_residency = JSON.parse(formData.data_residency) } catch { toast.error("Invalid JSON for data residency rules"); return }
      }
      const countries = formData.countries.split(",").map(c => c.trim()).filter(Boolean)
      await updateZone.mutateAsync({ id: editingZone.id, ...formData, countries, data_residency })
      toast.success("Region zone updated successfully")
      setEditingZone(null)
      resetForm()
    } catch (error) {
      toast.error("Failed to update region zone")
    }
  }

  const handleDelete = async () => {
    if (!deletingZone) return
    try {
      await deleteZone.mutateAsync(deletingZone.id)
      toast.success("Region zone deleted")
      setDeletingZone(null)
    } catch (error) {
      toast.error("Failed to delete region zone")
    }
  }

  const resetForm = () => {
    setFormData({ name: "", zone_code: "GLOBAL", countries: "", data_residency: "", description: "" })
  }

  const openEditDrawer = (zone: RegionZone) => {
    setFormData({
      name: zone.name,
      zone_code: zone.zone_code,
      countries: (zone.countries || []).join(", "),
      data_residency: zone.data_residency ? JSON.stringify(zone.data_residency, null, 2) : "",
      description: zone.description || "",
    })
    setEditingZone(zone)
  }

  const columns = [
    { key: "name", header: "Zone Name", sortable: true, cell: (z: RegionZone) => (
      <div><Text className="font-medium">{z.name}</Text>{z.description && <Text className="text-ui-fg-muted text-sm">{z.description}</Text>}</div>
    )},
    { key: "zone_code", header: "Code", cell: (z: RegionZone) => <Badge color={getZoneBadgeColor(z.zone_code)}>{z.zone_code}</Badge> },
    { key: "countries", header: "Countries", cell: (z: RegionZone) => <Text>{z.countries?.length || 0} countries</Text> },
    { key: "data_residency", header: "Data Residency", cell: (z: RegionZone) => <Text>{z.data_residency ? "Configured" : "-"}</Text> },
    { key: "status", header: "Status", cell: (z: RegionZone) => <StatusBadge status={z.status} /> },
    { key: "created_at", header: "Created", sortable: true, cell: (z: RegionZone) => new Date(z.created_at).toLocaleDateString() },
    { key: "actions", header: "", width: "100px", cell: (z: RegionZone) => (
      <div className="flex gap-1">
        <Button variant="transparent" size="small" onClick={() => openEditDrawer(z)}><PencilSquare className="w-4 h-4" /></Button>
        <Button variant="transparent" size="small" onClick={() => setDeletingZone(z)}><Trash className="w-4 h-4 text-ui-tag-red-icon" /></Button>
      </div>
    )},
  ]

  return (
    <Container className="p-0">
      <div className="p-6 border-b border-ui-border-base">
        <div className="flex items-center justify-between">
          <div><Heading level="h1">Region Zones</Heading><Text className="text-ui-fg-muted">Manage data residency zones: GCC/EU, MENA, APAC, AMERICAS, GLOBAL</Text></div>
          <Button onClick={() => setShowCreateDrawer(true)}><Plus className="w-4 h-4 mr-2" />Add Zone</Button>
        </div>
      </div>

      <div className="p-6"><StatsGrid stats={stats} columns={4} /></div>

      <div className="px-6 pb-6">
        <DataTable data={zones} columns={columns} searchable searchPlaceholder="Search zones..." searchKeys={["name", "zone_code", "description"]} loading={isLoading} emptyMessage="No region zones found" />
      </div>

      <FormDrawer
        open={showCreateDrawer || !!editingZone}
        onOpenChange={(open) => { if (!open) { setShowCreateDrawer(false); setEditingZone(null); resetForm() } }}
        title={editingZone ? "Edit Region Zone" : "Create Region Zone"}
        onSubmit={editingZone ? handleUpdate : handleCreate}
        submitLabel={editingZone ? "Update" : "Create"}
        loading={createZone.isPending || updateZone.isPending}
      >
        <div className="space-y-4">
          <div><Label htmlFor="name">Zone Name</Label><Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Zone name" /></div>
          <div>
            <Label htmlFor="zone_code">Zone Code</Label>
            <select id="zone_code" value={formData.zone_code} onChange={(e) => setFormData({ ...formData, zone_code: e.target.value as RegionZone["zone_code"] })} className="w-full border border-ui-border-base rounded-md px-3 py-2 bg-ui-bg-base">
              {ZONE_CODES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div><Label htmlFor="countries">Countries (comma-separated)</Label><Input id="countries" value={formData.countries} onChange={(e) => setFormData({ ...formData, countries: e.target.value })} placeholder="AE, SA, QA, KW, BH, OM" /></div>
          <div>
            <Label htmlFor="data_residency">Data Residency Rules (JSON)</Label>
            <textarea id="data_residency" value={formData.data_residency} onChange={(e) => setFormData({ ...formData, data_residency: e.target.value })} placeholder='{"storage": "local", "encryption": "AES-256"}' className="w-full border border-ui-border-base rounded-md px-3 py-2 bg-ui-bg-base min-h-[100px] font-mono text-sm" />
          </div>
          <div><Label htmlFor="description">Description</Label><Input id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Description" /></div>
        </div>
      </FormDrawer>

      <ConfirmModal open={!!deletingZone} onOpenChange={() => setDeletingZone(null)} title="Delete Region Zone" description={`Delete "${deletingZone?.name}"? This action cannot be undone.`} onConfirm={handleDelete} confirmLabel="Delete" variant="danger" loading={deleteZone.isPending} />
    </Container>
  )
}

export const config = defineRouteConfig({ label: "Region Zones", icon: EllipsisHorizontal })
export default RegionZonesPage
