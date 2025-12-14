'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';
import { useRouter } from 'next/navigation';
import ChildSelector from './ChildSelector';
import { EmptyState } from '@/components/ui/EmptyState';
import AddGrowthRecordModal from './AddGrowthRecordModal';
import { ClipboardList, PlusCircle, Trash2 } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';
import { generateFoodRecommendations } from '@/app/actions/gemini';
import { Loader2, MapPin, Sparkles } from 'lucide-react';

interface TrackerDashboardProps {
  user: any;
  child: any;
  allChildren?: any[];
  growthRecords: any[];
  userLocation?: string;
}

// --- DATA STANDARD WHO ---
const standardData = [
  { month: 0, heightIdeal: 50, heightBorder: 46, weightIdeal: 3.3, weightBorder: 2.5 },
  { month: 6, heightIdeal: 68, heightBorder: 64, weightIdeal: 7.9, weightBorder: 6.4 },
  { month: 12, heightIdeal: 76, heightBorder: 71, weightIdeal: 9.6, weightBorder: 7.7 },
  { month: 18, heightIdeal: 82, heightBorder: 76, weightIdeal: 10.9, weightBorder: 8.8 },
  { month: 24, heightIdeal: 88, heightBorder: 81, weightIdeal: 12.2, weightBorder: 9.7 },
  { month: 30, heightIdeal: 92, heightBorder: 85, weightIdeal: 13.3, weightBorder: 10.5 },
  { month: 36, heightIdeal: 96, heightBorder: 89, weightIdeal: 14.3, weightBorder: 11.3 },
];

const CustomTooltip = ({ active, payload, label, mode }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-gray-100 shadow-xl rounded-xl text-sm min-w-[180px] z-50 font-sans">
        <p className="font-bold text-gray-800 text-base mb-3 border-b-2 border-gray-100 pb-2">
          {label}
        </p>

        {mode === 'height' && (
          <div className="space-y-1.5">
            <p className="text-[#10B981] font-semibold flex justify-between">
              <span>Ideal:</span> <span>{payload[0].value} cm</span>
            </p>
            {payload[1] && (
              <p className="text-[#3B82F6] font-semibold flex justify-between">
                <span>Anak:</span> <span>{payload[1].value} cm</span>
              </p>
            )}
            <p className="text-[#F87171] font-semibold flex justify-between">
              <span>Batas Stunting:</span> <span>{payload[2]?.value || '-'} cm</span>
            </p>
          </div>
        )}

        {mode === 'weight' && (
          <div className="space-y-1.5">
            <p className="text-[#10B981] font-semibold flex justify-between">
              <span>Ideal:</span> <span>{payload[0].value} kg</span>
            </p>
            {payload[1] && (
              <p className="text-[#3B82F6] font-semibold flex justify-between">
                <span>Anak:</span> <span>{payload[1].value} kg</span>
              </p>
            )}
            <p className="text-[#F87171] font-semibold flex justify-between">
              <span>Batas Kurus:</span> <span>{payload[2]?.value || '-'} kg</span>
            </p>
          </div>
        )}

        {mode === 'zscore' && (
          <div className="space-y-2">
            <p className="text-[#3B82F6] font-bold text-lg border-b border-gray-50 pb-1">
              {payload[0]?.value} SD
            </p>
          </div>
        )}
      </div>
    );
  }
  return null;
};

