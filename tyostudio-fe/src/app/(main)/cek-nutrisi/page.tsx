"use client";

import React, { useState } from 'react';

import { createClient } from '@/utils/supabase/client';
import ChildSelector from '@/components/ChildSelector';
import { differenceInYears } from 'date-fns';

// Default AKG Values (Fallback)
const AKG_FALLBACK = {
    cal: 2150, // kcal
    prot: 60,  // gram
    carb: 300, // gram
    fat: 70    // gram
};

// ... existing interfaces ...
interface FoodItem {
    name: string;
    cal: number;
    prot: number;
    carb: number;
    fat: number;
    count: number;
}

export default function CekNutrisiPage() {
    const supabase = createClient();
    const [inputs, setInputs] = useState<{ id: number; value: string }[]>([
        { id: 1, value: '' }
    ]);
    const [results, setResults] = useState<FoodItem[] | null>(null);
    const [showAnalysis, setShowAnalysis] = useState(false);

    // Personalized Nutrition State
    const [children, setChildren] = useState<any[]>([]);
    const [selectedChildId, setSelectedChildId] = useState<string>('');
    const [childStats, setChildStats] = useState<{ weight: number; height: number; age: number; gender: string } | null>(null);
    const [activityLevel, setActivityLevel] = useState<number>(1.375); // Default Lightly Active

    // Calculated Needs
    const [dailyNeeds, setDailyNeeds] = useState(AKG_FALLBACK);

    // Remote Data State
    const [dbData, setDbData] = useState<Record<string, { cal: number; prot: number; carb: number; fat: number }>>({});

    const [user, setUser] = useState<any>(null);

    // === FETCH CHILDREN ON MOUNT ===
    React.useEffect(() => {
        const fetchChildren = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            if (user) {
                const { data } = await supabase
                    .from('children')
                    .select('*')
                    .eq('user_id', user.id);
                if (data) setChildren(data);
            }
        };
        fetchChildren();
    }, []);

    // === FETCH CHILD STATS ON SELECT ===
    React.useEffect(() => {
        const fetchChildStats = async () => {
            if (!selectedChildId) {
                setChildStats(null);
                setDailyNeeds(AKG_FALLBACK);
                return;
            }

            const child = children.find(c => c.id === selectedChildId);
            if (!child) return;

            // Get latest growth record
            const { data: records } = await supabase
                .from('growth_records')
                .select('*')
                .eq('child_id', selectedChildId)
                .order('recorded_date', { ascending: false })
                .limit(1);

            let weight = child.birth_weight || 0;
            let height = child.birth_height || 0;

            // Use latest record if available, otherwise birth data (fallback)
            if (records && records.length > 0) {
                weight = Number(records[0].weight);
                height = Number(records[0].height);
            }

            const age = differenceInYears(new Date(), new Date(child.date_of_birth));

            setChildStats({
                weight,
                height,
                age,
                gender: child.gender
            });
        };
        fetchChildStats();
    }, [selectedChildId, children]);

    // === RECALCULATE NEEDS WHEN STATS/ACTIVITY CHANGE ===
    React.useEffect(() => {
        if (childStats && childStats.weight > 0 && childStats.height > 0) {
            // Mifflin-St Jeor Formula
            // Men: 10W + 6.25H - 5A + 5
            // Women: 10W + 6.25H - 5A - 161

            const isMale = childStats.gender === 'male' || childStats.gender === 'Laki-laki';
            let bmr = (10 * childStats.weight) + (6.25 * childStats.height) - (5 * childStats.age);
            bmr += isMale ? 5 : -161;

            // Hospital Shortcut Check (if height < 150/160 depending on gender... simplified logic as requested)
            // But let's stick to Mifflin as primary requested by user detailed explanation.

            const tee = Math.round(bmr * activityLevel);

            // Macros (Indonesian Ministry of Health Recommendation)
            // Carb 50-65% (avg 60%), Prot 10-20% (avg 15%), Fat 20-30% (avg 25%)
            const carb = Math.round((tee * 0.60) / 4);
            const prot = Math.round((tee * 0.15) / 4);
            const fat = Math.round((tee * 0.25) / 9);

            setDailyNeeds({
                cal: tee,
                prot: prot,
                carb: carb,
                fat: fat
            });
        }
    }, [childStats, activityLevel]);

    // === FETCH DATA ON MOUNT ===
    React.useEffect(() => {
        const fetchFoodData = async () => {
            console.log("Fetching food data...");
            const results = await Promise.all([
                supabase.from('makanan').select('*'), // User requested 'makanan' table
                supabase.from('recommended_menus').select('*')
            ]);

            const [pokok, recommended] = results;
            const mapped: Record<string, { cal: number; prot: number; carb: number; fat: number }> = {};

            // Helper to extract values regardless of column naming conventions
            const extractNutrients = (item: any) => ({
                cal: Number(item['Kalori(Kkal)'] || item.kalori || item['kalori(kkal)'] || item.calories || 0),
                prot: Number(item['Protein(g)'] || item.protein || item['protein(g)'] || 0),
                carb: Number(item['Karbo(g)'] || item.karbo || item.karbohidrat || item['karbonhidrat(g)'] || item.carbs || 0),
                fat: Number(item['Lemak(g)'] || item.lemak || item['lemak(g)'] || item.fats || 0)
            });

            // Process Makanan (Main Table)
            if (pokok.data && pokok.data.length > 0) {
                // console.log("Raw 'makanan' data sample:", JSON.stringify(pokok.data[0])); // DEBUG
                // console.log("Makanan Table Columns:", Object.keys(pokok.data[0]));       // DEBUG: View keys

                pokok.data.forEach((item: any) => {
                    // Try multiple name fields including the one found in logs: Menu_Makanan
                    const rawName = item.Menu_Makanan || item.nama || item.nama_makanan || item.name || '';
                    const key = rawName.trim().toLowerCase(); // Normalize DB side too

                    if (key) {
                        mapped[key] = extractNutrients(item);
                    }
                });
            } else if (pokok.error) {
                console.error("Error fetching 'makanan':", pokok.error);
            }

            // Process Recommended Menus (Merge)
            if (recommended.data) {
                recommended.data.forEach((item: any) => {
                    const key = (item.makanan || item.name || '').toLowerCase();
                    if (key && !mapped[key]) {
                        mapped[key] = {
                            cal: Number(item.kalori_kkal || item.kalori) || 0,
                            prot: Number(item.protein_g || item.protein) || 0,
                            carb: Number(item.karbonhidrat_g || item.karbonhidrat) || 0,
                            fat: Number(item.lemak_g || item.lemak) || 0
                        };
                    }
                });
            }

            setDbData(mapped);
        };
        fetchFoodData();
    }, []);

    // === HANDLERS ===
    const addInput = () => {
        setInputs([...inputs, { id: Date.now(), value: '' }]);
    };

    const removeInput = (id: number) => {
        if (inputs.length > 1) {
            setInputs(inputs.filter(input => input.id !== id));
        }
    };

    const handleInputChange = (id: number, newValue: string) => {
        const updated = inputs.map(item =>
            item.id === id ? { ...item, value: newValue } : item
        );
        setInputs(updated);
    };

    const calculateNutrition = () => {
        const aggregated: Record<string, FoodItem> = {};

        inputs.forEach(input => {
            const cleanName = input.value.trim().toLowerCase().replace(/\s+/g, ' '); // Normalize spaces
            if (!cleanName) return;

            // Simple match logic (exact match first, then partial)
            let matchedKey = Object.keys(dbData).find(k => k === cleanName);

            // If no exact match, try to find a key that contains the input or vice versa
            if (!matchedKey) {
                matchedKey = Object.keys(dbData).find(k => k.includes(cleanName) || cleanName.includes(k));
            }

            if (matchedKey) {
                const data = dbData[matchedKey];
                // Use the matched key for aggregation grouping
                const groupName = matchedKey;

                if (aggregated[groupName]) {
                    aggregated[groupName].count += 1;
                    aggregated[groupName].cal += data.cal;
                    aggregated[groupName].prot += data.prot;
                    aggregated[groupName].carb += data.carb;
                    aggregated[groupName].fat += data.fat;
                } else {
                    aggregated[groupName] = {
                        name: matchedKey, // Use database name for consistency
                        cal: data.cal,
                        prot: data.prot,
                        carb: data.carb,
                        fat: data.fat,
                        count: 1
                    };
                }
            } else {
                // Handle unknown food
                if (aggregated[cleanName]) {
                    aggregated[cleanName].count += 1;
                } else {
                    aggregated[cleanName] = {
                        name: input.value + " (?)", // Mark as unknown
                        cal: 0, prot: 0, carb: 0, fat: 0, count: 1
                    };
                }
            }
        });

        setResults(Object.values(aggregated));
        setShowAnalysis(true);
    };

    // === UI SUB-COMPONENTS ===
    const getTotal = () => {
        if (!results) return null;
        return results.reduce((acc, curr) => ({
            cal: acc.cal + curr.cal,
            prot: acc.prot + curr.prot,
            carb: acc.carb + curr.carb,
            fat: acc.fat + curr.fat,
        }), { cal: 0, prot: 0, carb: 0, fat: 0 });
    };

    const total = getTotal();

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <main className="flex-grow container mx-auto px-5 py-12">
                <div className="max-w-4xl mx-auto">

                    {/* Header with Personalization */}
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
                        <div className="flex-1">
                            <h1 className="text-3xl md:text-4xl font-bold text-[var(--primary-color)] mb-3">Cek Nutrisi Harian</h1>
                            <p className="text-gray-600">
                                Hitung asupan gizi harian berdasarkan kebutuhan unik Si Kecil.
                            </p>
                        </div>

                        {/* Personalization Controls - Only for Logged In Users */}
                        {user && (
                            <div className="bg-white p-3 rounded-2xl w-full lg:w-auto flex flex-col lg:flex-row gap-4">
                                <div className="min-w-[200px] h-100">
                                    <ChildSelector
                                        childrenData={children}
                                        selectedId={selectedChildId}
                                        onSelect={setSelectedChildId}
                                        label="Pilih Si Kecil"
                                    />
                                </div>

                                {/* Activity Dropdown Removed */}
                            </div>
                        )}
                    </div>

                    {/* Active Profile Summary Removed */}

                    {/* Input Section */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-10">
                        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            Input Makanan
                            <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Ketik nama makanan (cth: Bubur Nasi, Pisang)</span>
                        </h3>

                        <div className="space-y-4">
                            {inputs.map((input, index) => (
                                <div key={input.id} className="flex gap-3 group">
                                    <span className="py-3 text-gray-400 font-mono w-6 text-right pt-3.5 select-none">{index + 1}.</span>
                                    <input
                                        type="text"
                                        className="flex-grow p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent outline-none transition-all"
                                        placeholder="Nama makanan..."
                                        value={input.value}
                                        onChange={(e) => handleInputChange(input.id, e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && addInput()}
                                    />
                                    {inputs.length > 1 && (
                                        <button
                                            onClick={() => removeInput(input.id)}
                                            className="px-4 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                            title="Hapus baris"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-gray-100">
                            <button
                                onClick={addInput}
                                className="flex-1 py-3 px-6 border-2 border-dashed border-gray-300 text-gray-500 font-semibold rounded-xl hover:border-[var(--primary-color)] hover:text-[var(--primary-color)] hover:bg-teal-50 transition-all flex items-center justify-center gap-2"
                            >
                                Tambah Makanan
                            </button>
                            <button
                                onClick={calculateNutrition}
                                className="flex-1 py-3 px-6 bg-[var(--primary-color)] text-white font-bold rounded-xl hover:bg-teal-700 hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
                            >
                                Hitung Nutrisi
                            </button>
                        </div>
                    </div>

                    {/* Results Section */}
                    {showAnalysis && results && total && (
                        <div className="space-y-8 animate-fade-in-up">

                            {/* Table */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-6 border-b border-gray-100">
                                    <h3 className="text-xl font-bold text-gray-800">Hasil Perhitungan</h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                                                <th className="p-4 font-semibold">Menu Makanan</th>
                                                <th className="p-4 font-semibold text-center">Kalori (kkal)</th>
                                                <th className="p-4 font-semibold text-center">Protein (g)</th>
                                                <th className="p-4 font-semibold text-center">Karbo (g)</th>
                                                <th className="p-4 font-semibold text-center">Lemak (g)</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {results.map((item, idx) => (
                                                <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="p-4">
                                                        <div className="font-medium text-gray-800 capitalize">{item.name}</div>
                                                        {item.count > 1 && <div className="text-xs text-[var(--primary-color)] font-semibold">{item.count}x porsi disatukan</div>}
                                                        {item.cal === 0 && <span className="text-xs text-red-400 italic">Data tidak ditemukan</span>}
                                                    </td>
                                                    <td className="p-4 text-center font-mono text-gray-700">{Math.round(item.cal)}</td>
                                                    <td className="p-4 text-center font-mono text-gray-600">{item.prot.toFixed(1)}</td>
                                                    <td className="p-4 text-center font-mono text-gray-600">{item.carb.toFixed(1)}</td>
                                                    <td className="p-4 text-center font-mono text-gray-600">{item.fat.toFixed(1)}</td>
                                                </tr>
                                            ))}
                                            {/* Summary Row */}
                                            <tr className="bg-teal-50/50 font-bold text-gray-900 border-t-2 border-teal-100">
                                                <td className="p-4 text-[var(--primary-color)]">TOTAL</td>
                                                <td className="p-4 text-center text-lg">{Math.round(total.cal)}</td>
                                                <td className="p-4 text-center">{total.prot.toFixed(1)}</td>
                                                <td className="p-4 text-center">{total.carb.toFixed(1)}</td>
                                                <td className="p-4 text-center">{total.fat.toFixed(1)}</td>
                                            </tr>
                                            {/* AKG % Row */}
                                            <tr className="bg-teal-50/30 text-xs text-gray-500">
                                                <td className="p-4 italic">% Kebutuhan Harian</td>
                                                <td className="p-4 text-center">{Math.round((total.cal / dailyNeeds.cal) * 100)}%</td>
                                                <td className="p-4 text-center">{Math.round((total.prot / dailyNeeds.prot) * 100)}%</td>
                                                <td className="p-4 text-center">{Math.round((total.carb / dailyNeeds.carb) * 100)}%</td>
                                                <td className="p-4 text-center">{Math.round((total.fat / dailyNeeds.fat) * 100)}%</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Analysis & Suggestions */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                {/* Status Box */}
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        Analisis Nutrisi
                                    </h4>
                                    <ul className="space-y-3">
                                        {/* Calorie Check */}
                                        {/* Calorie Check */}
                                        <li className="flex gap-3 text-sm items-start">
                                            <div>
                                                <span className="font-semibold block">Kalori: {Math.round((total.cal / dailyNeeds.cal) * 100)}% dari kebutuhan ({dailyNeeds.cal} kcal)</span>
                                                <span className="text-gray-500">
                                                    {total.cal > dailyNeeds.cal
                                                        ? "Asupan kalori berlebih hari ini."
                                                        : "Asupan kalori aman."}
                                                </span>
                                            </div>
                                        </li>
                                        {/* Protein Check */}
                                        <li className="flex gap-3 text-sm items-start">
                                            <div>
                                                <span className="font-semibold block">Protein: {Math.round((total.prot / dailyNeeds.prot) * 100)}% terpenuhi ({dailyNeeds.prot}g)</span>
                                                <span className="text-gray-500">
                                                    {total.prot < dailyNeeds.prot * 0.8
                                                        ? "Protein masih kurang for pertumbuhan."
                                                        : "Asupan protein cukup."}
                                                </span>
                                            </div>
                                        </li>
                                    </ul>
                                </div>

                                {/* Suggestions Box */}
                                <div className="bg-[var(--secondary-color)]/5 border border-rose-100 p-6 rounded-2xl">
                                    <h4 className="font-bold text-rose-700 mb-4 flex items-center gap-2">
                                        Rekomendasi Gizi
                                    </h4>
                                    <div className="text-gray-700 text-sm space-y-3">
                                        {total.cal > dailyNeeds.cal && (
                                            <p>• <strong>Kurangi Porsi:</strong> Terdeteksi kelebihan kalori.</p>
                                        )}
                                        {total.fat > dailyNeeds.fat && (
                                            <p>• <strong>Lemak Tinggi:</strong> Kurangi makanan yang digoreng.</p>
                                        )}
                                        {total.prot < dailyNeeds.prot / 2 && (
                                            <p>• <strong>Tambah Lauk Pauk:</strong> Tambahkan telur, tempe, atau ikan.</p>
                                        )}
                                        {(total.cal <= dailyNeeds.cal && total.fat <= dailyNeeds.fat && total.prot >= dailyNeeds.prot)
                                            ? <p className="text-green-700 font-medium">Pola makan seimbang!</p>
                                            : <p>• Perbanyak sayuran serat tinggi.</p>
                                        }
                                    </div>
                                </div>

                            </div>
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
}
