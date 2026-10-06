import Link from "next/link";
import type { Finding } from "@/lib/findings";

type ProtocolGridProps = {
  findings: Finding[];
};

function getBrand(protocol: string) {
  if (protocol.includes("Chainlink")) return { name: "Chainlink", style: "chainlink" };
  if (protocol.includes("Reserve")) return { name: "Reserve", style: "reserve" };
  if (protocol.includes("Revert")) return { name: "REVERT", style: "revert" };
  if (protocol.includes("Firelight")) return { name: "Firelight", style: "firelight" };
  return { name: protocol.split(" — ")[0], style: "default" };
}

function ProtocolTile({ finding }: { finding: Finding }) {
  const brand = getBrand(finding.protocol);

  return (
    <Link
      className={`protocol-logo-tile protocol-logo-${brand.style}`}
      href={`/research/${finding.slug}`}
      aria-label={`View ${finding.protocol} security finding`}
      role="listitem"
    >
      <span className="protocol-wordmark" aria-hidden="true">
        {brand.style === "chainlink" ? (
          <svg className="protocol-chainlink-mark" viewBox="0 0 48 48" fill="none">
            <path d="M24 3.5 42 14v20L24 44.5 6 34V14L24 3.5Z" />
            <path d="m24 11 11 6.5v13L24 37l-11-6.5v-13L24 11Z" />
          </svg>
        ) : null}
        <span>{brand.name}</span>
      </span>
    </Link>
  );
}

export function ProtocolGrid({ findings }: ProtocolGridProps) {
  const uniqueProtocols = Array.from(
    new Map(findings.map((finding) => [finding.protocol, finding])).values(),
  );

  return (
    <div className="protocol-logo-grid" role="list" aria-label="Protocols with public security findings">
      {uniqueProtocols.map((finding) => (
        <ProtocolTile finding={finding} key={finding.protocol} />
      ))}
    </div>
  );
}
