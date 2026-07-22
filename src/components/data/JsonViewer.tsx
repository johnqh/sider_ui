import { splitSecretSegments } from './secretSegments';

/** Pretty-prints JSON with {{secret:…}} placeholders highlighted. */
export function JsonViewer({ value }: { value: unknown }) {
  const text = typeof value === 'string' ? value : JSON.stringify(value, null, 2);
  const segments = splitSecretSegments(text ?? 'null');
  return (
    <pre className="max-h-96 overflow-auto rounded-lg border border-border bg-muted/30 p-3 text-xs leading-5 text-foreground">
      {segments.map((s, i) =>
        s.isSecret ? (
          <mark key={i} className="rounded bg-warning/25 px-0.5 font-semibold text-warning">
            {s.text}
          </mark>
        ) : (
          <span key={i}>{s.text}</span>
        )
      )}
    </pre>
  );
}
