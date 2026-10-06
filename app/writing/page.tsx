import type { Metadata } from "next";
import { WritingEntry } from "@/components/research/WritingEntry";
import { getFindings } from "@/lib/findings";

export const metadata: Metadata = {
  title: "Writing",
  description:
    "Public smart-contract security findings by Jovan Matthew, with links to original reports and technical write-ups where available.",
  alternates: process.env.NEXT_PUBLIC_SITE_URL ? { canonical: "/writing" } : undefined,
};

export default function WritingPage() {
  const findings = getFindings();

  return (
    <div className="page-shell writing-archive-page mx-auto w-full">
      <header className="writing-archive-header">
        <p className="archive-kicker">Field notes / {String(findings.length).padStart(2, "0")}</p>
        <h1>Writing<span>.</span></h1>
        <p>
          Security findings from public audit competitions. Each entry links to its original record;
          technical details are included when they are present in the public source material.
        </p>
      </header>

      <section className="writing-list" aria-label="Security finding write-ups">
        {findings.map((finding) => <WritingEntry key={finding.slug} finding={finding} />)}
        {findings.length === 0 ? <p className="empty-research">No public write-ups yet.</p> : null}
      </section>
    </div>
  );
}
