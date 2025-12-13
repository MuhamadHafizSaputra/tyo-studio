'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@/utils/supabase/server'; // Use server client for actions
import { FALLBACK_RECOMMENDATIONS } from '@/constants/foodDefaults';

// export async function generateFoodRecommendations...

export async function generateFoodRecommendations(
  age: number,
  weight: number,
  height: number,
  gender: string,
  status: string,
  location: string = 'Indonesia',
  childId?: string // Optional for backward compatibility, but required for caching
): Promise<{ recommendations: any[], error?: string, isFallback?: boolean }> {
  // Removed single API key check

  const prompt = `
    Bertindaklah sebagai ahli gizi anak profesional.
    Buatlah 4 rekomendasi menu makanan spesifik (sarapan, makan siang, makan malam, camilan) untuk anak dengan data berikut:
    - Umur: ${age} bulan
    - Berat: ${weight} kg
    - Tinggi: ${height} cm
    - Jenis Kelamin: ${gender}
    - Status Gizi (Z-Score): ${status}
    - Lokasi/Kota Tempat Tinggal: ${location}

    PENTING:
    1. Menu HARUS disesuaikan dengan status gizinya (misal: jika stunting/kurus, fokus tinggi protein & kalori).
    2. Berikan prioritas pada MAKANAN LOKAL atau KHAS dari daerah "${location}" jika relevan dan bergizi. 
       Contoh: Jika lokasi "Tegal", sarankan "Telur Asin" atau olahan lokal lainnya yang sesuai untuk anak.
       Jika lokasi tidak spesifik atau tidak ada makanan khas yang cocok untuk anak, gunakan makanan umum Indonesia.
    3. Bahan makanan harus mudah didapat dan terjangkau.
    
    Format output HARUS berupa JSON array murni tanpa markdown block code. 
    Setiap objek dalam array memiliki properti:
    - name: Nama hidangan (String)
    - calories: Perkiraan kalori (Number/String)
    - protein: Perkiraan protein dalam gram (String)
    - fats: Perkiraan lemak dalam gram (String)
    - description: Penjelasan singkat kenapa menu ini bagus dan relevansinya dengan lokasi/kondisi anak (String)

    Contoh output yang diharapkan:
    [
      { "name": "Bubur Ikan Kembung", "calories": "200", "protein": "15", "fats": "5", "description": "Tinggi protein hewani untuk pertumbuhan." },
      ...
    ]
  `;

  // 1. Check Cache (if childId is provided)
  if (childId) {
    const supabase = await createClient(); // Ensure you await if your client creation is async, or use standard createClient

    // Check for recent recommendations (e.g., last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: cachedData } = await supabase
      .from('child_recommendations')
      .select('recommendations, created_at')
      .eq('child_id', childId)
      .gte('created_at', sevenDaysAgo.toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (cachedData && cachedData.recommendations) {
      console.log(`[Gemini] Returning cached recommendations for child ${childId}`);
      return { recommendations: cachedData.recommendations };
    }
  }

  // 3. API Key Rotation Logic
  const apiKeys = (process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY || '').split(',').map(k => k.trim()).filter(Boolean);
  console.log(`[Gemini] Found ${apiKeys.length} API keys available for rotation.`);

  if (apiKeys.length === 0) {
    console.error('No Gemini API keys found.');
    return { recommendations: FALLBACK_RECOMMENDATIONS, isFallback: true };
  }

  let lastError: any = null;

  for (const key of apiKeys) {
    try {
      // Create a fresh instance for each key
      const keySpecificGenAI = new GoogleGenerativeAI(key);
      const model = keySpecificGenAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

      console.log(`[Gemini] Attempting generation with key ending in...${key.slice(-4)}`);

      const result = await model.generateContent(prompt);
      const text = result.response.text();

      // Clean up potential markdown code blocks
      let cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const recommendations = JSON.parse(cleanText);

      // 4. Save to Cache (if childId provided and successful)
      if (childId && recommendations.length > 0) {
        const supabase = await createClient();
        await supabase.from('child_recommendations').insert({
          child_id: childId,
          recommendations: recommendations
        });
        console.log(`[Gemini] Cached new recommendations for child ${childId}`);
      }

      // Success! Return immediately
      return { recommendations };

    } catch (error: any) {
      console.warn(`[Gemini] Error with key ...${key.slice(-4)}: ${error.message}`);
      lastError = error;

      // Only continue loop if it is a Quota/429 error
      const isQuotaError = error.message?.includes('429') || error.message?.includes('quota') || error.message?.includes('ResourceExhausted');

      console.log(`[Gemini] Key ...${key.slice(-4)} failed. Is Quota Error? ${isQuotaError}. Message: ${error.message}`);

      if (isQuotaError) {
        console.log('-> Quota exhausted, switching to next key...');
        continue;
      }

      // If it's another error (like 500 or blocked content), stop trying to save time
      break;
    }
  }

  // If we get here, all keys failed
  console.warn('All Gemini API keys exhausted or failed. Returning fallback.');
  return {
    recommendations: FALLBACK_RECOMMENDATIONS,
    isFallback: true
  };
}
