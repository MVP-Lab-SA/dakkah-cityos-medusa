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
    <div className="bg-ds-background rounded-xl border border-ds-border overflow-hidden">
      <div className="px-6 py-4 border-b border-ds-border">
        <h3 className="text-lg font-semibold text-ds-foreground">Payment Terms</h3>
        <p className="text-sm text-ds-muted-foreground mt-1">Select your preferred payment terms</p>
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
                isSelected && "border-ds-foreground bg-ds-muted",
                !isSelected && term.available && "border-ds-border hover:border-ds-border",
                isDisabled && "border-ds-border bg-ds-muted opacity-50 cursor-not-allowed"
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
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    term.days === 0 ? "bg-ds-success" : "bg-ds-info"
                  )}>
                    {term.days === 0 ? (
                      <CreditCard className="w-5 h-5 text-ds-success" />
                    ) : (
                      <Calendar className="w-5 h-5 text-ds-info" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-ds-foreground">{term.name}</p>
                    <p className="text-sm text-ds-muted-foreground">{term.description}</p>
                  </div>
                </div>
              </div>

              {!term.available && (
                <span className="text-xs text-ds-muted-foreground bg-ds-muted px-2 py-1 rounded">
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
