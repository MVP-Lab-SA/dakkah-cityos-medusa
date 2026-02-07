import { createFileRoute, Link } from "@tanstack/react-router"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Plus, PencilSquare, Trash } from "@medusajs/icons"
import { formatPrice } from "@/lib/utils/price"

export const Route = createFileRoute("/vendor/products/")({
  component: VendorProductsPage,
})

function useVendorProducts() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:9000"
  
  return useQuery({
    queryKey: ["vendor-products"],
    queryFn: async () => {
      const response = await fetch(`${backendUrl}/store/vendors/me/products`, {
        credentials: "include",
      })
      if (!response.ok) throw new Error("Failed to fetch products")
      const data = await response.json()
      return data.products || []
    },
  })
}

function useDeleteProduct() {
  const queryClient = useQueryClient()
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:9000"
  
  return useMutation({
    mutationFn: async (productId: string) => {
      const response = await fetch(`${backendUrl}/store/vendors/me/products/${productId}`, {
        method: "DELETE",
        credentials: "include",
      })
      if (!response.ok) throw new Error("Failed to delete product")
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor-products"] })
    },
  })
}

function VendorProductsPage() {
  const { data: products, isLoading, error } = useVendorProducts()
  const deleteProduct = useDeleteProduct()

  const handleDelete = async (productId: string, productTitle: string) => {
    if (confirm(`Are you sure you want to delete "${productTitle}"?`)) {
      try {
        await deleteProduct.mutateAsync(productId)
      } catch (err) {
        console.error("Failed to delete product:", err)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          Failed to load products. Please try again.
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-1">Manage your product catalog</p>
        </div>
        <Link
          to="/vendor/products/new"
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Link>
      </div>

      {!products || products.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <div className="text-gray-400 mb-4">
            <Plus className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
          <p className="text-gray-600 mb-6">Start by adding your first product to the catalog.</p>
          <Link
            to="/vendor/products/new"
            className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
          >
            <Plus className="w-4 h-4" />
            Add Your First Product
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Inventory
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product: any) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      {product.thumbnail ? (
                        <img
                          src={product.thumbnail}
                          alt={product.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center text-gray-400">
                          ?
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{product.title}</p>
                        <p className="text-sm text-gray-500">{product.handle}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        product.status === "published"
                          ? "bg-green-100 text-green-800"
                          : product.status === "draft"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {product.variants?.[0]?.inventory_quantity ?? "N/A"}
                  </td>
                  <td className="px-6 py-4 text-gray-900">
                    {product.variants?.[0]?.prices?.[0]
                      ? formatPrice(
                          product.variants[0].prices[0].amount,
                          product.variants[0].prices[0].currency_code
                        )
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={`/vendor/products/${product.id}`}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                      >
                        <PencilSquare className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => handleDelete(product.id, product.title)}
                        disabled={deleteProduct.isPending}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
