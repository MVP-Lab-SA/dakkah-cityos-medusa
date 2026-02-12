// @ts-nocheck
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import crypto from "crypto"

async function handlePaymentIntentSucceeded(data: any, correlationId: string, req: MedusaRequest) {
  const paymentIntent = data
  const orderId = paymentIntent.metadata?.medusa_order_id || paymentIntent.metadata?.orderId
  console.log(`[Webhook:Stripe] payment_intent.succeeded: ${paymentIntent.id}, order: ${orderId || "N/A"}, correlation: ${correlationId}`)

  if (orderId) {
    try {
      const { dispatchEventToTemporal } = await import("../../../lib/event-dispatcher.js")
      await dispatchEventToTemporal("payment.completed", {
        order_id: orderId,
        payment_intent_id: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        tenant_id: paymentIntent.metadata?.tenantId,
      }, {
        tenantId: paymentIntent.metadata?.tenantId,
        correlationId,
        source: "stripe-webhook",
      })
    } catch (err: any) {
      console.error(`[Webhook:Stripe] Error dispatching payment.completed: ${err.message}`)
    }
  }
}

async function handlePaymentIntentFailed(data: any, correlationId: string) {
  const paymentIntent = data
  console.log(`[Webhook:Stripe] payment_intent.failed: ${paymentIntent.id}, correlation: ${correlationId}`)
  console.log(`[Webhook:Stripe] Failure reason: ${paymentIntent.last_payment_error?.message || "Unknown"}`)
}

async function handleChargeRefunded(data: any, correlationId: string) {
  const charge = data
  console.log(`[Webhook:Stripe] charge.refunded: ${charge.id}, amount_refunded: ${charge.amount_refunded}, correlation: ${correlationId}`)
}

async function handleCheckoutSessionCompleted(data: any, correlationId: string) {
  const session = data
  console.log(`[Webhook:Stripe] checkout.session.completed: ${session.id}, payment_status: ${session.payment_status}, correlation: ${correlationId}`)
}

async function handleInvoicePaid(data: any, correlationId: string) {
  const invoice = data
  console.log(`[Webhook:Stripe] invoice.paid: ${invoice.id}, amount_paid: ${invoice.amount_paid}, correlation: ${correlationId}`)
}

async function handleInvoicePaymentFailed(data: any, correlationId: string) {
  const invoice = data
  console.log(`[Webhook:Stripe] invoice.payment_failed: ${invoice.id}, correlation: ${correlationId}`)
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const correlationId = crypto.randomUUID()

  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
    let stripeEvent: any

    if (webhookSecret) {
      const signature = req.headers["stripe-signature"] as string
      if (!signature) {
        console.log(`[Webhook:Stripe] Missing stripe-signature header (correlation: ${correlationId})`)
        return res.status(400).json({ error: "Missing signature" })
      }

      try {
        const Stripe = (await import("stripe")).default
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "")
        const rawBody = typeof req.body === "string" ? req.body : JSON.stringify(req.body)
        stripeEvent = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
      } catch (err: any) {
        console.log(`[Webhook:Stripe] Signature verification failed (correlation: ${correlationId}): ${err.message}`)
        return res.status(400).json({ error: "Invalid signature" })
      }
    } else {
      stripeEvent = {
        type: (req.body as any)?.type || "unknown",
        data: (req.body as any)?.data || {},
      }
    }

    console.log(`[Webhook:Stripe] Received event: ${stripeEvent.type} (correlation: ${correlationId})`)

    const eventData = stripeEvent.data?.object || stripeEvent.data || {}

    switch (stripeEvent.type) {
      case "payment_intent.succeeded":
        await handlePaymentIntentSucceeded(eventData, correlationId, req)
        break
      case "payment_intent.failed":
        await handlePaymentIntentFailed(eventData, correlationId)
        break
      case "charge.refunded":
        await handleChargeRefunded(eventData, correlationId)
        break
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(eventData, correlationId)
        break
      case "invoice.paid":
        await handleInvoicePaid(eventData, correlationId)
        break
      case "invoice.payment_failed":
        await handleInvoicePaymentFailed(eventData, correlationId)
        break
      default:
        console.log(`[Webhook:Stripe] Unhandled event type: ${stripeEvent.type} (correlation: ${correlationId})`)
        break
    }

    return res.status(200).json({ received: true, type: stripeEvent.type, correlation_id: correlationId })
  } catch (error: any) {
    console.error(`[Webhook:Stripe] Error (correlation: ${correlationId}): ${error.message}`)
    return res.status(500).json({ error: "Internal server error" })
  }
}
