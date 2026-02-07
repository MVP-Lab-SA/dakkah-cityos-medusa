import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { client } from "../lib/client"

export interface Company {
  id: string
  handle: string
  name: string
  legal_name?: string
  tax_id?: string
  email: string
  phone?: string
  industry?: string
  employee_count?: number
  annual_revenue?: string
  credit_limit: string
  credit_used: string
  payment_terms_days: number
  status: "pending" | "active" | "suspended" | "inactive"
  tier: "bronze" | "silver" | "gold" | "platinum"
  approved_at?: string
  approved_by?: string
  rejection_reason?: string
  requires_approval: boolean
  auto_approve_limit?: string
  billing_address?: any
  shipping_addresses?: any[]
  metadata?: any
  created_at: string
  updated_at: string
  users?: CompanyUser[]
}

export interface CompanyUser {
  id: string
  company_id: string
  customer_id: string
  role: "admin" | "buyer" | "approver"
  spending_limit?: string
  can_approve: boolean
  created_at: string
}

export interface TaxExemption {
  id: string
  certificate_number: string
  certificate_type: string
  issuing_state?: string
  expiration_date?: string
  document_url?: string
  exempt_categories?: string[]
  notes?: string
  status: "pending" | "verified" | "expired" | "rejected"
  created_at: string
  verified_at?: string
  verified_by?: string
}

interface CompaniesResponse {
  companies: Company[]
  count: number
  offset: number
  limit: number
}

export function useCompanies(filters?: {
  status?: string
  tier?: string
  q?: string
  limit?: number
  offset?: number
}) {
  const params = new URLSearchParams()
  if (filters?.status) params.append("status", filters.status)
  if (filters?.tier) params.append("tier", filters.tier)
  if (filters?.q) params.append("q", filters.q)
  if (filters?.limit) params.append("limit", String(filters.limit))
  if (filters?.offset) params.append("offset", String(filters.offset))
  
  return useQuery({
    queryKey: ["companies", filters],
    queryFn: async () => {
      const url = `/admin/companies${params.toString() ? `?${params}` : ""}`
      const { data } = await client.get<CompaniesResponse>(url)
      return data
    },
  })
}

export function useCompany(id: string) {
  return useQuery({
    queryKey: ["company", id],
    queryFn: async () => {
      const { data } = await client.get<{ company: Company }>(`/admin/companies/${id}`)
      return data.company
    },
    enabled: !!id,
  })
}

export function useUpdateCompany() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<Company> & { id: string }) => {
      const response = await client.put<{ company: Company }>(`/admin/companies/${id}`, data)
      return response.data.company
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["companies"] })
      queryClient.invalidateQueries({ queryKey: ["company", variables.id] })
    },
  })
}

export function useApproveCompany() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await client.post<{ company: Company }>(`/admin/companies/${id}/approve`, {})
      return response.data.company
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["companies"] })
      queryClient.invalidateQueries({ queryKey: ["company", id] })
    },
  })
}

// Credit Management
export function useCompanyCredit(companyId: string) {
  return useQuery({
    queryKey: ["company-credit", companyId],
    queryFn: async () => {
      const { data } = await client.get<{
        company_id: string
        credit_limit: number
        credit_used: number
        available_credit: number
        payment_terms_days: number
        tier: string
      }>(`/admin/companies/${companyId}/credit`)
      return data
    },
    enabled: !!companyId,
  })
}

export function useUpdateCreditLimit() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, credit_limit, payment_terms_days, reason }: {
      id: string
      credit_limit?: number
      payment_terms_days?: number
      reason?: string
    }) => {
      const response = await client.put(`/admin/companies/${id}/credit`, {
        credit_limit,
        payment_terms_days,
        reason,
      })
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["company-credit", variables.id] })
      queryClient.invalidateQueries({ queryKey: ["company", variables.id] })
    },
  })
}

export function useAdjustCredit() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, amount, type, reason }: {
      id: string
      amount: number
      type: "add" | "subtract" | "reset"
      reason: string
    }) => {
      const response = await client.post(`/admin/companies/${id}/credit`, {
        amount,
        type,
        reason,
      })
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["company-credit", variables.id] })
      queryClient.invalidateQueries({ queryKey: ["company", variables.id] })
    },
  })
}

// Spending Limits
export function useSpendingLimits(companyId: string) {
  return useQuery({
    queryKey: ["spending-limits", companyId],
    queryFn: async () => {
      const { data } = await client.get(`/admin/companies/${companyId}/spending-limits`)
      return data
    },
    enabled: !!companyId,
  })
}

export function useUpdateSpendingLimit() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ companyId, user_id, spending_limit, can_approve }: {
      companyId: string
      user_id: string
      spending_limit?: number
      can_approve?: boolean
    }) => {
      const response = await client.put(`/admin/companies/${companyId}/spending-limits`, {
        user_id,
        spending_limit,
        can_approve,
      })
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["spending-limits", variables.companyId] })
    },
  })
}

// Tax Exemptions
export function useTaxExemptions(companyId: string) {
  return useQuery({
    queryKey: ["tax-exemptions", companyId],
    queryFn: async () => {
      const { data } = await client.get<{ exemptions: TaxExemption[] }>(`/admin/companies/${companyId}/tax-exemptions`)
      return data.exemptions
    },
    enabled: !!companyId,
  })
}

export function useCreateTaxExemption() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ companyId, ...data }: {
      companyId: string
      certificate_number: string
      certificate_type: string
      issuing_state?: string
      expiration_date?: string
      document_url?: string
      exempt_categories?: string[]
      notes?: string
    }) => {
      const response = await client.post(`/admin/companies/${companyId}/tax-exemptions`, data)
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tax-exemptions", variables.companyId] })
    },
  })
}

export function useVerifyTaxExemption() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ companyId, exemption_id, status, verified_by, notes }: {
      companyId: string
      exemption_id: string
      status: "pending" | "verified" | "expired" | "rejected"
      verified_by?: string
      notes?: string
    }) => {
      const response = await client.put(`/admin/companies/${companyId}/tax-exemptions`, {
        exemption_id,
        status,
        verified_by,
        notes,
      })
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tax-exemptions", variables.companyId] })
    },
  })
}

export function useDeleteTaxExemption() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ companyId, exemption_id }: {
      companyId: string
      exemption_id: string
    }) => {
      await client.delete(`/admin/companies/${companyId}/tax-exemptions?exemption_id=${exemption_id}`)
      return exemption_id
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tax-exemptions", variables.companyId] })
    },
  })
}
