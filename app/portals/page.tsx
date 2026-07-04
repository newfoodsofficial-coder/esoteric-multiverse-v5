'use client';

import Link from 'next/link';
import { useServices } from '@/hooks/use-services';
import { SiteHeader, SiteFooter } from '@/components/parchment/site-chrome';
import { ParchmentCard, Seal, SectionTitle, Chip, EmptyState } from '@/components/parchment/primitives';
import { DailyWindowBanner } from '@/components/engagement/daily-window-banner';
import { WheelOfDestiny } from '@/components/engagement/wheel-of-destiny';
import { SERVICE_CATALOG } from '@/lib/services';

export default function PortalsPage() {
  const { services, loading, error } = useServices();
  const list = services.length ? services : SERVICE_CATALOG.map((s) => ({ ...s, status: 'active', tier: 'free', limit_window: null, limit_count: null }));

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 pt-10">
        <SectionTitle
          eyebrow="The Ten Portals"
          title="Choose Your Portal"
          subtitle="Each service is governed by the Sovereign Guard. Some may be hidden, suspended, or premium-gated."
        />
        <div className="my-6">
          <DailyWindowBanner />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading && Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-40 rounded-xl animate-pulse" style={{ background: 'var(--parchment-300)' }} />
          ))}
          {!loading && error && <EmptyState message="Could not reach the codex. Showing the canonical list." />}
          {!loading && list.map((s, i) => {
            const hidden = s.status === 'hidden';
            const comingSoon = s.status === 'coming_soon';
            const premium = s.tier === 'premium';
            return (
              <Link
                key={s.id}
                href={hidden ? '#' : `/portals/${s.slug}`}
                className="block animate-rise"
                style={{ animationDelay: `${i * 50}ms` }}
                onClick={hidden ? (e) => e.preventDefault() : undefined}
              >
                <ParchmentCard className={`p-5 h-full ${hidden ? 'opacity-40' : 'hover:-translate-y-1 transition-all'}`}>
                  <div className="flex items-start gap-4">
                    <Seal glyph={s.glyph} accent={s.accent} size={52} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="ink-heading text-lg font-semibold" style={{ fontFamily: 'var(--font-display), serif' }}>{s.name_en}</h3>
                        {premium && <Chip variant="gold">Premium</Chip>}
                        {comingSoon && <Chip variant="warning">قريباً</Chip>}
                        {hidden && <Chip variant="error">Hidden</Chip>}
                      </div>
                      <div className="text-xs" style={{ color: 'var(--ink-muted)' }} dir="rtl">{s.name_ar}</div>
                      <p className="text-sm mt-2" style={{ color: 'var(--ink-soft)' }}>{s.tagline_en}</p>
                    </div>
                  </div>
                </ParchmentCard>
              </Link>
            );
          })}
        </div>
      </main>
      <SiteFooter />
      <WheelOfDestiny />
    </>
  );
}
