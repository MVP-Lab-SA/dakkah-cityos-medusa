// @ts-nocheck
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { storageService, ObjectNotFoundError } from "../../../../lib/storage"

export const AUTHENTICATE = false

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const objectPath = req.query.path as string
    if (!objectPath) {
      return res.status(400).json({ error: "Query parameter 'path' is required" })
    }

    await storageService.serveMediaCached(objectPath, res, 31536000)
  } catch (error: any) {
    if (error instanceof ObjectNotFoundError) {
      return res.status(404).json({ error: "Object not found" })
    }
    console.error("Error serving storage object:", error)
    return res.status(500).json({ error: "Failed to serve object" })
  }
}
