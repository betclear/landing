export const SITE = {
  name: "BetClear",
  tagline: "Block gambling websites on iPhone.",
  description:
    "BetClear blocks access to gambling websites across your iPhone, making it harder to place another bet when the urge hits.",
  longDescription:
    "Block 300,000+ gambling websites across your iPhone. Install BetClear once, stay protected automatically, and start with a 7-day free trial.",
  email: "hello@betclear.app",
  url: "https://betclear.app",
  ctaPrimary: "Start Free Protection",
  ctaSecondary: "See How It Works",
  ctaMicrocopy: "Personalized setup, then a 7-day free trial.",
  startHref: "/onboarding/spend",
  installHref: "/install",
} as const;

export const NAV_LINKS = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#protection", label: "Protection" },
  { href: "/#pricing", label: "Pricing" },
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

export const HOW_IT_WORKS_STEPS = [
  {
    id: "open",
    label: "You open a gambling website",
    description: "An urge can turn into a bet within seconds.",
  },
  {
    id: "block",
    label: "BetClear blocks access",
    description: "The website fails to load before you reach the betting page.",
  },
  {
    id: "pause",
    label: "You get time to step away",
    description: "The immediate path to another bet is interrupted.",
  },
] as const;

export const CORE_FEATURES = [
  {
    id: "blocks",
    title: "Blocks gambling websites",
    description: "Known gambling domains stop loading before the page opens.",
  },
  {
    id: "active",
    title: "Always active",
    description: "No blocking session needs to be started each time.",
  },
  {
    id: "updated",
    title: "Automatically updated",
    description: "New gambling domains can be added centrally.",
  },
  {
    id: "gambling",
    title: "Built specifically for gambling",
    description:
      "The blocklist focuses on betting, casino, lottery, poker, and related gambling services.",
  },
] as const;

export const INSTALLATION_STEPS = [
  {
    step: "1",
    title: "Open BetClear on your iPhone",
    detail: "Use Safari so the configuration profile can download correctly.",
  },
  {
    step: "2",
    title: "Download the BetClear configuration profile",
    detail: "BetClear prepares the profile that enables website blocking.",
  },
  {
    step: "3",
    title: "Approve the profile in iPhone Settings",
    detail: "Go to Settings → General → VPN & Device Management, then install.",
  },
  {
    step: "4",
    title: "Confirm that protection is active",
    detail: "Try a known gambling website. It should fail to load.",
  },
] as const;

export const PRICING_FEATURES = [
  "Gambling website blocking",
  "Automatic blocklist updates",
  "Guided iPhone installation",
  "Personalized recovery estimates",
  "Future progress tracking",
  "Future accountability features",
] as const;

export const FAQ_ITEMS = [
  {
    question: "Does BetClear block all gambling websites?",
    answer:
      "BetClear blocks a large, gambling-focused list of domains that is updated over time. No blocker can guarantee that every gambling service will always be inaccessible, but BetClear is built to cover known betting, casino, lottery, poker, and related sites.",
  },
  {
    question: "Does it work in Safari?",
    answer:
      "Yes. BetClear works with Safari and other apps that use your iPhone’s system DNS settings.",
  },
  {
    question: "Does it block gambling apps?",
    answer:
      "BetClear blocks gambling websites by domain. Native App Store apps are not removed. Apps that load content through blocked domains may fail, but app blocking is not a guaranteed product claim.",
  },
  {
    question: "Can BetClear see my browsing history?",
    answer:
      "BetClear does not need Safari browsing history to block gambling domains. The service receives domain lookups needed to answer DNS requests, not the full contents of pages you visit.",
  },
  {
    question: "Can BetClear access my photos, messages, or passwords?",
    answer:
      "No. The configuration profile does not grant access to photos, messages, passwords, or personal files.",
  },
  {
    question: "Why does BetClear use an iPhone configuration profile?",
    answer:
      "A configuration profile is how BetClear applies system-wide website blocking on iPhone without asking you to open a separate blocker app each time.",
  },
  {
    question: "Can the profile be removed?",
    answer:
      "Yes. Go to Settings → General → VPN & Device Management, select BetClear Protection, and remove it. Blocking ends when the profile is deleted.",
  },
  {
    question: "How is the gambling blocklist updated?",
    answer:
      "BetClear updates the gambling blocklist centrally. New domains can be added without asking you to reinstall the profile.",
  },
  {
    question: "Will normal websites still work?",
    answer:
      "Yes. Everyday websites should continue to work. Only domains identified as gambling-related are intended for blocking.",
  },
  {
    question: "What happens after the 7-day trial?",
    answer:
      "Your trial converts to the plan you selected at checkout unless you cancel before the trial ends.",
  },
  {
    question: "How do I cancel?",
    answer:
      "Cancel from the billing portal or by contacting support before renewal. You can also remove the profile from iPhone Settings to end blocking on that device.",
  },
  {
    question: "Is BetClear a replacement for professional support?",
    answer:
      "No. BetClear is a gambling website blocker. If you need clinical or crisis support, please use qualified professionals and local responsible-gambling resources.",
  },
] as const;
