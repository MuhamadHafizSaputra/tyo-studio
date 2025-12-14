'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '../utils/supabase/client';

interface NavUserMenuProps {
  user: any;
}

export default function NavUserMenu({ user }: NavUserMenuProps) {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
  };

  if (user) {
    return (
      <div className="flex gap-4 items-center">
        <Link href="/profile" className="flex items-center gap-2 hover:bg-gray-50 p-2 rounded-lg transition">
          <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 font-bold border border-teal-200">
            {user.user_metadata?.full_name ? user.user_metadata.full_name[0].toUpperCase() : 'U'}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-bold text-gray-700 leading-none hover:text-[var(--primary-color)]">
              Halo, {user.user_metadata?.full_name?.split(' ')[0] || 'Bunda'}
            </p>
          </div>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      <Link href="/login" className="px-5 py-2 rounded-full bg-[var(--primary-color)] text-white font-semibold hover:bg-teal-600 transition shadow-sm">
        Masuk
      </Link>
    </div>
  );
}
