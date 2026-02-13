import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const service = req.scope.resolve("wishlist") as any
    const item = await service.retrieveWishlist(req.params.id)
    res.json({ item })
  } catch (error: any) {
    res.status(404).json({ message: error.message })
  }
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const service = req.scope.resolve("wishlist") as any
    const item = await service.updateWishlists(req.params.id, req.body)
    res.json({ item })
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  try {
    const service = req.scope.resolve("wishlist") as any
    await service.deleteWishlists(req.params.id)
    res.status(200).json({ id: req.params.id, deleted: true })
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}
