'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '../../utils/supabase/client';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error('Email atau password salah.');
      setLoading(false);
    } else {
      toast.success('Login berhasil!');
      router.push('/profile');
      router.refresh();
    }
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="bunda@example.com"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent transition"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--primary-color)] text-white font-bold py-3 rounded-lg hover:bg-teal-600 transition shadow-md disabled:opacity-50"
          >
            {loading ? 'Memuat...' : 'Masuk'}
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