import type { Metadata } from 'next';
import '../styles/tokens.css';
import 'leaflet/dist/leaflet.css';

export const metadata: Metadata = {
  title: 'Digital Eye Intelligence Hub',
  description: 'FBR Analytics & Intelligence Platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}