export default function TrackerDashboard({ user, child, allChildren, growthRecords, userLocation = 'Indonesia' }: TrackerDashboardProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'height' | 'weight' | 'zscore'>('height');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Recommendations State
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loadingRecs, setLoadingRecs] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [errorRecs, setErrorRecs] = useState<string | null>(null);
  const fetchingRef = React.useRef(false);

  // Handle Child Switch
  const handleChildSelect = (childId: string) => {
    router.push(`/track?childId=${childId}`);
  };

  const [deleteRecordId, setDeleteRecordId] = useState<string | null>(null);

  const handleDeleteRequest = (recordId: string) => {
    setDeleteRecordId(recordId);
  };

  const confirmDelete = async () => {
    if (!deleteRecordId) return;

    const supabase = createClient();
    const { error } = await supabase
      .from('growth_records')
      .delete()
      .eq('id', deleteRecordId);

    if (error) {
      toast.error('Gagal menghapus data: ' + error.message);
    } else {
      toast.success('Data pengukuran berhasil dihapus');
      router.refresh();
    }
    setDeleteRecordId(null);
  };

  const chartData = useMemo(() => {
    const maxUserMonth = growthRecords.length > 0 ? Math.max(...growthRecords.map(r => r.age_in_months)) : 0;
    const maxMonth = Math.max(36, maxUserMonth + 1);

    const data = [];

    for (let m = 0; m <= maxMonth; m++) {
      const lower = standardData.filter(d => d.month <= m).pop() || standardData[0];
      const upper = standardData.find(d => d.month >= m) || standardData[standardData.length - 1];

      let fraction = 0;
      if (upper.month !== lower.month) {
        fraction = (m - lower.month) / (upper.month - lower.month);
      }

      const lerp = (start: number, end: number) => start + (end - start) * fraction;

      const stdPoint = {
        heightIdeal: parseFloat(lerp(lower.heightIdeal, upper.heightIdeal).toFixed(1)),
        heightBorder: parseFloat(lerp(lower.heightBorder, upper.heightBorder).toFixed(1)),
        weightIdeal: parseFloat(lerp(lower.weightIdeal, upper.weightIdeal).toFixed(1)),
        weightBorder: parseFloat(lerp(lower.weightBorder, upper.weightBorder).toFixed(1)),
      };

      const userRec = growthRecords.find(r => Math.round(r.age_in_months) === m);

      let zScore = null;
      if (userRec) {
        zScore = ((userRec.height - stdPoint.heightIdeal) / 3).toFixed(1);
      }

      data.push({
        age: m,
        label: `${m} Bln`,
        heightIdeal: stdPoint.heightIdeal,
        heightBorder: stdPoint.heightBorder,
        weightIdeal: stdPoint.weightIdeal,
        weightBorder: stdPoint.weightBorder,
        heightChild: userRec ? userRec.height : null,
        weightChild: userRec ? userRec.weight : null,
        zScore: zScore ? parseFloat(zScore) : null,
      });
    }

    return data;
  }, [growthRecords]);

  const fetchRecommendations = async () => {
    if (!child || growthRecords.length === 0 || fetchingRef.current || hasGenerated) return;

    fetchingRef.current = true;
    setLoadingRecs(true);
    setErrorRecs(null);

    try {
      const latest = growthRecords[growthRecords.length - 1];
      const weightZ = (latest.weight - 12) / 2;

      let status = "Gizi Baik";
      if (weightZ < -2) status = "Gizi Kurang";
      if (weightZ < -3) status = "Gizi Buruk";
      if (weightZ > 2) status = "Gizi Lebih";

      const result = await generateFoodRecommendations(
        latest.age_in_months,
        latest.weight,
        latest.height,
        child.gender,
        status,
        userLocation,
        child.id
      );

      if (result.error && !result.isFallback) {
        setErrorRecs(result.error);
      }

      if (result.recommendations) {
        setRecommendations(result.recommendations);
        setHasGenerated(true);
        if (result.isFallback && !result.suppressNotification) {
          toast.warning('Menggunakan rekomendasi alternatif (Layanan AI sedang sibuk).');
        }
      }

    } catch (err: any) {
      console.error("Failed to fetch recommendations:", err);
      setErrorRecs("Gagal memuat rekomendasi: " + (err.message || 'Error tidak diketahui'));
    } finally {
      setLoadingRecs(false);
      fetchingRef.current = false;
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [child?.id, growthRecords]);

  useEffect(() => {
    setRecommendations([]);
    setHasGenerated(false);
    setErrorRecs(null);
    fetchingRef.current = false;
  }, [child?.id]);

  const handleRetry = () => {
    setHasGenerated(false);
    fetchingRef.current = false;
    fetchRecommendations();
  };

  return (
    <div className="flex flex-col gap-6">

      {/* --- HEADER PROFILE & SELECTOR --- */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-3xl shadow-sm">👶</div>
          <div>
            <h2 className="font-bold text-gray-800 text-2xl">{child?.name || 'Si Kecil'}</h2>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded uppercase tracking-wide">{child?.gender || '-'}</span>
              {child?.date_of_birth && (
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  🎂 {new Date(child.date_of_birth).toLocaleDateString('id-ID')}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Child Selector & Add Button */}
        {/* PERUBAHAN UTAMA DI SINI: items-end agar sejajar dengan input box, bukan label */}
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto items-end">

          {allChildren && allChildren.length > 0 && (
            <div className="w-full md:w-64">
              <ChildSelector
                childrenData={allChildren}
                selectedId={child?.id}
                onSelect={handleChildSelect}
              />
            </div>
          )}

          {/* Add Data Button */}
          {/* PERUBAHAN: Tinggi (h-[42px]) disamakan dengan input standar */}
          {child && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="h-[42px] flex justify-center items-center gap-2 px-4 bg-[var(--primary-color)] text-white font-bold text-sm rounded-lg shadow-sm hover:bg-teal-700 hover:shadow-md transition w-full md:w-auto mb-[1px]"
            >
              <PlusCircle size={16} /> {/* Icon diperkecil sedikit */}
              <span>Catat Data</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* --- AREA KIRI (CHART) --- */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            {/* Header Chart Tabs */}
            <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
              <h3 className="font-bold text-gray-800 text-lg">Grafik Pertumbuhan</h3>
              <div className="flex bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setActiveTab('height')}
                  className={`px-4 py-2 text-sm font-bold rounded-md transition ${activeTab === 'height' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Tinggi
                </button>
                <button
                  onClick={() => setActiveTab('weight')}
                  className={`px-4 py-2 text-sm font-bold rounded-md transition ${activeTab === 'weight' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Berat
                </button>
                <button
                  onClick={() => setActiveTab('zscore')}
                  className={`px-4 py-2 text-sm font-bold rounded-md transition ${activeTab === 'zscore' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Z-Score
                </button>
              </div>
            </div>

            {/* CHART CONTAINER */}
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} dy={10} interval="preserveStartEnd" minTickGap={30} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} dx={-10} />
                  <Tooltip content={<CustomTooltip mode={activeTab} />} cursor={{ stroke: '#E5E7EB', strokeWidth: 2 }} />

                  {/* MODE TINGGI BADAN */}
                  {activeTab === 'height' && (
                    <>
                      <Line type="monotone" dataKey="heightIdeal" stroke="#10B981" strokeWidth={2.5}
                        dot={{ r: 4, fill: '#10B981', strokeWidth: 2, stroke: '#fff' }} name="Ideal" />

                      <Line type="monotone" dataKey="heightChild" stroke="#3B82F6" strokeWidth={3} connectNulls
                        dot={{ r: 5, fill: '#3B82F6', strokeWidth: 3, stroke: '#fff' }} name="Anak" />

                      <Line type="monotone" dataKey="heightBorder" stroke="#F87171" strokeDasharray="6 6" strokeWidth={2}
                        dot={{ r: 4, fill: '#F87171', strokeWidth: 2, stroke: '#fff' }} name="Batas" />
                    </>
                  )}

                  {/* MODE BERAT BADAN */}
                  {activeTab === 'weight' && (
                    <>
                      <Line type="monotone" dataKey="weightIdeal" stroke="#10B981" strokeWidth={2.5}
                        dot={{ r: 4, fill: '#10B981', strokeWidth: 2, stroke: '#fff' }} />
                      <Line type="monotone" dataKey="weightChild" stroke="#3B82F6" strokeWidth={3} connectNulls
                        dot={{ r: 5, fill: '#3B82F6', strokeWidth: 3, stroke: '#fff' }} />
                      <Line type="monotone" dataKey="weightBorder" stroke="#F87171" strokeDasharray="6 6" strokeWidth={2}
                        dot={{ r: 4, fill: '#F87171', strokeWidth: 2, stroke: '#fff' }} />
                    </>
                  )}

                  {/* MODE Z-SCORE */}
                  {activeTab === 'zscore' && (
                    <>
                      <ReferenceLine y={0} stroke="#10B981" strokeDasharray="3 3" label={{ position: 'right', value: 'Median', fill: '#10B981', fontSize: 10 }} />
                      <ReferenceLine y={-2} stroke="#EF4444" strokeDasharray="3 3" label={{ position: 'right', value: '-2 SD', fill: '#EF4444', fontSize: 10 }} />

                      <Line type="monotone" dataKey="zScore" stroke="#3B82F6" strokeWidth={3} connectNulls
                        dot={{ r: 5, fill: '#3B82F6', strokeWidth: 3, stroke: '#fff' }} />
                    </>
                  )}

                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Legend Manual */}
            <div className="flex justify-center gap-6 mt-8">
              {activeTab !== 'zscore' ? (
                <>
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                    <span className="w-3 h-3 rounded-full bg-[#10B981] border-2 border-white shadow-sm ring-1 ring-[#10B981]/20"></span>
                    Ideal
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                    <span className="w-3 h-3 rounded-full bg-[#3B82F6] border-2 border-white shadow-sm ring-1 ring-[#3B82F6]/20"></span>
                    Si Kecil
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                    <span className="w-3 h-3 rounded-full bg-[#F87171] border-2 border-white shadow-sm ring-1 ring-[#F87171]/20"></span>
                    Batas Stunting
                  </div>
                </>
              ) : (
                <p className="text-xs text-gray-400">Garis referensi hijau adalah Median (0), merah adalah ambang batas (-2 SD)</p>
              )}
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3">
            <span className="text-xl">💡</span>
            <p className="text-sm text-blue-800 leading-relaxed">
              <strong>Tips:</strong> Klik tab di atas grafik untuk beralih antara melihat tren Berat Badan, Tinggi Badan, atau skor standar deviasi (Z-Score) secara detail.
            </p>
          </div>
        </div>

        {/* --- AREA KANAN (MENU REKOMENDASI) --- */}
        <div className="h-full">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col max-h-[500px]">
            <div className="flex justify-between items-center mb-5 border-b border-gray-50 pb-2 shrink-0">
              <h3 className="font-bold text-gray-800 text-sm tracking-widest uppercase">
                🍽️ Menu Rekomendasi
              </h3>
              {userLocation && (
                <div className="flex items-center gap-1 text-xs text-teal-600 bg-teal-50 px-2 py-1 rounded-full">
                  <MapPin size={12} />
                  <span className="font-bold truncate max-w-[100px]">{userLocation}</span>
                </div>
              )}
            </div>

            <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1">

              {!loadingRecs && !errorRecs && recommendations.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center p-4 opacity-70">
                  <div className="text-3xl mb-2 grayscale">🥘</div>
                  <p className="text-xs text-gray-500 max-w-[200px] leading-relaxed">
                    {growthRecords.length === 0
                      ? "Catat data tumbuh kembang dulu untuk dapat rekomendasi."
                      : "Menyiapkan rekomendasi menu..."}
                  </p>
                </div>
              )}

              {errorRecs && (
                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                  <div className="text-3xl mb-2">⚠️</div>
                  <p className="text-xs text-red-500 mb-4 max-w-[200px]">
                    {errorRecs || "Gagal memuat rekomendasi."}
                  </p>
                  <button
                    onClick={handleRetry}
                    className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-xs font-bold hover:bg-red-100 transition"
                  >
                    Coba Lagi
                  </button>
                </div>
              )}

              {(loadingRecs || (recommendations.length === 0 && !hasGenerated && !errorRecs && growthRecords.length > 0)) && (
                <div className="space-y-4 animate-pulse">
                  <div className="flex gap-2 items-center text-teal-600 text-xs font-bold mb-2">
                    <Sparkles size={14} className="animate-spin" />
                    Sedang meracik menu untuk si kecil...
                  </div>
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex gap-4 p-3 rounded-xl bg-gray-50 border border-gray-100">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg shrink-0"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {recommendations.map((item, idx) => (
                <div key={idx} className="flex gap-4 items-start p-3 hover:bg-gray-50 rounded-xl transition cursor-pointer border border-transparent hover:border-gray-100 animate-in fade-in slide-in-from-bottom-2 duration-500" style={{ animationDelay: `${idx * 150}ms` }}>
                  <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-lg flex items-center justify-center text-2xl shrink-0 shadow-sm border border-orange-100">
                    {idx === 0 ? '🍳' : idx === 1 ? '🍱' : idx === 2 ? '🥗' : '🥣'}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm">{item.name}</h4>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">{item.description}</p>
                    <div className="flex gap-2 mt-2">
                      <span className="text-[10px] bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded font-bold border border-orange-100">🔥 {item.calories} kkal</span>
                      <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-bold border border-blue-100">💪 P: {item.protein}g</span>
                    </div>
                  </div>
                </div>
              ))}

            </div>
          </div>
        </div>
      </div>

      {/* History Table */}
      {growthRecords && growthRecords.length > 0 && (
        <div className="mt-8 border-t border-gray-100 pt-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Riwayat Pengukuran</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                <tr>
                  <th className="px-4 py-3 rounded-l-lg">Tanggal</th>
                  <th className="px-4 py-3">Usia (Bulan)</th>
                  <th className="px-4 py-3">Tinggi (cm)</th>
                  <th className="px-4 py-3">Berat (kg)</th>
                  <th className="px-4 py-3 rounded-r-lg text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {[...growthRecords].reverse().map((record: any, index: number) => (
                  <tr key={index} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{record.recorded_date ? new Date(record.recorded_date).toLocaleDateString('id-ID') : '-'}</td>
                    <td className="px-4 py-3">{record.age_in_months}</td>
                    <td className="px-4 py-3 text-[var(--primary-color)] font-bold">{record.height}</td>
                    <td className="px-4 py-3 text-orange-400 font-bold">{record.weight}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleDeleteRequest(record.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                        title="Hapus Data"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteRecordId && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl transform transition-all scale-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">Hapus Data?</h3>
              <button
                onClick={() => setDeleteRecordId(null)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 18 18" /></svg>
              </button>
            </div>

            <p className="text-gray-600 mb-6 text-sm leading-relaxed">
              Apakah Bunda yakin ingin menghapus data pengukuran ini?
              <br /><br />
              <span className="text-red-500 text-xs bg-red-50 px-2 py-1 rounded">⚠️ Data yang dihapus tidak dapat dikembalikan.</span>
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setDeleteRecordId(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition text-sm"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition shadow-md text-sm"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL */}
      {child && (
        <AddGrowthRecordModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          childId={child.id}
          childDob={child.date_of_birth}
          childName={child.name}
        />
      )}
    </div>
  );
}