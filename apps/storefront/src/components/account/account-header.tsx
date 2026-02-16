import { useState, useEffect } from "react"
import { useAuth } from "@/lib/context/auth-context"

interface AccountHeaderProps {
  title?: string
  description?: string
}

export function AccountHeader({ title, description }: AccountHeaderProps) {
  const { customer, isB2B } = useAuth()
  const [greetingText, setGreetingText] = useState("Hello")

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreetingText("Good morning")
    else if (hour < 18) setGreetingText("Good afternoon")
    else setGreetingText("Good evening")
  }, [])

  const displayName = customer?.first_name || "there"

  return (
    <div className="mb-8">
      {title ? (
        <>
          <h1 className="text-2xl font-bold text-ds-foreground">{title}</h1>
          {description && <p className="mt-1 text-ds-muted-foreground">{description}</p>}
        </>
      ) : (
        <>
          <h1 className="text-2xl font-bold text-ds-foreground">
            {greetingText}, {displayName}
          </h1>
          <p className="mt-1 text-ds-muted-foreground">
            {isB2B 
              ? `Manage your business account and orders`
              : `Manage your account, orders, and preferences`
            }
          </p>
        </>
      )}
    </div>
  )
}
