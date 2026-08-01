"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Layers, Rocket, Bug, Kanban, ArrowRight, ShieldCheck, FolderKanban } from "lucide-react"
import { useTranslation } from "@/lib/i18n/context"
import { LanguageSwitcher } from "@/components/language-switcher"
import { ThemeToggle } from "@/components/theme-toggle"

export default function LandingPage() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-background selection:bg-primary/20">
      {/* Navigation */}
      <header className="fixed top-0 w-full z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-md shadow-sm">
              <Layers size={20} />
            </div>
            FeatureFlow
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LanguageSwitcher />
            <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors px-2">
              {t.nav.signIn}
            </Link>
            <Button asChild>
              <Link href="/register">{t.nav.getStarted}</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="container mx-auto px-4 pt-20 pb-32 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
            <Rocket size={16} />
            {t.landing.badge}
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 bg-gradient-to-r from-foreground via-foreground/80 to-muted-foreground bg-clip-text text-transparent max-w-4xl mx-auto">
            {t.landing.hero}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            {t.landing.heroSub}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="h-12 px-8 text-base group" asChild>
              <Link href="/register">
                {t.landing.startFree}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 text-base" asChild>
              <Link href="/login">{t.landing.signIn}</Link>
            </Button>
          </div>
        </section>

        {/* Features Grid */}
        <section className="container mx-auto px-4 py-20 border-t">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">{t.landing.featuresHeading}</h2>
            <p className="text-muted-foreground">{t.landing.featuresSub}</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-card border shadow-sm hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FolderKanban size={24} />
              </div>
              <h3 className="font-semibold text-lg mb-2">{t.landing.feature1Title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t.landing.feature1Desc}
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-card border shadow-sm hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Kanban size={24} />
              </div>
              <h3 className="font-semibold text-lg mb-2">{t.landing.feature2Title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t.landing.feature2Desc}
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-card border shadow-sm hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Rocket size={24} />
              </div>
              <h3 className="font-semibold text-lg mb-2">{t.landing.feature3Title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t.landing.feature3Desc}
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-card border shadow-sm hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Bug size={24} />
              </div>
              <h3 className="font-semibold text-lg mb-2">{t.landing.feature4Title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t.landing.feature4Desc}
              </p>
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section className="container mx-auto px-4 py-20 mt-10 rounded-3xl bg-zinc-950 text-white text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-6">
            <ShieldCheck size={32} className="text-primary" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight mb-4">{t.landing.securityHeading}</h2>
          <p className="text-zinc-400 max-w-2xl mx-auto mb-8 leading-relaxed">
            {t.landing.securityDesc}
          </p>
          <Button variant="secondary" size="lg" className="h-12 px-8" asChild>
            <Link href="/register">{t.landing.createWorkspace}</Link>
          </Button>
        </section>
      </main>

      <footer className="border-t py-12 text-center text-muted-foreground">
        <div className="flex items-center justify-center gap-2 font-bold text-foreground mb-4">
          <Layers size={18} className="text-primary" />
          FeatureFlow
        </div>
        <p className="text-sm">{t.landing.footerTagline}</p>
      </footer>
    </div>
  )
}
