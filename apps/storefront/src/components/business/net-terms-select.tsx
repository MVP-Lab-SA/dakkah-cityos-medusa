import { cn } from "@/lib/utils/cn"
import { Check, CreditCard, Calendar } from "@medusajs/icons"

interface PaymentTerm {
  id: string
  name: string
  days: number
  description: string
  available: boolean
}

interface NetTermsSelectProps {
  terms: PaymentTerm[]
  selectedTermId?: string
  onSelect?: (termId: string) => void
}

export function NetTermsSelect({ terms, selectedTermId, onSelect }: NetTermsSelectProps) {
  return (
    <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-zinc-200">
        <h3 className="text-lg font-semibold text-zinc-900">Payment Terms</h3>
        <p className="text-sm text-zinc-500 mt-1">Select your preferred payment terms</p>
      </div>

      <div className="p-4 space-y-3">
        {terms.map((term) => {
          const isSelected = selectedTermId === term.id
          const isDisabled = !term.available

          return (
            <button
              key={term.id}
              onClick={() => term.available && onSelect?.(term.id)}
              disabled={isDisabled}
              className={cn(
                "w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all text-left",
                isSelected && "border-zinc-900 bg-zinc-50",
                !isSelected && term.available && "border-zinc-200 hover:border-zinc-300",
                isDisabled && "border-zinc-100 bg-zinc-50 opacity-50 cursor-not-allowed"
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
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    term.days === 0 ? "bg-green-100" : "bg-blue-100"
                  )}>
                    {term.days === 0 ? (
                      <CreditCard className="w-5 h-5 text-green-600" />
                    ) : (
                      <Calendar className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-zinc-900">{term.name}</p>
                    <p className="text-sm text-zinc-500">{term.description}</p>
                  </div>
                </div>
              </div>

              {!term.available && (
                <span className="text-xs text-zinc-400 bg-zinc-100 px-2 py-1 rounded">
                  Not Available
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
