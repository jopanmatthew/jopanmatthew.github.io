export function TerminalBrand({ showName = false }: { showName?: boolean }) {
  return (
    <span className="terminal-brand">
      <span className="terminal-brand-path"><span>~/</span>jopantech</span>
      <span className="terminal-brand-dollar">$</span>
      {showName ? <span className="terminal-brand-name">Jovan Matthew</span> : null}
    </span>
  );
}
