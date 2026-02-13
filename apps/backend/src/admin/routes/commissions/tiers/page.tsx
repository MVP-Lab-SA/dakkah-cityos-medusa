import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Button, Badge, Input, Table } from "@medusajs/ui"
import { useEffect, useState } from "react"
import { PlusMini, Trash, PencilSquare, CurrencyDollar } from "@medusajs/icons"
import { sdk } from "../../../lib/client.js"

// Helper to make API calls using the Medusa SDK
async function client(path: string, options?: { method?: string; body?: any }) {
  const method = options?.method || "GET"
  const body = options?.body
  
  if (method === "GET") {
    return await sdk.client.fetch(path)
  } else {
    return await sdk.client.fetch(path, { method, body })
  }
}

type CommissionTier = {
  id: string
  name: string
  min_revenue: number
  max_revenue: number | null
  rate: number
  created_at: string
}

const CommissionTiersPage = () => {
  const [tiers, setTiers] = useState<CommissionTier[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingTier, setEditingTier] = useState<CommissionTier | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    min_revenue: 0,
    max_revenue: "",
    rate: 0
  })

  useEffect(() => {
    fetchTiers()
  }, [])

  const fetchTiers = async () => {
    try {
      const response = await client("/admin/commissions/tiers") as { tiers?: CommissionTier[] }
      setTiers(response.tiers || [])
    } catch (error) {
      console.error("Error fetching tiers:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const data = {
        name: formData.name,
        min_revenue: Number(formData.min_revenue),
        max_revenue: formData.max_revenue ? Number(formData.max_revenue) : undefined,
        rate: Number(formData.rate)
      }

      if (editingTier) {
        await client(`/admin/commissions/tiers/${editingTier.id}`, {
          method: "PUT",
          body: data
        })
      } else {
        await client("/admin/commissions/tiers", {
          method: "POST",
          body: data
        })
      }

      setShowForm(false)
      setEditingTier(null)
      setFormData({ name: "", min_revenue: 0, max_revenue: "", rate: 0 })
      fetchTiers()
    } catch (error) {
      console.error("Error saving tier:", error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tier?")) return
    
    try {
      await client(`/admin/commissions/tiers/${id}`, { method: "DELETE" })
      fetchTiers()
    } catch (error) {
      console.error("Error deleting tier:", error)
    }
  }

  const handleEdit = (tier: CommissionTier) => {
    setEditingTier(tier)
    setFormData({
      name: tier.name,
      min_revenue: tier.min_revenue,
      max_revenue: tier.max_revenue?.toString() || "",
      rate: tier.rate
    })
    setShowForm(true)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0
    }).format(amount)
  }

  if (loading) {
    return (
      <Container className="p-8">
        <Text>Loading...</Text>
      </Container>
    )
  }

  return (
    <Container className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Heading level="h1">Commission Tiers</Heading>
          <Text className="text-ui-fg-subtle mt-1">
            Configure tiered commission rates based on vendor revenue
          </Text>
        </div>
        <Button onClick={() => { setShowForm(true); setEditingTier(null); }}>
          <PlusMini className="mr-2" />
          Add Tier
        </Button>
      </div>

      {showForm && (
        <Container className="mb-6 p-4 bg-ui-bg-subtle rounded-lg">
          <Heading level="h2" className="mb-4">
            {editingTier ? "Edit Tier" : "New Tier"}
          </Heading>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Bronze, Silver, Gold"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Commission Rate (%)</label>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={formData.rate}
                  onChange={(e) => setFormData({ ...formData, rate: Number(e.target.value) })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Min Revenue ($)</label>
                <Input
                  type="number"
                  min="0"
                  value={formData.min_revenue}
                  onChange={(e) => setFormData({ ...formData, min_revenue: Number(e.target.value) })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Max Revenue ($)</label>
                <Input
                  type="number"
                  min="0"
                  value={formData.max_revenue}
                  onChange={(e) => setFormData({ ...formData, max_revenue: e.target.value })}
                  placeholder="Leave empty for unlimited"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit">
                {editingTier ? "Update" : "Create"} Tier
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setShowForm(false)
                  setEditingTier(null)
                  setFormData({ name: "", min_revenue: 0, max_revenue: "", rate: 0 })
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Container>
      )}

      {tiers.length === 0 ? (
        <Container className="p-8 text-center bg-ui-bg-subtle rounded-lg">
          <CurrencyDollar className="w-12 h-12 mx-auto mb-4 text-ui-fg-subtle" />
          <Text className="text-ui-fg-subtle">
            No commission tiers configured. Add tiers to apply different rates based on vendor revenue.
          </Text>
        </Container>
      ) : (
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Tier Name</Table.HeaderCell>
              <Table.HeaderCell>Revenue Range</Table.HeaderCell>
              <Table.HeaderCell>Commission Rate</Table.HeaderCell>
              <Table.HeaderCell className="text-right">Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {tiers
              .sort((a, b) => a.min_revenue - b.min_revenue)
              .map((tier) => (
                <Table.Row key={tier.id}>
                  <Table.Cell>
                    <Text className="font-medium">{tier.name}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text>
                      {formatCurrency(tier.min_revenue)} - {tier.max_revenue ? formatCurrency(tier.max_revenue) : "Unlimited"}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge color="blue">{tier.rate}%</Badge>
                  </Table.Cell>
                  <Table.Cell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() => handleEdit(tier)}
                      >
                        <PencilSquare className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() => handleDelete(tier.id)}
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
      )}
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Commission Tiers",
  icon: CurrencyDollar
})

export default CommissionTiersPage
