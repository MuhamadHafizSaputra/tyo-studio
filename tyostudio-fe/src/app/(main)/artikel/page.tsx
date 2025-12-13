'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Calendar, User, Clock, ArrowRight, Search, Tag, FileX } from 'lucide-react';
import { articlesData } from '@/data/articles'; // Import data dari file terpusat

const categories = ["Semua", "Kehamilan", "Nutrisi", "Resep & Nutrisi", "Kesehatan", "Tumbuh Kembang"];

export default function ArticlesPage() {
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter Logic
  const filteredArticles = articlesData.filter(article => {
    const matchCategory = selectedCategory === "Semua" || article.category === selectedCategory;
    
    // Jika artikel kosong, skip pencarian judul agar tidak error (karena title mungkin undefined di data kosong)
    if (article.isEmpty) return matchCategory;

    const matchSearch = article.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        article.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-5 py-12 text-center">
          <span className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-wider text-teal-700 uppercase bg-teal-50 rounded-full">
            Blog & Edukasi
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Artikel Kesehatan <span className="text-[var(--primary-color)]">Si Kecil</span>
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Temukan informasi terpercaya seputar nutrisi, MPASI, dan tips parenting untuk mencegah stunting.
          </p>

          <div className="mt-8 max-w-md mx-auto relative">
            <input 
              type="text" 
              placeholder="Cari artikel..." 
              className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 focus:border-[var(--primary-color)] outline-none shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-5 py-10">
        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-[var(--primary-color)] text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article) => {
            
            // TAMPILAN JIKA ARTIKEL KOSONG
            if (article.isEmpty) {
              return (
                <div key={article.id} className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-8 h-full min-h-[350px] text-center group relative">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-gray-300 mb-4">
                    <FileX size={32} />
                  </div>
                  <h3 className="text-gray-400 font-bold text-lg">Belum ada artikel</h3>
                  <p className="text-gray-400 text-xs mt-1 mb-6">Kategori: {article.category}</p>
                  
                  {/* Link ke halaman detail (yang akan menampilkan "Belum ada isi") */}
                  <Link 
                    href={`/artikel/${article.id}`} 
                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-500 text-sm font-bold hover:bg-white hover:text-gray-700 transition-colors"
                  >
                    Lihat Detail
                  </Link>
                </div>
              );
            }

            // TAMPILAN JIKA ARTIKEL ADA ISINYA
            return (
              <article key={article.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all flex flex-col h-full group">
                <div className="relative h-48 w-full overflow-hidden">
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-bold text-gray-700 rounded-lg flex items-center gap-1 shadow-sm">
                      <Tag size={12} className="text-[var(--primary-color)]" />
                      {article.category}
                    </span>
                  </div>
                  <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                    <span className="flex items-center gap-1"><Calendar size={12} /> {article.date}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {article.readTime}</span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-[var(--primary-color)] transition-colors">
                    {article.title}
                  </h3>
                  
                  <p className="text-gray-500 text-sm mb-6 line-clamp-3 flex-grow">
                    {article.excerpt}
                  </p>

                  <div className="border-t border-gray-50 pt-4 flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                        <User size={14} />
                      </div>
                      <span className="text-xs font-medium text-gray-600">{article.author}</span>
                    </div>
                    {/* Link ke halaman detail (yang akan menampilkan konten) */}
                    <Link href={`/artikel/${article.id}`} className="text-sm font-bold text-[var(--primary-color)] flex items-center gap-1 hover:gap-2 transition-all">
                      Baca <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}