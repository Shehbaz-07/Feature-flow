"use client"

import { Globe } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTranslation } from "@/lib/i18n/context"
import { SUPPORTED_LOCALES, type Locale } from "@/lib/i18n"
import { cn } from "@/lib/utils"

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useTranslation()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        id="language-switcher-btn"
        suppressHydrationWarning
        className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9 rounded-full"
        aria-label={t.languageSwitcher.label}
      >
        <Globe className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">{t.languageSwitcher.label}</span>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
            {t.languageSwitcher.label}
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

        {SUPPORTED_LOCALES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            id={`lang-option-${lang.code}`}
            onClick={() => setLocale(lang.code as Locale)}
            className={cn(
              "flex items-center gap-2.5 cursor-pointer",
              locale === lang.code && "bg-primary/10 text-primary font-medium"
            )}
          >
            <span className="text-base leading-none">{lang.flag}</span>
            <div className="flex flex-col min-w-0">
              <span className="text-sm leading-tight">{lang.nativeName}</span>
              {lang.code !== "en" && (
                <span className="text-[10px] text-muted-foreground leading-tight">
                  {lang.englishName}
                </span>
              )}
            </div>
            {locale === lang.code && (
              <span className="ml-auto text-[10px] text-primary font-semibold">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
