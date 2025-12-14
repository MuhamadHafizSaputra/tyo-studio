// src/components/Footer.tsx
import React from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="relative bg-teal-100 pt-10 pb-8 mt-12 md:pt-20 md:pb-10 md:mt-20 bg-opacity-80">
      {/* wave */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0]">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-[calc(100%+1.3px)] h-[40px] sm:h-[100px]"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            className="fill-gray-50"
          ></path>
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-8 md:mb-10 pt-8 md:pt-16">

          {/* 1. Brand & Deskripsi */}
          <div className="space-y-4 md:space-y-6">
            <h4 className="text-2xl md:text-3xl font-bold text-[var(--primary-color)]">Teman Ibu</h4>
            <p className="text-gray-600 leading-relaxed text-sm">
              Sahabat terbaik Bunda dalam memantau tumbuh kembang si Kecil.
              Cegah stunting sejak dini dengan data akurat dan nutrisi tepat.
            </p>
            <div className="flex gap-4 pt-2">
              <SocialLink href="#" icon={<Instagram size={18} />} />
              <SocialLink href="#" icon={<Facebook size={18} />} />
              <SocialLink href="#" icon={<Twitter size={18} />} />
            </div>
          </div>

          {/* 2. Layanan */}
          <div>
            <h4 className="text-lg font-bold text-teal-800 mb-4 md:mb-6">
              Layanan Kami
            </h4>
            <ul className="space-y-2 md:space-y-3 text-sm text-gray-600">
              <li><FooterLink href="/cek-sikecil">Cek Status Gizi</FooterLink></li>
              <li><FooterLink href="/cek-nutrisi">Kalkulator Nutrisi</FooterLink></li>
              <li><FooterLink href="/track">Grafik Pertumbuhan</FooterLink></li>
              <li><FooterLink href="/artikel">Artikel Parenting</FooterLink></li>
            </ul>
          </div>

          {/* 3. Tentang */}
          <div>
            <h4 className="text-lg font-bold text-teal-800 mb-4 md:mb-6">
              Tentang
            </h4>
            <ul className="space-y-2 md:space-y-3 text-sm text-gray-600">
              <li><FooterLink href="#">Tentang Kami</FooterLink></li>
              <li><FooterLink href="#">Tim Ahli</FooterLink></li>
              <li><FooterLink href="#">Kebijakan Privasi</FooterLink></li>
              <li><FooterLink href="#">Syarat & Ketentuan</FooterLink></li>
            </ul>
          </div>

          {/* 4. Kontak */}
          <div>
            <h4 className="text-lg font-bold text-teal-800 mb-4 md:mb-6">
              Hubungi Kami
            </h4>
            <ul className="space-y-3 md:space-y-4 text-sm text-gray-600">
              <li className="flex items-center gap-3">
                <Phone className="text-[var(--primary-color)] shrink-0" size={18} />
                <span>+62 897-3869-447</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-[var(--primary-color)] shrink-0" size={18} />
                <span>halo@temanibu.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright & Credit */}
        <div className="border-t border-teal-200 pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 text-center md:text-left">
          <p>&copy; {new Date().getFullYear()} Teman Ibu. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Dibuat dengan <span className="text-red-400">❤</span> untuk anak Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
};

// Komponen Link dengan Hover Effect Halus
const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link
    href={href}
    className="hover:text-[var(--primary-color)] hover:translate-x-1 transition-all duration-300 inline-block"
  >
    {children}
  </Link>
);

// Komponen Social Media dengan Background Putih (Soft Look)
const SocialLink = ({ href, icon }: { href: string; icon: React.ReactNode }) => (
  <a
    href={href}
    className="w-9 h-9 rounded-full bg-white border border-teal-100 flex items-center justify-center text-teal-600 hover:bg-[var(--primary-color)] hover:text-white hover:border-[var(--primary-color)] transition-all duration-300 shadow-sm hover:shadow-md"
  >
    {icon}
  </a>
);

export default Footer;