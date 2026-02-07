import { useState, useEffect, useCallback } from "react"

interface PaymentTerm {
  id: string
  name: string
  code: string
  net_days: number
  discount_percent: number
  discount_days: number
  is_default: boolean
  is_active: boolean
  created_at?: string
  updated_at?: string
}

interface UsePaymentTermsReturn {
  terms: PaymentTerm[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  createTerm: (data: CreatePaymentTermInput) => Promise<PaymentTerm | null>
  updateTerm: (id: string, data: UpdatePaymentTermInput) => Promise<PaymentTerm | null>
  deleteTerm: (id: string) => Promise<boolean>
}

interface CreatePaymentTermInput {
  name: string
  net_days: number
  discount_percent?: number
  discount_days?: number
  is_default?: boolean
}

interface UpdatePaymentTermInput {
  name?: string
  net_days?: number
  discount_percent?: number
  discount_days?: number
  is_default?: boolean
  is_active?: boolean
}

export function usePaymentTerms(): UsePaymentTermsReturn {
  const [terms, setTerms] = useState<PaymentTerm[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTerms = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch("/admin/payment-terms", {
        credentials: "include"
      })

      if (!response.ok) {
        throw new Error("Failed to fetch payment terms")
      }

      const data = await response.json()
      setTerms(data.payment_terms || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTerms()
  }, [fetchTerms])

  const createTerm = async (input: CreatePaymentTermInput): Promise<PaymentTerm | null> => {
    try {
      const response = await fetch("/admin/payment-terms", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input)
      })

      if (!response.ok) {
        throw new Error("Failed to create payment term")
      }

      const data = await response.json()
      await fetchTerms() // Refresh list
      return data.payment_term
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create")
      return null
    }
  }

  const updateTerm = async (id: string, input: UpdatePaymentTermInput): Promise<PaymentTerm | null> => {
    try {
      const response = await fetch(`/admin/payment-terms/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input)
      })

      if (!response.ok) {
        throw new Error("Failed to update payment term")
      }

      const data = await response.json()
      await fetchTerms() // Refresh list
      return data.payment_term
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update")
      return null
    }
  }

  const deleteTerm = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/admin/payment-terms/${id}`, {
        method: "DELETE",
        credentials: "include"
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete payment term")
      }

      await fetchTerms() // Refresh list
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete")
      return false
    }
  }

  return {
    terms,
    loading,
    error,
    refetch: fetchTerms,
    createTerm,
    updateTerm,
    deleteTerm
  }
}

/**
 * Hook to get early payment calculation for a specific invoice
 */
interface EarlyPaymentCalculation {
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

export function useInvoiceEarlyPayment(invoiceId: string | undefined) {
  const [data, setData] = useState<EarlyPaymentCalculation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    if (!invoiceId) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/admin/invoices/${invoiceId}/early-payment`, {
        credentials: "include"
      })

      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData.error || "Failed to fetch early payment data")
      }

      const result = await response.json()
      setData(result.early_payment)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }, [invoiceId])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const applyDiscount = async (): Promise<boolean> => {
    if (!invoiceId) return false

    try {
      const response = await fetch(`/admin/invoices/${invoiceId}/early-payment`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apply_discount: true })
      })

      if (!response.ok) {
        throw new Error("Failed to apply discount")
      }

      await fetchData() // Refresh
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to apply")
      return false
    }
  }

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    applyDiscount
  }
}

/**
 * Hook to manage company payment terms
 */
interface CompanyPaymentTerms {
  company_id: string
  company_name: string
  payment_term: PaymentTerm
  is_custom: boolean
}

export function useCompanyPaymentTerms(companyId: string | undefined) {
  const [data, setData] = useState<CompanyPaymentTerms | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    if (!companyId) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/admin/companies/${companyId}/payment-terms`, {
        credentials: "include"
      })

      if (!response.ok) {
        throw new Error("Failed to fetch company payment terms")
      }

      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }, [companyId])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const assignTerms = async (paymentTermId: string): Promise<boolean> => {
    if (!companyId) return false

    try {
      const response = await fetch(`/admin/companies/${companyId}/payment-terms`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payment_term_id: paymentTermId })
      })

      if (!response.ok) {
        throw new Error("Failed to assign payment terms")
      }

      await fetchData()
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to assign")
      return false
    }
  }

  const removeTerms = async (): Promise<boolean> => {
    if (!companyId) return false

    try {
      const response = await fetch(`/admin/companies/${companyId}/payment-terms`, {
        method: "DELETE",
        credentials: "include"
      })

      if (!response.ok) {
        throw new Error("Failed to remove payment terms")
      }

      await fetchData()
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove")
      return false
    }
  }

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    assignTerms,
    removeTerms
  }
}
