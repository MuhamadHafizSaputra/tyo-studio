import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TyoStudio - Solusi Kebutuhan MPASI Anda',
  description: 'Aplikasi pemantau tumbuh kembang dan resep MPASI',
};

import Navbar from '@/components/Navbar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <Navbar />
        {children}
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
