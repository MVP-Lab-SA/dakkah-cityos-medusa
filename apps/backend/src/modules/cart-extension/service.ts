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
}

export default CartExtensionModuleService
