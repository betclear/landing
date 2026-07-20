export const SITE = {
  name: "BetClear",
  tagline: "Stop Gambling. Without Fighting Yourself.",
  description:
    "BetClear blocks gambling websites on your iPhone using Apple's built-in configuration profiles—helping you remove temptation before it starts.",
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
    step: "01",
    title: "Download",
    description: "Download your personalized protection profile.",
  },
  {
    step: "02",
    title: "Install",
    description: "Install it in Settings in less than a minute.",
  },
  {
    step: "03",
    title: "Stay Protected",
    description: "Gambling websites become inaccessible across your iPhone.",
  },
] as const;

export const FEATURES = [
  {
    title: "Blocks thousands of gambling domains",
    description:
      "A curated blocklist that covers sportsbooks, casinos, and betting apps—updated as new sites appear.",
  },
  {
    title: "Works system-wide",
    description:
      "Protection applies across Safari and apps that open the web, not just a single browser extension.",
  },
  {
    title: "Fast installation",
    description:
      "Install once through Apple Settings. No accounts to babysit and no complicated setup flow.",
  },
  {
    title: "No VPN required",
    description:
      "Uses Apple configuration profiles—not a VPN—so your connection stays fast and private.",
  },
] as const;

export const INSTALLATION_STEPS = [
  { label: "Purchase", detail: "Choose protection that fits your goals." },
  { label: "Download Profile", detail: "Get your personalized .mobileconfig file." },
  { label: "Install", detail: "Confirm in Settings with a few taps." },
  { label: "Protected", detail: "Gambling sites stay out of reach." },
] as const;

export const FAQ_ITEMS = [
  {
    question: "How does it work?",
    answer:
      "BetClear provides an Apple configuration profile that instructs your iPhone to block known gambling domains. Once installed, those sites become inaccessible system-wide—removing temptation at the network level instead of relying on willpower alone.",
  },
  {
    question: "Can I uninstall it?",
    answer:
      "Yes. You can remove the profile anytime from Settings → General → VPN & Device Management. Protection ends as soon as the profile is deleted.",
  },
  {
    question: "Does it collect browsing history?",
    answer:
      "No. BetClear does not monitor, log, or transmit your browsing history. Blocking happens on-device through Apple's configuration profile system.",
  },
  {
    question: "Does it slow my internet?",
    answer:
      "No. Because BetClear is not a VPN and does not route your traffic through a third-party server, normal browsing stays as fast as usual. Only blocked domains are prevented from loading.",
  },
] as const;
