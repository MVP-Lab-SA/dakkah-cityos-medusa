// @ts-nocheck
import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import seedCore from "./seed-core.js"
import seedCatalog from "./seed-catalog.js"
import seedCommerce from "./seed-commerce.js"
import seedPlatform from "./seed-platform.js"
import seedVerticals from "./seed-verticals.js"

export default async function seedMaster(args: ExecArgs) {
  const logger = args.container.resolve(ContainerRegistrationKeys.LOGGER)

  logger.info("╔══════════════════════════════════════════════════════════════╗")
  logger.info("║     DAKKAH CITYOS — MASTER SEED                            ║")
  logger.info("╚══════════════════════════════════════════════════════════════╝")

  const startTime = Date.now()

  logger.info("\n━━━ PHASE 1: CORE INFRASTRUCTURE ━━━")
  const ctx = await seedCore(args)

  logger.info("\n━━━ PHASE 2: PRODUCT CATALOG ━━━")
  await seedCatalog(args, ctx)

  logger.info("\n━━━ PHASE 3: COMMERCE ENTITIES ━━━")
  await seedCommerce(args, ctx)

  logger.info("\n━━━ PHASE 4: CITYOS PLATFORM ━━━")
  await seedPlatform(args, ctx)

  logger.info("\n━━━ PHASE 5: VERTICAL MODULES ━━━")
  await seedVerticals(args, ctx)

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)
  logger.info(`\n✅ Master seed completed in ${elapsed}s`)
}
