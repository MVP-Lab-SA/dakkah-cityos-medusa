import { clsx } from "clsx"

interface Tab {
  id: string
  label: string
  count?: number
  disabled?: boolean
}

interface TabsProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (id: string) => void
  className?: string
}

export function Tabs({ tabs, activeTab, onTabChange, className }: TabsProps) {
  return (
    <div className={clsx("border-b border-ds-border", className)}>
      <nav className="flex gap-0 -mb-px" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            disabled={tab.disabled}
            onClick={() => onTabChange(tab.id)}
            className={clsx(
              "inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
              activeTab === tab.id
                ? "border-ds-primary text-ds-primary"
                : "border-transparent text-ds-muted-foreground hover:text-ds-foreground hover:border-ds-border",
              tab.disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={clsx(
                  "inline-flex items-center justify-center px-1.5 py-0.5 text-xs rounded-full min-w-[20px]",
                  activeTab === tab.id
                    ? "bg-ds-primary/15 text-ds-primary"
                    : "bg-ds-muted text-ds-muted-foreground"
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </nav>
    </div>
  )
}
