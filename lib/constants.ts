export const SITE = {
  name: "BetClear",
  tagline: "Make gambling unreachable when the urge hits.",
  description:
    "BetClear blocks gambling websites across your iPhone, creating a barrier between an impulse and your next bet.",
  longDescription:
    "BetClear helps block gambling websites across your iPhone, creating protection during moments of temptation with guided setup and a continuously updated gambling blocklist.",
  email: "hello@betclear.app",
  url: "https://betclear.app",
  ctaPrimary: "Start Free Protection",
  ctaSecondary: "See How It Works",
  ctaMicrocopy: "Personalized setup, then a 7-day free trial.",
  startHref: "/onboarding/spend",
} as const;

export const NAV_LINKS = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#protection", label: "Protection" },
  { href: "/#progress", label: "Progress" },
  { href: "/#support", label: "Support" },
  { href: "/#faq", label: "FAQ" },
] as const;

export const FOOTER_PRODUCT_LINKS = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/install", label: "Installation" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#faq", label: "FAQ" },
] as const;

export const FOOTER_SUPPORT_LINKS = [
  { href: "mailto:hello@betclear.app", label: "Contact" },
  { href: "/privacy", label: "Privacy policy" },
  { href: "/terms", label: "Terms" },
  {
    href: "https://www.begambleaware.org/",
    label: "BeGambleAware",
    external: true,
  },
  {
    href: "https://www.gamblersanonymous.org/",
    label: "Gamblers Anonymous",
    external: true,
  },
] as const;

export const TRUST_POINTS = [
  {
    title: "Works across supported iPhone browsers",
    detail: "Protection uses system DNS, so Safari and apps that follow system DNS settings are covered.",
  },
  {
    title: "Continuously updated gambling blocklist",
    detail: "New domains can be added centrally without reinstalling your profile.",
  },
  {
    title: "Guided installation",
    detail: "A clear walkthrough takes you from download to active protection.",
  },
  {
    title: "Privacy-first protection",
    detail: "BetClear does not need your photos, messages, passwords, or browsing history to block gambling domains.",
  },
] as const;

export const BLOCKING_STAGES = [
  {
    id: "urge",
    label: "The urge appears",
    title: "A gambling site is opened",
    description: "In a difficult moment, the next bet can be only a few taps away.",
  },
  {
    id: "barrier",
    label: "BetClear creates a barrier",
    title: "The connection is blocked",
    description: "Protected DNS stops known gambling domains from loading.",
  },
  {
    id: "passes",
    label: "The moment passes without a bet",
    title: "Protection holds",
    description: "You see a clear barrier instead of a betting page — and the impulse has farther to travel.",
  },
] as const;

export const FEATURE_STORIES = [
  {
    id: "block",
    eyebrow: "Access protection",
    headline: "Gambling websites stop loading.",
    copy: "BetClear blocks known gambling domains through protected DNS, helping prevent access across supported browsers on your iPhone.",
  },
  {
    id: "persistent",
    eyebrow: "Always on",
    headline: "Protection should not depend on remembering to switch it on.",
    copy: "Once the configuration profile is installed, BetClear remains active in the background. You do not start a separate blocking session each time.",
  },
  {
    id: "blocklist",
    eyebrow: "Living coverage",
    headline: "New gambling websites do not stay new for long.",
    copy: "BetClear’s protection list can be updated centrally as new gambling domains are identified — without asking you to reinstall.",
  },
  {
    id: "accountability",
    eyebrow: "Coming soon",
    headline: "Make difficult decisions harder to undo alone.",
    copy: "Choose someone you trust to support your commitment and be informed when protection is at risk.",
    comingSoon: true,
  },
] as const;

export const INSTALLATION_STEPS = [
  {
    step: "01",
    title: "Open BetClear on your iPhone",
    detail: "Use Safari on your iPhone so the configuration profile can download correctly.",
  },
  {
    step: "02",
    title: "Download the secure profile",
    detail: "BetClear prepares an Apple configuration profile that points your device at protected DNS.",
  },
  {
    step: "03",
    title: "Approve it in iPhone Settings",
    detail: "Open Settings → General → VPN & Device Management, then install BetClear Protection.",
  },
  {
    step: "04",
    title: "Confirm that protection is active",
    detail: "Try a known gambling website. When protection is working, the site should fail to load.",
  },
] as const;

export const COMPARISON_ROWS = [
  {
    feature: "Works across supported browsers",
    betclear: true,
    extensions: false,
    basicBlockers: "Limited",
    vpnBlockers: true,
    willpower: false,
  },
  {
    feature: "No separate blocking app to open each time",
    betclear: true,
    extensions: false,
    basicBlockers: false,
    vpnBlockers: "Often required",
    willpower: false,
  },
  {
    feature: "Centrally updated gambling list",
    betclear: true,
    extensions: "Varies",
    basicBlockers: false,
    vpnBlockers: "Varies",
    willpower: false,
  },
  {
    feature: "Guided iPhone setup",
    betclear: true,
    extensions: false,
    basicBlockers: false,
    vpnBlockers: "Varies",
    willpower: false,
  },
  {
    feature: "Designed specifically for gambling access",
    betclear: true,
    extensions: false,
    basicBlockers: false,
    vpnBlockers: "Sometimes",
    willpower: false,
  },
  {
    feature: "Progress tracking",
    betclear: "Coming soon",
    extensions: false,
    basicBlockers: false,
    vpnBlockers: false,
    willpower: false,
  },
  {
    feature: "Accountability support",
    betclear: "Coming soon",
    extensions: false,
    basicBlockers: false,
    vpnBlockers: false,
    willpower: false,
  },
] as const;

