'use client';

import React, { useState } from 'react';
import Navbar from '../../components/Navbar'; // Pastikan path import sesuai struktur folder Anda
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();

  // State untuk menyimpan data inputan form
  const [profileData, setProfileData] = useState({
    parentName: 'Bunda Ani', // Default value simulasi user login
    parentEmail: 'ani@example.com',
    childName: '',
    childDob: '',
    childGender: 'Laki-laki',
    childBirthWeight: '',
    childBirthHeight: ''
  });

  // Handler untuk mengubah nilai form saat diketik
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handler saat tombol Simpan diklik
  const handleSaveAndContinue = (e: React.FormEvent) => {
    e.preventDefault(); // Mencegah refresh halaman
    
    // Disini Anda bisa menambahkan logika simpan ke database/API nantinya
    console.log('Data Profil Disimpan:', profileData);
    
    // Redirect ke halaman Cek Stunting
    router.push('/cek-sikecil');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Navbar />
      
      <main className="container mx-auto px-4 py-10 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Lengkapi Profil</h1>
        <p className="text-gray-500 mb-8 text-center">
          Data yang akurat membantu analisis tumbuh kembang si Kecil lebih tepat.
        </p>

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
                  className="px-6 py-3 rounded-lg bg-[var(--primary-color)] text-white font-bold hover:bg-teal-600 transition shadow-md"
                >
                    Simpan & Lanjut ke Cek Stunting
                </button>
            </div>

        </form>
      </main>
    </div>
  );
}