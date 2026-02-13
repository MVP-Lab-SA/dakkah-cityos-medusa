import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Button, Badge, toast } from "@medusajs/ui"
import { Star, CheckCircle, XCircle } from "@medusajs/icons"
import { useState } from "react"
import { DataTable } from "../../components/tables/data-table.js"
import { StatsGrid } from "../../components/charts/stats-grid.js"
import { ConfirmModal } from "../../components/modals/confirm-modal.js"

type Review = {
  id: string
  product: string
  customer: string
  rating: number
  text: string
  status: string
  created_at: string
}

const mockReviews: Review[] = [
  { id: "rev_1", product: "Wireless Headphones", customer: "Alice Johnson", rating: 5, text: "Excellent sound quality and comfort!", status: "approved", created_at: "2025-02-12" },
  { id: "rev_2", product: "Running Shoes", customer: "Bob Martinez", rating: 4, text: "Great shoes, slightly tight at first.", status: "pending", created_at: "2025-02-11" },
  { id: "rev_3", product: "Smart Watch", customer: "Carol Lee", rating: 2, text: "Battery life is disappointing.", status: "pending", created_at: "2025-02-10" },
  { id: "rev_4", product: "Yoga Mat", customer: "Dan Kim", rating: 1, text: "Terrible quality, fell apart in a week.", status: "flagged", created_at: "2025-02-09" },
  { id: "rev_5", product: "Backpack", customer: "Eva Chen", rating: 5, text: "Perfect for travel, lots of pockets.", status: "approved", created_at: "2025-02-08" },
  { id: "rev_6", product: "Coffee Maker", customer: "Frank White", rating: 3, text: "Decent but noisy.", status: "pending", created_at: "2025-02-07" },
]

const ReviewsPage = () => {
  const [reviews, setReviews] = useState<Review[]>(mockReviews)
  const [actionReview, setActionReview] = useState<{ review: Review; action: string } | null>(null)

  const avgRating = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)

  const stats = [
    { label: "Total Reviews", value: reviews.length, icon: <Star className="w-5 h-5" /> },
    { label: "Average Rating", value: `${avgRating} ★`, color: "green" as const },
    { label: "Pending Moderation", value: reviews.filter(r => r.status === "pending").length, color: "orange" as const },
    { label: "Flagged", value: reviews.filter(r => r.status === "flagged").length, color: "red" as const },
  ]

  const handleAction = () => {
    if (!actionReview) return
    const { review, action } = actionReview
    const newStatus = action === "approve" ? "approved" : action === "reject" ? "rejected" : "flagged"
    setReviews(reviews.map(r => r.id === review.id ? { ...r, status: newStatus } : r))
    toast.success(`Review ${newStatus}`)
    setActionReview(null)
  }

  const renderStars = (rating: number) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} className={i <= rating ? "text-yellow-400" : "text-gray-300"}>★</span>
      ))}
    </div>
  )

  const getStatusColor = (status: string) => {
    switch (status) { case "approved": return "green"; case "pending": return "orange"; case "rejected": return "red"; case "flagged": return "red"; default: return "grey" }
  }

  const columns = [
    { key: "product", header: "Product", sortable: true, cell: (r: Review) => <Text className="font-medium">{r.product}</Text> },
    { key: "customer", header: "Customer", cell: (r: Review) => r.customer },
    { key: "rating", header: "Rating", sortable: true, cell: (r: Review) => renderStars(r.rating) },
    { key: "text", header: "Review", cell: (r: Review) => <Text className="text-sm max-w-xs truncate">{r.text}</Text> },
    { key: "status", header: "Status", cell: (r: Review) => <Badge color={getStatusColor(r.status)}>{r.status}</Badge> },
    { key: "created_at", header: "Date", sortable: true, cell: (r: Review) => r.created_at },
    { key: "actions", header: "", width: "140px", cell: (r: Review) => (
      <div className="flex gap-1">
        {r.status === "pending" && (
          <>
            <Button variant="secondary" size="small" onClick={() => setActionReview({ review: r, action: "approve" })}><CheckCircle className="w-4 h-4 text-ui-tag-green-icon" /></Button>
            <Button variant="secondary" size="small" onClick={() => setActionReview({ review: r, action: "reject" })}><XCircle className="w-4 h-4 text-ui-tag-red-icon" /></Button>
          </>
        )}
        {r.status !== "flagged" && (
          <Button variant="secondary" size="small" onClick={() => setActionReview({ review: r, action: "flag" })}><XCircle className="w-4 h-4 text-ui-tag-orange-icon" /></Button>
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
        <DataTable data={reviews} columns={columns} searchable searchPlaceholder="Search reviews..." searchKeys={["product", "customer", "text"]} emptyMessage="No reviews found" />
      </div>
      <ConfirmModal
        open={!!actionReview}
        onOpenChange={() => setActionReview(null)}
        title={actionReview ? `${actionReview.action.charAt(0).toUpperCase() + actionReview.action.slice(1)} Review` : ""}
        description={actionReview ? `${actionReview.action.charAt(0).toUpperCase() + actionReview.action.slice(1)} review by ${actionReview.review.customer} for "${actionReview.review.product}"?` : ""}
        onConfirm={handleAction}
        confirmLabel={actionReview?.action === "reject" || actionReview?.action === "flag" ? actionReview.action.charAt(0).toUpperCase() + actionReview.action.slice(1) : "Approve"}
        variant={actionReview?.action === "reject" || actionReview?.action === "flag" ? "danger" : undefined}
      />
    </Container>
  )
}

export const config = defineRouteConfig({ label: "Reviews", icon: Star })
export default ReviewsPage
