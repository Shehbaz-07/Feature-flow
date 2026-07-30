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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"

// ─── Language definitions ──────────────────────────────────────────────────────

const SDK_LANGUAGES = [
  { id: "python",     label: "Python"     },
  { id: "javascript", label: "JavaScript" },
  { id: "typescript", label: "TypeScript" },
  { id: "go",         label: "Go"         },
  { id: "java",       label: "Java"       },
  { id: "ruby",       label: "Ruby"       },
  { id: "curl",       label: "cURL"       },
] as const

type LangId = (typeof SDK_LANGUAGES)[number]["id"]
type SectionId = "installation" | "initialize" | "evaluate" | "rollout"

// ─── Code snippets ─────────────────────────────────────────────────────────────

const SNIPPETS: Record<SectionId, Record<LangId, string>> = {
  installation: {
    python:     `pip install featureflow-sdk`,
    javascript: `npm install @featureflow/sdk
# or
yarn add @featureflow/sdk`,
    typescript: `npm install @featureflow/sdk
# Types are bundled — no @types package needed`,
    go:         `go get github.com/featureflow/sdk-go`,
    java: `<!-- Add to pom.xml -->
<dependency>
  <groupId>io.featureflow</groupId>
  <artifactId>featureflow-sdk</artifactId>
  <version>1.0.0</version>
</dependency>`,
    ruby: `gem install featureflow-sdk
# or add to Gemfile:
# gem 'featureflow-sdk'`,
    curl: `# No SDK installation needed.
# Use the REST API directly with any HTTP client.`,
  },

  initialize: {
    python: `from featureflow import FeatureFlowClient

client = FeatureFlowClient(
    api_url="https://your-app.vercel.app",
    environment_id="your-environment-id",
)`,
    javascript: `import { FeatureFlowClient } from "@featureflow/sdk";

const client = new FeatureFlowClient({
  apiUrl: "https://your-app.vercel.app",
  environmentId: "your-environment-id",
});`,
    typescript: `import { FeatureFlowClient } from "@featureflow/sdk";

const client = new FeatureFlowClient({
  apiUrl: "https://your-app.vercel.app",
  environmentId: "your-environment-id",
});`,
    go: `package main

import featureflow "github.com/featureflow/sdk-go"

func main() {
  client := featureflow.NewClient(featureflow.Config{
    APIURL:        "https://your-app.vercel.app",
    EnvironmentID: "your-environment-id",
  })
}`,
    java: `import io.featureflow.FeatureFlowClient;
import io.featureflow.FeatureFlowConfig;

FeatureFlowClient client = new FeatureFlowClient(
  FeatureFlowConfig.builder()
    .apiUrl("https://your-app.vercel.app")
    .environmentId("your-environment-id")
    .build()
);`,
    ruby: `require "featureflow"

client = Featureflow::Client.new(
  api_url: "https://your-app.vercel.app",
  environment_id: "your-environment-id"
)`,
    curl: `# Set these in your shell environment:
export API_URL="https://your-app.vercel.app"
export ENV_ID="your-environment-id"`,
  },

  evaluate: {
    python: `# Evaluate a flag for a user
is_enabled = client.is_enabled(
    flag_key="new-checkout-flow",
    user_id="user_123",
    groups=["beta-users"],
)

if is_enabled:
    print("New checkout flow is ON")
else:
    print("Showing legacy checkout")`,
    javascript: `// Evaluate a flag for a user
const isEnabled = await client.isEnabled("new-checkout-flow", {
  userId: "user_123",
  groups: ["beta-users"],
});

if (isEnabled) {
  console.log("New checkout flow is ON");
} else {
  console.log("Showing legacy checkout");
}`,
    typescript: `// Fully typed evaluation
const isEnabled: boolean = await client.isEnabled("new-checkout-flow", {
  userId: "user_123",
  groups: ["beta-users"],
});

if (isEnabled) {
  renderNewCheckout();
} else {
  renderLegacyCheckout();
}`,
    go: `// Evaluate a flag for a user
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
    java: `// Evaluate a flag for a user
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
    ruby: `# Evaluate a flag for a user
enabled = client.enabled?(
  "new-checkout-flow",
  user_id: "user_123",
  groups: ["beta-users"]
)

puts enabled ? "New checkout flow is ON" : "Showing legacy checkout"`,
    curl: `curl -s -X POST "$API_URL/api/flags/evaluate" \\
  -H "Content-Type: application/json" \\
  -d '{
    "flagKey": "new-checkout-flow",
    "environmentId": "'"$ENV_ID"'",
    "userId": "user_123",
    "groups": ["beta-users"]
  }' | jq`,
  },

  rollout: {
    python: `# Percentage rollouts are handled server-side automatically.
# Pass a stable user_id to ensure consistent bucketing.
#
# Algorithm: hash(flagKey + "-" + userId) % 100 < rolloutPercentage

is_enabled = client.is_enabled(
    flag_key="dark-mode-v2",
    user_id="user_abc",   # Same user always gets the same result
)`,
    javascript: `// Percentage rollout is fully server-side and transparent.
// The server deterministically hashes flagKey + userId to bucket users.
// Pass a stable, persistent userId for consistent results.

const isEnabled = await client.isEnabled("dark-mode-v2", {
  userId: "user_abc",   // same user always gets the same result
});`,
    typescript: `// The rollout engine uses: Math.abs(djb2(flagKey + "-" + userId)) % 100
// If the result < rolloutPercentage → flag is ON for that user.
// Pass a stable, session-persistent identifier.

const isEnabled: boolean = await client.isEnabled("dark-mode-v2", {
  userId: req.user.id,
});`,
    go: `// Rollout is server-side. Pass a stable UserID.
// The server hashes (flagKey + "-" + userId) deterministically.

enabled, _ := client.IsEnabled("dark-mode-v2", featureflow.Context{
  UserID: "user_abc",
})`,
    java: `// Rollout percentage is configured in the FeatureFlow dashboard.
// Pass a stable userId for consistent bucketing across sessions.

boolean enabled = client.isEnabled(
  "dark-mode-v2",
  EvaluationContext.builder().userId("user_abc").build()
);`,
    ruby: `# The rollout engine deterministically hashes flagKey + userId.
# Pass a stable user_id to ensure consistent results per user.

enabled = client.enabled?("dark-mode-v2", user_id: "user_abc")`,
    curl: `# The server consistently returns the same result for the same userId.
# No special parameters — just include userId.

curl -s -X POST "$API_URL/api/flags/evaluate" \\
  -H "Content-Type: application/json" \\
  -d '{
    "flagKey": "dark-mode-v2",
    "environmentId": "'"$ENV_ID"'",
    "userId": "user_abc"
  }' | jq`,
  },
}

