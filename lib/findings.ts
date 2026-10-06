import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type Severity = "Critical" | "High" | "Medium" | "Low";

export type Finding = {
  slug: string;
  title: string;
  protocol: string;
  protocolType: string;
  severity: Severity;
  platform: string;
  contestPeriod: string;
  contestSort: number;
  rank: number;
  rankTotal?: number;
  featured: boolean;
  summary?: string;
  writeupNote?: string;
  contest: string;
  report: string;
  poc?: string;
  content: string;
};

const contentDirectory = path.join(process.cwd(), "content", "findings");
const severities = new Set<Severity>(["Critical", "High", "Medium", "Low"]);

function requiredString(data: Record<string, unknown>, key: string): string {
  const value = data[key];
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Finding frontmatter requires a non-empty "${key}".`);
  }
  return value;
}

function requiredNumber(data: Record<string, unknown>, key: string): number {
  const value = data[key];
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`Finding frontmatter requires a numeric "${key}".`);
  }
  return value;
}

function parseFinding(fileName: string): Finding {
  const source = fs.readFileSync(path.join(contentDirectory, fileName), "utf8");
  const parsed = matter(source);
  const data = parsed.data as Record<string, unknown>;
  const severity = requiredString(data, "severity") as Severity;

  if (!severities.has(severity)) {
    throw new Error(`Unsupported severity "${severity}" in ${fileName}.`);
  }

  const poc = data.poc;
  const rankTotal = data.rankTotal;

  return {
    slug: fileName.replace(/\.md$/, ""),
    title: requiredString(data, "title"),
    protocol: requiredString(data, "protocol"),
    protocolType: requiredString(data, "protocolType"),
    severity,
    platform: requiredString(data, "platform"),
    contestPeriod: requiredString(data, "contestPeriod"),
    contestSort: requiredNumber(data, "contestSort"),
    rank: requiredNumber(data, "rank"),
    rankTotal: typeof rankTotal === "number" ? rankTotal : undefined,
    featured: data.featured === true,
    summary: typeof data.summary === "string" && data.summary.trim() !== ""
      ? data.summary.trim()
      : undefined,
    writeupNote: typeof data.writeupNote === "string" && data.writeupNote.trim() !== ""
      ? data.writeupNote.trim()
      : undefined,
    contest: requiredString(data, "contest"),
    report: requiredString(data, "report"),
    poc: typeof poc === "string" ? poc : undefined,
    content: parsed.content.trim(),
  };
}

export function getFindings(): Finding[] {
  return fs
    .readdirSync(contentDirectory)
    .filter((fileName) => fileName.endsWith(".md"))
    .map(parseFinding)
    .sort((a, b) => b.contestSort - a.contestSort);
}

export function getFeaturedFindings(): Finding[] {
  return getFindings().filter((finding) => finding.featured);
}

export function getFinding(slug: string): Finding | undefined {
  return getFindings().find((finding) => finding.slug === slug);
}

export function formatRank(finding: Finding): string {
  return finding.rankTotal
    ? `${finding.rank} / ${finding.rankTotal}`
    : `#${finding.rank}`;
}
