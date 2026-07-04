import { cn } from '@/lib/utils';

export function ParchmentCard({
  className,
  children,
  edge = true,
}: {
  className?: string;
  children: React.ReactNode;
  edge?: boolean;
}) {
  return (
    <div
      className={cn(
        'parchment-surface rounded-xl',
        edge && 'parchment-edge',
        className
      )}
    >
      {children}
    </div>
  );
}

export function GoldButton({
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn('btn-gold rounded-lg px-5 py-2.5 text-sm font-semibold tracking-wide', className)}
      {...props}
    >
      {children}
    </button>
  );
}

export function InkButton({
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn('btn-ink rounded-lg px-5 py-2.5 text-sm font-semibold tracking-wide', className)}
      {...props}
    >
      {children}
    </button>
  );
}

export function GhostButton({
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn('btn-ghost-parchment rounded-lg px-4 py-2 text-sm font-medium', className)}
      {...props}
    >
      {children}
    </button>
  );
}

export function OrnamentDivider({ className }: { className?: string }) {
  return (
    <div className={cn('ornament-divider my-6', className)} aria-hidden>
      <span className="text-lg leading-none">{'\u2767'}</span>
    </div>
  );
}

export function Seal({
  glyph,
  accent,
  size = 64,
  className,
  spin = false,
}: {
  glyph: string;
  accent: string;
  size?: number;
  className?: string;
  spin?: boolean;
}) {
  return (
    <span
      className={cn('inline-flex items-center justify-center seal-shadow', className)}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <svg viewBox="0 0 100 100" width={size} height={size} className={spin ? 'animate-spin-slower' : ''}>
        <circle cx="50" cy="50" r="46" fill="none" stroke={accent} strokeWidth="1.5" opacity="0.7" />
        <circle cx="50" cy="50" r="38" fill="none" stroke={accent} strokeWidth="0.8" opacity="0.5" />
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i / 12) * Math.PI * 2;
          const x1 = 50 + Math.cos(a) * 40;
          const y1 = 50 + Math.sin(a) * 40;
          const x2 = 50 + Math.cos(a) * 46;
          const y2 = 50 + Math.sin(a) * 46;
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={accent}
              strokeWidth="1"
              opacity="0.6"
            />
          );
        })}
        <text
          x="50"
          y="50"
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="34"
          fill={accent}
          fontFamily="var(--font-display), serif"
        >
          {glyph}
        </text>
      </svg>
    </span>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  subtitle,
  center = true,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <div className={center ? 'text-center' : ''}>
      {eyebrow && (
        <div className="gold-text text-xs font-semibold uppercase tracking-[0.25em] mb-2">
          {eyebrow}
        </div>
      )}
      <h2
        className="ink-heading text-3xl md:text-4xl font-semibold"
        style={{ fontFamily: 'var(--font-display), serif' }}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 text-ink-soft text-base md:text-lg max-w-2xl mx-auto" style={{ color: 'var(--ink-soft)' }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

export function Chip({
  variant = 'default',
  children,
  className,
}: {
  variant?: 'default' | 'gold' | 'success' | 'error' | 'warning';
  children: React.ReactNode;
  className?: string;
}) {
  const cls =
    variant === 'gold'
      ? 'chip-gold'
      : variant === 'success'
      ? 'chip-success'
      : variant === 'error'
      ? 'chip-error'
      : variant === 'warning'
      ? 'chip-warning'
      : 'chip';
  return <span className={cn(cls, className)}>{children}</span>;
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-10 text-ink-muted" style={{ color: 'var(--ink-muted)' }}>
      <p className="text-sm">{message}</p>
    </div>
  );
}
