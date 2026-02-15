// @ts-nocheck
import { ExecArgs } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { createLogger } from "../lib/logger"
const logger = createLogger("scripts:update-product-images")

const productImageData: Record<string, { thumbnail: string; images: { url: string }[] }> = {
  "samsung-galaxy-s24": {
    thumbnail: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&q=80",
    images: [
      { url: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=1200&q=80" },
      { url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&q=80" },
      { url: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=1200&q=80" },
      { url: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=1200&q=80" },
    ],
  },
  "classic-white-thobe": {
    thumbnail: "https://images.unsplash.com/photo-1589656966895-2f33e7653819?w=800&q=80",
    images: [
      { url: "https://images.unsplash.com/photo-1589656966895-2f33e7653819?w=1200&q=80" },
      { url: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&q=80" },
      { url: "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=1200&q=80" },
    ],
  },
  "ajwa-dates-premium": {
    thumbnail: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800&q=80",
    images: [
      { url: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=1200&q=80" },
      { url: "https://images.unsplash.com/photo-1597714026720-8f74c62310ba?w=1200&q=80" },
      { url: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=1200&q=80" },
    ],
  },
  "home-cleaning-service": {
    thumbnail: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80",
    images: [
      { url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&q=80" },
      { url: "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=1200&q=80" },
      { url: "https://images.unsplash.com/photo-1527515545081-5db817172677?w=1200&q=80" },
    ],
  },
  "al-olaya-office-space": {
    thumbnail: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
    images: [
      { url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80" },
      { url: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&q=80" },
      { url: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&q=80" },
      { url: "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=1200&q=80" },
    ],
  },
  "premium-oud-oil": {
    thumbnail: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&q=80",
    images: [
      { url: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=1200&q=80" },
      { url: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=1200&q=80" },
      { url: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=1200&q=80" },
    ],
  },
  "saudi-khawlani-coffee": {
    thumbnail: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&q=80",
    images: [
      { url: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1200&q=80" },
      { url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefda?w=1200&q=80" },
      { url: "https://images.unsplash.com/photo-1504630083234-14187a9df0f5?w=1200&q=80" },
      { url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&q=80" },
    ],
  },
}

export default async function updateProductImages({ container }: ExecArgs) {
  const productModuleService = container.resolve(Modules.PRODUCT)

  logger.info("========================================")
  logger.info("Updating Product Images")
  logger.info("========================================\n")

  const handles = Object.keys(productImageData)
  let updatedCount = 0

  for (const handle of handles) {
    try {
      const products = await productModuleService.listProducts({ handle })

      if (!products || products.length === 0) {
        logger.info(`  Product not found: ${handle}`)
        continue
      }

      const product = products[0]
      const imageInfo = productImageData[handle]

      await productModuleService.updateProducts(product.id, {
        thumbnail: imageInfo.thumbnail,
        images: imageInfo.images,
      })

      updatedCount++
      logger.info(`  Updated: ${product.title} (${handle}) - ${imageInfo.images.length} images`)
    } catch (error: any) {
      logger.error(`  Error updating ${handle}: ${error.message}`)
    }
  }

  logger.info(`\n========================================`)
  logger.info(`Updated ${updatedCount}/${handles.length} products with images`)
  logger.info(`========================================`)
}
