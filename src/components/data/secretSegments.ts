const SECRET_RE = /\{\{secret:[^}]+\}\}/g;

export function splitSecretSegments(text: string): { text: string; isSecret: boolean }[] {
  const out: { text: string; isSecret: boolean }[] = [];
  let last = 0;
  for (const m of text.matchAll(SECRET_RE)) {
    if (m.index! > last) out.push({ text: text.slice(last, m.index), isSecret: false });
    out.push({ text: m[0], isSecret: true });
    last = m.index! + m[0].length;
  }
  if (last < text.length || out.length === 0) out.push({ text: text.slice(last), isSecret: false });
  return out;
}
