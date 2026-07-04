'use client';

import { useState, useEffect } from 'react';
import { ParchmentCard, SectionTitle, Chip } from '@/components/parchment/primitives';

const MANSIONS = [
  { name: 'Al-Sharatain', ar: 'الشرطان', theme: 'Beginnings, bold action' },
  { name: 'Al-Butain', ar: 'البطين', theme: 'Gathering, quiet growth' },
  { name: 'Al-Thurayya', ar: 'الثريا', theme: 'Vision, collective power' },
  { name: 'Al-Dabaran', ar: 'الدبران', theme: 'Persistence, the follower' },
  { name: 'Al-Haqa', ar: 'الهقعة', theme: 'Innocence, the new path' },
  { name: 'Al-Hanaqa', ar: 'الهنعة', theme: 'Drive, the challenger' },
  { name: 'Al-Dhira', ar: 'الذراع', theme: 'Strength, reach' },
  { name: 'Al-Nathra', ar: 'النثرة', theme: 'Power, the leap' },
  { name: 'Al-Tarf', ar: 'الطرف', theme: 'Sight, vigilance' },
  { name: 'Al-Jabha', ar: 'الجبهة', theme: 'Confrontation, the front' },
  { name: 'Al-Zabra', ar: 'الزبرة', theme: 'Defense, the mane' },
  { name: 'Al-Sarfa', ar: 'الصرفة', theme: 'Turning, release' },
  { name: 'Al-Awwa', ar: 'العوا', theme: 'Barking, warning' },
  { name: 'Al-Simak', ar: 'السماك', theme: 'Rising, the unsheltered' },
  { name: 'Al-Ghafr', ar: 'الغفر', theme: 'Covering, mercy' },
  { name: 'Al-Zubana', ar: 'الزبانا', theme: 'The claw, reckoning' },
  { name: 'Al-Iklil', ar: 'الإكليل', theme: 'The crown, attainment' },
  { name: 'Al-Qalb', ar: 'القلب', theme: 'The heart, the scorpion' },
  { name: 'Al-Shaula', ar: 'الشولة', theme: 'The sting, transformation' },
  { name: 'Al-Naaim', ar: 'النعائم', theme: 'The ostriches, fortune' },
  { name: 'Al-Balda', ar: 'البلدة', theme: 'The city, arrival' },
  { name: 'Sad-Al-Dhabih', ar: 'سعد الذابح', theme: 'The lucky star of sacrifice' },
  { name: 'Sad-Al-Bula', ar: 'سعد بلع', theme: 'The lucky star of swallowing' },
  { name: 'Sad-Al-Suud', ar: 'سعد السعود', theme: 'The luckiest of the lucky' },
  { name: 'Sad-Al-Ahbiya', ar: 'سعد الأخبية', theme: 'The lucky star of tents' },
  { name: 'Al-Fargh-Al-Muqaddam', ar: 'الفرغ المقدم', theme: 'The fore-spout, flow' },
  { name: 'Al-Fargh-Al-Muakhkhar', ar: 'الفرغ المؤخر', theme: 'The hind-spout, completion' },
  { name: 'Al-Risha', ar: 'الرشاء', theme: 'The cord, the well-rope' },
];

function mansionForDate(d: Date): number {
  // Lunar cycle ~27.32 days; approximate by day-of-year
  const start = new Date(d.getFullYear(), 0, 0);
  const diff = (d.getTime() - start.getTime()) / 86400000;
  return Math.floor(diff / (365.25 / 28)) % 28;
}

const PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
const PLANET_GLYPHS: Record<string, string> = {
  Sun: '\u2609', Moon: '\u263D', Mars: '\u2642', Mercury: '\u263F', Jupiter: '\u2643', Venus: '\u2640', Saturn: '\u2644',
};

export function PlanetaryEngine() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => setNow(new Date()), []);
  if (!now) return null;
  const idx = mansionForDate(now);
  const mansion = MANSIONS[idx];
  const planet = PLANETS[idx % PLANETS.length];

  return (
    <ParchmentCard className="p-6">
      <SectionTitle eyebrow="Portal IX" title="Planetary Transit Guide" center={false} />
      <p className="text-sm mt-3" style={{ color: 'var(--ink-soft)' }}>
        Today&apos;s lunar mansion and ruling planet, computed from the current date.
      </p>
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="parchment-surface rounded-lg p-4 text-center">
          <div className="gold-text text-xs uppercase tracking-[0.25em]">Lunar Mansion {idx + 1}</div>
          <div className="text-3xl mt-1" style={{ color: 'var(--gold-600)' }}>{'\u263D'}</div>
          <div className="ink-heading text-lg font-semibold mt-1" style={{ fontFamily: 'var(--font-display), serif' }}>{mansion.name}</div>
          <div className="text-sm" style={{ color: 'var(--ink-muted)' }} dir="rtl">{mansion.ar}</div>
          <p className="text-xs mt-2" style={{ color: 'var(--ink-soft)' }}>{mansion.theme}</p>
        </div>
        <div className="parchment-surface rounded-lg p-4 text-center">
          <div className="gold-text text-xs uppercase tracking-[0.25em]">Ruling Planet</div>
          <div className="text-3xl mt-1" style={{ color: 'var(--gold-600)' }}>{PLANET_GLYPHS[planet]}</div>
          <div className="ink-heading text-lg font-semibold mt-1" style={{ fontFamily: 'var(--font-display), serif' }}>{planet}</div>
          <p className="text-xs mt-2" style={{ color: 'var(--ink-soft)' }}>
            The {planet.toLowerCase()} current governs today&apos;s workings.
          </p>
        </div>
      </div>
      <div className="mt-4 flex justify-center">
        <Chip variant="gold">{now.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</Chip>
      </div>
    </ParchmentCard>
  );
}
