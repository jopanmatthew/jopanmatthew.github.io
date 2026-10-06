import Link from "next/link";
import type { Finding } from "@/lib/findings";

type FindingRowProps = {
  finding: Finding;
  variant?: "archive" | "compact";
};

export function FindingRow({ finding, variant = "archive" }: FindingRowProps) {
  const hasSpecificTitle = finding.title.toLowerCase() !== "medium severity finding";

  return (
    <article className={`finding-row finding-row-${variant}`}>
      <div className="finding-meta">
        <span>{finding.platform}</span>
        <span>{finding.contestPeriod}</span>
      </div>
      <div className="finding-copy">
        <h3><Link href={`/research/${finding.slug}`}>{finding.protocol.replace(" — ", " / ")}<span aria-hidden="true">↗</span></Link></h3>
        {hasSpecificTitle ? <p>{finding.title}</p> : null}
      </div>
      <div className="finding-result">
        <span className={`severity severity-${finding.severity.toLowerCase()}`}>{finding.severity}</span>
      </div>
    </article>
  );
}
