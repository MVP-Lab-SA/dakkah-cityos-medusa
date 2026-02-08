import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"
import { queryKeys } from "@/lib/utils/query-keys"
import type { SupportedLocale } from "@/lib/i18n"

export interface Translation {
  id: string
  tenant_id: string
  locale: string
  namespace: string
  key: string
  value: string
  context?: string
  status: "draft" | "published" | "archived"
  is_default?: boolean
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface TranslationBundle {
  [key: string]: string
}

export function useTranslations(locale: SupportedLocale, namespace?: string) {
  return useQuery({
    queryKey: namespace
      ? queryKeys.translations.byKey(locale, namespace)
      : queryKeys.translations.byLocale(locale),
    queryFn: async () => {
      const params = new URLSearchParams({ locale })
      if (namespace) params.set("namespace", namespace)

      const response = await sdk.client.fetch<{
        translations: TranslationBundle
        locale: string
        namespace?: string
      }>(`/store/translations?${params}`, {
        credentials: "include",
      })
      return response.translations || {}
    },
    staleTime: 10 * 60 * 1000,
  })
}

export function useTranslation(locale: SupportedLocale, namespace: string = "common") {
  const { data: translations } = useTranslations(locale, namespace)

  const t = (key: string, fallback?: string): string => {
    if (translations && translations[key]) {
      return translations[key]
    }
    return fallback || key
  }

  return { t, translations }
}
