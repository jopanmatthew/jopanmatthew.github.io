"use client";

import { useEffect, useState } from "react";

const auditCommands = [
  "./audit --focus defi",
  "./audit --focus cross-chain",
  "./audit --focus token-standards",
];
type TypingPhase = "pause" | "deleting" | "typing";

export function FocusTypewriter() {
  const [focusIndex, setFocusIndex] = useState(0);
  const [text, setText] = useState("");
  const [phase, setPhase] = useState<TypingPhase>("typing");
  const command = auditCommands[focusIndex];

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setText(command);
      return;
    }

    let delay = 0;
    let next: () => void;

    if (phase === "pause") {
      delay = 1250;
      next = () => setPhase("deleting");
    } else if (phase === "deleting" && text.length > 0) {
      delay = 38;
      next = () => setText((current) => current.slice(0, -1));
    } else if (phase === "deleting") {
      delay = 220;
      next = () => {
        setFocusIndex((current) => (current + 1) % auditCommands.length);
        setPhase("typing");
      };
    } else if (text.length < command.length) {
      delay = 72;
      next = () => setText(command.slice(0, text.length + 1));
    } else {
      delay = 1050;
      next = () => setPhase("pause");
    }

    const timeout = window.setTimeout(next, delay);
    return () => window.clearTimeout(timeout);
  }, [command, phase, text]);

  return (
    <>
      <span className="focus-typewriter" aria-hidden="true">
        {text}<span className="typewriter-cursor" />
      </span>
      <span className="sr-only">Audit focus: DeFi, cross-chain systems, and token standards.</span>
    </>
  );
}
