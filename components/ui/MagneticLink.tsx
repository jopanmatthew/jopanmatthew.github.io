"use client";

import Link from "next/link";
import type { AnchorHTMLAttributes, PointerEvent } from "react";

type MagneticLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
  external?: boolean;
};

export function MagneticLink({
  children,
  className,
  external = false,
  href,
  rel,
  target,
  ...props
}: MagneticLinkProps) {
  function handlePointerMove(event: PointerEvent<HTMLAnchorElement>) {
    if (event.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const offsetX = (event.clientX - bounds.left - bounds.width / 2) * 0.12;
    const offsetY = (event.clientY - bounds.top - bounds.height / 2) * 0.12;

    event.currentTarget.style.setProperty("--magnetic-x", `${Math.max(-8, Math.min(8, offsetX))}px`);
    event.currentTarget.style.setProperty("--magnetic-y", `${Math.max(-6, Math.min(6, offsetY))}px`);
  }

  function resetPointer(event: PointerEvent<HTMLAnchorElement>) {
    event.currentTarget.style.setProperty("--magnetic-x", "0px");
    event.currentTarget.style.setProperty("--magnetic-y", "0px");
  }

  const linkProps = {
    ...props,
    className: [className, "magnetic-link"].filter(Boolean).join(" "),
    onPointerMove: handlePointerMove,
    onPointerLeave: resetPointer,
    children,
  };

  return external ? (
    <a href={href} target={target ?? "_blank"} rel={rel ?? "noreferrer noopener"} {...linkProps} />
  ) : (
    <Link href={href} target={target} rel={rel} {...linkProps} />
  );
}
