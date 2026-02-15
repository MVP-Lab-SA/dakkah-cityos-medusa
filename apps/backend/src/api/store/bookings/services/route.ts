import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { handleApiError } from "../../../../lib/api-error-handler"

/**
 * GET /store/bookings/services
 * List available bookable services
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const bookingModule = req.scope.resolve("booking") as any
  
  const { 
    offset = 0, 
    limit = 50, 
    category,
    service_type,
  } = req.query
  
  try {
    let services: any[] = []
    try {
      const result = await bookingModule.listServiceProducts({}, {
        skip: Number(offset),
        take: Number(limit),
      })
      services = Array.isArray(result) ? result : [result].filter(Boolean)
    } catch {
      services = []
    }
    
    res.json({
      services,
      count: services.length,
      offset: Number(offset),
      limit: Number(limit),
    })
  } catch (error: any) {
    res.json({
      services: [],
      count: 0,
      offset: Number(offset),
      limit: Number(limit),})
  }
}

