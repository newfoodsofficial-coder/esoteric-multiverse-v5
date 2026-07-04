'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

interface FingerprintState {
  fingerprint: string | null;
  ready: boolean;
  recordUsage: (serviceId: number) => Promise<void>;
  fetchUsage: (serviceId: number) => Promise<number>;
}

const FingerprintContext = createContext<FingerprintState>({
  fingerprint: null,
  ready: false,
  recordUsage: async () => {},
  fetchUsage: async () => 0,
});

const STORAGE_KEY = 'gpc_fp';

function computeFingerprint(): string {
  if (typeof navigator === 'undefined') return 'ssr';
  const parts = [
    navigator.userAgent,
    navigator.language,
    String(screen.width) + 'x' + String(screen.height),
    String(screen.colorDepth),
    String(new Date().getTimezoneOffset()),
    String(navigator.hardwareConcurrency || 0),
    String((navigator as any).deviceMemory || 0),
    String(navigator.platform || ''),
  ];
  const raw = parts.join('|');
  // simple djb2 hash
  let h = 5381;
  for (let i = 0; i < raw.length; i++) {
    h = (h * 33) ^ raw.charCodeAt(i);
  }
  return 'fp_' + (h >>> 0).toString(16);
}

export function FingerprintProvider({ children }: { children: React.ReactNode }) {
  const [fingerprint, setFingerprint] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let fp = '';
    try {
      fp = localStorage.getItem(STORAGE_KEY) || '';
    } catch {
      // ignore
    }
    if (!fp) {
      fp = computeFingerprint();
      try {
        localStorage.setItem(STORAGE_KEY, fp);
      } catch {
        // ignore
      }
    }
    setFingerprint(fp);
    setReady(true);
    // Persist to Supabase (idempotent)
    if (fp && fp !== 'ssr') {
      supabase
        .from('fingerprints')
        .upsert({ fingerprint: fp }, { onConflict: 'fingerprint' })
        .then(() => {}, () => {});
    }
  }, []);

  const recordUsage = useCallback(
    async (serviceId: number) => {
      if (!fingerprint || fingerprint === 'ssr') return;
      try {
        await supabase.from('usage_events').insert({
          fingerprint,
          service_id: serviceId,
        });
      } catch {
        // ignore
      }
    },
    [fingerprint]
  );

  const fetchUsage = useCallback(
    async (serviceId: number) => {
      if (!fingerprint || fingerprint === 'ssr') return 0;
      try {
        const { count, error } = await supabase
          .from('usage_events')
          .select('id', { count: 'exact', head: true })
          .eq('fingerprint', fingerprint)
          .eq('service_id', serviceId);
        if (error) return 0;
        return count ?? 0;
      } catch {
        return 0;
      }
    },
    [fingerprint]
  );

  return (
    <FingerprintContext.Provider value={{ fingerprint, ready, recordUsage, fetchUsage }}>
      {children}
    </FingerprintContext.Provider>
  );
}

export function useFingerprint() {
  return useContext(FingerprintContext);
}
