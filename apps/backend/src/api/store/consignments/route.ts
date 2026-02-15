import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const customerId = req.auth_context?.actor_id

  if (!customerId) {
    return res.json({
      consignments: [],
      count: 0,
      limit: 20,
      offset: 0,
      public_info: {
        title: "Consignment Services",
        description: "Sell your items through our marketplace with our consignment program.",
        how_it_works: [
          "Submit your items for consignment review",
          "We evaluate and list approved items in our store",
          "Items are sold at agreed-upon prices",
          "You receive your share once the item sells",
        ],
        benefits: [
          "No upfront costs to list your items",
          "Professional photography and listing creation",
          "Secure handling and storage",
          "Competitive commission rates",
        ],
        categories: ["Fashion & Apparel", "Electronics", "Furniture", "Art & Collectibles", "Jewelry & Watches"],
      },
    })
  }

  const { limit = "20", offset = "0", tenant_id } = req.query as Record<string, string | undefined>

  try {
    const query = req.scope.resolve("query") as any

    const { data: orders } = await query.graph({
      entity: "order",
      fields: [
        "id",
        "display_id",
        "status",
        "fulfillments.id",
        "fulfillments.tracking_links",
        "fulfillments.shipped_at",
        "fulfillments.delivered_at",
        "fulfillments.canceled_at",
        "fulfillments.created_at",
        "fulfillments.items.id",
        "fulfillments.items.title",
        "fulfillments.items.quantity",
      ],
      filters: { customer_id: customerId },
      pagination: {
        skip: Number(offset),
        take: Number(limit),
        order: { created_at: "DESC" },
      },
    })

    const consignments = (Array.isArray(orders) ? orders : []).flatMap((order: any) =>
      (order.fulfillments || []).map((f: any) => ({
        id: f.id,
        order_id: order.id,
        order_display_id: order.display_id,
        tracking_links: f.tracking_links || [],
        shipped_at: f.shipped_at,
        delivered_at: f.delivered_at,
        canceled_at: f.canceled_at,
        created_at: f.created_at,
        items: f.items || [],
        status: f.delivered_at
          ? "delivered"
          : f.canceled_at
            ? "canceled"
            : f.shipped_at
              ? "shipped"
              : "processing",
      }))
    )

    res.json({
      consignments,
      count: consignments.length,
      limit: Number(limit),
      offset: Number(offset),
    })
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch consignments", error: error.message })
  }
}
