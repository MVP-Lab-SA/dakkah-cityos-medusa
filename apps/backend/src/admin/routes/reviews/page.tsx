import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Button, Badge, toast } from "@medusajs/ui"
import { Star, CheckCircle, XCircle } from "@medusajs/icons"
import { useState } from "react"
import { DataTable } from "../../components/tables/data-table.js"
import { StatsGrid } from "../../components/charts/stats-grid.js"
import { ConfirmModal } from "../../components/modals/confirm-modal.js"
import { useReviews, useApproveReview, useRejectReview } from "../../hooks/use-reviews.js"
import type { Review } from "../../hooks/use-reviews.js"

const ReviewsPage = () => {
  const { data, isLoading } = useReviews()
  const approveReview = useApproveReview()
  const rejectReview = useRejectReview()
  const [actionReview, setActionReview] = useState<{ review: Review; action: string } | null>(null)

  const reviews = data?.reviews || []
  const avgRating = reviews.length > 0 ? (reviews.reduce((s: number, r: Review) => s + r.rating, 0) / reviews.length).toFixed(1) : "0"
  const pendingCount = reviews.filter((r: Review) => !r.is_approved).length

  const stats = [
    { label: "Total Reviews", value: reviews.length, icon: <Star className="w-5 h-5" /> },
    { label: "Average Rating", value: `${avgRating} ★`, color: "green" as const },
    { label: "Pending Moderation", value: pendingCount, color: "orange" as const },
    { label: "Verified Purchases", value: reviews.filter((r: Review) => r.is_verified_purchase).length, color: "blue" as const },
  ]

  const handleAction = () => {
    if (!actionReview) return
    const { review, action } = actionReview
    if (action === "approve") {
      approveReview.mutate(review.id, {
        onSuccess: () => { toast.success("Review approved"); setActionReview(null) },
        onError: () => toast.error("Failed to approve review"),
      })
    } else if (action === "reject") {
      rejectReview.mutate(review.id, {
        onSuccess: () => { toast.success("Review rejected"); setActionReview(null) },
        onError: () => toast.error("Failed to reject review"),
      })
    }
  }

  const renderStars = (rating: number) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} className={i <= rating ? "text-yellow-400" : "text-gray-300"}>★</span>
      ))}
    </div>
  )

  const columns = [
    { key: "product", header: "Product", sortable: true, cell: (r: Review) => (
      <div><Text className="font-medium">{r.product?.title || r.product_id || "—"}</Text><Text className="text-ui-fg-muted text-sm">{r.customer_name || r.customer_email || "—"}</Text></div>
    )},
    { key: "rating", header: "Rating", sortable: true, cell: (r: Review) => renderStars(r.rating) },
    { key: "content", header: "Review", cell: (r: Review) => <Text className="text-sm max-w-xs truncate">{r.title || r.content}</Text> },
    { key: "is_approved", header: "Status", cell: (r: Review) => <Badge color={r.is_approved ? "green" : "orange"}>{r.is_approved ? "Approved" : "Pending"}</Badge> },
    { key: "is_verified_purchase", header: "Verified", cell: (r: Review) => r.is_verified_purchase ? <Badge color="blue">Verified</Badge> : <Badge color="grey">Unverified</Badge> },
    { key: "created_at", header: "Date", sortable: true, cell: (r: Review) => <Text className="text-sm">{r.created_at?.slice(0, 10)}</Text> },
    { key: "actions", header: "", width: "140px", cell: (r: Review) => (
      <div className="flex gap-1">
        {!r.is_approved && (
          <>
            <Button variant="secondary" size="small" onClick={() => setActionReview({ review: r, action: "approve" })}><CheckCircle className="w-4 h-4 text-ui-tag-green-icon" /></Button>
            <Button variant="secondary" size="small" onClick={() => setActionReview({ review: r, action: "reject" })}><XCircle className="w-4 h-4 text-ui-tag-red-icon" /></Button>
          </>
        )}
      </div>
    )},
  ]

  return (
    <Container className="p-0">
      <div className="p-6 border-b border-ui-border-base">
        <div className="flex items-center justify-between">
          <div><Heading level="h1">Reviews & Ratings</Heading><Text className="text-ui-fg-muted">Moderate customer reviews and manage ratings</Text></div>
        </div>
      </div>
      <div className="p-6"><StatsGrid stats={stats} columns={4} /></div>
      <div className="px-6 pb-6">
        <DataTable data={reviews} columns={columns} searchable searchPlaceholder="Search reviews..." searchKeys={["customer_name", "customer_email", "content", "title"]} loading={isLoading} emptyMessage="No reviews found" />
      </div>
      <ConfirmModal
        open={!!actionReview}
        onOpenChange={() => setActionReview(null)}
        title={actionReview ? `${actionReview.action.charAt(0).toUpperCase() + actionReview.action.slice(1)} Review` : ""}
        description={actionReview ? `${actionReview.action.charAt(0).toUpperCase() + actionReview.action.slice(1)} review by ${actionReview.review.customer_name || actionReview.review.customer_email || "customer"}?` : ""}
        onConfirm={handleAction}
        confirmLabel={actionReview?.action === "reject" ? "Reject" : "Approve"}
        variant={actionReview?.action === "reject" ? "danger" : undefined}
      />
    </Container>
  )
}

export const config = defineRouteConfig({ label: "Reviews", icon: Star })
export default ReviewsPage
