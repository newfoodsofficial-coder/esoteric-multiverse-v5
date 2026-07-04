'use client';

import { useState, useMemo } from 'react';
import { ParchmentCard, GoldButton, SectionTitle, GhostButton } from '@/components/parchment/primitives';

const INTENTS = ['Protection', 'Attraction', 'Banishing', 'Healing', 'Prosperity', 'Vision'];

function buildTalisman(intent: string, seed: number): string {
  const sides = 3 + (seed % 6); // 3..8
  const r = 90;
  const cx = 100, cy = 100;
  const points = Array.from({ length: sides }).map((_, i) => {
    const a = (i / sides) * 2 * Math.PI - Math.PI / 2;
    return `${cx + Math.cos(a) * r},${cy + Math.sin(a) * r}`;
  }).join(' ');
  const innerR = 50;
  const innerPoints = Array.from({ length: sides }).map((_, i) => {
    const a = (i / sides) * 2 * Math.PI - Math.PI / 2 + Math.PI / sides;
    return `${cx + Math.cos(a) * innerR},${cy + Math.sin(a) * innerR}`;
  }).join(' ');
  const letters = ['\u05D0', '\u05D1', '\u05D2', '\u05D3', '\u05D4', '\u05D5', '\u05D6', '\u05D7'];
  const letter = letters[seed % letters.length];

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
  <rect width="200" height="200" fill="#f7eed3"/>
  <circle cx="100" cy="100" r="95" fill="none" stroke="#b8860b" stroke-width="1.5"/>
  <circle cx="100" cy="100" r="80" fill="none" stroke="#a1887f" stroke-width="0.8" opacity="0.6"/>
  <polygon points="${points}" fill="none" stroke="#5d4037" stroke-width="1.5"/>
  <polygon points="${innerPoints}" fill="none" stroke="#9a6f08" stroke-width="1"/>
  <text x="100" y="100" text-anchor="middle" dominant-baseline="central" font-size="32" fill="#3e2723" font-family="serif">${letter}</text>
  <text x="100" y="180" text-anchor="middle" font-size="9" fill="#8d6e63" font-family="serif" letter-spacing="2">${intent.toUpperCase()}</text>
</svg>`;
  return svg;
}

function svgToDataUrl(svg: string): string {
  if (typeof window === 'undefined') return '';
  return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
}

export function AlchemyEngine() {
  const [intent, setIntent] = useState(INTENTS[0]);
  const [seed, setSeed] = useState(0);
  const [generated, setGenerated] = useState<{ svg: string; url: string } | null>(null);

  const synthesize = () => {
    const s = Math.floor(Math.random() * 100000);
    setSeed(s);
    const svg = buildTalisman(intent, s);
    setGenerated({ svg, url: svgToDataUrl(svg) });
  };

  const download = () => {
    if (!generated) return;
    const a = document.createElement('a');
    a.href = generated.url;
    a.download = `talisman-${intent.toLowerCase()}.svg`;
    a.click();
  };

  return (
    <ParchmentCard className="p-6">
      <SectionTitle eyebrow="Portal VII" title="Ritual Alchemy Engine" center={false} />
      <p className="text-sm mt-3" style={{ color: 'var(--ink-soft)' }}>
        Synthesize a geometric talisman. Rendered on your device as a temporary Base64 SVG — nothing is stored.
      </p>
      <div className="mt-4 flex flex-wrap gap-2 items-center">
        <div className="text-xs uppercase tracking-[0.2em]" style={{ color: 'var(--ink-muted)' }}>Intent:</div>
        {INTENTS.map((i) => (
          <button
            key={i}
            onClick={() => setIntent(i)}
            className="px-3 py-1.5 rounded-md text-xs font-medium"
            style={{
              border: '1px solid',
              borderColor: i === intent ? 'var(--gold-500)' : 'var(--parchment-500)',
              background: i === intent ? 'rgba(212,175,55,0.12)' : 'transparent',
              color: 'var(--ink)',
            }}
          >
            {i}
          </button>
        ))}
      </div>
      <div className="mt-5 flex justify-center">
        {generated ? (
          <div className="animate-fade-in">
            <img src={generated.url} alt={`Talisman of ${intent}`} width={220} height={220} className="rounded-lg" style={{ border: '1px solid var(--gold-400)' }} />
          </div>
        ) : (
          <div className="rounded-lg flex items-center justify-center" style={{ width: 220, height: 220, background: 'var(--parchment-200)', border: '1px dashed var(--parchment-500)' }}>
            <span className="text-sm" style={{ color: 'var(--ink-muted)' }}>No talisman yet</span>
          </div>
        )}
      </div>
      <div className="mt-5 flex justify-center gap-2">
        <GoldButton onClick={synthesize}>{generated ? 'Resynthesize' : 'Synthesize Talisman'}</GoldButton>
        {generated && <GhostButton onClick={download}>Download SVG</GhostButton>}
      </div>
    </ParchmentCard>
  );
}
