import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { ArrowLeft } from "@medusajs/icons"
import { Link } from "@tanstack/react-router"

export const Route = createFileRoute("/vendor/products/$productId")({
  component: EditProductPage,
})

function useProduct(productId: string) {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:9000"

  return useQuery({
    queryKey: ["vendor-product", productId],
    queryFn: async () => {
      const response = await fetch(`${backendUrl}/store/vendors/me/products/${productId}`, {
        credentials: "include",
      })
      if (!response.ok) throw new Error("Failed to fetch product")
      const data = await response.json()
      return data.product
    },
  })
}

function useUpdateProduct() {
  const queryClient = useQueryClient()
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:9000"

  return useMutation({
    mutationFn: async ({ productId, data }: { productId: string; data: any }) => {
      const response = await fetch(`${backendUrl}/store/vendors/me/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to update product")
      }

      return response.json()
    },
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({ queryKey: ["vendor-product", productId] })
      queryClient.invalidateQueries({ queryKey: ["vendor-products"] })
    },
  })
}

function EditProductPage() {
  const { productId } = Route.useParams()
  const navigate = useNavigate()
  const { data: product, isLoading, error } = useProduct(productId)
  const updateProduct = useUpdateProduct()

  const [formData, setFormData] = useState({
    title: "",
    handle: "",
    description: "",
    status: "draft" as "draft" | "published",
  })

  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title || "",
        handle: product.handle || "",
        description: product.description || "",
        status: product.status || "draft",
      })
    }
  }, [product])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validate = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.title.trim()) {
      errors.title = "Title is required"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    try {
      await updateProduct.mutateAsync({
        productId,
        data: formData,
      })
      navigate({ to: "/vendor/products" })
    } catch (err: any) {
      setFormErrors({ submit: err.message })
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

  if (error || !product) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          Product not found or failed to load.
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <Link
          to="/vendor/products"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
        <p className="text-gray-600 mt-1">Update product information</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {formErrors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
            {formErrors.submit}
          </div>
        )}

        {/* Basic Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Basic Information</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-black ${
                  formErrors.title ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Product title"
              />
              {formErrors.title && <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Handle</label>
              <input
                type="text"
                name="handle"
                value={formData.handle}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                placeholder="product-handle"
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
                placeholder="Describe your product..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Thumbnail */}
        {product.thumbnail && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Current Image</h2>
            <img
              src={product.thumbnail}
              alt={product.title}
              className="w-48 h-48 object-cover rounded-lg"
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Link
            to="/vendor/products"
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={updateProduct.isPending}
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
          >
            {updateProduct.isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  )
}
