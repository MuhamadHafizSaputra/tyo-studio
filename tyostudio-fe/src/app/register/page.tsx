'use client'; // 👈 Wajib ada

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // 👈 Import router

export default function RegisterPage() {
  const router = useRouter();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Logika simpan data registrasi di sini
    // Redirect ke halaman Profile untuk melengkapi data anak
    router.push('/profile');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F3F9FA] p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[var(--primary-color)] mb-2">Buat Akun Baru</h1>
          <p className="text-gray-500 text-sm">Bergabung bersama ribuan orang tua lainnya.</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Nama Lengkap Bunda/Ayah</label>
            <input 
              type="text" 
              placeholder="Contoh: Ani Suryani"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
            <input 
              type="email" 
              placeholder="email@example.com"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] transition"
              required
            />
          </div>
          
          <button type="submit" className="w-full bg-[var(--secondary-color)] text-white font-bold py-3 rounded-lg hover:bg-red-400 transition shadow-md mt-4">
            Daftar Gratis
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Sudah punya akun?{' '}
          <Link href="/login" className="text-[var(--primary-color)] font-bold hover:underline">
            Masuk disini
          </Link>
        </div>
      </div>
    </div>
  );
}