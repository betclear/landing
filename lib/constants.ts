export const SITE = {
  name: "BetClear",
  tagline: "Stop Gambling. Without Fighting Yourself.",
  description:
    "Block gambling sites on your iPhone with Apple configuration profiles. Temptation gone before it starts.",
  longDescription:
    "BetClear blocks gambling websites on your iPhone using Apple's built-in configuration profiles, helping you remove temptation before it starts.",
  email: "hello@betclear.app",
  url: "https://betclear.app",
} as const;

export const NAV_LINKS = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#why", label: "Features" },
  { href: "#faq", label: "FAQ" },
  { href: "/pricing", label: "Pricing" },
] as const;

export const FOOTER_LINKS = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "mailto:hello@betclear.app", label: "Support" },
] as const;

export const HOW_IT_WORKS = [
  {
    title: "Download",
    description: "Get your personalized protection profile.",
  },
  {
    title: "Install",
    description: "Add it in Settings in under a minute.",
  },
  {
    title: "Stay protected",
    description: "Gambling sites stay blocked across your iPhone.",
  },
] as const;

export const FEATURES = [
  {
    title: "Thousands of domains blocked",
    description:
      "Sportsbooks, casinos, and betting apps stay covered as new sites appear.",
    tone: "primary" as const,
  },
  {
    title: "System-wide",
    description:
      "Works in Safari and apps that open the web, not just one browser.",
    tone: "surface" as const,
  },
  {
    title: "Fast install",
    description: "One profile through Apple Settings. No accounts to manage.",
    tone: "surface" as const,
  },
  {
    title: "No VPN",
    description:
      "Uses Apple configuration profiles, not a VPN. Your connection stays fast.",
    tone: "dark" as const,
  },
] as const;

export const INSTALLATION_STEPS = [
  { label: "Purchase", detail: "Choose the protection that fits your goals." },
  { label: "Download profile", detail: "Receive your personalized .mobileconfig file." },
  { label: "Install", detail: "Confirm in Settings with a few taps." },
  { label: "Protected", detail: "Gambling sites stay out of reach." },
] as const;

export const FAQ_ITEMS = [
  {
    question: "How does it work?",
    answer:
      "BetClear provides an Apple configuration profile that tells your iPhone to block known gambling domains. Once installed, those sites become inaccessible system-wide, so temptation is removed at the network level instead of relying on willpower alone.",
  },
  {
    question: "Can I uninstall it?",
    answer:
      "Yes. Remove the profile anytime from Settings → General → VPN & Device Management. Protection ends as soon as the profile is deleted.",
  },
  {
    question: "Does it collect browsing history?",
    answer:
      "No. BetClear does not monitor, log, or transmit your browsing history. Blocking happens on-device through Apple's configuration profile system.",
  },
  {
    question: "Does it slow my internet?",
    answer:
      "No. BetClear is not a VPN and does not route your traffic through a third-party server. Normal browsing stays as fast as usual. Only blocked domains are prevented from loading.",
  },
] as const;
