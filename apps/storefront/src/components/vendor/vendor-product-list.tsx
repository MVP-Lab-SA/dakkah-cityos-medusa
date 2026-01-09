import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/sdk"
import { formatPrice } from "@/lib/utils/prices"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Link } from "@tanstack/react-router"
import { PencilSquare, Trash, Plus } from "@medusajs/icons"

export function VendorProductList() {
  const { data, isLoading } = useQuery({
    queryKey: ["vendor", "products"],
    queryFn: async () => {
      const response = await sdk.client.fetch("/vendor/products", {
        credentials: "include",
      })
      return response.json()
    },
  })

  if (isLoading) {
    return <ProductListSkeleton />
  }

  const { products } = data

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground mt-2">
            Manage your product listings
          </p>
        </div>
        <Link to="/$countryCode/vendor/products/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>

      {products.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No products yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Get started by creating your first product
            </p>
            <Link to="/$countryCode/vendor/products/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product: any) => (
            <Card key={product.id} className="overflow-hidden">
              {product.thumbnail && (
                <div className="aspect-square overflow-hidden">
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <CardContent className="p-4">
                <h3 className="font-semibold line-clamp-1">{product.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {product.description}
                </p>
                
                {product.variants && product.variants.length > 0 && (
                  <p className="text-sm font-medium mt-2">
                    {product.variants[0].prices && product.variants[0].prices[0]
                      ? formatPrice(
                          product.variants[0].prices[0].amount,
                          product.variants[0].prices[0].currency_code
                        )
                      : "No price set"}
                  </p>
                )}

                <div className="flex items-center justify-between mt-4">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      product.status === "published"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {product.status}
                  </span>

                  <div className="flex gap-2">
                    <Link
                      to="/$countryCode/vendor/products/$id/edit"
                      params={{ id: product.id }}
                    >
                      <Button variant="ghost" size="sm">
                        <PencilSquare className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button variant="ghost" size="sm">
                      <Trash className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function ProductListSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <Skeleton className="aspect-square" />
            <CardContent className="p-4">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-4 w-full mt-2" />
              <Skeleton className="h-4 w-24 mt-4" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function Package(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
      />
    </svg>
  )
}
