'use client';

import { useState } from 'react';
import { ParchmentCard, GoldButton, SectionTitle } from '@/components/parchment/primitives';

const MAJOR = [
  { name: 'The Fool', glyph: '\u2600', meaning: 'Beginnings, innocence, spontaneous leap.' },
  { name: 'The Magician', glyph: '\u2609', meaning: 'Willpower, manifestation, craft.' },
  { name: 'The High Priestess', glyph: '\u263D', meaning: 'Intuition, the veiled, the night-side.' },
  { name: 'The Empress', glyph: '\u2640', meaning: 'Abundance, nature, fertility.' },
  { name: 'The Emperor', glyph: '\u2642', meaning: 'Structure, authority, sovereignty.' },
  { name: 'The Hierophant', glyph: '\u269C', meaning: 'Tradition, the sacred, the teacher.' },
  { name: 'The Lovers', glyph: '\u269B', meaning: 'Union, choice, dual current.' },
  { name: 'The Chariot', glyph: '\u2726', meaning: 'Victory through mastery of opposites.' },
  { name: 'Strength', glyph: '\u2725', meaning: 'Inner fortitude, taming the beast.' },
  { name: 'The Hermit', glyph: '\u2727', meaning: 'Solitude, inner light, counsel.' },
  { name: 'Wheel of Fortune', glyph: '\u2742', meaning: 'Cycles, fate, the turning.' },
  { name: 'Justice', glyph: '\u2696', meaning: 'Balance, truth, reckoning.' },
  { name: 'The Hanged One', glyph: '\u2724', meaning: 'Surrender, reversal, new vantage.' },
  { name: 'Death', glyph: '\u2723', meaning: 'Transformation, the threshold.' },
  { name: 'Temperance', glyph: '\u263F', meaning: 'Alchemy, blending, the middle path.' },
  { name: 'The Devil', glyph: '\u2722', meaning: 'Bondage, shadow, the Qliphothic echo.' },
  { name: 'The Tower', glyph: '\u2728', meaning: 'Sudden revelation, the false structure falls.' },
  { name: 'The Star', glyph: '\u2729', meaning: 'Hope, guidance, the distant light.' },
  { name: 'The Moon', glyph: '\u263E', meaning: 'Illusion, dream, the path between.' },
  { name: 'The Sun', glyph: '\u2600', meaning: 'Clarity, vitality, the solar current.' },
  { name: 'Judgement', glyph: '\u272B', meaning: 'Awakening, the call, reckoning.' },
  { name: 'The World', glyph: '\u272A', meaning: 'Completion, the whole, the return.' },
];

export function TarotEngine() {
  const [drawn, setDrawn] = useState<typeof MAJOR[number] | null>(null);
  const [flipped, setFlipped] = useState(false);

  const draw = () => {
    const card = MAJOR[Math.floor(Math.random() * MAJOR.length)];
    setDrawn(card);
    setFlipped(false);
    setTimeout(() => setFlipped(true), 50);
  };

  return (
    <ParchmentCard className="p-6">
      <SectionTitle eyebrow="Portal III" title="Luciferian Tarot Oracle" center={false} />
      <p className="text-sm mt-3" style={{ color: 'var(--ink-soft)' }}>
        Draw one card from the night-side deck of the Qliphoth. The card is rendered on your device — nothing is stored.
      </p>
      <div className="mt-6 flex justify-center">
        {drawn ? (
          <div
            className="relative animate-fade-in"
            style={{
              width: 180,
              height: 280,
              perspective: 800,
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                transition: 'transform 0.7s cubic-bezier(0.16,1,0.3,1)',
                transformStyle: 'preserve-3d',
                transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                position: 'relative',
              }}
            >
              {/* back */}
              <div
                className="absolute inset-0 rounded-xl flex items-center justify-center"
                style={{
                  backfaceVisibility: 'hidden',
                  background: 'linear-gradient(135deg, var(--parchment-700), var(--parchment-900))',
                  border: '1px solid var(--gold-500)',
                }}
              >
                <span style={{ color: 'var(--gold-400)', fontSize: 48 }}>{'\u2726'}</span>
              </div>
              {/* front */}
              <div
                className="absolute inset-0 rounded-xl parchment-surface flex flex-col items-center justify-center p-4"
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  border: '1px solid var(--gold-500)',
                }}
              >
                <span style={{ color: 'var(--gold-600)', fontSize: 56 }}>{drawn.glyph}</span>
                <div className="ink-heading text-lg font-semibold mt-3 text-center" style={{ fontFamily: 'var(--font-display), serif' }}>{drawn.name}</div>
                <div className="gold-rule my-2 w-16" />
                <p className="text-xs text-center" style={{ color: 'var(--ink-soft)' }}>{drawn.meaning}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-xl flex items-center justify-center" style={{ width: 180, height: 280, background: 'linear-gradient(135deg, var(--parchment-700), var(--parchment-900))', border: '1px solid var(--gold-500)' }}>
            <span style={{ color: 'var(--gold-400)', fontSize: 48 }}>{'\u2726'}</span>
          </div>
        )}
      </div>
      <div className="mt-6 flex justify-center">
        <GoldButton onClick={draw}>{drawn ? 'Draw Another' : 'Draw a Card'}</GoldButton>
      </div>
    </ParchmentCard>
  );
}
