import React from "react"

interface SwitchProps {
  checked?: boolean
  defaultChecked?: boolean
  onChange?: (checked: boolean) => void
  disabled?: boolean
  size?: "sm" | "md" | "lg"
  label?: string
  className?: string
  name?: string
}

const sizeMap = {
  sm: { track: "w-8 h-4", thumb: "w-3 h-3", translate: "translate-x-4" },
  md: { track: "w-11 h-6", thumb: "w-5 h-5", translate: "translate-x-5" },
  lg: { track: "w-14 h-7", thumb: "w-6 h-6", translate: "translate-x-7" },
}

export const Switch: React.FC<SwitchProps> = ({
  checked: controlledChecked,
  defaultChecked = false,
  onChange,
  disabled,
  size = "md",
  label,
  className = "",
  name,
}) => {
  const [internalChecked, setInternalChecked] = React.useState(defaultChecked)
  const isChecked = controlledChecked !== undefined ? controlledChecked : internalChecked

  const handleToggle = () => {
    if (disabled) return
    const newValue = !isChecked
    setInternalChecked(newValue)
    onChange?.(newValue)
  }

  const s = sizeMap[size]

  return (
    <label className={`inline-flex items-center gap-2 ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${className}`}>
      <input
        type="checkbox"
        name={name}
        checked={isChecked}
        onChange={handleToggle}
        disabled={disabled}
        className="sr-only"
      />
      <span
        role="switch"
        aria-checked={isChecked}
        className={`relative inline-flex shrink-0 rounded-full transition-colors duration-200 ${s.track} ${isChecked ? "bg-ds-primary" : "bg-ds-muted"}`}
      >
        <span
          className={`pointer-events-none inline-block rounded-full bg-ds-background shadow-sm transform transition-transform duration-200 ${s.thumb} ${isChecked ? s.translate : "translate-x-0.5"} mt-0.5`}
        />
      </span>
      {label && <span className="text-sm text-ds-foreground">{label}</span>}
    </label>
  )
}
