'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { serviceBySlug } from '@/lib/services';
import { SiteHeader, SiteFooter } from '@/components/parchment/site-chrome';
import { ParchmentCard, Seal, GoldButton, GhostButton, Chip, SectionTitle } from '@/components/parchment/primitives';
import { DailyWindowBanner } from '@/components/engagement/daily-window-banner';
import { WheelOfDestiny } from '@/components/engagement/wheel-of-destiny';
import { useFingerprint } from '@/components/engagement/fingerprint-provider';
import { useAdmin } from '@/components/admin/admin-provider';
import { ArrowLeft, Lock, Clock, EyeOff } from 'lucide-react';
import { ShadowProfilerEngine } from '@/components/portals/shadow-profiler-engine';
import { GeomancyEngine } from '@/components/portals/geomancy-engine';
import { TarotEngine } from '@/components/portals/tarot-engine';
import { TaoistEngine } from '@/components/portals/taoist-engine';
import { NumerologyEngine } from '@/components/portals/numerology-engine';
import { DreamEngine } from '@/components/portals/dream-engine';
import { AlchemyEngine } from '@/components/portals/alchemy-engine';
import { SynastryEngine } from '@/components/portals/synastry-engine';
import { PlanetaryEngine } from '@/components/portals/planetary-engine';
import { SovereignGuardEngine } from '@/components/portals/sovereign-guard-engine';

const ENGINES: Record<string, () => JSX.Element | null> = {
  'shadow-profiler': ShadowProfilerEngine,
  'al-zanati-geomancy': GeomancyEngine,
  'luciferian-tarot': TarotEngine,
  'taoist-shift': TaoistEngine,
  'kabbalistic-jafr': NumerologyEngine,
  'dream-necromancer': DreamEngine,
  'ritual-alchemy': AlchemyEngine,
  'bio-energy-synastry': SynastryEngine,
  'planetary-transit': PlanetaryEngine,
  'sovereign-guard': SovereignGuardEngine,
};

