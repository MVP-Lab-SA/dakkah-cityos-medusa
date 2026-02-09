// @ts-nocheck
import { ExecArgs } from "@medusajs/framework/types"
export default async function testSeed({ container }: ExecArgs) {
  const ds = container.resolve("__pg_connection__")
  console.log("Type:", typeof ds)
  console.log("Methods:", Object.keys(ds).slice(0, 20))
  console.log("Has query:", typeof ds.query)
  console.log("Has raw:", typeof ds.raw)
  console.log("Has execute:", typeof ds.execute)
  
  // Try different methods
  try { const r = await ds.raw("SELECT 1 as test"); console.log("raw() works:", r); } catch(e) { console.log("raw() failed:", e.message) }
  try { const r = await ds.query("SELECT 1 as test"); console.log("query() works:", r); } catch(e) { console.log("query() failed:", e.message) }
  try { const r = await ds.execute("SELECT 1 as test"); console.log("execute() works:", r); } catch(e) { console.log("execute() failed:", e.message) }
}
