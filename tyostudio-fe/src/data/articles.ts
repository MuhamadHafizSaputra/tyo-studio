// src/data/articles.ts

export const articlesData = [
  // --- ARTIKEL 1 ---
  {
    id: 1,
    title: "Mencegah Stunting Sejak Masa Kehamilan",
    excerpt: "Stunting tidak hanya dicegah saat anak lahir, tetapi dimulai sejak 1000 hari pertama kehidupan...",
    category: "Kehamilan",
    author: "Dr. Rina Spesialis Anak",
    date: "12 Des 2024",
    readTime: "5 min",
    image: "https://images.unsplash.com/photo-1532509854226-a2d9d8e66f8e?q=80&w=800&auto=format&fit=crop", // Gambar Ibu Hamil
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
  // --- ARTIKEL 2 ---
  {
    id: 2,
    title: "5 Resep MPASI Tinggi Protein Hewani",
    excerpt: "Protein hewani terbukti efektif mencegah stunting. Berikut adalah 5 ide resep MPASI mudah...",
    category: "Resep & Nutrisi",
    author: "Chef Budi",
    date: "10 Des 2024",
    readTime: "8 min",
    image: "https://mysiloam-api.siloamhospitals.com/public-asset/website-cms/website-cms-16814427914478422.webp", // Gambar Makanan Sehat
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
  // --- ARTIKEL 3 ---
  {
    id: 3,
    title: "Tanda-Tanda Anak Gagal Tumbuh (Faltering Growth)",
    excerpt: "Jangan abaikan jika berat badan anak tidak naik selama 2 bulan berturut-turut...",
    category: "Kesehatan",
    author: "Bidan Siti",
    date: "08 Des 2024",
    readTime: "6 min",
    image: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=800&auto=format&fit=crop", // Gambar Bayi di Timbangan/Klinik
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
  // --- ARTIKEL 4 ---
  {
    id: 4,
    title: "Keajaiban ASI Eksklusif 6 Bulan Pertama",
    excerpt: "ASI adalah cairan hidup yang mengandung antibodi dan nutrisi terbaik yang tidak bisa digantikan susu formula...",
    category: "Menyusui",
    author: "Konselor Laktasi",
    date: "05 Des 2024",
    readTime: "5 min",
    image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?q=80&w=800&auto=format&fit=crop", // Gambar Ibu Menyusui/Bayi
    isEmpty: false,
    content: `
      <p>ASI Eksklusif selama 6 bulan pertama tanpa tambahan air putih atau makanan lain adalah fondasi utama mencegah stunting.</p>
      <br/>
      <h3 class="text-xl font-bold text-teal-600 mb-2">Manfaat ASI untuk Tumbuh Kembang</h3>
      <ul class="list-disc ml-5 mt-2 space-y-1">
        <li><strong>Imunitas:</strong> ASI mengandung antibodi yang melindungi bayi dari diare dan infeksi saluran pernapasan.</li>
        <li><strong>Mudah Dicerna:</strong> Sistem pencernaan bayi belum sempurna, ASI adalah nutrisi yang paling mudah diserap.</li>
        <li><strong>Bonding:</strong> Meningkatkan ikatan emosional ibu dan anak yang penting untuk kesehatan mental.</li>
      </ul>
    `
  },
  // --- ARTIKEL 5 ---

  {
    id: 5,
    title: "Zat Besi: 'Bahan Bakar' Utama Mencegah Stunting",
    excerpt: "Kekurangan zat besi adalah penyebab utama anemia yang membuat anak lemas, tidak nafsu makan, dan menghambat pertumbuhan tinggi badan...",
    category: "Nutrisi",
    author: "Ahli Gizi Indonesia",
    date: "14 Des 2024",
    readTime: "5 min",
    image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?q=80&w=800&auto=format&fit=crop", // Gambar Daging/Hati (Sumber Zat Besi)
    isEmpty: false,
    content: `
      <p>Tahukah Bunda? Zat besi bukan hanya untuk darah, tapi juga untuk otak dan pertumbuhan tulang. Anak yang kekurangan zat besi (Anemia Defisiensi Besi) cenderung memiliki nafsu makan yang buruk.</p>
      <br/>
      <h3 class="text-xl font-bold text-teal-600 mb-2">Sumber Zat Besi Terbaik</h3>
      <p>Zat besi dari hewani (Heme Iron) diserap 2-3x lebih baik daripada nabati. Prioritaskan makanan ini:</p>
      <ul class="list-disc ml-5 mt-2 space-y-1">
        <li><strong>Hati Ayam/Sapi:</strong> Juara kandungan zat besi.</li>
        <li><strong>Daging Merah:</strong> Sapi, kambing (potongan tanpa lemak).</li>
        <li><strong>Ikan & Kerang:</strong> Selain zat besi juga kaya Zinc.</li>
      </ul>
      <p class="mt-2 text-sm text-gray-500"><em>Tips: Konsumsi bersama jeruk (Vitamin C) untuk meningkatkan penyerapan. Hindari minum teh setelah makan karena menghambat penyerapan.</em></p>
    `
  },
  // --- ARTIKEL 6 ---
  {
    id: 6,
    title: "Hubungan Sanitasi Buruk dan Stunting",
    excerpt: "Tahukah Bunda? Lingkungan yang kotor dapat menyebabkan diare berulang yang menghambat penyerapan nutrisi...",
    category: "Kesehatan Lingkungan",
    author: "Dr. Tirta",
    date: "03 Des 2024",
    readTime: "4 min",
    image: "https://images.unsplash.com/photo-1584634731339-252c581abfc5?q=80&w=800&auto=format&fit=crop", // Gambar Cuci Tangan
    isEmpty: false,
    content: `
      <p>Meskipun anak makan bergizi, jika lingkungannya kotor, ia rentan terkena infeksi seperti cacingan dan diare. Infeksi ini akan "mencuri" nutrisi yang seharusnya untuk pertumbuhan.</p>
      <br/>
      <h3 class="text-xl font-bold text-teal-600 mb-2">Langkah Pencegahan di Rumah</h3>
      <ul class="list-disc ml-5 mt-2 space-y-1">
        <li><strong>Cuci Tangan Pakai Sabun (CTPS):</strong> Wajib dilakukan sebelum makan, sebelum menyusui, dan setelah BAB.</li>
        <li><strong>Jamban Sehat:</strong> Pastikan limbah kotoran tidak mencemari sumber air.</li>
        <li><strong>Air Matang:</strong> Selalu masak air minum hingga mendidih.</li>
      </ul>
    `
  },
  // --- ARTIKEL 7 ---
  {
    id: 7,
    title: "Tidur Cukup: Rahasia Tinggi Badan Anak",
    excerpt: "Hormon pertumbuhan (Growth Hormone) bekerja paling aktif saat anak tidur nyenyak di malam hari...",
    category: "Tumbuh Kembang",
    author: "Psikolog Anak",
    date: "01 Des 2024",
    readTime: "5 min",
    image: "https://img-cdn.medkomtek.com/G3VJ5m-NSN3hwTwVFJwhbo2uiFA=/510x395/smart/filters:quality(100):format(webp)/article/fg-zEoZK0TRpnMr9QLUtx/original/1668140141-8%20Gangguan%20Tidur%20yang%20Bisa%20Menyerang%20Anak.jpg?w=256&q=100", // Gambar Bayi Tidur
    isEmpty: false,
    content: `
      <p>Banyak orang tua fokus pada makan, tapi lupa pada tidur. Padahal, sekitar 75% hormon pertumbuhan dilepaskan saat anak tidur dalam fase <em>deep sleep</em>.</p>
      <br/>
      <h3 class="text-xl font-bold text-teal-600 mb-2">Rekomendasi Jam Tidur</h3>
      <ul class="list-disc ml-5 mt-2 space-y-1">
        <li><strong>Bayi (4-12 bulan):</strong> 12-16 jam per hari (termasuk tidur siang).</li>
        <li><strong>Balita (1-2 tahun):</strong> 11-14 jam per hari.</li>
        <li><strong>Prasekolah (3-5 tahun):</strong> 10-13 jam per hari.</li>
      </ul>
      <p class="mt-2">Pastikan kamar tidur gelap dan hening agar kualitas tidur anak optimal.</p>
    `
  },
  // --- ARTIKEL 8 ---
  {
    id: 8,
    title: "Jangan Lewatkan Jadwal Imunisasi Dasar",
    excerpt: "Imunisasi melindungi anak dari penyakit berbahaya yang dapat menguras energi tubuh dan menghentikan pertumbuhan...",
    category: "Kesehatan",
    author: "Kemenkes RI",
    date: "28 Nov 2024",
    readTime: "6 min",
    image: "https://cdn.hellosehat.com/wp-content/uploads/2020/05/jadwal-imunisasi-bayi.jpg?w=1080&q=100", // Gambar Imunisasi/Dokter
    isEmpty: false,
    content: `
      <p>Anak yang sering sakit-sakitan energinya akan habis untuk melawan penyakit, bukan untuk tumbuh. Imunisasi adalah tameng terbaik.</p>
      <br/>
      <h3 class="text-xl font-bold text-teal-600 mb-2">Vaksin Wajib Pemerintah</h3>
      <p>Pastikan buku KIA Anda lengkap dengan stempel imunisasi berikut:</p>
      <ul class="list-disc ml-5 mt-2 space-y-1">
        <li><strong>Hepatitis B:</strong> Saat lahir.</li>
        <li><strong>BCG & Polio:</strong> Usia 1 bulan.</li>
        <li><strong>DPT-HB-Hib:</strong> Mencegah difteri, pertusis, tetanus.</li>
        <li><strong>Campak/MR:</strong> Usia 9 bulan.</li>
      </ul>
    `
  },
  // --- ARTIKEL 9 ---
  {
    id: 9,
    title: "Ayah Siaga: Peran Ayah dalam Mencegah Stunting",
    excerpt: "Pencegahan stunting bukan tugas ibu saja. Dukungan ayah sangat mempengaruhi keberhasilan ASI dan pola makan...",
    category: "Parenting",
    author: "Ayah ASI Indonesia",
    date: "25 Nov 2024",
    readTime: "5 min",
    image: "https://akcdn.detik.net.id/visual/2020/06/25/1150232966_169.jpeg?w=750&q=90", // Gambar Ayah dan Anak
    isEmpty: false,
    content: `
      <p>Studi menunjukkan ibu yang mendapat dukungan suami memiliki tingkat keberhasilan menyusui yang jauh lebih tinggi.</p>
      <br/>
      <h3 class="text-xl font-bold text-teal-600 mb-2">Apa yang Ayah Bisa Lakukan?</h3>
      <ul class="list-disc ml-5 mt-2 space-y-1">
        <li>Mengambil alih tugas rumah tangga saat ibu menyusui.</li>
        <li>Ikut menyuapi anak saat jam makan (MPASI).</li>
        <li>Menciptakan suasana makan yang menyenangkan (<em>responsive feeding</em>).</li>
        <li>Memastikan ketersediaan dana untuk belanja pangan protein hewani.</li>
      </ul>
    `
  },
  // --- ARTIKEL 10 ---
  {
    id: 10,
    title: "Stimulasi Otak dengan Bermain Sederhana",
    excerpt: "Gizi memberi bahan bakar, stimulasi yang membangun sirkuit otak. Anak cerdas butuh keduanya...",
    category: "Edukasi",
    author: "Pakar Neurologi",
    date: "20 Nov 2024",
    readTime: "4 min",
    image: "https://cdn.hellosehat.com/wp-content/uploads/2024/10/fc737ce4-manfaat-bermain-puzzle-untuk-anak.jpg?w=1080&q=100", // Gambar Anak Bermain
    isEmpty: false,
    content: `
      <p>Selain fisik (tinggi badan), stunting juga berisiko menghambat perkembangan kognitif (kecerdasan). Stimulasi rutin dapat membantu mengejar ketertinggalan perkembangan.</p>
      <br/>
      <h3 class="text-xl font-bold text-teal-600 mb-2">Ide Bermain Murah Meriah</h3>
      <ul class="list-disc ml-5 mt-2 space-y-1">
        <li><strong>Cilukba:</strong> Melatih konsep permanensi objek (usia 6-12 bulan).</li>
        <li><strong>Menumpuk Balok:</strong> Melatih motorik halus.</li>
        <li><strong>Membacakan Buku:</strong> Menambah kosakata anak sejak bayi.</li>
        <li><strong>Ajak Bicara:</strong> Narasi setiap kegiatan, misal "Adik sedang mandi air hangat ya".</li>
      </ul>
    `
  },
  // --- ARTIKEL 11 ---  
  {
    id: 11,
    title: "Telur: Superfood Murah Paling Efektif",
    excerpt: "Studi terbaru membuktikan bahwa konsumsi 1 butir telur setiap hari dapat menurunkan risiko stunting secara signifikan...",
    category: "Nutrisi",
    author: "Dr. Tan Shot Yen",
    date: "13 Des 2024",
    readTime: "4 min",
    image: "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?q=80&w=800&auto=format&fit=crop", // Gambar Telur
    isEmpty: false,
    content: `
      <p>Telur adalah sumber protein dengan skor asam amino paling lengkap (skor 100). Protein ini adalah 'batu bata' untuk menyusun sel-sel tubuh anak agar bertambah tinggi.</p>
      <br/>
      <h3 class="text-xl font-bold text-teal-600 mb-2">Fakta Nutrisi Telur</h3>
      <ul class="list-disc ml-5 mt-2 space-y-1">
        <li><strong>Kolin:</strong> Penting untuk perkembangan otak dan memori.</li>
        <li><strong>Protein:</strong> Sekitar 6 gram per butir.</li>
        <li><strong>Lemak Sehat:</strong> Ada di kuning telur, jangan dibuang ya Bun!</li>
      </ul>
      <br/>
      <p>Olah dengan cara direbus, ceplok, atau dadar. Pastikan matang sempurna untuk menghindari bakteri Salmonella.</p>
    `
  },
];