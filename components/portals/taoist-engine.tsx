'use client';

import { useState } from 'react';
import { ParchmentCard, GoldButton, SectionTitle, Chip } from '@/components/parchment/primitives';

const ELEMENTS = [
  { key: 'wood', label: 'Wood', glyph: '\u2698', ar: 'خشب' },
  { key: 'fire', label: 'Fire', glyph: '\u2692', ar: 'نار' },
  { key: 'earth', label: 'Earth', glyph: '\u2693', ar: 'أرض' },
  { key: 'metal', label: 'Metal', glyph: '\u2694', ar: 'معدن' },
  { key: 'water', label: 'Water', glyph: '\u2695', ar: 'ماء' },
];

export function TaoistEngine() {
  const [scores, setScores] = useState<Record<string, number>>({
    wood: 2, fire: 2, earth: 2, metal: 2, water: 2,
  });

  const total = Object.values(scores).reduce((a, b) => a + b, 0);
  const yin = total <= 7;
  const balanced = total === 10;

  const adjust = (k: string, delta: number) => {
    setScores((s) => ({ ...s, [k]: Math.max(0, Math.min(5, s[k] + delta)) }));
  };

  return (
    <ParchmentCard className="p-6">
      <SectionTitle eyebrow="Portal IV" title="Taoist Shift Balancer" center={false} />
      <p className="text-sm mt-3" style={{ color: 'var(--ink-soft)' }}>
        Adjust the five elements. The engine computes your Yin/Yang balance.
      </p>
      <div className="mt-5 grid grid-cols-5 gap-3">
        {ELEMENTS.map((e) => (
          <div key={e.key} className="text-center">
            <div className="text-2xl" style={{ color: 'var(--gold-600)' }}>{e.glyph}</div>
            <div className="text-xs font-semibold mt-1" style={{ color: 'var(--ink)' }}>{e.label}</div>
            <div className="text-[10px]" style={{ color: 'var(--ink-muted)' }} dir="rtl">{e.ar}</div>
            <div className="mt-2 flex items-center justify-center gap-1">
              <button onClick={() => adjust(e.key, -1)} className="w-6 h-6 rounded-md btn-ghost-parchment">−</button>
              <span className="w-6 text-center font-semibold" style={{ color: 'var(--ink)' }}>{scores[e.key]}</span>
              <button onClick={() => adjust(e.key, 1)} className="w-6 h-6 rounded-md btn-ghost-parchment">+</button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex items-center justify-center gap-3">
        <Chip variant={balanced ? 'success' : yin ? 'default' : 'gold'}>
          {balanced ? 'Balanced · 中' : yin ? 'Yin · 阴' : 'Yang · 阳'}
        </Chip>
        <span className="text-sm" style={{ color: 'var(--ink-soft)' }}>Total: {total}</span>
      </div>
      <p className="mt-3 text-sm text-center italic" style={{ color: 'var(--ink-soft)' }}>
        {balanced
          ? 'The middle path. Act from stillness.'
          : yin
          ? 'Yin prevails. Withdraw, receive, incubate.'
          : 'Yang prevails. Advance, radiate, build.'}
      </p>
    </ParchmentCard>
  );
}
