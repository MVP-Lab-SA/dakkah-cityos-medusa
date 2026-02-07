// @ts-nocheck
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

interface ServiceProvider {
  id: string
  name: string
  avatar?: string
  title?: string
  bio?: string
  rating?: number
  review_count?: number
  specialties?: string[]
  availability?: {
    next_available?: string
    slots_today?: number
  }
}

/**
 * GET /store/bookings/services/:serviceId/providers
 * Get available service providers for a specific service
 */
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  try {
    const { serviceId } = req.params
    const query = req.scope.resolve("query")

    // Query service providers that can provide this service
    // This would typically join with a service_provider_services table
    const { data: providers } = await query.graph({
      entity: "service_provider",
      fields: [
        "id",
        "name",
        "avatar",
        "title",
        "bio",
        "rating",
        "review_count",
        "specialties",
        "is_active",
        "metadata",
      ],
      filters: {
        is_active: true,
        // Filter by service if we have a join table
        // services: { id: serviceId }
      },
    })

    // Transform and filter providers
    const serviceProviders: ServiceProvider[] = (providers || [])
      .filter((p: any) => {
        // Check if provider offers this service (from metadata or join)
        const services = p.metadata?.services || []
        return services.length === 0 || services.includes(serviceId)
      })
      .map((p: any) => ({
        id: p.id,
        name: p.name,
        avatar: p.avatar,
        title: p.title,
        bio: p.bio,
        rating: p.rating || 0,
        review_count: p.review_count || 0,
        specialties: p.specialties || [],
        availability: {
          next_available: p.metadata?.next_available,
          slots_today: p.metadata?.slots_today || 0,
        },
      }))

    res.json({
      providers: serviceProviders,
      count: serviceProviders.length,
    })
  } catch (error) {
    console.error("Error fetching service providers:", error)
    
    // Return empty list if providers entity doesn't exist yet
    res.json({
      providers: [],
      count: 0,
    })
  }
}
