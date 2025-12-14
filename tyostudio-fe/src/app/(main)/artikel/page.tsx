'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Search, Clock, User, ChevronRight, BookOpen,
  Baby, Utensils, Milk, Sprout,
  Users, GraduationCap, Leaf, LayoutGrid, Stethoscope,
  SlidersHorizontal, X, Sparkles, CalendarDays
} from 'lucide-react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { articlesData } from '@/data/articles';

// Animation Variants
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function ArtikelPage() {
  // --- STATE ---
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // --- LOGIC ---
  const categories = useMemo(() => {
    const uniqueCats = Array.from(new Set(articlesData.map((item) => item.category)));
    return ['Semua', ...uniqueCats];
  }, []);

  const getCategoryConfig = (category: string) => {
    switch (category) {
      case 'Kehamilan': return { icon: <Baby size={18} />, color: 'bg-pink-100 text-pink-600 border-pink-200' };
      case 'Nutrisi':
      case 'Resep':
      case 'Resep & Nutrisi': return { icon: <Utensils size={18} />, color: 'bg-orange-100 text-orange-600 border-orange-200' };
      case 'Kesehatan': return { icon: <Stethoscope size={18} />, color: 'bg-blue-100 text-blue-600 border-blue-200' };
      case 'Menyusui': return { icon: <Milk size={18} />, color: 'bg-purple-100 text-purple-600 border-purple-200' };
      case 'Tumbuh Kembang': return { icon: <Sprout size={18} />, color: 'bg-green-100 text-green-600 border-green-200' };
      case 'Parenting': return { icon: <Users size={18} />, color: 'bg-yellow-100 text-yellow-600 border-yellow-200' };
      case 'Edukasi': return { icon: <GraduationCap size={18} />, color: 'bg-indigo-100 text-indigo-600 border-indigo-200' };
      case 'Kesehatan Lingkungan':
      case 'Lingkungan': return { icon: <Leaf size={18} />, color: 'bg-emerald-100 text-emerald-600 border-emerald-200' };
      case 'Semua': return { icon: <LayoutGrid size={18} />, color: 'bg-gray-100 text-gray-600 border-gray-200' };
      default: return { icon: <BookOpen size={18} />, color: 'bg-teal-100 text-teal-600 border-teal-200' };
    }
  };

  const filteredArticles = articlesData.filter((article) => {
    const matchCategory = activeCategory === 'Semua' || article.category === activeCategory;
    const matchSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());

    return matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-24">

      {/* --- HEADER SECTION (CENTERED & MODERN) --- */}
      {/* --- HEADER SECTION (CENTERED & MODERN) --- */}
      <div className="bg-teal-500 pt-12 pb-10 md:pt-16 md:pb-12 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] border-b border-gray-100 rounded-b-[2.5rem] md:rounded-b-[5rem] relative overflow-hidden">

        {/* Dekorasi Background Gradient Halus */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] md:w-[800px] md:h-[500px] bg-gradient-to-b from-teal-50/60 to-transparent rounded-full blur-3xl -z-10 pointer-events-none"
        />

        <div className="container mx-auto max-w-4xl px-4 text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-3xl md:text-5xl font-black text-white mb-4 md:mb-6 leading-[1.2] tracking-tight"
          >
            Panduan Tumbuh Kembang <br className="hidden md:block" /> dan Nutrisi Si Kecil
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-teal-50 text-base md:text-xl leading-relaxed max-w-2xl mx-auto mb-8 md:mb-10 font-light"
          >
            Temukan ribuan artikel terpercaya, resep MPASI, dan tips kesehatan untuk mencegah stunting sejak dini.
          </motion.p>

          {/* Search Bar Besar di Tengah */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
            className="relative max-w-xl mx-auto group"
          >
            <div className="absolute inset-y-0 left-0 pl-5 md:pl-6 flex items-center pointer-events-none">
              <Search className="text-gray-400 group-focus-within:text-[var(--primary-color)] transition-colors" size={20} />
            </div>
            <input
              type="text"
              placeholder="Cari artikel, resep, atau topik kesehatan..."
              className="w-full pl-12 md:pl-16 pr-5 md:pr-6 py-3.5 md:py-4.5 rounded-full bg-white border-2 border-gray-100 focus:border-[var(--primary-color)] focus:ring-4 focus:ring-teal-50/50 outline-none transition-all text-sm md:text-base font-medium shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] placeholder:font-normal h-[50px] md:h-[64px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </motion.div>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="container mx-auto max-w-6xl px-4 md:px-8 py-8 md:py-10">

        {/* --- STICKY FLOATING FILTER BAR --- */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="sticky top-4 z-30 mb-6 md:mb-8"
        >
          <div className="bg-white/80 backdrop-blur-xl p-3 rounded-2xl shadow-lg shadow-gray-200/50 border border-white/50 flex flex-wrap items-center justify-between gap-4">

            {/* Info Hasil */}
            <div className="flex items-center gap-3 pl-2">
              <div className="h-6 w-1 md:h-8 bg-[var(--primary-color)] rounded-full"></div>
              <div>
                <h2 className="font-bold text-gray-800 text-sm md:text-base leading-tight">
                  {activeCategory === 'Semua' ? 'Jelajahi Artikel' : activeCategory}
                </h2>
                <p className="text-[10px] text-gray-500 font-medium">{filteredArticles.length} hasil ditemukan</p>
              </div>
            </div>

            {/* Tombol Toggle Filter */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all border shadow-sm ml-auto ${isFilterOpen || activeCategory !== 'Semua'
                ? 'bg-teal-50 text-teal-700 border-teal-200'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
            >
              {isFilterOpen ? <X size={16} strokeWidth={2.5} /> : <SlidersHorizontal size={16} strokeWidth={2.5} />}
              {activeCategory !== 'Semua' ? 'Ubah Filter' : 'Filter'}
            </button>
          </div>

          {/* --- DROPDOWN KATEGORI --- */}
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0, marginTop: 0 }}
                animate={{ height: "auto", opacity: 1, marginTop: 12 }}
                exit={{ height: 0, opacity: 0, marginTop: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl shadow-gray-100">
                  <p className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-wider ml-1">Pilih Kategori Spesifik:</p>

                  <div className="relative w-full">
                    <div className="flex flex-wrap gap-3">
                      {categories.map((cat, index) => {
                        const config = getCategoryConfig(cat);
                        const isActive = activeCategory === cat;
                        return (
                          <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            key={cat}
                            onClick={() => { setActiveCategory(cat); }} // Tetap buka atau tutup sesuai preferensi UX
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all border select-none ${isActive
                              ? 'bg-[var(--primary-color)] text-white border-[var(--primary-color)] shadow-md shadow-teal-200 transform scale-105'
                              : 'bg-gray-50 text-gray-600 border-gray-100 hover:border-teal-200 hover:bg-teal-50'
                              }`}
                          >
                            <span className={`flex items-center justify-center w-6 h-6 rounded-full ${isActive ? 'bg-white/20' : config.color.split(' ')[0]}`}>
                              {React.cloneElement(config.icon as React.ReactElement<any>, {
                                size: 14,
                                className: isActive ? 'text-white' : config.color.split(' ')[1].replace('text-', 'text-')
                              })}
                            </span>
                            {cat}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>


        {/* --- GRID ARTIKEL --- */}
        {filteredArticles.length > 0 ? (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode='popLayout'>
              {filteredArticles.map((article) => (
                <motion.div
                  key={article.id}
                  variants={fadeInUp}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link
                    href={`/artikel/${article.id}`}
                    style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', MozBackfaceVisibility: 'hidden' }}
                    className="group bg-white rounded-[1.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
                  >
                    {/* Image Area */}
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={article.image}
                        alt={article.title}
                        width={600}
                        height={400}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      {/* Glassmorphism Badge */}
                      <div className="absolute top-3 left-3">
                        <span className="bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-gray-800 shadow-sm flex items-center gap-1.5 border border-white/40">
                          {getCategoryConfig(article.category).icon}
                          {article.category}
                        </span>
                      </div>
                    </div>

                    {/* Content Area */}
                    <div className="p-5 flex flex-col flex-grow">
                      {/* Metadata (Date only) */}
                      <div className="flex items-center gap-2 text-[10px] text-gray-400 mb-2 font-medium uppercase tracking-wider">
                        <CalendarDays size={12} strokeWidth={2} />
                        <span>{article.date}</span>
                      </div>

                      <h3 className="text-lg font-bold text-gray-800 line-clamp-2 leading-snug group-hover:text-teal-600 transition-colors">
                        {article.title}
                      </h3>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* --- EMPTY STATE --- */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 animate-pulse">
              <Search size={40} className="text-gray-300" />
            </div>
            <h3 className="text-2xl font-black text-gray-800 mb-2">Tidak Ditemukan</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-8 text-lg">
              Kami tidak dapat menemukan artikel untuk kata kunci <strong>"{searchQuery}"</strong>.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setActiveCategory('Semua'); }}
              className="px-8 py-3.5 rounded-full bg-gray-900 text-white font-bold hover:bg-gray-800 hover:shadow-lg transition-all transform hover:-translate-y-1"
            >
              Reset Pencarian
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}