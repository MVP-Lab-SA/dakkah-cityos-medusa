import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { LoginForm } from "@/components/auth"
import { useAuth } from "@/lib/context/auth-context"
import { useEffect } from "react"
import { Link } from "@tanstack/react-router"

export const Route = createFileRoute("/$countryCode/login")({
  component: LoginPage,
})

function LoginPage() {
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
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-zinc-900">Welcome back</h1>
          <p className="mt-2 text-zinc-600">Sign in to your account to continue</p>
        </div>

        <div className="bg-white border border-zinc-200 rounded-lg p-6 shadow-sm">
          <LoginForm
            onSuccess={handleSuccess}
            onForgotPassword={() => navigate({ to: `${baseHref}/reset-password` as any })}
            onRegister={() => navigate({ to: `${baseHref}/register` as any })}
          />
        </div>

        <div className="mt-8 text-center space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-zinc-50 text-zinc-500">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Link
              to={`${baseHref}/b2b/register` as any}
              className="flex items-center justify-center px-4 py-3 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors"
            >
              <span className="text-sm font-medium text-zinc-700">Business Account</span>
            </Link>
            <Link
              to={`${baseHref}/vendor/register` as any}
              className="flex items-center justify-center px-4 py-3 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors"
            >
              <span className="text-sm font-medium text-zinc-700">Become a Vendor</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
