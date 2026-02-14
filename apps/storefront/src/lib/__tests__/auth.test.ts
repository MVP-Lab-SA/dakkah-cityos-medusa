import { describe, it, expect, beforeEach, vi } from 'vitest'

const TOKEN_KEY = 'medusa_auth_token'
const SESSION_KEY = 'medusa_session'

function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

function setAuthToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

function removeAuthToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

function isLoggedIn(): boolean {
  return !!getAuthToken()
}

function parseJwtPayload(token: string): Record<string, any> | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const payload = JSON.parse(atob(parts[1]))
    return payload
  } catch {
    return null
  }
}

function isTokenExpired(token: string): boolean {
  const payload = parseJwtPayload(token)
  if (!payload || !payload.exp) return true
  return Date.now() >= payload.exp * 1000
}

function getSessionData(): Record<string, any> | null {
  const raw = sessionStorage.getItem(SESSION_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function setSessionData(data: Record<string, any>): void {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(data))
}

describe('Auth Helpers', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  describe('token management', () => {
    it('returns null when no token stored', () => {
      expect(getAuthToken()).toBeNull()
    })

    it('stores and retrieves auth token', () => {
      setAuthToken('test-token-123')
      expect(getAuthToken()).toBe('test-token-123')
    })

    it('removes auth token', () => {
      setAuthToken('test-token-123')
      removeAuthToken()
      expect(getAuthToken()).toBeNull()
    })
  })

  describe('login state', () => {
    it('returns false when not logged in', () => {
      expect(isLoggedIn()).toBe(false)
    })

    it('returns true when token exists', () => {
      setAuthToken('some-token')
      expect(isLoggedIn()).toBe(true)
    })
  })

  describe('JWT parsing', () => {
    it('parses a valid JWT payload', () => {
      const payload = { sub: 'user_123', email: 'test@example.com', exp: 9999999999 }
      const encoded = btoa(JSON.stringify(payload))
      const token = `header.${encoded}.signature`
      const parsed = parseJwtPayload(token)
      expect(parsed).toEqual(payload)
    })

    it('returns null for invalid token format', () => {
      expect(parseJwtPayload('not-a-jwt')).toBeNull()
    })

    it('returns null for malformed base64', () => {
      expect(parseJwtPayload('a.!!!.c')).toBeNull()
    })
  })

  describe('token expiration', () => {
    it('returns true for expired token', () => {
      const payload = { sub: 'user_1', exp: Math.floor(Date.now() / 1000) - 3600 }
      const token = `h.${btoa(JSON.stringify(payload))}.s`
      expect(isTokenExpired(token)).toBe(true)
    })

    it('returns false for non-expired token', () => {
      const payload = { sub: 'user_1', exp: Math.floor(Date.now() / 1000) + 3600 }
      const token = `h.${btoa(JSON.stringify(payload))}.s`
      expect(isTokenExpired(token)).toBe(false)
    })
  })

  describe('session data', () => {
    it('returns null when no session data', () => {
      expect(getSessionData()).toBeNull()
    })

    it('stores and retrieves session data', () => {
      const data = { userId: 'usr_1', cart_id: 'cart_1' }
      setSessionData(data)
      expect(getSessionData()).toEqual(data)
    })
  })
})
