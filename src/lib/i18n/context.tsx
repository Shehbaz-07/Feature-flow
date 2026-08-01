"use client"

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"
import {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  TRANSLATIONS,
  type Locale,
  type Translations,
} from "./index"

// ─── Types ────────────────────────────────────────────────────────────────────

interface LanguageContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: Translations
}

// ─── Context ──────────────────────────────────────────────────────────────────

const LanguageContext = createContext<LanguageContextValue>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
  t: TRANSLATIONS[DEFAULT_LOCALE],
})

// ─── Storage key ─────────────────────────────────────────────────────────────

const STORAGE_KEY = "featureflow_locale"

// ─── Detect browser locale ───────────────────────────────────────────────────

function detectBrowserLocale(): Locale {
  if (typeof window === "undefined") return DEFAULT_LOCALE
  const stored = window.localStorage.getItem(STORAGE_KEY) as Locale | null
  if (stored && SUPPORTED_LOCALES.some((l) => l.code === stored)) return stored

  const browserLang = navigator.language.slice(0, 2).toLowerCase()
  const match = SUPPORTED_LOCALES.find((l) => l.code === browserLang)
  return match ? match.code : DEFAULT_LOCALE
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE)

  // Hydrate from localStorage / browser language on mount
  useEffect(() => {
    setLocaleState(detectBrowserLocale())
  }, [])

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    try {
      window.localStorage.setItem(STORAGE_KEY, newLocale)
    } catch {
      // ignore storage errors (private browsing, etc.)
    }
  }, [])

  const value: LanguageContextValue = {
    locale,
    setLocale,
    t: TRANSLATIONS[locale],
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useTranslation() {
  return useContext(LanguageContext)
}
