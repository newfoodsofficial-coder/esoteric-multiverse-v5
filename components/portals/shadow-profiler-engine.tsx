'use client';

import { useState } from 'react';
import { ParchmentCard, GoldButton, SectionTitle } from '@/components/parchment/primitives';

const SHADOW_PROMPTS = [
  'Name a trait in others that quietly infuriates you.',
  'What impulse do you suppress before sleep?',
  'Whose approval still governs your choices?',
  'What would you do if no one ever learned of it?',
  'Which memory do you avoid revisiting?',
];

const SHADOW_REFLECTIONS = [
  'The trait you condemn is a disowned fragment of your own ego. Reclaim it consciously.',
  'What you suppress at dusk rules you by dawn. Name it aloud.',
  'The approval you seek is the throne you have abdicated. Reclaim your sovereignty.',
  'Secrecy is the temple of the shadow. Act in the open and it starves.',
  'The memory you avoid is the gate. Walk through it.',
];

export function ShadowProfilerEngine() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [done, setDone] = useState(false);

  const submit = () => {
    if (!input.trim()) return;
    const next = [...answers, input.trim()];
    setAnswers(next);
    setInput('');
    if (step + 1 < SHADOW_PROMPTS.length) {
      setStep(step + 1);
    } else {
      setDone(true);
    }
  };

  return (
    <ParchmentCard className="p-6">
      <SectionTitle eyebrow="Portal I" title="Shadow Profiler" center={false} />
      {!done ? (
        <div className="mt-5">
          <div className="text-xs mb-2" style={{ color: 'var(--ink-muted)' }}>Question {step + 1} of {SHADOW_PROMPTS.length}</div>
          <p className="text-lg mb-4" style={{ fontFamily: 'var(--font-display), serif', color: 'var(--ink)' }}>{SHADOW_PROMPTS[step]}</p>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={3}
            className="input-parchment w-full p-3"
            placeholder="Speak plainly to the shadow…"
          />
          <div className="mt-3 flex gap-2">
            <GoldButton onClick={submit} disabled={!input.trim()}>{step + 1 < SHADOW_PROMPTS.length ? 'Next' : 'Reveal'}</GoldButton>
          </div>
        </div>
      ) : (
        <div className="mt-5 animate-fade-in">
          <div className="gold-text text-xs uppercase tracking-[0.25em] mb-2">Shadow Integration</div>
          <ul className="space-y-3">
            {answers.map((a, i) => (
              <li key={i} className="border-l-2 pl-3" style={{ borderColor: 'var(--gold-400)' }}>
                <div className="text-xs italic" style={{ color: 'var(--ink-muted)' }}>&ldquo;{a}&rdquo;</div>
                <div className="text-sm mt-1" style={{ color: 'var(--ink)' }}>{SHADOW_REFLECTIONS[i]}</div>
              </li>
            ))}
          </ul>
          <GoldButton className="mt-5" onClick={() => { setStep(0); setAnswers([]); setDone(false); }}>Begin Anew</GoldButton>
        </div>
      )}
    </ParchmentCard>
  );
}
