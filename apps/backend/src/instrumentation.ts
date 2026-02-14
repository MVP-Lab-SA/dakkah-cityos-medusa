import { initGracefulShutdown } from "./lib/middleware/graceful-shutdown"

initGracefulShutdown()

const startupLog = {
  timestamp: new Date().toISOString(),
  level: "info",
  message: "CityOS Commerce Platform — graceful shutdown handlers registered",
  type: "lifecycle",
  pid: process.pid,
}

if (process.env.NODE_ENV === "production") {
  console.log(JSON.stringify(startupLog))
} else {
  console.log(`${startupLog.timestamp} INFO ${startupLog.message}`)
}
