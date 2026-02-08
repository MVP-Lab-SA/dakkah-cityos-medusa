export const CHANNEL_TYPES = ["web", "mobile", "api", "kiosk", "internal"] as const
export type ChannelType = typeof CHANNEL_TYPES[number]

export const SUPPORTED_LOCALES = ["en", "fr", "ar"] as const
export type SupportedLocale = typeof SUPPORTED_LOCALES[number]

export const LOCALE_CONFIG: Record<SupportedLocale, { language: string; direction: "ltr" | "rtl" }> = {
  en: { language: "English", direction: "ltr" },
  fr: { language: "French", direction: "ltr" },
  ar: { language: "Arabic", direction: "rtl" },
}
