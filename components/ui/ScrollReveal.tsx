"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function ScrollReveal({ children, className, delay = 0 }: ScrollRevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      typeof IntersectionObserver === "undefined"
    ) {
      setIsVisible(true);
      return;
    }

    const bounds = element.getBoundingClientRect();
    if (bounds.top < window.innerHeight * 0.92 && bounds.bottom > 0) {
      setIsVisible(true);
      return;
    }

    setIsReady(true);
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      setIsVisible(true);
      observer.unobserve(element);
    }, { threshold: 0.08, rootMargin: "0px 0px -48px 0px" });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const classNames = ["scroll-reveal", className, isReady && "is-ready", isVisible && "is-visible"]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={elementRef} className={classNames} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}
