// @ts-nocheck
import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

const PRODUCTS_TO_FIX = [
  {
    id: "prod_01KHB8GKFC9MF354HK7CVVCES6",
    handle: "premium-saudi-bisht",
    unsplashId: "1594938298603-c8148c4dae35",
  },
  {
    id: "prod_01KHB8GKFG5H50W6FWZG00EAE4",
    handle: "mens-premium-linen-suit",
    unsplashId: "1617137968427-85924c800a22",
  },
  {
    id: "prod_01KHB8GKWTCW7FAYF08RPKJ2B9",
    handle: "arabian-brass-lamp",
    unsplashId: "1586023492125-27b2c045efd7",
  },
  {
    id: "prod_01KHB8GNYMTD4J9FCYZQV8Q869",
    handle: "outdoor-arabian-tent",
    unsplashId: "1586023492125-27b2c045efd7",
  },
  {
    id: "prod_01KHB8GNYQF4NB88XQZ7M68YCD",
    handle: "pet-falcon-accessories-kit",
    unsplashId: "1517649763962-0c623066013b",
  },
  {
    id: "prod_01KHB8GP6AFFHP3692RGV7G6JZ",
    handle: "premium-office-chair-ergonomic",
    unsplashId: "1586023492125-27b2c045efd7",
  },
  {
    id: "prod_01KHB8GP6BWSB8F3X3P69T475M",
    handle: "restaurant-dining-voucher",
    unsplashId: "1563729784474-d77dbb933a9e",
  },
  {
    id: "prod_01KHB8GKFFWSPM0QMG57WAX18X",
    handle: "designer-abaya-collection",
    unsplashId: "1490114538077-0a7f8cb49891",
  },
]

function getGcsStorage() {
  const { Storage } = require("@google-cloud/storage")
  const REPLIT_SIDECAR_ENDPOINT = "http://127.0.0.1:1106"
  return new Storage({
    credentials: {
      audience: "replit",
      subject_token_type: "access_token",
      token_url: `${REPLIT_SIDECAR_ENDPOINT}/token`,
      type: "external_account",
      credential_source: {
        url: `${REPLIT_SIDECAR_ENDPOINT}/credential`,
        format: { type: "json", subject_token_field_name: "access_token" },
      },
      universe_domain: "googleapis.com",
    },
    projectId: "",
  })
}

async function downloadImage(unsplashId: string, width: number): Promise<Buffer | null> {
  try {
    const url = `https://images.unsplash.com/photo-${unsplashId}?w=${width}&q=80&fit=crop`
    const response = await fetch(url)
    if (!response.ok) return null
    const arrayBuffer = await response.arrayBuffer()
    return Buffer.from(arrayBuffer)
  } catch (e) {
    return null
  }
}

async function uploadToGcs(storage: any, bucketName: string, buffer: Buffer, path: string): Promise<boolean> {
  try {
    const bucket = storage.bucket(bucketName)
    const file = bucket.file(path)
    await file.save(buffer, { contentType: "image/jpeg", resumable: false })
    return true
  } catch (e: any) {
    console.error(`Upload failed for ${path}: ${e.message}`)
    return false
  }
}

export default async function fixRemainingThumbnails({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const pgConnection = container.resolve(ContainerRegistrationKeys.PG_CONNECTION)

  logger.info("=== Fix Remaining Thumbnails: Upload to Bucket & Update DB ===")

  const storage = getGcsStorage()
  const bucketName = process.env.DEFAULT_OBJECT_STORAGE_BUCKET_ID
  if (!bucketName) {
    logger.error("DEFAULT_OBJECT_STORAGE_BUCKET_ID not set")
    return
  }

  let thumbsUpdated = 0
  let imagesUpdated = 0

  for (const product of PRODUCTS_TO_FIX) {
    logger.info(`Processing: ${product.handle} (${product.id})`)

    const fullBuffer = await downloadImage(product.unsplashId, 800)
    const thumbBuffer = await downloadImage(product.unsplashId, 400)

    if (!fullBuffer || !thumbBuffer) {
      logger.error(`  Failed to download images for ${product.handle}`)
      continue
    }

    const fullPath = `media/products/misc/${product.handle}.jpg`
    const thumbPath = `media/products/misc/${product.handle}-thumb.jpg`

    const fullOk = await uploadToGcs(storage, bucketName, fullBuffer, fullPath)
    const thumbOk = await uploadToGcs(storage, bucketName, thumbBuffer, thumbPath)

    if (!fullOk || !thumbOk) {
      logger.error(`  Failed to upload images for ${product.handle}`)
      continue
    }

    const thumbUrl = `/platform/storage/serve?path=${encodeURIComponent(thumbPath)}`
    const fullUrl = `/platform/storage/serve?path=${encodeURIComponent(fullPath)}`

    await pgConnection.raw(
      `UPDATE product SET thumbnail = ? WHERE id = ?`,
      [thumbUrl, product.id]
    )
    thumbsUpdated++
    logger.info(`  Thumbnail updated`)

    const imageRows = await pgConnection.raw(
      `SELECT id FROM image WHERE product_id = ? AND url LIKE '%unsplash%'`,
      [product.id]
    )
    const imgs = imageRows.rows || imageRows
    for (const img of imgs) {
      await pgConnection.raw(
        `UPDATE image SET url = ? WHERE id = ?`,
        [fullUrl, img.id]
      )
      imagesUpdated++
    }
    logger.info(`  Updated ${imgs.length} image records`)
  }

  logger.info(`=== Complete: ${thumbsUpdated} thumbnails, ${imagesUpdated} images updated ===`)

  const remaining = await pgConnection.raw(
    `SELECT id, title, thumbnail FROM product WHERE thumbnail LIKE '%unsplash%'`
  )
  const remainingRows = remaining.rows || remaining
  logger.info(`Remaining products with Unsplash thumbnails: ${remainingRows.length}`)
  if (remainingRows.length > 0) {
    for (const r of remainingRows) {
      logger.info(`  - ${r.title}: ${r.thumbnail}`)
    }
  }
}
