import React from 'react';

const HowItWorks: React.FC = () => {
  const steps = [
    { num: '01', title: 'Input Data', desc: 'Masukkan usia, berat, dan tinggi badan anak ke dalam sistem.' },
    { num: '02', title: 'Analisis Sistem', desc: 'Sistem menghitung status gizi & BMI berdasarkan standar WHO.' },
    { num: '03', title: 'Dapat Rekomendasi', desc: 'Terima saran menu harian yang tepat sasaran untuk si kecil.' },
  ];

  return (
    <section style={styles.section}>
      <div className="container" style={styles.container}>
        <h2 style={styles.heading}>Cara Kerja Aplikasi</h2>
        <div style={styles.stepsWrapper}>
          {steps.map((step, idx) => (
            <div key={idx} style={styles.stepCard}>
              <div style={styles.number}>{step.num}</div>
              <h3 style={styles.stepTitle}>{step.title}</h3>
              <p style={styles.stepDesc}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  section: {
    padding: '80px 0',
    backgroundColor: '#fff', 
  },
  container: {
    textAlign: 'center',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
  },
  heading: {
    fontSize: '32px',
    color: '#333',
    fontWeight: 'bold',
    marginBottom: '60px',
  },
  stepsWrapper: {
    display: 'flex',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    gap: '30px',
  },
  stepCard: {
    flex: 1,
    minWidth: '250px',
    position: 'relative',
    padding: '20px',
  },
  number: {
    fontSize: '60px',
    fontWeight: '900',
    color: 'var(--secondary-color)', 
    opacity: 0.2,
    position: 'absolute',
    top: -20,
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 1,
  },
  stepTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '10px',
    position: 'relative',
    zIndex: 2,
    color: 'var(--primary-color)',
  },
  stepDesc: {
    color: '#666',
    position: 'relative',
    zIndex: 2,
  }
};

export default HowItWorks;