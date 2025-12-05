'use client'; // 👈 Wajib tambahkan ini karena kita pakai event handler

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // 👈 Import router

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault(); // Mencegah refresh halaman
    // Di sini bisa tambahkan logika validasi ke backend nantinya
    // Untuk sekarang, kita langsung arahkan ke halaman Profile
    router.push('/profile'); 
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F3F9FA] p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[var(--primary-color)] mb-2">Selamat Datang Kembali</h1>
          <p className="text-gray-500 text-sm">Masuk untuk memantau perkembangan si kecil.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
            <input 
              type="email" 
              placeholder="bunda@example.com"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent transition"
              required
            />
          </div>
          
          <button type="submit" className="w-full bg-[var(--primary-color)] text-white font-bold py-3 rounded-lg hover:bg-teal-600 transition shadow-md">
            Masuk
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Belum punya akun?{' '}
          <Link href="/register" className="text-[var(--primary-color)] font-bold hover:underline">
            Daftar Sekarang
          </Link>
        </div>
      </div>
    </div>
  );
}