import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Button, Badge, Select, Input, Label, toast } from "@medusajs/ui"
import { CurrencyDollar, Plus, PencilSquare, Trash, XMark } from "@medusajs/icons"
import { useState } from "react"
import { 
  useVolumePricingRules, useCreateVolumePricing, useUpdateVolumePricing, useDeleteVolumePricing,
  VolumePricingRule 
} from "../../hooks/use-volume-pricing"
import { DataTable } from "../../components/tables/data-table"
import { StatusBadge } from "../../components/common"
import { StatsGrid } from "../../components/charts/stats-grid"
import { ConfirmModal } from "../../components/modals/confirm-modal"
import { FormDrawer } from "../../components/forms/form-drawer"

const VolumePricingPage = () => {
  const [statusFilter, setStatusFilter] = useState<string>("")
  const [showCreateDrawer, setShowCreateDrawer] = useState(false)
  const [editingRule, setEditingRule] = useState<VolumePricingRule | null>(null)
  const [deletingRule, setDeletingRule] = useState<VolumePricingRule | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    applies_to: "all" as const,
    target_id: "",
    pricing_type: "percentage" as const,
    priority: 0,
    status: "active" as const,
    tiers: [{ min_quantity: 1, max_quantity: 10, discount_percentage: 0 }],
  })

  const { data: rulesData, isLoading } = useVolumePricingRules(
    statusFilter ? { status: statusFilter } : undefined
  )
  
  const createRule = useCreateVolumePricing()
  const updateRule = useUpdateVolumePricing()
  const deleteRule = useDeleteVolumePricing()

  const rules = rulesData?.rules || []

  const stats = [
    { label: "Total Rules", value: rules.length, icon: <CurrencyDollar className="w-5 h-5" /> },
    { label: "Active", value: rules.filter(r => r.status === "active").length, color: "green" as const },
    { label: "Inactive", value: rules.filter(r => r.status === "inactive").length, color: "grey" as const },
    { label: "Scheduled", value: rules.filter(r => r.status === "scheduled").length, color: "blue" as const },
  ]

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      applies_to: "all",
      target_id: "",
      pricing_type: "percentage",
      priority: 0,
      status: "active",
      tiers: [{ min_quantity: 1, max_quantity: 10, discount_percentage: 0 }],
    })
  }

  const openEditDrawer = (rule: VolumePricingRule) => {
    setFormData({
      name: rule.name,
      description: rule.description || "",
      applies_to: rule.applies_to,
      target_id: rule.target_id || "",
      pricing_type: rule.pricing_type,
      priority: rule.priority,
      status: rule.status,
      tiers: rule.tiers.map(t => ({
        min_quantity: t.min_quantity,
        max_quantity: t.max_quantity,
        discount_percentage: t.discount_percentage,
        discount_amount: t.discount_amount,
        fixed_price: t.fixed_price,
      })),
    })
    setEditingRule(rule)
  }

  const handleCreate = async () => {
    try {
      await createRule.mutateAsync({
        ...formData,
        tiers: formData.tiers.map(t => ({
          min_quantity: t.min_quantity,
          max_quantity: t.max_quantity || undefined,
          discount_percentage: formData.pricing_type === "percentage" ? t.discount_percentage : undefined,
          discount_amount: formData.pricing_type === "fixed" ? t.discount_amount : undefined,
          fixed_price: formData.pricing_type === "fixed_price" ? t.fixed_price : undefined,
        })),
      })
      toast.success("Volume pricing rule created")
      setShowCreateDrawer(false)
      resetForm()
    } catch (error) {
      toast.error("Failed to create rule")
    }
  }

  const handleUpdate = async () => {
    if (!editingRule) return
    try {
      await updateRule.mutateAsync({
        id: editingRule.id,
        ...formData,
        tiers: formData.tiers.map(t => ({
          min_quantity: t.min_quantity,
          max_quantity: t.max_quantity || undefined,
          discount_percentage: formData.pricing_type === "percentage" ? t.discount_percentage : undefined,
          discount_amount: formData.pricing_type === "fixed" ? t.discount_amount : undefined,
          fixed_price: formData.pricing_type === "fixed_price" ? t.fixed_price : undefined,
        })),
      })
      toast.success("Volume pricing rule updated")
      setEditingRule(null)
      resetForm()
    } catch (error) {
      toast.error("Failed to update rule")
    }
  }

  const handleDelete = async () => {
    if (!deletingRule) return
    try {
      await deleteRule.mutateAsync(deletingRule.id)
      toast.success("Volume pricing rule deleted")
      setDeletingRule(null)
    } catch (error) {
      toast.error("Failed to delete rule")
    }
  }

  const addTier = () => {
    const lastTier = formData.tiers[formData.tiers.length - 1]
    const newMin = (lastTier?.max_quantity || 0) + 1
    setFormData({
      ...formData,
      tiers: [...formData.tiers, { min_quantity: newMin, max_quantity: newMin + 50, discount_percentage: 0 }],
    })
  }

  const updateTier = (index: number, field: string, value: number | undefined) => {
    const newTiers = [...formData.tiers]
    newTiers[index] = { ...newTiers[index], [field]: value }
    setFormData({ ...formData, tiers: newTiers })
  }

  const removeTier = (index: number) => {
    if (formData.tiers.length === 1) return
    setFormData({ ...formData, tiers: formData.tiers.filter((_, i) => i !== index) })
  }

  const getAppliesToLabel = (rule: VolumePricingRule) => {
    if (rule.applies_to === "all") return "Store-wide"
    if (rule.target) {
      return rule.target.title || rule.target.name || rule.target_id
    }
    return rule.target_id || rule.applies_to
  }

  const formatTierSummary = (rule: VolumePricingRule) => {
    if (rule.tiers.length === 0) return "No tiers"
    const sortedTiers = [...rule.tiers].sort((a, b) => a.min_quantity - b.min_quantity)
    const first = sortedTiers[0]
    const last = sortedTiers[sortedTiers.length - 1]
    
    if (rule.pricing_type === "percentage") {
      return `${first.discount_percentage || 0}% - ${last.discount_percentage || 0}% off`
    }
    return `${rule.tiers.length} tier${rule.tiers.length > 1 ? "s" : ""}`
  }

  const columns = [
    { key: "name", header: "Rule Name", sortable: true, cell: (r: VolumePricingRule) => (
      <div>
        <Text className="font-medium">{r.name}</Text>
        {r.description && <Text className="text-ui-fg-muted text-sm">{r.description}</Text>}
      </div>
    )},
    { key: "applies_to", header: "Applies To", cell: (r: VolumePricingRule) => (
      <div>
        <Badge color="grey">{r.applies_to}</Badge>
        <Text className="text-sm mt-1">{getAppliesToLabel(r)}</Text>
      </div>
    )},
    { key: "pricing_type", header: "Type", cell: (r: VolumePricingRule) => (
      <Badge color="purple">{r.pricing_type}</Badge>
    )},
    { key: "tiers", header: "Tiers", cell: (r: VolumePricingRule) => (
      <div>
        <Text className="font-medium">{r.tiers.length} tier{r.tiers.length !== 1 ? "s" : ""}</Text>
        <Text className="text-ui-fg-muted text-sm">{formatTierSummary(r)}</Text>
      </div>
    )},
    { key: "priority", header: "Priority", sortable: true, cell: (r: VolumePricingRule) => r.priority },
    { key: "status", header: "Status", cell: (r: VolumePricingRule) => <StatusBadge status={r.status} /> },
    { key: "actions", header: "", width: "100px", cell: (r: VolumePricingRule) => (
      <div className="flex gap-1">
        <Button variant="transparent" size="small" onClick={() => openEditDrawer(r)}>
          <PencilSquare className="w-4 h-4" />
        </Button>
        <Button variant="transparent" size="small" onClick={() => setDeletingRule(r)}>
          <Trash className="w-4 h-4 text-ui-tag-red-icon" />
        </Button>
      </div>
    )},
  ]

  const FormContent = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Rule Name *</Label>
        <Input 
          id="name" 
          value={formData.name} 
          onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
          placeholder="e.g., Bulk Order Discount"
        />
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Input 
          id="description" 
          value={formData.description} 
          onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
          placeholder="Optional description"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Applies To</Label>
          <Select value={formData.applies_to} onValueChange={(v: typeof formData.applies_to) => setFormData({ ...formData, applies_to: v })}>
            <Select.Trigger>
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="all">Store-wide</Select.Item>
              <Select.Item value="product">Specific Product</Select.Item>
              <Select.Item value="collection">Collection</Select.Item>
              <Select.Item value="category">Category</Select.Item>
            </Select.Content>
          </Select>
        </div>
        
        <div>
          <Label>Pricing Type</Label>
          <Select value={formData.pricing_type} onValueChange={(v: typeof formData.pricing_type) => setFormData({ ...formData, pricing_type: v })}>
            <Select.Trigger>
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="percentage">Percentage Off</Select.Item>
              <Select.Item value="fixed">Fixed Amount Off</Select.Item>
              <Select.Item value="fixed_price">Fixed Price</Select.Item>
            </Select.Content>
          </Select>
        </div>
      </div>

      {formData.applies_to !== "all" && (
        <div>
          <Label htmlFor="target_id">Target ID</Label>
          <Input 
            id="target_id" 
            value={formData.target_id} 
            onChange={(e) => setFormData({ ...formData, target_id: e.target.value })} 
            placeholder={`Enter ${formData.applies_to} ID`}
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="priority">Priority</Label>
          <Input 
            id="priority" 
            type="number" 
            value={formData.priority} 
            onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 0 })} 
          />
        </div>
        
        <div>
          <Label>Status</Label>
          <Select value={formData.status} onValueChange={(v: typeof formData.status) => setFormData({ ...formData, status: v })}>
            <Select.Trigger>
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="active">Active</Select.Item>
              <Select.Item value="inactive">Inactive</Select.Item>
              <Select.Item value="scheduled">Scheduled</Select.Item>
            </Select.Content>
          </Select>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>Pricing Tiers</Label>
          <Button variant="secondary" size="small" onClick={addTier}>
            <Plus className="w-4 h-4 mr-1" /> Add Tier
          </Button>
        </div>
        <div className="space-y-2">
          {formData.tiers.map((tier, idx) => (
            <div key={idx} className="flex gap-2 items-center p-3 bg-ui-bg-subtle rounded-lg">
              <div className="flex-1 grid grid-cols-3 gap-2">
                <div>
                  <Text className="text-xs text-ui-fg-muted">Min Qty</Text>
                  <Input 
                    type="number" 
                    value={tier.min_quantity} 
                    onChange={(e) => updateTier(idx, "min_quantity", parseInt(e.target.value) || 0)} 
                    size="small"
                  />
                </div>
                <div>
                  <Text className="text-xs text-ui-fg-muted">Max Qty</Text>
                  <Input 
                    type="number" 
                    value={tier.max_quantity || ""} 
                    onChange={(e) => updateTier(idx, "max_quantity", e.target.value ? parseInt(e.target.value) : undefined)} 
                    placeholder="No limit"
                    size="small"
                  />
                </div>
                <div>
                  <Text className="text-xs text-ui-fg-muted">
                    {formData.pricing_type === "percentage" ? "Discount %" : 
                     formData.pricing_type === "fixed" ? "Amount Off" : "Fixed Price"}
                  </Text>
                  <Input 
                    type="number" 
                    value={
                      formData.pricing_type === "percentage" ? tier.discount_percentage || "" :
                      formData.pricing_type === "fixed" ? tier.discount_amount || "" :
                      tier.fixed_price || ""
                    } 
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0
                      const field = formData.pricing_type === "percentage" ? "discount_percentage" :
                                    formData.pricing_type === "fixed" ? "discount_amount" : "fixed_price"
                      updateTier(idx, field, val)
                    }} 
                    size="small"
                  />
                </div>
              </div>
              <Button 
                variant="transparent" 
                size="small" 
                onClick={() => removeTier(idx)}
                disabled={formData.tiers.length === 1}
              >
                <XMark className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <Container className="p-0">
      <div className="p-6 border-b border-ui-border-base">
        <div className="flex items-center justify-between">
          <div>
            <Heading level="h1">Volume Pricing</Heading>
            <Text className="text-ui-fg-muted">Manage quantity-based pricing discounts for B2B customers</Text>
          </div>
          <Button onClick={() => setShowCreateDrawer(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Rule
          </Button>
        </div>
      </div>

      <div className="p-6">
        <StatsGrid stats={stats} columns={4} />
      </div>

      <div className="px-6 pb-6">
        <div className="flex gap-4 mb-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <Select.Trigger className="w-[180px]">
              <Select.Value placeholder="All Statuses" />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="">All Statuses</Select.Item>
              <Select.Item value="active">Active</Select.Item>
              <Select.Item value="inactive">Inactive</Select.Item>
              <Select.Item value="scheduled">Scheduled</Select.Item>
            </Select.Content>
          </Select>
        </div>

        <DataTable 
          data={rules} 
          columns={columns} 
          searchable 
          searchPlaceholder="Search rules..." 
          searchKeys={["name", "description"]}
          loading={isLoading}
          emptyMessage="No volume pricing rules found"
        />
      </div>

      {/* Create Drawer */}
      <FormDrawer
        open={showCreateDrawer}
        onOpenChange={(open) => { if (!open) { setShowCreateDrawer(false); resetForm() } }}
        title="Create Volume Pricing Rule"
        onSubmit={handleCreate}
        submitLabel="Create"
        loading={createRule.isPending}
      >
        <FormContent />
      </FormDrawer>

      {/* Edit Drawer */}
      <FormDrawer
        open={!!editingRule}
        onOpenChange={(open) => { if (!open) { setEditingRule(null); resetForm() } }}
        title="Edit Volume Pricing Rule"
        onSubmit={handleUpdate}
        submitLabel="Update"
        loading={updateRule.isPending}
      >
        <FormContent />
      </FormDrawer>

      {/* Delete Modal */}
      <ConfirmModal 
        open={!!deletingRule} 
        onOpenChange={() => setDeletingRule(null)}
        title="Delete Volume Pricing Rule"
        description={`Are you sure you want to delete "${deletingRule?.name}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        confirmLabel="Delete"
        variant="danger"
        loading={deleteRule.isPending}
      />
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Volume Pricing",
  icon: CurrencyDollar,
})

export default VolumePricingPage
