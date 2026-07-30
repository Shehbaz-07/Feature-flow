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

// ─── Code snippets per language ───────────────────────────────────────────────

const SDK_LANGUAGES = [
  { id: "python",     label: "Python",     icon: "🐍" },
  { id: "javascript", label: "JavaScript", icon: "🟨" },
  { id: "typescript", label: "TypeScript", icon: "🔷" },
  { id: "go",         label: "Go",         icon: "🐹" },
  { id: "java",       label: "Java",       icon: "☕" },
  { id: "ruby",       label: "Ruby",       icon: "💎" },
  { id: "curl",       label: "cURL",       icon: "🌐" },
]

const SNIPPETS: Record<string, Record<string, string>> = {
  installation: {
    python: `pip install featureflow-sdk`,
    javascript: `npm install @featureflow/sdk`,
    typescript: `npm install @featureflow/sdk`,
    go: `go get github.com/featureflow/sdk-go`,
    java: `// Add to your pom.xml
<dependency>
  <groupId>io.featureflow</groupId>
  <artifactId>featureflow-sdk</artifactId>
  <version>1.0.0</version>
</dependency>`,
    ruby: `gem install featureflow-sdk`,
    curl: `# No installation needed – use curl directly`,
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

import (
  "github.com/featureflow/sdk-go"
)

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
    curl: `# Set your environment ID as a variable:
export ENV_ID="your-environment-id"
export API_URL="https://your-app.vercel.app"`,
  },

  evaluate: {
    python: `# Basic flag evaluation
is_enabled = client.is_enabled(
    flag_key="new-checkout-flow",
    user_id="user_123",
    groups=["beta-users"],
)

if is_enabled:
    print("New checkout flow is ON")
else:
    print("Showing old checkout flow")`,
    javascript: `// Basic flag evaluation
const isEnabled = await client.isEnabled("new-checkout-flow", {
  userId: "user_123",
  groups: ["beta-users"],
});

if (isEnabled) {
  console.log("New checkout flow is ON");
} else {
  console.log("Showing old checkout flow");
}`,
    typescript: `// With full type safety
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
boolean isEnabled = client.isEnabled("new-checkout-flow",
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

puts enabled ? "New checkout flow is ON" : "Showing old checkout"`,
    curl: `curl -s -X POST "$API_URL/api/flags/evaluate" \\
  -H "Content-Type: application/json" \\
  -d '{
    "flagKey": "new-checkout-flow",
    "environmentId": "'"$ENV_ID"'",
    "userId": "user_123",
    "groups": ["beta-users"]
  }'`,
  },

  rollout: {
    python: `# The SDK automatically handles percentage rollouts.
# Users are deterministically bucketed — pass a stable userId.

# 10% rollout example — only 10% of users will see True
is_enabled = client.is_enabled(
    flag_key="dark-mode-v2",
    user_id="user_abc",  # Stable ID ensures consistent bucketing
)

# The same user will ALWAYS get the same result.`,
    javascript: `// Percentage rollout is handled server-side.
// Pass a consistent userId so the same user always gets the same result.

const isEnabled = await client.isEnabled("dark-mode-v2", {
  userId: "user_abc", // must be stable across sessions
});

// user_abc will always see the same result (deterministic hashing)`,
    typescript: `// Percentage rollout is transparent to SDK consumers.
// The server uses deterministic hashing: hash(flagKey + userId) % 100
// If the result < rolloutPercentage, the flag returns true.

const isEnabled = await client.isEnabled("dark-mode-v2", {
  userId: req.user.id, // use a stable, persistent user identifier
});`,
    go: `// Rollouts are server-side. Pass a stable UserID.
// The server hashes (flagKey + userId) to bucket the user deterministically.

enabled, _ := client.IsEnabled("dark-mode-v2", featureflow.Context{
  UserID: "user_abc",
})`,
    java: `// Rollout percentage is configured in the FeatureFlow dashboard.
// Pass a stable userId for consistent bucketing.

boolean enabled = client.isEnabled("dark-mode-v2",
  EvaluationContext.builder().userId("user_abc").build()
);`,
    ruby: `# The rollout engine uses deterministic hashing server-side.
# Pass a stable user_id to ensure consistent results per user.

enabled = client.enabled?("dark-mode-v2", user_id: "user_abc")`,
    curl: `# The server returns consistent results for the same userId.
# No special params needed — just include userId.

curl -s -X POST "$API_URL/api/flags/evaluate" \\
  -H "Content-Type: application/json" \\
  -d '{
    "flagKey": "dark-mode-v2",
    "environmentId": "'"$ENV_ID"'",
    "userId": "user_abc"
  }'`,
  },
}

