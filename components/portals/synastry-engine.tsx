'use client';

import { useState } from 'react';
import { ParchmentCard, GoldButton, SectionTitle, Chip } from '@/components/parchment/primitives';

const SIGNS = [
  { key: 'fire', label: 'Fire', glyph: '\u2692', signs: ['Aries', 'Leo', 'Sagittarius'] },
  { key: 'earth', label: 'Earth', glyph: '\u2693', signs: ['Taurus', 'Virgo', 'Capricorn'] },
  { key: 'air', label: 'Air', glyph: '\u2698', signs: ['Gemini', 'Libra', 'Aquarius'] },
  { key: 'water', label: 'Water', glyph: '\u2695', signs: ['Cancer', 'Scorpio', 'Pisces'] },
];

const ALL_SIGNS = SIGNS.flatMap((e) => e.signs.map((s) => ({ sign: s, element: e })));

function score(a: string, b: string): number {
  const sa = ALL_SIGNS.find((x) => x.sign === a);
  const sb = ALL_SIGNS.find((x) => x.sign === b);
  if (!sa || !sb) return 0;
  if (sa.element.key === sb.element.key) return 90 + Math.floor(Math.random() * 10);
  const compat: Record<string, string[]> = {
    fire: ['air', 'earth'], earth: ['water', 'fire'], air: ['fire', 'water'], water: ['earth', 'air'],
  };
  if (compat[sa.element.key]?.includes(sb.element.key)) return 70 + Math.floor(Math.random() * 15);
  return 45 + Math.floor(Math.random() * 20);
}

export function SynastryEngine() {
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [result, setResult] = useState<{ score: number; a: string; b: string } | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const check = () => {
    setErr(null);
    if (!a.trim() || !b.trim()) {
      setErr('Enter both signs.');
      return;
    }
    const ca = a.trim().charAt(0).toUpperCase() + a.trim().slice(1).toLowerCase();
    const cb = b.trim().charAt(0).toUpperCase() + b.trim().slice(1).toLowerCase();
    if (!ALL_SIGNS.find((x) => x.sign === ca)) { setErr(`Unknown sign: ${a}`); return; }
    if (!ALL_SIGNS.find((x) => x.sign === cb)) { setErr(`Unknown sign: ${b}`); return; }
    setResult({ score: score(ca, cb), a: ca, b: cb });
  };

  return (
    <ParchmentCard className="p-6">
      <SectionTitle eyebrow="Portal VIII" title="Bio-Energy Synastry" center={false} />
      <p className="text-sm mt-3" style={{ color: 'var(--ink-soft)' }}>
        Enter two zodiac signs. Compatibility is computed from elemental resonance — rendered on static client-side cards.
      </p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <input value={a} onChange={(e) => setA(e.target.value)} className="input-parchment px-3 py-2" placeholder="First sign" />
        <input value={b} onChange={(e) => setB(e.target.value)} className="input-parchment px-3 py-2" placeholder="Second sign" />
      </div>
      {err && <p className="mt-2 text-sm" style={{ color: 'var(--error)' }}>{err}</p>}
      <GoldButton className="mt-3" onClick={check}>Check Compatibility</GoldButton>
      {result && (
        <div className="mt-5 animate-fade-in flex items-center gap-4">
          <div className="flex -space-x-2">
            {[result.a, result.b].map((s, i) => {
              const info = ALL_SIGNS.find((x) => x.sign === s)!;
              return (
                <div key={i} className="w-14 h-14 rounded-full parchment-surface flex flex-col items-center justify-center" style={{ border: '1px solid var(--gold-400)', zIndex: i === 0 ? 1 : 2 }}>
                  <span style={{ color: 'var(--gold-600)' }}>{info.element.glyph}</span>
                  <span className="text-[9px] font-semibold" style={{ color: 'var(--ink)' }}>{s}</span>
                </div>
              );
            })}
          </div>
          <div>
            <Chip variant={result.score >= 80 ? 'success' : result.score >= 60 ? 'gold' : 'warning'}>
              {result.score}% Resonance
            </Chip>
            <p className="text-sm mt-1" style={{ color: 'var(--ink-soft)' }}>
              {result.score >= 80 ? 'A strong current. The currents harmonize.' : result.score >= 60 ? 'A workable current. Effort deepens it.' : 'A tense current. Growth through friction.'}
            </p>
          </div>
        </div>
      )}
    </ParchmentCard>
  );
}
