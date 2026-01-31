import { Hono } from 'hono';
import { cors } from "hono/cors"

const app = new Hono()
  .basePath('api');

app.use(cors({
  origin: "*"
}))

app.get('/ping', (c) => c.json({ message: `Pong! ${Date.now()}` }));

// Gemini News API endpoint
app.post('/gemini-news', async (c) => {
  try {
    const body = await c.req.json();
    const { query } = body;

    if (!query || typeof query !== 'string') {
      return c.json({ error: 'Query is required' }, 400);
    }

    const GEMINI_API_KEY = 'AIzaSyCG1-rWb9owg3YZgptBrxFnO-5deBZiQAk';
    const MODEL = 'gemini-2.0-flash';

    const prompt = `You are a news aggregator. Search for and provide the top 10 most recent and relevant news articles about: ${query}. 
For each article, provide:
- title: A headline for the article
- summary: A comprehensive 300-word summary of the news
- source: The news source name
- publishedDate: When it was published
- url: The source URL if available

Return the response as a valid JSON array of article objects. Focus on the most recent and breaking news.

IMPORTANT: Return ONLY the JSON array, no markdown formatting, no code blocks, just the raw JSON array starting with [ and ending with ].`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          tools: [
            {
              google_search: {},
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);
      return c.json({ error: 'Failed to fetch from Gemini API', details: errorText }, 500);
    }

    const data = await response.json();

    // Extract the text content from Gemini response
    const textContent = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textContent) {
      return c.json({ error: 'No content in Gemini response' }, 500);
    }

    // Parse the JSON from the response
    let articles;
    try {
      // Clean the response - remove markdown code blocks if present
      let cleanedContent = textContent.trim();
      if (cleanedContent.startsWith('```json')) {
        cleanedContent = cleanedContent.slice(7);
      } else if (cleanedContent.startsWith('```')) {
        cleanedContent = cleanedContent.slice(3);
      }
      if (cleanedContent.endsWith('```')) {
        cleanedContent = cleanedContent.slice(0, -3);
      }
      cleanedContent = cleanedContent.trim();

      articles = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', textContent);
      return c.json({ 
        error: 'Failed to parse news articles', 
        rawResponse: textContent 
      }, 500);
    }

    // Ensure articles is an array and has the expected structure
    if (!Array.isArray(articles)) {
      articles = [articles];
    }

    // Normalize article structure
    const normalizedArticles = articles.map((article: Record<string, unknown>, index: number) => ({
      id: `gemini-${Date.now()}-${index}`,
      title: article.title || 'Untitled',
      summary: article.summary || article.description || '',
      source: article.source || 'Unknown Source',
      publishedDate: article.publishedDate || article.date || new Date().toISOString(),
      url: article.url || article.link || '#',
    }));

    return c.json({ 
      success: true,
      articles: normalizedArticles,
      query,
    });

  } catch (error) {
    console.error('Gemini news API error:', error);
    return c.json({ 
      error: 'Internal server error', 
      message: error instanceof Error ? error.message : 'Unknown error' 
    }, 500);
  }
});

// Sarvam AI Text-to-Speech API endpoint
app.post('/sarvam-tts', async (c) => {
  try {
    const body = await c.req.json();
    const { text } = body;

    if (!text || typeof text !== 'string') {
      return c.json({ error: 'Text is required' }, 400);
    }

    const SARVAM_API_KEY = 'sk_i8amxjz9_MdARpKfvIofS4VI6vXSya5Lq';

    const response = await fetch('https://api.sarvam.ai/text-to-speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-subscription-key': SARVAM_API_KEY,
      },
      body: JSON.stringify({
        inputs: [text],
        target_language_code: 'en-IN',
        speaker: 'meera',
        pace: 1.3,
        speech_sample_rate: 22050,
        enable_preprocessing: true,
        model: 'bulbul:v2',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Sarvam TTS API error:', errorText);
      return c.json({ error: 'Failed to generate audio', details: errorText }, 500);
    }

    const data = await response.json();

    // Sarvam returns audio as base64 in the audios array
    const audioBase64 = data?.audios?.[0];

    if (!audioBase64) {
      return c.json({ error: 'No audio in response' }, 500);
    }

    return c.json({
      success: true,
      audio: audioBase64,
    });

  } catch (error) {
    console.error('Sarvam TTS API error:', error);
    return c.json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

export default app;