import React from 'react';
import Link from 'next/link';

const Navbar: React.FC = () => {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-[var(--primary-color)]">
          TyoStudio
        </Link>

        {/* Menu Links */}
        <ul className="hidden md:flex list-none gap-8 m-0 p-0">
          {[
            { name: 'Home', path: '/' },
            { name: 'Cek Si Kecil', path: '/cek-sikecil' },
            { name: 'Cek Nutrisi', path: '/cek-nutrisi' },
            { name: 'Track Si Kecil', path: '/track' },
          ].map((item) => (
            <li key={item.name}>
              <Link
                href={item.path}
                className="text-gray-600 hover:text-[var(--primary-color)] font-medium transition-colors"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Login Button Placeholder */}
        <div className="flex gap-3">
          <Link href="/login" className="px-5 py-2 rounded-full border border-[var(--primary-color)] text-[var(--primary-color)] font-semibold hover:bg-teal-50 transition">
            Masuk
          </Link>
          <Link href="/register" className="px-5 py-2 rounded-full bg-[var(--primary-color)] text-white font-semibold hover:bg-teal-600 transition shadow-sm">
            Daftar
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;