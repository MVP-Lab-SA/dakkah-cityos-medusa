import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

/**
 * GET /store/vendors/:handle/reviews
 * Get vendor reviews
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const vendorModule = req.scope.resolve("vendor") as any
  const reviewModule = req.scope.resolve("review") as any
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const { handle } = req.params
  
  const { 
    offset = 0, 
    limit = 20,
    rating,
    sort_by = "created_at",
    order = "DESC",
  } = req.query
  
  try {
    // Find vendor by handle
    const vendors = await vendorModule.listVendors({ handle })
    const vendorList = Array.isArray(vendors) ? vendors : [vendors].filter(Boolean)
    
    if (vendorList.length === 0) {
      return res.status(404).json({ message: "Vendor not found" })
    }
    
    const vendor = vendorList[0]
    
    if (vendor.status !== "active") {
      return res.status(404).json({ message: "Vendor not found" })
    }
    
    // Build filters for reviews
    const filters: any = {
      vendor_id: vendor.id,
      is_approved: true, // Only show approved reviews
    }
    
    if (rating) {
      filters.rating = Number(rating)
    }
    
    // Fetch reviews from review module
    const { data: reviews, metadata } = await query.graph({
      entity: "review",
      fields: [
        "id",
        "rating",
        "title",
        "content",
        "is_verified",
        "helpful_count",
        "created_at",
        "customer.first_name",
        "customer.last_name",
      ],
      filters,
      pagination: {
        skip: Number(offset),
        take: Number(limit),
        order: {
          [sort_by as string]: order === "ASC" ? "ASC" : "DESC"
        }
      }
    })
    
    // Format reviews for response
    const formattedReviews = reviews.map((review: any) => ({
      id: review.id,
      rating: review.rating,
      title: review.title,
      content: review.content,
      is_verified: review.is_verified,
      helpful_count: review.helpful_count || 0,
      created_at: review.created_at,
      author: review.customer
        ? `${review.customer.first_name || ""} ${review.customer.last_name?.charAt(0) || ""}.`.trim()
        : "Anonymous",
    }))
    
    // Calculate rating breakdown from all vendor reviews
    const { data: allReviews } = await query.graph({
      entity: "review",
      fields: ["rating"],
      filters: {
        vendor_id: vendor.id,
        is_approved: true,
      }
    })
    
    const ratingBreakdown = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    }
    
    let totalRating = 0
    for (const review of allReviews) {
      const r = review.rating as 1 | 2 | 3 | 4 | 5
      if (r >= 1 && r <= 5) {
        ratingBreakdown[r]++
        totalRating += r
      }
    }
    
    const averageRating = allReviews.length > 0 
      ? Math.round((totalRating / allReviews.length) * 10) / 10 
      : 0
    
    res.json({
      reviews: formattedReviews,
      vendor: {
        id: vendor.id,
        handle: vendor.handle,
        business_name: vendor.business_name,
        rating: averageRating,
        review_count: allReviews.length,
      },
      rating_breakdown: ratingBreakdown,
      count: metadata?.count || formattedReviews.length,
      offset: Number(offset),
      limit: Number(limit),
    })
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to fetch vendor reviews",
      error: error.message,
    })
  }
}
