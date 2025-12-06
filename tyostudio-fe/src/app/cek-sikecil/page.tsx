import StuntingForm from '../../components/StuntingForm';
import { createClient } from '@/utils/supabase/server';

export default async function CheckStuntingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let childrenData: any[] = [];
  let latestGrowthRecord = null;

  if (user) {
    const { data: children } = await supabase.from('children').select('*').eq('user_id', user.id);
    childrenData = children || [];

    if (childrenData.length > 0) {
      // Fetch latest growth record for the first child
      // Note: For multi-child support, we'd need a selector in the UI. For now defaulting to first child.
      const { data: record } = await supabase
        .from('growth_records')
        .select('*')
        .eq('child_id', childrenData[0].id)
        .order('recorded_date', { ascending: false })
        .limit(1)
        .single();
      latestGrowthRecord = record;
    }
  }

  // Fetch Recommended Menus (Public)
  const { data: recommendations } = await supabase
    .from('recommended_menus')
    .select('*');

  // Fallback if no DB data
  const finalRecommendations = recommendations && recommendations.length > 0 ? recommendations : [
    { id: 1, name: 'Terong Balado', calories: 150, protein: '10', fats: '5', image_url: 'https://images.unsplash.com/photo-1518779578993-ec3579fee397?auto=format&fit=crop&w=300&q=80' },
    { id: 2, name: 'Tempe Goreng', calories: 200, protein: '15', fats: '10', image_url: 'https://images.unsplash.com/photo-1628839029670-c75c5e884143?auto=format&fit=crop&w=300&q=80' },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans">
      <main className="container mx-auto px-4 py-8">

        {/* Toggle Login Simulation Removed - Handled by Auth State */}

        <StuntingForm
          user={user}
          childrenData={childrenData}
          latestGrowthRecord={latestGrowthRecord}
          recommendations={finalRecommendations}
        />

      </main>
    </div>
  );
}