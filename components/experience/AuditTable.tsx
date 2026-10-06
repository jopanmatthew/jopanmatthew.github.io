import Link from "next/link";
import type { Finding } from "@/lib/findings";
import { formatRank } from "@/lib/findings";
import { ExternalLink } from "@/components/ui/ExternalLink";

export function AuditTable({ findings }: { findings: Finding[] }) {
  const contestMap = new Map<string, Finding[]>();

  for (const finding of findings) {
    const contestFindings = contestMap.get(finding.contest) ?? [];
    contestFindings.push(finding);
    contestMap.set(finding.contest, contestFindings);
  }

  const contests = Array.from(contestMap.values());
  const severityOrder: Finding["severity"][] = ["Critical", "High", "Medium", "Low"];
  const severityLabels: Record<Finding["severity"], string> = {
    Critical: "C",
    High: "H",
    Medium: "M",
    Low: "L",
  };

  return (
    <div className="contest-table-wrap">
      <table className="contest-table">
        <caption className="sr-only">Selected public audit contest results</caption>
        <thead>
          <tr>
            <th scope="col">Month / year</th>
            <th scope="col">Protocol and platform</th>
            <th scope="col">Findings</th>
            <th scope="col">Rank</th>
            <th scope="col">Record</th>
          </tr>
        </thead>
        <tbody>
          {contests.map(([first, ...otherFindings]) => {
            const contestFindings = [first, ...otherFindings];
            const counts = new Map<Finding["severity"], number>();
            for (const finding of contestFindings) {
              counts.set(finding.severity, (counts.get(finding.severity) ?? 0) + 1);
            }

            return (
              <tr key={first.contest}>
                <td data-label="Month / year" className="contest-date-cell">
                  <span className="contest-date">{first.contestPeriod}</span>
                </td>
                <td data-label="Protocol and platform">
                  <Link className="contest-protocol" href={`/research/${first.slug}`}>
                    {first.protocol.replace(" — ", " / ")}
                  </Link>
                  <span className="contest-type">{first.protocolType}</span>
                  <span className="contest-platform">{first.platform}</span>
                </td>
                <td data-label="Findings">
                  <div className="contest-findings" role="list" aria-label="Reported findings in this site">
                    {severityOrder.map((severity) => {
                      const count = counts.get(severity);
                      if (!count) return null;

                      return (
                        <span
                          className={`contest-finding-count severity-${severity.toLowerCase()}`}
                          key={severity}
                          role="listitem"
                          aria-label={`${count} ${severity} finding${count === 1 ? "" : "s"}`}
                        >
                          {count}{severityLabels[severity]}
                        </span>
                      );
                    })}
                  </div>
                </td>
                <td data-label="Rank"><span className="contest-rank">{formatRank(first)}</span></td>
                <td data-label="Record" className="contest-record-cell">
                  <ExternalLink href={first.contest} aria-label={`Open ${first.protocol.replace(" — ", " / ")} contest record`}>
                    view record <span aria-hidden="true">↗</span>
                  </ExternalLink>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
