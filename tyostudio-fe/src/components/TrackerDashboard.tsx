'use client';

import React, { useState, useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';
import { useRouter } from 'next/navigation';

interface TrackerDashboardProps {
  user: any;
  child: any;
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

export default function TrackerDashboard({ user, child, growthRecords }: TrackerDashboardProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'height' | 'weight' | 'zscore'>('height');

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
      // Assuming user enters data freely, we might have multiple points.
      // For line chart 'categorical', we need to match keys.
      // Let's create a copy of standardData and fill in 'child' values
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
        heightIdeal: std.heightIdeal,
        heightBorder: std.heightBorder,
        heightChild: rec ? rec.height : null,
        weightIdeal: std.weightIdeal,
        weightBorder: std.weightBorder,
        weightChild: rec ? rec.weight : null,
        zScore: zScore ? parseFloat(zScore) : null,
        ...std
      };
    });
  }, [growthRecords]);

  // Latest Record for Summary
  const currentStatus = chartData.findLast(d => d.heightChild !== null) || chartData[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* --- AREA GRAFIK (KIRI) --- */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">

          {/* Header Grafik & Tab Switcher */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h3 className="font-bold text-xl text-gray-800">Grafik Pertumbuhan</h3>
              <p className="text-xs text-gray-400 mt-1">
                {child ? `Data untuk ${child.name}` : 'Belum ada data anak'}
              </p>
            </div>

            {/* Tab Switcher */}
            <div className="flex bg-gray-50 p-1.5 rounded-xl border border-gray-100">
              {['height', 'weight', 'zscore'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 capitalize ${activeTab === tab
                      ? 'bg-white text-[var(--primary-color)] shadow-sm scale-105'
                      : 'text-gray-400 hover:text-gray-600'
                    }`}
                >
                  {tab === 'zscore' ? 'Z-Score' : tab === 'height' ? 'Tinggi' : 'Berat'}
                </button>
              ))}
            </div>
          </div>

          {/* Chart Container */}
          <div className="h-[380px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis
                  dataKey="age"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 500 }}
                  dy={15}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  domain={['auto', 'auto']}
                />
                <Tooltip cursor={{ stroke: '#E5E7EB', strokeWidth: 2 }} content={<CustomTooltip mode={activeTab} />} />

                {/* --- KONFIGURASI GARIS SESUAI GAMBAR REFERENSI --- */}

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

      {/* --- AREA KANAN (MENU & LOG) --- */}
      <div className="space-y-6">

        {/* Kartu Menu */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-5 text-sm tracking-widest uppercase border-b pb-2 border-gray-50">
            🍽️ Menu Rekomendasi
          </h3>
          <div className="space-y-4">
            <div className="flex gap-4 items-start p-3 hover:bg-gray-50 rounded-xl transition cursor-pointer border border-transparent hover:border-gray-100">
              <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center text-2xl shrink-0">
                🐟
              </div>
              <div>
                <h4 className="font-bold text-gray-800 text-sm">Ikan Kembung Kuah Asam</h4>
                <p className="text-xs text-gray-500 mt-1">Mengandung Omega-3 tinggi untuk perkembangan otak & protein.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start p-3 hover:bg-gray-50 rounded-xl transition cursor-pointer border border-transparent hover:border-gray-100">
              <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-lg flex items-center justify-center text-2xl shrink-0">
                🥛
              </div>
              <div>
                <h4 className="font-bold text-gray-800 text-sm">Susu Tinggi Kalori</h4>
                <p className="text-xs text-gray-500 mt-1">Tambahan 2 gelas sehari untuk mengejar berat badan.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Riwayat Singkat */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-5 text-sm tracking-widest uppercase border-b pb-2 border-gray-50">
            📏 Riwayat Terakhir
          </h3>
          {currentStatus && currentStatus.heightChild ? (
            <div className="relative pl-6 border-l-2 border-dashed border-gray-200 space-y-6">
              <div className="relative">
                <div className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-4 border-white shadow-sm ${currentStatus.zScore && currentStatus.zScore < -2 ? 'bg-red-500' : 'bg-emerald-400'}`}></div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase mb-1">{currentStatus.age}</p>
                  <p className="font-bold text-gray-800">T: {currentStatus.heightChild} cm | B: {currentStatus.weightChild} kg</p>
                  <span className={`inline-block mt-1 px-2 py-0.5 text-[10px] font-bold rounded ${currentStatus.zScore && currentStatus.zScore < -2 ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                    {currentStatus.zScore && currentStatus.zScore < -2 ? 'Risk Stunting' : 'Normal'}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic">Belum ada data riwayat.</p>
          )}
        </div>

      </div>
    </div>
  );
}