// ─── Section definitions ───────────────────────────────────────────────────────

const SECTIONS: Array<{
  id: SectionId
  label: string
  icon: React.ComponentType<{ className?: string }>
  description: string
}> = [
  {
    id: "installation",
    label: "Installation",
    icon: Terminal,
    description: "Install the SDK package for your language or use the REST API directly.",
  },
  {
    id: "initialize",
    label: "Initialize",
    icon: Server,
    description: "Configure the client with your API URL and environment ID.",
  },
  {
    id: "evaluate",
    label: "Evaluate Flag",
    icon: Zap,
    description: "Check whether a feature flag is enabled for a given user or group.",
  },
  {
    id: "rollout",
    label: "Percentage Rollout",
    icon: FlaskConical,
    description: "Understand how deterministic percentage-based rollouts work.",
  },
]

// ─── API Parameters table ──────────────────────────────────────────────────────

const API_PARAMS = [
  { param: "flagKey",       type: "string",   required: true,  desc: "The unique key of the feature flag." },
  { param: "environmentId", type: "UUID",     required: true,  desc: "The UUID of the target environment." },
  { param: "userId",        type: "string",   required: false, desc: "Stable user identifier for targeting and rollouts." },
  { param: "groups",        type: "string[]", required: false, desc: "Array of group names the user belongs to." },
]

// ─── CodeBlock component ───────────────────────────────────────────────────────