export const PROTECTION_LAYERS = [
  {
    title: "BetClear gambling website blocking",
    detail: "Immediate layer: known gambling domains become harder to reach on your iPhone.",
    active: true,
  },
  {
    title: "Gambling app removal",
    detail: "Delete betting apps so the path back is longer.",
    active: false,
  },
  {
    title: "Bank gambling transaction blocks",
    detail: "Ask your bank or card issuer to restrict gambling merchants where available.",
    active: false,
  },
  {
    title: "Operator self-exclusion",
    detail: "Use formal self-exclusion tools offered by gambling operators and regulators.",
    active: false,
  },
  {
    title: "Trusted-person accountability",
    detail: "Share your commitment with someone who can support you. Coming soon inside BetClear.",
    active: false,
  },
  {
    title: "Professional support",
    detail: "Counseling and peer support remain important. BetClear is not a replacement for help.",
    active: false,
  },
] as const;

export const PRIVACY_POINTS = [
  {
    title: "No access to photos or messages",
    detail: "The configuration profile sets encrypted DNS. It does not unlock your personal files.",
  },
  {
    title: "No browsing-history product",
    detail: "BetClear does not need to read your browser history to block gambling domains.",
  },
  {
    title: "Encrypted DNS requests",
    detail: "DNS lookups are sent over HTTPS to BetClear’s protected resolver endpoint.",
  },
  {
    title: "Account data stays minimal",
    detail:
      "Recovery answers and billing details stay in your private account. We do not put sensitive onboarding values in public URLs or analytics events.",
  },
] as const;

export const FAQ_ITEMS = [
  {
    question: "How does BetClear block gambling websites?",
    answer:
      "BetClear installs an Apple configuration profile that points your iPhone at encrypted DNS (DNS-over-HTTPS). When a known gambling domain is requested, the protected resolver can refuse to resolve it, so the website does not load.",
  },
  {
    question: "Does BetClear work on every browser?",
    answer:
      "BetClear works with Safari and other apps that use the iPhone’s system DNS settings. Browsers or apps that use their own private DNS may bypass system DNS protection.",
  },
  {
    question: "Does BetClear block gambling apps?",
    answer:
      "BetClear blocks gambling websites by domain. Native App Store apps are not removed by BetClear. Apps that depend on blocked domains may fail to load content, but app blocking itself is not a current product claim.",
  },
  {
    question: "Can BetClear see my browsing history?",
    answer:
      "BetClear does not provide a browsing-history product and does not need access to Safari history. Like any DNS-based service, the resolver receives domain-name lookups needed to answer DNS queries — not the full contents of the pages you visit.",
  },
  {
    question: "Can BetClear see my passwords or messages?",
    answer:
      "No. The profile does not grant access to passwords, messages, photos, or other personal files on your iPhone.",
  },
  {
    question: "Why does BetClear use an iPhone configuration profile?",
    answer:
      "Apple configuration profiles are the supported way to apply managed DNS settings system-wide. That lets protection stay active without opening a separate blocker app each time.",
  },
  {
    question: "Is the profile safe?",
    answer:
      "The profile configures DNS-over-HTTPS to BetClear’s resolver endpoint. You can review it before installing, and you can remove it anytime from Settings. BetClear does not require a VPN profile for this protection.",
  },
  {
    question: "Can I remove BetClear?",
    answer:
      "Yes. Go to Settings → General → VPN & Device Management, select BetClear Protection, and remove the profile. Protection ends when the profile is deleted.",
  },
  {
    question: "What happens when I try to open a gambling website?",
    answer:
      "If the domain is on BetClear’s blocklist and protection is active, the site should fail to load. You see interruption instead of a betting page.",
  },
  {
    question: "How often is the gambling blocklist updated?",
    answer:
      "The blocklist is assembled from multiple gambling-domain sources and can be refreshed centrally. Admin overrides can also update coverage without reinstalling your profile.",
  },
  {
    question: "Will normal websites continue working?",
    answer:
      "Yes. Only domains identified as gambling-related are intended for blocking. Everyday websites should continue to resolve normally.",
  },
  {
    question: "Does BetClear work outside my country?",
    answer:
      "DNS-based website blocking works wherever your iPhone uses the installed DNS settings. Local gambling laws and available support resources still vary by country.",
  },
  {
    question: "Is BetClear a replacement for professional help?",
    answer:
      "No. BetClear is an access-protection tool. If you need clinical or crisis support, please reach out to qualified professionals and local responsible-gambling resources.",
  },
  {
    question: "What happens when my trial ends?",
    answer:
      "Your 7-day free trial converts to the plan you selected at checkout unless you cancel before the trial ends. You can cancel anytime during the trial to avoid being charged.",
  },
  {
    question: "How do I cancel?",
    answer:
      "Cancel your subscription from the billing portal or by contacting support before renewal. You can also remove the configuration profile from iPhone Settings at any time to end protection on that device.",
  },
] as const;

export const PRICING = {
  name: "BetClear Protection",
  status: "7-day free trial",
  priceLabel: "From $2.50/mo",
  cadence: "Billed annually at $29.99, or $3.99 monthly",
  note: "Start with a personalized setup, then begin a 7-day free trial. Cancel anytime before the trial ends to avoid being charged.",
  features: [
    "Gambling website blocking via protected DNS",
    "Centrally updated blocklist",
    "Guided iPhone setup",
    "Personalized progress estimates",
    "Progress dashboard — coming soon",
    "Accountability support — coming soon",
  ],
} as const;
