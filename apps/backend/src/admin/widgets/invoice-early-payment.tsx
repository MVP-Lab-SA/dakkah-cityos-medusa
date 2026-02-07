import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Button, Badge } from "@medusajs/ui"
import { CurrencyDollar, Clock, CheckCircle } from "@medusajs/icons"
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"

interface EarlyPaymentData {
  invoice_id: string
  original_amount: number
  currency_code: string
  payment_term: {
    code: string
    net_days: number
    discount_percent: number
    discount_days: number
  }
  invoice_date: string
  discount_deadline: string
  due_date: string
  days_remaining_for_discount: number
  is_discount_available: boolean
  discount_amount: number
  discounted_total: number
  savings_message: string
}

const InvoiceEarlyPaymentWidget = () => {
  const { id } = useParams<{ id: string }>()
  const [data, setData] = useState<EarlyPaymentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [applied, setApplied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      fetchEarlyPaymentData()
    }
  }, [id])

  const fetchEarlyPaymentData = async () => {
    try {
      const response = await fetch(`/admin/invoices/${id}/early-payment`, {
        credentials: "include"
      })
      
      if (response.ok) {
        const result = await response.json()
        setData(result.early_payment)
      } else {
        const err = await response.json()
        setError(err.error || "Failed to fetch early payment data")
      }
    } catch (error) {
      setError("Failed to fetch early payment data")
    } finally {
      setLoading(false)
    }
  }

  const applyDiscount = async () => {
    if (!id) return
    
    setApplying(true)
    try {
      const response = await fetch(`/admin/invoices/${id}/early-payment`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apply_discount: true })
      })

      if (response.ok) {
        setApplied(true)
        fetchEarlyPaymentData()
      }
    } catch (error) {
      console.error("Failed to apply discount:", error)
    } finally {
      setApplying(false)
    }
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency?.toUpperCase() || 'USD'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <Container className="p-4">
        <div className="animate-pulse space-y-3">
          <div className="h-5 bg-ui-bg-subtle rounded w-1/2"></div>
          <div className="h-16 bg-ui-bg-subtle rounded"></div>
        </div>
      </Container>
    )
  }

  if (error) {
    return (
      <Container className="p-4">
        <Text className="text-ui-fg-subtle text-sm">{error}</Text>
      </Container>
    )
  }

  if (!data) return null

  return (
    <Container className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <CurrencyDollar className="text-ui-fg-subtle" />
        <Heading level="h2" className="text-lg font-semibold">
          Early Payment Discount
        </Heading>
      </div>

      {/* Payment Terms Display */}
      <div className="bg-ui-bg-subtle rounded-lg p-4 mb-4">
        <div className="flex justify-between items-center mb-3">
          <Text className="text-sm text-ui-fg-subtle">Payment Terms</Text>
          <Badge color="blue">{data.payment_term.code}</Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <Text className="text-ui-fg-subtle">Due Date</Text>
            <Text className="font-medium">{formatDate(data.due_date)}</Text>
          </div>
          <div>
            <Text className="text-ui-fg-subtle">Original Amount</Text>
            <Text className="font-medium">
              {formatCurrency(data.original_amount, data.currency_code)}
            </Text>
          </div>
        </div>
      </div>

      {/* Early Payment Offer */}
      {data.payment_term.discount_percent > 0 && (
        <div className={`rounded-lg p-4 border-2 ${
          data.is_discount_available 
            ? "bg-green-50 border-green-200" 
            : "bg-ui-bg-subtle border-ui-border-base"
        }`}>
          {data.is_discount_available ? (
            <>
              <div className="flex items-center gap-2 mb-3">
                <Clock className="text-green-600" />
                <Text className="font-semibold text-green-700">
                  Early Payment Discount Available
                </Text>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <Text className="text-sm">Discount ({data.payment_term.discount_percent}%)</Text>
                  <Text className="text-sm font-medium text-green-600">
                    -{formatCurrency(data.discount_amount, data.currency_code)}
                  </Text>
                </div>
                <div className="flex justify-between">
                  <Text className="text-sm font-semibold">Pay Now Price</Text>
                  <Text className="font-bold text-lg text-green-700">
                    {formatCurrency(data.discounted_total, data.currency_code)}
                  </Text>
                </div>
              </div>

              <div className="flex items-center justify-between bg-white rounded p-2 mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-500" />
                  <Text className="text-sm">
                    <span className="font-bold">{data.days_remaining_for_discount}</span> days remaining
                  </Text>
                </div>
                <Text className="text-xs text-ui-fg-subtle">
                  Expires {formatDate(data.discount_deadline)}
                </Text>
              </div>

              {!applied ? (
                <Button
                  variant="primary"
                  size="small"
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={applyDiscount}
                  disabled={applying}
                >
                  {applying ? "Applying..." : `Apply ${data.payment_term.discount_percent}% Discount`}
                </Button>
              ) : (
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <CheckCircle />
                  <Text className="font-medium">Discount Applied</Text>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-2">
              <Text className="text-ui-fg-subtle">
                Early payment discount period has expired
              </Text>
              <Text className="text-xs text-ui-fg-muted mt-1">
                The {data.payment_term.discount_percent}% discount was available 
                until {formatDate(data.discount_deadline)}
              </Text>
            </div>
          )}
        </div>
      )}

      {data.payment_term.discount_percent === 0 && (
        <div className="bg-ui-bg-subtle rounded-lg p-4 text-center">
          <Text className="text-ui-fg-subtle text-sm">
            No early payment discount configured for this invoice's payment terms
          </Text>
        </div>
      )}
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "invoice.details.side.after",
})

export default InvoiceEarlyPaymentWidget
