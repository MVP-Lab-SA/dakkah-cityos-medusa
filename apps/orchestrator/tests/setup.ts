// Test setup file
import { beforeAll, afterAll, afterEach } from 'vitest'

// Mock environment variables for tests
beforeAll(() => {
  process.env.MEDUSA_BACKEND_URL = 'http://localhost:9000'
  process.env.ORCHESTRATOR_URL = 'http://localhost:3001'
  process.env.PAYLOAD_SECRET = 'test-secret'
})

afterEach(() => {
  // Clear any mocks after each test
})

afterAll(() => {
  // Cleanup after all tests
})
