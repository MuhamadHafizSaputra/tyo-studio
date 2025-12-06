"use client";

import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

// === MOCK DATABASE ===
// Simplified database for demo purposes (per 100g or per serving)
const NUTRITION_DB: Record<string, { cal: number; prot: number; carb: number; fat: number }> = {
    // Karbohidrat Utama
    "nasi putih": { cal: 129, prot: 2.7, carb: 28, fat: 0.3 },
    "nasi merah": { cal: 110, prot: 2.8, carb: 23, fat: 0.9 },
    "roti tawar": { cal: 264, prot: 9, carb: 49, fat: 3 },
    "mie instan": { cal: 380, prot: 8, carb: 54, fat: 14 },
    "kentang rebus": { cal: 87, prot: 1.9, carb: 20, fat: 0.1 },
    "bubur ayam": { cal: 155, prot: 6, carb: 18, fat: 5 },

    // Protein Hewani
    "ayam goreng": { cal: 260, prot: 22, carb: 0, fat: 18 },
    "ayam bakar": { cal: 167, prot: 24, carb: 0, fat: 7 },
    "telur rebus": { cal: 155, prot: 13, carb: 1.1, fat: 11 },
    "telur dadar": { cal: 196, prot: 14, carb: 1.2, fat: 15 },
    "ikan goreng": { cal: 200, prot: 18, carb: 0, fat: 12 },
    "daging sapi": { cal: 250, prot: 26, carb: 0, fat: 15 },
    "bakso": { cal: 202, prot: 11, carb: 7, fat: 14 },

    // Sayuran
    "sayur bayam": { cal: 23, prot: 2.9, carb: 3.6, fat: 0.4 },
    "tumis kangkung": { cal: 90, prot: 3, carb: 4, fat: 6 },
    "sop wortel": { cal: 45, prot: 1.5, carb: 9, fat: 0.5 },
    "capcay": { cal: 60, prot: 3, carb: 8, fat: 3 },

    // Minuman & Lainnya
    "susu sapi": { cal: 60, prot: 3.2, carb: 4.5, fat: 3.3 },
    "teh manis": { cal: 50, prot: 0, carb: 12, fat: 0 },
    "pisang": { cal: 89, prot: 1.1, carb: 22.8, fat: 0.3 },
    "gorengan": { cal: 140, prot: 2, carb: 15, fat: 8 }, // per piece est
};

// Default AKG (Angka Kecukupan Gizi) Values for General Adult/Teen (Averaged)
const AKG_STANDARDS = {
    cal: 2150, // kcal
    prot: 60,  // gram
    carb: 300, // gram
    fat: 70    // gram
};

interface FoodItem {
    name: string;
    cal: number;
    prot: number;
    carb: number;
    fat: number;
    count: number;
}

