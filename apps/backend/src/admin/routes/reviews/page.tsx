import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Button, Badge, Select, toast } from "@medusajs/ui"
import { Star, CheckCircle, XCircle, Trash, ShieldCheck } from "@medusajs/icons"
import { useState } from "react"
import { 
  useReviews, useApproveReview, useRejectReview, useVerifyReview, useDeleteReview,
  Review 
} from "../../hooks/use-reviews"
import { DataTable } from "../../components/tables/data-table"
import { StatsGrid } from "../../components/charts/stats-grid"
import { ConfirmModal } from "../../components/modals/confirm-modal"

const ReviewsPage = () => {
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [ratingFilter, setRatingFilter] = useState<string>("all")
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [actionType, setActionType] = useState<"approve" | "reject" | "delete" | null>(null)

  const filterParams = {
    ...(statusFilter === "pending" ? { is_approved: false } : {}),
    ...(statusFilter === "approved" ? { is_approved: true } : {}),
    ...(ratingFilter !== "all" ? { rating: parseInt(ratingFilter) } : {}),
  }

  const { data: reviewsData, isLoading } = useReviews(
    Object.keys(filterParams).length > 0 ? filterParams : undefined
  )
  
  const approveReview = useApproveReview()
  const rejectReview = useRejectReview()
  const verifyReview = useVerifyReview()
  const deleteReview = useDeleteReview()

  const reviews = reviewsData?.reviews || []
  
  const pendingReviews = reviews.filter(r => !r.is_approved)
  const approvedReviews = reviews.filter(r => r.is_approved)
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "0"

  const stats = [
    { label: "Total Reviews", value: reviews.length, icon: <Star className="w-5 h-5" /> },
    { label: "Pending Moderation", value: pendingReviews.length, color: "orange" as const },
    { label: "Approved", value: approvedReviews.length, color: "green" as const },
    { label: "Average Rating", value: avgRating, icon: <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" /> },
  ]

  const handleApprove = async () => {
    if (!selectedReview) return
    try {
      await approveReview.mutateAsync(selectedReview.id)
      toast.success("Review approved")
      closeModal()
    } catch (error) {
      toast.error("Failed to approve review")
    }
  }

  const handleReject = async () => {
    if (!selectedReview) return
    try {
      await rejectReview.mutateAsync(selectedReview.id)
      toast.success("Review rejected")
      closeModal()
    } catch (error) {
      toast.error("Failed to reject review")
    }
  }

  const handleDelete = async () => {
    if (!selectedReview) return
    try {
      await deleteReview.mutateAsync(selectedReview.id)
      toast.success("Review deleted")
      closeModal()
    } catch (error) {
      toast.error("Failed to delete review")
    }
  }

  const handleVerify = async (review: Review) => {
    try {
      await verifyReview.mutateAsync(review.id)
      toast.success("Review marked as verified purchase")
    } catch (error) {
      toast.error("Failed to verify review")
    }
  }

  const closeModal = () => {
    setSelectedReview(null)
    setActionType(null)
  }

  const openAction = (review: Review, action: "approve" | "reject" | "delete") => {
    setSelectedReview(review)
    setActionType(action)
  }

  const RatingStars = ({ rating }: { rating: number }) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star 
          key={star} 
          className={`w-4 h-4 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-ui-fg-muted"}`} 
        />
      ))}
    </div>
  )

  const columns = [
    { key: "product", header: "Product", cell: (r: Review) => (
      <div className="flex items-center gap-3">
        {r.product?.thumbnail && (
          <img src={r.product.thumbnail} alt="" className="w-10 h-10 rounded object-cover" />
        )}
        <div>
          <Text className="font-medium">{r.product?.title || "Unknown Product"}</Text>
          <Text className="text-ui-fg-muted text-sm">{r.customer_name || r.customer_email}</Text>
        </div>
      </div>
    )},
    { key: "rating", header: "Rating", sortable: true, cell: (r: Review) => (
      <div>
        <RatingStars rating={r.rating} />
        {r.title && <Text className="text-sm mt-1 font-medium">{r.title}</Text>}
      </div>
    )},
    { key: "content", header: "Review", cell: (r: Review) => (
      <Text className="text-sm line-clamp-2 max-w-md">{r.content}</Text>
    )},
    { key: "badges", header: "Badges", cell: (r: Review) => (
      <div className="flex gap-1 flex-wrap">
        {r.is_verified_purchase && (
          <Badge color="green" className="text-xs">
            <ShieldCheck className="w-3 h-3 mr-1" />
            Verified
          </Badge>
        )}
        {r.helpful_count > 0 && (
          <Badge color="grey" className="text-xs">{r.helpful_count} helpful</Badge>
        )}
      </div>
    )},
    { key: "status", header: "Status", cell: (r: Review) => (
      <Badge color={r.is_approved ? "green" : "orange"}>
        {r.is_approved ? "Approved" : "Pending"}
      </Badge>
    )},
    { key: "created_at", header: "Date", sortable: true, cell: (r: Review) => (
      new Date(r.created_at).toLocaleDateString()
    )},
    { key: "actions", header: "", width: "160px", cell: (r: Review) => (
      <div className="flex gap-1">
        {!r.is_approved && (
          <>
            <Button variant="secondary" size="small" onClick={() => openAction(r, "approve")}>
              <CheckCircle className="w-4 h-4 text-ui-tag-green-icon" />
            </Button>
            <Button variant="secondary" size="small" onClick={() => openAction(r, "reject")}>
              <XCircle className="w-4 h-4 text-ui-tag-orange-icon" />
            </Button>
          </>
        )}
        {!r.is_verified_purchase && r.order_id && (
          <Button variant="secondary" size="small" onClick={() => handleVerify(r)}>
            <ShieldCheck className="w-4 h-4" />
          </Button>
        )}
        <Button variant="secondary" size="small" onClick={() => openAction(r, "delete")}>
          <Trash className="w-4 h-4 text-ui-tag-red-icon" />
        </Button>
      </div>
    )},
  ]

  return (
    <Container className="p-0">
      <div className="p-6 border-b border-ui-border-base">
        <div className="flex items-center justify-between">
          <div>
            <Heading level="h1">Reviews</Heading>
            <Text className="text-ui-fg-muted">Moderate customer reviews</Text>
          </div>
        </div>
      </div>

      <div className="p-6">
        <StatsGrid stats={stats} columns={4} />
      </div>

      <div className="px-6 pb-6">
        <div className="flex gap-4 mb-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <Select.Trigger className="w-[180px]">
              <Select.Value placeholder="All Reviews" />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="all">All Reviews</Select.Item>
              <Select.Item value="pending">Pending Moderation</Select.Item>
              <Select.Item value="approved">Approved</Select.Item>
            </Select.Content>
          </Select>

          <Select value={ratingFilter} onValueChange={setRatingFilter}>
            <Select.Trigger className="w-[140px]">
              <Select.Value placeholder="All Ratings" />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="all">All Ratings</Select.Item>
              <Select.Item value="5">5 Stars</Select.Item>
              <Select.Item value="4">4 Stars</Select.Item>
              <Select.Item value="3">3 Stars</Select.Item>
              <Select.Item value="2">2 Stars</Select.Item>
              <Select.Item value="1">1 Star</Select.Item>
            </Select.Content>
          </Select>
        </div>

        <DataTable 
          data={reviews} 
          columns={columns} 
          searchable 
          searchPlaceholder="Search reviews..." 
          searchKeys={["content", "title", "customer_name", "customer_email"]}
          loading={isLoading}
          emptyMessage="No reviews found"
        />
      </div>

      {/* Approve Modal */}
      <ConfirmModal 
        open={actionType === "approve"} 
        onOpenChange={closeModal}
        title="Approve Review"
        description={
          <div className="space-y-3">
            <Text>Approve this review? It will be visible to customers.</Text>
            {selectedReview && (
              <div className="bg-ui-bg-subtle p-3 rounded-lg">
                <RatingStars rating={selectedReview.rating} />
                {selectedReview.title && <Text className="font-medium mt-2">{selectedReview.title}</Text>}
                <Text className="text-sm mt-1">{selectedReview.content}</Text>
                <Text className="text-ui-fg-muted text-xs mt-2">- {selectedReview.customer_name || selectedReview.customer_email}</Text>
              </div>
            )}
          </div>
        }
        onConfirm={handleApprove}
        confirmLabel="Approve"
        loading={approveReview.isPending}
      />

      {/* Reject Modal */}
      <ConfirmModal 
        open={actionType === "reject"} 
        onOpenChange={closeModal}
        title="Reject Review"
        description={
          <div className="space-y-3">
            <Text>Reject this review? It will remain hidden from customers.</Text>
            {selectedReview && (
              <div className="bg-ui-bg-subtle p-3 rounded-lg">
                <RatingStars rating={selectedReview.rating} />
                {selectedReview.title && <Text className="font-medium mt-2">{selectedReview.title}</Text>}
                <Text className="text-sm mt-1">{selectedReview.content}</Text>
              </div>
            )}
          </div>
        }
        onConfirm={handleReject}
        confirmLabel="Reject"
        variant="danger"
        loading={rejectReview.isPending}
      />

      {/* Delete Modal */}
      <ConfirmModal 
        open={actionType === "delete"} 
        onOpenChange={closeModal}
        title="Delete Review"
        description="Are you sure you want to delete this review? This action cannot be undone."
        onConfirm={handleDelete}
        confirmLabel="Delete"
        variant="danger"
        loading={deleteReview.isPending}
      />
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Reviews",
  icon: Star,
})

export default ReviewsPage
