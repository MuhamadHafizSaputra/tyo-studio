import React from 'react';
import ProfileForm from '../../../components/ProfileForm'; 
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
  const supabase = await createClient();

  // 1. Ambil User Login
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // 2. Ambil Data Profil Tambahan (Nama, Lokasi)
  const { data: userData } = await supabase
    .from('users')
    .select('full_name, location')
    .eq('id', user.id)
    .single();

  // 3. Ambil Data Anak
  const { data: childrenData } = await supabase
    .from('children')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true }); // Urutkan biar rapi

  // 4. Siapkan Data Aman untuk Client
  const plainUser = {
    id: user.id,
    email: user.email,
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header Background Decoration */}
      <div className="h-64 bg-gradient-to-r from-[var(--primary-color)] to-teal-600 rounded-b-[3rem] absolute top-0 left-0 w-full -z-10 shadow-lg" />
      
      <main className="container mx-auto px-4 py-12 relative">
        <div className="text-center text-white mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-shadow-sm">Profil Keluarga</h1>
          <p className="opacity-90 max-w-xl mx-auto font-light">
            Kelola data diri Bunda dan tumbuh kembang si Kecil dalam satu tempat yang nyaman.
          </p>
        </div>

        <ProfileForm
          user={plainUser}
          initialParentName={userData?.full_name || ''}
          initialLocation={userData?.location || ''}
          initialChildren={childrenData || []}
        />
      </main>
    </div>
  );
}