// src/data/articles.ts

export const articlesData = [
  // --- ARTIKEL 1 (ADA ISI) ---
  {
    id: 1,
    title: "Mencegah Stunting Sejak Masa Kehamilan",
    excerpt: "Stunting tidak hanya dicegah saat anak lahir, tetapi dimulai sejak 1000 hari pertama kehidupan...",
    category: "Kehamilan",
    author: "Dr. Rina Spesialis Anak",
    date: "12 Des 2024",
    readTime: "5 min",
    image: "https://images.unsplash.com/photo-1532509854226-a2d9d8e66f8e?q=80&w=800&auto=format&fit=crop",
    isEmpty: false,
    content: `
      <p>Stunting adalah kondisi gagal tumbuh pada anak balita akibat kekurangan gizi kronis terutama pada 1.000 Hari Pertama Kehidupan (HPK). Periode ini dimulai sejak janin dalam kandungan hingga anak berusia 2 tahun.</p>
      <br/>
      <h3 class="text-xl font-bold text-teal-600 mb-2">Nutrisi Penting Ibu Hamil</h3>
      <p>Ibu hamil wajib memenuhi kebutuhan makronutrien (karbohidrat, protein, lemak) dan mikronutrien (vitamin, mineral). Berikut adalah zat gizi kunci:</p>
      <ul class="list-disc ml-5 mt-2 space-y-1">
        <li><strong>Zat Besi:</strong> Mencegah anemia yang bisa menyebabkan bayi lahir dengan berat badan rendah (BBLR).</li>
        <li><strong>Asam Folat:</strong> Penting untuk pembentukan sistem saraf janin.</li>
        <li><strong>Protein Hewani:</strong> Telur, ikan, dan daging membantu pertumbuhan sel janin.</li>
      </ul>
      <br/>
      <p>Ingat Bunda, mencegah stunting itu dimulai dari piring makan Bunda saat hamil!</p>
    `
  },
  // --- ARTIKEL 2 (ADA ISI) ---
  {
    id: 2,
    title: "5 Resep MPASI Tinggi Protein Hewani",
    excerpt: "Protein hewani terbukti efektif mencegah stunting. Berikut adalah 5 ide resep MPASI mudah...",
    category: "Resep & Nutrisi",
    author: "Chef Budi",
    date: "10 Des 2024",
    readTime: "8 min",
    image: "https://images.unsplash.com/photo-1598515214211-3f88c6d4f303?q=80&w=800&auto=format&fit=crop",
    isEmpty: false,
    content: `
      <p>Protein hewani memiliki asam amino esensial yang lebih lengkap dibandingkan protein nabati untuk memacu pertumbuhan tinggi badan anak.</p>
      <br/>
      <h3 class="text-xl font-bold text-teal-600 mb-2">1. Bubur Ikan Kembung Santan</h3>
      <p>Ikan kembung lokal memiliki kandungan Omega-3 yang setara bahkan lebih tinggi dari salmon impor. Kukus ikan, ambil dagingnya, lalu masak dengan bubur beras dan santan segar.</p>
      <br/>
      <h3 class="text-xl font-bold text-teal-600 mb-2">2. Telur Orak-Arik Lembut</h3>
      <p>Gunakan 2 butir telur ayam kampung. Masak dengan butter atau minyak kelapa agar menambah kalori (lemak tambahan).</p>
      <br/>
      <h3 class="text-xl font-bold text-teal-600 mb-2">3. Hati Ayam Tumis Bawang</h3>
      <p>Hati ayam adalah <em>superfood</em> untuk zat besi. Tumis dengan bawang putih dan sedikit kecap manis khusus anak untuk rasa yang lezat.</p>
    `
  },
  // --- ARTIKEL 3 (ADA ISI) ---
  {
    id: 3,
    title: "Tanda-Tanda Anak Gagal Tumbuh (Faltering Growth)",
    excerpt: "Jangan abaikan jika berat badan anak tidak naik selama 2 bulan berturut-turut...",
    category: "Kesehatan",
    author: "Bidan Siti",
    date: "08 Des 2024",
    readTime: "6 min",
    image: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=800&auto=format&fit=crop",
    isEmpty: false,
    content: `
      <p><em>Faltering Growth</em> atau gagal tumbuh adalah kondisi ketika kenaikan berat badan anak tidak sesuai dengan kurva pertumbuhannya (KMS) atau bahkan turun.</p>
      <br/>
      <h3 class="text-xl font-bold text-red-500 mb-2">Red Flag yang Harus Diwaspadai</h3>
      <ol class="list-decimal ml-5 mt-2 space-y-1">
        <li>Berat badan (BB) tetap atau turun selama 2 bulan berturut-turut.</li>
        <li>Garis pertumbuhan memotong kurva (misal dari garis hijau turun ke kuning).</li>
        <li>Anak tampak lemas dan tidak aktif.</li>
      </ol>
      <br/>
      <p>Jika menemukan tanda ini, segera konsultasikan ke Dokter Spesialis Anak (DSA) untuk mencari penyebab medisnya (seperti ISK atau TBC) atau masalah nutrisi.</p>
    `
  },
  // --- ARTIKEL KOSONG (4-6) ---
  { id: 4, category: "Nutrisi", isEmpty: true },
  { id: 5, category: "Tumbuh Kembang", isEmpty: true },
  { id: 6, category: "Kesehatan", isEmpty: true }
];