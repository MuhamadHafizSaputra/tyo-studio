import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Tipe data untuk Log Makanan
interface FoodLog {
  id: number;
  name: string;
  calories: number;
  time: string;
}

const CalculatorIMT: React.FC = () => {
  // State untuk Data Anak
  const [childData, setChildData] = useState({
    name: '',
    age: '', // dalam bulan
    gender: 'male',
    weight: '', // kg
    height: '', // cm
  });

  // State untuk Hasil Perhitungan
  const [result, setResult] = useState<{
    bmi: string;
    status: string;
    stuntingStatus: string;
    advice: string;
  } | null>(null);

  // State untuk Input Makanan
  const [foodInput, setFoodInput] = useState({ name: '', calories: '' });
  const [foodLogs, setFoodLogs] = useState<FoodLog[]>([]);

  // Logika Perhitungan (Simulasi Sederhana Standar WHO)
  const calculateHealth = (e: React.FormEvent) => {
    e.preventDefault();
    const weight = parseFloat(childData.weight);
    const height = parseFloat(childData.height); // cm
    const heightM = height / 100; // meter

    if (!weight || !height) return;

    // 1. Hitung BMI
    const bmiValue = weight / (heightM * heightM);
    let bmiStatus = '';
    let adviceText = '';

    if (bmiValue < 18.5) {
      bmiStatus = 'Gizi Kurang (Underweight)';
      adviceText = 'Perbanyak asupan protein hewani (telur, ikan, daging) dan karbohidrat kompleks. Tambahkan porsi makan secara bertahap.';
    } else if (bmiValue >= 18.5 && bmiValue < 24.9) {
      bmiStatus = 'Gizi Baik (Normal)';
      adviceText = 'Pertahankan pola makan seimbang. Pastikan variasi makanan agar kebutuhan mikronutrien tetap terpenuhi.';
    } else {
      bmiStatus = 'Gizi Lebih (Overweight)';
      adviceText = 'Kurangi makanan tinggi gula dan lemak jenuh. Perbanyak aktivitas fisik dan konsumsi sayuran.';
    }

    // 2. Simulasi Deteksi Stunting (Sangat Disederhanakan untuk Demo)
    // Rumus ideal kasar: Tinggi ~ (Umur(thn) * 6) + 77 (Hanya contoh heuristik, bukan standar medis akurat)
    const ageMonth = parseFloat(childData.age);
    const ageYear = ageMonth / 12;
    const idealHeightMin = (ageYear * 5) + 75; // Contoh ambang batas bawah kasar
    
    let stuntingLabel = 'Normal (Tumbuh Baik)';
    if (height < idealHeightMin * 0.9) {
        stuntingLabel = 'Berisiko Stunting';
        adviceText += ' Perhatian: Tinggi badan anak di bawah rata-rata seusianya. Konsultasikan dengan dokter anak dan fokus pada asupan Zinc & Kalsium.';
    }

    setResult({
      bmi: bmiValue.toFixed(1),
      status: bmiStatus,
      stuntingStatus: stuntingLabel,
      advice: adviceText,
    });
  };

  // Fitur Tambah Makanan
  const handleAddFood = () => {
    if (!foodInput.name || !foodInput.calories) return;
    const newLog: FoodLog = {
      id: Date.now(),
      name: foodInput.name,
      calories: parseInt(foodInput.calories),
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };
    setFoodLogs([...foodLogs, newLog]);
    setFoodInput({ name: '', calories: '' });
  };

  return (
    <div style={{ backgroundColor: '#F3F9FA', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main className="container" style={{ padding: '40px 20px', flex: 1 }}>
        <h1 style={styles.pageTitle}>Kalkulator Kesehatan & Nutrisi</h1>
        <p style={styles.pageSubtitle}>Pantau tumbuh kembang anak dan catat asupan nutrisi hariannya.</p>

        <div style={styles.gridContainer}>
          {/* KOLOM KIRI: INPUT DATA ANAK */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>👶 Data Anak</h3>
            <form onSubmit={calculateHealth} style={styles.form}>
              <div style={styles.formGroup}>
                <label>Nama Anak</label>
                <input 
                  type="text" 
                  style={styles.input} 
                  value={childData.name}
                  onChange={(e) => setChildData({...childData, name: e.target.value})}
                  placeholder="Contoh: Budi"
                />
              </div>
              <div style={styles.row}>
                <div style={styles.formGroup}>
                  <label>Usia (Bulan)</label>
                  <input 
                    type="number" 
                    style={styles.input} 
                    value={childData.age}
                    onChange={(e) => setChildData({...childData, age: e.target.value})}
                    placeholder="12"
                  />
                </div>
                <div style={styles.formGroup}>
                    <label>Jenis Kelamin</label>
                    <select 
                        style={styles.input}
                        value={childData.gender}
                        onChange={(e) => setChildData({...childData, gender: e.target.value})}
                    >
                        <option value="male">Laki-laki</option>
                        <option value="female">Perempuan</option>
                    </select>
                </div>
              </div>
              <div style={styles.row}>
                <div style={styles.formGroup}>
                  <label>Berat (kg)</label>
                  <input 
                    type="number" 
                    style={styles.input} 
                    value={childData.weight}
                    onChange={(e) => setChildData({...childData, weight: e.target.value})}
                    placeholder="10.5"
                  />
                </div>
                <div style={styles.formGroup}>
                  <label>Tinggi (cm)</label>
                  <input 
                    type="number" 
                    style={styles.input} 
                    value={childData.height}
                    onChange={(e) => setChildData({...childData, height: e.target.value})}
                    placeholder="85"
                  />
                </div>
              </div>
              <button type="submit" style={styles.buttonPrimary}>Hitung Status Gizi</button>
            </form>
          </div>

          {/* KOLOM KANAN: HASIL ANALISIS */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>📊 Hasil Analisis</h3>
            {result ? (
              <div style={styles.resultBox}>
                <div style={styles.scoreRow}>
                    <div style={styles.scoreItem}>
                        <span style={styles.label}>IMT / BMI</span>
                        <span style={styles.bigValue}>{result.bmi}</span>
                    </div>
                    <div style={styles.scoreItem}>
                        <span style={styles.label}>Status Berat</span>
                        <span style={{...styles.badge, 
                            backgroundColor: result.status.includes('Normal') ? '#E8F5F3' : '#FFEEEE',
                            color: result.status.includes('Normal') ? '#267765' : '#D9534F'
                        }}>
                            {result.status}
                        </span>
                    </div>
                </div>
                
                <div style={{marginTop: '20px'}}>
                    <span style={styles.label}>Prediksi Tinggi (Stunting)</span>
                    <div style={{
                        padding: '10px', 
                        backgroundColor: result.stuntingStatus.includes('Normal') ? '#E8F5F3' : '#FFF4E5',
                        color: result.stuntingStatus.includes('Normal') ? '#267765' : '#FF8C00',
                        fontWeight: 'bold',
                        borderRadius: '8px',
                        marginTop: '5px'
                    }}>
                        {result.stuntingStatus}
                    </div>
                </div>

                <div style={styles.adviceBox}>
                    <strong>💡 Saran Nutrisi:</strong>
                    <p style={{marginTop: '5px', lineHeight: '1.5'}}>{result.advice}</p>
                </div>
              </div>
            ) : (
              <div style={styles.emptyState}>
                <p>Masukkan data di samping untuk melihat hasil analisis kesehatan anak.</p>
              </div>
            )}
          </div>
        </div>

        {/* SECTION BAWAH: JURNAL MAKANAN */}
        <div style={{...styles.card, marginTop: '30px'}}>
            <h3 style={styles.cardTitle}>🥗 Jurnal Makanan & Nutrisi Harian</h3>
            <div style={styles.foodContainer}>
                {/* Input Makanan */}
                <div style={styles.foodInputSection}>
                    <input 
                        type="text" 
                        style={styles.input} 
                        placeholder="Nama Makanan (misal: Bubur Ayam)"
                        value={foodInput.name}
                        onChange={(e) => setFoodInput({...foodInput, name: e.target.value})}
                    />
                    <input 
                        type="number" 
                        style={styles.input} 
                        placeholder="Kalori (kkal)"
                        value={foodInput.calories}
                        onChange={(e) => setFoodInput({...foodInput, calories: e.target.value})}
                    />
                    <button onClick={handleAddFood} style={styles.buttonSecondary}>+ Tambah</button>
                </div>

                {/* List Makanan */}
                <div style={styles.foodList}>
                    {foodLogs.length === 0 && <p style={{color: '#888', fontStyle: 'italic'}}>Belum ada data makanan hari ini.</p>}
                    
                    {foodLogs.map((log) => (
                        <div key={log.id} style={styles.foodItem}>
                            <div>
                                <strong>{log.name}</strong>
                                <span style={{fontSize: '12px', color: '#666', marginLeft: '10px'}}>Jam {log.time}</span>
                            </div>
                            <div style={{fontWeight: 'bold', color: 'var(--primary-color)'}}>
                                {log.calories} kkal
                            </div>
                        </div>
                    ))}
                    
                    {foodLogs.length > 0 && (
                        <div style={styles.totalRow}>
                            <span>Total Kalori Hari Ini:</span>
                            <span>{foodLogs.reduce((acc, curr) => acc + curr.calories, 0)} kkal</span>
                        </div>
                    )}
                </div>
            </div>
        </div>

      </main>

      <Footer />
    </div>
  );
};

// Styles
const styles: { [key: string]: React.CSSProperties } = {
  pageTitle: {
    textAlign: 'center',
    color: 'var(--primary-color)',
    fontSize: '32px',
    marginBottom: '10px',
  },
  pageSubtitle: {
    textAlign: 'center',
    color: '#666',
    marginBottom: '40px',
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '30px',
  },
  card: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  },
  cardTitle: {
    marginBottom: '20px',
    color: '#333',
    borderBottom: '2px solid #F3F9FA',
    paddingBottom: '10px',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  row: { display: 'flex', gap: '15px' },
  formGroup: { flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' },
  input: {
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '14px',
    width: '100%',
    boxSizing: 'border-box',
  },
  buttonPrimary: {
    backgroundColor: 'var(--primary-color)',
    color: 'white',
    padding: '12px',
    borderRadius: '8px',
    fontWeight: 'bold',
    marginTop: '10px',
  },
  buttonSecondary: {
    backgroundColor: 'var(--secondary-color)',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '8px',
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
  },
  emptyState: {
    height: '200px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    color: '#999',
    backgroundColor: '#FAFAFA',
    borderRadius: '12px',
    border: '1px dashed #ddd',
  },
  resultBox: { animation: 'fadeIn 0.5s' },
  scoreRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px' },
  scoreItem: { display: 'flex', flexDirection: 'column', gap: '5px' },
  label: { fontSize: '12px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' },
  bigValue: { fontSize: '28px', fontWeight: '800', color: 'var(--primary-color)' },
  badge: { padding: '5px 12px', borderRadius: '50px', fontSize: '12px', fontWeight: 'bold' },
  adviceBox: { marginTop: '20px', padding: '15px', backgroundColor: '#FFF8F0', borderRadius: '8px', borderLeft: '4px solid var(--secondary-color)', fontSize: '14px' },
  
  // Styles for Food Log
  foodContainer: { display: 'flex', flexDirection: 'column', gap: '20px' },
  foodInputSection: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
  foodList: { borderTop: '1px solid #eee', paddingTop: '10px' },
  foodItem: { display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f5f5f5' },
  totalRow: { display: 'flex', justifyContent: 'space-between', padding: '15px 0', fontWeight: 'bold', fontSize: '18px', borderTop: '2px solid #eee', marginTop: '10px' },
};

export default CalculatorIMT;