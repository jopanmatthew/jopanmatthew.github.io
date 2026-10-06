import Link from "next/link";
import type { Finding } from "@/lib/findings";

type WritingEntryProps = {
  finding: Finding;
};

export function WritingEntry({ finding }: WritingEntryProps) {
  const protocol = finding.protocol.replace(" — ", " / ");
  const hasSpecificTitle = finding.title.toLowerCase() !== "medium severity finding";

  return (
    <article className="writing-row">
      <div className="writing-meta">
        <span>{finding.contestPeriod}</span>
        <span className="writing-category">{finding.platform}</span>
      </div>
      <div className="writing-content">
        <div className="writing-title-line">
          <span
            className={`writing-severity severity-${finding.severity.toLowerCase()}`}
            aria-label={`${finding.severity} severity`}
          >
            {finding.severity[0]}
          </span>
          <h3>
            <Link href={`/research/${finding.slug}`}>
              {protocol}<span aria-hidden="true">↗</span>
            </Link>
          </h3>
        </div>
        {hasSpecificTitle ? <p className="writing-finding-title">{finding.title}</p> : null}
        <p className="writing-description">
          {finding.summary ?? finding.writeupNote ?? `${finding.severity} finding from ${finding.platform}.`}
        </p>
      </div>
    </article>
  );
}
