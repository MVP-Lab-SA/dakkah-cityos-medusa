import { createFileRoute, Link } from "@tanstack/react-router"
import { VendorReviews } from "@/components/vendors/vendor-reviews"
import { ArrowLeft, Spinner } from "@medusajs/icons"
import { useVendor } from "@/lib/hooks/use-vendors"
import { useVendorReviews } from "@/lib/hooks/use-reviews"

export const Route = createFileRoute("/$tenant/$locale/vendors/$handle/reviews")({
  component: VendorReviewsPage,
})

function VendorReviewsPage() {
  const { tenant, locale, handle } = Route.useParams()

  // Fetch real vendor and reviews data
  const { data: vendorData, isLoading: vendorLoading } = useVendor(handle)
  const vendor = (vendorData as any)?.vendor || vendorData

  const { data: reviewsData, isLoading: reviewsLoading } = useVendorReviews(vendor?.id || "", {
    limit: 50,
  })

  const isLoading = vendorLoading || reviewsLoading

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <Spinner className="w-8 h-8 animate-spin text-zinc-400" />
      </div>
    )
  }

  if (!vendor) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-zinc-900 mb-2">Vendor not found</h1>
          <Link to={`/${tenant}/${locale}/vendors` as any} className="text-blue-600 hover:underline">
            Browse all vendors
          </Link>
        </div>
      </div>
    )
  }

  // Transform reviews for the component
  const reviews = (reviewsData?.reviews || []).map((r: any) => ({
    id: r.id,
    author: r.customer?.first_name 
      ? `${r.customer.first_name} ${r.customer?.last_name?.[0] || ""}.`
      : "Anonymous",
    rating: r.rating,
    date: r.created_at,
    content: r.content,
    product: r.product?.title || null,
    is_verified: r.is_verified_purchase,
  }))

  // Calculate average rating
  const reviewsResponse = reviewsData as any
  const totalReviews = reviewsResponse?.count || reviews.length
  const averageRating = reviewsResponse?.average_rating || 
    (reviews.length > 0 
      ? reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / reviews.length 
      : 0)

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Link */}
        <Link
          to={`/${tenant}/${locale}/vendors/${handle}` as any}
          className="inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to {vendor.name}
        </Link>

        <h1 className="text-2xl font-bold text-zinc-900 mb-8">
          Reviews for {vendor.name}
        </h1>

        {reviews.length === 0 ? (
          <div className="bg-white rounded-xl border border-zinc-200 p-8 text-center">
            <p className="text-zinc-500">No reviews yet for this vendor.</p>
          </div>
        ) : (
          <VendorReviews
            reviews={reviews}
            averageRating={averageRating}
            totalReviews={totalReviews}
          />
        )}
      </div>
    </div>
  )
}