const SECTIONS = [
  { id: "installation", label: "Installation",  icon: Terminal,    description: "Install the SDK for your language." },
  { id: "initialize",   label: "Initialize",    icon: Server,      description: "Configure the client with your environment." },
  { id: "evaluate",     label: "Evaluate Flag", icon: Zap,         description: "Check if a flag is enabled for a user/group." },
  { id: "rollout",      label: "Rollout",       icon: FlaskConical,description: "Understand deterministic percentage rollouts." },
]

// ─── CodeBlock ────────────────────────────────────────────────────────────────
function CodeBlock({ code, id }: { code: string; id: string }) {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    toast.success("Copied to clipboard!")
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative group/code">
      <pre className="bg-zinc-950 dark:bg-zinc-900 text-zinc-100 rounded-xl p-5 text-sm overflow-x-auto leading-relaxed border border-zinc-800">
        <code>{code}</code>
      </pre>
      <Button
        id={id}
        variant="outline"
        size="sm"
        onClick={copy}
        className="absolute top-3 right-3 opacity-0 group-hover/code:opacity-100 transition-opacity bg-zinc-800 border-zinc-700 text-zinc-100 hover:bg-zinc-700 hover:text-zinc-100"
      >
        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
        {copied ? "Copied!" : "Copy"}
      </Button>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function SDKDocsPage() {
  const [activeSection, setActiveSection] = useState("installation")
  const [language, setLanguage] = useState("javascript")

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
            Integrate FeatureFlow into your application in minutes. Supports 6+ languages.
          </p>
        </div>
      </div>

      {/* Language badges */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-sm text-muted-foreground mr-1">Supported languages:</span>
        {SDK_LANGUAGES.map(lang => (
          <Badge key={lang.id} variant="secondary" className="text-xs cursor-default">
            {lang.icon} {lang.label}
          </Badge>
        ))}
      </div>

      {/* Quick Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="border rounded-xl p-4 bg-card flex gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg shrink-0"><Globe className="w-5 h-5 text-blue-500" /></div>
          <div>
            <p className="font-semibold text-sm">REST API</p>
            <p className="text-xs text-muted-foreground mt-0.5">HTTP endpoint compatible with any language or framework.</p>
          </div>
        </div>
        <div className="border rounded-xl p-4 bg-card flex gap-3">
          <div className="p-2 bg-purple-500/10 rounded-lg shrink-0"><Layers className="w-5 h-5 text-purple-500" /></div>
          <div>
            <p className="font-semibold text-sm">Deterministic Rollouts</p>
            <p className="text-xs text-muted-foreground mt-0.5">Consistent bucketing per user — no random flip-flopping.</p>
          </div>
        </div>
        <div className="border rounded-xl p-4 bg-card flex gap-3">
          <div className="p-2 bg-green-500/10 rounded-lg shrink-0"><Zap className="w-5 h-5 text-green-500" /></div>
          <div>
            <p className="font-semibold text-sm">Cached Responses</p>
            <p className="text-xs text-muted-foreground mt-0.5">Server-side caching for &lt;1ms evaluation latency.</p>
          </div>
        </div>
      </div>

      {/* Docs Body */}
      <div className="flex gap-6">
        {/* Sidebar nav */}
        <aside className="hidden md:flex flex-col gap-1 w-48 shrink-0">
          {SECTIONS.map(s => {
            const Icon = s.icon
            const active = activeSection === s.id
            return (
              <button
                key={s.id}
                id={`sdk-nav-${s.id}`}
                onClick={() => setActiveSection(s.id)}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-left transition-colors ${
                  active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {s.label}
                {active && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
              </button>
            )
          })}
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Mobile section tabs */}
          <div className="md:hidden">
            <Tabs value={activeSection} onValueChange={setActiveSection}>
              <TabsList className="flex flex-wrap h-auto gap-1">
                {SECTIONS.map(s => (
                  <TabsTrigger key={s.id} value={s.id} className="text-xs">
                    {s.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Description */}
          <div className="border rounded-xl p-4 bg-card">
            <div className="flex items-center gap-2 mb-1">
              {(() => {
                const s = SECTIONS.find(x => x.id === activeSection)
                if (!s) return null
                const Icon = s.icon
                return <>
                  <Icon className="w-4 h-4 text-primary" />
                  <h2 className="font-semibold">{s.label}</h2>
                </>
              })()}
            </div>
            <p className="text-sm text-muted-foreground">
              {SECTIONS.find(x => x.id === activeSection)?.description}
            </p>
          </div>

          {/* Language Tabs */}
          <Tabs value={language} onValueChange={setLanguage}>
            <TabsList className="flex-wrap h-auto gap-1 bg-muted p-1">
              {SDK_LANGUAGES.map(lang => (
                <TabsTrigger key={lang.id} value={lang.id} id={`sdk-lang-${lang.id}`} className="text-xs gap-1.5">
                  <span>{lang.icon}</span>
                  {lang.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {SDK_LANGUAGES.map(lang => (
              <TabsContent key={lang.id} value={lang.id} className="mt-3">
                <CodeBlock
                  code={SNIPPETS[activeSection]?.[lang.id] ?? "// Coming soon"}
                  id={`copy-${activeSection}-${lang.id}`}
                />
              </TabsContent>
            ))}
          </Tabs>

          {/* API reference */}
          {activeSection === "evaluate" && (
            <div className="border rounded-xl bg-card overflow-hidden">
              <div className="p-4 border-b bg-muted/40">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-primary" />
                  <h3 className="font-semibold text-sm">API Reference — POST /api/flags/evaluate</h3>
                </div>
              </div>
              <div className="p-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left">
                      <th className="pb-2 text-xs text-muted-foreground uppercase tracking-wider">Parameter</th>
                      <th className="pb-2 text-xs text-muted-foreground uppercase tracking-wider">Type</th>
                      <th className="pb-2 text-xs text-muted-foreground uppercase tracking-wider">Required</th>
                      <th className="pb-2 text-xs text-muted-foreground uppercase tracking-wider">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {[
                      { param: "flagKey",       type: "string",   req: true,  desc: "The unique key of the feature flag." },
                      { param: "environmentId", type: "UUID",     req: true,  desc: "The target environment's UUID." },
                      { param: "userId",        type: "string",   req: false, desc: "Stable user identifier for targeting & rollouts." },
                      { param: "groups",        type: "string[]", req: false, desc: "Array of group names the user belongs to." },
                    ].map(row => (
                      <tr key={row.param} className="hover:bg-muted/30">
                        <td className="py-2.5 font-mono text-xs text-primary">{row.param}</td>
                        <td className="py-2.5 font-mono text-xs text-muted-foreground">{row.type}</td>
                        <td className="py-2.5">
                          <Badge variant={row.req ? "default" : "outline"} className="text-xs">
                            {row.req ? "required" : "optional"}
                          </Badge>
                        </td>
                        <td className="py-2.5 text-sm text-muted-foreground">{row.desc}</td>
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
