import type { GuidesModule } from "./types";

const PUBLISHED = "2026-01-15";
const MODIFIED = "2026-07-21";

export const guidesEn: GuidesModule = {
  ui: {
    eyebrow: "Guides",
    hubTitle: "How to stop gambling — practical guides",
    hubDescription:
      "Straightforward, judgment-free guides on how to stop gambling online, block betting sites on your iPhone, and take back your time and money.",
    breadcrumbHome: "Home",
    breadcrumbGuides: "Guides",
    tldrHeading: "Short answer",
    faqHeading: "Frequently asked questions",
    relatedHeading: "Keep reading",
    backToGuides: "All guides",
    updatedLabel: "Updated",
    minRead: "min read",
    disclaimer:
      "BetClear is a gambling website blocker, not a medical service. If you need clinical or crisis support, contact a qualified professional or a responsible-gambling helpline.",
    readMore: "Read guide",
  },
  guides: {
    "stop-gambling": {
      slug: "how-to-stop-gambling",
      cardTitle: "How to stop gambling",
      title: "How do I stop gambling? A practical step-by-step guide",
      description:
        "A clear, practical guide to stop gambling online: remove access, block betting sites, manage the urge, and get support that actually helps.",
      keywords: [
        "how to stop gambling",
        "how to stop gambling online",
        "how do I stop gambling",
        "how to quit gambling for good",
        "stop gambling addiction",
      ],
      datePublished: PUBLISHED,
      dateModified: MODIFIED,
      hero: "You don't need willpower alone. You need fewer chances to place the next bet.",
      tldr: [
        "Remove easy access first: block gambling websites on every device so the next bet is harder to reach.",
        "Cut the money path: turn off card deposits, use bank gambling blocks, and remove saved payment details.",
        "Have a plan for the urge: urges peak and pass, usually within 15–30 minutes. Delay and distract.",
        "Get support: tell someone you trust, and use a gambling helpline or self-exclusion scheme.",
      ],
      sections: [
        {
          heading: "1. Make gambling harder to reach",
          body: [
            "The single most effective first step is to add friction between the urge and the bet. When a gambling site loads in one tap, the decision is made in seconds. When it doesn't load at all, you get time to think.",
            "Block gambling websites across your phone at the DNS level so the block applies in Safari and other apps, not just one browser. On iPhone, a tool like BetClear installs a configuration profile that blocks known gambling domains system-wide and updates automatically.",
          ],
        },
        {
          heading: "2. Close the money routes",
          body: [
            "Access is only half of it — money is the other half. Removing quick deposit routes buys you the same pause that blocking sites does.",
          ],
          bullets: [
            "Ask your bank to enable a gambling transaction block (many banks offer this for free).",
            "Delete saved cards from betting accounts and browsers.",
            "Set up a spending limit or move funds to an account you can't instantly access.",
          ],
        },
        {
          heading: "3. Ride out the urge",
          body: [
            "Cravings feel permanent but they are not. Most urges rise, peak, and fade within 15–30 minutes. Your job is not to win a fight — it's to outlast it.",
            "Have two or three go-to actions ready: leave the room, call a friend, go for a walk, or open a distraction you've pre-chosen. The goal is to be busy while the urge passes.",
          ],
        },
        {
          heading: "4. Tell someone and get support",
          body: [
            "Secrecy keeps gambling alive. Telling one trusted person turns a private battle into a shared one and makes relapse harder to hide.",
            "Free, confidential support exists in most countries. Helplines, peer groups like Gamblers Anonymous, and self-exclusion schemes are all effective and free to use.",
          ],
        },
      ],
      faq: [
        {
          question: "Can I stop gambling on my own?",
          answer:
            "Many people reduce or stop gambling using self-help steps like blocking sites, adding bank blocks, and building new routines. If gambling is affecting your finances, relationships, or mental health, reach out to a helpline or professional — support makes success far more likely.",
        },
        {
          question: "What is the fastest way to stop gambling online?",
          answer:
            "Remove access immediately. Block gambling websites on your phone and computer, enable a bank gambling block, and delete saved payment details. This creates a gap between the urge and the bet while you build longer-term support.",
        },
        {
          question: "How long do gambling urges last?",
          answer:
            "Most urges peak and pass within 15 to 30 minutes. Delaying the decision and distracting yourself is often enough to get through a single craving without acting on it.",
        },
      ],
      cta: {
        title: "Block the next bet before it starts",
        body: "BetClear blocks 348,000+ gambling websites across your iPhone so the urge has nowhere to go. Install once and stay protected automatically.",
        button: "Start free protection",
      },
      related: ["block-iphone", "addiction-signs", "get-help"],
    },
    "block-iphone": {
      slug: "block-gambling-sites-iphone",
      cardTitle: "Block gambling sites on iPhone",
      title: "How to block gambling websites on iPhone (Safari and apps)",
      description:
        "Step-by-step ways to block gambling and betting websites on iPhone across Safari and apps — using Screen Time, and a system-wide DNS blocker that updates automatically.",
      keywords: [
        "how to block gambling sites on iphone",
        "block gambling websites iphone",
        "block betting apps iphone",
        "block gambling websites safari",
        "how to block bet365 on iphone",
      ],
      datePublished: PUBLISHED,
      dateModified: MODIFIED,
      hero: "Block betting sites everywhere on your iPhone — not just in one browser.",
      tldr: [
        "Fastest, most complete: install a system-wide DNS blocker like BetClear that blocks known gambling domains in Safari and apps and updates automatically.",
        "Built-in option: Screen Time > Content & Privacy Restrictions lets you limit adult websites and add specific betting sites, but you must list each site manually.",
        "Browser-only blockers miss apps and are easy to bypass — choose device-wide DNS blocking for real protection.",
      ],
      sections: [
        {
          heading: "Option 1: A system-wide gambling blocker (recommended)",
          body: [
            "The most reliable way to block gambling on iPhone is at the DNS level, which applies across Safari and any app that uses your phone's system DNS. You don't need to keep a list yourself and you don't have to start a session each time.",
            "BetClear installs an Apple configuration profile that points your iPhone to encrypted DNS and blocks 348,000+ known gambling domains. The blocklist is updated centrally, so new betting sites are covered without reinstalling.",
          ],
          bullets: [
            "Works across Safari and supported apps, not one browser.",
            "Always on — no session to start.",
            "Blocklist updates automatically as new gambling domains appear.",
          ],
        },
        {
          heading: "Option 2: Screen Time (built into iOS)",
          body: [
            "iOS has a free built-in restriction you can use to block adult and specific websites.",
          ],
          bullets: [
            "Open Settings > Screen Time > Content & Privacy Restrictions.",
            "Turn on Content & Privacy Restrictions, then tap Content Restrictions > Web Content.",
            "Choose 'Limit Adult Websites', then add betting sites under 'Never Allow'.",
            "Set a Screen Time passcode that someone else holds so you can't quickly undo it.",
          ],
        },
        {
          heading: "Why browser extensions aren't enough",
          body: [
            "Blockers that only work inside one browser leave gambling apps and other browsers wide open, and they're usually a few taps away from being switched off. For gambling specifically, device-wide DNS blocking is much harder to bypass in a moment of temptation.",
          ],
        },
      ],
      faq: [
        {
          question: "Does BetClear block gambling apps too?",
          answer:
            "BetClear blocks gambling by domain, so apps that load content through blocked gambling domains often fail to work. Native App Store apps aren't removed from your phone, but their gambling connections can be blocked.",
        },
        {
          question: "Will blocking gambling sites slow down my iPhone?",
          answer:
            "No. DNS-based blocking simply refuses to resolve gambling domains. Everyday websites and apps continue to work normally.",
        },
        {
          question: "Can I block gambling sites for free on iPhone?",
          answer:
            "Yes, Screen Time is free but requires you to add each site manually and is easier to bypass. A dedicated blocker like BetClear covers hundreds of thousands of domains automatically and updates over time.",
        },
      ],
      cta: {
        title: "Block betting sites across your whole iPhone",
        body: "BetClear blocks 348,000+ gambling websites in Safari and apps using encrypted DNS. Guided setup takes a few minutes.",
        button: "Start free protection",
      },
      related: ["stop-gambling", "betting-games", "self-exclusion"],
    },
    "betting-games": {
      slug: "how-to-stop-sports-betting",
      cardTitle: "How to stop sports betting",
      title: "How to stop sports betting and betting apps",
      description:
        "How to stop sports betting and quit betting apps: block the sites, break the notification loop, remove the money, and rebuild match-day routines.",
      keywords: [
        "how to stop sports betting",
        "how to quit betting apps",
        "stop betting on football",
        "how to stop online sports betting",
        "sports betting addiction help",
      ],
      datePublished: PUBLISHED,
      dateModified: MODIFIED,
      hero: "Sports betting is built to feel harmless. Breaking the loop starts with removing the tap-to-bet path.",
      tldr: [
        "Block betting sites and apps on your phone so live odds can't load during a match.",
        "Turn off all betting notifications and unfollow tipster and odds accounts.",
        "Remove the money path: bank gambling block plus deleted saved cards.",
        "Rebuild match day: watch with people, in places, or in ways that don't involve a bet slip.",
      ],
      sections: [
        {
          heading: "Why sports betting is so hard to quit",
          body: [
            "Sports betting blends a hobby you enjoy with instant, in-play wagering and constant notifications. Every match becomes a trigger, and the 'just one bet' feeling is reinforced by near-misses and cash-out offers designed to keep you engaged.",
            "Because the trigger is tied to something you like — watching sport — you can't simply avoid it. The fix is to make betting itself unavailable while keeping the sport.",
          ],
        },
        {
          heading: "Cut off in-play betting",
          body: [
            "Live betting is where most damage happens, because it turns a 90-minute match into dozens of decisions. Removing access during the game is the highest-impact step.",
          ],
          bullets: [
            "Block betting websites device-wide so live odds pages won't load.",
            "Delete betting apps and turn off their notifications completely.",
            "Mute or unfollow tipsters, odds accounts, and betting group chats.",
          ],
        },
        {
          heading: "Rebuild match day",
          body: [
            "Replace the bet with something the moment used to be about. Watch with friends who don't bet, join a fan chat about the game itself, or set a rule that you only check the score, not the odds. New routines make the old one feel unnecessary.",
          ],
        },
      ],
      faq: [
        {
          question: "How do I stop betting on football?",
          answer:
            "Block betting sites and apps on your devices, turn off odds and betting notifications, add a bank gambling block, and change how you watch — with people or in places where placing a bet isn't easy. Support helplines can help if it feels out of control.",
        },
        {
          question: "Are betting apps designed to be addictive?",
          answer:
            "Betting apps use notifications, in-play odds, cash-out prompts, and free-bet offers to maximise engagement. That's why removing the app and blocking the sites is more effective than relying on self-control during a match.",
        },
      ],
      cta: {
        title: "Make live odds impossible to reach",
        body: "BetClear blocks betting sites across your iPhone so in-play odds can't load when the match is on. Install once and stay protected.",
        button: "Start free protection",
      },
      related: ["block-iphone", "stop-gambling", "addiction-signs"],
    },
    "addiction-signs": {
      slug: "signs-of-gambling-addiction",
      cardTitle: "Signs of gambling addiction",
      title: "Signs of a gambling problem: how to know when to stop",
      description:
        "The common signs of gambling addiction — chasing losses, hiding bets, borrowing money — and what to do next if you recognise them in yourself or someone else.",
      keywords: [
        "signs of gambling addiction",
        "gambling addiction symptoms",
        "am I addicted to gambling",
        "gambling problem signs",
        "how to know if you have a gambling problem",
      ],
      datePublished: PUBLISHED,
      dateModified: MODIFIED,
      hero: "A gambling problem isn't about how much you bet — it's about the control you've lost.",
      tldr: [
        "Warning signs include chasing losses, betting more to feel the same buzz, and being unable to stop.",
        "Hiding gambling, lying about it, or borrowing money to bet are strong red flags.",
        "If gambling is harming your money, relationships, work, or mood, it's time to act — regardless of the amounts.",
      ],
      sections: [
        {
          heading: "Common signs of a gambling problem",
          bullets: [
            "Chasing losses — betting more to win back what you've lost.",
            "Needing to bet larger amounts to feel the same excitement.",
            "Trying to cut back or stop and being unable to.",
            "Feeling restless or irritable when you can't gamble.",
            "Gambling to escape stress, boredom, or low mood.",
            "Lying to family or friends about how much you gamble.",
            "Borrowing money, selling things, or missing bills to fund gambling.",
            "Gambling longer or spending more than you intended.",
          ],
        },
        {
          heading: "It's not about the amount",
          body: [
            "People often tell themselves they don't have a problem because they don't bet 'that much'. But a gambling problem is defined by loss of control and harm, not by a specific figure. If it's costing you sleep, money you can't spare, or trust, the amount is beside the point.",
          ],
        },
        {
          heading: "What to do if you recognise the signs",
          body: [
            "Recognising the pattern is the hard part — and you've already done it. The next steps are practical: remove access, remove the money path, and tell someone.",
          ],
          bullets: [
            "Block gambling sites on your phone to break the automatic habit.",
            "Ask your bank about a gambling transaction block.",
            "Talk to a helpline or a trusted person — you don't have to hit rock bottom first.",
          ],
        },
      ],
      faq: [
        {
          question: "Am I addicted to gambling?",
          answer:
            "If you've tried to stop and couldn't, chase losses, hide your gambling, or it's harming your finances or relationships, those are recognised signs of a gambling problem. A helpline or a short self-assessment can help you understand where you stand.",
        },
        {
          question: "Can you have a gambling problem without betting large amounts?",
          answer:
            "Yes. A gambling problem is about loss of control and the harm it causes, not the size of the bets. Small, frequent bets can still damage your finances, mood, and relationships.",
        },
      ],
      cta: {
        title: "Put a barrier between you and the next bet",
        body: "If you see the signs, make gambling harder to reach today. BetClear blocks 348,000+ gambling websites across your iPhone.",
        button: "Start free protection",
      },
      related: ["stop-gambling", "get-help", "self-exclusion"],
    },
    "self-exclusion": {
      slug: "gambling-self-exclusion",
      cardTitle: "Gambling self-exclusion",
      title: "Gambling self-exclusion: how it works and how to set it up",
      description:
        "What gambling self-exclusion is, how national schemes like GAMSTOP work, and how to combine self-exclusion with device blocking for stronger protection.",
      keywords: [
        "gambling self-exclusion",
        "how to self exclude from gambling",
        "self exclude betting sites",
        "gamstop",
        "block myself from gambling sites",
      ],
      datePublished: PUBLISHED,
      dateModified: MODIFIED,
      hero: "Self-exclusion asks operators to shut you out. Device blocking makes sure they can't reach you either.",
      tldr: [
        "Self-exclusion is a request to gambling operators to block your account and stop marketing to you for a set period.",
        "National schemes (e.g. GAMSTOP in the UK) cover many licensed sites at once.",
        "Self-exclusion doesn't cover unlicensed sites or your own browsing — pair it with a device-wide blocker for full coverage.",
      ],
      sections: [
        {
          heading: "What is self-exclusion?",
          body: [
            "Self-exclusion is a formal request that tells gambling companies to close or freeze your account and stop sending you promotions for a chosen period — often six months to five years. During that time, licensed operators are supposed to refuse your bets.",
          ],
        },
        {
          heading: "How to self-exclude",
          bullets: [
            "Use a national scheme where available (for example, GAMSTOP covers licensed sites in the UK).",
            "Self-exclude directly with each operator you use, through their responsible-gambling settings.",
            "Ask about multi-operator or venue schemes for physical betting shops and casinos.",
          ],
        },
        {
          heading: "The gap self-exclusion leaves — and how to close it",
          body: [
            "Self-exclusion is powerful but not complete. It relies on operators honouring it, doesn't cover unlicensed or offshore sites, and doesn't stop you from browsing to new ones. That's why a device-level block matters: it stops the sites from loading in the first place.",
            "Combining self-exclusion with a blocker like BetClear means the account is closed and the site won't even open — protection from two directions.",
          ],
        },
      ],
      faq: [
        {
          question: "Does self-exclusion block all gambling sites?",
          answer:
            "No. Self-exclusion covers the operators or scheme you signed up with, usually licensed sites. Unlicensed or offshore sites may not be included, which is why pairing it with a device-wide blocker is recommended.",
        },
        {
          question: "Can I undo self-exclusion?",
          answer:
            "Most schemes set a minimum period that can't be cancelled early, followed by a cooling-off step before you can gamble again. That deliberate friction is part of what makes it effective.",
        },
      ],
      cta: {
        title: "Back up self-exclusion with a real block",
        body: "BetClear stops gambling sites from loading on your iPhone, even the ones self-exclusion schemes miss.",
        button: "Start free protection",
      },
      related: ["block-iphone", "stop-gambling", "get-help"],
    },
    "get-help": {
      slug: "where-to-get-help-gambling",
      cardTitle: "Where to get help",
      title: "Where to get help for gambling: free support and helplines",
      description:
        "Free, confidential gambling support: helplines, peer groups like Gamblers Anonymous, and practical steps you can take today to reduce harm.",
      keywords: [
        "gambling help",
        "gambling addiction help",
        "gambling helpline",
        "help to stop gambling",
        "gamblers anonymous",
      ],
      datePublished: PUBLISHED,
      dateModified: MODIFIED,
      hero: "You don't have to fix this alone, and asking for help is not a last resort.",
      tldr: [
        "Free, confidential helplines and peer groups are available in most countries — you can reach out anonymously.",
        "Gamblers Anonymous and similar groups offer peer support with people who understand.",
        "Practical harm reduction — blocking sites, bank blocks, self-exclusion — works best alongside support.",
      ],
      sections: [
        {
          heading: "Free support you can use today",
          bullets: [
            "BeGambleAware (begambleaware.org) — advice and a free confidential helpline.",
            "Gamblers Anonymous (gamblersanonymous.org) — peer support meetings worldwide.",
            "Your national gambling helpline — many offer 24/7 chat and phone support.",
            "Your doctor or a therapist — gambling support is a recognised part of mental health care.",
          ],
        },
        {
          heading: "For friends and family",
          body: [
            "If you're worried about someone else, you can get support too. Approach them without judgment, focus on the behaviour and its impact rather than blame, and point them toward help rather than trying to control the money for them long-term.",
          ],
        },
        {
          heading: "Pair support with practical blocks",
          body: [
            "Support helps you understand and change the behaviour; blocking tools remove the opportunity while you do. Using both together is far more effective than either alone.",
          ],
        },
      ],
      faq: [
        {
          question: "Is gambling support really free and confidential?",
          answer:
            "Yes. National helplines, BeGambleAware, and peer groups like Gamblers Anonymous are free and confidential. You can contact many of them anonymously without giving your details.",
        },
        {
          question: "What if I'm not ready to talk to someone yet?",
          answer:
            "You can still take action today. Blocking gambling sites on your phone, adding a bank gambling block, and self-excluding all reduce harm immediately, and can be a first step before reaching out for support.",
        },
      ],
      cta: {
        title: "Take one practical step now",
        body: "While you decide on support, remove easy access. BetClear blocks 348,000+ gambling websites across your iPhone.",
        button: "Start free protection",
      },
      related: ["stop-gambling", "addiction-signs", "self-exclusion"],
    },
  },
};
