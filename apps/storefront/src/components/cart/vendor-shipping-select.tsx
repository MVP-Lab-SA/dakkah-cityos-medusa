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
    <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-zinc-200">
        <div className="flex items-center gap-2">
          <TruckFast className="w-5 h-5 text-zinc-600" />
          <h4 className="font-medium text-zinc-900">Shipping from {vendorName}</h4>
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
                "w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all text-left",
                isSelected
                  ? "border-zinc-900 bg-zinc-50"
                  : "border-zinc-200 hover:border-zinc-300"
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                    isSelected ? "border-zinc-900 bg-zinc-900" : "border-zinc-300"
                  )}
                >
                  {isSelected && <Check className="w-3 h-3 text-white" />}
                </div>
                <div>
                  <p className="font-medium text-zinc-900">{option.name}</p>
                  <p className="text-sm text-zinc-500">
                    Estimated delivery: {option.estimatedDays}
                  </p>
                </div>
              </div>
              <span className="font-semibold text-zinc-900">
                {option.price === 0 ? "Free" : formatPrice(option.price, currencyCode)}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
