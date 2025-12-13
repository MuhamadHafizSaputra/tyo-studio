'use server';

// import { GoogleGenerativeAI } from '@google/generative-ai'; // Removed for Groq
import { createClient } from '@/utils/supabase/server';
import { FALLBACK_RECOMMENDATIONS } from '@/constants/foodDefaults';

// const GROQ_API_KEY = process.env.GROQ_API_KEY; // Replaced by rotation logic

export async function generateFoodRecommendations(
  age: number,
  weight: number,
  height: number,
  gender: string,
  status: string,
  location: string = 'Indonesia',
  childId?: string
): Promise<{ recommendations: any[], error?: string, isFallback?: boolean, suppressNotification?: boolean }> {

  // 1. Check Cache
  if (childId) {
    const supabase = await createClient();
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
      console.log(`[Groq] Returning cached recommendations for child ${childId}`);
      return { recommendations: cachedData.recommendations };
    }
  }

  // 2. Auth Check & Fallback for Non-Logged In Users
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    console.log('[Groq] User not logged in, returning static fallback recommendations.');
    return {
      recommendations: FALLBACK_RECOMMENDATIONS,
      isFallback: false,
      suppressNotification: true // Signal frontend to stay silent
    };
  }

  // 3. API Key Rotation Logic
  const apiKeys = (process.env.GROQ_API_KEYS || process.env.GROQ_API_KEY || '').split(',').map(k => k.trim()).filter(Boolean);

  if (apiKeys.length === 0) {
    console.error('No Groq API keys found.');
    return {
      error: 'Konfigurasi API Key (Groq) belum terpasang.',
      recommendations: FALLBACK_RECOMMENDATIONS, // Return fallback so app works
      isFallback: true
    };
  }

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
    1. Menu HARUS disesuaikan dengan status gizinya.
    2. Berikan prioritas pada MAKANAN LOKAL daerah "${location}".
    3. Bahan makanan mudah didapat.
    
    OUTPUT JSON FORMAT ONLY:
    [
      { "name": "Nama Menu", "calories": "200", "protein": "10", "fats": "5", "description": "Alasan..." }
    ]
  `;

  let lastError: any = null;

  for (const key of apiKeys) {
    try {
      console.log(`[Groq] Attempting generation with key ending in...${key.slice(-4)}`);

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile", // Latest supported model
          messages: [
            { role: "system", content: "You are a helpful nutritionist API that outputs only valid JSON." },
            { role: "user", content: prompt }
          ],
          // response_format: { type: "json_object" }, // Removed to avoid 400 errors
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error(`[Groq] API Error Body: ${errorBody}`);
        throw new Error(`Groq API Error: ${response.status} ${response.statusText} - ${errorBody}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;

      if (!content) {
        throw new Error('No content received from Groq');
      }

      // Parse JSON
      let recommendations;
      try {
        // Handle case where Llama might wrap in { "recommendations": [...] } or just [...]
        const parsed = JSON.parse(content);
        recommendations = Array.isArray(parsed) ? parsed : (parsed.recommendations || parsed.menu || []);

        if (!Array.isArray(recommendations) || recommendations.length === 0) {
          // Fallback parsing strategy if structure is unexpected
          console.warn('[Groq] Unexpected JSON structure:', parsed);
          throw new Error('Invalid JSON structure');
        }
      } catch (e) {
        console.error('[Groq] JSON Parse Error:', e);
        // Last ditch effort to find array in string if "json_object" mode wasn't perfect
        const match = content.match(/\[[\s\S]*\]/);
        if (match) {
          recommendations = JSON.parse(match[0]);
        } else {
          throw e;
        }
      }

      // 3. Save to Cache
      if (childId && recommendations.length > 0) {
        const supabase = await createClient();
        await supabase.from('child_recommendations').insert({
          child_id: childId,
          recommendations: recommendations
        });
        console.log(`[Groq] Cached new recommendations for child ${childId}`);
      }

      // Success! Return
      return { recommendations };

    } catch (error: any) {
      console.warn(`[Groq] Error with key ...${key.slice(-4)}: ${error.message}`);
      lastError = error;

      // Continue to next key if it's an API error
      console.log('-> API Error, switching to next key...');
      continue;
    }
  }

  // If we get here, all keys failed
  console.error('[Groq] All keys exhausted.', lastError);
  return {
    recommendations: FALLBACK_RECOMMENDATIONS,
    isFallback: true,
    error: lastError?.message
  };

}
