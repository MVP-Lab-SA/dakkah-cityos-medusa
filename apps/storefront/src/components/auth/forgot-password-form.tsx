import { useState } from "react"
import { useAuth } from "@/lib/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner, CheckCircleSolid } from "@medusajs/icons"

interface ForgotPasswordFormProps {
  onBack?: () => void
}

export function ForgotPasswordForm({ onBack }: ForgotPasswordFormProps) {
  const { requestPasswordReset } = useAuth()
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      await requestPasswordReset(email)
      setIsSuccess(true)
    } catch (err: any) {
      setError(err?.message || "Failed to send reset email. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="text-center space-y-4">
        <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircleSolid className="w-6 h-6 text-green-600" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-zinc-900">Check your email</h3>
          <p className="text-sm text-zinc-600">
            We've sent a password reset link to <strong>{email}</strong>. Please check your inbox
            and follow the instructions.
          </p>
        </div>
        {onBack && (
          <Button variant="outline" onClick={onBack} className="w-full h-11">
            Back to sign in
          </Button>
        )}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-zinc-900">Reset your password</h3>
        <p className="text-sm text-zinc-600">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="reset-email">Email</Label>
        <Input
          id="reset-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          autoComplete="email"
          className="h-11"
        />
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-11 bg-zinc-900 hover:bg-zinc-800"
      >
        {isLoading ? (
          <>
            <Spinner className="animate-spin mr-2 h-4 w-4" />
            Sending...
          </>
        ) : (
          "Send reset link"
        )}
      </Button>

      {onBack && (
        <Button type="button" variant="ghost" onClick={onBack} className="w-full h-11">
          Back to sign in
        </Button>
      )}
    </form>
  )
}
