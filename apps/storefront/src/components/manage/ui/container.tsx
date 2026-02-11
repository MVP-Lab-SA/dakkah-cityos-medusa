import { type ReactNode } from "react"

interface ContainerProps {
  children: ReactNode
  className?: string
}

export function Container({ children, className = "" }: ContainerProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      {children}
    </div>
  )
}
