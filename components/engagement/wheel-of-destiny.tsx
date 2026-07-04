'use client';

import { useState, useEffect, useRef } from 'react';
import { useEngagement, CYCLICAL_WINDOWS } from '@/components/engagement/engagement-provider';
import { GoldButton, GhostButton } from '@/components/parchment/primitives';
import { X } from 'lucide-react';

const SEGMENTS = [
  { label: 'Geomancy', glyph: '\u25CF', color: '#a1887f' },
  { label: 'Tarot', glyph: '\u2727', color: '#8d6e63' },
  { label: 'Numerology', glyph: '\u05D0', color: '#b8860b' },
  { label: 'Dream', glyph: '\u2742', color: '#8b3a2e' },
  { label: 'Alchemy', glyph: '\u2725', color: '#9a6f08' },
  { label: 'Synastry', glyph: '\u269B', color: '#a1887f' },
  { label: 'Transit', glyph: '\u2609', color: '#d4af37' },
  { label: 'Shadow', glyph: '\u263D', color: '#5d4037' },
];

const WARNINGS = [
  'A retrograde current presses on your solar house. Reconcile before dusk.',
  'The geomantic figure "Via" warns of dispersion. Choose one road today.',
  'A Qliphothic echo from the night-side asks for shadow integration.',
  'Yin overflows. Withdraw, then act at noon tomorrow.',
  'A dream-signature lingers. Decode it before the next shadow hour.',
  'A talismanic current is fertile. Synthesize before the moon shifts.',
  'A synastry tension surfaces. Address it gently.',
  'A planetary transit favors closure. Release what is spent.',
];

export function WheelOfDestiny() {
  const { wheelOpen, closeWheel, markSpun, hasSpunToday } = useEngagement();
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<{ label: string; warning: string } | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  if (!wheelOpen) return null;

  const spin = () => {
    if (spinning || hasSpunToday) return;
    setSpinning(true);
    setResult(null);
    const idx = Math.floor(Math.random() * SEGMENTS.length);
    const segAngle = 360 / SEGMENTS.length;
    const target = 360 * 5 + (360 - (idx * segAngle + segAngle / 2));
    setRotation(target);
    timerRef.current = setTimeout(() => {
      setSpinning(false);
      setResult({
        label: SEGMENTS[idx].label,
        warning: WARNINGS[idx],
      });
      markSpun();
    }, 4100);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in" style={{ background: 'rgba(62, 39, 35, 0.55)' }}>
      <div className="parchment-surface parchment-edge rounded-2xl max-w-md w-full p-6 relative animate-rise">
        <button
          onClick={closeWheel}
          className="absolute right-3 top-3 p-1.5 rounded-md"
          style={{ color: 'var(--ink-soft)' }}
          aria-label="Close"
        >
          <X size="18" />
        </button>

        <div className="text-center">
          <div className="gold-text text-[10px] uppercase tracking-[0.3em] mb-1">The Sovereign Guard</div>
          <h3 className="ink-heading text-2xl font-semibold" style={{ fontFamily: 'var(--font-display), serif' }}>
            Wheel of Destiny
          </h3>
          <p className="text-sm mt-1" style={{ color: 'var(--ink-soft)' }}>
            One free daily spin. A behavioral astrological warning awaits.
          </p>
        </div>

        <div className="my-6 flex justify-center">
          <div className="relative" style={{ width: 240, height: 240 }}>
            {/* pointer */}
            <div className="absolute left-1/2 -top-1 -translate-x-1/2 z-10" style={{ width: 0, height: 0, borderLeft: '10px solid transparent', borderRight: '10px solid transparent', borderTop: '16px solid var(--gold-600)' }} />
            <svg
              viewBox="0 0 200 200"
              width="240"
              height="240"
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: spinning ? 'transform 4s cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
              }}
            >
              {SEGMENTS.map((seg, i) => {
                const a0 = (i / SEGMENTS.length) * 2 * Math.PI - Math.PI / 2;
                const a1 = ((i + 1) / SEGMENTS.length) * 2 * Math.PI - Math.PI / 2;
                const x0 = 100 + Math.cos(a0) * 95;
                const y0 = 100 + Math.sin(a0) * 95;
                const x1 = 100 + Math.cos(a1) * 95;
                const y1 = 100 + Math.sin(a1) * 95;
                const large = a1 - a0 > Math.PI ? 1 : 0;
                const path = `M100,100 L${x0},${y0} A95,95 0 ${large} 1 ${x1},${y1} Z`;
                const mid = (a0 + a1) / 2;
                const tx = 100 + Math.cos(mid) * 60;
                const ty = 100 + Math.sin(mid) * 60;
                return (
                  <g key={i}>
                    <path d={path} fill={seg.color} opacity="0.85" stroke="var(--parchment-100)" strokeWidth="1.5" />
                    <text x={tx} y={ty} textAnchor="middle" dominantBaseline="central" fontSize="20" fill="var(--parchment-50)" fontFamily="serif">
                      {seg.glyph}
                    </text>
                  </g>
                );
              })}
              <circle cx="100" cy="100" r="14" fill="var(--gold-400)" stroke="var(--gold-600)" strokeWidth="1.5" />
            </svg>
          </div>
        </div>

        {result ? (
          <div className="text-center animate-fade-in">
            <div className="chip chip-gold mb-3">{result.label}</div>
            <p className="text-sm italic" style={{ color: 'var(--ink)', fontFamily: 'var(--font-display), serif' }}>
              &ldquo;{result.warning}&rdquo;
            </p>
            <div className="mt-5 flex justify-center gap-2">
              <GoldButton onClick={closeWheel}>Heed the Warning</GoldButton>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <GoldButton onClick={spin} disabled={spinning || hasSpunToday} className="w-full">
              {hasSpunToday ? 'Already Spun Today' : spinning ? 'Spinning…' : 'Spin the Wheel'}
            </GoldButton>
            <GhostButton onClick={closeWheel} className="mt-2 w-full">Later</GhostButton>
          </div>
        )}
      </div>
    </div>
  );
}
