// @ts-nocheck
import { ExecArgs } from "@medusajs/framework/types"
import { createLogger } from "../lib/logger"
const logger = createLogger("scripts:test-seed")
export default async function testSeed({ container }: ExecArgs) {
  const ds = container.resolve("__pg_connection__")
  logger.info("Type: " + typeof ds)
  logger.info("Methods: " + Object.keys(ds).slice(0, 20).join(", "))
  logger.info("Has query: " + typeof ds.query)
  logger.info("Has raw: " + typeof ds.raw)
  logger.info("Has execute: " + typeof ds.execute)
  
  try { const r = await ds.raw("SELECT 1 as test"); logger.info("raw() works: " + JSON.stringify(r)); } catch(e: any) { logger.info("raw() failed: " + e.message) }
  try { const r = await ds.query("SELECT 1 as test"); logger.info("query() works: " + JSON.stringify(r)); } catch(e: any) { logger.info("query() failed: " + e.message) }
  try { const r = await ds.execute("SELECT 1 as test"); logger.info("execute() works: " + JSON.stringify(r)); } catch(e: any) { logger.info("execute() failed: " + e.message) }
}