function CodeBlock({ code, blockId }: { code: string; blockId: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    toast.success("Copied to clipboard")
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative group/code">
      <pre className="bg-zinc-950 dark:bg-zinc-900 text-zinc-100 rounded-xl p-5 text-sm overflow-x-auto leading-relaxed border border-zinc-800 min-h-[80px]">
        <code>{code}</code>
      </pre>
      <Button
        id={blockId}
        variant="ghost"
        size="sm"
        onClick={handleCopy}
        className="absolute top-3 right-3 opacity-0 group-hover/code:opacity-100 transition-opacity h-7 px-2 bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-white"
      >
        {copied
          ? <><Check className="w-3.5 h-3.5 mr-1" />Copied</>
          : <><Copy className="w-3.5 h-3.5 mr-1" />Copy</>
        }
      </Button>
    </div>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function SDKDocsPage() {
  const [activeSection, setActiveSection] = useState<SectionId>("installation")
  const [language, setLanguage] = useState<LangId>("javascript")

  const currentSection = SECTIONS.find(s => s.id === activeSection)!

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
            Integrate FeatureFlow into your app in minutes — supports 7 languages.
          </p>
        </div>
      </div>

      {/* Supported Languages */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-sm text-muted-foreground">Supported:</span>
        {SDK_LANGUAGES.map(lang => (
          <Badge key={lang.id} variant="secondary" className="text-xs font-medium">
            {lang.label}
          </Badge>
        ))}
      </div>

      {/* Overview cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="border rounded-xl p-4 bg-card flex gap-3 items-start">
          <div className="p-2 bg-blue-500/10 rounded-lg shrink-0">
            <Globe className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <p className="font-semibold text-sm">REST API</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              A single HTTP endpoint compatible with any language or framework.
            </p>
          </div>
        </div>
        <div className="border rounded-xl p-4 bg-card flex gap-3 items-start">
          <div className="p-2 bg-purple-500/10 rounded-lg shrink-0">
            <Layers className="w-5 h-5 text-purple-500" />
          </div>
          <div>
            <p className="font-semibold text-sm">Deterministic Rollouts</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Consistent bucketing per user — no random flip-flopping between sessions.
            </p>
          </div>
        </div>
        <div className="border rounded-xl p-4 bg-card flex gap-3 items-start">
          <div className="p-2 bg-green-500/10 rounded-lg shrink-0">
            <Zap className="w-5 h-5 text-green-500" />
          </div>
          <div>
            <p className="font-semibold text-sm">Server-side Cache</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              In-memory caching keeps evaluation latency under 1 ms.
            </p>
          </div>
        </div>
      </div>

      {/* Docs Layout */}
      <div className="flex gap-6">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col gap-1 w-48 shrink-0">
          {SECTIONS.map(s => {
            const Icon = s.icon
            const active = s.id === activeSection
            return (
              <button
                key={s.id}
                id={`sdk-nav-${s.id}`}
                onClick={() => setActiveSection(s.id)}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-left transition-colors w-full ${
                  active
                    ? "bg-primary text-primary-foreground font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="flex-1">{s.label}</span>
                {active && <ChevronRight className="w-3.5 h-3.5 shrink-0" />}
              </button>
            )
          })}
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Mobile: section tabs */}
          <div className="md:hidden">
            <Tabs
              value={activeSection}
              onValueChange={v => setActiveSection(v as SectionId)}
            >
              <TabsList className="h-auto flex-wrap gap-1">
                {SECTIONS.map(s => (
                  <TabsTrigger key={s.id} value={s.id} className="text-xs">
                    {s.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Section description card */}
          <div className="border rounded-xl p-4 bg-card flex items-start gap-3">
            <div className="p-1.5 bg-primary/10 rounded-md shrink-0 mt-0.5">
              <currentSection.icon className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-sm">{currentSection.label}</h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                {currentSection.description}
              </p>
            </div>
          </div>

          {/* Language tabs + code */}
          <Tabs
            value={language}
            onValueChange={v => setLanguage(v as LangId)}
          >
            <TabsList className="h-auto flex-wrap gap-1 bg-muted p-1 rounded-xl">
              {SDK_LANGUAGES.map(lang => (
                <TabsTrigger
                  key={lang.id}
                  value={lang.id}
                  id={`sdk-lang-${lang.id}`}
                  className="text-xs font-medium"
                >
                  {lang.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {SDK_LANGUAGES.map(lang => (
              <TabsContent key={lang.id} value={lang.id} className="mt-3">
                <CodeBlock
                  code={SNIPPETS[activeSection][lang.id]}
                  blockId={`copy-${activeSection}-${lang.id}`}
                />
              </TabsContent>
            ))}
          </Tabs>

          {/* API Reference table — shown only on the Evaluate section */}
          {activeSection === "evaluate" && (
            <div className="border rounded-xl bg-card overflow-hidden">
              <div className="px-4 py-3 border-b bg-muted/40 flex items-center gap-2">
                <Code2 className="w-4 h-4 text-primary" />
                <h3 className="font-semibold text-sm">
                  API Reference — <code className="font-mono text-xs">POST /api/flags/evaluate</code>
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Parameter
                      </th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Required
                      </th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {API_PARAMS.map((row, idx) => (
                      <tr key={row.param} className={idx < API_PARAMS.length - 1 ? "border-b" : ""}>
                        <td className="px-4 py-3 font-mono text-xs text-primary font-semibold">
                          {row.param}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                          {row.type}
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            variant={row.required ? "default" : "outline"}
                            className="text-xs"
                          >
                            {row.required ? "required" : "optional"}
                          </Badge>
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
