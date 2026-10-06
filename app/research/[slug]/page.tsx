import type { Metadata } from "next";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { notFound } from "next/navigation";
import { getFinding, getFindings } from "@/lib/findings";
import { ExternalLink } from "@/components/ui/ExternalLink";

type FindingPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getFindings().map((finding) => ({ slug: finding.slug }));
}

export async function generateMetadata({ params }: FindingPageProps): Promise<Metadata> {
  const { slug } = await params;
  const finding = getFinding(slug);

  if (!finding) return { title: "Research not found" };
  const protocol = finding.protocol.replace(" — ", " / ");

  return {
    title: protocol,
    description: `${finding.title} · ${finding.platform} · ${finding.contestPeriod}`,
    alternates: process.env.NEXT_PUBLIC_SITE_URL
      ? { canonical: `/research/${finding.slug}` }
      : undefined,
    openGraph: {
      type: "article",
      title: `${protocol}: ${finding.title}`,
      description: finding.summary,
    },
  };
}

export default async function FindingPage({ params }: FindingPageProps) {
  const { slug } = await params;
  const finding = getFinding(slug);
  if (!finding) notFound();
  const hasSpecificTitle = finding.title.toLowerCase() !== "medium severity finding";

  return (
    <article className="page-shell research-detail mx-auto w-full">
      <Link className="back-link" href="/research"><span aria-hidden="true">←</span> Research archive</Link>
      <header className="detail-header">
        <p className="detail-kicker">{finding.platform}</p>
        <h1>{finding.protocol.replace(" — ", " / ")}<span>.</span></h1>
        {hasSpecificTitle ? <p className="detail-title">{finding.title}</p> : null}
        <div className="detail-meta">
          <span className={`severity severity-${finding.severity.toLowerCase()}`}>{finding.severity}</span>
          <span>{finding.contestPeriod}</span>
        </div>
      </header>

      <div className="detail-layout">
        <div className="detail-body">
          {finding.summary ? (
            <section className="detail-summary" aria-labelledby="summary-heading">
              <h2 id="summary-heading">Summary</h2>
              <p>{finding.summary}</p>
            </section>
          ) : null}
          {finding.content ? (
            <div className="markdown-content"><ReactMarkdown remarkPlugins={[remarkGfm]}>{finding.content}</ReactMarkdown></div>
          ) : (
            <section className="detail-summary" aria-labelledby="writeup-heading">
              <h2 id="writeup-heading">Write-up</h2>
              <p className="writeup-note">{finding.writeupNote ?? "This page lists the available contest details. No standalone technical write-up or proof of concept is included in this site's source record."}</p>
            </section>
          )}
        </div>

        <aside className="detail-sources" aria-label="Source links">
          <h2>Source documents</h2>
          <ul>
            <li><ExternalLink href={finding.report}>Original report<span aria-hidden="true">↗</span></ExternalLink></li>
            <li><ExternalLink href={finding.contest}>Competition record<span aria-hidden="true">↗</span></ExternalLink></li>
            {finding.poc ? <li><ExternalLink href={finding.poc}>Proof of concept<span aria-hidden="true">↗</span></ExternalLink></li> : null}
          </ul>
        </aside>
      </div>

      <Link className="next-archive-link" href="/research"><span aria-hidden="true">←</span> All research</Link>
    </article>
  );
}
