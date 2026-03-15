import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Diego Nava | Industrial Designer & AI Strategist',
  description: 'Portfolio of Diego Nava',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