export default function PortalPage() {
  const params = useParams();
  const router = useRouter();
  const slug = String(params?.slug ?? '');
  const meta = serviceBySlug(slug);
  const { ready, recordUsage, fetchUsage } = useFingerprint();
  const { tier } = useAdmin();

  const [config, setConfig] = useState<{ status: string; tier: string; limit_window: string | null; limit_count: number | null } | null>(null);
  const [loading, setLoading] = useState(true);
  const [usageCount, setUsageCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!meta) {
      setLoading(false);
      return;
    }
    (async () => {
      setLoading(true);
      try {
        const { data, error: qErr } = await supabase
          .from('services')
          .select('status, tier, limit_window, limit_count')
          .eq('id', meta.id)
          .maybeSingle();
        if (qErr) throw qErr;
        setConfig(data ?? { status: 'active', tier: 'free', limit_window: null, limit_count: null });
      } catch (e: any) {
        setError(e?.message ?? 'Failed to load service');
        setConfig({ status: 'active', tier: 'free', limit_window: null, limit_count: null });
      } finally {
        setLoading(false);
      }
    })();
  }, [meta]);

  useEffect(() => {
    if (!ready || !meta) return;
    fetchUsage(meta.id).then(setUsageCount);
  }, [ready, meta, fetchUsage]);

  if (!meta) {
    return (
      <>
        <SiteHeader />
        <main className="mx-auto max-w-3xl px-4 pt-20 text-center">
          <h1 className="ink-heading text-3xl font-semibold">Portal not found</h1>
          <p className="mt-2" style={{ color: 'var(--ink-soft)' }}>This portal does not exist in the codex.</p>
          <Link href="/portals" className="btn-gold rounded-lg px-5 py-2 mt-6 inline-block">Back to Portals</Link>
        </main>
        <SiteFooter />
      </>
    );
  }

  if (loading) {
    return (
      <>
        <SiteHeader />
        <main className="mx-auto max-w-3xl px-4 pt-20">
          <div className="h-64 rounded-xl animate-pulse" style={{ background: 'var(--parchment-300)' }} />
        </main>
        <SiteFooter />
      </>
    );
  }

  const status = config?.status ?? 'active';
  const isPremium = (config?.tier ?? 'free') === 'premium';
  const limitWindow = config?.limit_window ?? null;
  const limitCount = config?.limit_count ?? null;
  const isAdmin = tier === 'admin' || tier === 'super';

  // Admins bypass gates
  const hidden = status === 'hidden' && !isAdmin;
  const comingSoon = status === 'coming_soon' && !isAdmin;
  const premiumLocked = isPremium && !isAdmin;
  const limitReached = !!limitCount && usageCount >= limitCount && !isAdmin;

  const Engine = ENGINES[slug];

  const handleUse = async () => {
    if (!meta) return;
    await recordUsage(meta.id);
    setUsageCount((c) => c + 1);
  };

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 pt-8">
        <Link href="/portals" className="inline-flex items-center gap-1.5 text-sm mb-4" style={{ color: 'var(--ink-soft)' }}>
          <ArrowLeft size="14" /> All Portals
        </Link>

        <ParchmentCard className="p-6 md:p-8">
          <div className="flex items-start gap-5">
            <Seal glyph={meta.glyph} accent={meta.accent} size={72} spin />
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="ink-heading text-3xl font-semibold" style={{ fontFamily: 'var(--font-display), serif' }}>{meta.name_en}</h1>
                {isPremium && <Chip variant="gold">Premium</Chip>}
                {status === 'hidden' && isAdmin && <Chip variant="error"><EyeOff size="11" /> Hidden</Chip>}
                {status === 'coming_soon' && (isAdmin || comingSoon) && <Chip variant="warning">قريباً</Chip>}
              </div>
              <div className="text-sm mt-1" style={{ color: 'var(--ink-muted)' }} dir="rtl">{meta.name_ar} · {meta.name_fr}</div>
              <p className="mt-3" style={{ color: 'var(--ink-soft)' }}>{meta.tagline_en}</p>
              {limitCount && (
                <div className="mt-3 text-xs flex items-center gap-1.5" style={{ color: 'var(--ink-muted)' }}>
                  <Clock size="12" /> Limit: {limitCount} uses per {limitWindow} · You: {usageCount}
                </div>
              )}
            </div>
          </div>
        </ParchmentCard>

        <div className="my-5">
          <DailyWindowBanner />
        </div>

        {hidden && (
          <GateState
            icon={<EyeOff size="28" />}
            title="This Portal is Hidden"
            message="The Sovereign Guard has concealed this service. Return when it is revealed."
          />
        )}
        {!hidden && comingSoon && (
          <GateState
            icon={<Clock size="28" />}
            title="Coming Soon — قريباً"
            message="This portal is being inscribed on the parchment. Check back soon."
          />
        )}
        {!hidden && !comingSoon && premiumLocked && (
          <GateState
            icon={<Lock size="28" />}
            title="Premium Portal"
            message="This service is gated behind premium clearance. Staff may bypass."
          />
        )}
        {!hidden && !comingSoon && !premiumLocked && limitReached && (
          <GateState
            icon={<Clock size="28" />}
            title="Rate Limit Reached"
            message={`You have used all ${limitCount} permitted interactions this ${limitWindow}. The parchment rests.`}
          />
        )}
        {!hidden && !comingSoon && !premiumLocked && !limitReached && Engine && (
          <div className="mt-6">
            <Engine />
            <div className="mt-6 flex justify-center">
              <GoldButton onClick={handleUse}>Record This Reading</GoldButton>
            </div>
          </div>
        )}
        {!hidden && !comingSoon && !premiumLocked && !limitReached && !Engine && (
          <GateState icon={<Clock size="28" />} title="Engine Inscribe Pending" message="This portal's engine is still being inscribed." />
        )}
      </main>
      <SiteFooter />
      <WheelOfDestiny />
    </>
  );
}

function GateState({ icon, title, message }: { icon: React.ReactNode; title: string; message: string }) {
  return (
    <ParchmentCard className="p-10 text-center mt-6">
      <div className="flex justify-center mb-3" style={{ color: 'var(--gold-600)' }}>{icon}</div>
      <h2 className="ink-heading text-2xl font-semibold" style={{ fontFamily: 'var(--font-display), serif' }}>{title}</h2>
      <p className="mt-2 max-w-md mx-auto" style={{ color: 'var(--ink-soft)' }}>{message}</p>
    </ParchmentCard>
  );
}
