import { createFileRoute, Link } from "@tanstack/react-router"
import { useState, useEffect } from "react"

export const Route = createFileRoute("/$tenant/$locale/restaurants/$id")({
  component: RestaurantDetailPage,
})

function RestaurantDetailPage() {
  const { tenant, locale, id } = Route.useParams()
  const [restaurant, setRestaurant] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch(`/store/restaurants/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setRestaurant(data.restaurant || data.item || data)
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [id])

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-zinc-200 border-t-zinc-900 rounded-full animate-spin" />
      </div>
    )
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-500 mb-4">Restaurant not found</p>
          <Link
            to={`/${tenant}/${locale}/restaurants` as any}
            className="text-sm font-medium text-zinc-900 hover:underline"
          >
            Back to restaurants
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="bg-zinc-900 text-white py-12">
        <div className="content-container">
          <Link
            to={`/${tenant}/${locale}/restaurants` as any}
            className="inline-flex items-center text-sm text-zinc-400 hover:text-white mb-6"
          >
            ← Back to restaurants
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">{restaurant.name}</h1>
              {restaurant.cuisine_type && (
                <span className="inline-block mt-2 text-sm bg-zinc-800 text-zinc-300 px-3 py-1 rounded">
                  {restaurant.cuisine_type}
                </span>
              )}
              {restaurant.rating != null && (
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`w-5 h-5 ${star <= Math.round(restaurant.rating) ? "text-yellow-400" : "text-zinc-600"}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-zinc-300">{restaurant.rating}</span>
                </div>
              )}
            </div>
            {restaurant.price_range && (
              <span className="text-zinc-400 text-lg">{restaurant.price_range}</span>
            )}
          </div>
        </div>
      </div>

      {(restaurant.photo || restaurant.thumbnail || restaurant.image) && (
        <div className="content-container pt-8">
          <div className="rounded-lg overflow-hidden h-80 bg-zinc-100">
            <img
              src={restaurant.photo || restaurant.thumbnail || restaurant.image}
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      <div className="content-container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {restaurant.description && (
              <div className="bg-white rounded-lg border border-zinc-200 p-6">
                <h2 className="text-lg font-semibold text-zinc-900 mb-4">About</h2>
                <p className="text-zinc-600 leading-relaxed">{restaurant.description}</p>
              </div>
            )}

            {restaurant.menu && restaurant.menu.length > 0 && (
              <div className="bg-white rounded-lg border border-zinc-200 p-6">
                <h2 className="text-lg font-semibold text-zinc-900 mb-4">Menu</h2>
                <div className="space-y-6">
                  {restaurant.menu.map((category: any, i: number) => (
                    <div key={i}>
                      {category.category && (
                        <h3 className="font-medium text-zinc-800 mb-3 pb-2 border-b border-zinc-100">
                          {category.category}
                        </h3>
                      )}
                      <div className="space-y-3">
                        {(category.items || [category]).map((item: any, j: number) => (
                          <div key={j} className="flex items-start justify-between py-2">
                            <div>
                              <p className="font-medium text-zinc-900">{item.name || item.title}</p>
                              {item.description && (
                                <p className="text-sm text-zinc-500 mt-0.5">{item.description}</p>
                              )}
                            </div>
                            {item.price != null && (
                              <span className="font-medium text-zinc-900 ml-4">${item.price}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-zinc-200 p-6">
              <h3 className="font-semibold text-zinc-900 mb-4">Information</h3>
              <div className="space-y-3 text-sm">
                {restaurant.address && (
                  <div>
                    <span className="text-zinc-400 block">Address</span>
                    <span className="text-zinc-700">{restaurant.address}</span>
                  </div>
                )}
                {restaurant.phone && (
                  <div>
                    <span className="text-zinc-400 block">Phone</span>
                    <span className="text-zinc-700">{restaurant.phone}</span>
                  </div>
                )}
                {restaurant.hours && (
                  <div>
                    <span className="text-zinc-400 block">Hours</span>
                    <span className="text-zinc-700">{restaurant.hours}</span>
                  </div>
                )}
              </div>
            </div>
            <button className="w-full bg-zinc-900 text-white py-3 rounded-lg font-medium hover:bg-zinc-800 transition-colors">
              Reserve a Table
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
