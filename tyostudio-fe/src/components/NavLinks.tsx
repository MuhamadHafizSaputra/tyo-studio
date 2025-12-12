'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, UserCircle, LogOut, ChevronRight } from 'lucide-react';
import { createClient } from '../utils/supabase/client';
import { toast } from 'sonner';

interface NavLinksProps {
    user?: any;
}

const NavLinks = ({ user }: NavLinksProps) => {
    const pathname = usePathname();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    const links = [
        { name: 'Home', path: '/' },
        { name: 'Cek Si Kecil', path: '/cek-sikecil' },
        { name: 'Cek Nutrisi', path: '/cek-nutrisi' },
        { name: 'Track Si Kecil', path: '/track' },
        { name: 'Artikel', path: '/artikel' },
    ];

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        setIsOpen(false);
        toast.success('Berhasil keluar');
        router.refresh();
    };

    return (
        <>
            {/* Desktop Menu */}
            <ul className="hidden md:flex list-none gap-8 m-0 p-0">
                {links.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                        <li key={item.name}>
                            <Link
                                href={item.path}
                                className={`text-md font-medium transition-colors ${isActive
                                    ? 'text-[var(--primary-color)] font-bold'
                                    : 'text-gray-600 hover:text-[var(--primary-color)]'
                                    }`}
                            >
                                {item.name}
                            </Link>
                        </li>
                    );
                })}
            </ul>

            {/* Mobile Hamburger Button */}
            <button
                className="md:hidden p-2 text-gray-600 hover:text-[var(--primary-color)] transition"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>

            {/* Mobile Menu Dropdown */}
            {isOpen && (
                <div className="absolute top-[72px] left-0 w-full bg-white border-t border-gray-100 shadow-xl md:hidden flex flex-col animate-fade-in-down z-50 h-[calc(100vh-72px)] overflow-y-auto">

                    {/* 1. Profile Section */}
                    <div className="p-6 bg-teal-50/50 border-b border-gray-100">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-[var(--primary-color)]/10 rounded-full flex items-center justify-center text-[var(--primary-color)] border border-[var(--primary-color)]/20">
                                    <UserCircle size={28} />
                                </div>
                                <div className="flex-grow">
                                    <p className="text-sm text-gray-500">Halo, Bunda</p>
                                    <p className="font-bold text-gray-800 text-lg leading-tight">
                                        {user.user_metadata?.full_name || 'User'}
                                    </p>
                                    <Link
                                        href="/profile"
                                        onClick={() => setIsOpen(false)}
                                        className="text-xs text-[var(--primary-color)] font-semibold mt-1 flex items-center gap-1 hover:underline"
                                    >
                                        Edit Profile <ChevronRight size={12} />
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                                    <UserCircle size={28} />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-800 text-lg">Belum Masuk?</p>
                                    <Link
                                        href="/login"
                                        onClick={() => setIsOpen(false)}
                                        className="text-sm text-[var(--primary-color)] font-bold hover:underline"
                                    >
                                        Masuk / Daftar Sekarang
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 2. Navigation Links */}
                    <div className="p-4 flex flex-col gap-2">
                        {links.map((item) => {
                            const isActive = pathname === item.path;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.path}
                                    onClick={() => setIsOpen(false)}
                                    className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-base font-medium transition-colors ${isActive
                                        ? 'bg-[var(--primary-color)] text-white font-bold shadow-teal-200'
                                        : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    {item.name}
                                    {/* {isActive && <div className="w-2 h-2 bg-white rounded-full"></div>} */}
                                </Link>
                            )
                        })}
                    </div>

                    {/* 3. Logout (If Logged In) */}
                    {user && (
                        <div className="p-4 mt-auto border-t border-gray-100">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center gap-2 p-3 text-red-500 font-bold hover:bg-red-50 rounded-xl transition"
                            >
                                <LogOut size={20} />
                                Keluar Aplikasi
                            </button>
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default NavLinks;
