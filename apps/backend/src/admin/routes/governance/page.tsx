import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Button, Badge, Input, toast, Label } from "@medusajs/ui"
import { ShieldCheck, Plus, PencilSquare, Trash } from "@medusajs/icons"
import { useState } from "react"
import { useGovernancePolicies, useCreateGovernancePolicy, useUpdateGovernancePolicy, useDeleteGovernancePolicy, GovernancePolicy } from "../../hooks/use-governance.js"
import { DataTable } from "../../components/tables/data-table.js"
import { StatusBadge } from "../../components/common.js"
import { StatsGrid } from "../../components/charts/stats-grid.js"
import { FormDrawer } from "../../components/forms/form-drawer.js"
import { ConfirmModal } from "../../components/modals/confirm-modal.js"

const SCOPES = ["global", "tenant", "node", "channel", "product"] as const

const getScopeBadgeColor = (scope: string) => {
  switch (scope) {
    case "global": return "purple"
    case "tenant": return "blue"
    case "node": return "green"
    case "channel": return "orange"
    case "product": return "grey"
    default: return "grey"
  }
}

const GovernancePage = () => {
  const [showCreateDrawer, setShowCreateDrawer] = useState(false)
  const [editingPolicy, setEditingPolicy] = useState<GovernancePolicy | null>(null)
  const [deletingPolicy, setDeletingPolicy] = useState<GovernancePolicy | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    scope: "global" as GovernancePolicy["scope"],
    authority_level: "",
    priority: 0,
    rules: "",
    description: "",
  })

  const { data: policiesData, isLoading } = useGovernancePolicies()
  const createPolicy = useCreateGovernancePolicy()
  const updatePolicy = useUpdateGovernancePolicy()
  const deletePolicy = useDeleteGovernancePolicy()

  const policies = policiesData?.policies || []

  const stats = [
    { label: "Total Policies", value: policies.length, icon: <ShieldCheck className="w-5 h-5" /> },
    { label: "Active", value: policies.filter(p => p.status === "active").length, color: "green" as const },
    { label: "Global Scope", value: policies.filter(p => p.scope === "global").length, color: "purple" as const },
    { label: "Tenant Scope", value: policies.filter(p => p.scope === "tenant").length, color: "blue" as const },
  ]

  const handleCreate = async () => {
    try {
      let rules: Record<string, unknown> | undefined
      if (formData.rules) {
        try { rules = JSON.parse(formData.rules) } catch { toast.error("Invalid JSON for rules"); return }
      }
      await createPolicy.mutateAsync({ ...formData, priority: Number(formData.priority), rules })
      toast.success("Policy created successfully")
      setShowCreateDrawer(false)
      resetForm()
    } catch (error) {
      toast.error("Failed to create policy")
    }
  }

  const handleUpdate = async () => {
    if (!editingPolicy) return
    try {
      let rules: Record<string, unknown> | undefined
      if (formData.rules) {
        try { rules = JSON.parse(formData.rules) } catch { toast.error("Invalid JSON for rules"); return }
      }
      await updatePolicy.mutateAsync({ id: editingPolicy.id, ...formData, priority: Number(formData.priority), rules })
      toast.success("Policy updated successfully")
      setEditingPolicy(null)
      resetForm()
    } catch (error) {
      toast.error("Failed to update policy")
    }
  }

  const handleDelete = async () => {
    if (!deletingPolicy) return
    try {
      await deletePolicy.mutateAsync(deletingPolicy.id)
      toast.success("Policy deleted")
      setDeletingPolicy(null)
    } catch (error) {
      toast.error("Failed to delete policy")
    }
  }

  const resetForm = () => {
    setFormData({ name: "", scope: "global", authority_level: "", priority: 0, rules: "", description: "" })
  }

  const openEditDrawer = (policy: GovernancePolicy) => {
    setFormData({
      name: policy.name,
      scope: policy.scope,
      authority_level: policy.authority_level,
      priority: policy.priority,
      rules: policy.rules ? JSON.stringify(policy.rules, null, 2) : "",
      description: policy.description || "",
    })
    setEditingPolicy(policy)
  }

  const columns = [
    { key: "name", header: "Policy Name", sortable: true, cell: (p: GovernancePolicy) => (
      <div><Text className="font-medium">{p.name}</Text>{p.description && <Text className="text-ui-fg-muted text-sm">{p.description}</Text>}</div>
    )},
    { key: "scope", header: "Scope", cell: (p: GovernancePolicy) => <Badge color={getScopeBadgeColor(p.scope)}>{p.scope}</Badge> },
    { key: "authority_level", header: "Authority", cell: (p: GovernancePolicy) => <Text>{p.authority_level || "-"}</Text> },
    { key: "status", header: "Status", cell: (p: GovernancePolicy) => <StatusBadge status={p.status} /> },
    { key: "priority", header: "Priority", sortable: true, cell: (p: GovernancePolicy) => <Text>{p.priority}</Text> },
    { key: "created_at", header: "Created", sortable: true, cell: (p: GovernancePolicy) => new Date(p.created_at).toLocaleDateString() },
    { key: "actions", header: "", width: "100px", cell: (p: GovernancePolicy) => (
      <div className="flex gap-1">
        <Button variant="transparent" size="small" onClick={() => openEditDrawer(p)}><PencilSquare className="w-4 h-4" /></Button>
        <Button variant="transparent" size="small" onClick={() => setDeletingPolicy(p)}><Trash className="w-4 h-4 text-ui-tag-red-icon" /></Button>
      </div>
    )},
  ]

  return (
    <Container className="p-0">
      <div className="p-6 border-b border-ui-border-base">
        <div className="flex items-center justify-between">
          <div><Heading level="h1">Governance Policies</Heading><Text className="text-ui-fg-muted">Manage platform policies with inheritance chain</Text></div>
          <Button onClick={() => setShowCreateDrawer(true)}><Plus className="w-4 h-4 mr-2" />Add Policy</Button>
        </div>
      </div>

      <div className="p-6"><StatsGrid stats={stats} columns={4} /></div>

      <div className="px-6 pb-6">
        <DataTable data={policies} columns={columns} searchable searchPlaceholder="Search policies..." searchKeys={["name", "scope", "authority_level"]} loading={isLoading} emptyMessage="No policies found" />
      </div>

      <FormDrawer
        open={showCreateDrawer || !!editingPolicy}
        onOpenChange={(open) => { if (!open) { setShowCreateDrawer(false); setEditingPolicy(null); resetForm() } }}
        title={editingPolicy ? "Edit Policy" : "Create Policy"}
        onSubmit={editingPolicy ? handleUpdate : handleCreate}
        submitLabel={editingPolicy ? "Update" : "Create"}
        loading={createPolicy.isPending || updatePolicy.isPending}
      >
        <div className="space-y-4">
          <div><Label htmlFor="name">Policy Name</Label><Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Policy name" /></div>
          <div>
            <Label htmlFor="scope">Scope</Label>
            <select id="scope" value={formData.scope} onChange={(e) => setFormData({ ...formData, scope: e.target.value as GovernancePolicy["scope"] })} className="w-full border border-ui-border-base rounded-md px-3 py-2 bg-ui-bg-base">
              {SCOPES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
          </div>
          <div><Label htmlFor="authority_level">Authority Level</Label><Input id="authority_level" value={formData.authority_level} onChange={(e) => setFormData({ ...formData, authority_level: e.target.value })} placeholder="e.g. platform_admin" /></div>
          <div><Label htmlFor="priority">Priority</Label><Input id="priority" type="number" value={String(formData.priority)} onChange={(e) => setFormData({ ...formData, priority: Number(e.target.value) })} /></div>
          <div>
            <Label htmlFor="rules">Rules (JSON)</Label>
            <textarea id="rules" value={formData.rules} onChange={(e) => setFormData({ ...formData, rules: e.target.value })} placeholder='{"key": "value"}' className="w-full border border-ui-border-base rounded-md px-3 py-2 bg-ui-bg-base min-h-[100px] font-mono text-sm" />
          </div>
          <div><Label htmlFor="description">Description</Label><Input id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Description" /></div>
        </div>
      </FormDrawer>

      <ConfirmModal open={!!deletingPolicy} onOpenChange={() => setDeletingPolicy(null)} title="Delete Policy" description={`Delete "${deletingPolicy?.name}"? This action cannot be undone.`} onConfirm={handleDelete} confirmLabel="Delete" variant="danger" loading={deletePolicy.isPending} />
    </Container>
  )
}

export const config = defineRouteConfig({ label: "Governance", icon: ShieldCheck })
export default GovernancePage
