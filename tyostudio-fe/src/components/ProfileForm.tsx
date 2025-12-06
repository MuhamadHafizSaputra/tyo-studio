'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

interface ProfileFormProps {
  user: any;
  initialParentName: string;
  initialChildren: any[];
}

export default function ProfileForm({ user, initialParentName, initialChildren }: ProfileFormProps) {
  const router = useRouter();

  // Use the first child or empty defaults
  const firstChild = initialChildren?.[0] || {};

  const [profileData, setProfileData] = useState({
    parentName: initialParentName || '',
    parentEmail: user?.email || '',
    childName: firstChild.name || '',
    childDob: firstChild.date_of_birth || '',
    childGender: firstChild.gender || 'Laki-laki',
    childBirthWeight: firstChild.birth_weight || '',
    childBirthHeight: firstChild.birth_height || ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveAndContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();

    // 1. Update Parent Profile
    if (profileData.parentName !== initialParentName) {
      await supabase
        .from('users')
        .update({ full_name: profileData.parentName })
        .eq('id', user.id);
    }

    // 2. Upsert Child (Simpler: just insert if new, update if exists logic could be added)
    // For now, if we have an ID for the first child, update it. Else insert.
    const childId = firstChild.id;

    const childPayload = {
      user_id: user.id,
      name: profileData.childName,
      date_of_birth: profileData.childDob,
      gender: profileData.childGender,
      birth_weight: profileData.childBirthWeight ? parseFloat(profileData.childBirthWeight) : null,
      birth_height: profileData.childBirthHeight ? parseFloat(profileData.childBirthHeight) : null,
    };

    let error;

    if (childId) {
      const { error: updateError } = await supabase
        .from('children')
        .update(childPayload)
        .eq('id', childId);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from('children')
        .insert([childPayload]);
      error = insertError;
    }

    if (error) {
      alert('Gagal menyimpan data: ' + error.message);
      setLoading(false);
    } else {
      router.push('/cek-sikecil');
      router.refresh();
    }
  };

  return (
    <form
      onSubmit={handleSaveAndContinue}
      className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 w-full max-w-2xl"
    >

      {/* --- Bagian 1: Data Orang Tua --- */}
      <div className="mb-8 border-b border-gray-100 pb-6">
        <h2 className="text-lg font-bold text-[var(--primary-color)] mb-4 flex items-center gap-2">
          👤 Data Orang Tua
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">Nama Lengkap</label>
            <input
              type="text"
              name="parentName"
              value={profileData.parentName}
              onChange={handleChange}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] transition"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">Email</label>
            <input
              type="email"
              name="parentEmail"
              value={profileData.parentEmail}
              disabled
              className="w-full p-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-400 cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* --- Bagian 2: Data Anak --- */}
      <div>
        <h2 className="text-lg font-bold text-[var(--primary-color)] mb-4 flex items-center gap-2">
          👶 Data Si Kecil
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">Nama Anak</label>
            <input
              type="text"
              name="childName"
              placeholder="Contoh: Budi Santoso"
              value={profileData.childName}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] outline-none transition"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">Tanggal Lahir</label>
              <input
                type="date"
                name="childDob"
                value={profileData.childDob}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] outline-none transition"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">Jenis Kelamin</label>
              <select
                name="childGender"
                value={profileData.childGender}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] outline-none transition bg-white"
              >
                <option value="Laki-laki">Laki-laki</option>
                <option value="male">Laki-laki (Alt)</option>
                <option value="female">Perempuan (Alt)</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">Berat Lahir (kg)</label>
              <input
                type="number"
                name="childBirthWeight"
                placeholder="3.2"
                step="0.1"
                value={profileData.childBirthWeight}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">Tinggi Lahir (cm)</label>
              <input
                type="number"
                name="childBirthHeight"
                placeholder="49"
                value={profileData.childBirthHeight}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] outline-none transition"
              />
            </div>
          </div>
        </div>
      </div>

      {/* --- Tombol Aksi --- */}
      <div className="mt-8 flex flex-col-reverse md:flex-row justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()} // Kembali ke halaman sebelumnya
          className="px-6 py-3 rounded-lg text-gray-500 font-bold hover:bg-gray-100 transition"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 rounded-lg bg-[var(--primary-color)] text-white font-bold hover:bg-teal-600 transition shadow-md disabled:opacity-50"
        >
          {loading ? 'Menyimpan...' : 'Simpan & Lanjut ke Cek Stunting'}
        </button>
      </div>

    </form>
  );
}
