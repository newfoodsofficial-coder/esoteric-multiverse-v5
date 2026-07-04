'use client';

import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';

export type CyclicalWindow = 'dawn' | 'noon' | 'dusk' | 'midnight' | 'shadow';

export interface WindowInfo {
  key: CyclicalWindow;
  label: string;
  labelAr: string;
  labelFr: string;
  glyph: string;
  message: string;
  messageAr: string;
  messageFr: string;
}

export const CYCLICAL_WINDOWS: WindowInfo[] = [
  {
    key: 'dawn',
    label: 'Dawn',
    labelAr: 'الفجر',
    labelFr: 'Aube',
    glyph: '\u2600',
    message: 'A new current opens. Cast a fresh geomantic figure before the sun climbs.',
    messageAr: 'تيار جديد يفتح. ارمِ رملًا جديدًا قبل ارتفاع الشمس.',
    messageFr: 'Un nouveau courant s\u2019ouvre. Lancez une figure géomantique fraîche.',
  },
  {
    key: 'noon',
    label: 'Noon',
    labelAr: 'الظهيرة',
    labelFr: 'Midi',
    glyph: '\u2609',
    message: 'Solar peak. The Taoist balancer favors Yang action now.',
    messageAr: 'ذروة شمسية. موازن التاو يفضّل فعل اليانغ الآن.',
    messageFr: 'Pic solaire. L\u2019équilibrateur Taoïste favorise l\u2019action Yang.',
  },
  {
    key: 'dusk',
    label: 'Dusk',
    labelAr: 'الغروب',
    labelFr: 'Crépuscule',
    glyph: '\u263D',
    message: 'The veil thins. Consult the Luciferian Tarot for night-side counsel.',
    messageAr: 'يخفّ الحجاب. استشر تاروت اللوسيفيري لاستشارة الجانب الليلي.',
    messageFr: 'Le voile s\u2019amincit. Consultez le Tarot Luciférien.',
  },
  {
    key: 'midnight',
    label: 'Midnight',
    labelAr: 'منتصف الليل',
    labelFr: 'Minuit',
    glyph: '\u2727',
    message: 'The Dream Necromancer listens. Record a dream before it fades.',
    messageAr: 'مفسّر الأحلام يستمع. سجّل حلمًا قبل أن يتبدد.',
    messageFr: 'Le Nécromancien des Rêves écoute. Notez un rêve.',
  },
  {
    key: 'shadow',
    label: 'Shadow Hour',
    labelAr: 'ساعة الظل',
    labelFr: 'Heure de l\u2019Ombre',
    glyph: '\u2742',
    message: 'Ego dissolves. The Shadow Profiler awaits your descent.',
    messageAr: 'تذوب الأنا. محلل الظل ينتظر نزولك.',
    messageFr: 'L\u2019ego se dissout. Le Profilage de l\u2019Ombre attend.',
  },
];

export function currentWindow(date = new Date()): WindowInfo {
  const h = date.getHours();
  if (h >= 5 && h < 10) return CYCLICAL_WINDOWS[0];
  if (h >= 10 && h < 16) return CYCLICAL_WINDOWS[1];
  if (h >= 16 && h < 20) return CYCLICAL_WINDOWS[2];
  if (h >= 20 && h < 24) return CYCLICAL_WINDOWS[3];
  return CYCLICAL_WINDOWS[4];
}

interface EngagementState {
  wheelOpen: boolean;
  openWheel: () => void;
  closeWheel: () => void;
  hasSpunToday: boolean;
  markSpun: () => void;
  window: WindowInfo;
}

const EngagementContext = createContext<EngagementState>({
  wheelOpen: false,
  openWheel: () => {},
  closeWheel: () => {},
  hasSpunToday: false,
  markSpun: () => {},
  window: CYCLICAL_WINDOWS[0],
});

const SPUN_KEY = 'gpc_spun_day';

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

export function EngagementProvider({ children }: { children: React.ReactNode }) {
  const [wheelOpen, setWheelOpen] = useState(false);
  const [hasSpunToday, setHasSpunToday] = useState(false);
  const [win, setWin] = useState<WindowInfo>(CYCLICAL_WINDOWS[0]);
  const interactionStart = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 30-second rule: 30s after first interaction, trigger the wheel (once per day)
  useEffect(() => {
    try {
      setHasSpunToday(localStorage.getItem(SPUN_KEY) === todayKey());
    } catch {
      // ignore
    }
    setWin(currentWindow());

    const onInteract = () => {
      if (interactionStart.current !== null) return;
      interactionStart.current = Date.now();
      try {
        if (localStorage.getItem(SPUN_KEY) === todayKey()) return;
      } catch {
        // ignore
      }
      timerRef.current = setTimeout(() => {
        setWheelOpen(true);
      }, 30000);
    };
    window.addEventListener('pointerdown', onInteract, { once: true });
    return () => {
      window.removeEventListener('pointerdown', onInteract);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const openWheel = useCallback(() => setWheelOpen(true), []);
  const closeWheel = useCallback(() => setWheelOpen(false), []);
  const markSpun = useCallback(() => {
    try {
      localStorage.setItem(SPUN_KEY, todayKey());
    } catch {
      // ignore
    }
    setHasSpunToday(true);
  }, []);

  return (
    <EngagementContext.Provider
      value={{ wheelOpen, openWheel, closeWheel, hasSpunToday, markSpun, window: win }}
    >
      {children}
    </EngagementContext.Provider>
  );
}

export function useEngagement() {
  return useContext(EngagementContext);
}
