import type { ServiceConfig } from '@/lib/supabase';

export interface ServiceMeta {
  id: number;
  slug: string;
  name_en: string;
  name_ar: string;
  name_fr: string;
  tagline_en: string;
  tagline_ar: string;
  tagline_fr: string;
  glyph: string; // single unicode glyph used as a seal
  accent: string; // hex accent for the seal
}

export const SERVICE_CATALOG: ServiceMeta[] = [
  {
    id: 1,
    slug: 'shadow-profiler',
    name_en: 'Shadow Profiler',
    name_ar: 'محلل الظل',
    name_fr: 'Profilage de l\u2019Ombre',
    tagline_en: 'Psychological ego dissolution & shadow integration.',
    tagline_ar: 'تفكيك الأنا ودمج الظل النفسي.',
    tagline_fr: 'Dissolution de l\u2019ego et intégration de l\u2019Ombre.',
    glyph: '\u263D',
    accent: '#5d4037',
  },
  {
    id: 2,
    slug: 'al-zanati-geomancy',
    name_en: 'Al-Zanati Geomancy',
    name_ar: 'الرمل الزناتي',
    name_fr: 'Géomancie Al-Zanati',
    tagline_en: 'Binary matrix sand-dot divination of the desert masters.',
    tagline_ar: 'العرافة الرملية بنقاط المصفوفة الثنائية.',
    tagline_fr: 'Divination par matrice binaire des sables.',
    glyph: '\u25CF',
    accent: '#a1887f',
  },
  {
    id: 3,
    slug: 'luciferian-tarot',
    name_en: 'Luciferian Tarot Oracle',
    name_ar: 'تاروت اللوسيفيري',
    name_fr: 'Oracle Tarot Luciférien',
    tagline_en: '78 Qliphoth cards of the night-side tree.',
    tagline_ar: '٧٨ بطاقة قليفوت لشجرة الجانب الليلي.',
    tagline_fr: '78 cartes Qliphoth de l\u2019arbre nocturne.',
    glyph: '\u2727',
    accent: '#8d6e63',
  },
  {
    id: 4,
    slug: 'taoist-shift',
    name_en: 'Taoist Shift Balancer',
    name_ar: 'موازن التاو',
    name_fr: 'Équilibrateur Taoïste',
    tagline_en: 'Yin/Yang elemental computation & rebalancing.',
    tagline_ar: 'حساب وتهدئة عناصر اليين واليانغ.',
    tagline_fr: 'Calcul et équilibrage Yin/Yang.',
    glyph: '\u262F',
    accent: '#4a6b3a',
  },
  {
    id: 5,
    slug: 'kabbalistic-jafr',
    name_en: 'Kabbalistic & Jafr Numerology',
    name_ar: 'علم الحروف والجفر',
    name_fr: 'Numérologie Kabbalistique & Jafr',
    tagline_en: 'Abjad alphanumeric calculations & letter-power.',
    tagline_ar: 'حسابات الأبجدية والجفر وقوة الحروف.',
    tagline_fr: 'Calculs abjad et puissance des lettres.',
    glyph: '\u05D0',
    accent: '#b8860b',
  },
  {
    id: 6,
    slug: 'dream-necromancer',
    name_en: 'Dream Necromancer',
    name_ar: 'مفسّر الأحلام',
    name_fr: 'Nécromancien des Rêves',
    tagline_en: 'Ancient dream decoding & the necromantic glossary.',
    tagline_ar: 'تفسير الأحلام القديم ومعجم العبور.',
    tagline_fr: 'Décodage ancien des rêves et glossaire.',
    glyph: '\u2742',
    accent: '#8b3a2e',
  },
  {
    id: 7,
    slug: 'ritual-alchemy',
    name_en: 'Ritual Alchemy Engine',
    name_ar: 'محرّك الخيمياء الطقسي',
    name_fr: 'Moteur d\u2019Alchimie Rituelle',
    tagline_en: 'Custom geometric talisman synthesis (zero-storage).',
    tagline_ar: 'تخليق التعاويذ الهندسية بدون تخزين.',
    tagline_fr: 'Synthèse de talismans géométriques (zéro stockage).',
    glyph: '\u2725',
    accent: '#9a6f08',
  },
  {
    id: 8,
    slug: 'bio-energy-synastry',
    name_en: 'Bio-Energy Synastry',
    name_ar: 'التوافق الطاقي',
    name_fr: 'Synastrie Bio-Énergétique',
    tagline_en: 'Compatibility through client-side static graphic cards.',
    tagline_ar: 'التوافق عبر بطاقات رسومية ثابتة على الجهاز.',
    tagline_fr: 'Compatibilité par cartes graphiques côté client.',
    glyph: '\u269B',
    accent: '#a1887f',
  },
  {
    id: 9,
    slug: 'planetary-transit',
    name_en: 'Planetary Transit Guide',
    name_ar: 'دليل العبور الكوكبي',
    name_fr: 'Guide des Transits Planétaires',
    tagline_en: 'Daily lunar mansions & planetary shifts tracking.',
    tagline_ar: 'تتبع المنازل القمرية والعبارات الكوكبية اليومية.',
    tagline_fr: 'Suivi des mansions lunaires et transits quotidiens.',
    glyph: '\u2609',
    accent: '#d4af37',
  },
  {
    id: 10,
    slug: 'sovereign-guard',
    name_en: 'The Sovereign Guard Engine',
    name_ar: 'محرّك الحارس السيادي',
    name_fr: 'Moteur de la Garde Souveraine',
    tagline_en: 'The 30-second engagement wheel & guardian popup.',
    tagline_ar: 'عجلة التفاعل كل ٣٠ ثانية وحارس النوافذ المنبثقة.',
    tagline_fr: 'Roue d\u2019engagement 30s et popup gardien.',
    glyph: '\u2726',
    accent: '#3e2723',
  },
];

export function serviceBySlug(slug: string): ServiceMeta | undefined {
  return SERVICE_CATALOG.find((s) => s.slug === slug);
}

export function mergeServiceStatus(
  meta: ServiceMeta[],
  configs: ServiceConfig[]
): (ServiceMeta & {
  status: string;
  tier: string;
  limit_window: string | null;
  limit_count: number | null;
})[] {
  const byId = new Map(configs.map((c) => [c.id, c]));
  return meta.map((m) => {
    const c = byId.get(m.id);
    return {
      ...m,
      status: c?.status ?? 'active',
      tier: c?.tier ?? 'free',
      limit_window: c?.limit_window ?? null,
      limit_count: c?.limit_count ?? null,
    };
  });
}
