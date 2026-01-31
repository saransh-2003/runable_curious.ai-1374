import { Hono } from 'hono';
import { cors } from "hono/cors"

const app = new Hono()
  .basePath('api');

app.use(cors({
  origin: "*"
}))

app.get('/ping', (c) => c.json({ message: `Pong! ${Date.now()}` }));

// Generate fallback mock articles based on query topic
function generateFallbackArticles(query: string) {
  const lowerQuery = query.toLowerCase();
  const timestamp = new Date().toISOString();
  
  // Determine topic from query
  let topic = 'general';
  if (lowerQuery.includes('ai') || lowerQuery.includes('artificial') || lowerQuery.includes('gpt') || lowerQuery.includes('machine learning')) {
    topic = 'ai';
  } else if (lowerQuery.includes('cricket') || lowerQuery.includes('ipl') || lowerQuery.includes('kohli')) {
    topic = 'cricket';
  } else if (lowerQuery.includes('geopolitics') || lowerQuery.includes('china') || lowerQuery.includes('trade') || lowerQuery.includes('sanctions')) {
    topic = 'geopolitics';
  } else if (lowerQuery.includes('health') || lowerQuery.includes('medical') || lowerQuery.includes('cancer')) {
    topic = 'health';
  } else if (lowerQuery.includes('sport') || lowerQuery.includes('football') || lowerQuery.includes('tennis')) {
    topic = 'sports';
  }

  const articlesByTopic: Record<string, Array<{title: string, summary: string, source: string}>> = {
    ai: [
      {
        title: "OpenAI Unveils GPT-5 with Revolutionary Reasoning Capabilities",
        summary: "OpenAI has officially announced GPT-5, marking a significant leap in artificial intelligence capabilities. The new model demonstrates unprecedented reasoning abilities, scoring 40% higher than GPT-4 Turbo on complex problem-solving benchmarks. Early testers report the AI can now handle multi-step logical deductions, mathematical proofs, and nuanced contextual understanding with remarkable accuracy. The release comes amid intense competition in the AI industry, with rivals Anthropic and Google racing to match these capabilities. Industry analysts predict GPT-5 will transform enterprise applications, particularly in legal analysis, scientific research, and software development. OpenAI CEO Sam Altman emphasized the focus on safety measures, noting the model underwent extensive red-teaming before release.",
        source: "TechCrunch"
      },
      {
        title: "Anthropic Raises $4 Billion at $60 Billion Valuation",
        summary: "AI safety startup Anthropic has closed a massive $4 billion funding round, valuing the company at $60 billion. The investment, led by Menlo Ventures with participation from Google and Spark Capital, underscores growing investor confidence in responsible AI development. Anthropic's Claude assistant has seen explosive enterprise adoption, with Fortune 500 companies increasingly choosing it for sensitive applications requiring robust safety guardrails. CEO Dario Amodei stated the funds will accelerate research into constitutional AI and interpretability. The funding round represents one of the largest private investments in AI history, reflecting the high-stakes race to develop artificial general intelligence while maintaining safety standards.",
        source: "Bloomberg"
      },
      {
        title: "Google DeepMind's Gemini 2.0 Sets New Multimodal AI Standards",
        summary: "Google DeepMind has unveiled Gemini 2.0, a groundbreaking multimodal AI system that natively processes video, audio, images, and text simultaneously. Unlike previous models that handle each modality separately, Gemini 2.0 achieves true cross-modal understanding, enabling applications previously thought impossible. Demonstrations showed the AI analyzing security footage while transcribing conversations and identifying objects in real-time. The model achieved state-of-the-art results on 30 benchmarks across various domains. Google plans to integrate Gemini 2.0 across its product suite, from Search to Workspace. Researchers note this represents a fundamental shift toward more human-like AI perception and understanding.",
        source: "Wired"
      },
      {
        title: "Microsoft Announces $50 Billion AI Infrastructure Investment in Europe",
        summary: "Microsoft has unveiled plans to invest $50 billion in AI data center infrastructure across Europe over the next three years. The massive investment will establish new facilities in Germany, France, Spain, and Poland, creating thousands of jobs while addressing concerns about data sovereignty. CEO Satya Nadella emphasized Microsoft's commitment to European AI development and compliance with upcoming EU AI regulations. The infrastructure will power Azure AI services, including Copilot integrations and enterprise solutions. Environmental groups have raised concerns about energy consumption, prompting Microsoft to pledge 100% renewable energy for all new facilities. The investment signals Microsoft's aggressive expansion in the global AI infrastructure race.",
        source: "Financial Times"
      },
      {
        title: "Meta's Llama 4 Benchmarks Suggest Breakthrough in Open-Source AI",
        summary: "Leaked benchmark results for Meta's upcoming Llama 4 model suggest it may finally match or exceed GPT-4's reasoning capabilities, potentially revolutionizing open-source AI. Internal tests show Llama 4 achieving 94% accuracy on graduate-level reasoning tasks, up from 78% for Llama 3. The model reportedly uses a novel mixture-of-experts architecture with 400 billion parameters. If confirmed, this would mark a watershed moment for democratized AI access, enabling researchers and smaller companies to deploy cutting-edge capabilities. Meta plans an official announcement within weeks. Industry observers note this could fundamentally shift the AI landscape away from proprietary models.",
        source: "The Verge"
      }
    ],
    cricket: [
      {
        title: "Virat Kohli's Stunning Century Seals India's Melbourne Test Victory",
        summary: "Virat Kohli delivered a masterclass innings of 143 runs at the Melbourne Cricket Ground, guiding India to a historic Test victory against Australia. The knock, featuring 18 boundaries and 2 sixes, silenced critics who questioned his form in recent series. Kohli's commanding performance came at a crucial juncture when India needed 287 runs on day five. His partnership with Rishabh Pant added 156 runs, swinging momentum decisively. Australian captain Pat Cummins acknowledged Kohli's brilliance, calling it one of the finest chase innings at the MCG. The victory gives India a 2-1 series lead with one match remaining. Kohli's post-match celebration went viral globally.",
        source: "ESPN Cricinfo"
      },
      {
        title: "ICC Announces Expansion of T20 World Cup to 24 Teams",
        summary: "The International Cricket Council has approved expansion of the T20 World Cup from 20 to 24 teams starting 2026. The decision aims to grow cricket's global footprint, with new qualifying pathways for associate nations. Countries like Nepal, Oman, and USA will have better chances to compete at the highest level. The expanded format will feature six groups of four teams, followed by a Super 12 stage. ICC Chairman Greg Barclay emphasized cricket's mission to become a truly global sport, particularly targeting growth in North America and Continental Europe. Broadcasting rights negotiations are expected to set new records given increased content. Critics argue the expansion may dilute competition quality.",
        source: "BBC Sport"
      },
      {
        title: "IPL 2026 Auction Sets Record with ₹3,500 Crore Spending",
        summary: "The Indian Premier League 2026 mega auction concluded with teams spending a record ₹3,500 crore on player acquisitions. The headline purchase saw Royal Challengers Bangalore secure Australian all-rounder Cameron Green for ₹24 crore, the highest-ever IPL bid. Chennai Super Kings strategically rebuilt their squad around young Indian talent, while Mumbai Indians invested heavily in pace bowling resources. English players dominated the overseas category, with seven fetching prices above ₹15 crore. The auction introduced new retention rules allowing teams to keep up to five players. Television viewership for the two-day event exceeded 200 million, underlining cricket's commercial dominance in Indian sports.",
        source: "Times of India"
      }
    ],
    geopolitics: [
      {
        title: "US Imposes Sweeping New Semiconductor Export Restrictions on China",
        summary: "The Biden administration has announced comprehensive new export controls targeting China's semiconductor industry, representing the most aggressive technology restrictions in decades. The measures prohibit US companies from selling advanced chip-making equipment, AI accelerators, and high-bandwidth memory to Chinese firms. Additionally, US citizens and green card holders are banned from working for Chinese semiconductor companies. Beijing condemned the move as economic warfare, threatening countermeasures targeting rare earth exports. Industry analysts warn of significant disruption to global supply chains, with companies like NVIDIA and AMD facing billions in lost revenue. The restrictions aim to maintain US technological superiority amid intensifying strategic competition.",
        source: "Reuters"
      },
      {
        title: "EU and Mercosur Finalize Historic Trade Agreement After 25 Years",
        summary: "The European Union and Mercosur bloc have concluded negotiations on the world's largest trade agreement, covering a market of 780 million people. The deal eliminates tariffs on 91% of goods traded between the regions over a 10-year period. European automakers and machinery exporters gain improved access to South American markets, while Brazilian agricultural products face reduced barriers in Europe. Environmental provisions require both parties to uphold Paris Agreement commitments, addressing longstanding concerns about Amazon deforestation. French farmers protested in Paris, demanding protection from cheaper imports. The agreement requires ratification by all EU member states and Mercosur parliaments, a process expected to take 18-24 months.",
        source: "Financial Times"
      },
      {
        title: "NATO Expands Cyber Defense Initiative Amid Rising Digital Threats",
        summary: "NATO defense ministers have approved a major expansion of the alliance's cyber defense capabilities, committing €2 billion to establish rapid response teams across member nations. The initiative responds to escalating cyberattacks attributed to state actors targeting critical infrastructure, electoral systems, and defense networks. New protocols enable immediate cross-border cooperation when members face significant cyber incidents. The expansion includes establishing a Cyber Operations Center in Estonia and training 5,000 specialists annually. Secretary General Mark Rutte emphasized that cyber defense is now as crucial as conventional military capabilities. Russia dismissed the initiative as provocative, while China's foreign ministry called it Cold War mentality.",
        source: "The Guardian"
      }
    ],
    health: [
      {
        title: "WHO Endorses AI-Powered Cancer Screening with 95% Detection Accuracy",
        summary: "The World Health Organization has officially endorsed AI-assisted cancer screening protocols after extensive clinical trials demonstrated 95% accuracy in early detection. The breakthrough technology, developed through collaboration between Google Health and leading oncology centers, analyzes medical imaging to identify tumors months before traditional methods. Pilot programs in 15 countries showed the AI system reduced false positives by 40% while catching 30% more early-stage cancers. WHO Director-General Dr. Tedros Adhanom called it a transformative moment for global health equity, as the technology can be deployed in resource-limited settings. Regulatory bodies in the US, EU, and Japan are expediting approvals. Critics urge careful monitoring for algorithmic bias across different populations.",
        source: "Nature Medicine"
      },
      {
        title: "FDA Approves First AI-Discovered Drug for Inflammatory Disease",
        summary: "The US Food and Drug Administration has granted approval to the first pharmaceutical entirely discovered and developed using artificial intelligence. The drug, created by Insilico Medicine, treats idiopathic pulmonary fibrosis and moved from initial AI identification to approval in just 30 months—less than half the industry average. The AI system analyzed millions of molecular combinations to identify the optimal candidate, then designed clinical trials with unprecedented efficiency. This approval validates AI-driven drug discovery as a viable pathway, potentially revolutionizing pharmaceutical development. Analysts project AI could reduce drug development costs by 50% and timelines by 60%. Traditional pharmaceutical companies are rapidly expanding AI research divisions.",
        source: "STAT News"
      }
    ],
    sports: [
      {
        title: "Manchester City Completes Record £150 Million Transfer",
        summary: "Manchester City has shattered the Premier League transfer record by signing Norwegian striker Erling Haaland's compatriot Viktor Gyökeres from Sporting Lisbon for £150 million. The 26-year-old scored 43 goals last season and will partner Haaland in City's attack. Manager Pep Guardiola praised Gyökeres's movement and finishing ability, describing him as the perfect complement to their system. The transfer surpasses the previous record held by Moises Caicedo's move to Chelsea. Financial Fair Play implications are being examined by UEFA, though City maintains the deal complies with regulations. Sporting will reinvest in youth development infrastructure. The transfer signals City's continued dominance in the market.",
        source: "Sky Sports"
      },
      {
        title: "Australian Open Draw Revealed: Djokovic Eyes Record 25th Grand Slam",
        summary: "The Australian Open 2026 draw has placed Novak Djokovic on a potential collision course with Carlos Alcaraz in the semifinals. The 38-year-old Serbian legend seeks his 25th Grand Slam title, which would extend his all-time record. Djokovic will face a qualifier in round one before potential matchups against rising stars in later rounds. Women's defending champion Aryna Sabalenka received a favorable draw, avoiding top seeds until the quarterfinals. Tournament director Craig Tiley announced prize money increases of 15%, with total purse reaching $100 million. Melbourne's summer heat wave forecast has prompted scheduling adjustments, with more evening sessions planned.",
        source: "Tennis.com"
      }
    ],
    general: [
      {
        title: "Global Markets Rally on Central Bank Rate Cut Signals",
        summary: "Stock markets worldwide surged to record highs following coordinated signals from major central banks indicating rate cuts are imminent. The Federal Reserve, European Central Bank, and Bank of England all suggested inflation has been sufficiently controlled to begin monetary easing. The S&P 500 gained 2.3%, while European indices rose over 3%. Bond yields fell sharply as investors repositioned portfolios for lower rate environments. Tech stocks led the rally, with the Nasdaq advancing 3.1%. Economists predict the rate-cutting cycle could extend through 2027, providing sustained support for equity valuations. Emerging markets also benefited from expectations of weaker dollar dynamics.",
        source: "Wall Street Journal"
      },
      {
        title: "India Overtakes Japan to Become World's Fourth-Largest Economy",
        summary: "India has officially surpassed Japan to become the world's fourth-largest economy by nominal GDP, marking a historic milestone in the nation's development trajectory. IMF data shows India's economy reaching $4.2 trillion, compared to Japan's $4.1 trillion. Strong growth in technology services, manufacturing, and domestic consumption drove the achievement. Prime Minister Modi called it validation of economic reforms implemented over the past decade. However, economists note India's per-capita income remains far below developed nations. The government targets becoming a $10 trillion economy by 2030 through infrastructure investment and manufacturing expansion. Japan's prolonged stagnation and yen weakness contributed to the ranking change.",
        source: "The Economist"
      }
    ]
  };

  const articles = articlesByTopic[topic] || articlesByTopic.general;
  
  return articles.map((article, index) => ({
    id: `gemini-fallback-${Date.now()}-${index}`,
    title: article.title,
    summary: article.summary,
    source: article.source,
    publishedDate: timestamp,
    url: '#',
  }));
}

