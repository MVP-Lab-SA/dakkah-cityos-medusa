import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { ForgotPasswordForm } from "@/components/auth"
import { useAuth } from "@/lib/context/auth-context"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner, CheckCircleSolid } from "@medusajs/icons"

export const Route = createFileRoute("/$tenant/$locale/reset-password")({
  component: ResetPasswordPage,
})

function ResetPasswordPage() {
  const { tenant, locale } = Route.useParams() as { locale: string }
  const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')
  const token = searchParams.get('token') || undefined
  const navigate = useNavigate()
  const baseHref = `/${tenant}/${locale}`

  // If token is present, show reset form; otherwise show request form
  if (token) {
    return <ResetWithToken token={token} baseHref={baseHref} navigate={navigate} />
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-ds-background border border-ds-border rounded-lg p-6 shadow-sm">
          <ForgotPasswordForm onBack={() => navigate({ to: `${baseHref}/login` as any })} />
        </div>
      </div>
    </div>
  )
}

function ResetWithToken({
  token,
  baseHref,
  navigate,
}: {
  token: string
  baseHref: string
  navigate: ReturnType<typeof useNavigate>
}) {
  const { resetPassword } = useAuth()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }

    setIsLoading(true)
    try {
      await resetPassword(token, password)
      setIsSuccess(true)
    } catch (err: any) {
      setError(err?.message || "Failed to reset password. The link may have expired.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-ds-background border border-ds-border rounded-lg p-6 shadow-sm text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-ds-success rounded-full flex items-center justify-center">
              <CheckCircleSolid className="w-6 h-6 text-ds-success" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-ds-foreground">Password reset successful</h3>
              <p className="text-sm text-ds-muted-foreground">
                Your password has been updated. You can now sign in with your new password.
              </p>
            </div>
            <Button
              onClick={() => navigate({ to: `${baseHref}/login` as any })}
              className="w-full h-11 bg-ds-primary hover:bg-ds-primary"
            >
              Sign in
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-ds-foreground">Set new password</h1>
          <p className="mt-2 text-ds-muted-foreground">Enter your new password below</p>
        </div>

        <div className="bg-ds-background border border-ds-border rounded-lg p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-ds-destructive border border-ds-destructive text-ds-destructive px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="new-password">New password</Label>
              <Input
                id="new-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                required
                autoComplete="new-password"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-new-password">Confirm new password</Label>
              <Input
                id="confirm-new-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
                required
                autoComplete="new-password"
                className="h-11"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-ds-primary hover:bg-ds-primary"
            >
              {isLoading ? (
                <>
                  <Spinner className="animate-spin mr-2 h-4 w-4" />
                  Resetting...
                </>
              ) : (
                "Reset password"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
