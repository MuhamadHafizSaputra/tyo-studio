'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { differenceInMonths } from "date-fns";
import { EmptyState } from '@/components/ui/EmptyState';
import { Activity, Info, ChevronRight, Calculator } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';
import ChildSelector from './ChildSelector';
import { toast } from 'sonner';
import { assessNutritionalStatus } from '@/lib/calculator';

// --- KOMPONEN VISUAL: METERAN Z-SCORE ---
const ZScoreMeter = ({ score, label }: { score: number, label: string }) => {
  // Clamp score antara -4 dan +4 untuk visualisasi agar tidak keluar chart
  const clampedScore = Math.max(-4, Math.min(4, score));
  // Konversi score (-4 s/d 4) ke persentase (0% s/d 100%)
  // -4 = 0%, 0 = 50%, +4 = 100%
  const percentage = ((clampedScore + 4) / 8) * 100;

  return (
    <div className="mt-6 mb-2">
      <div className="flex justify-between text-[10px] text-gray-400 font-bold mb-1 uppercase tracking-wider">
        <span>Bahaya (-3)</span>
        <span>Normal (0)</span>
        <span>Bahaya (+3)</span>
      </div>
      <div className="relative h-4 w-full rounded-full bg-gradient-to-r from-red-400 via-green-400 to-red-400 shadow-inner">
        {/* Garis Batas Normal (-2 SD & +2 SD) */}
        <div className="absolute top-0 bottom-0 left-[25%] w-[1px] bg-white/50"></div> {/* -2 */}
        <div className="absolute top-0 bottom-0 left-[75%] w-[1px] bg-white/50"></div> {/* +2 */}
        
        {/* Penanda Posisi Anak */}
        <div 
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-gray-700 rounded-full shadow-md transition-all duration-1000 ease-out flex items-center justify-center z-10"
          style={{ left: `calc(${percentage}% - 8px)` }}
        >
          <div className="w-1 h-1 bg-gray-700 rounded-full"></div>
        </div>
      </div>
      <p className="text-center text-xs text-gray-500 mt-2 font-medium">
        Posisi {label}: <span className="font-bold text-gray-800">{score > 0 ? `+${score}` : score} SD</span>
      </p>
    </div>
  );
};

const initialRecord = {
  child_id: '',
  age_in_months: '',
  height: '',
  weight: '',
  recorded_date: ''
};

