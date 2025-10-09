// Supported locales for the blog
export const locales = ['zh', 'ja', 'en'] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'zh'

// Language names in their native form
export const languageNames: Record<Locale, string> = {
  zh: '繁體中文',
  ja: '日本語',
  en: 'English',
}

// HTML lang attribute values for each locale
export const htmlLangMap: Record<Locale, string> = {
  zh: 'zh-Hant-TW',
  ja: 'ja',
  en: 'en',
}

// Check if a string is a valid locale
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale)
}
