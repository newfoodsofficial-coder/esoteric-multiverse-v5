'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/components/admin/admin-provider';
import { SiteHeader, SiteFooter } from '@/components/parchment/site-chrome';
import { ParchmentCard, GoldButton, Seal, SectionTitle } from '@/components/parchment/primitives';
import { Shield, Lock } from 'lucide-react';

export default function AdminPage() {
  const { tier, roleTitle, signIn, signOut, loading } = useAdmin();
  const router = useRouter();
  const [code, setCode] = useState('');
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (tier === 'super') router.replace('/admin/dashboard');
  }, [tier, router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    const res = await signIn(code);
    if (!res.ok) setErr(res.error ?? 'Sign-in failed.');
  };

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-md px-4 pt-16">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3"><Seal glyph={'\u2726'} accent="var(--gold-600)" size={72} /></div>
          <SectionTitle eyebrow="Staff Clearance" title="The Sovereign Guard" />
        </div>

        {tier ? (
          <ParchmentCard className="p-6 text-center">
            <div className="flex justify-center mb-2" style={{ color: 'var(--gold-600)' }}><Shield size="28" /></div>
            <div className="gold-text text-xs uppercase tracking-[0.25em]">Active Clearance</div>
            <div className="ink-heading text-xl font-semibold mt-1" style={{ fontFamily: 'var(--font-display), serif' }}>{roleTitle}</div>
            <div className="chip chip-gold mt-2">Tier: {tier}</div>
            {tier === 'super' ? (
              <GoldButton className="mt-5 w-full" onClick={() => router.push('/admin/dashboard')}>Enter the Dashboard</GoldButton>
            ) : (
              <p className="text-sm mt-4" style={{ color: 'var(--ink-soft)' }}>
                Admin clearance grants session monitoring. The Super Admin dashboard requires Super Admin clearance.
              </p>
            )}
            <button className="mt-4 text-sm underline" style={{ color: 'var(--ink-muted)' }} onClick={signOut}>Revoke clearance</button>
          </ParchmentCard>
        ) : (
          <ParchmentCard className="p-6">
            <form onSubmit={submit}>
              <div className="flex items-center gap-2 mb-3" style={{ color: 'var(--ink-soft)' }}>
                <Lock size="16" />
                <span className="text-sm font-medium">Enter your clearance code</span>
              </div>
              <input
                type="password"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="input-parchment w-full px-3 py-2.5"
                placeholder="Clearance code"
                autoFocus
              />
              {err && <p className="mt-2 text-sm" style={{ color: 'var(--error)' }}>{err}</p>}
              <GoldButton type="submit" className="mt-4 w-full" disabled={loading || !code.trim()}>
                {loading ? 'Verifying…' : 'Request Clearance'}
              </GoldButton>
              <p className="mt-4 text-xs text-center" style={{ color: 'var(--ink-muted)' }}>
                Two layers guard the codex: Admin and Super Admin. Codes are stored in the sovereign vault.
              </p>
            </form>
          </ParchmentCard>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
