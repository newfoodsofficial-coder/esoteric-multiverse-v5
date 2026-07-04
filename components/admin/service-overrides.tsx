'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase, type ServiceConfig } from '@/lib/supabase';
import { SERVICE_CATALOG } from '@/lib/services';
import { ParchmentCard, GoldButton, Chip, EmptyState } from '@/components/parchment/primitives';
import { Eye, EyeOff, Clock, Lock, Unlock } from 'lucide-react';

type Status = 'active' | 'hidden' | 'coming_soon';
type Tier = 'free' | 'premium';
type Window = 'day' | 'month' | 'year' | null;

export function ServiceOverrides() {
  const [configs, setConfigs] = useState<ServiceConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [saving, setSaving] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error: qErr } = await supabase
        .from('services')
        .select('id, slug, name_en, name_ar, name_fr, status, tier, limit_window, limit_count, sort_order')
        .order('sort_order', { ascending: true });
      if (qErr) throw qErr;
      setConfigs((data ?? []) as unknown as ServiceConfig[]);
    } catch (e: any) {
      setErr(e?.message ?? 'Failed to load services');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const update = async (id: number, patch: Partial<ServiceConfig>) => {
    setSaving(id);
    try {
      const { error: uErr } = await supabase.from('services').update(patch).eq('id', id);
      if (uErr) throw uErr;
      await load();
    } catch (e: any) {
      setErr(e?.message ?? 'Update failed');
    } finally {
      setSaving(null);
    }
  };

  const meta = (id: number) => SERVICE_CATALOG.find((s) => s.id === id);

  return (
    <ParchmentCard className="p-6">
      <div className="gold-text text-xs uppercase tracking-[0.25em]">Surgical Control Center</div>
      <h2 className="ink-heading text-xl font-semibold" style={{ fontFamily: 'var(--font-display), serif' }}>All 10 Portals — Overrides</h2>
      <p className="text-sm mt-1" style={{ color: 'var(--ink-soft)' }}>
        Hide, suspend (قريباً), toggle Free/Premium, or set per-fingerprint rate-limits for each service.
      </p>
      {err && <p className="mt-3 text-sm" style={{ color: 'var(--error)' }}>{err}</p>}

      <div className="mt-5 space-y-3">
        {loading && <EmptyState message="Loading services…" />}
        {!loading && configs.map((c) => {
          const m = meta(c.id);
          if (!m) return null;
          const isSaving = saving === c.id;
          return (
            <div key={c.id} className="rounded-lg p-4" style={{ background: 'rgba(253,248,233,0.5)', border: '1px solid var(--parchment-400)' }}>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-2xl" style={{ color: m.accent }}>{m.glyph}</span>
                <div className="flex-1 min-w-[160px]">
                  <div className="font-semibold" style={{ color: 'var(--ink)' }}>{c.name_en}</div>
                  <div className="text-xs" style={{ color: 'var(--ink-muted)' }} dir="rtl">{c.name_ar}</div>
                </div>
                {isSaving && <Chip variant="gold">Saving…</Chip>}
              </div>

              {/* Status */}
              <div className="mt-3 flex items-center gap-2 flex-wrap">
                <span className="text-xs font-medium" style={{ color: 'var(--ink-soft)' }}>Status:</span>
                <SegBtn active={c.status === 'active'} onClick={() => update(c.id, { status: 'active' })} icon={<Eye size="13" />} label="Active" />
                <SegBtn active={c.status === 'coming_soon'} onClick={() => update(c.id, { status: 'coming_soon' })} icon={<Clock size="13" />} label="قريباً" />
                <SegBtn active={c.status === 'hidden'} onClick={() => update(c.id, { status: 'hidden' })} icon={<EyeOff size="13" />} label="Hidden" />
              </div>

              {/* Tier */}
              <div className="mt-2 flex items-center gap-2 flex-wrap">
                <span className="text-xs font-medium" style={{ color: 'var(--ink-soft)' }}>Tier:</span>
                <SegBtn active={c.tier === 'free'} onClick={() => update(c.id, { tier: 'free' })} icon={<Unlock size="13" />} label="Free" />
                <SegBtn active={c.tier === 'premium'} onClick={() => update(c.id, { tier: 'premium' })} icon={<Lock size="13" />} label="Premium" />
              </div>

              {/* Rate limit */}
              <div className="mt-2 flex items-center gap-2 flex-wrap">
                <span className="text-xs font-medium" style={{ color: 'var(--ink-soft)' }}>Rate limit:</span>
                <input
                  type="number"
                  min={0}
                  value={c.limit_count ?? ''}
                  onChange={(e) => {
                    const v = e.target.value;
                    update(c.id, { limit_count: v === '' ? null : Math.max(0, parseInt(v, 10)) });
                  }}
                  className="input-parchment px-2 py-1 w-20"
                  placeholder="—"
                />
                <select
                  value={c.limit_window ?? ''}
                  onChange={(e) => {
                    const v = e.target.value;
                    update(c.id, { limit_window: (v || null) as any });
                  }}
                  className="input-parchment px-2 py-1"
                >
                  <option value="">None</option>
                  <option value="day">Per Day</option>
                  <option value="month">Per Month</option>
                  <option value="year">Per Year</option>
                </select>
                {(c.limit_count !== null) && (
                  <button className="text-xs underline" style={{ color: 'var(--ink-muted)' }} onClick={() => update(c.id, { limit_count: null, limit_window: null })}>
                    Clear limit
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </ParchmentCard>
  );
}

function SegBtn({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium"
      style={{
        background: active ? 'rgba(212,175,55,0.15)' : 'transparent',
        border: '1px solid',
        borderColor: active ? 'var(--gold-500)' : 'var(--parchment-500)',
        color: active ? 'var(--ink)' : 'var(--ink-soft)',
      }}
    >
      {icon} {label}
    </button>
  );
}
