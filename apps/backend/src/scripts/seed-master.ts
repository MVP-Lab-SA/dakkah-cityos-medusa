// @ts-nocheck
import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export default async function seedMaster(args: ExecArgs) {
  const logger = args.container.resolve(ContainerRegistrationKeys.LOGGER)

  logger.info("╔══════════════════════════════════════════════════════════════╗")
  logger.info("║     DAKKAH CITYOS — MASTER SEED                            ║")
  logger.info("╚══════════════════════════════════════════════════════════════╝")

  const startTime = Date.now()

  logger.info("\n━━━ PHASE 1: CORE INFRASTRUCTURE ━━━")
  const seedCore = require("./seed-core").default
  const ctx = await seedCore(args)

  logger.info("\n━━━ PHASE 2: PRODUCT CATALOG ━━━")
  const seedCatalog = require("./seed-catalog").default
  await seedCatalog(args, ctx)

  logger.info("\n━━━ PHASE 3: COMMERCE ENTITIES ━━━")
  const seedCommerce = require("./seed-commerce").default
  await seedCommerce(args, ctx)

  logger.info("\n━━━ PHASE 4: CITYOS PLATFORM ━━━")
  const seedPlatform = require("./seed-platform").default
  await seedPlatform(args, ctx)

  logger.info("\n━━━ PHASE 5: VERTICAL MODULES ━━━")
  const seedVerticals = require("./seed-verticals").default
  await seedVerticals(args, ctx)

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)
  logger.info(`\n✅ Master seed completed in ${elapsed}s`)
}
