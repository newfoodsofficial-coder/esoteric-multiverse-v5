'use client';

import { useState, useEffect, useRef } from 'react';
import { ParchmentCard, GoldButton, SectionTitle, Chip } from '@/components/parchment/primitives';
import { useEngagement } from '@/components/engagement/engagement-provider';

export function SovereignGuardEngine() {
  const { openWheel, hasSpunToday, window: win } = useEngagement();
  const [seconds, setSeconds] = useState(30);
  const [running, setRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const start = () => {
    if (running) return;
    setRunning(true);
    setSeconds(30);
    timerRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setRunning(false);
          openWheel();
          return 30;
        }
        return s - 1;
      });
    }, 1000);
  };

  return (
    <ParchmentCard className="p-6">
      <SectionTitle eyebrow="Portal X" title="The Sovereign Guard Engine" center={false} />
      <p className="text-sm mt-3" style={{ color: 'var(--ink-soft)' }}>
        The 30-second engagement wheel. Begin the timer; at zero, the Wheel of Destiny rises with a free daily spin and a behavioral astrological warning.
      </p>
      <div className="mt-6 flex flex-col items-center">
        <div className="relative" style={{ width: 160, height: 160 }}>
          <svg viewBox="0 0 100 100" width="160" height="160">
            <circle cx="50" cy="50" r="44" fill="none" stroke="var(--parchment-400)" strokeWidth="4" />
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke="var(--gold-500)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 44}
              strokeDashoffset={2 * Math.PI * 44 * (1 - seconds / 30)}
              transform="rotate(-90 50 50)"
              style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
            <text x="50" y="50" textAnchor="middle" dominantBaseline="central" fontSize="22" fill="var(--ink)" fontFamily="serif">{seconds}</text>
          </svg>
        </div>
        <GoldButton className="mt-4" onClick={start} disabled={running}>
          {running ? 'Guarding…' : 'Begin the 30-Second Watch'}
        </GoldButton>
        {hasSpunToday && <Chip variant="success" className="mt-3">Daily spin claimed</Chip>}
      </div>
      <div className="ornament-divider my-5"><span>{'\u2767'}</span></div>
      <div className="text-center">
        <div className="gold-text text-xs uppercase tracking-[0.25em]">Current Window</div>
        <div className="text-2xl mt-1" style={{ color: 'var(--gold-600)' }}>{win.glyph}</div>
        <div className="ink-heading text-lg font-semibold" style={{ fontFamily: 'var(--font-display), serif' }}>{win.label} · {win.labelAr}</div>
        <p className="text-sm mt-1 max-w-md mx-auto" style={{ color: 'var(--ink-soft)' }}>{win.message}</p>
      </div>
    </ParchmentCard>
  );
}
