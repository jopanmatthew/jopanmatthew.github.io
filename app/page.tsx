import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { profile } from "@/data/profile";
import { researchProfiles } from "@/data/links";
import { getFeaturedFindings, getFindings } from "@/lib/findings";
import { WritingEntry } from "@/components/research/WritingEntry";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { AuditTable } from "@/components/experience/AuditTable";
import { ProtocolGrid } from "@/components/experience/ProtocolGrid";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { Icon } from "@/components/ui/Icon";
import { FocusTypewriter } from "@/components/hero/FocusTypewriter";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { MagneticLink } from "@/components/ui/MagneticLink";

export const metadata: Metadata = {
  alternates: process.env.NEXT_PUBLIC_SITE_URL ? { canonical: "/" } : undefined,
};

export default function HomePage() {
  const findings = getFindings();
  const featuredFindings = getFeaturedFindings();
  const platforms = Array.from(new Set(findings.map((finding) => finding.platform)));
  const contactProfiles = researchProfiles.filter((item) => item.label === "X" || item.label === "Telegram");

  return (
    <div className="page-shell home-page mx-auto w-full">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="hero-greeting">Howdy, my name is</p>
          <h1 id="hero-title" className="hero-name">Jovan Matthew<span>.</span></h1>
          <p className="hero-role">Web3 security researcher</p>
          <p className="focus-line">
            <span className="terminal-prompt-path"><span>~/</span>jopantech</span>
            <span className="terminal-prompt-dollar">$</span>
            <FocusTypewriter />
          </p>
          <ul className="hero-proof">
            <li>Smart-contract security across DeFi, cross-chain infrastructure, and token standards.</li>
            <li>Tracing state transitions, trust assumptions, and asset accounting.</li>
            <li>Public research records across {platforms.join(", ")}.</li>
          </ul>
          <div className="hero-actions">
            <Link className="button button-primary" href="#contact">request a review <span aria-hidden="true">→</span></Link>
            <Link className="button button-outline" href="#experience">view contest record <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
        <Image
          className="hero-logo"
          src="/icon.png"
          alt="Jopantech circuit wordmark"
          width={512}
          height={512}
          sizes="(max-width: 740px) 144px, (max-width: 1200px) 16vw, 208px"
          unoptimized
          preload
        />
      </section>

      <section className="content-section about-section" id="about">
        <ScrollReveal>
          <SectionHeading index="01" title="about" note="A little about the researcher." icon="user" />
        </ScrollReveal>
        <ScrollReveal delay={90}>
          <div className="about-content">
            <p className="about-lede">Read the assumptions. Trace the state. Test the outcome.</p>
            <div className="about-prose">
              <p>I&apos;m Jovan Matthew, a Web3 security researcher focused on smart-contract security across DeFi, cross-chain infrastructure, and token standards.</p>
              <p>I follow how state changes, accounting rules, and external calls interact, then test where the assumptions stop holding.</p>
              <p>I&apos;m also an Artificial Intelligence student at {profile.university}.</p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <section className="content-section experience-section" id="experience">
        <ScrollReveal>
          <SectionHeading index="02" title="contest_record" note="Selected public results." icon="trophy" />
        </ScrollReveal>
        <ScrollReveal delay={90} className="stagger-reveal">
          <AuditTable findings={findings} />
          <p className="source-note">Finding totals reflect the reports listed on this site.</p>
        </ScrollReveal>
      </section>

      <section className="content-section research-section" id="research">
        <ScrollReveal>
          <SectionHeading index="03" title="notable_findings" note="Selected highlights." icon="shield" />
        </ScrollReveal>
        <ScrollReveal delay={90} className="stagger-reveal">
          <div className="findings-table-wrap">
            <table className="findings-table">
              <caption className="sr-only">Selected public smart-contract security findings</caption>
              <thead>
                <tr>
                  <th scope="col">Protocol</th>
                  <th scope="col">Platform</th>
                  <th scope="col">Severity</th>
                  <th scope="col">Report</th>
                </tr>
              </thead>
              <tbody>
                {featuredFindings.map((finding) => (
                  <tr key={finding.slug}>
                    <td data-label="Protocol">
                      <Link href={`/research/${finding.slug}`}>
                        {finding.protocol.replace(" — ", " / ")}
                      </Link>
                    </td>
                    <td data-label="Platform">{finding.platform}</td>
                    <td data-label="Severity"><span className={`severity severity-${finding.severity.toLowerCase()}`}>{finding.severity}</span></td>
                    <td data-label="Report"><ExternalLink href={finding.report}>↗ view</ExternalLink></td>
                  </tr>
                ))}
                {featuredFindings.length === 0 ? (
                  <tr><td colSpan={4}>No public findings are featured yet.</td></tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </ScrollReveal>
      </section>

      <section className="content-section writing-section" id="writing" aria-labelledby="writing-title">
        <ScrollReveal>
          <header className="writing-heading">
            <span className="section-index">#04</span>
            <h2 id="writing-title"><span aria-hidden="true">#</span> writing<Icon className="section-heading-icon" name="file" size={17} /></h2>
            <Link className="writing-all" href="/writing">All writing <span aria-hidden="true">→</span></Link>
          </header>
        </ScrollReveal>
        <ScrollReveal delay={90} className="stagger-reveal">
          <div className="writing-list">
            {findings.map((finding) => (
              <WritingEntry key={finding.slug} finding={finding} />
            ))}
          </div>
        </ScrollReveal>
      </section>

      <div className="protocols-strip" aria-label="Protocols with public security findings">
        <ScrollReveal>
          <p className="protocols-strip-label">Protocols secured</p>
        </ScrollReveal>
        <ScrollReveal delay={90} className="stagger-reveal">
          <ProtocolGrid findings={findings} />
        </ScrollReveal>
      </div>

      <section className="content-section contact-section" id="contact">
        <ScrollReveal>
          <SectionHeading index="05" title="contact" note="Private audit engagements." icon="message" />
        </ScrollReveal>
        <ScrollReveal delay={90}>
          <div className="contact-card">
            <div className="contact-main">
              <p className="contact-prompt">~/jopantech $</p>
              <p className="contact-copy">Available for solo engagements, audit-firm reviewer capacity, and competitive contests. Reach out on Telegram or X, and I&apos;ll get back to you within a day.</p>
              <MagneticLink className="contact-button" href={profile.telegram} external>request a review <span aria-hidden="true">→</span></MagneticLink>
            </div>
            <ul className="contact-links" aria-label="Contact links">
              <li><a href={`mailto:${profile.email}`}><Icon className="contact-link-icon" name="mail" /><span>email</span><strong>{profile.email}</strong><span aria-hidden="true">↗</span></a></li>
              {contactProfiles.map((item) => (
                <li key={item.label}>
                  <ExternalLink href={item.href}>
                    <Icon className={`contact-link-icon contact-link-icon-${item.label.toLowerCase()}`} name={item.label === "Telegram" ? "telegram" : "x"} />
                    <span>{item.label.toLowerCase()}</span>
                    <strong>{item.label === "Telegram" ? "@jopanmatthew" : "@jopantechh"}</strong>
                    <span aria-hidden="true">↗</span>
                  </ExternalLink>
                </li>
              ))}
            </ul>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
