import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Input, Button } from "@medusajs/ui"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { sdk } from "../lib/client"

interface CommissionRule {
  id: string
  name: string
  type: "percentage" | "flat"
  rate: number
  flat_amount?: number
  is_default: boolean
  vendor_id?: string
}

const CommissionConfigWidget = () => {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    type: "percentage" as "percentage" | "flat",
    rate: 10,
    flat_amount: 0,
    is_default: false,
  })

  const { data, isLoading } = useQuery({
    queryKey: ["commission-rules"],
    queryFn: async () => {
      const response = await sdk.client.fetch<{ rules: CommissionRule[] }>(
        "/admin/commission-rules",
        { credentials: "include" }
      )
      return response
    },
  })

  const createMutation = useMutation({
    mutationFn: async (ruleData: typeof formData) => {
      return sdk.client.fetch("/admin/commission-rules", {
        method: "POST",
        body: ruleData,
        credentials: "include",
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["commission-rules"] })
      setShowForm(false)
      setFormData({
        name: "",
        type: "percentage",
        rate: 10,
        flat_amount: 0,
        is_default: false,
      })
    },
  })

  const rules = data?.rules || []
  const defaultRule = rules.find((r) => r.is_default)

  if (isLoading) {
    return (
      <Container className="divide-y p-0">
        <div className="px-6 py-4">
          <Heading level="h2">Commission Configuration</Heading>
        </div>
        <div className="px-6 py-4">
          <Text className="text-ui-fg-subtle">Loading...</Text>
        </div>
      </Container>
    )
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <Heading level="h2">Commission Configuration</Heading>
          <Text size="small" className="text-ui-fg-subtle">
            Default rate:{" "}
            {defaultRule
              ? defaultRule.type === "percentage"
                ? `${defaultRule.rate}%`
                : `$${defaultRule.flat_amount}`
              : "Not set"}
          </Text>
        </div>
        <Button size="small" variant="secondary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "Add Rule"}
        </Button>
      </div>

      {showForm && (
        <div className="px-6 py-4 bg-ui-bg-subtle">
          <div className="space-y-4 max-w-md">
            <div>
              <Text size="small" weight="plus" className="mb-1">
                Rule Name
              </Text>
              <Input
                size="small"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Standard Commission"
              />
            </div>

            <div>
              <Text size="small" weight="plus" className="mb-1">
                Type
              </Text>
              <select
                className="w-full px-3 py-2 border rounded-md bg-white text-sm"
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value as "percentage" | "flat" })
                }
              >
                <option value="percentage">Percentage</option>
                <option value="flat">Flat Amount</option>
              </select>
            </div>

            {formData.type === "percentage" ? (
              <div>
                <Text size="small" weight="plus" className="mb-1">
                  Rate (%)
                </Text>
                <Input
                  size="small"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.rate}
                  onChange={(e) =>
                    setFormData({ ...formData, rate: parseFloat(e.target.value) })
                  }
                />
              </div>
            ) : (
              <div>
                <Text size="small" weight="plus" className="mb-1">
                  Flat Amount ($)
                </Text>
                <Input
                  size="small"
                  type="number"
                  min="0"
                  value={formData.flat_amount}
                  onChange={(e) =>
                    setFormData({ ...formData, flat_amount: parseFloat(e.target.value) })
                  }
                />
              </div>
            )}

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_default"
                checked={formData.is_default}
                onChange={(e) =>
                  setFormData({ ...formData, is_default: e.target.checked })
                }
              />
              <label htmlFor="is_default">
                <Text size="small">Set as default rule</Text>
              </label>
            </div>

            <Button
              size="small"
              onClick={() => createMutation.mutate(formData)}
              isLoading={createMutation.isPending}
            >
              Create Rule
            </Button>
          </div>
        </div>
      )}

      <div className="px-6 py-4">
        <Text size="small" weight="plus" className="mb-3">
          Commission Rules
        </Text>
        {rules.length === 0 ? (
          <Text size="small" className="text-ui-fg-subtle">
            No commission rules configured
          </Text>
        ) : (
          <div className="space-y-2">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div>
                  <Text size="small" weight="plus">
                    {rule.name}
                    {rule.is_default && (
                      <span className="ml-2 text-xs bg-ui-tag-green-bg text-ui-tag-green-text px-2 py-0.5 rounded">
                        Default
                      </span>
                    )}
                  </Text>
                  <Text size="small" className="text-ui-fg-subtle">
                    {rule.type === "percentage"
                      ? `${rule.rate}% of order total`
                      : `$${rule.flat_amount} per order`}
                  </Text>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "order.details.before",
})

export default CommissionConfigWidget
