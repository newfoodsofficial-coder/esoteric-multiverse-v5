'use client';

import { useState } from 'react';
import { ParchmentCard, GoldButton, SectionTitle } from '@/components/parchment/primitives';

const FIGURE_NAMES = [
  'Via', 'Populus', 'Conjunctio', 'Carcer', 'Caput Draconis', 'Cauda Draconis',
  'Fortuna Major', 'Fortuna Minor', 'Acquisitio', 'Amissio', 'Laetitia', 'Tristitia',
  'Puer', 'Puella', 'Albus', 'Rubeus',
];

function randomFigure(): number[] {
  // 4 rows of 1 or 2 dots (binary)
  return [0, 1, 2, 3].map(() => (Math.random() < 0.5 ? 1 : 2));
}

function figureIndex(rows: number[]): number {
  return rows.reduce((acc, r, i) => acc + (r === 2 ? 1 << i : 0), 0);
}

export function GeomancyEngine() {
  const [figure, setFigure] = useState<number[] | null>(null);
  const [name, setName] = useState<string>('');

  const cast = () => {
    const f = randomFigure();
    setFigure(f);
    setName(FIGURE_NAMES[figureIndex(f) % FIGURE_NAMES.length]);
  };

  return (
    <ParchmentCard className="p-6">
      <SectionTitle eyebrow="Portal II" title="Al-Zanati Geomancy" center={false} />
      <p className="text-sm mt-3" style={{ color: 'var(--ink-soft)' }}>
        Cast the sand. Four rows of binary dots form a geomantic figure of the sixteen mothers.
      </p>
      <div className="mt-5 flex items-center gap-8">
        <div className="flex flex-col gap-3">
          {figure ? figure.map((dots, i) => (
            <div key={i} className="flex gap-2">
              {dots === 1 ? (
                <span className="w-3 h-3 rounded-full" style={{ background: 'var(--parchment-800)' }} />
              ) : (
                <>
                  <span className="w-3 h-3 rounded-full" style={{ background: 'var(--parchment-800)' }} />
                  <span className="w-3 h-3 rounded-full" style={{ background: 'var(--parchment-800)' }} />
                </>
              )}
            </div>
          )) : (
            <div className="text-sm italic" style={{ color: 'var(--ink-muted)' }}>The sand is still.</div>
          )}
        </div>
        {figure && (
          <div className="animate-fade-in">
            <div className="gold-text text-xs uppercase tracking-[0.25em]">Figure</div>
            <div className="ink-heading text-2xl font-semibold" style={{ fontFamily: 'var(--font-display), serif' }}>{name}</div>
          </div>
        )}
      </div>
      <GoldButton className="mt-5" onClick={cast}>{figure ? 'Cast Again' : 'Cast the Sand'}</GoldButton>
    </ParchmentCard>
  );
}