export default function StuntingForm({
  user,
  childrenData,
  latestGrowthRecord,
  recommendations,
  userLocation
}: {
  user?: any,
  childrenData?: any[],
  latestGrowthRecord?: any,
  recommendations?: any[],
  userLocation?: string
}) {
  // --- STATE ---
  const [selectedChildId, setSelectedChildId] = useState<string>('');
  const [currentGrowthRecord, setCurrentGrowthRecord] = useState<any>(latestGrowthRecord || initialRecord);
  const selectedChild = childrenData?.find(c => c.id === selectedChildId);

  const [formData, setFormData] = useState({
    dob: '',
    ageDisplay: '',
    gender: 'Laki-laki',
    weight: '',
    height: '',
  });

  const [result, setResult] = useState<{
    zScore: number;
    zScoreLabel?: string;
    status: string;
    description: string;
    isStunting: boolean;
    bmi: number;
    bmiStatus: string;
  } | null>(null);

  const [aiLoading, setAiLoading] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState<any[]>([]);

  // Static Fallback Recommendations
  const staticRecommendations = [
    {
      name: "Bubur Hati Ayam Bayam",
      calories: 250,
      protein: 15,
      fats: 10,
      description: "Kaya zat besi dan protein untuk mencegah anemia dan stunting.",
      image_url: null
    },
    {
      name: "Sop Ikan Telur Puyuh",
      calories: 200,
      protein: 18,
      fats: 8,
      description: "Protein hewani ganda (ikan & telur) sangat efektif untuk pertumbuhan.",
      image_url: null
    },
    {
      name: "Tahu Kukus Daging Sapi",
      calories: 180,
      protein: 12,
      fats: 9,
      description: "Tekstur lembut, mudah dicerna dan tinggi kalori.",
      image_url: null
    }
  ];

  // 1. Auto-select first child
  useEffect(() => {
    if (childrenData && childrenData.length > 0 && !selectedChildId) {
      setSelectedChildId(childrenData[0].id);
    }
  }, [childrenData]);

  // 2. Fetch latest record & Prefill
  useEffect(() => {
    if (selectedChildId) {
      const fetchLastRecord = async () => {
        const supabase = createClient();
        const { data } = await supabase
          .from('growth_records')
          .select('*')
          .eq('child_id', selectedChildId)
          .order('recorded_date', { ascending: false })
          .limit(1)
          .single();

        if (data) setCurrentGrowthRecord(data);
        else setCurrentGrowthRecord(initialRecord);
      };
      fetchLastRecord();
    }
  }, [selectedChildId]);

  // Sync Form
  useEffect(() => {
    if (selectedChild) {
      const dobString = selectedChild.date_of_birth ? new Date(selectedChild.date_of_birth).toISOString().split('T')[0] : '';
      setFormData(prev => ({
        ...prev,
        dob: dobString,
        gender: selectedChild.gender || 'Laki-laki',
        weight: currentGrowthRecord?.weight?.toString() || selectedChild.birth_weight?.toString() || '',
        height: currentGrowthRecord?.height?.toString() || selectedChild.birth_height?.toString() || '',
      }));
    } else {
      setFormData({ dob: '', ageDisplay: '', gender: 'Laki-laki', weight: '', height: '' });
    }
  }, [selectedChild, currentGrowthRecord]);

  // Calculate Age Display
  useEffect(() => {
    if (formData.dob) {
      const birthDate = new Date(formData.dob);
      const today = new Date();
      const months = differenceInMonths(today, birthDate);
      const years = Math.floor(months / 12);
      const remainingMonths = months % 12;
      let display = `${months} Bulan`;
      if (years > 0) {
        display = `${years} Tahun ${remainingMonths > 0 ? `${remainingMonths} Bulan` : ''}`;
      }
      setFormData(prev => ({ ...prev, ageDisplay: display }));
    } else {
      setFormData(prev => ({ ...prev, ageDisplay: '' }));
    }
  }, [formData.dob]);

  // --- CALCULATION LOGIC ---
  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.dob || !formData.weight || !formData.height) {
      toast.error("Mohon lengkapi semua data");
      return;
    }

    setAiLoading(true);

    const birthDate = new Date(formData.dob);
    const today = new Date();
    const age = Math.max(0, differenceInMonths(today, birthDate));
    const height = parseFloat(formData.height);
    const weight = parseFloat(formData.weight);
    const genderKey = (formData.gender === 'Laki-laki' || formData.gender === 'male') ? 'male' : 'female';

    // Panggil Kalkulator Cerdas
    const analysis = assessNutritionalStatus(age, weight, height, genderKey);
    
    // Tentukan Warning (Jika bukan hijau, anggap warning)
    const isWarning = !analysis.color.includes('green');

    setResult({
      zScore: analysis.zScore || 0,
      zScoreLabel: analysis.zScoreLabel, // Menggunakan label dinamis (TB/U atau BB/U)
      status: analysis.status,
      description: `${analysis.description} ${analysis.recommendation}`,
      isStunting: isWarning,
      bmi: analysis.bmi,
      bmiStatus: analysis.category === 'Dewasa' ? analysis.status : analysis.category
    });

    // AI Generation
    try {
      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `Berikan 3 rekomendasi menu makanan lokal Indonesia murah bergizi.
      Profil: ${analysis.category}, Usia ${age} bln, Status: ${analysis.status}, ${analysis.recommendation}.
      Output JSON Array: [{"name": "...", "calories": 200, "protein": 10, "fats": 5, "description": "..."}]`;

      const resultAI = await model.generateContent(prompt);
      const responseText = resultAI.response.text();
      const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const recommendationsAI = JSON.parse(cleanedText);
      setAiRecommendations(recommendationsAI);
    } catch (err) {
      console.error("AI Error:", err);
      setAiRecommendations([]);
    }

    setAiLoading(false);

    // Save Record
    if (selectedChildId) {
      const supabase = createClient();
      await supabase.from('growth_records').insert([{
        child_id: selectedChildId,
        age_in_months: age,
        height: height,
        weight: weight,
        recorded_date: new Date().toISOString(),
      }]);
      toast.success('Hasil analisis berhasil disimpan!');
    }
  };

  const displayRecommendations = aiRecommendations.length > 0 ? aiRecommendations : staticRecommendations;

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start w-full max-w-6xl mx-auto">

      {/* --- KIRI: FORM INPUT (Card yang lebih bersih) --- */}
      <div className="w-full lg:w-1/3 bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 sticky top-24">
        
        {/* Header Form */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Calculator size={24} className="text-[var(--primary-color)]" />
            Cek Kondisi Anak
          </h2>
          {formData.ageDisplay && (
            <span className="text-xs font-semibold bg-teal-50 text-teal-700 px-3 py-1 rounded-full border border-teal-100">
              {formData.ageDisplay}
            </span>
          )}
        </div>

        {/* Child Selector */}
        {childrenData && childrenData.length > 0 && (
          <div className="mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <ChildSelector
              childrenData={childrenData}
              selectedId={selectedChildId}
              onSelect={setSelectedChildId}
              label="Pilih Data Anak"
            />
          </div>
        )}

        <form onSubmit={handleCalculate} className="flex flex-col gap-5">
          {/* Tanggal Lahir & Gender */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Tanggal Lahir</label>
              <input
                type="date"
                className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent outline-none transition-all text-gray-700 font-medium"
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Jenis Kelamin</label>
              <select
                className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--primary-color)] outline-none text-gray-700 font-medium"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              >
                <option>Laki-laki</option>
                <option>Perempuan</option>
              </select>
            </div>
          </div>

          <div className="h-[1px] bg-gray-100 my-1"></div>

          {/* Berat & Tinggi (Side by Side) */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Berat (kg)</label>
              <div className="relative group">
                <input
                  type="number"
                  step="0.1"
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent outline-none transition-all text-center text-lg font-bold text-gray-800 placeholder-gray-300"
                  placeholder="0.0"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-medium">kg</span>
              </div>
            </div>

            <div className="flex-1">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Tinggi (cm)</label>
              <div className="relative group">
                <input
                  type="number"
                  step="0.1"
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent outline-none transition-all text-center text-lg font-bold text-gray-800 placeholder-gray-300"
                  placeholder="0.0"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-medium">cm</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={aiLoading}
            className="w-full bg-gradient-to-r from-[var(--primary-color)] to-teal-500 text-white font-bold py-4 rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all mt-4 disabled:opacity-70 disabled:scale-100 flex justify-center items-center gap-2"
          >
            {aiLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Menganalisis...
              </span>
            ) : (
              <>Hitung Status Gizi <ChevronRight size={18} /></>
            )}
          </button>
        </form>
      </div>

      {/* --- KANAN: HASIL & REKOMENDASI --- */}
      <div className="w-full lg:w-2/3 space-y-8">

        {/* 1. Result Card (Desain Baru) */}
        {aiLoading ? (
          <Skeleton className="h-64 w-full rounded-3xl" />
        ) : result ? (
          <div className={`relative overflow-hidden p-8 rounded-3xl transition-all duration-500 shadow-sm border ${
            result.isStunting 
              ? 'bg-red-50/50 border-red-100' 
              : 'bg-teal-50/50 border-teal-100'
          }`}>
            
            {/* Background Blob Decoration */}
            <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20 -mr-16 -mt-16 pointer-events-none ${
              result.isStunting ? 'bg-red-300' : 'bg-[var(--primary-color)]'
            }`}></div>

            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    result.isStunting 
                      ? 'bg-red-100 text-red-600' 
                      : 'bg-teal-100 text-teal-700'
                  }`}>
                    {result.status}
                  </span>
                </div>
                
                <h3 className={`text-3xl md:text-4xl font-black mb-4 ${
                  result.isStunting ? 'text-red-700' : 'text-teal-800'
                }`}>
                  {result.isStunting ? 'Perlu Perhatian' : 'Tumbuh Optimal'}
                </h3>
                
                <p className="text-gray-600 leading-relaxed mb-6 text-sm md:text-base bg-white/60 p-4 rounded-xl backdrop-blur-sm border border-white/50">
                  {result.description}
                </p>

                {/* Info Chips */}
                <div className="flex gap-3">
                  <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">IMT / BMI</p>
                    <p className="text-lg font-bold text-gray-800">{result.bmi}</p>
                  </div>
                  <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Kategori</p>
                    <p className="text-sm font-bold text-gray-800">{result.bmiStatus}</p>
                  </div>
                </div>
              </div>

              {/* Visual Meter (Kanan) */}
              <div className="w-full md:w-64 bg-white p-5 rounded-2xl shadow-sm border border-gray-100 shrink-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-500">Grafik Posisi</span>
                  <Info size={14} className="text-gray-300" />
                </div>
                <ZScoreMeter score={result.zScore} label={result.zScoreLabel || 'Index'} />
                <p className="text-[10px] text-gray-400 text-center mt-3 leading-tight">
                  Posisi titik menunjukkan status gizi anak relatif terhadap standar WHO.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <EmptyState
            icon={Activity}
            title="Siap Menganalisis?"
            description="Masukkan data usia, berat, dan tinggi badan si kecil di panel kiri untuk melihat analisis kesehatan lengkap."
            className="h-full min-h-[300px] bg-white border-dashed"
          />
        )}

        {/* 2. Recommendations List (Card Grid yang lebih enak dilihat) */}
        {result && (
          <div className="animate-fade-in-up delay-100">
            <h3 className="font-bold text-gray-800 text-xl mb-6 flex items-center gap-2">
              <span className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-lg">🍽️</span>
              Rekomendasi Menu Gizi Seimbang
            </h3>

            {aiLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-48 rounded-2xl" />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {displayRecommendations.map((item, i) => (
                  <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
                    <div className="h-12 w-12 bg-teal-50 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                      {item.image_url ? (
                        <img src={item.image_url} alt="" className="w-full h-full object-cover rounded-xl" />
                      ) : (
                        <span>🍲</span>
                      )}
                    </div>
                    <h4 className="font-bold text-gray-800 mb-2 line-clamp-1 group-hover:text-[var(--primary-color)] transition-colors">
                      {item.name}
                    </h4>
                    <p className="text-xs text-gray-500 mb-4 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                    
                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 pt-3 border-t border-gray-50">
                      <span className="bg-orange-50 text-orange-600 px-2 py-1 rounded">{item.calories} Kkal</span>
                      <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded">{item.protein}g Prot</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}