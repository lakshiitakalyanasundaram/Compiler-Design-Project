
import type {Metadata} from 'next';
import { Inter as FontSans } from 'next/font/google'; // Using Inter as Geist is not standard
import { IBM_Plex_Mono as FontMono } from 'next/font/google'; // Using IBM Plex Mono as Geist Mono might not be readily available or set up
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from "@/components/ui/toaster";

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

const fontMono = FontMono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500', '700']
});

export const metadata: Metadata = {
  title: 'Code Analyzer',
  description: 'Real-time syntax highlighting, tokenization, and symbol table generation.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body 
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          fontMono.variable
        )}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}

