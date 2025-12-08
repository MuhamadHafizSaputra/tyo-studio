'use client'; // 👈 Wajib ada

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // 👈 Import router
import { toast } from 'sonner';

import { createClient } from '../../utils/supabase/client';

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
    } else {
      toast.success('Registrasi berhasil! Selamat datang.');
      router.push('/profile');
      setLoading(false);
    }
  };

  // Redirect if already logged in
  React.useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push('/profile');
      }
    };
    checkUser();
  }, [router]);

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
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Contoh: Ani Suryani"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] transition"
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
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] transition"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--secondary-color)] text-white font-bold py-3 rounded-lg hover:bg-red-400 transition shadow-md mt-4 disabled:opacity-50"
          >
            {loading ? 'Mendaftar...' : 'Daftar Gratis'}
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