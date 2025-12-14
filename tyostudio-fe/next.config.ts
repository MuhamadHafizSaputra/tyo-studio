import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // 1. Unsplash (Gambar Default)
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      // 2. Supabase Storage (Foto Profil)
      {
        protocol: 'https',
        hostname: 'zygixgpxvzfmzsyaydqi.supabase.co', // Sesuaikan dengan hostname Supabase Anda jika berbeda
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      // 3. Domain Tambahan dari Artikel Baru (FIX ERROR)
      {
        protocol: 'https',
        hostname: 'mysiloam-api.siloamhospitals.com',
      },
      {
        protocol: 'https',
        hostname: 'img-cdn.medkomtek.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.hellosehat.com',
      },
      {
        protocol: 'https',
        hostname: 'akcdn.detik.net.id',
      },
    ],
  },
};

export default nextConfig;