export default function CekNutrisiPage() {
    const [inputs, setInputs] = useState<{ id: number; value: string }[]>([
        { id: 1, value: '' }
    ]);
    const [results, setResults] = useState<FoodItem[] | null>(null);
    const [showAnalysis, setShowAnalysis] = useState(false);

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
            const cleanName = input.value.trim().toLowerCase();
            if (!cleanName) return;

            // Simple match logic (exact match first, then partial)
            let matchedKey = Object.keys(NUTRITION_DB).find(k => k === cleanName);

            // If no exact match, try to find a key that contains the input or vice versa
            if (!matchedKey) {
                matchedKey = Object.keys(NUTRITION_DB).find(k => k.includes(cleanName) || cleanName.includes(k));
            }

            if (matchedKey) {
                const data = NUTRITION_DB[matchedKey];
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
            <Navbar />

            <main className="flex-grow container mx-auto px-5 py-12">
                <div className="max-w-4xl mx-auto">

                    {/* Header */}
                    <div className="text-center mb-10">
                        <h1 className="text-3xl md:text-4xl font-bold text-[var(--primary-color)] mb-3">Cek Nutrisi Harian</h1>
                        <p className="text-gray-600">
                            Masukkan menu makanan Anda hari ini untuk mengetahui total asupan gizi dan analisis kesehatannya.
                        </p>
                    </div>

                    {/* Input Section */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-10">
                        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            🍽️ Input Makanan
                            <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Ketik nama makanan (cth: Nasi Putih, Ayam Goreng)</span>
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
                                + Tambah Baris
                            </button>
                            <button
                                onClick={calculateNutrition}
                                className="flex-1 py-3 px-6 bg-[var(--primary-color)] text-white font-bold rounded-xl shadow-lg shadow-teal-200 hover:bg-teal-700 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                            >
                                🔍 Hitung Nutrisi
                            </button>
                        </div>
                    </div>

                    {/* Results Section */}
                    {showAnalysis && results && total && (
                        <div className="space-y-8 animate-fade-in-up">

                            {/* Table */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-6 border-b border-gray-100">
                                    <h3 className="text-xl font-bold text-gray-800">📊 Hasil Perhitungan</h3>
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
                                                <td className="p-4 italic">% AKG (Harian)</td>
                                                <td className="p-4 text-center">{Math.round((total.cal / AKG_STANDARDS.cal) * 100)}%</td>
                                                <td className="p-4 text-center">{Math.round((total.prot / AKG_STANDARDS.prot) * 100)}%</td>
                                                <td className="p-4 text-center">{Math.round((total.carb / AKG_STANDARDS.carb) * 100)}%</td>
                                                <td className="p-4 text-center">{Math.round((total.fat / AKG_STANDARDS.fat) * 100)}%</td>
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
                                        🩺 Analisis Singkat
                                    </h4>
                                    <ul className="space-y-3">
                                        {/* Calorie Check */}
                                        <li className="flex gap-3 text-sm items-start">
                                            <span className="text-xl mt-0.5">{total.cal > AKG_STANDARDS.cal ? '⚠️' : '✅'}</span>
                                            <div>
                                                <span className="font-semibold block">Kalori: {Math.round((total.cal / AKG_STANDARDS.cal) * 100)}% dari kebutuhan</span>
                                                <span className="text-gray-500">
                                                    {total.cal > AKG_STANDARDS.cal
                                                        ? "Asupan kalori berlebih. Pertimbangkan olahraga ringan untuk membakar ekstra kalori."
                                                        : "Asupan kalori dalam batas wajar atau kurang (jika ini total seharian)."}
                                                </span>
                                            </div>
                                        </li>
                                        {/* Protein Check */}
                                        <li className="flex gap-3 text-sm items-start">
                                            <span className="text-xl mt-0.5">{total.prot < AKG_STANDARDS.prot * 0.8 ? '🥩' : '💪'}</span>
                                            <div>
                                                <span className="font-semibold block">Protein: {Math.round((total.prot / AKG_STANDARDS.prot) * 100)}% terpenuhi</span>
                                                <span className="text-gray-500">
                                                    {total.prot < AKG_STANDARDS.prot * 0.8
                                                        ? "Protein masih kurang. Bagus untuk pertumbuhan dan perbaikan otot."
                                                        : "Asupan protein sudah cukup baik."}
                                                </span>
                                            </div>
                                        </li>
                                    </ul>
                                </div>

                                {/* Suggestions Box */}
                                <div className="bg-[var(--secondary-color)]/5 border border-rose-100 p-6 rounded-2xl">
                                    <h4 className="font-bold text-rose-700 mb-4 flex items-center gap-2">
                                        💡 Rekomendasi
                                    </h4>
                                    <div className="text-gray-700 text-sm space-y-3">
                                        {total.cal > AKG_STANDARDS.cal && (
                                            <p>• <strong>Kurangi Porsi:</strong> Terdeteksi kelebihan kalori. Coba kurangi porsi karbohidrat (nasi/mie) di makan malam.</p>
                                        )}
                                        {total.fat > AKG_STANDARDS.fat && (
                                            <p>• <strong>Lemak Tinggi:</strong> Kurangi makanan yang digoreng (deep fried). Ganti dengan metode rebus atau panggang.</p>
                                        )}
                                        {total.prot < AKG_STANDARDS.prot / 2 && (
                                            <p>• <strong>Tambah Lauk Pauk:</strong> Tambahkan telur, tempe, atau ikan untuk mengejar target protein harian.</p>
                                        )}
                                        {(total.cal <= AKG_STANDARDS.cal && total.fat <= AKG_STANDARDS.fat && total.prot >= AKG_STANDARDS.prot)
                                            ? <p className="text-green-700 font-medium">✨ Pola makan Anda sudah cukup seimbang hari ini! Pertahankan variasi menu makanan.</p>
                                            : <p>• Perbanyak sayuran serat tinggi untuk membantu pencernaan dan memberikan rasa kenyang lebih lama.</p>
                                        }
                                    </div>
                                </div>

                            </div>
                        </div>
                    )}

                </div>
            </main>
            <Footer />
        </div>
    );
}
