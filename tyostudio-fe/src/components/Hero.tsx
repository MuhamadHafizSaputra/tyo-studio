import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="container" style={styles.section}>
      <div style={styles.content}>
        <div style={styles.badge}>Dukung Tumbuh Kembang Anak</div>
        <h1 style={styles.title}>
          Cegah Stunting dengan <br />
          <span style={{ color: 'var(--primary-color)' }}>Nutrisi Terukur & Tepat</span>
        </h1>
        <p style={styles.description}>
          Pantau status gizi anak berdasarkan standar WHO. Dapatkan perhitungan BMI akurat 
          dan rekomendasi menu harian yang dipersonalisasi untuk si kecil.
        </p>
        <div style={styles.btnGroup}>
          <button style={styles.ctaBtn}>Cek Status Gizi Sekarang</button>
          <button style={styles.secondaryBtn}>Pelajari Selengkapnya</button>
        </div>
      </div>
    </section>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  section: {
    padding: '80px 20px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  content: {
    maxWidth: '800px',
  },
  badge: {
    display: 'inline-block',
    padding: '6px 16px',
    backgroundColor: '#E8F5F3',
    color: 'var(--primary-color)',
    borderRadius: '50px',
    fontSize: '14px',
    fontWeight: 600,
    marginBottom: '20px',
  },
  title: {
    fontSize: '48px',
    fontWeight: 800,
    color: '#1a1a1a',
    marginBottom: '24px',
    lineHeight: '1.2',
  },
  description: {
    fontSize: '18px',
    color: '#666',
    lineHeight: '1.6',
    marginBottom: '40px',
    maxWidth: '600px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  btnGroup: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'center',
  },
  ctaBtn: {
    backgroundColor: 'var(--secondary-color)',
    color: 'white',
    padding: '14px 32px',
    borderRadius: '50px',
    fontSize: '16px',
    fontWeight: 'bold',
    border: 'none',
    boxShadow: '0 4px 15px rgba(255, 146, 138, 0.4)',
  },
  secondaryBtn: {
    backgroundColor: 'transparent',
    color: 'var(--primary-color)',
    padding: '14px 32px',
    borderRadius: '50px',
    fontSize: '16px',
    fontWeight: 'bold',
    border: '2px solid var(--primary-color)',
  },
};

export default Hero;