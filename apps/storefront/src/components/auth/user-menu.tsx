import { useState } from "react"
import { useAuth } from "@/lib/context/auth-context"
import { Link } from "@tanstack/react-router"
import { useTenantPrefix } from "@/lib/context/tenant-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { AuthModal } from "./auth-modal"
import {
  User,
  ArrowRightOnRectangle,
  ShoppingBag,
  CreditCard,
  Calendar,
  BuildingStorefront,
  CogSixTooth,
} from "@medusajs/icons"

export function UserMenu() {
  const { customer, isAuthenticated, isB2B, logout, isLoading } = useAuth()
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const prefix = useTenantPrefix()

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logout()
    } finally {
      setIsLoggingOut(false)
    }
  }

  if (isLoading) {
    return (
      <div className="w-8 h-8 rounded-full bg-zinc-100 animate-pulse" />
    )
  }

  if (!isAuthenticated) {
    return (
      <>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setAuthModalOpen(true)}
          className="text-zinc-600 hover:text-zinc-900"
        >
          <User className="h-5 w-5 mr-1" />
          <span className="hidden sm:inline">Sign in</span>
        </Button>
        <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
      </>
    )
  }

  const initials = customer
    ? `${customer.first_name?.[0] || ""}${customer.last_name?.[0] || ""}`.toUpperCase() || "U"
    : "U"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 text-zinc-600 hover:text-zinc-900 focus:outline-none">
          <div className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center text-sm font-medium">
            {initials}
          </div>
          <span className="hidden sm:inline text-sm font-medium">
            {customer?.first_name || "Account"}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">
              {customer?.first_name} {customer?.last_name}
            </p>
            <p className="text-xs text-zinc-500 truncate">{customer?.email}</p>
            {isB2B && customer?.company && (
              <p className="text-xs text-blue-600 font-medium">{customer.company.name}</p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link to={`${prefix}/account` as any} className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            My Account
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link to={`${prefix}/account/orders` as any} className="cursor-pointer">
            <ShoppingBag className="mr-2 h-4 w-4" />
            Orders
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link to={`${prefix}/account/subscriptions` as any} className="cursor-pointer">
            <CreditCard className="mr-2 h-4 w-4" />
            Subscriptions
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link to={`${prefix}/account/bookings` as any} className="cursor-pointer">
            <Calendar className="mr-2 h-4 w-4" />
            Bookings
          </Link>
        </DropdownMenuItem>

        {isB2B && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs text-zinc-500">Business</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link to={`${prefix}/business` as any} className="cursor-pointer">
                <BuildingStorefront className="mr-2 h-4 w-4" />
                Company Dashboard
              </Link>
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link to={`${prefix}/account/settings` as any} className="cursor-pointer">
            <CogSixTooth className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="text-red-600 focus:text-red-600 cursor-pointer"
        >
          <ArrowRightOnRectangle className="mr-2 h-4 w-4" />
          {isLoggingOut ? "Signing out..." : "Sign out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
