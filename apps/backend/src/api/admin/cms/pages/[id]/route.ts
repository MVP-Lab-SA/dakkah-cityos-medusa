import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { handleApiError } from "../../../../../lib/api-error-handler"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const service = req.scope.resolve("cmsContent") as any
    const page = await service.retrieveCmsPage(req.params.id)
    res.json({ page })
  } catch (error: any) {
    return handleApiError(res, error, "ADMIN-CMS-PAGES-ID")}
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const service = req.scope.resolve("cmsContent") as any
    const page = await service.updateCmsPages(req.params.id, req.body)
    res.json({ page })
  } catch (error: any) {
    return handleApiError(res, error, "ADMIN-CMS-PAGES-ID")}
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  try {
    const service = req.scope.resolve("cmsContent") as any
    await service.deleteCmsPages(req.params.id)
    res.status(200).json({ id: req.params.id, deleted: true })
  } catch (error: any) {
    return handleApiError(res, error, "ADMIN-CMS-PAGES-ID")}
}

