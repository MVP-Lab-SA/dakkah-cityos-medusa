import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckCircleSolid, XCircleSolid, Spinner } from "@medusajs/icons"

interface DiscountCodeInputProps {
  subscriptionPlanId: string
  onDiscountApplied: (discount: {
    code: string
    discount_type: "percentage" | "fixed"
    discount_value: number
    description?: string
  }) => void
  onDiscountRemoved: () => void
  appliedDiscount?: {
    code: string
    discount_type: "percentage" | "fixed"
    discount_value: number
  } | null
}

export function DiscountCodeInput({
  subscriptionPlanId,
  onDiscountApplied,
  onDiscountRemoved,
  appliedDiscount,
}: DiscountCodeInputProps) {
  const [code, setCode] = useState("")
  const [error, setError] = useState<string | null>(null)

  const validateMutation = useMutation({
    mutationFn: async (discountCode: string) => {
      const response = await sdk.client.fetch<{
        valid: boolean
        discount?: {
          code: string
          discount_type: "percentage" | "fixed"
          discount_value: number
          description?: string
        }
        message?: string
      }>(`/store/subscriptions/validate-discount`, {
        method: "POST",
        credentials: "include",
        body: {
          code: discountCode,
          plan_id: subscriptionPlanId,
        },
      })
      return response
    },
    onSuccess: (data) => {
      if (data.valid && data.discount) {
        onDiscountApplied(data.discount)
        setError(null)
      } else {
        setError(data.message || "Invalid discount code")
      }
    },
    onError: () => {
      setError("Failed to validate discount code")
    },
  })

  const handleApply = () => {
    if (!code.trim()) {
      setError("Please enter a discount code")
      return
    }
    setError(null)
    validateMutation.mutate(code.trim().toUpperCase())
  }

  const handleRemove = () => {
    setCode("")
    setError(null)
    onDiscountRemoved()
  }

  if (appliedDiscount) {
    return (
      <div className="border border-ds-success bg-ds-success rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircleSolid className="w-5 h-5 text-ds-success" />
            <div>
              <p className="font-medium text-ds-success">
                {appliedDiscount.code}
              </p>
              <p className="text-sm text-ds-success">
                {appliedDiscount.discount_type === "percentage"
                  ? `${appliedDiscount.discount_value}% off`
                  : `$${appliedDiscount.discount_value} off`}
              </p>
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleRemove}
          >
            Remove
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-ds-foreground">
        Discount Code
      </label>
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Enter code"
          value={code}
          onChange={(e) => {
            setCode(e.target.value.toUpperCase())
            setError(null)
          }}
          className="flex-1"
          disabled={validateMutation.isPending}
        />
        <Button
          onClick={handleApply}
          disabled={validateMutation.isPending || !code.trim()}
        >
          {validateMutation.isPending ? (
            <Spinner className="w-4 h-4 animate-spin" />
          ) : (
            "Apply"
          )}
        </Button>
      </div>
      {error && (
        <div className="flex items-center gap-1 text-sm text-ds-destructive">
          <XCircleSolid className="w-4 h-4" />
          {error}
        </div>
      )}
    </div>
  )
}
