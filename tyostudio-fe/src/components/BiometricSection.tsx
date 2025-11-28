import React from 'react';

const BiometricSection: React.FC = () => {
  return (
    <section className="container" style={styles.section}>
      <div style={styles.grid}>
        {/* Bagian Kiri: Placeholder Grafik */}
        <div style={styles.chartContainer}>
            {/* Menggunakan div placeholder untuk grafik */}
            <div style={styles.fakeChart}>
                <p style={{textAlign: 'center', color: '#aaa'}}>Chart Visualization Placeholder</p>
                {/* Kamu bisa mengganti ini dengan library chart seperti Recharts nanti */}
            </div>
        </div>

        {/* Bagian Kanan: Teks */}
        <div style={styles.textContainer}>
          <p style={styles.paragraph}>
            Visualisasi data biometrik di samping merepresentasikan fluktuasi indeks massa tubuh (BMI) 
            dan parameter pertumbuhan dalam kurun waktu 12 bulan terakhir.
          </p>
          <p style={styles.paragraph}>
            Sistem mengagregasi data harian untuk membentuk pola tren yang akurat, 
            memungkinkan deteksi dini terhadap defisit kalori atau lonjakan berat badan yang tidak wajar.
          </p>
        </div>
      </div>
    </section>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  section: {
    padding: '60px 0',
  },
  grid: {
    display: 'flex',
    gap: '50px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  chartContainer: {
    flex: 1,
    minWidth: '300px',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
  },
  fakeChart: {
      width: '100%',
      height: '250px',
      backgroundColor: '#f9f9f9',
      border: '1px dashed #ddd',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
  },
  textContainer: {
    flex: 1,
    minWidth: '300px',
  },
  paragraph: {
    marginBottom: '15px',
    lineHeight: '1.6',
    color: '#333',
    textAlign: 'justify' as const,
  },
};

export default BiometricSection;