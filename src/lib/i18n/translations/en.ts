const en = {
  // ── Navigation ───────────────────────────────────────────────────────────────
  nav: {
    signIn: "Sign In",
    getStarted: "Get Started",
  },

  // ── Landing Page ─────────────────────────────────────────────────────────────
  landing: {
    badge: "Ship better software, faster.",
    hero: "The Ultimate Control Center for Your Software",
    heroSub:
      "FeatureFlow brings projects, features, sprint boards, releases, and bug tracking into one beautiful, lightning-fast platform.",
    startFree: "Start for free",
    signIn: "Sign In",

    featuresHeading: "Everything you need to build",
    featuresSub: "Replace your entire disjointed toolchain with one elegant solution.",

    feature1Title: "Project Spaces",
    feature1Desc:
      "Organize your entire portfolio with isolated project workspaces and real-time metrics.",
    feature2Title: "Sprint Boards",
    feature2Desc:
      "Drag and drop your features across highly responsive agile sprint boards.",
    feature3Title: "Release Control",
    feature3Desc:
      "Plan, track, and deploy your software versions with integrated release management.",
    feature4Title: "Bug Tracking",
    feature4Desc:
      "Capture, prioritize, and squash bugs directly linked to your features and releases.",

    securityHeading: "Enterprise-grade isolation",
    securityDesc:
      "Built on top of PostgreSQL with native Row-Level Security. Every piece of your data is mathematically isolated and secure from the ground up.",
    createWorkspace: "Create your workspace",

    footerTagline: "Built for modern software teams.",
  },

  // ── Dashboard Sidebar ─────────────────────────────────────────────────────────
  sidebar: {
    workspace: "Workspace",
    featureFlags: "Feature Flags",
    settings: "Settings",

    dashboard: "Dashboard",
    projects: "Projects",
    features: "Features",
    releases: "Releases",
    bugs: "Bugs",
    sprintBoard: "Sprint Board",
    groups: "Groups",
    auditLogs: "Audit Logs",
    sdkDocs: "SDK Docs",
  },

  // ── User Menu ────────────────────────────────────────────────────────────────
  userMenu: {
    settings: "Settings",
    signOut: "Sign out",
  },

  // ── Dashboard Home ───────────────────────────────────────────────────────────
  dashboard: {
    title: "Dashboard",
    subtitle: "Welcome to FeatureFlow. Here is an overview of your workspace.",

    totalProjects: "Total Projects",
    activeFeatures: "Active Features",
    plannedReleases: "Planned Releases",
    openBugs: "Open Bugs",

    recentBugs: "Recent Bugs",
    noBugs: "No active bugs right now!",
    upcomingReleases: "Upcoming Releases",
    noReleases: "No upcoming releases scheduled.",
  },

  // ── Settings Page ────────────────────────────────────────────────────────────
  settings: {
    title: "Settings",
    subtitle: "Manage your account settings and preferences.",

    appearance: "Appearance",
    appearanceDesc: "Customize the look and feel of the application.",
    theme: "Theme",
    themeDesc: "Switch between light and dark mode.",

    language: "Language",
    languageDesc: "Choose your preferred display language.",
    selectLanguage: "Select language",
    languageSaved: "Language updated successfully",

    profile: "Profile Information",
    profileDesc: "Update your display name. Changes are saved to your account immediately.",
    fullName: "Full Name",
    namePlaceholder: "Your display name",
    emailAddress: "Email Address",
    emailNote: "Email cannot be changed here. Contact your administrator.",
    saveChanges: "Save Changes",
    saving: "Saving…",
    profileSaved: "Profile updated successfully",

    security: "Account Security",
    securityDesc: "Your account is secured via Supabase Auth.",
    authProvider: "Authentication Provider",
    authProviderValue: "Email & Password via Supabase Auth",
    active: "Active",
  },

  // ── Language Switcher ────────────────────────────────────────────────────────
  languageSwitcher: {
    label: "Language",
  },
} as const

export type Translations = typeof en
export default en
