import './globals.css';
import type { Metadata } from 'next';
import { Cormorant_Garamond, EB_Garamond, Amiri } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import { EngagementProvider } from '@/components/engagement/engagement-provider';
import { AdminProvider } from '@/components/admin/admin-provider';
import { FingerprintProvider } from '@/components/engagement/fingerprint-provider';

const display = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});
const body = EB_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
});
const arabic = Amiri({
  subsets: ['arabic', 'latin'],
  weight: ['400', '700'],
  variable: '--font-arabic',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'The Grand Parchment Esoteric Codex',
  description:
    'A museum-style esoteric multiverse: ten portals of geomancy, tarot, numerology, dream necromancy, ritual alchemy and more.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${arabic.variable}`}>
      <body
        className="font-body antialiased"
        style={{ fontFamily: 'var(--font-body), Georgia, serif' }}
      >
        <FingerprintProvider>
          <AdminProvider>
            <EngagementProvider>
              {children}
              <Toaster position="top-center" />
            </EngagementProvider>
          </AdminProvider>
        </FingerprintProvider>
      </body>
    </html>
  );
}
