'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAdmin } from '@/components/admin/admin-provider';

const NAV = [
  { href: '/', label: 'Codex' },
  { href: '/glossary', label: 'Glossary' },
  { href: '/portals', label: 'Portals' },
  { href: '/admin', label: 'Staff' },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { tier, roleTitle } = useAdmin();

  return (
    <header className="sticky top-0 z-40 backdrop-blur-sm" style={{ background: 'rgba(244, 235, 208, 0.82)', borderBottom: '1px solid var(--parchment-400)' }}>
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <svg viewBox="0 0 40 40" width="34" height="34" className="seal-shadow group-hover:rotate-[18deg] transition-transform duration-700">
            <circle cx="20" cy="20" r="18" fill="none" stroke="var(--gold-500)" strokeWidth="1.2" />
            <circle cx="20" cy="20" r="13" fill="none" stroke="var(--gold-400)" strokeWidth="0.6" opacity="0.6" />
            <text x="20" y="20" textAnchor="middle" dominantBaseline="central" fontSize="16" fill="var(--gold-600)" fontFamily="serif">{'\u2726'}</text>
          </svg>
          <div className="leading-tight">
            <div className="ink-heading text-base font-semibold" style={{ fontFamily: 'var(--font-display), serif' }}>
              Grand Parchment
            </div>
            <div className="gold-text text-[10px] uppercase tracking-[0.3em]">Esoteric Codex</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV.map((n) => {
            const active = pathname === n.href || (n.href !== '/' && pathname.startsWith(n.href));
            return (
              <Link
                key={n.href}
                href={n.href}
                className={cn(
                  'px-3.5 py-2 rounded-md text-sm font-medium transition-colors',
                  active ? 'text-ink' : 'text-ink-soft hover:text-ink'
                )}
                style={{
                  color: active ? 'var(--ink)' : 'var(--ink-soft)',
                  background: active ? 'rgba(212, 175, 55, 0.12)' : 'transparent',
                }}
              >
                {n.label}
              </Link>
            );
          })}
          {tier && (
            <span className="chip chip-gold ml-2">
              <Shield size="11" /> {roleTitle}
            </span>
          )}
        </nav>

        <button
          className="md:hidden p-2 rounded-md"
          style={{ color: 'var(--ink)' }}
          onClick={() => setOpen((o) => !o)}
          aria-label="Menu"
        >
          {open ? <X size="22" /> : <Menu size="22" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t" style={{ borderColor: 'var(--parchment-400)', background: 'var(--parchment-100)' }}>
          <div className="px-4 py-3 flex flex-col gap-1">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="px-3 py-2 rounded-md text-sm"
                style={{ color: 'var(--ink)' }}
              >
                {n.label}
              </Link>
            ))}
            {tier && (
              <span className="chip chip-gold self-start mt-1">
                <Shield size="11" /> {roleTitle}
              </span>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t" style={{ borderColor: 'var(--parchment-400)', background: 'rgba(247, 238, 211, 0.5)' }}>
      <div className="mx-auto max-w-6xl px-4 py-10 text-center">
        <div className="ornament-divider mb-4">
          <span className="text-base">{'\u2767'}</span>
        </div>
        <p className="text-sm" style={{ color: 'var(--ink-soft)' }}>
          The Grand Parchment Esoteric Codex &amp; Multi-Agent Swarm Multiverse
        </p>
        <p className="text-xs mt-1" style={{ color: 'var(--ink-muted)' }}>
          A museum-style esoteric multiverse. Zero-storage. Client-rendered. Free-tier sovereign.
        </p>
      </div>
    </footer>
  );
}
