"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Layers, Rocket, Bug, Kanban, ArrowRight, ShieldCheck } from "lucide-react"

export default function LandingPage() {
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
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">
              Sign In
            </Link>
            <Button asChild>
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="container mx-auto px-4 pt-20 pb-32 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
            <Rocket size={16} />
            Ship better software, faster.
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 bg-gradient-to-r from-foreground via-foreground/80 to-muted-foreground bg-clip-text text-transparent max-w-4xl mx-auto">
            The Ultimate Control Center for Your Software
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            FeatureFlow brings projects, features, sprint boards, releases, and bug tracking into one beautiful, lightning-fast platform.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="h-12 px-8 text-base group" asChild>
              <Link href="/register">
                Start for free
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 text-base" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </section>

        {/* Features Grid */}
        <section className="container mx-auto px-4 py-20 border-t">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Everything you need to build</h2>
            <p className="text-muted-foreground">Replace your entire disjointed toolchain with one elegant solution.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-card border shadow-sm hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FolderKanbanIcon size={24} />
              </div>
              <h3 className="font-semibold text-lg mb-2">Project Spaces</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Organize your entire portfolio with isolated project workspaces and real-time metrics.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-card border shadow-sm hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Kanban size={24} />
              </div>
              <h3 className="font-semibold text-lg mb-2">Sprint Boards</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Drag and drop your features across highly responsive agile sprint boards.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-card border shadow-sm hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Rocket size={24} />
              </div>
              <h3 className="font-semibold text-lg mb-2">Release Control</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Plan, track, and deploy your software versions with integrated release management.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-card border shadow-sm hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Bug size={24} />
              </div>
              <h3 className="font-semibold text-lg mb-2">Bug Tracking</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Capture, prioritize, and squash bugs directly linked to your features and releases.
              </p>
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section className="container mx-auto px-4 py-20 mt-10 rounded-3xl bg-zinc-950 text-white text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-6">
            <ShieldCheck size={32} className="text-primary" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight mb-4">Enterprise-grade isolation</h2>
          <p className="text-zinc-400 max-w-2xl mx-auto mb-8 leading-relaxed">
            Built on top of PostgreSQL with native Row-Level Security. Every piece of your data is mathematically isolated and secure from the ground up.
          </p>
          <Button variant="secondary" size="lg" className="h-12 px-8" asChild>
            <Link href="/register">Create your workspace</Link>
          </Button>
        </section>
      </main>

      <footer className="border-t py-12 text-center text-muted-foreground">
        <div className="flex items-center justify-center gap-2 font-bold text-foreground mb-4">
          <Layers size={18} className="text-primary" />
          FeatureFlow
        </div>
        <p className="text-sm">Built for modern software teams.</p>
      </footer>
    </div>
  )
}

function FolderKanbanIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
      <path d="M8 10v4" />
      <path d="M12 10v2" />
      <path d="M16 10v6" />
    </svg>
  )
}
