import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '../utils/supabase/server';
import NavUserMenu from './NavUserMenu';
import NavLinks from './NavLinks';
import NavbarScrollWrapper from './NavbarScrollWrapper';
import Logo from '@/assets/logo.png';

const Navbar = async () => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <NavbarScrollWrapper>
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="text-xl sm:text-2xl font-bold text-teal-600 flex items-center">
            <Image
              src={Logo}
              alt="Teman Ibu Logo"
              className="h-12 sm:h-16 w-auto"
              priority
            />
            Teman Ibu
          </Link>

          {/* Menu Links */}
          <NavLinks user={user} />

          {/* Login/User Menu (Desktop Only) */}
          <div className="hidden lg:block">
            <NavUserMenu user={user} />
          </div>
        </div>
      </nav>
    </NavbarScrollWrapper>
  );
};

export default Navbar;