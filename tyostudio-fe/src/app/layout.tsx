import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import Logo from '@/assets/logo.png';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  icons: {
    icon: Logo.src,
  },
  title: 'Teman Ibu',
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
