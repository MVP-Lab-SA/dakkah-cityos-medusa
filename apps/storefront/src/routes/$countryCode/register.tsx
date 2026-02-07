import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { RegisterForm } from "@/components/auth"
import { useAuth } from "@/lib/context/auth-context"
import { useEffect } from "react"
import { Link } from "@tanstack/react-router"

export const Route = createFileRoute("/$countryCode/register")({
  component: RegisterPage,
})

function RegisterPage() {
  const { countryCode } = Route.useParams() as { countryCode: string }
  const { isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()
  const baseHref = `/${countryCode}`

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate({ to: `${baseHref}/account` as any })
    }
  }, [isAuthenticated, isLoading, navigate, baseHref])

  const handleSuccess = () => {
    navigate({ to: `${baseHref}/account` as any })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-zinc-400">Loading...</div>
      </div>
    )
  }

  if (isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-zinc-900">Create an account</h1>
          <p className="mt-2 text-zinc-600">Get started with your free account today</p>
        </div>

        <div className="bg-white border border-zinc-200 rounded-lg p-6 shadow-sm">
          <RegisterForm
            onSuccess={handleSuccess}
            onLogin={() => navigate({ to: `${baseHref}/login` as any })}
          />
        </div>

        <div className="mt-8 text-center space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-zinc-50 text-zinc-500">Looking for something else?</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Link
              to={`${baseHref}/b2b/register` as any}
              className="flex flex-col items-center justify-center px-4 py-4 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors"
            >
              <span className="text-sm font-medium text-zinc-700">Business Account</span>
              <span className="text-xs text-zinc-500 mt-1">For companies</span>
            </Link>
            <Link
              to={`${baseHref}/vendor/register` as any}
              className="flex flex-col items-center justify-center px-4 py-4 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors"
            >
              <span className="text-sm font-medium text-zinc-700">Vendor Account</span>
              <span className="text-xs text-zinc-500 mt-1">Sell on our platform</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
