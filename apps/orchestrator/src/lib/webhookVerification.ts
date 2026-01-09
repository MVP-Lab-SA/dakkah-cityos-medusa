import crypto from 'crypto'

export interface WebhookVerificationOptions {
  secret: string
  signatureHeader: string
  payload: string
  timestamp?: string
  tolerance?: number // seconds
}

/**
 * Verify HMAC SHA-256 webhook signature
 */
export function verifyWebhookSignature(options: WebhookVerificationOptions): boolean {
  const { secret, signatureHeader, payload, timestamp, tolerance = 300 } = options
  
  try {
    // Parse signature header (format: t=timestamp,v1=signature)
    const parts = signatureHeader.split(',')
    const signatureMap: Record<string, string> = {}
    
    for (const part of parts) {
      const [key, value] = part.split('=')
      if (key && value) {
        signatureMap[key] = value
      }
    }
    
    const receivedSignature = signatureMap.v1
    const receivedTimestamp = signatureMap.t || timestamp
    
    if (!receivedSignature) {
      return false
    }
    
    // Check timestamp tolerance if provided
    if (receivedTimestamp && tolerance > 0) {
      const now = Math.floor(Date.now() / 1000)
      const diff = Math.abs(now - parseInt(receivedTimestamp))
      
      if (diff > tolerance) {
        console.warn(`Webhook timestamp out of tolerance: ${diff}s`)
        return false
      }
    }
    
    // Compute expected signature
    const signedPayload = receivedTimestamp 
      ? `${receivedTimestamp}.${payload}`
      : payload
    
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(signedPayload)
      .digest('hex')
    
    // Constant-time comparison
    return crypto.timingSafeEqual(
      Buffer.from(receivedSignature),
      Buffer.from(expectedSignature)
    )
  } catch (error) {
    console.error('Webhook verification error:', error)
    return false
  }
}

/**
 * Generate webhook signature for outbound webhooks
 */
export function generateWebhookSignature(payload: string, secret: string): string {
  const timestamp = Math.floor(Date.now() / 1000)
  const signedPayload = `${timestamp}.${payload}`
  
  const signature = crypto
    .createHmac('sha256', secret)
    .update(signedPayload)
    .digest('hex')
  
  return `t=${timestamp},v1=${signature}`
}

/**
 * Generate unique request ID for tracing
 */
export function generateRequestId(): string {
  return `req_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`
}

/**
 * Calculate payload hash for deduplication
 */
export function calculatePayloadHash(payload: any): string {
  const normalized = JSON.stringify(payload, Object.keys(payload).sort())
  return crypto.createHash('sha256').update(normalized).digest('hex')
}
