// @ts-nocheck
import { ExecArgs } from "@medusajs/framework/types"
import { createLogger } from "../lib/logger"
const logger = createLogger("scripts:test-seed")
export default async function testSeed({ container }: ExecArgs) {
  const ds = container.resolve("__pg_connection__")
  logger.info(String("Type:", typeof ds))
  logger.info(String("Methods:", Object.keys(ds)).slice(0, 20))
  logger.info(String("Has query:", typeof ds.query))
  logger.info(String("Has raw:", typeof ds.raw))
  logger.info(String("Has execute:", typeof ds.execute))
  
  // Try different methods
  try { const r = await ds.raw("SELECT 1 as test"); logger.info(String("raw()) works:", r); } catch(e) { logger.info(String("raw()) failed:", e.message) }
  try { const r = await ds.query("SELECT 1 as test"); logger.info(String("query()) works:", r); } catch(e) { logger.info(String("query()) failed:", e.message) }
  try { const r = await ds.execute("SELECT 1 as test"); logger.info(String("execute()) works:", r); } catch(e) { logger.info(String("execute()) failed:", e.message) }
}
