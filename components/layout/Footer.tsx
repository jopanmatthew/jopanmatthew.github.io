import Link from "next/link";
import { profile } from "@/data/profile";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { TerminalBrand } from "@/components/layout/TerminalBrand";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner mx-auto w-full">
        <div className="footer-top">
          <Link className="wordmark footer-wordmark" href="/" aria-label="jopantech home">
            <TerminalBrand showName />
          </Link>
          <nav className="footer-nav" aria-label="Footer navigation">
            <Link href="/#about">about</Link>
            <Link href="/#experience">contests</Link>
            <Link href="/#research">findings</Link>
            <Link href="/writing">writing</Link>
            <ExternalLink href={profile.x}>x / twitter</ExternalLink>
            <ExternalLink href={profile.telegram}>telegram</ExternalLink>
            <Link className="footer-back-top" href="#main-content">back to top <span aria-hidden="true">↑</span></Link>
          </nav>
        </div>
        <div className="footer-bottom">
          <p className="footer-credit">© {new Date().getFullYear()} Jovan Matthew · read every line. trust no assumption.</p>
          <p className="footer-warning">
            <span aria-hidden="true">⚠</span>
            <strong>note:</strong> My official contacts are listed on this site. I will never DM you first asking for funds or seed phrases — verify the handles before engaging.
          </p>
        </div>
      </div>
    </footer>
  );
}
