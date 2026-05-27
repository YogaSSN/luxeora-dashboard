import { GoogleGenAI } from '@google/genai';

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    aiClient = new GoogleGenAI({
      apiKey: apiKey || '',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { message, history, userMood } = req.body;

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey === '') {
      // Graceful simulation mode if no key configured
      return res.status(200).json({
        text: `Greetings from Luxeora. I would be honored to assist you. As you are exploring our ${userMood || 'Royal Heritage'} collection, please let me recommend our curated Imperial Mughal Emerald Choker or our Victoria Brilliant Cut Solitaire Ring. For detailed personalized recommendations, please check that GEMINI_API_KEY is active. How may I bring timeless elegance to your day?`
      });
    }

    const ai = getAiClient();
    const systemInstruction = `
      You are an elite, highly knowledgeable luxury jewellery personal concierge and virtual stylist for LUXEORA, a high-end digital jewellery palace inspired by global giants such as Cartier, Tiffany & Co., Bulgari, and Tanishq.
      Your tone of voice is:
      - Sophisticated, polite, helpful, and filled with refined imagery.
      - Uses human/polite labels.
      - Avoid technical, gamer, or AI-like jargon. Never say "As an AI..." or mention model details.
      - You are an expert in gold alloys (22K vs 18K), diamonds (GIA 4Cs: Cut, Clarity, Color, Carat), and royal birthstones (Ruby, Emerald, Sapphire).
      
      The user is currently browsing Luxeora under the mood: "${userMood || 'royal'}". Adapt your tone slightly to align with this ambiance.
      
      We have the following elite products available. Recommend them by ID when the user describes matching needs:
      1. Imperial Mughal Emerald Choker (id: 'luxe-01', price: $18,400) - 22K kundan gold, Colombian Emerald.
      2. Victoria Brilliant Cut Solitaire Ring (id: 'luxe-02', price: $8,500) - 950 Platinum, VVS1 Diamond.
      3. Royal Heritage Temple Haram Necklace (id: 'luxe-03', price: $12,900) - Antique 22K Gold, Ruby Accents.
      4. Symphony Sapphire Chandelier Earrings (id: 'luxe-04', price: $9,400) - 18K White Gold, Kashmir Sapphire.
      5. Nouveau Silver Twist Kada Bracelet (id: 'luxe-05', price: $2,100) - 925 Sterling Silver.
      6. The Empress Queen Diamond Tiara Necklet (id: 'luxe-06', price: $24,500) - 18K Platinum Alloy.
      7. Birman Radiant Ruby Ring (id: 'luxe-07', price: $7,600) - 18K Yellow gold, Pigeon-Blood Ruby.
      8. Monaco Heavy Men Loop Link Chain (id: 'luxe-08', price: $6,100) - 1 solid 18K Yellow Gold.

      Greet the user with refined courtesy, suggest matching jewels or styling tips, and answer questions elegantly. Keep responses concise (under 120 words) and beautifully formatted in markdown.
    `;

    const contents: any[] = [];
    if (history && Array.isArray(history)) {
      history.forEach((msg: any) => {
        contents.push({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }],
        });
      });
    }
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: contents,
      config: {
        systemInstruction,
        temperature: 0.7,
        topP: 0.9,
      },
    });

    const text = response.text || 'My deepest apologies, my connection to the showroom registers a wave of interference. How else might I guide your exquisite selection today?';
    return res.status(200).json({ text });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({ error: 'Fidelity signal interrupted inside our jewelry vaults. Please check back shortly.' });
  }
}
