'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase, type AdminUser, type AdminTier } from '@/lib/supabase';

interface AdminState {
  tier: AdminTier | null;
  roleTitle: string | null;
  adminId: string | null;
  loading: boolean;
  error: string | null;
  signIn: (code: string) => Promise<{ ok: boolean; error?: string }>;
  signOut: () => void;
}

const AdminContext = createContext<AdminState>({
  tier: null,
  roleTitle: null,
  adminId: null,
  loading: false,
  error: null,
  signIn: async () => ({ ok: false }),
  signOut: () => {},
});

const STORAGE_KEY = 'gpc_admin_session';

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [tier, setTier] = useState<AdminTier | null>(null);
  const [roleTitle, setRoleTitle] = useState<string | null>(null);
  const [adminId, setAdminId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { adminId: string; tier: AdminTier; roleTitle: string };
        setTier(parsed.tier);
        setRoleTitle(parsed.roleTitle);
        setAdminId(parsed.adminId);
      }
    } catch {
      // ignore
    }
  }, []);

  const signIn = useCallback(async (code: string) => {
    setLoading(true);
    setError(null);
    try {
      const trimmed = code.trim();
      if (!trimmed) return { ok: false, error: 'Enter a clearance code.' };

      const { data, error: qErr } = await supabase
        .from('admins')
        .select('id, role_title, tier, access_code, active')
        .eq('access_code', trimmed)
        .maybeSingle();

      if (qErr) return { ok: false, error: 'Oracle unreachable. Try again.' };
      if (!data) return { ok: false, error: 'Invalid clearance code.' };
      const admin = data as AdminUser;
      if (!admin.active) return { ok: false, error: 'This clearance has been suspended.' };

      setTier(admin.tier);
      setRoleTitle(admin.role_title);
      setAdminId(admin.id);
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ adminId: admin.id, tier: admin.tier, roleTitle: admin.role_title })
        );
      } catch {
        // ignore
      }
      return { ok: true };
    } catch {
      return { ok: false, error: 'Unexpected error during clearance.' };
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(() => {
    setTier(null);
    setRoleTitle(null);
    setAdminId(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  return (
    <AdminContext.Provider
      value={{ tier, roleTitle, adminId, loading, error, signIn, signOut }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  return useContext(AdminContext);
}
