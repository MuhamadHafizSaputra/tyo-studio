const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 pt-16 pb-12 mt-20">
      <div className="container mx-auto px-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* Brand Column */}
          <div className="col-span-1 md:col-span-2 space-y-4">
            <h4 className="text-2xl font-bold text-[var(--primary-color)]">TyoStudio</h4>
            <p className="text-gray-500 leading-relaxed max-w-sm">
              Platform pemantau tumbuh kembang anak terpercaya.
              Membantu orang tua mencegah stunting dengan nutrisi yang tepat dan terukur.
            </p>
          </div>

          {/* Links Column 1 */}
          <div>
            <h4 className="font-bold text-gray-900 mb-6">Tentang Kami</h4>
            <ul className="space-y-4 text-gray-600">
              <li><a href="#" className="hover:text-[var(--primary-color)] transition-colors">Visi & Misi</a></li>
              <li><a href="#" className="hover:text-[var(--primary-color)] transition-colors">Tim Kami</a></li>
              <li><a href="#" className="hover:text-[var(--primary-color)] transition-colors">Kontak</a></li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h4 className="font-bold text-gray-900 mb-6">Layanan</h4>
            <ul className="space-y-4 text-gray-600">
              <li><a href="#" className="hover:text-[var(--primary-color)] transition-colors">Cek Status Gizi</a></li>
              <li><a href="#" className="hover:text-[var(--primary-color)] transition-colors">Rekomendasi Menu</a></li>
              <li><a href="#" className="hover:text-[var(--primary-color)] transition-colors">Konsultasi Ahli</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-16 pt-8 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} TyoStudio. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;