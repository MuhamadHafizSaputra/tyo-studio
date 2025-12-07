import React from 'react';
import TrackerDashboard from '../../components/TrackerDashboard';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function TrackPage({ searchParams }: { searchParams: Promise<{ childId?: string }> }) {
  const resolvedParams = await searchParams; // Await the promise

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
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