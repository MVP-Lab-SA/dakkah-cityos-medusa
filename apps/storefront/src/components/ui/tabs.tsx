import React from "react"

interface Tab {
  key: string
  label: string
  icon?: React.ReactNode
  badge?: string | number
  disabled?: boolean
}

interface TabsProps {
  tabs: Tab[]
  activeKey: string
  onChange: (key: string) => void
  variant?: "line" | "pill" | "enclosed"
  className?: string
  fullWidth?: boolean
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeKey,
  onChange,
  variant = "line",
  className = "",
  fullWidth,
}) => {
  const baseTabClass = "inline-flex items-center gap-2 font-medium transition-colors whitespace-nowrap"

  const variantClasses = {
    line: {
      container: "border-b border-ds-border",
      tab: `${baseTabClass} px-4 py-2.5 border-b-2 -mb-px`,
      active: "border-ds-primary text-ds-primary",
      inactive: "border-transparent text-ds-muted-foreground hover:text-ds-foreground hover:border-ds-border",
    },
    pill: {
      container: "bg-ds-muted p-1 rounded-lg",
      tab: `${baseTabClass} px-4 py-2 rounded-md`,
      active: "bg-ds-background text-ds-foreground shadow-sm",
      inactive: "text-ds-muted-foreground hover:text-ds-foreground",
    },
    enclosed: {
      container: "border-b border-ds-border",
      tab: `${baseTabClass} px-4 py-2.5 border border-transparent rounded-t-lg -mb-px`,
      active: "border-ds-border border-b-ds-background bg-ds-background text-ds-foreground",
      inactive: "text-ds-muted-foreground hover:text-ds-foreground",
    },
  }

  const styles = variantClasses[variant]

  return (
    <div className={`${styles.container} flex overflow-x-auto scrollbar-none ${className}`} role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          role="tab"
          type="button"
          aria-selected={activeKey === tab.key}
          disabled={tab.disabled}
          onClick={() => !tab.disabled && onChange(tab.key)}
          className={`${styles.tab} ${activeKey === tab.key ? styles.active : styles.inactive} ${fullWidth ? "flex-1 justify-center" : ""} ${tab.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} text-sm`}
        >
          {tab.icon}
          {tab.label}
          {tab.badge !== undefined && (
            <span className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 text-xs font-medium rounded-full bg-ds-muted text-ds-muted-foreground">
              {tab.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
