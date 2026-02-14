const RTL_LANGUAGES = new Set(["ar", "he", "fa", "ur", "ps", "sd", "yi"])

const SUPPORTED_LOCALES = [
  "en-US", "en-GB", "es-ES", "es-MX", "fr-FR", "de-DE",
  "it-IT", "pt-BR", "pt-PT", "ja-JP", "ko-KR", "zh-CN",
  "zh-TW", "ar-SA", "he-IL", "hi-IN", "ru-RU", "tr-TR",
  "nl-NL", "sv-SE", "pl-PL", "th-TH",
]

const LANGUAGE_FALLBACKS: Record<string, string> = {
  "en-GB": "en-US",
  "es-MX": "es-ES",
  "pt-PT": "pt-BR",
  "zh-TW": "zh-CN",
  "fr-CA": "fr-FR",
  "de-AT": "de-DE",
  "en-AU": "en-US",
  "en-CA": "en-US",
}

export function parseLocale(locale: string): { language: string; region: string | null } {
  if (!locale) return { language: "en", region: null }
  const parts = locale.replace("_", "-").split("-")
  return {
    language: parts[0].toLowerCase(),
    region: parts.length > 1 ? parts[1].toUpperCase() : null,
  }
}

export function isRTL(locale: string): boolean {
  const { language } = parseLocale(locale)
  return RTL_LANGUAGES.has(language)
}

export function getLanguageFallback(locale: string): string {
  if (LANGUAGE_FALLBACKS[locale]) {
    return LANGUAGE_FALLBACKS[locale]
  }
  const { language } = parseLocale(locale)
  const match = SUPPORTED_LOCALES.find(l => l.startsWith(language + "-"))
  return match || "en-US"
}

export function getSupportedLocales(): string[] {
  return [...SUPPORTED_LOCALES]
}

export function isLocaleSupported(locale: string): boolean {
  return SUPPORTED_LOCALES.includes(locale)
}

export function formatLocaleDisplay(locale: string): string {
  const { language, region } = parseLocale(locale)
  const displayNames: Record<string, string> = {
    en: "English", es: "Spanish", fr: "French", de: "German",
    it: "Italian", pt: "Portuguese", ja: "Japanese", ko: "Korean",
    zh: "Chinese", ar: "Arabic", he: "Hebrew", hi: "Hindi",
    ru: "Russian", tr: "Turkish", nl: "Dutch", sv: "Swedish",
    pl: "Polish", th: "Thai",
  }
  const languageName = displayNames[language] || language
  return region ? `${languageName} (${region})` : languageName
}
