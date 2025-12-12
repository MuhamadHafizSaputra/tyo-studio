import React from 'react';
import Link from 'next/link';
import TrackerDashboard from '../../../components/TrackerDashboard';
import { createClient } from '@/utils/supabase/server';


export const dynamic = 'force-dynamic';

export default async function TrackPage({ searchParams }: { searchParams: Promise<{ childId?: string }> }) {
  const resolvedParams = await searchParams; // Await the promise

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] font-sans pb-20">
        {/* Banner Demo Mode */}
        <div className="bg-yellow-50 border-b border-yellow-100 p-3 text-center">
          <p className="text-yellow-800 text-sm font-medium">
            👋 Anda sedang melihat <strong>Mode Demo</strong>. Data di bawah ini hanya contoh. <Link href="/login" className="underline hover:text-yellow-900">Masuk</Link> untuk memantau anak Anda sendiri.
          </p>
        </div>

        <div className="container mx-auto px-4 py-8">
          <TrackerDashboard
            user={null}
            child={{
              id: 'demo-child',
              name: 'Budi (Demo)',
              gender: 'Laki-laki',
              date_of_birth: new Date(new Date().setFullYear(new Date().getFullYear() - 2)).toISOString() // 2 years old
            }}
            allChildren={[]}
            growthRecords={[
              { recorded_date: new Date(new Date().setMonth(new Date().getMonth() - 24)).toISOString(), age_in_months: 0, height: 49.5, weight: 3.2 },
              { recorded_date: new Date(new Date().setMonth(new Date().getMonth() - 18)).toISOString(), age_in_months: 6, height: 69.2, weight: 8.1 },
              { recorded_date: new Date(new Date().setMonth(new Date().getMonth() - 12)).toISOString(), age_in_months: 12, height: 77.5, weight: 10.0 },
              { recorded_date: new Date(new Date().setMonth(new Date().getMonth() - 6)).toISOString(), age_in_months: 18, height: 81.5, weight: 10.8 },
              { recorded_date: new Date().toISOString(), age_in_months: 24, height: 89.2, weight: 12.5 },
            ]}
          />

          {/* CTA Login / Register Section */}
          <div className="mt-12 max-w-4xl mx-auto text-center bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-[var(--primary-color)]/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-orange-100 rounded-full blur-3xl"></div>

            <h2 className="relative text-3xl font-bold text-gray-800 mb-4">
              Pantau Tumbuh Kembang Si Kecil Sekarang
            </h2>
            <p className="relative text-gray-500 mb-8 text-lg max-w-2xl mx-auto">
              Simpan data pertumbuhan anak Anda dengan aman, dapatkan analisis grafik WHO, dan rekomendasi nutrisi yang tepat secara gratis.
            </p>

            <div className="relative flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/login" className="w-full sm:w-auto px-8 py-4 bg-[var(--primary-color)] text-white rounded-xl font-bold text-lg hover:bg-teal-700 transition shadow-lg shadow-teal-700/20">
                Masuk ke Akun Saya
              </Link>
              <Link href="/register" className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-gray-100 text-gray-700 rounded-xl font-bold text-lg hover:border-gray-300 hover:bg-gray-50 transition">
                Daftar Akun Baru
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fetch All Children for Selector
  const { data: children } = await supabase.from('children').select('*').eq('user_id', user.id);
  const allChildren = children || [];

  // Determine Selected Child
  // 1. If param exists, try to find it.
  // 2. Else default to first child.
  let selectedChild = null;
  if (resolvedParams.childId) {
    selectedChild = allChildren.find(c => c.id === resolvedParams.childId) || allChildren[0] || null;
  } else {
    selectedChild = allChildren[0] || null;
  }

  let growthRecords: any[] = [];
  if (selectedChild) {
    const { data: records } = await supabase
      .from('growth_records')
      .select('*')
      .eq('child_id', selectedChild.id)
      .order('age_in_months', { ascending: true }); // We want ascending for chart
    growthRecords = records || [];
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans pb-20">
      <main className="container mx-auto px-4 py-8">

        {/* --- HEADER PROFILE: REMOVED (Moved inside Dashboard for cleaner switching) --- */}

        <TrackerDashboard
          user={user}
          child={selectedChild}
          allChildren={allChildren}
          growthRecords={growthRecords}
        />

      </main>
    </div>
  );
}