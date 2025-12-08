import React from 'react';
import ProfileForm from '../../components/ProfileForm';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch Public User Profile
  const { data: userData } = await supabase
    .from('users')

    .select('full_name, location')
    .eq('id', user.id)
    .single();

  // Fetch Children
  const { data: childrenData } = await supabase
    .from('children')
    .select('*')
    .eq('user_id', user.id);

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <main className="container mx-auto px-4 py-10 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Lengkapi Profil</h1>
        <p className="text-gray-500 mb-8 text-center">
          Data yang akurat membantu analisis tumbuh kembang si Kecil lebih tepat.
        </p>

        <ProfileForm
          user={user}
          initialParentName={userData?.full_name || ''}
          initialLocation={userData?.location || ''}
          initialChildren={childrenData || []}
        />
      </main>
    </div>
  );
}