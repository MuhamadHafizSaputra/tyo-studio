import React from 'react';

const Features: React.FC = () => {
  const features = [
    {
      icon: "👶",
      title: "Data Anak Terpusat",
      desc: "Simpan riwayat tinggi dan berat badan anak secara berkala untuk memantau grafik pertumbuhannya."
    },
    {
      icon: "📈",
      title: "Standar WHO",
      desc: "Perhitungan BMI dan deteksi risiko stunting menggunakan standar kurva pertumbuhan resmi dari WHO."
    },
    {
      icon: "🥗",
      title: "Saran Nutrisi Harian",
      desc: "Dapatkan rekomendasi resep dan bahan makanan yang disesuaikan dengan kebutuhan kalori anak."
    },
    {
      icon: "📝",
      title: "Jurnal Makanan",
      desc: "Catat asupan nutrisi harian untuk memastikan makronutrien (Protein, Karbo, Lemak) terpenuhi."
    }
  ];

  return (
    <section className="container" style={styles.section}>
      <div style={styles.header}>
        <h2 style={styles.heading}>Fitur Unggulan Kami</h2>
        <p style={styles.subHeading}>Solusi lengkap untuk mencegah stunting sejak dini</p>
      </div>
      
      <div style={styles.grid}>
        {features.map((item, index) => (
          <div key={index} style={styles.card}>
            <div style={styles.iconBox}>{item.icon}</div>
            <h3 style={styles.cardTitle}>{item.title}</h3>
            <p style={styles.cardDesc}>{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  section: {
    padding: '60px 20px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '50px',
  },
  heading: {
    fontSize: '32px',
    color: 'var(--primary-color)',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  subHeading: {
    color: '#666',
    fontSize: '16px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '30px',
  },
  card: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '16px',
    boxShadow: '0 5px 20px rgba(0,0,0,0.05)',
    transition: 'transform 0.3s',
    textAlign: 'left',
  },
  iconBox: {
    width: '50px',
    height: '50px',
    backgroundColor: '#E8F5F3',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    marginBottom: '20px',
    color: 'var(--primary-color)',
  },
  cardTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#333',
  },
  cardDesc: {
    color: '#666',
    lineHeight: '1.5',
    fontSize: '14px',
  }
};

export default Features;