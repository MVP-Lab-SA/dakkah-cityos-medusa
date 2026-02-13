// @ts-nocheck
import { MedusaService } from "@medusajs/framework/utils"
import CartMetadata from "./models/cart-metadata"

class CartExtensionModuleService extends MedusaService({
  CartMetadata,
}) {
  async getByCartId(cartId: string, tenantId: string) {
    const results = await this.listCartMetadatas({
      cart_id: cartId,
      tenant_id: tenantId,
    })

    const list = Array.isArray(results) ? results : [results].filter(Boolean)
    return list.length > 0 ? list[0] : null
  }

  async setGiftWrap(
    cartId: string,
    tenantId: string,
    data: { enabled: boolean; message?: string }
  ) {
    let existing = await this.getByCartId(cartId, tenantId)

    if (existing) {
      await (this as any).updateCartMetadatas({
        id: existing.id,
        gift_wrap: data.enabled,
        gift_message: data.message || null,
      })
      return await this.retrieveCartMetadata(existing.id)
    }

    return await (this as any).createCartMetadatas({
      cart_id: cartId,
      tenant_id: tenantId,
      gift_wrap: data.enabled,
      gift_message: data.message || null,
    })
  }

  async setDeliveryInstructions(
    cartId: string,
    tenantId: string,
    instructions: string
  ) {
    let existing = await this.getByCartId(cartId, tenantId)

    if (existing) {
      await (this as any).updateCartMetadatas({
        id: existing.id,
        delivery_instructions: instructions,
      })
      return await this.retrieveCartMetadata(existing.id)
    }

    return await (this as any).createCartMetadatas({
      cart_id: cartId,
      tenant_id: tenantId,
      delivery_instructions: instructions,
    })
  }

  async calculateCartTotals(cartId: string) {
    const manager = this.manager_
    
    try {
      const cart = await manager.findOne("cart", {
        where: { id: cartId },
        relations: ["items", "items.variant"],
      })

      if (!cart) {
        return null
      }

      const subtotal = (cart.items || []).reduce((sum: number, item: any) => {
        const unitPrice = item.unit_price || 0
        return sum + (unitPrice * item.quantity)
      }, 0)

      const cartMeta = await this.getByCartId(cartId, "")
      const giftWrapCost = cartMeta?.gift_wrap ? 500 : 0

      const tax = Math.round(subtotal * 0.1)
      const total = subtotal + tax + giftWrapCost

      return {
        cartId,
        subtotal,
        tax,
        giftWrapCost,
        total,
        itemCount: (cart.items || []).length,
      }
    } catch (error) {
      return null
    }
  }

  async applyBulkDiscount(cartId: string) {
    const manager = this.manager_

    try {
      const cart = await manager.findOne("cart", {
        where: { id: cartId },
        relations: ["items"],
      })

      if (!cart || !cart.items || cart.items.length === 0) {
        return null
      }

      const itemCount = cart.items.length
      let discountPercentage = 0

      if (itemCount >= 10) {
        discountPercentage = 15
      } else if (itemCount >= 5) {
        discountPercentage = 10
      } else if (itemCount >= 3) {
        discountPercentage = 5
      }

      if (discountPercentage === 0) {
        return {
          cartId,
          itemCount,
          discountApplied: false,
          discountPercentage: 0,
          discountAmount: 0,
        }
      }

      const subtotal = (cart.items || []).reduce((sum: number, item: any) => {
        return sum + ((item.unit_price || 0) * item.quantity)
      }, 0)

      const discountAmount = Math.round(subtotal * (discountPercentage / 100))

      return {
        cartId,
        itemCount,
        discountApplied: true,
        discountPercentage,
        discountAmount,
        appliedRule: `bulk_${itemCount}_items`,
      }
    } catch (error) {
      return null
    }
  }

  async validateCartItems(cartId: string) {
    const manager = this.manager_

    try {
      const cart = await manager.findOne("cart", {
        where: { id: cartId },
        relations: ["items", "items.product"],
      })

      if (!cart || !cart.items) {
        return {
          valid: false,
          itemCount: 0,
          errors: ["Cart not found or has no items"],
        }
      }

      const errors: string[] = []
      const warnings: string[] = []

      (cart.items || []).forEach((item: any, index: number) => {
        if (!item.quantity || item.quantity <= 0) {
          errors.push(`Item ${index + 1}: Invalid quantity`)
        }
        if (!item.unit_price || item.unit_price <= 0) {
          errors.push(`Item ${index + 1}: Invalid price`)
        }
        if (!item.product_id) {
          errors.push(`Item ${index + 1}: Missing product reference`)
        }
      })

      return {
        valid: errors.length === 0,
        itemCount: cart.items.length,
        errors,
        warnings,
        validated: true,
      }
    } catch (error) {
      return {
        valid: false,
        itemCount: 0,
        errors: ["Failed to validate cart items"],
      }
    }
  }

  async getCartWithExtensions(cartId: string) {
    const manager = this.manager_

    try {
      const cart = await manager.findOne("cart", {
        where: { id: cartId },
        relations: ["items", "items.product"],
      })

      if (!cart) {
        return null
      }

      const metadata = await this.getByCartId(cartId, "")
      const totals = await this.calculateCartTotals(cartId)
      const discount = await this.applyBulkDiscount(cartId)

      return {
        id: cart.id,
        items: (cart.items || []).map((item: any) => ({
          id: item.id,
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          title: item.title,
        })),
        extensions: {
          giftWrap: metadata?.gift_wrap || false,
          giftMessage: metadata?.gift_message || null,
          deliveryInstructions: metadata?.delivery_instructions || null,
          preferredDeliveryDate: metadata?.preferred_delivery_date || null,
          specialHandling: metadata?.special_handling || null,
          sourceChannel: metadata?.source_channel || null,
        },
        pricing: totals || {},
        discount: discount || {},
        metadata: metadata?.metadata || {},
      }
    } catch (error) {
      return null
    }
  }

  async mergeGuestCart(guestCartId: string, customerCartId: string) {
    const manager = this.manager_

    try {
      const [guestCart, customerCart] = await Promise.all([
        manager.findOne("cart", {
          where: { id: guestCartId },
          relations: ["items"],
        }),
        manager.findOne("cart", {
          where: { id: customerCartId },
          relations: ["items"],
        }),
      ])

      if (!guestCart || !customerCart) {
        return null
      }

      const guestItems = guestCart.items || []
      const customerItems = customerCart.items || []

      const mergedItems = [...customerItems]
      const existingProductIds = new Set(customerItems.map((i: any) => i.product_id))

      guestItems.forEach((guestItem: any) => {
        if (existingProductIds.has(guestItem.product_id)) {
          const existing = mergedItems.find((i: any) => i.product_id === guestItem.product_id)
          if (existing) {
            existing.quantity += guestItem.quantity
          }
        } else {
          mergedItems.push({
            ...guestItem,
            id: undefined,
          })
        }
      })

      const guestMeta = await this.getByCartId(guestCartId, "")

      if (guestMeta) {
        await this.setGiftWrap(customerCartId, "", {
          enabled: guestMeta.gift_wrap,
          message: guestMeta.gift_message,
        })
        
        if (guestMeta.delivery_instructions) {
          await this.setDeliveryInstructions(
            customerCartId,
            "",
            guestMeta.delivery_instructions
          )
        }
      }

      return {
        sourceGuestCartId: guestCartId,
        targetCustomerCartId: customerCartId,
        itemsMerged: guestItems.length,
        totalItems: mergedItems.length,
        duplicatesHandled: customerItems.length > 0 ? guestItems.length - (mergedItems.length - customerItems.length) : 0,
        extensionsMigrated: !!guestMeta,
      }
    } catch (error) {
      return null
    }
  }
}

export default CartExtensionModuleService
