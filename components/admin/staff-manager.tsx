'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase, type AdminUser, type AdminTier } from '@/lib/supabase';
import { ParchmentCard, GoldButton, GhostButton, Chip, EmptyState } from '@/components/parchment/primitives';
import { useAdmin } from '@/components/admin/admin-provider';
import { UserPlus, Trash2, Pencil, Power } from 'lucide-react';

export function StaffManager() {
  const { adminId } = useAdmin();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState<{ role_title: string; access_code: string; tier: AdminTier } | null>(null);
  const [newOpen, setNewOpen] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ role_title: '', access_code: '', tier: 'admin' as AdminTier });

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const { data, error: qErr } = await supabase
        .from('admins')
        .select('id, role_title, tier, access_code, active, created_at')
        .order('created_at', { ascending: false });
      if (qErr) throw qErr;
      setAdmins((data ?? []) as AdminUser[]);
    } catch (e: any) {
      setErr(e?.message ?? 'Failed to load staff');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const startEdit = (a: AdminUser) => {
    setEditing(a.id);
    setDraft({ role_title: a.role_title, access_code: a.access_code, tier: a.tier });
  };

  const saveEdit = async (id: string) => {
    if (!draft) return;
    if (!draft.role_title.trim() || !draft.access_code.trim()) return;
    try {
      const { error: uErr } = await supabase
        .from('admins')
        .update({ role_title: draft.role_title.trim(), access_code: draft.access_code.trim(), tier: draft.tier })
        .eq('id', id);
      if (uErr) throw uErr;
      setEditing(null);
      setDraft(null);
      await load();
    } catch (e: any) {
      setErr(e?.message ?? 'Update failed');
    }
  };

  const toggleActive = async (a: AdminUser) => {
    try {
      const { error: uErr } = await supabase.from('admins').update({ active: !a.active }).eq('id', a.id);
      if (uErr) throw uErr;
      await load();
    } catch (e: any) {
      setErr(e?.message ?? 'Toggle failed');
    }
  };

  const remove = async (a: AdminUser) => {
    if (a.id === adminId) { setErr('You cannot delete your own clearance.'); return; }
    if (!confirm(`Delete clearance "${a.role_title}"? This cannot be undone.`)) return;
    try {
      const { error: dErr } = await supabase.from('admins').delete().eq('id', a.id);
      if (dErr) throw dErr;
      await load();
    } catch (e: any) {
      setErr(e?.message ?? 'Delete failed');
    }
  };

  const create = async () => {
    if (!newAdmin.role_title.trim() || !newAdmin.access_code.trim()) return;
    try {
      const { error: iErr } = await supabase.from('admins').insert({
        role_title: newAdmin.role_title.trim(),
        access_code: newAdmin.access_code.trim(),
        tier: newAdmin.tier,
        active: true,
      });
      if (iErr) throw iErr;
      setNewAdmin({ role_title: '', access_code: '', tier: 'admin' });
      setNewOpen(false);
      await load();
    } catch (e: any) {
      setErr(e?.message ?? 'Create failed');
    }
  };

  return (
    <ParchmentCard className="p-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <div className="gold-text text-xs uppercase tracking-[0.25em]">Staff Overlord Module</div>
          <h2 className="ink-heading text-xl font-semibold" style={{ fontFamily: 'var(--font-display), serif' }}>Manage Admins</h2>
        </div>
        <GoldButton onClick={() => setNewOpen((o) => !o)}><UserPlus size="14" className="mr-1.5" /> Add Admin</GoldButton>
      </div>

      {err && <p className="mt-3 text-sm" style={{ color: 'var(--error)' }}>{err}</p>}

      {newOpen && (
        <div className="mt-4 rounded-lg p-4 animate-fade-in" style={{ background: 'rgba(253,248,233,0.6)', border: '1px solid var(--gold-400)' }}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-medium" style={{ color: 'var(--ink-soft)' }}>Role Title</label>
              <input value={newAdmin.role_title} onChange={(e) => setNewAdmin({ ...newAdmin, role_title: e.target.value })} className="input-parchment w-full px-3 py-2 mt-1" placeholder="e.g. مراقب, Sovereign Oracle" dir="auto" />
            </div>
            <div>
              <label className="text-xs font-medium" style={{ color: 'var(--ink-soft)' }}>Access Code</label>
              <input value={newAdmin.access_code} onChange={(e) => setNewAdmin({ ...newAdmin, access_code: e.target.value })} className="input-parchment w-full px-3 py-2 mt-1" placeholder="Clearance code" />
            </div>
            <div>
              <label className="text-xs font-medium" style={{ color: 'var(--ink-soft)' }}>Tier</label>
              <select value={newAdmin.tier} onChange={(e) => setNewAdmin({ ...newAdmin, tier: e.target.value as AdminTier })} className="input-parchment w-full px-3 py-2 mt-1">
                <option value="admin">Admin</option>
                <option value="super">Super Admin</option>
              </select>
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <GoldButton onClick={create} disabled={!newAdmin.role_title.trim() || !newAdmin.access_code.trim()}>Create</GoldButton>
            <GhostButton onClick={() => setNewOpen(false)}>Cancel</GhostButton>
          </div>
        </div>
      )}

      <div className="mt-5 space-y-2">
        {loading && <EmptyState message="Loading staff…" />}
        {!loading && admins.length === 0 && <EmptyState message="No staff found." />}
        {!loading && admins.map((a) => (
          <div key={a.id} className="rounded-lg p-3 flex items-center gap-3 flex-wrap" style={{ background: 'rgba(253,248,233,0.5)', border: '1px solid var(--parchment-400)' }}>
            {editing === a.id && draft ? (
              <>
                <input value={draft.role_title} onChange={(e) => setDraft({ ...draft, role_title: e.target.value })} className="input-parchment px-2 py-1.5 flex-1 min-w-[140px]" dir="auto" />
                <input value={draft.access_code} onChange={(e) => setDraft({ ...draft, access_code: e.target.value })} className="input-parchment px-2 py-1.5 w-40" />
                <select value={draft.tier} onChange={(e) => setDraft({ ...draft, tier: e.target.value as AdminTier })} className="input-parchment px-2 py-1.5">
                  <option value="admin">Admin</option>
                  <option value="super">Super</option>
                </select>
                <GoldButton onClick={() => saveEdit(a.id)}>Save</GoldButton>
                <GhostButton onClick={() => { setEditing(null); setDraft(null); }}>Cancel</GhostButton>
              </>
            ) : (
              <>
                <div className="flex-1 min-w-[160px]">
                  <div className="font-semibold" style={{ color: 'var(--ink)' }} dir="auto">{a.role_title}</div>
                  <div className="text-xs" style={{ color: 'var(--ink-muted)' }}>Code: {a.access_code.slice(0, 3)}••••</div>
                </div>
                <Chip variant={a.tier === 'super' ? 'gold' : 'default'}>{a.tier === 'super' ? 'Super' : 'Admin'}</Chip>
                <Chip variant={a.active ? 'success' : 'error'}>{a.active ? 'Active' : 'Suspended'}</Chip>
                {a.id === adminId && <Chip variant="gold">You</Chip>}
                <div className="flex gap-1">
                  <button onClick={() => startEdit(a)} className="p-1.5 rounded-md" style={{ color: 'var(--ink-soft)' }} aria-label="Edit"><Pencil size="15" /></button>
                  <button onClick={() => toggleActive(a)} className="p-1.5 rounded-md" style={{ color: 'var(--ink-soft)' }} aria-label="Toggle active"><Power size="15" /></button>
                  <button onClick={() => remove(a)} className="p-1.5 rounded-md" style={{ color: 'var(--error)' }} aria-label="Delete"><Trash2 size="15" /></button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </ParchmentCard>
  );
}
