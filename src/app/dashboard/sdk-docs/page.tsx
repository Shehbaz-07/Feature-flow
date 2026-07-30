"use client"

import { useState } from "react"
import {
  BookOpen,
  Copy,
  Check,
  Terminal,
  Code2,
  Zap,
  Globe,
  ChevronRight,
  Server,
  Layers,
  FlaskConical,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

// ─── Types ─────────────────────────────────────────────────────────────────────

type LangId = "python" | "javascript" | "typescript" | "go" | "java" | "ruby" | "curl"
type SectionId = "installation" | "initialize" | "evaluate" | "rollout"

// ─── Language definitions ───────────────────────────────────────────────────────

const LANGUAGES: { id: LangId; label: string }[] = [
  { id: "python",     label: "Python"     },
  { id: "javascript", label: "JavaScript" },
  { id: "typescript", label: "TypeScript" },
  { id: "go",         label: "Go"         },
  { id: "java",       label: "Java"       },
  { id: "ruby",       label: "Ruby"       },
  { id: "curl",       label: "cURL"       },
]

// ─── Section definitions ────────────────────────────────────────────────────────

const SECTIONS: {
  id: SectionId
  label: string
  icon: React.ComponentType<{ className?: string }>
  description: string
}[] = [
  { id: "installation", label: "Installation",       icon: Terminal,    description: "Install the SDK package for your language or use the REST API directly." },
  { id: "initialize",   label: "Initialize",         icon: Server,      description: "Configure the client with your API URL and environment ID." },
  { id: "evaluate",     label: "Evaluate Flag",      icon: Zap,         description: "Check whether a feature flag is enabled for a given user or group." },
  { id: "rollout",      label: "Percentage Rollout", icon: FlaskConical,description: "Understand how deterministic percentage-based rollouts work." },
]

// ─── Code snippets ──────────────────────────────────────────────────────────────

const SNIPPETS: Record<SectionId, Record<LangId, string>> = {
  installation: {
    python:     `pip install featureflow-sdk`,
    javascript: `npm install @featureflow/sdk\n# or\nyarn add @featureflow/sdk`,
    typescript: `npm install @featureflow/sdk\n# Types are bundled — no @types package needed`,
    go:         `go get github.com/featureflow/sdk-go`,
    java:       `<!-- Add to pom.xml -->\n<dependency>\n  <groupId>io.featureflow</groupId>\n  <artifactId>featureflow-sdk</artifactId>\n  <version>1.0.0</version>\n</dependency>`,
    ruby:       `gem install featureflow-sdk\n# or add to your Gemfile:\n# gem 'featureflow-sdk'`,
    curl:       `# No SDK installation needed.\n# Use the REST API directly with any HTTP client.`,
  },
  initialize: {
    python:
`from featureflow import FeatureFlowClient

client = FeatureFlowClient(
    api_url="https://your-app.vercel.app",
    environment_id="your-environment-id",
)`,
    javascript:
`import { FeatureFlowClient } from "@featureflow/sdk";

const client = new FeatureFlowClient({
  apiUrl: "https://your-app.vercel.app",
  environmentId: "your-environment-id",
});`,
    typescript:
`import { FeatureFlowClient } from "@featureflow/sdk";

const client = new FeatureFlowClient({
  apiUrl: "https://your-app.vercel.app",
  environmentId: "your-environment-id",
});`,
    go:
`package main

import featureflow "github.com/featureflow/sdk-go"

func main() {
  client := featureflow.NewClient(featureflow.Config{
    APIURL:        "https://your-app.vercel.app",
    EnvironmentID: "your-environment-id",
  })
}`,
    java:
`import io.featureflow.FeatureFlowClient;
import io.featureflow.FeatureFlowConfig;

FeatureFlowClient client = new FeatureFlowClient(
  FeatureFlowConfig.builder()
    .apiUrl("https://your-app.vercel.app")
    .environmentId("your-environment-id")
    .build()
);`,
    ruby:
`require "featureflow"

client = Featureflow::Client.new(
  api_url: "https://your-app.vercel.app",
  environment_id: "your-environment-id"
)`,
    curl:
`# Set these in your shell:
export API_URL="https://your-app.vercel.app"
export ENV_ID="your-environment-id"`,
  },
  evaluate: {
    python:
`# Evaluate a flag for a user
is_enabled = client.is_enabled(
    flag_key="new-checkout-flow",
    user_id="user_123",
    groups=["beta-users"],
)

if is_enabled:
    print("New checkout flow is ON")
else:
    print("Showing legacy checkout")`,
    javascript:
`// Evaluate a flag for a user
const isEnabled = await client.isEnabled("new-checkout-flow", {
  userId: "user_123",
  groups: ["beta-users"],
});

if (isEnabled) {
  console.log("New checkout flow is ON");
} else {
  console.log("Showing legacy checkout");
}`,
    typescript:
`// Fully typed evaluation
const isEnabled: boolean = await client.isEnabled("new-checkout-flow", {
  userId: "user_123",
  groups: ["beta-users"],
});

if (isEnabled) {
  renderNewCheckout();
} else {
  renderLegacyCheckout();
}`,
    go:
`// Evaluate a flag for a user
enabled, err := client.IsEnabled("new-checkout-flow", featureflow.Context{
  UserID: "user_123",
  Groups: []string{"beta-users"},
})
if err != nil {
  log.Fatal(err)
}

if enabled {
  fmt.Println("New checkout flow is ON")
}`,
    java:
`// Evaluate a flag for a user
boolean isEnabled = client.isEnabled(
  "new-checkout-flow",
  EvaluationContext.builder()
    .userId("user_123")
    .groups(List.of("beta-users"))
    .build()
);

if (isEnabled) {
  System.out.println("New checkout flow is ON");
}`,
    ruby:
`# Evaluate a flag for a user
enabled = client.enabled?(
  "new-checkout-flow",
  user_id: "user_123",
  groups: ["beta-users"]
)

puts enabled ? "New checkout flow is ON" : "Showing legacy checkout"`,
    curl:
`curl -s -X POST "$API_URL/api/flags/evaluate" \\
  -H "Content-Type: application/json" \\
  -d '{
    "flagKey": "new-checkout-flow",
    "environmentId": "'"$ENV_ID"'",
    "userId": "user_123",
    "groups": ["beta-users"]
  }' | jq`,
  },
  rollout: {
    python:
`# Percentage rollouts are handled server-side automatically.
# Pass a stable user_id to ensure consistent bucketing.
#
# Algorithm: abs(djb2(flagKey + "-" + userId)) % 100 < rolloutPercentage

is_enabled = client.is_enabled(
    flag_key="dark-mode-v2",
    user_id="user_abc",   # same user always gets the same result
)`,
    javascript:
`// Percentage rollout is fully server-side and transparent.
// The server deterministically hashes (flagKey + userId) to bucket users.
// Pass a stable, persistent userId for consistent results.

const isEnabled = await client.isEnabled("dark-mode-v2", {
  userId: "user_abc",   // same user always gets the same result
});`,
    typescript:
`// The rollout engine: Math.abs(djb2(flagKey + "-" + userId)) % 100
// If the result < rolloutPercentage → flag is ON for that user.
// Pass a stable, session-persistent identifier.

const isEnabled: boolean = await client.isEnabled("dark-mode-v2", {
  userId: req.user.id,
});`,
    go:
`// Rollout is server-side. Pass a stable UserID.
// The server deterministically hashes (flagKey + "-" + userId).

enabled, _ := client.IsEnabled("dark-mode-v2", featureflow.Context{
  UserID: "user_abc",
})`,
    java:
`// Rollout percentage is configured in the FeatureFlow dashboard.
// Pass a stable userId for consistent bucketing across sessions.

boolean enabled = client.isEnabled(
  "dark-mode-v2",
  EvaluationContext.builder().userId("user_abc").build()
);`,
    ruby:
`# The rollout engine deterministically hashes flagKey + userId.
# Pass a stable user_id to ensure consistent results per user.

enabled = client.enabled?("dark-mode-v2", user_id: "user_abc")`,
    curl:
`# The server consistently returns the same result for the same userId.

curl -s -X POST "$API_URL/api/flags/evaluate" \\
  -H "Content-Type: application/json" \\
  -d '{
    "flagKey": "dark-mode-v2",
    "environmentId": "'"$ENV_ID"'",
    "userId": "user_abc"
  }' | jq`,
  },
}

// ─── API Parameters ─────────────────────────────────────────────────────────────

const API_PARAMS = [
  { param: "flagKey",       type: "string",   required: true,  desc: "The unique key of the feature flag." },
  { param: "environmentId", type: "UUID",     required: true,  desc: "The UUID of the target environment." },
  { param: "userId",        type: "string",   required: false, desc: "Stable user identifier for targeting and rollouts." },
  { param: "groups",        type: "string[]", required: false, desc: "Array of group names the user belongs to." },
]

// ─── CodeBlock ──────────────────────────────────────────────────────────────────

function CodeBlock({ code, blockId }: { code: string; blockId: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    toast.success("Copied to clipboard")
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative group/code rounded-xl overflow-hidden border border-zinc-800">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-800">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-zinc-700" />
          <span className="w-3 h-3 rounded-full bg-zinc-700" />
          <span className="w-3 h-3 rounded-full bg-zinc-700" />
        </div>
        <Button
          id={blockId}
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-6 px-2 text-xs text-zinc-400 hover:text-white hover:bg-zinc-800 gap-1"
        >
          {copied
            ? <><Check className="w-3 h-3" />Copied</>
            : <><Copy className="w-3 h-3" />Copy</>}
        </Button>
      </div>
      <pre className="bg-zinc-950 text-zinc-100 p-5 text-sm overflow-x-auto leading-relaxed min-h-[120px]">
        <code>{code}</code>
      </pre>
    </div>
  )
}

// ─── Language Selector ──────────────────────────────────────────────────────────

function LangButton({
  lang,
  active,
  onClick,
}: {
  lang: { id: LangId; label: string }
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      id={`sdk-lang-${lang.id}`}
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 rounded-md text-sm font-medium transition-all",
        active
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground hover:bg-muted"
      )}
    >
      {lang.label}
    </button>
  )
}

