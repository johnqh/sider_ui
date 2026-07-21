export function LoadingState({ label = 'Loading…' }: { label?: string }) {
  return <div className="p-6 text-sm text-muted-foreground">{label}</div>;
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-8 text-center">
      <p className="text-sm font-medium text-foreground">{title}</p>
      {hint ? <p className="mt-1 text-sm text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

export function ErrorState({ error }: { error: unknown }) {
  const msg = error instanceof Error ? error.message : String(error);
  return (
    <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
      {msg}
    </div>
  );
}

const STATUS_STYLES: Record<string, string> = {
  trusted: 'bg-success/15 text-success',
  provisional: 'bg-warning/15 text-warning',
  flagged: 'bg-destructive/15 text-destructive',
  uploaded: 'bg-info/15 text-info',
  distilled: 'bg-success/15 text-success',
  buffering: 'bg-muted text-muted-foreground',
  discarded: 'bg-muted text-muted-foreground',
};

export function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status] ?? 'bg-muted text-muted-foreground';
  return (
    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${style}`}>
      {status}
    </span>
  );
}
