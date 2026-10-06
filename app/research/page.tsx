import type { Metadata } from "next";
import { getFindings } from "@/lib/findings";
import { FindingRow } from "@/components/research/FindingRow";

export const metadata: Metadata = {
  title: "Security Research",
  description:
    "A selected archive of Jovan Matthew's public smart-contract security findings and audit competition records.",
  alternates: process.env.NEXT_PUBLIC_SITE_URL ? { canonical: "/research" } : undefined,
};

export default function ResearchPage() {
  const findings = getFindings();

  return (
    <div className="page-shell archive-page mx-auto w-full">
      <header className="archive-header">
        <p className="archive-kicker">Public records / {String(findings.length).padStart(2, "0")}</p>
        <h1>Security<br />research<span>.</span></h1>
        <p>Findings from smart-contract audit competitions, linked to their public sources.</p>
      </header>
      <section className="archive-list" aria-label="All research findings">
        <div className="archive-list-head">
          <span>Protocol / finding</span>
          <span>Platform / year</span>
          <span>Severity</span>
        </div>
        {findings.map((finding) => <FindingRow key={finding.slug} finding={finding} />)}
        {findings.length === 0 ? <p className="empty-research">No public records yet.</p> : null}
      </section>
    </div>
  );
}
