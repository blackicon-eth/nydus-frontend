export function SmallLogo() {
  return (
    <div className="relative size-6 shrink-0">
    <div className="absolute inset-0 rounded-lg bg-primary/20 blur-sm" />
    <div className="relative flex h-full w-full items-center justify-center rounded-lg border border-primary bg-card">
      <span className="text-sm font-bold text-primary glow-text">Ø</span>
    </div>
  </div>
  <span className="text-base font-medium text-primary glow-text">NYDUS</span>
  );
}
