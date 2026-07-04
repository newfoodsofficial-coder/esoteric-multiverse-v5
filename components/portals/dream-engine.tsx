'use client';

import { useState } from 'react';
import { ParchmentCard, GoldButton, SectionTitle } from '@/components/parchment/primitives';

const SYMBOLS = [
  { key: 'water', glyph: '\u2695', meaning: 'Emotion, the unconscious current. A tide is moving through you.' },
  { key: 'fire', glyph: '\u2692', meaning: 'Transformation, urgency. Something is being forged or consumed.' },
  { key: 'bird', glyph: '\u2727', meaning: 'A message from afar. The soul taking flight.' },
  { key: 'door', glyph: '\u2724', meaning: 'A threshold. A choice to cross or remain.' },
  { key: 'serpent', glyph: '\u2722', meaning: 'Renewal through shedding. The old skin must go.' },
  { key: 'moon', glyph: '\u263D', meaning: 'The hidden, the feminine, the cyclic return.' },
  { key: 'tower', glyph: '\u2728', meaning: 'A sudden revelation. The false structure falls.' },
  { key: 'root', glyph: '\u2725', meaning: 'Ancestral matter. Something beneath demands attention.' },
];

export function DreamEngine() {
  const [dream, setDream] = useState('');
  const [symbol, setSymbol] = useState<typeof SYMBOLS[number] | null>(null);

  const decode = () => {
    if (!dream.trim()) return;
    setSymbol(SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]);
  };

  return (
    <ParchmentCard className="p-6">
      <SectionTitle eyebrow="Portal VI" title="Dream Necromancer" center={false} />
      <p className="text-sm mt-3" style={{ color: 'var(--ink-soft)' }}>
        Inscribe your dream. The necromancer surfaces a sign from the ancient glossary.
      </p>
      <textarea
        value={dream}
        onChange={(e) => setDream(e.target.value)}
        rows={4}
        className="input-parchment w-full p-3 mt-4"
        placeholder="The dream I remember…"
      />
      <GoldButton className="mt-3" onClick={decode} disabled={!dream.trim()}>Decode</GoldButton>
      {symbol && (
        <div className="mt-5 animate-fade-in flex items-start gap-4">
          <span className="text-4xl" style={{ color: 'var(--gold-600)' }}>{symbol.glyph}</span>
          <div>
            <div className="gold-text text-xs uppercase tracking-[0.25em]">Sign</div>
            <p className="text-sm mt-1" style={{ color: 'var(--ink)' }}>{symbol.meaning}</p>
          </div>
        </div>
      )}
    </ParchmentCard>
  );
}
