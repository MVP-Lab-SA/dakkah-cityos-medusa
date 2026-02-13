import { MedusaService } from "@medusajs/framework/utils"
import ClassifiedListing from "./models/classified-listing"
import ListingImage from "./models/listing-image"
import ListingOffer from "./models/listing-offer"
import ListingCategory from "./models/listing-category"
import ListingFlag from "./models/listing-flag"

class ClassifiedModuleService extends MedusaService({
  ClassifiedListing,
  ListingImage,
  ListingOffer,
  ListingCategory,
  ListingFlag,
}) {
  /** Publish a draft listing, making it visible to buyers */
  async publishListing(listingId: string): Promise<any> {
    const listing = await this.retrieveClassifiedListing(listingId) as any

    if (listing.status === "published") {
      throw new Error("Listing is already published")
    }

    if (listing.status === "flagged") {
      throw new Error("Flagged listings cannot be published")
    }

    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 30)

    return await (this as any).updateClassifiedListings({
      id: listingId,
      status: "published",
      published_at: new Date(),
      expires_at: expiresAt,
    })
  }

  /** Expire an active listing */
  async expireListing(listingId: string): Promise<any> {
    const listing = await this.retrieveClassifiedListing(listingId) as any

    if (listing.status !== "published") {
      throw new Error("Only published listings can be expired")
    }

    return await (this as any).updateClassifiedListings({
      id: listingId,
      status: "expired",
      expired_at: new Date(),
    })
  }

  /** Flag a listing for review with a reason */
  async flagListing(listingId: string, reason: string, reporterId?: string): Promise<any> {
    if (!reason || reason.trim().length === 0) {
      throw new Error("Flag reason is required")
    }

    const listing = await this.retrieveClassifiedListing(listingId) as any

    const flag = await (this as any).createListingFlags({
      listing_id: listingId,
      reason,
      reporter_id: reporterId || null,
      status: "pending",
      flagged_at: new Date(),
    })

    await (this as any).updateClassifiedListings({
      id: listingId,
      status: "flagged",
      flag_count: Number(listing.flag_count || 0) + 1,
    })

    return flag
  }

  /** Renew an expired listing for another 30 days */
  async renewListing(listingId: string): Promise<any> {
    const listing = await this.retrieveClassifiedListing(listingId) as any

    if (!["expired", "published"].includes(listing.status)) {
      throw new Error("Only expired or published listings can be renewed")
    }

    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 30)

    return await (this as any).updateClassifiedListings({
      id: listingId,
      status: "published",
      expires_at: expiresAt,
      renewed_at: new Date(),
    })
  }
}

export default ClassifiedModuleService
