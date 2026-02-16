// @ts-nocheck
import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

const REPLIT_SIDECAR_ENDPOINT = "http://127.0.0.1:1106"

const IMAGE_CATALOG: Record<string, string[]> = {
  electronics: [
    "1526738549149-8e07eca6c147",
    "1523275335684-37898b6baf30",
    "1505740420928-5e560c06d30e",
    "1610945265064-0e34e5519bbf",
    "1498049794561-7780e7231661",
    "1461896836934-ffe607ba8211",
    "1519389950473-47ba0277781c",
    "1514228742587-6b1558fcca3d",
  ],
  fashion: [
    "1445205170230-053b83016050",
    "1556821840-3a63f95609a7",
    "1521572163474-6864f9cf17ab",
    "1515562141207-7a88fb7ce338",
    "1552674605-db6ffd4facb5",
    "1514228742587-6b1558fcca3d",
    "1556742049-0cfed4f6a45d",
  ],
  food: [
    "1504674900247-0877df9cc836",
    "1473093295043-cdd812d0e601",
    "1447933601403-0c6688de566e",
    "1589656966895-2f33e7653819",
    "1509042239860-f550ce710b93",
    "1555041469-a586c61ea9bc",
  ],
  grocery: [
    "1542838132-92c53300491e",
    "1556228578-8c89e6adf883",
    "1602143407151-7111542de6e8",
    "1506484381186-d0bd208751a7",
    "1543168256-418811576931",
    "1550989460-0adf9ea622e2",
  ],
  home: [
    "1560448204-e02f11c3d0e2",
    "1581578731548-c64695cc6952",
    "1599643478518-a784e5dc4c8f",
    "1618221195710-dd6b41faaea6",
    "1556909114-f6e7ad7d3136",
    "1555041469-a586c61ea9bc",
  ],
  beauty: [
    "1588405748880-12d1d2a59f75",
    "1587017539504-67cfbddac569",
    "1596462502278-27bfdc403348",
    "1571781926291-c477ebfd024b",
    "1522335789203-aabd1fc54bc9",
    "1512496015851-a90fb38ba796",
  ],
  automotive: [
    "1503376780353-7e6692767b70",
    "1492144534655-ae79c964c9d7",
    "1494976388531-d1058494cdd8",
    "1489824904134-891ab64532f1",
    "1580273916550-e323b7adbe07",
    "1449130320544-cf37a3432f44",
  ],
  healthcare: [
    "1519494026892-80bbd2d6fd0d",
    "1576091160399-112ba8d25d1d",
    "1530026405186-ed1f139313f8",
    "1551601651-bc60f254d532",
    "1579684385127-1ef15d508118",
    "1538108149393-fbbd81895907",
  ],
  fitness: [
    "1544816155-12df9643f363",
    "1608248543803-ba4f8c70ae0b",
    "1571019613454-1cb2f99b2d8b",
    "1518611012118-696072aa579a",
    "1574680096145-d05b13162c63",
    "1534438327276-14e5300c3a48",
  ],
  education: [
    "1519389950473-47ba0277781c",
    "1490481651871-ab68de25d43d",
    "1503454537195-1dcabb73ffb9",
    "1515488042361-ee00e0ddd4e4",
    "1497633762265-9d179a990aa6",
    "1524178232363-1fb2b075b655",
  ],
  real_estate: [
    "1486406146926-c627a92ad1ab",
    "1497366216548-37526070297c",
    "1560185127-6ed189bf02f4",
    "1560518883-ce09059eeffa",
    "1545324418-cc1a3fa10c00",
    "1512917774080-9991f1c4c750",
  ],
  travel: [
    "1486406146926-c627a92ad1ab",
    "1466442929976-97f336a657be",
    "1539037116277-4db20889f2d4",
    "1506929562872-bb421503ef21",
    "1520250497591-112f2f40a3f4",
    "1469854523086-cc02fe5d8800",
  ],
  restaurant: [
    "1517248135467-4c7edcad34c4",
    "1555041469-a586c61ea9bc",
    "1504674900247-0877df9cc836",
    "1473093295043-cdd812d0e601",
    "1414235077428-338989a2e8c0",
    "1552566626-98f62a8a0a33",
  ],
  pets: [
    "1494976388531-d1058494cdd8",
    "1587300003388-59208cc962cb",
    "1548199973-03cce0bbc87b",
    "1450778869180-41d0601e0e68",
    "1583511655826-05700d52f4d9",
    "1415369629372-26f2fe60c467",
  ],
  freelance: [
    "1497366216548-37526070297c",
    "1519389950473-47ba0277781c",
    "1498049794561-7780e7231661",
    "1522071820081-009f0129c71c",
    "1497215842964-222b430dc094",
    "1517502884422-41eaead166d4",
  ],
  digital: [
    "1519389950473-47ba0277781c",
    "1526738549149-8e07eca6c147",
    "1498049794561-7780e7231661",
    "1490481651871-ab68de25d43d",
    "1461896836934-ffe607ba8211",
    "1504384308090-c894fdcc538d",
  ],
}

