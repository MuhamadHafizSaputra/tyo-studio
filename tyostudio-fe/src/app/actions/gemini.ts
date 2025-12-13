'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || '');

export async function generateFoodRecommendations(
  age: number,
  weight: number,
  height: number,
  gender: string,
  status: string
) {
  if (!apiKey) {
    console.error('Gemini API Key is missing');
    return {
      error: 'Konfigurasi API Key belum terpasang. Hubungi administrator.',
      recommendations: []
    };
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = `
    Bertindaklah sebagai ahli gizi anak profesional.
    Buatlah 6 rekomendasi menu makanan spesifik khusus untuk balita dan anak (sarapan, makan siang, makan malam, camilan) untuk anak dengan data berikut:
    - Umur: ${age} bulan
    - Berat: ${weight} kg
    - Tinggi: ${height} cm
    - Jenis Kelamin: ${gender}
    - Status Gizi (Z-Score): ${status}

    Menu harus disesuaikan dengan status gizinya (misal: jika stunting/kurus, fokus tinggi protein & kalori).
    Gunakan bahan makanan lokal Indonesia yang mudah didapat dan terjangkau.
    
    Format output HARUS berupa JSON array murni tanpa markdown block code. 
    Setiap objek dalam array memiliki properti:
    - name: Nama hidangan (String)
    - calories: Perkiraan kalori (Number/String)
    - protein: Perkiraan protein dalam gram (String)
    - fats: Perkiraan lemak dalam gram (String)
    - description: Penjelasan singkat kenapa menu ini bagus (String)

    Contoh output yang diharapkan:
    [
      { "name": "Bubur Ikan Kembung", "calories": "200", "protein": "15", "fats": "5", "description": "Tinggi protein hewani untuk pertumbuhan." },
      ...
    ]
  `;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Clean up potential markdown code blocks if the model adds them
    let cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();

    const recommendations = JSON.parse(cleanText);
    return { recommendations };
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return {
      error: 'Gagal membuat rekomendasi menu. Silakan coba lagi nanti.',
      recommendations: []
    };
  }
}
