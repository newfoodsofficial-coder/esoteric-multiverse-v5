'use client';

import { useState } from 'react';
import { ParchmentCard, GoldButton, SectionTitle } from '@/components/parchment/primitives';

const ABJAD: Record<string, number> = {
  ا: 1, ب: 2, ج: 3, د: 4, ه: 5, و: 6, ز: 7, ح: 8, ط: 9,
  ي: 10, ك: 20, ل: 30, م: 40, ن: 50, س: 60, ع: 70, ف: 80, ص: 90,
  ق: 100, ر: 200, ش: 300, ت: 400, ث: 500, خ: 600, ذ: 700, ض: 800, ظ: 900,
  غ: 1000, ى: 10, ة: 5, أ: 1, إ: 1, آ: 1, ؤ: 6, ئ: 10,
};

const LATIN: Record<string, number> = {
  a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9,
  j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9,
  s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8,
};

function compute(text: string): number {
  let sum = 0;
  for (const ch of text) {
    if (ABJAD[ch] !== undefined) sum += ABJAD[ch];
    else if (LATIN[ch.toLowerCase()] !== undefined) sum += LATIN[ch.toLowerCase()];
  }
  return sum;
}

function reduceNumber(n: number): number {
  while (n > 9 && n !== 11 && n !== 22) {
    n = String(n).split('').reduce((a, d) => a + Number(d), 0);
  }
  return n;
}

const MEANINGS: Record<number, string> = {
  1: 'Unity, origin, the singular will.',
  2: 'Duality, reflection, the pair.',
  3: 'Synthesis, expression, the trinity.',
  4: 'Foundation, structure, the four gates.',
  5: 'Motion, freedom, the pentagram.',
  6: 'Harmony, union, the hexagram.',
  7: 'Mystery, the septenary, the veil.',
  8: 'Power, the octave, the circuit.',
  9: 'Completion, the ennead, the return.',
  11: 'The intuitive messenger. A master number.',
  22: 'The master builder. A master number.',
};

export function NumerologyEngine() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<{ raw: number; reduced: number } | null>(null);

  const calc = () => {
    if (!text.trim()) return;
    const raw = compute(text.trim());
    setResult({ raw, reduced: reduceNumber(raw) });
  };

  return (
    <ParchmentCard className="p-6">
      <SectionTitle eyebrow="Portal V" title="Kabbalistic & Jafr Numerology" center={false} />
      <p className="text-sm mt-3" style={{ color: 'var(--ink-soft)' }}>
        Enter a name or word (Arabic or Latin). The Abjad value is computed and reduced.
      </p>
      <div className="mt-4 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="input-parchment flex-1 px-3 py-2"
          placeholder="e.g. علي or Sophia"
          dir="auto"
        />
        <GoldButton onClick={calc} disabled={!text.trim()}>Compute</GoldButton>
      </div>
      {result && (
        <div className="mt-5 animate-fade-in">
          <div className="flex items-baseline gap-4">
            <div>
              <div className="gold-text text-xs uppercase tracking-[0.25em]">Abjad Value</div>
              <div className="ink-heading text-3xl font-semibold" style={{ fontFamily: 'var(--font-display), serif' }}>{result.raw}</div>
            </div>
            <div>
              <div className="gold-text text-xs uppercase tracking-[0.25em]">Reduced</div>
              <div className="ink-heading text-3xl font-semibold" style={{ fontFamily: 'var(--font-display), serif' }}>{result.reduced}</div>
            </div>
          </div>
          <p className="mt-3 text-sm italic" style={{ color: 'var(--ink-soft)' }}>
            {MEANINGS[result.reduced] ?? 'A unique current.'}
          </p>
        </div>
      )}
    </ParchmentCard>
  );
}
