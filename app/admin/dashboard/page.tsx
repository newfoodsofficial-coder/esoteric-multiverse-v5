'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/components/admin/admin-provider';
import { supabase, type AdminUser, type ServiceConfig, type ApiKeyRow } from '@/lib/supabase';
import { SiteHeader, SiteFooter } from '@/components/parchment/site-chrome';
import { ParchmentCard, GoldButton, GhostButton, Seal, Chip, EmptyState } from '@/components/parchment/primitives';
import { StaffManager } from '@/components/admin/staff-manager';
import { ServiceOverrides } from '@/components/admin/service-overrides';
import { ApiKeyManager } from '@/components/admin/api-key-manager';
import { Telemetry } from '@/components/admin/telemetry';
import { Shield, Users, SlidersHorizontal, Key, Activity, LogOut } from 'lucide-react';

type Tab = 'staff' | 'services' | 'apikeys' | 'telemetry';

export default function DashboardPage() {
  const { tier, roleTitle, signOut, adminId } = useAdmin();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('staff');
  const [stats, setStats] = useState({ admins: 0, services: 0, keys: 0, usage: 0 });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (tier !== 'super') {
      router.replace('/admin');
    }
  }, [tier, router]);

  useEffect(() => {
    if (tier !== 'super') return;
    (async () => {
      try {
        const [a, s, k, u] = await Promise.all([
          supabase.from('admins').select('id', { count: 'exact', head: true }),
          supabase.from('services').select('id', { count: 'exact', head: true }),
          supabase.from('api_keys').select('id', { count: 'exact', head: true }),
          supabase.from('usage_events').select('id', { count: 'exact', head: true }),
        ]);
        setStats({
          admins: a.count ?? 0,
          services: s.count ?? 0,
          keys: k.count ?? 0,
          usage: u.count ?? 0,
        });
      } catch {
        // ignore
      } finally {
        setLoadingStats(false);
      }
    })();
  }, [tier]);

  if (tier !== 'super') {
    return (
      <>
        <SiteHeader />
        <main className="mx-auto max-w-md px-4 pt-20 text-center">
          <p style={{ color: 'var(--ink-soft)' }}>Super Admin clearance required.</p>
        </main>
        <SiteFooter />
      </>
    );
  }

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'staff', label: 'Staff', icon: <Users size="15" /> },
    { key: 'services', label: 'Service Overrides', icon: <SlidersHorizontal size="15" /> },
    { key: 'apikeys', label: 'API Keys', icon: <Key size="15" /> },
    { key: 'telemetry', label: 'Telemetry', icon: <Activity size="15" /> },
  ];

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 pt-8">
        {/* Header */}
        <ParchmentCard className="p-6 mb-6">
          <div className="flex items-center gap-4 flex-wrap">
            <Seal glyph={'\u2726'} accent="var(--gold-600)" size={64} spin />
            <div className="flex-1 min-w-0">
              <div className="gold-text text-xs uppercase tracking-[0.3em]">Super Admin Dashboard</div>
              <h1 className="ink-heading text-2xl font-semibold" style={{ fontFamily: 'var(--font-display), serif' }}>
                {roleTitle} <span className="text-sm font-normal" style={{ color: 'var(--ink-muted)' }}>· Sovereign</span>
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Chip variant="gold"><Shield size="11" /> Super Admin</Chip>
                <span className="text-xs" style={{ color: 'var(--ink-muted)' }}>{adminId?.slice(0, 8)}…</span>
              </div>
            </div>
            <GhostButton onClick={signOut}><LogOut size="14" className="mr-1.5" /> Sign Out</GhostButton>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard label="Staff" value={loadingStats ? '…' : String(stats.admins)} />
            <StatCard label="Services" value={loadingStats ? '…' : String(stats.services)} />
            <StatCard label="API Keys" value={loadingStats ? '…' : String(stats.keys)} />
            <StatCard label="Usage Events" value={loadingStats ? '…' : String(stats.usage)} />
          </div>
        </ParchmentCard>

        {/* Tabs */}
        <div className="flex flex-wrap gap-1 mb-5">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-colors"
              style={{
                background: tab === t.key ? 'var(--parchment-100)' : 'transparent',
                border: '1px solid',
                borderColor: tab === t.key ? 'var(--gold-400)' : 'var(--parchment-400)',
                color: tab === t.key ? 'var(--ink)' : 'var(--ink-soft)',
              }}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {tab === 'staff' && <StaffManager />}
        {tab === 'services' && <ServiceOverrides />}
        {tab === 'apikeys' && <ApiKeyManager />}
        {tab === 'telemetry' && <Telemetry />}
      </main>
      <SiteFooter />
    </>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg p-3 text-center" style={{ background: 'rgba(253,248,233,0.5)', border: '1px solid var(--parchment-400)' }}>
      <div className="ink-heading text-2xl font-semibold" style={{ fontFamily: 'var(--font-display), serif' }}>{value}</div>
      <div className="gold-text text-[10px] uppercase tracking-[0.2em] mt-0.5">{label}</div>
    </div>
  );
}
