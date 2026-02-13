import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../lib/client.js"

export type Translation = {
  id: string
  locale: string
  namespace: string
  key: string
  value: string
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export function useTranslations(params?: { locale?: string; namespace?: string; search?: string }) {
  return useQuery({
    queryKey: ["i18n", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams()
      if (params?.locale) searchParams.set("locale", params.locale)
      if (params?.namespace) searchParams.set("namespace", params.namespace)
      if (params?.search) searchParams.set("q", params.search)
      const query = searchParams.toString()
      const response = await sdk.client.fetch(`/admin/i18n${query ? `?${query}` : ""}`)
      return response as { translations: Translation[] }
    },
  })
}

export function useCreateTranslation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<Translation>) => {
      const response = await sdk.client.fetch(`/admin/i18n`, {
        method: "POST",
        body: data,
      })
      return response as { translation: Translation }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["i18n"] })
    },
  })
}

export function useUpdateTranslation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<Translation> & { id: string }) => {
      const response = await sdk.client.fetch(`/admin/i18n/${id}`, {
        method: "PUT",
        body: data,
      })
      return response as { translation: Translation }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["i18n"] })
    },
  })
}

export function useDeleteTranslation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await sdk.client.fetch(`/admin/i18n/${id}`, {
        method: "DELETE",
      })
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["i18n"] })
    },
  })
}
