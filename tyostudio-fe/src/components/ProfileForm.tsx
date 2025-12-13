'use client';

import React, { useState } from 'react';
import { Trash2, Baby, X, User, MapPin, Save, Plus, Edit2, ChevronRight, Camera } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';

interface ProfileFormProps {
  user: any;
  initialParentName: string;
  initialLocation: string;
  initialChildren: any[];
}

export default function ProfileForm({ user, initialParentName, initialLocation, initialChildren }: ProfileFormProps) {
  const router = useRouter();
  const supabase = createClient();

  // Guard Clause
  if (!user) return null;

  // --- STATE ---
  const [parentName, setParentName] = useState(initialParentName || '');
  const [location, setLocation] = useState(initialLocation || 'Perkotaan');
  const [parentLoading, setParentLoading] = useState(false);

  const [childrenList, setChildrenList] = useState<any[]>(initialChildren || []);
  const [selectedChildId, setSelectedChildId] = useState<string | 'new'>('new');
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [childToDelete, setChildToDelete] = useState<{ id: string, name: string } | null>(null);

  const emptyChildForm = { name: '', date_of_birth: '', gender: 'male', birth_weight: '', birth_height: '' };
  const [childForm, setChildForm] = useState(emptyChildForm);
  const [childLoading, setChildLoading] = useState(false);

  // --- HANDLERS ---
  const handleSaveParent = async (e: React.FormEvent) => {
    e.preventDefault();
    setParentLoading(true);
    const { error } = await supabase.from('users').update({ full_name: parentName, location }).eq('id', user.id);
    if (error) toast.error('Gagal: ' + error.message);
    else {
      await supabase.auth.updateUser({ data: { full_name: parentName } });
      toast.success('Profil Bunda berhasil disimpan!');
      router.refresh();
    }
    setParentLoading(false);
  };

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
          gender: child.gender,
          birth_weight: child.birth_weight || '',
          birth_height: child.birth_height || ''
        });
      }
    }
  };

  const handleSaveChild = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!childForm.name || !childForm.date_of_birth) {
       toast.error("Nama dan Tanggal Lahir wajib diisi");
       return;
    }
    setChildLoading(true);
    
    const payload = {
      user_id: user.id,
      name: childForm.name,
      date_of_birth: childForm.date_of_birth,
      gender: childForm.gender,
      birth_weight: childForm.birth_weight ? parseFloat(childForm.birth_weight) : null,
      birth_height: childForm.birth_height ? parseFloat(childForm.birth_height) : null,
    };

    if (selectedChildId === 'new') {
      const { data, error } = await supabase.from('children').insert([payload]).select();
      if (error) toast.error(error.message);
      else {
        setChildrenList([...childrenList, data[0]]);
        setSelectedChildId(data[0].id);
        toast.success('Si Kecil berhasil ditambahkan!');
      }
    } else {
      const { error } = await supabase.from('children').update(payload).eq('id', selectedChildId);
      if (error) toast.error(error.message);
      else {
        setChildrenList(childrenList.map(c => c.id === selectedChildId ? { ...c, ...payload } : c));
        toast.success('Data Si Kecil berhasil diperbarui!');
      }
    }
    setChildLoading(false);
    router.refresh();
  };

  const handleDeleteChild = async () => {
    if (!childToDelete) return;
    setChildLoading(true);
    const { error } = await supabase.from('children').delete().eq('id', childToDelete.id);
    if (!error) {
      setChildrenList(childrenList.filter(c => c.id !== childToDelete.id));
      if (selectedChildId === childToDelete.id) {
        setSelectedChildId('new');
        setChildForm(emptyChildForm);
      }
      toast.success('Data berhasil dihapus');
    }
    setChildLoading(false);
    setShowDeleteModal(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
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
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Lokasi Tempat Tinggal</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-[var(--primary-color)]"
                placeholder="Contoh: Tegal, Surabaya, Jakarta Selatan"
              />
            </div>
            <button type="submit" disabled={parentLoading} className="w-full py-2 bg-[var(--primary-color)] text-white text-sm font-bold rounded-lg hover:bg-teal-600 transition">
              {parentLoading ? 'Menyimpan...' : 'Simpan Profil Bunda'}
            </button>
          </form>
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full max-w-6xl mx-auto">
      
      {/* === KIRI: KARTU PROFIL ORANG TUA === */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-white rounded-3xl shadow-xl shadow-teal-900/5 overflow-hidden border border-gray-100 relative">
          {/* Header Card Decoration */}
          <div className="h-24 bg-gradient-to-br from-teal-50 to-emerald-50 relative">
             <div className="absolute top-4 right-4 text-teal-200/50"><User size={64} /></div>
          </div>
          
          <div className="px-6 pb-8 relative -mt-12">
            <div className="flex flex-col items-center mb-6">
               <div className="w-24 h-24 bg-white p-1.5 rounded-full shadow-lg mb-3">
                  <div className="w-full h-full bg-gradient-to-br from-teal-100 to-teal-200 rounded-full flex items-center justify-center text-3xl font-bold text-teal-700">
                    {parentName ? parentName[0].toUpperCase() : <User />}
                  </div>
               </div>
               <h2 className="text-xl font-bold text-gray-800">{parentName || 'Bunda'}</h2>
               <p className="text-sm text-gray-400 font-medium">{user.email}</p>
            </div>

            <form onSubmit={handleSaveParent} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Nama Lengkap</label>
                <div className="relative group">
                   <User className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-teal-500 transition-colors" size={18} />
                   <input
                    type="text"
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[var(--primary-color)] focus:bg-white outline-none transition-all font-medium text-gray-700"
                    placeholder="Nama Bunda/Ayah"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Domisili</label>
                <div className="relative group">
                   <MapPin className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-teal-500 transition-colors" size={18} />
                   <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[var(--primary-color)] focus:bg-white outline-none cursor-pointer appearance-none font-medium text-gray-700"
                  >
                    <option value="Perkotaan">Perkotaan</option>
                    <option value="Pedesaan">Pedesaan</option>
                    <option value="Pesisir">Pesisir</option>
                    <option value="Pegunungan">Pegunungan</option>
                  </select>
                  <ChevronRight className="absolute right-3 top-3.5 text-gray-400 rotate-90" size={16} />
                </div>
              </div>
              
              <button 
                type="submit" 
                disabled={parentLoading}
                className="w-full py-3.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-bold rounded-xl transition-all shadow-lg hover:shadow-gray-900/20 flex justify-center items-center gap-2 mt-2"
              >
                {parentLoading ? 'Menyimpan...' : <><Save size={16} /> Simpan Profil</>}
              </button>
            </form>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full py-3.5 bg-white text-red-500 font-bold rounded-2xl border-2 border-red-50 hover:bg-red-50 hover:border-red-100 transition-all shadow-sm flex items-center justify-center gap-2"
        >
          Keluar Aplikasi
        </button>
      </div>

      {/* === KANAN: MANAJEMEN ANAK === */}
      <div className="lg:col-span-8 space-y-8">
        
        {/* SECTION 1: List Anak */}
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl shadow-teal-900/5 border border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                 Data Si Kecil <span className="text-sm font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{childrenList.length}</span>
              </h2>
              <p className="text-sm text-gray-500 mt-1">Pilih profil anak untuk mengedit atau menambah data baru.</p>
            </div>
            <button
              onClick={() => handleSelectChild('new')}
              className={`group flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-sm border ${
                selectedChildId === 'new' 
                ? 'bg-[var(--primary-color)] text-white border-transparent shadow-teal-200' 
                : 'bg-white text-gray-600 border-gray-200 hover:border-[var(--primary-color)] hover:text-[var(--primary-color)]'
              }`}
            >
              <Plus size={16} className={`transition-transform group-hover:rotate-90`} /> Tambah Anak
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {childrenList.map((child) => {
               const isSelected = selectedChildId === child.id;
               const isBoy = (child.gender === 'male' || child.gender === 'Laki-laki');
               return (
                <div 
                  key={child.id}
                  onClick={() => handleSelectChild(child.id)}
                  className={`relative group cursor-pointer p-4 rounded-2xl border-2 transition-all duration-300 ease-out hover:-translate-y-1 ${
                    isSelected
                      ? 'border-[var(--primary-color)] bg-teal-50/30 shadow-md ring-2 ring-teal-100 ring-offset-2'
                      : 'border-gray-100 bg-white hover:border-teal-100 hover:shadow-lg hover:shadow-teal-900/5'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-inner ${
                      isBoy ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-pink-600'
                    }`}>
                      {isBoy ? '👦' : '👧'}
                    </div>
                    <div className="overflow-hidden">
                      <p className={`font-bold truncate text-base ${isSelected ? 'text-[var(--primary-color)]' : 'text-gray-700'}`}>{child.name}</p>
                      <p className="text-xs text-gray-400 truncate font-medium">Lahir: {new Date(child.date_of_birth).getFullYear()}</p>
                    </div>
                  </div>
                  
                  {/* Tombol Hapus (Muncul saat Hover) */}
                  <button
                    onClick={(e) => { e.stopPropagation(); setChildToDelete(child); setShowDeleteModal(true); }}
                    className="absolute top-2 right-2 p-2 bg-white text-red-400 rounded-xl shadow-sm opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-600 transition-all transform scale-90 hover:scale-100 border border-gray-100"
                    title="Hapus data"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
               );
            })}
            
            {/* Empty State dalam Grid */}
            {childrenList.length === 0 && (
              <div className="col-span-full py-10 text-center border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50/50">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                   <Baby size={32} className="text-gray-300" />
                </div>
                <p className="text-gray-500 font-medium">Belum ada data anak.</p>
                <p className="text-xs text-gray-400">Tekan tombol "Tambah Anak" di atas.</p>
              </div>
            )}
          </div>
        </div>

        {/* SECTION 2: Form Editor */}
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl shadow-teal-900/5 border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
            <div className={`p-4 rounded-2xl shadow-sm ${selectedChildId === 'new' ? 'bg-orange-50 text-orange-500' : 'bg-blue-50 text-blue-500'}`}>
              {selectedChildId === 'new' ? <Plus size={28} strokeWidth={2.5} /> : <Edit2 size={28} strokeWidth={2.5} />}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">
                {selectedChildId === 'new' ? 'Tambah Profil Baru' : 'Edit Data Anak'}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {selectedChildId === 'new' ? 'Masukkan data lengkap si Kecil.' : `Perbarui informasi untuk ${childForm.name}.`}
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveChild} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nama Lengkap */}
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Nama Lengkap Anak</label>
                <input
                  type="text"
                  name="name"
                  value={childForm.name}
                  onChange={(e) => setChildForm({...childForm, name: e.target.value})}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-[var(--primary-color)] outline-none transition-all font-semibold text-gray-800 placeholder-gray-300"
                  placeholder="Contoh: Muhammad Altaf"
                />
              </div>

              {/* Tanggal Lahir */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Tanggal Lahir</label>
                <input
                  type="date"
                  name="date_of_birth"
                  value={childForm.date_of_birth}
                  onChange={(e) => setChildForm({...childForm, date_of_birth: e.target.value})}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-[var(--primary-color)] outline-none transition-all font-medium text-gray-700"
                />
              </div>

              {/* Jenis Kelamin Custom Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Jenis Kelamin</label>
                <div className="flex gap-3 h-[58px]">
                  <button 
                    type="button"
                    onClick={() => setChildForm({ ...childForm, gender: 'male' })}
                    className={`flex-1 rounded-2xl border-2 flex items-center justify-center gap-2 transition-all font-bold text-sm ${
                      childForm.gender === 'male' 
                      ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm' 
                      : 'border-gray-100 bg-gray-50 text-gray-400 hover:bg-gray-100'
                    }`}
                  >
                    <span>👦</span> Laki-laki
                  </button>
                  <button 
                    type="button"
                    onClick={() => setChildForm({ ...childForm, gender: 'female' })}
                    className={`flex-1 rounded-2xl border-2 flex items-center justify-center gap-2 transition-all font-bold text-sm ${
                      childForm.gender === 'female' 
                      ? 'border-pink-500 bg-pink-50 text-pink-700 shadow-sm' 
                      : 'border-gray-100 bg-gray-50 text-gray-400 hover:bg-gray-100'
                    }`}
                  >
                    <span>👧</span> Perempuan
                  </button>
                </div>
              </div>

              {/* Berat & Tinggi Lahir */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Berat Lahir (kg)</label>
                <div className="relative">
                   <input
                    type="number"
                    step="0.1"
                    name="birth_weight"
                    value={childForm.birth_weight}
                    onChange={(e) => setChildForm({...childForm, birth_weight: e.target.value})}
                    className="w-full p-4 pl-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-[var(--primary-color)] outline-none transition-all font-bold text-gray-800 placeholder-gray-300"
                    placeholder="0.0"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">KG</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Tinggi Lahir (cm)</label>
                <div className="relative">
                   <input
                    type="number"
                    step="0.1"
                    name="birth_height"
                    value={childForm.birth_height}
                    onChange={(e) => setChildForm({...childForm, birth_height: e.target.value})}
                    className="w-full p-4 pl-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-[var(--primary-color)] outline-none transition-all font-bold text-gray-800 placeholder-gray-300"
                    placeholder="0.0"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">CM</span>
                </div>
              </div>
            </div>

            <div className="pt-6 flex justify-end gap-3 border-t border-gray-100 mt-6">
              {selectedChildId !== 'new' && (
                <button
                  type="button"
                  onClick={() => handleSelectChild('new')}
                  className="px-6 py-3.5 rounded-xl text-gray-500 font-bold hover:bg-gray-100 transition-colors"
                >
                  Batal
                </button>
              )}
              <button
                type="submit"
                disabled={childLoading}
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[var(--primary-color)] to-teal-500 text-white font-bold hover:shadow-lg hover:shadow-teal-500/30 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:translate-y-0"
              >
                {childLoading ? 'Menyimpan Data...' : (selectedChildId === 'new' ? 'Simpan Data Anak' : 'Simpan Perubahan')}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* --- Delete Modal (Minimalist) --- */}
      {showDeleteModal && childToDelete && (
        <div className="fixed inset-0 bg-gray-900/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] w-full max-w-sm p-8 shadow-2xl scale-100">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
              <Trash2 size={32} />
            </div>
            <h3 className="text-2xl font-bold text-center text-gray-800 mb-2">Hapus Data?</h3>
            <p className="text-gray-500 text-center mb-8 leading-relaxed">
              Anda yakin ingin menghapus data <strong className="text-gray-900">{childToDelete.name}</strong>? <br/>Tindakan ini tidak bisa dibatalkan.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-3.5 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteChild}
                disabled={childLoading}
                className="flex-1 py-3.5 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 shadow-lg shadow-red-200 transition-all"
              >
                {childLoading ? '...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}