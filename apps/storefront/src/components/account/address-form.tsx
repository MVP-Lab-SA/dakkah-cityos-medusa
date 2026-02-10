import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@medusajs/icons"

interface AddressFormData {
  first_name: string
  last_name: string
  address_1: string
  address_2?: string
  city: string
  province?: string
  postal_code: string
  country_code: string
  phone?: string
}

interface AddressFormProps {
  initialData?: Partial<AddressFormData>
  onSubmit: (data: AddressFormData) => Promise<void>
  onCancel: () => void
  submitLabel?: string
}

export function AddressForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = "Save address",
}: AddressFormProps) {
  const [formData, setFormData] = useState<AddressFormData>({
    first_name: initialData?.first_name || "",
    last_name: initialData?.last_name || "",
    address_1: initialData?.address_1 || "",
    address_2: initialData?.address_2 || "",
    city: initialData?.city || "",
    province: initialData?.province || "",
    postal_code: initialData?.postal_code || "",
    country_code: initialData?.country_code || "us",
    phone: initialData?.phone || "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      await onSubmit(formData)
    } catch (err: any) {
      setError(err?.message || "Failed to save address")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-ds-destructive border border-ds-destructive text-ds-destructive px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="first_name">First name</Label>
          <Input
            id="first_name"
            name="first_name"
            type="text"
            value={formData.first_name}
            onChange={handleChange}
            required
            className="h-10"
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
            required
            className="h-10"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address_1">Address line 1</Label>
        <Input
          id="address_1"
          name="address_1"
          type="text"
          value={formData.address_1}
          onChange={handleChange}
          required
          className="h-10"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address_2">Address line 2 (optional)</Label>
        <Input
          id="address_2"
          name="address_2"
          type="text"
          value={formData.address_2}
          onChange={handleChange}
          className="h-10"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            name="city"
            type="text"
            value={formData.city}
            onChange={handleChange}
            required
            className="h-10"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="province">State / Province</Label>
          <Input
            id="province"
            name="province"
            type="text"
            value={formData.province}
            onChange={handleChange}
            className="h-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="postal_code">Postal code</Label>
          <Input
            id="postal_code"
            name="postal_code"
            type="text"
            value={formData.postal_code}
            onChange={handleChange}
            required
            className="h-10"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="country_code">Country</Label>
          <select
            id="country_code"
            name="country_code"
            value={formData.country_code}
            onChange={handleChange}
            className="w-full h-10 px-3 border border-ds-border rounded-md text-sm"
            required
          >
            <option value="us">United States</option>
            <option value="ca">Canada</option>
            <option value="gb">United Kingdom</option>
            <option value="de">Germany</option>
            <option value="fr">France</option>
            <option value="au">Australia</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone (optional)</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          className="h-10"
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} size="fit">
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading} size="fit">
          {isLoading ? (
            <>
              <Spinner className="animate-spin mr-2 h-4 w-4" />
              Saving...
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </div>
    </form>
  )
}
