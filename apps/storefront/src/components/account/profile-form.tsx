import { useState } from "react"
import { useAuth } from "@/lib/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner, CheckCircleSolid } from "@medusajs/icons"

export function ProfileForm() {
  const { customer, updateProfile } = useAuth()
  const [formData, setFormData] = useState({
    first_name: customer?.first_name || "",
    last_name: customer?.last_name || "",
    email: customer?.email || "",
    phone: customer?.phone || "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setSuccess(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setIsLoading(true)

    try {
      await updateProfile({
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone || undefined,
      })
      setSuccess(true)
    } catch (err: any) {
      setError(err?.message || "Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form aria-label="Profile form" onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-ds-destructive border border-ds-destructive text-ds-destructive px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-ds-success border border-ds-success text-ds-success px-4 py-3 rounded-md text-sm flex items-center gap-2">
          <CheckCircleSolid className="h-4 w-4" />
          Profile updated successfully
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="first_name">First name</Label>
          <Input
            id="first_name"
            name="first_name"
            type="text"
            value={formData.first_name}
            onChange={handleChange}
            className="h-11"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="last_name">Last name</Label>
          <Input
            id="last_name"
            name="last_name"
            type="text"
            value={formData.last_name}
            onChange={handleChange}
            className="h-11"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          disabled
          className="h-11 bg-ds-muted text-ds-muted-foreground"
        />
        <p className="text-xs text-ds-muted-foreground">Email cannot be changed</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          placeholder="+1 (555) 000-0000"
          className="h-11"
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading} size="fit">
          {isLoading ? (
            <>
              <Spinner className="animate-spin me-2 h-4 w-4" />
              Saving...
            </>
          ) : (
            "Save changes"
          )}
        </Button>
      </div>
    </form>
  )
}
