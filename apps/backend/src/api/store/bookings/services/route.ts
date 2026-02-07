import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

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
    const filters: Record<string, unknown> = {
      is_active: true,
      is_bookable_online: true,
    }
    
    if (category) filters.category = category
    if (service_type) filters.service_type = service_type
    
    const services = await bookingModule.listServiceProducts(filters, {
      skip: Number(offset),
      take: Number(limit),
      order: { name: "ASC" },
    })
    
    const serviceList = Array.isArray(services) ? services : [services].filter(Boolean)
    
    // Filter to only show published services
    const availableServices = serviceList.filter((s: any) => s.is_active)
    
    res.json({
      services: availableServices,
      count: availableServices.length,
      offset: Number(offset),
      limit: Number(limit),
    })
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to fetch services",
      error: error.message,
    })
  }
}
