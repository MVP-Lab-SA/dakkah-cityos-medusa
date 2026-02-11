import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Button, Badge, Input, toast, Label } from "@medusajs/ui"
import { ServerStack, Plus, PencilSquare, Trash } from "@medusajs/icons"
import { useState } from "react"
import { useNodes, useCreateNode, useUpdateNode, useDeleteNode, NodeType } from "../../hooks/use-nodes"
import { DataTable } from "../../components/tables/data-table"
import { StatusBadge } from "../../components/common"
import { StatsGrid } from "../../components/charts/stats-grid"
import { FormDrawer } from "../../components/forms/form-drawer"
import { ConfirmModal } from "../../components/modals/confirm-modal"

const NODE_TYPES = ["CITY", "DISTRICT", "ZONE", "FACILITY", "ASSET"] as const

const getTypeBadgeColor = (type: string) => {
  switch (type) {
    case "CITY": return "purple"
    case "DISTRICT": return "blue"
    case "ZONE": return "green"
    case "FACILITY": return "orange"
    case "ASSET": return "grey"
    default: return "grey"
  }
}

const NodesPage = () => {
  const [showCreateDrawer, setShowCreateDrawer] = useState(false)
  const [editingNode, setEditingNode] = useState<NodeType | null>(null)
  const [deletingNode, setDeletingNode] = useState<NodeType | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    type: "CITY" as NodeType["type"],
    parent_id: "",
    tenant_id: "",
    description: "",
  })

  const { data: nodesData, isLoading } = useNodes()
  const createNode = useCreateNode()
  const updateNode = useUpdateNode()
  const deleteNode = useDeleteNode()

  const nodes = nodesData?.nodes || []

  const stats = [
    { label: "Total Nodes", value: nodes.length, icon: <ServerStack className="w-5 h-5" /> },
    { label: "Cities", value: nodes.filter(n => n.type === "CITY").length, color: "purple" as const },
    { label: "Facilities", value: nodes.filter(n => n.type === "FACILITY").length, color: "orange" as const },
    { label: "Assets", value: nodes.filter(n => n.type === "ASSET").length, color: "blue" as const },
  ]

  const handleCreate = async () => {
    try {
      await createNode.mutateAsync(formData)
      toast.success("Node created successfully")
      setShowCreateDrawer(false)
      resetForm()
    } catch (error) {
      toast.error("Failed to create node")
    }
  }

  const handleUpdate = async () => {
    if (!editingNode) return
    try {
      await updateNode.mutateAsync({ id: editingNode.id, ...formData })
      toast.success("Node updated successfully")
      setEditingNode(null)
      resetForm()
    } catch (error) {
      toast.error("Failed to update node")
    }
  }

  const handleDelete = async () => {
    if (!deletingNode) return
    try {
      await deleteNode.mutateAsync(deletingNode.id)
      toast.success("Node deleted")
      setDeletingNode(null)
    } catch (error) {
      toast.error("Failed to delete node")
    }
  }

  const resetForm = () => {
    setFormData({ name: "", type: "CITY", parent_id: "", tenant_id: "", description: "" })
  }

  const openEditDrawer = (node: NodeType) => {
    setFormData({
      name: node.name,
      type: node.type,
      parent_id: node.parent_id || "",
      tenant_id: node.tenant_id || "",
      description: node.description || "",
    })
    setEditingNode(node)
  }

  const columns = [
    { key: "name", header: "Name", sortable: true, cell: (n: NodeType) => (
      <div><Text className="font-medium">{n.name}</Text>{n.description && <Text className="text-ui-fg-muted text-sm">{n.description}</Text>}</div>
    )},
    { key: "type", header: "Type", cell: (n: NodeType) => <Badge color={getTypeBadgeColor(n.type)}>{n.type}</Badge> },
    { key: "parent_id", header: "Parent", cell: (n: NodeType) => <Text>{n.parent?.name || n.parent_id || "-"}</Text> },
    { key: "tenant_id", header: "Tenant", cell: (n: NodeType) => <Text>{n.tenant_name || n.tenant_id || "-"}</Text> },
    { key: "status", header: "Status", cell: (n: NodeType) => <StatusBadge status={n.status} /> },
    { key: "created_at", header: "Created", sortable: true, cell: (n: NodeType) => new Date(n.created_at).toLocaleDateString() },
    { key: "actions", header: "", width: "100px", cell: (n: NodeType) => (
      <div className="flex gap-1">
        <Button variant="transparent" size="small" onClick={() => openEditDrawer(n)}><PencilSquare className="w-4 h-4" /></Button>
        <Button variant="transparent" size="small" onClick={() => setDeletingNode(n)}><Trash className="w-4 h-4 text-ui-tag-red-icon" /></Button>
      </div>
    )},
  ]

  return (
    <Container className="p-0">
      <div className="p-6 border-b border-ui-border-base">
        <div className="flex items-center justify-between">
          <div><Heading level="h1">Node Hierarchy</Heading><Text className="text-ui-fg-muted">Manage infrastructure nodes: City → District → Zone → Facility → Asset</Text></div>
          <Button onClick={() => setShowCreateDrawer(true)}><Plus className="w-4 h-4 mr-2" />Add Node</Button>
        </div>
      </div>

      <div className="p-6"><StatsGrid stats={stats} columns={4} /></div>

      <div className="px-6 pb-6">
        <DataTable data={nodes} columns={columns} searchable searchPlaceholder="Search nodes..." searchKeys={["name", "type", "description"]} loading={isLoading} emptyMessage="No nodes found" />
      </div>

      <FormDrawer
        open={showCreateDrawer || !!editingNode}
        onOpenChange={(open) => { if (!open) { setShowCreateDrawer(false); setEditingNode(null); resetForm() } }}
        title={editingNode ? "Edit Node" : "Create Node"}
        onSubmit={editingNode ? handleUpdate : handleCreate}
        submitLabel={editingNode ? "Update" : "Create"}
        loading={createNode.isPending || updateNode.isPending}
      >
        <div className="space-y-4">
          <div><Label htmlFor="name">Name</Label><Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Node name" /></div>
          <div>
            <Label htmlFor="type">Type</Label>
            <select id="type" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value as NodeType["type"] })} className="w-full border border-ui-border-base rounded-md px-3 py-2 bg-ui-bg-base">
              {NODE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <Label htmlFor="parent_id">Parent Node</Label>
            <select id="parent_id" value={formData.parent_id} onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })} className="w-full border border-ui-border-base rounded-md px-3 py-2 bg-ui-bg-base">
              <option value="">None (Root)</option>
              {nodes.filter(n => n.id !== editingNode?.id).map(n => <option key={n.id} value={n.id}>{n.name} ({n.type})</option>)}
            </select>
          </div>
          <div><Label htmlFor="tenant_id">Tenant ID</Label><Input id="tenant_id" value={formData.tenant_id} onChange={(e) => setFormData({ ...formData, tenant_id: e.target.value })} placeholder="Tenant ID" /></div>
          <div><Label htmlFor="description">Description</Label><Input id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Description" /></div>
        </div>
      </FormDrawer>

      <ConfirmModal open={!!deletingNode} onOpenChange={() => setDeletingNode(null)} title="Delete Node" description={`Delete "${deletingNode?.name}"? This action cannot be undone.`} onConfirm={handleDelete} confirmLabel="Delete" variant="danger" loading={deleteNode.isPending} />
    </Container>
  )
}

export const config = defineRouteConfig({ label: "Nodes", icon: ServerStack })
export default NodesPage
