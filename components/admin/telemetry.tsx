'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { SERVICE_CATALOG } from '@/lib/services';
import { ParchmentCard, Chip, EmptyState } from '@/components/parchment/primitives';
import { Activity, Fingerprint, Clock } from 'lucide-react';

interface ServiceUsage {
  serviceId: number;
  count: number;
}

export function Telemetry() {
  const [usage, setUsage] = useState<ServiceUsage[]>([]);
  const [fpCount, setFpCount] = useState(0);
  const [totalUsage, setTotalUsage] = useState(0);
  const [recent, setRecent] = useState<{ fingerprint: string; service_id: number; created_at: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const [fp, total, events] = await Promise.all([
        supabase.from('fingerprints').select('id', { count: 'exact', head: true }),
        supabase.from('usage_events').select('id', { count: 'exact', head: true }),
        supabase.from('usage_events').select('fingerprint, service_id, created_at').order('created_at', { ascending: false }).limit(20),
      ]);
      setFpCount(fp.count ?? 0);
      setTotalUsage(total.count ?? 0);
      setRecent((events.data ?? []) as any);

      // Per-service counts
      const perService: ServiceUsage[] = [];
      for (const s of SERVICE_CATALOG) {
        const { count } = await supabase
          .from('usage_events')
          .select('id', { count: 'exact', head: true })
          .eq('service_id', s.id);
        perService.push({ serviceId: s.id, count: count ?? 0 });
      }
      setUsage(perService);
    } catch (e: any) {
      setErr(e?.message ?? 'Failed to load telemetry');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const max = Math.max(1, ...usage.map((u) => u.count));

  return (
    <div className="space-y-5">
      <ParchmentCard className="p-6">
        <div className="gold-text text-xs uppercase tracking-[0.25em]">Real-time Telemetry</div>
        <h2 className="ink-heading text-xl font-semibold" style={{ fontFamily: 'var(--font-display), serif' }}>Engagement Tracking</h2>
        {err && <p className="mt-3 text-sm" style={{ color: 'var(--error)' }}>{err}</p>}

        <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
          <Metric icon={<Activity size="16" />} label="Total Usage" value={loading ? '…' : String(totalUsage)} />
          <Metric icon={<Fingerprint size="16" />} label="Unique Fingerprints" value={loading ? '…' : String(fpCount)} />
          <Metric icon={<Clock size="16" />} label="Active Services" value={loading ? '…' : String(usage.filter((u) => u.count > 0).length)} />
        </div>
      </ParchmentCard>

      <ParchmentCard className="p-6">
        <h3 className="font-semibold" style={{ color: 'var(--ink)' }}>Usage per Service</h3>
        {loading ? <EmptyState message="Loading…" /> : (
          <div className="mt-4 space-y-3">
            {SERVICE_CATALOG.map((s) => {
              const u = usage.find((x) => x.serviceId === s.id);
              const count = u?.count ?? 0;
              const pct = Math.round((count / max) * 100);
              return (
                <div key={s.id}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2" style={{ color: 'var(--ink)' }}>
                      <span style={{ color: s.accent }}>{s.glyph}</span> {s.name_en}
                    </span>
                    <span style={{ color: 'var(--ink-soft)' }}>{count}</span>
                  </div>
                  <div className="mt-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--parchment-300)' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, var(--gold-400), var(--gold-600))', transition: 'width 0.5s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </ParchmentCard>

      <ParchmentCard className="p-6">
        <h3 className="font-semibold" style={{ color: 'var(--ink)' }}>Recent Events</h3>
        {loading ? <EmptyState message="Loading…" /> : recent.length === 0 ? <EmptyState message="No events yet." /> : (
          <div className="mt-3 space-y-1.5">
            {recent.map((r, i) => {
              const s = SERVICE_CATALOG.find((x) => x.id === r.service_id);
              return (
                <div key={i} className="flex items-center gap-3 text-sm py-1.5 border-b" style={{ borderColor: 'var(--parchment-400)' }}>
                  <span style={{ color: s?.accent }}>{s?.glyph}</span>
                  <span style={{ color: 'var(--ink)' }}>{s?.name_en ?? 'Unknown'}</span>
                  <span className="text-xs" style={{ color: 'var(--ink-muted)' }}>{r.fingerprint.slice(0, 12)}…</span>
                  <span className="ml-auto text-xs" style={{ color: 'var(--ink-muted)' }}>
                    {new Date(r.created_at).toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </ParchmentCard>
    </div>
  );
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg p-3 text-center" style={{ background: 'rgba(253,248,233,0.5)', border: '1px solid var(--parchment-400)' }}>
      <div className="flex justify-center mb-1" style={{ color: 'var(--gold-600)' }}>{icon}</div>
      <div className="ink-heading text-2xl font-semibold" style={{ fontFamily: 'var(--font-display), serif' }}>{value}</div>
      <div className="gold-text text-[10px] uppercase tracking-[0.2em] mt-0.5">{label}</div>
    </div>
  );
}
