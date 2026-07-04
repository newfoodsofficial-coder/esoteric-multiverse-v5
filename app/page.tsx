'use client';

import Link from 'next/link';
import { useServices } from '@/hooks/use-services';
import { SiteHeader, SiteFooter } from '@/components/parchment/site-chrome';
import { ParchmentCard, Seal, SectionTitle, Chip, EmptyState } from '@/components/parchment/primitives';
import { DailyWindowBanner } from '@/components/engagement/daily-window-banner';
import { WheelOfDestiny } from '@/components/engagement/wheel-of-destiny';
import { SERVICE_CATALOG } from '@/lib/services';

export default function Home() {
  const { services, loading, error } = useServices();
  const list = services.length ? services : SERVICE_CATALOG.map((s) => ({ ...s, status: 'active', tier: 'free', limit_window: null, limit_count: null }));

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4">
        {/* Hero */}
        <section className="pt-12 pb-8 text-center animate-rise">
          <div className="flex justify-center mb-5">
            <Seal glyph={'\u2726'} accent="var(--gold-600)" size={88} spin />
          </div>
          <div className="gold-text text-xs uppercase tracking-[0.35em] mb-3">Museum-Style Esoteric Multiverse</div>
          <h1 className="ink-heading text-4xl md:text-6xl font-semibold text-balance" style={{ fontFamily: 'var(--font-display), serif' }}>
            The Grand Parchment<br />Esoteric Codex
          </h1>
          <p className="mt-4 text-base md:text-lg max-w-2xl mx-auto" style={{ color: 'var(--ink-soft)' }}>
            Ten portals of geomancy, tarot, numerology, dream necromancy, ritual alchemy and more —
            rendered on ancient parchment, processed entirely on your device. Zero storage. Free-tier sovereign.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Link href="/portals" className="btn-gold rounded-lg px-6 py-2.5 text-sm font-semibold">Enter the Portals</Link>
            <Link href="/glossary" className="btn-ghost-parchment rounded-lg px-6 py-2.5 text-sm font-medium">Read the Glossary</Link>
          </div>
        </section>

        <div className="my-6">
          <DailyWindowBanner />
        </div>

        <div className="ornament-divider my-10"><span className="text-base">{'\u2767'}</span></div>

        {/* Portals grid */}
        <section>
          <SectionTitle
            eyebrow="The Ten Portals"
            title="Surgical Control of Ten Services"
            subtitle="Each portal is independently governable — hide, suspend, gate behind premium, or rate-limit per fingerprint."
          />
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading && Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-44 rounded-xl animate-pulse" style={{ background: 'var(--parchment-300)' }} />
            ))}
            {!loading && error && <EmptyState message="The codex could not be reached. Showing the canonical list." />}
            {!loading && list.map((s, i) => (
              <ServiceCard key={s.id} service={s} index={i} />
            ))}
          </div>
        </section>

        <div className="ornament-divider my-12"><span className="text-base">{'\u2767'}</span></div>

        {/* Three pillars */}
        <section className="pb-6">
          <SectionTitle eyebrow="Foundations" title="Three Pillars of the Codex" />
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <ParchmentCard className="p-6">
              <div className="gold-text text-xs uppercase tracking-[0.25em] mb-2">I. Parchment Ethos</div>
              <h3 className="ink-heading text-xl font-semibold" style={{ fontFamily: 'var(--font-display), serif' }}>No Black Backgrounds</h3>
              <p className="text-sm mt-2" style={{ color: 'var(--ink-soft)' }}>
                Warm cream, papyrus, antique gold and ink-brown — a museum of solar-astrological antiquities, not a gothic cellar.
              </p>
            </ParchmentCard>
            <ParchmentCard className="p-6">
              <div className="gold-text text-xs uppercase tracking-[0.25em] mb-2">II. Zero-Storage</div>
              <h3 className="ink-heading text-xl font-semibold" style={{ fontFamily: 'var(--font-display), serif' }}>Client-Rendered Only</h3>
              <p className="text-sm mt-2" style={{ color: 'var(--ink-soft)' }}>
                Talismans and tarot layouts are temporary Base64 blocks rendered instantly on your device. No media files bloat the free tier.
              </p>
            </ParchmentCard>
            <ParchmentCard className="p-6">
              <div className="gold-text text-xs uppercase tracking-[0.25em] mb-2">III. Dual-Layer Staff</div>
              <h3 className="ink-heading text-xl font-semibold" style={{ fontFamily: 'var(--font-display), serif' }}>Admin &amp; Super Admin</h3>
              <p className="text-sm mt-2" style={{ color: 'var(--ink-soft)' }}>
                Two clearance codes guard the Sovereign Guard. Super Admins hold absolute platform sovereignty — staff CRUD, role renaming, service overrides.
              </p>
            </ParchmentCard>
          </div>
        </section>
      </main>
      <SiteFooter />
      <WheelOfDestiny />
    </>
  );
}

function ServiceCard({ service, index }: { service: any; index: number }) {
  const hidden = service.status === 'hidden';
  const comingSoon = service.status === 'coming_soon';
  const premium = service.tier === 'premium';
  return (
    <Link
      href={hidden ? '#' : `/portals/${service.slug}`}
      className="block animate-rise"
      style={{ animationDelay: `${index * 60}ms` }}
      aria-disabled={hidden}
      onClick={hidden ? (e) => e.preventDefault() : undefined}
    >
      <ParchmentCard className={`p-5 h-full transition-all ${hidden ? 'opacity-40' : 'hover:-translate-y-1 hover:shadow-lg'}`}>
        <div className="flex items-start gap-4">
          <Seal glyph={service.glyph} accent={service.accent} size={56} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="ink-heading text-lg font-semibold leading-tight" style={{ fontFamily: 'var(--font-display), serif' }}>
                {service.name_en}
              </h3>
              {premium && <Chip variant="gold">Premium</Chip>}
              {comingSoon && <Chip variant="warning">قريباً</Chip>}
              {hidden && <Chip variant="error">Hidden</Chip>}
            </div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--ink-muted)' }} dir="rtl">{service.name_ar}</div>
            <p className="text-sm mt-2" style={{ color: 'var(--ink-soft)' }}>{service.tagline_en}</p>
          </div>
        </div>
      </ParchmentCard>
    </Link>
  );
}
