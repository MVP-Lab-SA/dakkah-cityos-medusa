import React from "react"

interface AccordionItem {
  key: string
  title: string
  content: React.ReactNode
  disabled?: boolean
}

interface AccordionProps {
  items: AccordionItem[]
  type?: "single" | "multiple"
  defaultOpen?: string[]
  className?: string
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  type = "single",
  defaultOpen = [],
  className = "",
}) => {
  const [openKeys, setOpenKeys] = React.useState<Set<string>>(new Set(defaultOpen))

  const toggle = (key: string) => {
    setOpenKeys((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        if (type === "single") {
          next.clear()
        }
        next.add(key)
      }
      return next
    })
  }

  return (
    <div className={`divide-y divide-ds-border ${className}`}>
      {items.map((item) => {
        const isOpen = openKeys.has(item.key)
        return (
          <div key={item.key}>
            <button
              type="button"
              onClick={() => !item.disabled && toggle(item.key)}
              disabled={item.disabled}
              className={`flex w-full items-center justify-between py-4 text-left font-medium transition-colors ${item.disabled ? "opacity-50 cursor-not-allowed" : "hover:text-ds-primary cursor-pointer"} text-ds-foreground`}
              aria-expanded={isOpen}
            >
              <span className="text-sm md:text-base">{item.title}</span>
              <svg
                className={`w-4 h-4 shrink-0 text-ds-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div
              className={`overflow-hidden transition-all duration-200 ${isOpen ? "max-h-[2000px] opacity-100 pb-4" : "max-h-0 opacity-0"}`}
            >
              <div className="text-sm text-ds-muted-foreground">{item.content}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