let _storage: any = null

function getStorage() {
  if (_storage) return _storage
  const { Storage } = require("@google-cloud/storage")
  _storage = new Storage({
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
  return _storage
}

async function downloadImage(unsplashId: string, width: number): Promise<Buffer | null> {
  try {
    const url = `https://images.unsplash.com/photo-${unsplashId}?w=${width}&q=80&fit=crop`
    const res = await fetch(url)
    if (!res.ok) return null
    return Buffer.from(await res.arrayBuffer())
  } catch {
    return null
  }
}

async function uploadToBucket(bucketName: string, path: string, buf: Buffer): Promise<boolean> {
  try {
    const storage = getStorage()
    const bucket = storage.bucket(bucketName)
    const file = bucket.file(path)
    await file.save(buf, { contentType: "image/jpeg", resumable: false })
    return true
  } catch (e: any) {
    return false
  }
}

export default async function uploadMedia({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const bucketName = process.env.DEFAULT_OBJECT_STORAGE_BUCKET_ID

  logger.info("╔══════════════════════════════════════════════════════════════╗")
  logger.info("║     DAKKAH CITYOS — MEDIA UPLOAD TO CLOUD STORAGE          ║")
  logger.info("╚══════════════════════════════════════════════════════════════╝")

  if (!bucketName) {
    logger.error("DEFAULT_OBJECT_STORAGE_BUCKET_ID not set")
    return
  }

  const storage = getStorage()
  try {
    const testFile = storage.bucket(bucketName).file("_health_check.txt")
    await testFile.save(Buffer.from("ok"), { contentType: "text/plain", resumable: false })
    logger.info(`✓ Bucket verified: ${bucketName}`)
  } catch (e: any) {
    logger.error(`Bucket not accessible: ${e.message}`)
    return
  }

  const categories = Object.keys(IMAGE_CATALOG)
  let totalUploaded = 0
  let totalFailed = 0
  const CONCURRENCY = 10

  const allTasks: Array<{ unsplashId: string; path: string; width: number; category: string }> = []
  for (const category of categories) {
    const ids = IMAGE_CATALOG[category]
    for (let i = 0; i < Math.min(ids.length, 4); i++) {
      allTasks.push({
        unsplashId: ids[i],
        path: `media/products/${category}/${category}-${i}.jpg`,
        width: 800,
        category,
      })
      allTasks.push({
        unsplashId: ids[i],
        path: `media/products/${category}/${category}-${i}-thumb.jpg`,
        width: 400,
        category,
      })
    }
  }

  logger.info(`  Total tasks: ${allTasks.length} images across ${categories.length} categories`)

  for (let i = 0; i < allTasks.length; i += CONCURRENCY) {
    const batch = allTasks.slice(i, i + CONCURRENCY)
    const results = await Promise.allSettled(
      batch.map(async (t) => {
        const buf = await downloadImage(t.unsplashId, t.width)
        if (!buf) throw new Error("download failed")
        const ok = await uploadToBucket(bucketName, t.path, buf)
        if (!ok) throw new Error("upload failed")
      })
    )
    for (const r of results) {
      if (r.status === "fulfilled") totalUploaded++
      else totalFailed++
    }
    if ((i + CONCURRENCY) % 20 === 0 || i + CONCURRENCY >= allTasks.length) {
      logger.info(`  Progress: ${Math.min(i + CONCURRENCY, allTasks.length)}/${allTasks.length} (${totalUploaded} ok, ${totalFailed} failed)`)
    }
  }

  logger.info(`\n✅ Media upload complete: ${totalUploaded} uploaded, ${totalFailed} failed across ${categories.length} categories`)
}
