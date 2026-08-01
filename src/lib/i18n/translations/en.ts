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

  // ── Projects Page ────────────────────────────────────────────────────────────
  projects: {
    title: "Projects",
    subtitle: "Manage your workspaces and products.",
    newProject: "New Project",
    allProjects: "All Projects",
    allProjectsDesc: "A list of all projects you have access to.",
    noProjects: "No projects found. Create one to get started.",
    colCode: "Code",
    colName: "Name",
    colStatus: "Status",
    colOwner: "Owner",
    colCreatedAt: "Created At",
    unknown: "Unknown",
  },

  // ── Features Page ────────────────────────────────────────────────────────────
  features: {
    title: "Features",
    subtitle: "Manage epics, features, and tasks across projects.",
    newFeature: "New Feature",
    allFeatures: "All Features",
    allFeaturesDesc: "A list of features across all projects.",
    noFeatures: "No features found. Create one to get started.",
    colProject: "Project",
    colTitle: "Title",
    colStatus: "Status",
    colPriority: "Priority",
    colAssignee: "Assignee",
    unassigned: "Unassigned",
  },

  // ── Releases Page ────────────────────────────────────────────────────────────
  releases: {
    title: "Releases",
    subtitle: "Manage your product releases and versions.",
    newRelease: "New Release",
    allReleases: "All Releases",
    noReleases: "No releases found. Create one to get started.",
    colProject: "Project",
    colVersion: "Version",
    colName: "Name",
    colStatus: "Status",
    colType: "Type",
  },

  // ── Bugs Page ────────────────────────────────────────────────────────────────
  bugs: {
    title: "Bugs",
    subtitle: "Track and manage issues across projects.",
    reportBug: "Report Bug",
    allBugs: "All Bugs",
    noBugs: "No bugs found.",
    colProject: "Project",
    colTitle: "Title",
    colStatus: "Status",
    colSeverity: "Severity",
    colReporter: "Reporter",
    unknown: "Unknown",
  },

  // ── Sprint Board ─────────────────────────────────────────────────────────────
  sprint: {
    title: "Sprint Board",
    subtitle: "Kanban view of all features by status.",
    colBacklog: "Backlog",
    colPlanned: "Planned",
    colInProgress: "In Progress",
    colReview: "Review",
    colTesting: "Testing",
    colReady: "Ready",
    colReleased: "Released",
    unassigned: "Unassigned",
  },

  // ── Audit Logs Page ──────────────────────────────────────────────────────────
  auditLogs: {
    title: "Audit Log",
    subtitle: "A complete history of all flag and configuration changes.",
    totalEvents: "Total Events",
    created: "Created",
    deleted: "Deleted",
    searchPlaceholder: "Search by action, user, or flag key…",
    refresh: "Refresh",
    noLogsFound: "No audit logs found",
    noLogsDesc: "Changes to flags and configurations will appear here.",
    colAction: "Action",
    colFlag: "Flag",
    colPerformedBy: "Performed By",
    colTimestamp: "Timestamp",
    detailTitle: "Audit Log Detail",
    labelAction: "Action",
    labelPerformedBy: "Performed By",
    labelFlag: "Flag",
    labelTimestamp: "Timestamp",
    labelOldValue: "Old Value",
    labelNewValue: "New Value",
    justNow: "just now",
  },

  // ── Groups Page ──────────────────────────────────────────────────────────────
  groups: {
    title: "Groups",
    subtitle: "Manage user groups for targeted feature flag rollouts.",
    newGroup: "New Group",
    totalGroups: "Total Groups",
    totalMembers: "Total Members",
    searchPlaceholder: "Search groups by name or description…",
    refresh: "Refresh",
    noGroupsSearch: "No groups match your search",
    noGroupsYet: "No groups yet",
    noGroupsSearchHint: "Try a different keyword.",
    noGroupsHint: "Create a group to start targeting users by group membership.",
    createFirstGroup: "Create First Group",
    member: "member",
    members: "members",
    more: "more",
    createTitle: "Create New Group",
    editTitle: "Edit Group",
    labelGroupName: "Group Name",
    labelDescription: "Description",
    labelMemberIds: "Member IDs",
    placeholderName: "e.g. beta-users, internal-team",
    placeholderDescription: "Optional description of this group's purpose",
    placeholderMembers: "Comma-separated user IDs, e.g. user_1, user_2, user_3",
    memberIdsHint: "Enter the user IDs of members, separated by commas.",
    cancel: "Cancel",
    creating: "Creating…",
    createGroup: "Create Group",
    saving: "Saving…",
    saveChanges: "Save Changes",
    deleteTitle: "Delete",
    deleteDesc: "This action cannot be undone. Any feature flag targeting rules that reference this group name will stop matching new requests.",
    deleteGroup: "Delete Group",
    groupCreated: "created",
    groupUpdated: "Group updated successfully",
    groupDeleted: "deleted",
  },
} as const

export type Translations = typeof en
export default en
