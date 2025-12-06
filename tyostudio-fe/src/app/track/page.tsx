import React from 'react';
import TrackerDashboard from '../../components/TrackerDashboard';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function TrackPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch Child
  const { data: children } = await supabase.from('children').select('*').eq('user_id', user.id);
  const selectedChild = children && children.length > 0 ? children[0] : null;

  let growthRecords: any[] = [];
  if (selectedChild) {
    const { data: records } = await supabase
      .from('growth_records')
      .select('*')
      .eq('child_id', selectedChild.id)
      .order('age_in_months', { ascending: true });
    growthRecords = records || [];
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans pb-20">
      <main className="container mx-auto px-4 py-8">

        {/* --- HEADER PROFILE --- */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center text-3xl shadow-sm">👶</div>
            <div>
              <h2 className="font-bold text-gray-800 text-xl">{selectedChild?.name || 'Si Kecil'}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{selectedChild?.gender || '-'}</span>
                {selectedChild?.date_of_birth && (
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                    Lahir: {new Date(selectedChild.date_of_birth).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Ringkasan Status Terkini */}
          {/* Can be consolidated in Dashboard or kept here if we want SSR header and client chart */}
        </div>

        <TrackerDashboard
          user={user}
          child={selectedChild}
          growthRecords={growthRecords}
        />

      </main>
    </div>
  );
}