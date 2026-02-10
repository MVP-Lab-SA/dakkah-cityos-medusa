import { useState } from "react"
import { formatPrice } from "@/lib/utils/price"
import { cn } from "@/lib/utils/cn"
import { Check, TruckFast } from "@medusajs/icons"

interface ShippingOption {
  id: string
  name: string
  price: number
  estimatedDays: string
}

interface VendorShippingSelectProps {
  vendorId: string
  vendorName: string
  options: ShippingOption[]
  currencyCode: string
  selectedOptionId?: string
  onSelect?: (optionId: string) => void
}

export function VendorShippingSelect({
  vendorId,
  vendorName,
  options,
  currencyCode,
  selectedOptionId,
  onSelect,
}: VendorShippingSelectProps) {
  return (
    <div className="bg-ds-background rounded-xl border border-ds-border overflow-hidden">
      <div className="px-6 py-4 border-b border-ds-border">
        <div className="flex items-center gap-2">
          <TruckFast className="w-5 h-5 text-ds-muted-foreground" />
          <h4 className="font-medium text-ds-foreground">Shipping from {vendorName}</h4>
        </div>
      </div>

      <div className="p-4 space-y-2">
        {options.map((option) => {
          const isSelected = selectedOptionId === option.id

          return (
            <button
              key={option.id}
              onClick={() => onSelect?.(option.id)}
              className={cn(
                "w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all text-start",
                isSelected
                  ? "border-ds-foreground bg-ds-muted"
                  : "border-ds-border hover:border-ds-border"
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                    isSelected ? "border-ds-foreground bg-ds-primary" : "border-ds-border"
                  )}
                >
                  {isSelected && <Check className="w-3 h-3 text-ds-primary-foreground" />}
                </div>
                <div>
                  <p className="font-medium text-ds-foreground">{option.name}</p>
                  <p className="text-sm text-ds-muted-foreground">
                    Estimated delivery: {option.estimatedDays}
                  </p>
                </div>
              </div>
              <span className="font-semibold text-ds-foreground">
                {option.price === 0 ? "Free" : formatPrice(option.price, currencyCode)}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
