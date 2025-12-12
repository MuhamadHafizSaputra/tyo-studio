'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';
import { differenceInMonths, addMonths, format } from 'date-fns';
import { X, Calendar, Ruler, Weight, Save, ListFilter } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface AddGrowthRecordModalProps {
    isOpen: boolean;
    onClose: () => void;
    childId: string;
    childDob: string;
    childName: string;
}

export default function AddGrowthRecordModal({ isOpen, onClose, childId, childDob, childName }: AddGrowthRecordModalProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Default to current month/year
    const today = new Date();
    const currentMonthStr = format(today, 'yyyy-MM');

    const [formData, setFormData] = useState({
        recordMonth: currentMonthStr, // Format YYYY-MM
        height: '',
        weight: '',
    });
    const [selectedAgeIndex, setSelectedAgeIndex] = useState<number>(0);

    // Initial Sync: Calculate age based on default Date
    useEffect(() => {
        if (childDob && formData.recordMonth && isOpen) {
            syncDateToAge(formData.recordMonth);
        }
    }, [isOpen]);

    // Helper: Sync Date Input -> Age Index
    const syncDateToAge = (dateStr: string) => {
        if (!childDob) return;
        const birth = new Date(childDob);
        // We assume record is taken at the same day of month as birthday, or 1st?
        // Let's use the 1st of the selected month for calculation stability
        const selectedDate = new Date(dateStr + '-01');

        // Accurate month diff requires roughly comparable days, but for "MonthPicker" usually we mean the calendar month difference
        // Let's try to be smart. If child born in Jan 2024. User picks Feb 2024. That is 1 month old.
        // differenceInMonths(Feb 1, Jan 10) might be 0 if not full month.
        // So let's align dates to the 15th to avoid edge cases
        const b = new Date(birth.getFullYear(), birth.getMonth(), 15);
        const t = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 15);

        const months = differenceInMonths(t, b);
        setSelectedAgeIndex(Math.max(0, months));
    };

    // Helper: Sync Age Index -> Date Input
    const syncAgeToDate = (ageIdx: number) => {
        if (!childDob) return;
        const birth = new Date(childDob);
        const targetDate = addMonths(birth, ageIdx);
        // Format to YYYY-MM for input
        const yyyy = targetDate.getFullYear();
        const mm = String(targetDate.getMonth() + 1).padStart(2, '0');
        setFormData(prev => ({ ...prev, recordMonth: `${yyyy}-${mm}` }));
        setSelectedAgeIndex(ageIdx);
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setFormData(prev => ({ ...prev, recordMonth: val }));
        syncDateToAge(val);
    };

    const handleAgeSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = parseInt(e.target.value);
        setSelectedAgeIndex(val);
        syncAgeToDate(val);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!childId || !formData.recordMonth || !formData.height || !formData.weight) {
            toast.error('Mohon lengkapi semua data');
            return;
        }

        setLoading(true);
        const supabase = createClient();

        // Calculate precise recorded_date for DB
        // Ideally we use the exact date corresponding to the Age Month if possible, or just the 1st of that month?
        // If users select "Month 1", for a child born Jan 5th, we ideally save Feb 5th.
        const birth = new Date(childDob);
        const targetDate = addMonths(birth, selectedAgeIndex); // This adds exact months to the birth date

        // Ensure we don't save future dates?
        if (targetDate > new Date()) {
            // If calculated date is in future (e.g. today is 1st, birth is 20th, Month X is 20th), maybe clamp to today?
            // Or just let it be, user might strictly mean that "month".
            // Let's warn or just clamp.
        }

        const { error } = await supabase.from('growth_records').insert([
            {
                child_id: childId,
                recorded_date: targetDate.toISOString(),
                age_in_months: selectedAgeIndex,
                height: parseFloat(formData.height),
                weight: parseFloat(formData.weight)
            }
        ]);

        if (error) {
            console.error(error);
            toast.error('Gagal menyimpan data: ' + error.message);
        } else {
            toast.success('Data berhasil disimpan!');
            router.refresh();
            onClose();
            // Reset but keep some context?
            setFormData(prev => ({ ...prev, height: '', weight: '' }));
        }
        setLoading(false);
    };

    if (!isOpen) return null;

    // Generate Age Options (0 - 60 months)
    const ageOptions = Array.from({ length: 61 }, (_, i) => i);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-up">

                {/* Header */}
                <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-b border-gray-100">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">Catat Pertumbuhan</h3>
                        <p className="text-xs text-gray-500">
                            Untuk: <span className="font-semibold text-[var(--primary-color)]">{childName}</span>
                            <span className="mx-1">•</span>
                            Lahir: {new Date(childDob).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full text-gray-500 transition">
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">

                    {/* INPUT USIA / BULAN (DUAL MODE) */}
                    <div className="bg-teal-50/50 p-4 rounded-xl border border-teal-100 space-y-4">

                        {/* Option A: Dropdown Age Index */}
                        <div>
                            <label className="flex items-center gap-2 text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">
                                <ListFilter size={14} /> Pilih Usia (Bulan ke-)
                            </label>
                            <div className="relative">
                                <select
                                    value={selectedAgeIndex}
                                    onChange={handleAgeSelectChange}
                                    className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--primary-color)] outline-none appearance-none cursor-pointer"
                                // Removed size attribute from select as it is invalid
                                >
                                    {ageOptions.map((age) => (
                                        <option key={age} value={age}>
                                            {age === 0 ? 'Lahir (Bulan ke-0)' : `Bulan ke-${age}`}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute right-3 top-3.5 pointer-events-none text-gray-400 text-xs">▼</div>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="flex items-center gap-3">
                            <div className="h-[1px] bg-teal-200 flex-1"></div>
                            <span className="text-[10px] font-bold text-teal-500 uppercase">ATAU TANGGAL</span>
                            <div className="h-[1px] bg-teal-200 flex-1"></div>
                        </div>

                        {/* Option B: Date Picker (Month Only) */}
                        <div>
                            <label className="flex items-center gap-2 text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">
                                <Calendar size={14} /> Pilih Bulan & Tahun
                            </label>
                            <input
                                type="month"
                                value={formData.recordMonth}
                                onChange={handleDateChange}
                                max={currentMonthStr}
                                className="w-full pl-4 p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--primary-color)] outline-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Height */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Tinggi (cm)</label>
                            <div className="relative">
                                <span className="absolute left-3 top-3 text-gray-400"><Ruler size={18} /></span>
                                <input
                                    type="number"
                                    step="0.1"
                                    placeholder="Ex: 75.5"
                                    value={formData.height}
                                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                                    className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--primary-color)] outline-none"
                                />
                            </div>
                        </div>

                        {/* Weight */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Berat (kg)</label>
                            <div className="relative">
                                <span className="absolute left-3 top-3 text-gray-400"><Weight size={18} /></span>
                                <input
                                    type="number"
                                    step="0.1"
                                    placeholder="Ex: 10.2"
                                    value={formData.weight}
                                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                                    className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--primary-color)] outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-[var(--primary-color)] text-white font-bold rounded-xl shadow-lg shadow-teal-200 hover:bg-teal-700 hover:scale-[1.02] transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:scale-100"
                        >
                            {loading ? 'Menyimpan...' : <><Save size={20} /> Simpan Data</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
