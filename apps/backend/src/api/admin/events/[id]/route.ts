import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const service = req.scope.resolve("eventModuleService") as any
    const item = await service.retrieveEventOutbox(req.params.id)
    res.json({ item })
  } catch (error: any) {
    res.status(404).json({ message: error.message })
  }
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const service = req.scope.resolve("eventModuleService") as any
    const { action } = req.body as { action: "publish" | "retry" }
    if (!action || !["publish", "retry"].includes(action)) {
      return res.status(400).json({ message: "Invalid action. Must be 'publish' or 'retry'." })
    }
    const item = await service.updateEventOutboxes(req.params.id, { status: action === "publish" ? "published" : "pending" })
    res.json({ item })
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  try {
    const service = req.scope.resolve("eventModuleService") as any
    await service.deleteEventOutboxes(req.params.id)
    res.status(200).json({ id: req.params.id, deleted: true })
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}