// ─── Page ───────────────────────────────────────────────────────────────────────

export default function SDKDocsPage() {
  const [activeSection, setActiveSection] = useState<SectionId>("installation")
  const [activeLang, setActiveLang] = useState<LangId>("javascript")

  const currentSection = SECTIONS.find(s => s.id === activeSection)!
  const SectionIcon = currentSection.icon

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <BookOpen className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">SDK Documentation</h1>
          <p className="text-sm text-muted-foreground">
            Integrate FeatureFlow into your app in minutes — supports {LANGUAGES.length} languages.
          </p>
        </div>
      </div>

      {/* Supported Languages */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-sm text-muted-foreground">Supported:</span>
        {LANGUAGES.map(lang => (
          <Badge key={lang.id} variant="secondary" className="text-xs font-medium">
            {lang.label}
          </Badge>
        ))}
      </div>

      {/* Overview cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: Globe, color: "blue", label: "REST API", desc: "A single HTTP endpoint compatible with any language or framework." },
          { icon: Layers, color: "purple", label: "Deterministic Rollouts", desc: "Consistent bucketing per user — no random flip-flopping between sessions." },
          { icon: Zap, color: "green", label: "Server-side Cache", desc: "In-memory caching keeps evaluation latency under 1 ms." },
        ].map(card => {
          const Icon = card.icon
          return (
            <div key={card.label} className="border rounded-xl p-4 bg-card flex gap-3 items-start">
              <div className={`p-2 bg-${card.color}-500/10 rounded-lg shrink-0`}>
                <Icon className={`w-5 h-5 text-${card.color}-500`} />
              </div>
              <div>
                <p className="font-semibold text-sm">{card.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{card.desc}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Docs layout */}
      <div className="flex gap-6">
        {/* Desktop Sidebar — section nav */}
        <aside className="hidden md:flex flex-col gap-1 w-52 shrink-0">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-1">
            Sections
          </p>
          {SECTIONS.map(s => {
            const Icon = s.icon
            const active = s.id === activeSection
            return (
              <button
                key={s.id}
                id={`sdk-nav-${s.id}`}
                type="button"
                onClick={() => setActiveSection(s.id)}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-left transition-all w-full",
                  active
                    ? "bg-primary text-primary-foreground font-medium shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="flex-1">{s.label}</span>
                {active && <ChevronRight className="w-3.5 h-3.5 shrink-0" />}
              </button>
            )
          })}
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Mobile section selector */}
          <div className="md:hidden flex flex-wrap gap-2 p-1 bg-muted rounded-xl">
            {SECTIONS.map(s => {
              const active = s.id === activeSection
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActiveSection(s.id)}
                  className={cn(
                    "flex-1 min-w-fit px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                    active
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {s.label}
                </button>
              )
            })}
          </div>

          {/* Section description */}
          <div className="border rounded-xl p-4 bg-card flex items-start gap-3">
            <div className="p-1.5 bg-primary/10 rounded-md shrink-0 mt-0.5">
              <SectionIcon className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold">{currentSection.label}</h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                {currentSection.description}
              </p>
            </div>
          </div>

          {/* Language selector */}
          <div className="flex flex-wrap gap-1 p-1.5 bg-muted rounded-xl w-fit">
            {LANGUAGES.map(lang => (
              <LangButton
                key={lang.id}
                lang={lang}
                active={activeLang === lang.id}
                onClick={() => setActiveLang(lang.id)}
              />
            ))}
          </div>

          {/* Code block — single block, state-controlled */}
          <CodeBlock
            code={SNIPPETS[activeSection][activeLang]}
            blockId={`copy-${activeSection}-${activeLang}`}
          />

          {/* API Reference — only on Evaluate section */}
          {activeSection === "evaluate" && (
            <div className="border rounded-xl bg-card overflow-hidden">
              <div className="px-4 py-3 border-b bg-muted/50 flex items-center gap-2">
                <Code2 className="w-4 h-4 text-primary" />
                <h3 className="font-semibold text-sm">
                  API Reference —{" "}
                  <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">
                    POST /api/flags/evaluate
                  </code>
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/20">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Parameter</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Type</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Required</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {API_PARAMS.map((row, idx) => (
                      <tr
                        key={row.param}
                        className={cn(
                          "hover:bg-muted/30 transition-colors",
                          idx < API_PARAMS.length - 1 && "border-b"
                        )}
                      >
                        <td className="px-4 py-3 font-mono text-xs text-primary font-semibold">
                          {row.param}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                          {row.type}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
                              row.required
                                ? "bg-primary text-primary-foreground"
                                : "border text-muted-foreground"
                            )}
                          >
                            {row.required ? "required" : "optional"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {row.desc}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
