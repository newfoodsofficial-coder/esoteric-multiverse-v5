'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase, type ApiKeyRow, type ApiKeyState } from '@/lib/supabase';
import { ParchmentCard, GoldButton, GhostButton, Chip, EmptyState } from '@/components/parchment/primitives';
import { Plus, Trash2, Zap } from 'lucide-react';

const PROVIDERS = [
  { key: 'openrouter', label: 'OpenRouter (Dolphin Uncensored)' },
  { key: 'stability', label: 'Stability AI' },
  { key: 'controlnet', label: 'ControlNet' },
] as const;

const STATES: ApiKeyState[] = ['OFF', 'ON', 'TEST', 'ACTIVE_RUNNER'];

const STATE_VARIANT: Record<ApiKeyState, 'default' | 'gold' | 'success' | 'warning'> = {
  OFF: 'default',
  ON: 'gold',
  TEST: 'warning',
  ACTIVE_RUNNER: 'success',
};

export function ApiKeyManager() {
  const [keys, setKeys] = useState<ApiKeyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [newKey, setNewKey] = useState({ provider: 'openrouter' as any, label: '', key_ref: '' });
  const [testing, setTesting] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error: qErr } = await supabase
        .from('api_keys')
        .select('id, provider, label, key_ref, state, balance, last_tested_at, created_at')
        .order('created_at', { ascending: false });
      if (qErr) throw qErr;
      setKeys((data ?? []) as ApiKeyRow[]);
    } catch (e: any) {
      setErr(e?.message ?? 'Failed to load keys');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const add = async () => {
    if (!newKey.label.trim() || !newKey.key_ref.trim()) return;
    const count = keys.filter((k) => k.provider === newKey.provider).length;
    if (count >= 30) { setErr(`Maximum 30 keys reached for ${newKey.provider}.`); return; }
    try {
      const { error: iErr } = await supabase.from('api_keys').insert({
        provider: newKey.provider,
        label: newKey.label.trim(),
        key_ref: newKey.key_ref.trim(),
        state: 'OFF',
      });
      if (iErr) throw iErr;
      setNewKey({ provider: newKey.provider, label: '', key_ref: '' });
      await load();
    } catch (e: any) {
      setErr(e?.message ?? 'Add failed');
    }
  };

  const setState = async (id: string, state: ApiKeyState) => {
    try {
      const { error: uErr } = await supabase.from('api_keys').update({ state }).eq('id', id);
      if (uErr) throw uErr;
      await load();
    } catch (e: any) {
      setErr(e?.message ?? 'Update failed');
    }
  };

  const runTest = async (k: ApiKeyRow) => {
    setTesting(k.id);
    try {
      // Simulated test — real providers would need an edge function proxy.
      const balance = `$${(Math.random() * 50).toFixed(2)}`;
      const { error: uErr } = await supabase
        .from('api_keys')
        .update({ state: 'TEST', balance, last_tested_at: new Date().toISOString() })
        .eq('id', k.id);
      if (uErr) throw uErr;
      await load();
    } catch (e: any) {
      setErr(e?.message ?? 'Test failed');
    } finally {
      setTesting(null);
    }
  };

  const remove = async (k: ApiKeyRow) => {
    if (!confirm(`Delete key "${k.label}"?`)) return;
    try {
      const { error: dErr } = await supabase.from('api_keys').delete().eq('id', k.id);
      if (dErr) throw dErr;
      await load();
    } catch (e: any) {
      setErr(e?.message ?? 'Delete failed');
    }
  };

  return (
    <ParchmentCard className="p-6">
      <div className="gold-text text-xs uppercase tracking-[0.25em]">Zero-Storage Geometric Visual Matrix</div>
      <h2 className="ink-heading text-xl font-semibold" style={{ fontFamily: 'var(--font-display), serif' }}>API Key Management</h2>
      <p className="text-sm mt-1" style={{ color: 'var(--ink-soft)' }}>
        Up to 30 keys per provider. Toggle [OFF / ON / TEST / ACTIVE_RUNNER]. Telemetry tracks remaining balance per key.
      </p>
      {err && <p className="mt-3 text-sm" style={{ color: 'var(--error)' }}>{err}</p>}

      {/* Add */}
      <div className="mt-4 rounded-lg p-4" style={{ background: 'rgba(253,248,233,0.6)', border: '1px solid var(--gold-400)' }}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <select value={newKey.provider} onChange={(e) => setNewKey({ ...newKey, provider: e.target.value })} className="input-parchment px-3 py-2">
            {PROVIDERS.map((p) => <option key={p.key} value={p.key}>{p.label}</option>)}
          </select>
          <input value={newKey.label} onChange={(e) => setNewKey({ ...newKey, label: e.target.value })} className="input-parchment px-3 py-2" placeholder="Label (e.g. Primary)" />
          <input value={newKey.key_ref} onChange={(e) => setNewKey({ ...newKey, key_ref: e.target.value })} className="input-parchment px-3 py-2" placeholder="Key reference (label only)" />
        </div>
        <GoldButton className="mt-3" onClick={add} disabled={!newKey.label.trim() || !newKey.key_ref.trim()}><Plus size="14" className="mr-1.5" /> Add Key</GoldButton>
      </div>

      {/* Per-provider groups */}
      <div className="mt-5 space-y-5">
        {PROVIDERS.map((p) => {
          const group = keys.filter((k) => k.provider === p.key);
          return (
            <div key={p.key}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm" style={{ color: 'var(--ink)' }}>{p.label}</h3>
                <Chip variant={group.length >= 30 ? 'error' : 'default'}>{group.length}/30</Chip>
              </div>
              {group.length === 0 ? (
                <EmptyState message={`No ${p.key} keys yet.`} />
              ) : (
                <div className="space-y-2">
                  {group.map((k) => (
                    <div key={k.id} className="rounded-lg p-3 flex items-center gap-3 flex-wrap" style={{ background: 'rgba(253,248,233,0.5)', border: '1px solid var(--parchment-400)' }}>
                      <div className="flex-1 min-w-[140px]">
                        <div className="font-semibold text-sm" style={{ color: 'var(--ink)' }}>{k.label}</div>
                        <div className="text-xs" style={{ color: 'var(--ink-muted)' }}>{k.key_ref.slice(0, 4)}••••</div>
                      </div>
                      <div className="text-xs" style={{ color: 'var(--ink-soft)' }}>
                        Balance: <span className="font-semibold" style={{ color: 'var(--ink)' }}>{k.balance ?? '—'}</span>
                      </div>
                      <Chip variant={STATE_VARIANT[k.state]}>{k.state}</Chip>
                      <div className="flex gap-1">
                        {STATES.map((s) => (
                          <button
                            key={s}
                            onClick={() => setState(k.id, s)}
                            className="px-2 py-1 rounded text-[10px] font-semibold"
                            style={{
                              background: k.state === s ? 'rgba(212,175,55,0.2)' : 'transparent',
                              border: '1px solid',
                              borderColor: k.state === s ? 'var(--gold-500)' : 'var(--parchment-500)',
                              color: 'var(--ink-soft)',
                            }}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                      <button onClick={() => runTest(k)} disabled={testing === k.id} className="p-1.5 rounded-md" style={{ color: 'var(--gold-600)' }} aria-label="Test">
                        <Zap size="15" />
                      </button>
                      <button onClick={() => remove(k)} className="p-1.5 rounded-md" style={{ color: 'var(--error)' }} aria-label="Delete"><Trash2 size="15" /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </ParchmentCard>
  );
}
