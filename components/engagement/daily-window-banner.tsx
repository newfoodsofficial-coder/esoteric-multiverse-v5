'use client';

import { useEngagement, CYCLICAL_WINDOWS, type CyclicalWindow } from '@/components/engagement/engagement-provider';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export function DailyWindowBanner() {
  const { window: win } = useEngagement();
  const [open, setOpen] = useState(false);

  return (
    <div className="parchment-surface parchment-edge rounded-xl px-4 py-3 flex items-center gap-3 relative">
      <span className="text-2xl seal-shadow" style={{ color: 'var(--gold-600)' }} aria-hidden>
        {win.glyph}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="gold-text text-[10px] uppercase tracking-[0.25em]">Current Window</span>
          <span className="ink-heading text-sm font-semibold">{win.label} · {win.labelAr} · {win.labelFr}</span>
        </div>
        <p className="text-xs truncate" style={{ color: 'var(--ink-soft)' }}>{win.message}</p>
      </div>
      <button
        onClick={() => setOpen((o) => !o)}
        className="p-1.5 rounded-md"
        style={{ color: 'var(--ink-soft)' }}
        aria-label="Expand windows"
      >
        <ChevronDown size="16" className={open ? 'rotate-180 transition-transform' : 'transition-transform'} />
      </button>
      {open && (
        <div className="absolute left-0 right-0 top-full mt-1 z-30 parchment-surface rounded-xl p-3 animate-fade-in" style={{ border: '1px solid var(--parchment-400)' }}>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {CYCLICAL_WINDOWS.map((w) => {
              const active = w.key === win.key;
              return (
                <div key={w.key} className="rounded-lg p-2 text-center" style={{ background: active ? 'rgba(212,175,55,0.12)' : 'transparent', border: active ? '1px solid var(--gold-400)' : '1px solid transparent' }}>
                  <div className="text-xl" style={{ color: 'var(--gold-600)' }}>{w.glyph}</div>
                  <div className="text-xs font-semibold mt-1" style={{ color: 'var(--ink)' }}>{w.label}</div>
                  <div className="text-[10px]" style={{ color: 'var(--ink-muted)' }}>{w.labelAr}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
