import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const service = req.scope.resolve("cmsContent") as any
    const filters: Record<string, any> = {}
    if (req.query.status) filters.status = req.query.status
    if (req.query.q) filters.title = { $like: `%${req.query.q}%` }
    const pages = await service.listCmsPages(filters)
    res.json({ pages: Array.isArray(pages) ? pages : [pages].filter(Boolean) })
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const service = req.scope.resolve("cmsContent") as any
    const page = await service.createCmsPages(req.body)
    res.status(201).json({ page })
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}