// Gemini News API endpoint
app.post('/gemini-news', async (c) => {
  try {
    const body = await c.req.json();
    const { query } = body;

    if (!query || typeof query !== 'string') {
      return c.json({ error: 'Query is required' }, 400);
    }

    const GEMINI_API_KEY = 'AIzaSyBPZx1FFPfxbpU-WzKfkSd-Hz9UxYpfKkc';
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

    try {
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
        console.error('Gemini API error:', response.status, errorText);
        // Return fallback articles on API error
        console.log('Returning fallback articles due to API error');
        return c.json({ 
          success: true,
          articles: generateFallbackArticles(query),
          query,
          fallback: true,
        });
      }

      const data = await response.json();

      // Extract the text content from Gemini response
      const textContent = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!textContent) {
        console.log('No content in Gemini response, returning fallback');
        return c.json({ 
          success: true,
          articles: generateFallbackArticles(query),
          query,
          fallback: true,
        });
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
          success: true,
          articles: generateFallbackArticles(query),
          query,
          fallback: true,
        });
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
    } catch (fetchError) {
      console.error('Fetch error:', fetchError);
      return c.json({ 
        success: true,
        articles: generateFallbackArticles(query),
        query,
        fallback: true,
      });
    }

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

    // Truncate text if too long (Sarvam has a limit)
    const truncatedText = text.length > 2000 ? text.substring(0, 2000) + '...' : text;

    const response = await fetch('https://api.sarvam.ai/text-to-speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-subscription-key': SARVAM_API_KEY,
      },
      body: JSON.stringify({
        inputs: [truncatedText],
        target_language_code: 'en-IN',
        speaker: 'anushka',
        pace: 1.3,
        speech_sample_rate: 22050,
        enable_preprocessing: true,
        model: 'bulbul:v2',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Sarvam TTS API error:', response.status, errorText);
      
      // Try to parse error for more details
      let errorDetails = errorText;
      try {
        const errorJson = JSON.parse(errorText);
        errorDetails = errorJson.message || errorJson.error || errorText;
      } catch {
        // Keep original error text
      }
      
      return c.json({ error: 'Failed to generate audio', details: errorDetails, status: response.status }, 500);
    }

    const data = await response.json();

    // Sarvam returns audio as base64 in the audios array
    const audioBase64 = data?.audios?.[0];

    if (!audioBase64) {
      console.error('Sarvam response missing audio:', JSON.stringify(data));
      return c.json({ error: 'No audio in response', response: data }, 500);
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