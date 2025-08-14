import type { Metadata } from 'next';
import './globals.css';
import { SuiProvider } from '@/components/sui-provider';

export const metadata: Metadata = {
  title: 'WheatChain Landing Page',
  description: 'The Game Begins Soon',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400&family=Orbitron:wght@400;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <SuiProvider>
          {children}
        </SuiProvider>
      </body>
    </html>
  );
}
