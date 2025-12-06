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
  const supabase = createClient();

  // Parent State
  const [parentName, setParentName] = useState(initialParentName || '');
  const [parentLoading, setParentLoading] = useState(false);

  // Children State
  const [childrenList, setChildrenList] = useState<any[]>(initialChildren || []);
  const [selectedChildId, setSelectedChildId] = useState<string | 'new'>('new'); // 'new' or UUID

  // Current Child Form State
  const emptyChildForm = {
    name: '',
    date_of_birth: '',
    gender: 'male', // Default to male (lowercase to match typical DB constraints)
    birth_weight: '',
    birth_height: ''
  };

  const [childForm, setChildForm] = useState(emptyChildForm);
  const [childLoading, setChildLoading] = useState(false);

  // --- Handlers: Parent ---
  const handleSaveParent = async (e: React.FormEvent) => {
    e.preventDefault();
    setParentLoading(true);

    const { error } = await supabase
      .from('users')
      .update({ full_name: parentName })
      .eq('id', user.id);

    if (error) alert('Gagal update profil bunda: ' + error.message);
    else alert('Profil Bunda berhasil disimpan!');

    setParentLoading(false);
  };

  // --- Handlers: Children Selection ---
  const handleSelectChild = (id: string | 'new') => {
    setSelectedChildId(id);
    if (id === 'new') {
      setChildForm(emptyChildForm);
    } else {
      const child = childrenList.find(c => c.id === id);
      if (child) {
        setChildForm({
          name: child.name,
          date_of_birth: child.date_of_birth,
          gender: child.gender, // Assuming DB has 'male'/'female'
          birth_weight: child.birth_weight || '',
          birth_height: child.birth_height || ''
        });
      }
    }
  };

  const handleChildChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setChildForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveChild = async (e: React.FormEvent) => {
    e.preventDefault();
    setChildLoading(true);

    const payload = {
      user_id: user.id,
      name: childForm.name,
      date_of_birth: childForm.date_of_birth,
      gender: childForm.gender,
      birth_weight: childForm.birth_weight ? parseFloat(childForm.birth_weight) : null,
      birth_height: childForm.birth_height ? parseFloat(childForm.birth_height) : null,
    };

    let error = null;

    if (selectedChildId === 'new') {
      // Insert
      const { data, error: err } = await supabase.from('children').insert([payload]).select();
      error = err;
      if (data) {
        setChildrenList([...childrenList, data[0]]);
        setSelectedChildId(data[0].id); // Switch to editing the new child
        alert('Data anak berhasil ditambahkan!');
      }
    } else {
      // Update
      const { error: err } = await supabase.from('children').update(payload).eq('id', selectedChildId);
      error = err;
      if (!error) {
        setChildrenList(childrenList.map(c => c.id === selectedChildId ? { ...c, ...payload, id: selectedChildId } : c));
        alert('Data anak berhasil diperbarui!');
      }
    }

    if (error) alert('Error: ' + error.message);
    setChildLoading(false);
    router.refresh();
  };

  return (
    <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

      {/* LEFT COL: Parent & Child List */}
      <div className="space-y-6">

        {/* Parent Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-[var(--primary-color)] mb-4">👤 Profil Bunda/Ayah</h2>
          <form onSubmit={handleSaveParent} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nama Lengkap</label>
              <input
                type="text"
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-[var(--primary-color)]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
              <input type="email" value={user.email} disabled className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-400" />
            </div>
            <button type="submit" disabled={parentLoading} className="w-full py-2 bg-[var(--primary-color)] text-white text-sm font-bold rounded-lg hover:bg-teal-600 transition">
              {parentLoading ? 'Menyimpan...' : 'Simpan Profil Bunda'}
            </button>
          </form>
        </div>

        {/* Child List Selector */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-[var(--primary-color)]">👶 Daftar Anak</h2>
            <button
              onClick={() => handleSelectChild('new')}
              className="text-xs bg-teal-50 text-[var(--primary-color)] px-3 py-1 rounded-full font-bold hover:bg-teal-100 transition"
            >
              + Tambah
            </button>
          </div>

          <div className="space-y-2">
            {childrenList.map(child => (
              <button
                key={child.id}
                onClick={() => handleSelectChild(child.id)}
                className={`w-full text-left p-3 rounded-xl border transition flex items-center gap-3 ${selectedChildId === child.id ? 'border-[var(--primary-color)] bg-teal-50 ring-1 ring-[var(--primary-color)]' : 'border-gray-100 hover:border-gray-300'}`}
              >
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-sm shadow-sm">
                  {(child.gender === 'male' || child.gender === 'Laki-laki') ? '👦' : '👧'}
                  {/* Careful with older data possibly being 'Laki-laki' */}
                </div>
                <div>
                  <p className="font-bold text-sm text-gray-800">{child.name}</p>
                  <p className="text-xs text-gray-500">{new Date(child.date_of_birth).getFullYear()} •
                    {(child.gender === 'male' || child.gender === 'Laki-laki') ? ' Laki-laki' : ' Perempuan'}
                  </p>
                </div>
              </button>
            ))}

            {childrenList.length === 0 && (
              <p className="text-sm text-gray-400 italic text-center py-4">Belum ada data anak.</p>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT COL: Child Form */}
      <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            {selectedChildId === 'new' ? '📝 Tambah Data Anak Baru' : `✏️ Edit Data: ${childForm.name}`}
          </h2>
          {selectedChildId !== 'new' && <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">Mode Edit</span>}
        </div>

        <form onSubmit={handleSaveChild} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">Nama Anak</label>
            <input
              type="text"
              name="name"
              value={childForm.name}
              onChange={handleChildChange}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] outline-none"
              placeholder="Nama Lengkap Anak"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">Tanggal Lahir</label>
              <input
                type="date"
                name="date_of_birth"
                value={childForm.date_of_birth}
                onChange={handleChildChange}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">Jenis Kelamin</label>
              <div className="flex gap-3">
                <label className={`flex-1 p-3 rounded-lg border cursor-pointer text-center text-sm font-medium transition ${childForm.gender === 'male' ? 'border-[var(--primary-color)] bg-teal-50 text-[var(--primary-color)]' : 'border-gray-200 text-gray-500'}`}>
                  <input type="radio" name="gender" value="male" className="hidden" onClick={() => setChildForm({ ...childForm, gender: 'male' })} />
                  👦 Laki-laki
                </label>
                <label className={`flex-1 p-3 rounded-lg border cursor-pointer text-center text-sm font-medium transition ${childForm.gender === 'female' ? 'border-pink-400 bg-pink-50 text-pink-500' : 'border-gray-200 text-gray-500'}`}>
                  <input type="radio" name="gender" value="female" className="hidden" onClick={() => setChildForm({ ...childForm, gender: 'female' })} />
                  👧 Perempuan
                </label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">Berat Lahir (kg)</label>
              <input
                type="number"
                name="birth_weight"
                step="0.1"
                value={childForm.birth_weight}
                onChange={handleChildChange}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] outline-none"
                placeholder="3.0"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">Tinggi Lahir (cm)</label>
              <input
                type="number"
                name="birth_height"
                step="0.1"
                value={childForm.birth_height}
                onChange={handleChildChange}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] outline-none"
                placeholder="50"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            {selectedChildId !== 'new' && (
              <button
                type="button"
                onClick={() => handleSelectChild('new')}
                className="px-6 py-3 rounded-lg text-gray-500 hover:bg-gray-100 transition font-bold"
              >
                Batal
              </button>
            )}
            <button
              type="submit"
              disabled={childLoading}
              className="px-8 py-3 rounded-lg bg-[var(--primary-color)] text-white font-bold hover:bg-teal-600 transition shadow-md disabled:opacity-50"
            >
              {childLoading ? 'Menyimpan...' : (selectedChildId === 'new' ? 'Tambah Data Anak' : 'Simpan Perubahan')}
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}
