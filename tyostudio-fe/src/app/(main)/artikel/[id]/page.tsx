import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Calendar, Clock, User, FileX, Share2 } from 'lucide-react';
import { notFound } from 'next/navigation';
import { articlesData } from '@/data/articles'; // Pastikan file data ini sudah dibuat

// Tipe props untuk halaman dinamis (Next.js 15+)
interface PageProps {
  params: Promise<{ id: string }>;
}

// HAPUS 'use client' AGAR BISA JADI ASYNC SERVER COMPONENT
export default async function ArticleDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const articleId = parseInt(resolvedParams.id);
  
  // Cari artikel berdasarkan ID
  const article = articlesData.find((a) => a.id === articleId);

  // Jika artikel tidak ditemukan, tampilkan 404
  if (!article) {
    notFound();
  }

  // --- KONDISI 1: JIKA ARTIKEL KOSONG (4-6) ---
  if (article.isEmpty) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 text-center max-w-lg w-full animate-fade-in">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mx-auto mb-6">
            <FileX size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Belum ada isi artikel</h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Maaf, konten untuk artikel ini sedang dalam proses penulisan dan kurasi oleh tim ahli kami.
          </p>
          <Link 
            href="/artikel" 
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--primary-color)] text-white rounded-full font-bold hover:bg-teal-700 transition-all shadow-md hover:shadow-lg"
          >
            <ArrowLeft size={18} />
            Kembali ke Artikel
          </Link>
        </div>
      </div>
    );
  }

  // --- KONDISI 2: JIKA ARTIKEL ADA ISINYA (1-3) ---
  return (
    <div className="min-h-screen bg-white pb-20">
      
      {/* Navbar Navigasi Balik */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-5 h-16 flex items-center justify-between">
          <Link href="/artikel" className="flex items-center gap-2 text-gray-600 hover:text-[var(--primary-color)] font-medium transition-colors">
            <ArrowLeft size={20} />
            Kembali
          </Link>
          <button className="p-2 text-gray-400 hover:text-[var(--primary-color)] hover:bg-teal-50 rounded-full transition-all">
            <Share2 size={20} />
          </button>
        </div>
      </div>

      <article className="container mx-auto px-5 max-w-3xl mt-8 animate-fade-in-up">
        {/* Header Artikel */}
        <div className="text-center mb-8">
          <span className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-wider text-teal-700 uppercase bg-teal-50 rounded-full">
            {article.category}
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-6">
            {article.title}
          </h1>
          
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 border-y border-gray-100 py-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                 <User size={16} />
              </div>
              <span className="font-medium text-gray-900">{article.author}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5"><Calendar size={16} /> {article.date}</span>
              <span className="flex items-center gap-1.5"><Clock size={16} /> {article.readTime}</span>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="relative w-full h-[300px] md:h-[400px] rounded-2xl overflow-hidden mb-10 shadow-lg group">
          <Image 
            src={article.image || ''} 
            alt={article.title || 'Article Image'} 
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            priority
          />
        </div>

        {/* Content Body */}
        {/* dangerouslySetInnerHTML digunakan karena konten kita di articles.ts berupa string HTML */}
        <div 
          className="prose prose-lg prose-teal mx-auto text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: article.content || '' }}
        />

        {/* Author Bio Box */}
        <div className="mt-16 p-6 bg-gray-50 rounded-2xl flex items-center gap-4 border border-gray-100">
          <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-2xl font-bold shrink-0">
            {article.author ? article.author[0] : 'A'}
          </div>
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Ditulis Oleh</p>
            <h4 className="text-lg font-bold text-gray-900">{article.author}</h4>
            <p className="text-sm text-gray-600">Tim Ahli Teman Ibu</p>
          </div>
        </div>

      </article>
    </div>
  );
}