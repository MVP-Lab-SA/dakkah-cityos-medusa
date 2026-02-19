import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { handleApiError } from "../../../../../lib/api-error-handler";

// GET /store/reviews/products/:id - Get reviews for a product
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const reviewService = req.scope.resolve("review");

  // Safely extract ID, handling potential undefined params
  const id = req.params?.id;

  if (!id) {
    // If route param failed, try context or throw validation error
    return res.status(400).json({
      message: "Product ID is missing or invalid URL parameters",
      code: "INVALID_REQUEST_PARAMS",
    });
  }

  const { limit = "10", offset = "0" } = req.query as {
    limit?: string;
    offset?: string;
  };

  try {
    const reviews = await reviewService.listProductReviews(id, {
      limit: parseInt(limit),
      offset: parseInt(offset),
      approved_only: true,
    });

    const summary = await reviewService.getProductRatingSummary(id);

    res.json({
      reviews,
      summary,
      count: reviews.length,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
  } catch (error: any) {
    handleApiError(res, error, "STORE-REVIEWS-PRODUCTS-ID");
  }
}
