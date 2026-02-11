import { useState, useCallback } from "react"
import { useTenant } from "@/lib/context/tenant-context"

interface FAQItem {
  id: string
  question: string
  answer: string
  category?: string
}

interface FAQAccordionProps {
  items: FAQItem[]
  allowMultiple?: boolean
  defaultOpenIds?: string[]
  locale?: string
}

export function FAQAccordion({
  items,
  allowMultiple = false,
  defaultOpenIds = [],
  locale: localeProp,
}: FAQAccordionProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"
  const [openIds, setOpenIds] = useState<Set<string>>(new Set(defaultOpenIds))

  const toggle = useCallback((id: string) => {
    setOpenIds((prev) => {
      const next = new Set(allowMultiple ? prev : [])
      if (prev.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [allowMultiple])

  return (
    <div className="space-y-2">
      {items.map((item) => {
        const isOpen = openIds.has(item.id)
        return (
          <div
            key={item.id}
            className="bg-ds-background rounded-lg border border-ds-border overflow-hidden"
          >
            <button
              onClick={() => toggle(item.id)}
              className="flex items-center justify-between w-full p-4 text-start hover:bg-ds-muted/50 transition-colors"
              aria-expanded={isOpen}
            >
              <span className="text-sm font-medium text-ds-foreground pe-4">{item.question}</span>
              <svg
                className={`h-5 w-5 flex-shrink-0 text-ds-muted-foreground transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div
              className={`overflow-hidden transition-all duration-200 ${
                isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="px-4 pb-4 text-sm text-ds-muted-foreground leading-relaxed">
                {item.answer}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
