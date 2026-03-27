/**
 * Production entry for TanStack Start (Nitro). `vite preview` expects `dist/` and
 * does not serve `.output/server/` builds.
 */
import http from "node:http"
import { listener } from "./.output/server/index.mjs"

const port = Number(process.env.PORT || 8000)
const host = process.env.HOST || "0.0.0.0"

http.createServer(listener).listen(port, host, () => {
  console.error(`storefront listening on http://${host}:${port}`)
})
