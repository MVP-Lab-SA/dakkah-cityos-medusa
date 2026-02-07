import { createFileRoute, Link } from "@tanstack/react-router"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useState, useEffect } from "react"

export const Route = createFileRoute("/vendor/settings/")({
  component: VendorSettingsPage,
})

function useVendorProfile() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:9000"

  return useQuery({
    queryKey: ["vendor-profile"],
    queryFn: async () => {
      const response = await fetch(`${backendUrl}/store/vendors/me`, {
        credentials: "include",
      })
      if (!response.ok) throw new Error("Failed to fetch profile")
      const data = await response.json()
      return data.vendor
    },
  })
}

function useUpdateVendorProfile() {
  const queryClient = useQueryClient()
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:9000"

  return useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch(`${backendUrl}/store/vendors/me`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error("Failed to update profile")
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor-profile"] })
    },
  })
}

function VendorSettingsPage() {
  const { data: vendor, isLoading } = useVendorProfile()
  const updateProfile = useUpdateVendorProfile()

  const [formData, setFormData] = useState({
    business_name: "",
    description: "",
    email: "",
    phone: "",
    website: "",
  })

  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (vendor) {
      setFormData({
        business_name: vendor.business_name || "",
        description: vendor.description || "",
        email: vendor.email || "",
        phone: vendor.phone || "",
        website: vendor.website || "",
      })
    }
  }, [vendor])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setSaved(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateProfile.mutateAsync(formData)
      setSaved(true)
    } catch (err) {
      console.error("Failed to update profile:", err)
    }
  }

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your vendor profile and settings</p>
      </div>

      {/* Navigation */}
      <div className="flex gap-4 mb-8 border-b border-gray-200">
        <Link
          to="/vendor/settings"
          className="px-4 py-2 border-b-2 border-black font-medium"
        >
          General
        </Link>
        <Link
          to="/vendor/settings/payments"
          className="px-4 py-2 text-gray-600 hover:text-gray-900"
        >
          Payments
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {saved && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">
            Settings saved successfully!
          </div>
        )}

        {/* Business Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Business Information</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
              <input
                type="text"
                name="business_name"
                value={formData.business_name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                placeholder="Describe your business..."
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Contact Information</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                placeholder="https://"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={updateProfile.isPending}
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
          >
            {updateProfile.isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  )
}
