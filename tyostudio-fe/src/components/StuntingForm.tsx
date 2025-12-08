'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { format, differenceInMonths } from "date-fns";
import { EmptyState } from '@/components/ui/EmptyState';
import { Activity } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';
import ChildSelector from './ChildSelector';
import { toast } from 'sonner';

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

  // 1. Auto-select first child if available
  useEffect(() => {
    if (childrenData && childrenData.length > 0 && !selectedChildId) {
      setSelectedChildId(childrenData[0].id);
    }
  }, [childrenData]);

  // 2. Fetch latest growth record & Prefill Form when child selected
  useEffect(() => {
    if (selectedChildId) {
      const fetchLastRecord = async () => {
        const supabase = createClient();
        const { data, error } = await supabase
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

  // Sync Form with Selected Child & Record
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

  // 3. Calculate Age Display whenever DOB changes
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


  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.dob || !formData.weight || !formData.height) return;

    setAiLoading(true); // START LOADING

    // Hitung umur bulan real-time saat submit
    const birthDate = new Date(formData.dob);
    const age = Math.max(0, differenceInMonths(new Date(), birthDate)); // Bulan

    const height = parseFloat(formData.height);
    const weight = parseFloat(formData.weight);


    const medianHeight = (age * 0.7) + 60;
    const stdDev = 3;

    const zScoreVal = (height - medianHeight) / stdDev;
    const zScoreFixed = parseFloat(zScoreVal.toFixed(1));

    let status = 'Tumbuh Kembang Normal';
    let isStunting = false;
    let desc = 'Tinggi badan anak berada dalam rentang normal standar WHO.';

    if (zScoreFixed < -2) {
      status = 'Terindikasi Stunting';
      isStunting = true;
      desc = 'Tinggi badan anak berada di bawah rata-rata standar WHO.';
    } else if (zScoreFixed > 2) {
      status = 'Tinggi Diatas Rata-rata';
      desc = 'Pertumbuhan anak sangat pesat diatas rata-rata.';
    }

    // Hitung BMI
    // Rumus: Berat (kg) / (Tinggi (m) * Tinggi (m))
    const heightInMeters = height / 100;
    const bmiVal = weight / (heightInMeters * heightInMeters);
    const bmiFixed = parseFloat(bmiVal.toFixed(1));

    let bmiStatus = 'Normal';
    if (bmiFixed < 18.5) bmiStatus = 'Kurus';
    else if (bmiFixed >= 25) bmiStatus = 'Gemuk';

    setResult({
      zScore: zScoreFixed,
      status: status,
      description: desc,
      isStunting: isStunting,
      bmi: bmiFixed,
      bmiStatus: bmiStatus
    });

    // --- AI GENERATION ---
    try {
      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `Berikan 3 rekomendasi menu makanan lokal Indonesia yang murah dan bergizi untuk anak usia ${age} bulan dengan kondisi ${status} (Z-Score: ${zScoreFixed}) dan BMI ${bmiStatus}. 
      Lokasi pengguna berada di daerah: ${userLocation || 'Indonesia'}. Sesuaikan bahan makanan dengan ketersediaan di daerah tersebut (misal: pesisir banyak ikan, pegunungan banyak sayur).
      
      Format respon dalam JSON array seperti ini (tanpa markdown):
      [
        {
          "name": "Nama Menu",
          "calories": 200,
          "protein": 10,
          "fats": 5,
          "description": "Alasan singkat kenapa menu ini cocok (max 15 kata)."
        }
      ]`;

      const resultAI = await model.generateContent(prompt);
      const responseText = resultAI.response.text();
      const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const recommendationsAI = JSON.parse(cleanedText);

      setAiRecommendations(recommendationsAI);
    } catch (err) {
      console.error("AI Error:", err);
      toast.error('Gagal mendapatkan rekomendasi AI. Menggunakan rekomendasi standar.');
      setAiRecommendations([]); // Fallback to static
    }

    setAiLoading(false);

    // Save to Database if Child Exists
    if (selectedChildId) {
      const supabase = createClient();
      console.log('Saving growth record...');
      const { error } = await supabase.from('growth_records').insert([
        {
          child_id: selectedChildId,
          age_in_months: age,
          height: height,
          weight: weight,
          recorded_date: new Date().toISOString()
        }
      ]);
      if (error) {
        console.error('Error saving growth record:', error);
        toast.error('Gagal menyimpan riwayat: ' + error.message);
      } else {
        console.log('Growth record saved');
        toast.success('Riwayat pertumbuhan berhasil disimpan!');
        setCurrentGrowthRecord({
          child_id: selectedChildId,
          age_in_months: age,
          height: height,
          weight: weight,
          recorded_date: new Date().toISOString()
        });
      }
    }
  };

  // Determine which recommendations to show
  const displayRecommendations = aiRecommendations.length > 0 ? aiRecommendations : staticRecommendations;

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start w-full">

      {/* --- LEFT COLUMN: INPUT FORM --- */}
      <div className="w-full lg:w-1/3 bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-fit sticky top-24">

        {/* Child Selector (Only if logged in and has children) */}
        {childrenData && childrenData.length > 0 && (
          <div className="mb-6 border-b border-gray-100 pb-6">
            <ChildSelector
              childrenData={childrenData}
              selectedId={selectedChildId}
              onSelect={setSelectedChildId}
              label="Pilih Data Anak"
            />
          </div>
        )}

        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 text-xl">
            👤
          </div>
          <h2 className="text-xl font-bold text-gray-800">Data Si Kecil</h2>
        </div>

        <form onSubmit={handleCalculate} className="flex flex-col gap-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-bold text-gray-700 mb-2">Tanggal Lahir</label>
              <input
                type="date"
                className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent outline-none transition-all"
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
              />
              {formData.ageDisplay && (
                <p className="text-sm text-[var(--primary-color)] mt-1 font-medium">
                  Usia: {formData.ageDisplay}
                </p>
              )}
            </div>
            <div className="flex-1">
              <label className="block text-sm font-bold text-gray-700 mb-2">Jenis Kelamin</label>
              <select
                className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] outline-none"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              >
                <option>Laki-laki</option>
                <option>Perempuan</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-bold text-gray-700 mb-2">Berat Badan (kg)</label>
              <div className="relative">
                <span className="absolute left-3 top-3.5 text-gray-400 text-sm">⚖️</span>
                <input
                  type="number"
                  className="w-full pl-9 p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] outline-none"
                  placeholder="11"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                />
              </div>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-bold text-gray-700 mb-2">Tinggi Badan (cm)</label>
              <div className="relative">
                <span className="absolute left-3 top-3.5 text-gray-400 text-sm">📏</span>
                <input
                  type="number"
                  className="w-full pl-9 p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] outline-none"
                  placeholder="70"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={aiLoading}
            className="w-full bg-[var(--primary-color)] text-white font-bold py-3.5 rounded-lg hover:bg-teal-600 transition-colors shadow-md mt-2 disabled:opacity-70"
          >
            {aiLoading ? 'Menganalisis...' : 'Hitung Sekarang'}
          </button>
        </form>
      </div>

      {/* --- RIGHT COLUMN: RESULTS & RECOMMENDATIONS --- */}
      <div className="w-full lg:w-2/3 space-y-6">

        {/* 1. Result Card (Red/Green Box) */}
        {aiLoading ? (
          <Skeleton className="h-48 w-full rounded-2xl" />
        ) : result ? (
          <div className={`p-8 rounded-2xl border-l-8 shadow-sm transition-all duration-500 transform translate-y-0 opacity-100 ${result.isStunting ? 'bg-red-50 border-red-500' : 'bg-teal-50 border-teal-500'}`}>
            <h3 className={`text-2xl font-bold mb-3 ${result.isStunting ? 'text-red-700' : 'text-teal-800'}`}>
              {result.status}
            </h3>
            <p className="text-gray-700 leading-relaxed text-lg">
              {result.description}
            </p>
            <div className="mt-6 flex gap-4">
              <div className="bg-white/60 p-3 rounded-lg flex-1">
                <span className="text-xs text-gray-500 uppercase tracking-widest font-bold">Z-Score</span>
                <p className="text-2xl font-black text-gray-800">{result.zScore}</p>
              </div>
              <div className="bg-white/60 p-3 rounded-lg flex-1">
                <span className="text-xs text-gray-500 uppercase tracking-widest font-bold">Status</span>
                <p className="text-xl font-bold text-gray-800">{result.status}</p>
              </div>
              <div className="bg-white/60 p-3 rounded-lg flex-1">
                <span className="text-xs text-gray-500 uppercase tracking-widest font-bold">BMI</span>
                <p className="text-2xl font-black text-gray-800">{result.bmi}</p>
                <p className="text-xs text-gray-600 font-medium">{result.bmiStatus}</p>
              </div>
            </div>
          </div>
        ) : (
          <EmptyState
            icon={Activity}
            title="Hasil Analisis"
            description="Masukkan data si kecil dan tekan tombol Hitung untuk melihat hasil analisis status gizi."
          />
        )}

        {/* 2. Recommendations List (Card Style) */}
        {result && (
          <div>
            <h3 className="font-bold text-gray-800 text-xl mb-4 flex items-center gap-2">
              <span>🍽️</span> Rekomendasi Menu Gizi Seimbang
            </h3>

            {aiLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-32 w-full rounded-2xl" />
                <Skeleton className="h-32 w-full rounded-2xl" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {displayRecommendations.map((item, i) => (
                  <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative h-32 w-full bg-gray-100 flex items-center justify-center text-4xl">
                      {/* Gemini doesn't return images, so we use a placeholder or conditional */}
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <span>🥘</span>
                      )}
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-md mb-3 text-gray-800">{item.name}</h4>
                      <div className="text-xs space-y-1 text-gray-500">
                        <div className="flex justify-between">
                          <span>{item.calories} Kal</span>
                          <span className="font-medium text-gray-700">{item.protein}g P | {item.fats}g L</span>
                        </div>
                        <p className="italic text-[10px] mt-2 text-gray-400 line-clamp-2">{item.description}</p>
                      </div>
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
