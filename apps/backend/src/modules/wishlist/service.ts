// @ts-nocheck
import { MedusaService } from "@medusajs/framework/utils"
import Wishlist from "./models/wishlist"
import WishlistItem from "./models/wishlist-item"
import crypto from "crypto"

class WishlistModuleService extends MedusaService({
  Wishlist,
  WishlistItem,
}) {
  async addItem(data: {
    wishlistId: string
    productId: string
    variantId?: string
    priority?: "low" | "medium" | "high"
    notes?: string
    metadata?: Record<string, unknown>
  }) {
    const existing = await this.listWishlistItems({
      wishlist_id: data.wishlistId,
      product_id: data.productId,
      variant_id: data.variantId || null,
    })

    if (Array.isArray(existing) && existing.length > 0) {
      throw new Error("Item already exists in this wishlist")
    }

    return await (this as any).createWishlistItems({
      wishlist_id: data.wishlistId,
      product_id: data.productId,
      variant_id: data.variantId || null,
      added_at: new Date(),
      priority: data.priority || "medium",
      notes: data.notes || null,
      metadata: data.metadata || null,
    })
  }

  async removeItem(wishlistId: string, itemId: string) {
    const item = await this.retrieveWishlistItem(itemId)

    if (item.wishlist_id !== wishlistId) {
      throw new Error("Item does not belong to this wishlist")
    }

    await this.deleteWishlistItems(itemId)
    return { success: true }
  }

  async moveItem(itemId: string, fromWishlistId: string, toWishlistId: string) {
    const item = await this.retrieveWishlistItem(itemId)

    if (item.wishlist_id !== fromWishlistId) {
      throw new Error("Item does not belong to the source wishlist")
    }

    const toWishlist = await this.retrieveWishlist(toWishlistId)
    if (!toWishlist) {
      throw new Error("Destination wishlist not found")
    }

    await (this as any).updateWishlistItems({
      id: itemId,
      wishlist_id: toWishlistId,
    })

    return await this.retrieveWishlistItem(itemId)
  }

  async shareWishlist(wishlistId: string, visibility: "private" | "shared" | "public") {
    const wishlist = await this.retrieveWishlist(wishlistId)

    let shareToken = wishlist.share_token
    if (visibility !== "private" && !shareToken) {
      shareToken = crypto.randomBytes(16).toString("hex")
    }
    if (visibility === "private") {
      shareToken = null
    }

    await (this as any).updateWishlists({
      id: wishlistId,
      visibility,
      share_token: shareToken,
    })

    return await this.retrieveWishlist(wishlistId)
  }

  async getByShareToken(shareToken: string) {
    const wishlists = await this.listWishlists({
      share_token: shareToken,
      visibility: ["shared", "public"],
    })

    const list = Array.isArray(wishlists) ? wishlists : [wishlists].filter(Boolean)
    if (list.length === 0) {
      throw new Error("Wishlist not found or not shared")
    }

    return list[0]
  }

  async getCustomerWishlists(customerId: string, tenantId: string) {
    const wishlists = await this.listWishlists({
      customer_id: customerId,
      tenant_id: tenantId,
    })

    return Array.isArray(wishlists) ? wishlists : [wishlists].filter(Boolean)
  }

  async getOrCreateDefault(customerId: string, tenantId: string) {
    const existing = await this.listWishlists({
      customer_id: customerId,
      tenant_id: tenantId,
      is_default: true,
    })

    const list = Array.isArray(existing) ? existing : [existing].filter(Boolean)
    if (list.length > 0) {
      return list[0]
    }

    return await (this as any).createWishlists({
      customer_id: customerId,
      tenant_id: tenantId,
      title: "My Wishlist",
      is_default: true,
      visibility: "private",
    })
  }
}

export default WishlistModuleService
