import { createFileRoute, Link } from "@tanstack/react-router"
import { VendorReviews } from "@/components/vendors/vendor-reviews"
import { ArrowLeft } from "@medusajs/icons"

export const Route = createFileRoute("/$countryCode/vendors/$handle/reviews")({
  component: VendorReviewsPage,
})

function VendorReviewsPage() {
  const { countryCode, handle } = Route.useParams()

  // Mock data - would come from API
  const vendor = {
    id: "vendor_1",
    name: "Artisan Crafts Co.",
    handle,
  }

  const reviews = [
    {
      id: "rev_1",
      author: "Sarah M.",
      rating: 5,
      date: "2024-12-15",
      content: "Absolutely love the quality of these products! Fast shipping and great packaging. Will definitely order again.",
      product: "Handcrafted Ceramic Mug",
    },
    {
      id: "rev_2",
      author: "John D.",
      rating: 4,
      date: "2024-12-10",
      content: "Beautiful craftsmanship. The only reason for 4 stars is shipping took a bit longer than expected, but the quality makes up for it.",
      product: "Wooden Cutting Board",
    },
    {
      id: "rev_3",
      author: "Emily R.",
      rating: 5,
      date: "2024-12-05",
      content: "This seller is amazing! They even included a handwritten thank you note. The item exceeded my expectations.",
      product: "Leather Journal",
    },
    {
      id: "rev_4",
      author: "Michael T.",
      rating: 5,
      date: "2024-11-28",
      content: "Third time ordering from this shop. Consistently excellent quality and customer service.",
      product: "Artisan Soap Set",
    },
    {
      id: "rev_5",
      author: "Lisa K.",
      rating: 4,
      date: "2024-11-20",
      content: "Very nice product, exactly as described. Would recommend.",
      product: "Woven Basket",
    },
  ]

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Link */}
        <Link
          to={`/${countryCode}/vendors/${handle}`}
          className="inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to {vendor.name}
        </Link>

        <h1 className="text-2xl font-bold text-zinc-900 mb-8">
          Reviews for {vendor.name}
        </h1>

        <VendorReviews
          reviews={reviews}
          averageRating={4.6}
          totalReviews={reviews.length}
        />
      </div>
    </div>
  )
}
