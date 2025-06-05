export type Language = "en" | "tr"

export interface Translations {
  [key: string]: any
}

export const translations: Record<Language, Translations> = {
  en: {},
  tr: {},
}

export function getTranslation(language: Language): Translations {
  return translations[language]
}
