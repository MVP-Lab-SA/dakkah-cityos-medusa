import { useState } from "react"
import { useAuth } from "@/lib/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@medusajs/icons"

interface LoginFormProps {
  onSuccess?: () => void
  onForgotPassword?: () => void
  onRegister?: () => void
}

export function LoginForm({ onSuccess, onForgotPassword, onRegister }: LoginFormProps) {
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      await login({ email, password })
      onSuccess?.()
    } catch (err: any) {
      setError(err?.message || "Invalid email or password")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          autoComplete="email"
          className="h-11"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          {onForgotPassword && (
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-sm text-zinc-600 hover:text-zinc-900 underline-offset-4 hover:underline"
            >
              Forgot password?
            </button>
          )}
        </div>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
          autoComplete="current-password"
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
            Signing in...
          </>
        ) : (
          "Sign in"
        )}
      </Button>

      {onRegister && (
        <p className="text-center text-sm text-zinc-600">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={onRegister}
            className="font-medium text-zinc-900 hover:underline"
          >
            Create one
          </button>
        </p>
      )}
    </form>
  )
}
