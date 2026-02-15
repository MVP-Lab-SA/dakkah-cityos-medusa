import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"
import { handleApiError } from "../../../../lib/api-error-handler"

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  title: z.string().nullable().optional(),
  specialization: z.string().optional(),
  license_number: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  education: z.any().nullable().optional(),
  experience_years: z.number().nullable().optional(),
  languages: z.any().nullable().optional(),
  consultation_fee: z.number().nullable().optional(),
  currency_code: z.string().nullable().optional(),
  consultation_duration_minutes: z.number().optional(),
  is_accepting_patients: z.boolean().optional(),
  photo_url: z.string().nullable().optional(),
  availability: z.any().nullable().optional(),
  metadata: z.record(z.string(), z.unknown()).nullable().optional(),
})

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const moduleService = req.scope.resolve("healthcare") as any
    const { id } = req.params
    const [item] = await moduleService.listPractitioners({ id }, { take: 1 })
    if (!item) return res.status(404).json({ message: "Not found" })
    return res.json({ item })

  } catch (error) {
    handleApiError(res, error, "GET admin healthcare id")
  }
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const moduleService = req.scope.resolve("healthcare") as any
    const { id } = req.params
    const validation = updateSchema.safeParse(req.body)
    if (!validation.success) return res.status(400).json({ message: "Validation failed", errors: validation.error.issues })
    const item = await moduleService.updatePractitioners({ id, ...validation.data })
    return res.json({ item })

  } catch (error) {
    handleApiError(res, error, "POST admin healthcare id")
  }
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  try {
    const moduleService = req.scope.resolve("healthcare") as any
    const { id } = req.params
    await moduleService.deletePractitioners([id])
    return res.status(204).send()

  } catch (error) {
    handleApiError(res, error, "DELETE admin healthcare id")
  }
}
