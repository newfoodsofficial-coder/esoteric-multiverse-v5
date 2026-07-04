'use client';

import { useEffect, useState } from 'react';
import { supabase, type ServiceConfig } from '@/lib/supabase';
import { SERVICE_CATALOG, mergeServiceStatus, type ServiceMeta } from '@/lib/services';

export interface ServiceWithStatus extends ServiceMeta {
  status: string;
  tier: string;
  limit_window: string | null;
  limit_count: number | null;
}

export function useServices() {
  const [services, setServices] = useState<ServiceWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const { data, error: qErr } = await supabase
          .from('services')
          .select('id, slug, name_en, name_ar, name_fr, status, tier, limit_window, limit_count, sort_order')
          .order('sort_order', { ascending: true });
        if (qErr) throw qErr;
        const configs = (data ?? []) as unknown as ServiceConfig[];
        const merged = mergeServiceStatus(SERVICE_CATALOG, configs);
        if (!cancelled) setServices(merged);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? 'Failed to load services');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { services, loading, error };
}
