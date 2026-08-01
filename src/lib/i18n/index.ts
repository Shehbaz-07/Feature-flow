import en from "./translations/en"
import hi from "./translations/hi"
import te from "./translations/te"
import ta from "./translations/ta"
import bn from "./translations/bn"
import mr from "./translations/mr"
import gu from "./translations/gu"
import kn from "./translations/kn"
import type { Translations } from "./translations/en"

export type Locale = "en" | "hi" | "te" | "ta" | "bn" | "mr" | "gu" | "kn"

export interface LocaleInfo {
  code: Locale
  /** Native name of the language */
  nativeName: string
  /** English name of the language */
  englishName: string
  /** Country/region flag emoji */
  flag: string
}

export const SUPPORTED_LOCALES: LocaleInfo[] = [
  { code: "en", nativeName: "English",    englishName: "English",   flag: "🇬🇧" },
  { code: "hi", nativeName: "हिन्दी",     englishName: "Hindi",     flag: "🇮🇳" },
  { code: "te", nativeName: "తెలుగు",     englishName: "Telugu",    flag: "🇮🇳" },
  { code: "ta", nativeName: "தமிழ்",      englishName: "Tamil",     flag: "🇮🇳" },
  { code: "bn", nativeName: "বাংলা",      englishName: "Bengali",   flag: "🇮🇳" },
  { code: "mr", nativeName: "मराठी",      englishName: "Marathi",   flag: "🇮🇳" },
  { code: "gu", nativeName: "ગુજરાતી",   englishName: "Gujarati",  flag: "🇮🇳" },
  { code: "kn", nativeName: "ಕನ್ನಡ",     englishName: "Kannada",   flag: "🇮🇳" },
]

export const DEFAULT_LOCALE: Locale = "en"

export const TRANSLATIONS: Record<Locale, Translations> = {
  en,
  hi,
  te,
  ta,
  bn,
  mr,
  gu,
  kn,
}

export type { Translations }
