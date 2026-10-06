import { profile } from "@/data/profile";

export const researchProfiles = [
  { label: "X", href: profile.x },
  { label: "Sherlock", href: "https://audits.sherlock.xyz/watson/jopantech" },
  { label: "Code4rena", href: "https://code4rena.com/@jopantech" },
  { label: "Cantina", href: "https://cantina.xyz/u/jopantech" },
  { label: "CodeHawks", href: "https://profiles.cyfrin.io/u/jopantech" },
  { label: "Immunefi", href: "https://immunefi.com/profile/jopantech" },
  { label: "Telegram", href: profile.telegram },
] as const;

export const primaryNavigation = [
  { label: "About", href: "/#about" },
  { label: "Contests", href: "/#experience" },
  { label: "Findings", href: "/#research" },
  { label: "Writing", href: "/#writing" },
] as const;
