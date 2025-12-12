'use client';

import React, { useState, useMemo } from 'react';
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

interface TrackerDashboardProps {
  user: any;
  child: any;
  allChildren?: any[];
  growthRecords: any[];
}

// --- DATA STANDARD WHO (Simplified for Demo) ---
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

export default function TrackerDashboard({ user, child, allChildren, growthRecords }: TrackerDashboardProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'height' | 'weight' | 'zscore'>('height');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Handle Child Switch
  const handleChildSelect = (childId: string) => {
    // Navigate to same page but with new childId query param
    // This triggers SSR re-fetch in page.tsx
    router.push(`/track?childId=${childId}`);
  };

  // Handle Delete Record
  const handleDeleteRecord = async (recordId: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus data pengukuran ini?')) {
      const supabase = createClient();
      const { error } = await supabase
        .from('growth_records')
        .delete()
        .eq('id', recordId);

      if (error) {
        toast.error('Gagal menghapus data: ' + error.message);
      } else {
        toast.success('Data pengukuran berhasil dihapus');
        router.refresh();
      }
    }
  };

  // Merge Standard Data with User Data
  const chartData = useMemo(() => {
    // Map records by month (buckets)
    const recordsMap = new Map();
    growthRecords.forEach(r => {
      // Simple bucketing to nearest 6 months or exact match?
      // Let's bucket by closest standard point for demo visualization
      // Or better: Just use age_in_months
      const bucket = standardData.reduce((prev, curr) =>
        Math.abs(curr.month - r.age_in_months) < Math.abs(prev.month - r.age_in_months) ? curr : prev
      ).month;

      // If exact match or close enough, user data overrides
      recordsMap.set(bucket, r);
    });

    return standardData.map(std => {
      const rec = recordsMap.get(std.month);
      // Calculate naive Z-Score if record exists
      let zScore = null;
      if (rec) {
        // Very rough approx
        zScore = ((rec.height - std.heightIdeal) / 3).toFixed(1);
      }

      return {
        age: `${std.month} Bln`,
        heightChild: rec ? rec.height : null,
        weightChild: rec ? rec.weight : null,
        zScore: zScore ? parseFloat(zScore) : null,
        ...std
      };
    });
  }, [growthRecords]);

  // Latest Record for Summary
  const currentStatus = chartData.findLast(d => d.heightChild !== null) || chartData[0];

  // History Logs (Reverse Chronological) - Get last 5
  // growthRecords is ascending, so we simply reverse copy
  const historyLogs = [...growthRecords].reverse().slice(0, 5);

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
                  🎂 {new Date(child.date_of_birth).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Child Selector & Add Button */}
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
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
          {child && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex justify-center items-center gap-2 px-6 py-3 bg-[var(--primary-color)] text-white font-bold rounded-xl shadow-lg shadow-teal-100 hover:bg-teal-700 transition"
            >
              <PlusCircle size={20} />
              Catat Data
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
                  <XAxis dataKey="age" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} dy={10} />
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

            {/* Legend Manual yang Clean */}
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
            <h3 className="font-bold text-gray-800 mb-5 text-sm tracking-widest uppercase border-b pb-2 border-gray-50 shrink-0">
              🍽️ Menu Rekomendasi
            </h3>

            <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1">

              <div className="flex gap-4 items-start p-3 hover:bg-gray-50 rounded-xl transition cursor-pointer border border-transparent hover:border-gray-100">
                <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center text-2xl shrink-0">
                  <span>🐟</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">Ikan Kembung Kuah Asam</h4>
                  <p className="text-xs text-gray-500 mt-1">Mengandung Omega-3 tinggi untuk perkembangan otak & protein.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start p-3 hover:bg-gray-50 rounded-xl transition cursor-pointer border border-transparent hover:border-gray-100">
                <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-lg flex items-center justify-center text-2xl shrink-0">
                  <span>🥛</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">Susu Tinggi Kalori</h4>
                  <p className="text-xs text-gray-500 mt-1">Tambahan 2 gelas sehari untuk mengejar berat badan.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start p-3 hover:bg-gray-50 rounded-xl transition cursor-pointer border border-transparent hover:border-gray-100">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center text-2xl shrink-0">
                  <span>🥑</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">Alpukat Kerok Susu</h4>
                  <p className="text-xs text-gray-500 mt-1">Lemak sehat tinggi kalori yang mudah dicerna balita.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start p-3 hover:bg-gray-50 rounded-xl transition cursor-pointer border border-transparent hover:border-gray-100">
                <div className="w-12 h-12 bg-red-100 text-red-600 rounded-lg flex items-center justify-center text-2xl shrink-0">
                  <span>🥩</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">Bola Daging Cincang</h4>
                  <p className="text-xs text-gray-500 mt-1">Sumber zat besi dan protein hewani yang sangat baik.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start p-3 hover:bg-gray-50 rounded-xl transition cursor-pointer border border-transparent hover:border-gray-100">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center text-2xl shrink-0">
                  <span>🥣</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">Bubur Kacang Hijau</h4>
                  <p className="text-xs text-gray-500 mt-1">Snack sehat kaya serat dan vitamin B kompleks.</p>
                </div>
              </div>

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
                        onClick={() => handleDeleteRecord(record.id)}
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
