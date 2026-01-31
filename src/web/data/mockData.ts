// Mock data for curious.ai demo
// Contains Twitter users, tweets, and RSS feed articles

export interface TwitterUser {
  id: string;
  handle: string;
  name: string;
  avatar: string;
  bio: string;
  followers: number;
  verified: boolean;
}

export interface Tweet {
  id: string;
  userId: string;
  content: string;
  topic: "ai" | "cricket" | "geopolitics" | "health" | "tech";
  likes: number;
  retweets: number;
  replies: number;
  createdAt: string;
}

export interface RSSArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  source: string;
  sourceUrl: string;
  publishedDate: string;
  imageUrl: string;
  author: string;
  category: string;
}

// ==========================================
// TWITTER USERS
// ==========================================

export const twitterUsers: TwitterUser[] = [
  {
    id: "user_1",
    handle: "@TechGuru_AI",
    name: "Tech Guru AI",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=TechGuru",
    bio: "AI researcher and tech enthusiast",
    followers: 128400,
    verified: true,
  },
  {
    id: "user_2",
    handle: "@AINewsDaily",
    name: "AI News Daily",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AINews",
    bio: "Your daily dose of AI updates",
    followers: 89200,
    verified: true,
  },
  {
    id: "user_3",
    handle: "@GlobalPulse",
    name: "Global Pulse",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=GlobalPulse",
    bio: "World news and analysis",
    followers: 256800,
    verified: true,
  },
];

// ==========================================
// TWEETS
// ==========================================

export const tweets: Tweet[] = [
  // @TechGuru_AI tweets
  {
    id: "tweet_1",
    userId: "user_1",
    content:
      "OpenAI just announced GPT-5 with revolutionary reasoning capabilities. Early benchmarks show 40% improvement over GPT-4 Turbo. The AI race heats up! 🚀 #AI #OpenAI",
    topic: "ai",
    likes: 4520,
    retweets: 1890,
    replies: 342,
    createdAt: "2026-01-15T10:30:00Z",
  },
  {
    id: "tweet_2",
    userId: "user_1",
    content:
      "Anthropic raises $4B at $60B valuation. Claude's enterprise adoption is driving incredible growth. The AI infrastructure battle is real. 💰 Thread on what this means for the industry 🧵",
    topic: "ai",
    likes: 3210,
    retweets: 1245,
    replies: 189,
    createdAt: "2026-01-14T14:15:00Z",
  },
  {
    id: "tweet_3",
    userId: "user_1",
    content:
      "India vs Australia Test series has been absolutely thrilling! Kohli's comeback century in Melbourne shows why he's still the best. That cover drive was poetry in motion. 🏏🔥 #Cricket #INDvAUS",
    topic: "cricket",
    likes: 8940,
    retweets: 2150,
    replies: 567,
    createdAt: "2026-01-13T08:45:00Z",
  },

  // @AINewsDaily tweets
  {
    id: "tweet_4",
    userId: "user_2",
    content:
      "Google DeepMind's new Gemini 2.0 is setting new standards in multimodal AI. The ability to natively process video, audio, and text simultaneously is game-changing. Here's our deep dive analysis 📊",
    topic: "ai",
    likes: 5670,
    retweets: 2340,
    replies: 421,
    createdAt: "2026-01-15T16:20:00Z",
  },
  {
    id: "tweet_5",
    userId: "user_2",
    content:
      "Breaking: Microsoft announces $50B investment in AI data centers across Europe. The cloud AI infrastructure race is intensifying. This will reshape the European tech landscape 🌍💻",
    topic: "ai",
    likes: 7890,
    retweets: 3560,
    replies: 623,
    createdAt: "2026-01-14T09:00:00Z",
  },
  {
    id: "tweet_6",
    userId: "user_2",
    content:
      "Meta's Llama 4 leaked benchmarks suggest it may finally match GPT-4 in reasoning. Open-source AI closing the gap fast. This could democratize AI access globally 🦙✨",
    topic: "ai",
    likes: 4230,
    retweets: 1870,
    replies: 298,
    createdAt: "2026-01-12T11:30:00Z",
  },

  // @GlobalPulse tweets
  {
    id: "tweet_7",
    userId: "user_3",
    content:
      "US-China tech tensions escalate as new semiconductor export restrictions announced. Chip wars entering a critical phase. Analysis of what this means for global supply chains 🌐 #Geopolitics #Tech",
    topic: "geopolitics",
    likes: 6540,
    retweets: 2980,
    replies: 512,
    createdAt: "2026-01-15T07:45:00Z",
  },
  {
    id: "tweet_8",
    userId: "user_3",
    content:
      "ICC announces expansion of T20 World Cup to 24 teams. Cricket's global footprint continues to grow with new markets in Americas. USA, Canada, and Germany among new participants 🏏🌍",
    topic: "cricket",
    likes: 12400,
    retweets: 4560,
    replies: 890,
    createdAt: "2026-01-13T15:00:00Z",
  },
  {
    id: "tweet_9",
    userId: "user_3",
    content:
      "WHO releases new guidelines on AI-assisted diagnostics. Machine learning showing 95% accuracy in early cancer detection. Revolutionary times for healthcare. Full report breakdown 🏥🤖",
    topic: "health",
    likes: 9870,
    retweets: 4120,
    replies: 734,
    createdAt: "2026-01-11T12:00:00Z",
  },
];

// ==========================================
// RSS FEED ARTICLES - TECHCRUNCH AI
// ==========================================

export const techCrunchArticles: RSSArticle[] = [
  {
    id: "tc_1",
    title: "OpenAI's GPT-5 Marks a New Era in Artificial Reasoning",
    summary:
      "OpenAI has unveiled GPT-5, their most advanced language model to date, featuring unprecedented reasoning capabilities that experts say could transform how we interact with AI systems. The new model demonstrates remarkable improvements in logical deduction, mathematical problem-solving, and complex multi-step reasoning tasks.",
    content:
      "In a highly anticipated announcement, OpenAI has released GPT-5, marking what many industry experts are calling a paradigm shift in artificial intelligence capabilities. The new model shows a 40% improvement in reasoning benchmarks compared to its predecessor, GPT-4 Turbo, and introduces several groundbreaking features that set it apart from existing language models.\n\nThe most significant advancement lies in GPT-5's enhanced reasoning architecture. Unlike previous models that relied heavily on pattern matching and statistical prediction, GPT-5 incorporates a novel 'chain-of-thought' mechanism that allows it to break down complex problems into logical steps, verify intermediate results, and self-correct errors during the reasoning process.\n\n'What we're seeing with GPT-5 is not just incremental improvement, but a fundamental leap in how AI systems approach problem-solving,' said Dr. Sarah Chen, AI Research Director at Stanford University. 'The model's ability to maintain coherent reasoning across extended contexts while acknowledging uncertainty is particularly impressive.'\n\nEnterprise customers have reported remarkable results in early testing, with GPT-5 demonstrating superior performance in code generation, legal document analysis, and scientific research assistance. Financial institutions are particularly excited about the model's improved accuracy in risk assessment and fraud detection scenarios.\n\nThe release has intensified competition in the AI industry, with Google, Anthropic, and other major players racing to match or exceed GPT-5's capabilities. Industry analysts predict this will accelerate AI investment and deployment across all sectors, potentially reshaping the global technology landscape within the next 12-18 months.",
    source: "TechCrunch AI",
    sourceUrl: "https://techcrunch.com/ai/feed",
    publishedDate: "2026-01-15T08:00:00Z",
    imageUrl: "https://picsum.photos/seed/gpt5/800/450",
    author: "Maria Rodriguez",
    category: "AI",
  },
  {
    id: "tc_2",
    title: "Anthropic Secures $4 Billion in Landmark Funding Round",
    summary:
      "AI safety company Anthropic has closed a massive $4 billion funding round at a $60 billion valuation, signaling strong investor confidence in their approach to developing responsible AI systems. The funding will accelerate Claude's enterprise capabilities.",
    content:
      "Anthropic, the AI safety startup founded by former OpenAI researchers, has completed a record-breaking $4 billion funding round, valuing the company at $60 billion. The round was led by Google and included participation from Spark Capital, Salesforce Ventures, and several prominent sovereign wealth funds.\n\nThe substantial investment reflects growing enterprise demand for Anthropic's Claude AI assistant, which has gained significant traction in industries requiring high-stakes decision-making. Healthcare organizations, financial services firms, and legal practices have increasingly adopted Claude for tasks where accuracy and ethical considerations are paramount.\n\n'Enterprise customers are telling us they need AI they can trust,' said Dario Amodei, Anthropic's CEO. 'Our constitutional AI approach and focus on safety have resonated with organizations that can't afford errors or ethical missteps.'\n\nThe funding will support Anthropic's ambitious research agenda, including development of more powerful models with enhanced safety guarantees. The company plans to double its research team and expand its computational infrastructure significantly.\n\nAnthropic's valuation has nearly doubled from its previous funding round just eight months ago, reflecting the explosive growth in enterprise AI adoption. The company reported that Claude's usage has grown 500% year-over-year, with particular strength in regulated industries.\n\nIndustry observers note that Anthropic's success demonstrates the market's appetite for AI solutions that prioritize safety and reliability alongside raw capability. This could shift the competitive dynamics in the AI industry, encouraging other companies to invest more heavily in safety research.",
    source: "TechCrunch AI",
    sourceUrl: "https://techcrunch.com/ai/feed",
    publishedDate: "2026-01-14T14:30:00Z",
    imageUrl: "https://picsum.photos/seed/anthropic/800/450",
    author: "James Thompson",
    category: "AI Funding",
  },
  {
    id: "tc_3",
    title: "Google DeepMind Unveils Gemini 2.0 with Native Multimodal Capabilities",
    summary:
      "Google DeepMind has launched Gemini 2.0, featuring revolutionary multimodal processing that seamlessly integrates video, audio, and text understanding. The new architecture represents a significant step toward artificial general intelligence.",
    content:
      "Google DeepMind has announced Gemini 2.0, the next generation of its flagship AI model, featuring unprecedented multimodal capabilities that allow it to process video, audio, images, and text simultaneously within a unified architecture. The release marks a significant milestone in the pursuit of more versatile AI systems.\n\nUnlike previous multimodal models that processed different input types through separate specialized modules, Gemini 2.0 uses a novel 'unified perception' architecture that treats all input modalities as part of a continuous information stream. This allows the model to understand complex relationships between different types of media in ways that were previously impossible.\n\n'Gemini 2.0 doesn't just see an image and read text about it separately—it understands them together as humans do,' explained Dr. Demis Hassabis, CEO of Google DeepMind. 'This is a fundamental architectural advance that brings us closer to artificial general intelligence.'\n\nEarly demonstrations have shown remarkable capabilities, including the ability to analyze video content in real-time, understand spoken context, and generate relevant responses that integrate information from all modalities. In testing, the model successfully analyzed complex scenes, understanding not just what's visible but the implied narrative and emotional context.\n\nGoogle has announced that Gemini 2.0 will power next-generation features across its product ecosystem, including enhanced Google Search, a more capable Google Assistant, and advanced content creation tools in YouTube and Google Workspace.\n\nThe release has prompted competitors to accelerate their own multimodal research, with industry analysts predicting a new wave of AI applications that leverage cross-modal understanding.",
    source: "TechCrunch AI",
    sourceUrl: "https://techcrunch.com/ai/feed",
    publishedDate: "2026-01-13T10:15:00Z",
    imageUrl: "https://picsum.photos/seed/gemini2/800/450",
    author: "Emily Watson",
    category: "AI",
  },
  {
    id: "tc_4",
    title: "Microsoft Commits $50 Billion to European AI Infrastructure",
    summary:
      "Microsoft has announced a massive $50 billion investment in AI data centers across Europe, the largest single technology infrastructure investment in European history. The initiative aims to establish Europe as a global AI hub.",
    content:
      "In a landmark announcement, Microsoft CEO Satya Nadella revealed plans to invest $50 billion in AI data center infrastructure across Europe over the next five years. The investment, described as the largest single technology infrastructure commitment in European history, signals Microsoft's strategic focus on positioning Europe as a critical node in the global AI ecosystem.\n\nThe investment will fund construction of 20 new hyperscale data centers across Germany, France, the Netherlands, and the Nordic countries, specifically designed for AI workload optimization. These facilities will feature custom cooling systems, renewable energy integration, and next-generation GPU clusters optimized for large language model training and inference.\n\n'Europe has the talent, the regulatory framework, and the economic strength to lead in responsible AI development,' Nadella said during the announcement in Brussels. 'We're backing that potential with the largest infrastructure investment we've ever made outside the United States.'\n\nThe initiative includes substantial commitments to local workforce development, with Microsoft pledging to train over 2 million Europeans in AI skills through partnerships with universities and vocational programs. The company will also establish three new AI research labs in collaboration with leading European universities.\n\nEuropean Commission President praised the investment, noting that it aligns with the EU's AI Act goals of fostering innovation while maintaining strong ethical standards. The investment is expected to create over 50,000 direct jobs and support hundreds of thousands more in related industries.\n\nCompetitors are reportedly accelerating their own European expansion plans in response, with Google and Amazon expected to announce significant infrastructure investments in the coming months.",
    source: "TechCrunch AI",
    sourceUrl: "https://techcrunch.com/ai/feed",
    publishedDate: "2026-01-12T16:00:00Z",
    imageUrl: "https://picsum.photos/seed/mseuropeai/800/450",
    author: "David Mueller",
    category: "AI Infrastructure",
  },
  {
    id: "tc_5",
    title: "Meta's Llama 4 Benchmarks Leak, Show Parity with GPT-4",
    summary:
      "Leaked benchmark results suggest Meta's upcoming Llama 4 model matches GPT-4's reasoning capabilities while remaining fully open-source. The development could democratize access to frontier AI capabilities.",
    content:
      "Internal benchmark results for Meta's yet-to-be-announced Llama 4 model have leaked online, revealing performance that appears to match or exceed GPT-4 across most standard evaluation metrics. If confirmed, this would mark a significant milestone for open-source AI development.\n\nThe leaked benchmarks, shared on several AI research forums before being taken down, show Llama 4 achieving near-parity with GPT-4 on reasoning tasks, coding challenges, and mathematical problem-solving. Particularly notable is the model's performance on the challenging MMLU benchmark, where it reportedly scores within 2% of GPT-4.\n\n'This is potentially the most significant development in open-source AI since the original Llama release,' said Dr. Percy Liang, director of Stanford's Center for Research on Foundation Models. 'If these benchmarks are accurate, organizations worldwide will have access to GPT-4-level capabilities without API costs or vendor lock-in.'\n\nMeta declined to comment on the leaked information but sources familiar with the company's AI research suggest an official announcement is planned for the coming weeks. The company has previously expressed its commitment to open-source AI development as a way to accelerate responsible AI adoption globally.\n\nThe potential release has generated excitement among AI researchers and startups who have built products on earlier Llama models. Open-source alternatives at this capability level could significantly reduce the cost of AI integration for smaller organizations and developing economies.\n\nHowever, some experts have raised concerns about the safety implications of widely available powerful AI models. Meta is expected to address these concerns through enhanced safety guidelines and responsible use policies accompanying the release.",
    source: "TechCrunch AI",
    sourceUrl: "https://techcrunch.com/ai/feed",
    publishedDate: "2026-01-11T09:30:00Z",
    imageUrl: "https://picsum.photos/seed/llama4/800/450",
    author: "Kevin Park",
    category: "Open Source AI",
  },
  {
    id: "tc_6",
    title: "AI Chip Startup Cerebras Goes Public at $12 Billion Valuation",
    summary:
      "Cerebras Systems, known for building the world's largest AI chips, has successfully completed its IPO at a $12 billion valuation. The company's unique approach to AI hardware has attracted major customers seeking alternatives to Nvidia.",
    content:
      "Cerebras Systems has completed one of the most anticipated tech IPOs of the year, debuting on the Nasdaq at a $12 billion valuation. The AI chip company, known for its wafer-scale engine—the world's largest computer chip—saw its shares rise 35% on the first day of trading.\n\nThe successful IPO reflects growing investor interest in AI hardware alternatives to Nvidia, which currently dominates the AI chip market with an estimated 80% market share. Cerebras's unique approach, using a single massive chip instead of clusters of smaller GPUs, has attracted customers frustrated with the cost and complexity of traditional AI infrastructure.\n\n'The AI hardware market is at an inflection point,' said Cerebras CEO Andrew Feldman during the IPO celebration. 'Organizations are looking for alternatives that offer better performance-per-dollar, and our wafer-scale technology delivers exactly that.'\n\nCerebras's client list includes major pharmaceutical companies, financial institutions, and government research laboratories. The company recently announced a partnership with the UAE government to build one of the world's largest AI research facilities using Cerebras technology.\n\nThe IPO proceeds will fund expansion of manufacturing capacity and development of next-generation chips. Cerebras plans to open a new fabrication partnership with TSMC and expand its software ecosystem to make its systems more accessible to developers.\n\nNvidia's stock dipped slightly on news of Cerebras's successful debut, though analysts note that the AI chip market is large enough to support multiple successful players. The total addressable market for AI hardware is projected to exceed $200 billion by 2028.",
    source: "TechCrunch AI",
    sourceUrl: "https://techcrunch.com/ai/feed",
    publishedDate: "2026-01-10T11:00:00Z",
    imageUrl: "https://picsum.photos/seed/cerebras/800/450",
    author: "Rachel Kim",
    category: "AI Hardware",
  },
  {
    id: "tc_7",
    title: "AI-Powered Drug Discovery Scores Major FDA Approval",
    summary:
      "Insilico Medicine has received FDA approval for the first drug discovered and designed entirely by AI, marking a historic milestone for the pharmaceutical industry. The treatment targets a rare fibrotic disease.",
    content:
      "In a historic first, the FDA has approved a drug that was both discovered and designed using artificial intelligence systems. Insilico Medicine's treatment for idiopathic pulmonary fibrosis (IPF) becomes the first entirely AI-originated pharmaceutical to receive regulatory approval, potentially heralding a new era in drug development.\n\nThe approval marks the culmination of a remarkably accelerated development timeline. Traditional drug discovery typically takes 10-15 years from initial concept to approval; Insilico achieved the milestone in just four years using its AI platform to identify novel targets, design candidate molecules, and optimize clinical trial designs.\n\n'This approval validates what we've been working toward for a decade,' said Dr. Alex Zhavoronkov, Insilico's founder and CEO. 'AI can fundamentally transform how we discover and develop medicines, making the process faster, cheaper, and more successful.'\n\nThe approved drug, ISM001-055, showed significantly better efficacy than existing IPF treatments in phase 3 trials while demonstrating a favorable safety profile. The drug works through a novel mechanism identified by Insilico's AI systems that traditional research methods had not explored.\n\nMajor pharmaceutical companies have taken notice, with several announcing expanded AI integration in their R&D pipelines following the approval. Analysts estimate that AI-driven drug discovery could reduce development costs by 50-70% while improving success rates.\n\nThe approval has generated intense interest from patient advocacy groups, who see AI-accelerated drug development as a potential solution for rare diseases that often lack commercial incentive for traditional pharmaceutical research. Insilico has announced plans to apply its platform to over 20 additional rare disease targets.",
    source: "TechCrunch AI",
    sourceUrl: "https://techcrunch.com/ai/feed",
    publishedDate: "2026-01-09T13:45:00Z",
    imageUrl: "https://picsum.photos/seed/aidrug/800/450",
    author: "Dr. Sarah Mitchell",
    category: "AI Healthcare",
  },
];

// ==========================================
// RSS FEED ARTICLES - ESPN SPORTS
// ==========================================

export const espnSportsArticles: RSSArticle[] = [
  {
    id: "espn_1",
    title: "Kohli's Masterclass Century Puts India in Command at Melbourne",
    summary:
      "Virat Kohli rolled back the years with a magnificent century at the MCG, his first in Test cricket in nearly two years. The innings has put India in a commanding position in the crucial fourth Test against Australia.",
    content:
      "Virat Kohli silenced his critics with a stunning return to form, scoring 143 runs off 285 balls in a masterful display of Test cricket batting at the Melbourne Cricket Ground. The century, his first in the format since March 2024, came at the perfect moment for India as they look to level the series.\n\nKohli's innings was a testament to patience and technical excellence. After a cautious start against Australia's potent pace attack, he gradually took control, playing with the kind of assurance that made him the world's best batter for the better part of a decade.\n\n'I've been working hard on my game, and it was about waiting for the right moment,' Kohli said in the post-day press conference. 'The conditions here suit my game, and I trusted my preparation.'\n\nThe knock was particularly notable for Kohli's dominance over Pat Cummins and Mitchell Starc, both of whom had troubled him in recent encounters. His cover drives, a trademark shot that had deserted him in recent times, were back in full flow.\n\nIndia closed day two at 387/4, with Kohli still at the crease and a lead of 142 runs. Cricket analysts have praised the innings as one of Kohli's most mature performances, combining his natural aggression with newfound patience.\n\nThe series is currently tied 1-1, making this Melbourne Test crucial for both teams' World Test Championship ambitions. India's strong position gives them an excellent chance to take a series lead heading into the final Test.",
    source: "ESPN Sports",
    sourceUrl: "https://espn.com/rss/news",
    publishedDate: "2026-01-15T17:30:00Z",
    imageUrl: "https://picsum.photos/seed/kohli/800/450",
    author: "Rahul Bhattacharya",
    category: "Cricket",
  },
  {
    id: "espn_2",
    title: "ICC Expands T20 World Cup to 24 Teams Starting 2028",
    summary:
      "The International Cricket Council has announced a major expansion of the T20 World Cup, increasing the tournament to 24 teams. The decision aims to grow cricket's global footprint and includes new participants from non-traditional markets.",
    content:
      "The ICC has approved an ambitious expansion of the T20 World Cup, growing the tournament from 20 to 24 teams starting with the 2028 edition. The decision represents the most significant structural change to cricket's most-watched event and signals the sport's commitment to global growth.\n\nThe expanded format will include teams from non-traditional cricket markets, with USA, Canada, Germany, and Italy among the nations expected to benefit from increased qualification opportunities. The tournament will span four weeks and feature matches across multiple host nations.\n\n'Cricket has never been more popular globally, and this expansion reflects that reality,' said ICC Chairman Greg Barclay. 'We want to ensure that fans everywhere can see their national teams compete at the highest level.'\n\nThe new format will feature six groups of four teams, with the top two from each group advancing to a Super 12 stage. This provides more matches for associate nations while maintaining competitive intensity in later rounds.\n\nBroadcasters have welcomed the expansion, with early estimates suggesting the additional matches could increase viewership by 40%. The ICC has also announced enhanced prize money for all participating nations, including significant funding for cricket development in emerging markets.\n\nFull member nations have expressed support for the expansion, though some concerns have been raised about fixture congestion in an already crowded cricket calendar. The ICC has indicated that it will work with member boards to ensure player workload management remains a priority.",
    source: "ESPN Sports",
    sourceUrl: "https://espn.com/rss/news",
    publishedDate: "2026-01-14T12:00:00Z",
    imageUrl: "https://picsum.photos/seed/t20worldcup/800/450",
    author: "Michael Patterson",
    category: "Cricket",
  },
  {
    id: "espn_3",
    title: "Manchester City Complete Record £180M Move for Norwegian Striker",
    summary:
      "Manchester City have broken the Premier League transfer record with a £180 million deal for Sporting CP's sensational Norwegian striker. The signing signals City's intent to maintain their domestic dominance.",
    content:
      "Manchester City have completed the most expensive transfer in Premier League history, signing Sporting CP striker Viktor Kristiansen for £180 million. The 22-year-old Norwegian forward has been one of European football's most sought-after talents after scoring 35 goals in all competitions last season.\n\nThe deal surpasses the previous Premier League record of £115 million and reflects the escalating transfer market driven by increased broadcasting revenues and investment. City fought off competition from Real Madrid, Barcelona, and PSG to secure Kristiansen's signature.\n\n'Viktor is an exceptional talent with all the attributes to succeed at the highest level,' said City manager Pep Guardiola. 'His movement, finishing ability, and work rate are exactly what we look for. He will add another dimension to our attack.'\n\nKristiansen, who had a €200 million release clause, has signed a six-year contract. The forward broke into Norway's national team at 19 and has since become their all-time leading scorer with 23 goals in 31 appearances.\n\nThe transfer has sparked debate about the sustainability of football's spending, with some critics pointing to the growing financial gap between elite clubs and the rest. UEFA's financial fair play regulations are expected to face renewed scrutiny following the deal.\n\nCity fans have responded with excitement, with season ticket renewals spiking following the announcement. The club's commercial department expects significant merchandise revenue from Kristiansen, who is already one of football's most marketable young stars.",
    source: "ESPN Sports",
    sourceUrl: "https://espn.com/rss/news",
    publishedDate: "2026-01-13T18:45:00Z",
    imageUrl: "https://picsum.photos/seed/citytransfer/800/450",
    author: "James Horncastle",
    category: "Football",
  },
  {
    id: "espn_4",
    title: "NBA All-Star Voting Results Reveal Surprising Fan Favorites",
    summary:
      "The first returns from NBA All-Star voting have revealed several surprises, with international players dominating the backcourt positions. Social media campaigns have driven significant voting from global fanbases.",
    content:
      "The NBA has released the first round of All-Star voting results, revealing unexpected leaders that highlight basketball's growing international fanbase. French guard Victor Wembanyama leads all Western Conference guards despite being in just his third NBA season, while Slovenian star Luka Dončić continues his Eastern Conference dominance.\n\nThe voting results reflect sophisticated social media campaigns targeting international audiences. Wembanyama's popularity in France has driven massive voting numbers, with French basketball federations organizing community voting events. Similarly, Dončić's Slovenian supporters have demonstrated remarkable engagement.\n\n'Basketball is a global sport, and All-Star voting reflects that,' said NBA Commissioner Adam Silver. 'We're thrilled to see fans from around the world engaging with our league.'\n\nTraditional American stars remain competitive, with LeBron James, currently in his 23rd season, holding the third position among Western Conference frontcourt players. His longevity continues to astonish analysts who predicted his decline years ago.\n\nThe results have reignited debate about All-Star selection criteria, with some arguing that fan voting overweights popularity relative to on-court performance. However, the NBA has maintained its position that All-Star weekend is fundamentally a fan celebration.\n\nFinal voting closes on January 21st, with the All-Star Game scheduled for February 16th in Indianapolis. Coaches will select the reserves, providing some balance to the fan-voted starters.",
    source: "ESPN Sports",
    sourceUrl: "https://espn.com/rss/news",
    publishedDate: "2026-01-12T15:30:00Z",
    imageUrl: "https://picsum.photos/seed/nbaallstar/800/450",
    author: "Zach Lowe",
    category: "Basketball",
  },
  {
    id: "espn_5",
    title: "Australian Open Preview: Djokovic Eyes Record-Extending 11th Title",
    summary:
      "Novak Djokovic arrives at Melbourne Park seeking to extend his record with an 11th Australian Open title. At 38, the Serbian legend continues to defy age and remains the tournament favorite.",
    content:
      "As the Australian Open approaches, all eyes are on Novak Djokovic as he pursues an unprecedented 11th title at Melbourne Park. The 38-year-old Serbian, already the most successful player in the tournament's history, shows no signs of slowing down despite increasing competition from the next generation.\n\nDjokovic's preparation has been meticulous, with an extended training block in Adelaide focusing on speed and recovery—areas that become increasingly challenging with age. His coach, Goran Ivanišević, has emphasized the importance of winning early rounds efficiently to conserve energy for later stages.\n\n'Novak's ability to peak at major championships is unmatched in tennis history,' Ivanišević said. 'He knows how to prepare his body and mind for these moments better than anyone.'\n\nHowever, Djokovic faces perhaps the deepest field of young challengers in his career. Carlos Alcaraz, now 22, is the bookmakers' second favorite after winning three Grand Slam titles. Jannik Sinner, the Italian who defeated Djokovic in the 2024 final, arrives in career-best form.\n\nThe draw has not been kind to Djokovic, with potential early-round meetings against several dangerous opponents. A potential semifinal clash with Alcaraz looms, which would be their first meeting at a Grand Slam since Wimbledon 2023.\n\nRegardless of outcome, Djokovic's presence at the highest level in his late thirties represents one of sport's most remarkable longevity stories. His potential 11th title would cement his status as the greatest male tennis player in Australian Open history.",
    source: "ESPN Sports",
    sourceUrl: "https://espn.com/rss/news",
    publishedDate: "2026-01-11T08:00:00Z",
    imageUrl: "https://picsum.photos/seed/djokovicao/800/450",
    author: "Christopher Clarey",
    category: "Tennis",
  },
  {
    id: "espn_6",
    title: "NFL Playoffs: Chiefs Seek Historic Third Consecutive Super Bowl",
    summary:
      "The Kansas City Chiefs enter the playoffs as the top seed, chasing an unprecedented third consecutive Super Bowl victory. Patrick Mahomes and the Chiefs offense have been unstoppable this season.",
    content:
      "The Kansas City Chiefs have secured the AFC's top seed and home-field advantage throughout the playoffs, positioning themselves for a historic pursuit of three consecutive Super Bowl championships. No NFL team has achieved this feat in the Super Bowl era.\n\nPatrick Mahomes has delivered another MVP-caliber season, throwing for 4,892 yards and 41 touchdowns while leading the league's most efficient offense. His connection with Travis Kelce remains elite despite the tight end's advancing age, while young receivers have stepped up to complement the veteran core.\n\n'We know what's at stake, but we can't think about history,' Mahomes said following the Chiefs' regular season finale. 'Every playoff game is its own battle. We have to earn the right to play for a championship.'\n\nThe Chiefs' playoff path could include rematches with several teams they defeated in tight regular-season contests. The Buffalo Bills, Baltimore Ravens, and Miami Dolphins all pose significant threats, with each team having improved substantially from last season.\n\nHead coach Andy Reid, already considered one of the greatest coaches in NFL history, would cement his legacy with a third consecutive championship. Reid has emphasized maintaining focus and avoiding complacency as keys to navigating the challenging playoff bracket.\n\nThe team's experience in pressure situations is unmatched, with most core players having participated in at least three Super Bowls. This championship pedigree gives Kansas City a psychological edge that has proven decisive in close playoff games.",
    source: "ESPN Sports",
    sourceUrl: "https://espn.com/rss/news",
    publishedDate: "2026-01-10T20:15:00Z",
    imageUrl: "https://picsum.photos/seed/chiefsnfl/800/450",
    author: "Adam Schefter",
    category: "American Football",
  },
  {
    id: "espn_7",
    title: "IPL 2026 Auction: Record $5.2 Million Bid for Young Indian Spinner",
    summary:
      "The IPL mega auction produced stunning results, with 19-year-old Indian spinner Raj Vardhan commanding the highest bid at $5.2 million from Mumbai Indians. The auction set new records for total spending.",
    content:
      "The IPL 2026 mega auction has concluded with record-breaking spending, headlined by Mumbai Indians' $5.2 million acquisition of teenage spin sensation Raj Vardhan. The 19-year-old left-arm spinner from Rajasthan has been touted as India's next great bowling prospect.\n\nVardhan's auction price represents the highest ever for an uncapped Indian player, reflecting the premium franchises place on emerging domestic talent. His combination of flight, drift, and sharp turn has drawn comparisons to legendary spinners, though experts caution against premature expectations.\n\n'The auction was incredibly competitive this year,' said Mumbai Indians owner Akash Ambani. 'Raj represents our investment in the future of Indian cricket. We believe he can be a generational talent.'\n\nOther notable moves included Chennai Super Kings spending $4.8 million on Australian fast bowler Mitchell Stark, despite his age, and Royal Challengers Bangalore's aggressive acquisition of three young Indian batters. The total auction spending exceeded $180 million, a new record.\n\nOverseas players saw significant demand, with English and Australian cricketers commanding premium prices. However, the introduction of an impact player rule has shifted strategy, with teams now valuing versatile players who can contribute in multiple ways.\n\nThe auction's conclusion sets the stage for an exciting IPL season, with several franchises having assembled significantly improved rosters. Competition for playoff spots is expected to be intense, with no team emerging as a clear favorite.",
    source: "ESPN Sports",
    sourceUrl: "https://espn.com/rss/news",
    publishedDate: "2026-01-09T14:00:00Z",
    imageUrl: "https://picsum.photos/seed/iplauction/800/450",
    author: "Gaurav Kalra",
    category: "Cricket",
  },
];

// ==========================================
// RSS FEED ARTICLES - REUTERS WORLD
// ==========================================

export const reutersWorldArticles: RSSArticle[] = [
  {
    id: "reuters_1",
    title: "US Announces Sweeping New Semiconductor Export Restrictions on China",
    summary:
      "The United States has unveiled comprehensive new export controls targeting China's semiconductor industry, significantly expanding restrictions on advanced chip manufacturing equipment. The measures represent the most aggressive technology containment policy to date.",
    content:
      "The Biden administration has announced the most comprehensive semiconductor export restrictions ever imposed on China, dramatically escalating technological competition between the world's two largest economies. The new rules, effective immediately, expand controls on advanced chip manufacturing equipment and add dozens of Chinese companies to the entity list.\n\nThe restrictions target China's ability to produce advanced semiconductors domestically, closing loopholes in previous regulations that allowed some technology transfer through third countries. Dutch and Japanese allies have coordinated their own export controls, creating a unified front among leading chip equipment manufacturers.\n\n'These actions are necessary to protect our national security and prevent advanced technology from being used against American interests,' said Commerce Secretary Gina Raimondo. 'We will continue to adapt our controls as technology evolves.'\n\nChina's Ministry of Commerce strongly condemned the measures, calling them 'blatant economic coercion' and threatening retaliatory actions. Beijing has accelerated its domestic chip development program, investing an additional $50 billion in semiconductor self-sufficiency initiatives.\n\nGlobal technology companies are scrambling to assess the impact on their supply chains and revenue. Several major chipmakers have warned of significant revenue declines from Chinese customers, while others are exploring restructuring to minimize exposure.\n\nAnalysts predict the restrictions will accelerate technological decoupling between US and Chinese tech ecosystems, potentially creating two distinct global technology standards. The semiconductor industry's geographic concentration makes it particularly vulnerable to geopolitical tensions.",
    source: "Reuters World",
    sourceUrl: "https://reuters.com/world/feed",
    publishedDate: "2026-01-15T06:00:00Z",
    imageUrl: "https://picsum.photos/seed/chipwars/800/450",
    author: "Karen Freifeld",
    category: "Geopolitics",
  },
  {
    id: "reuters_2",
    title: "EU and Mercosur Finalize Historic Trade Agreement After 25 Years",
    summary:
      "The European Union and Mercosur bloc have signed a historic free trade agreement following 25 years of negotiations. The deal creates the world's largest free trade zone, covering 750 million consumers.",
    content:
      "After a quarter-century of negotiations, the European Union and Mercosur countries have signed a comprehensive free trade agreement that will create the world's largest trading bloc. The deal eliminates tariffs on 91% of goods and establishes new frameworks for services, investment, and sustainable development.\n\nThe agreement covers the EU's 27 member states and the four Mercosur nations—Brazil, Argentina, Uruguay, and Paraguay—representing combined GDP of over $20 trillion and 750 million consumers. It is expected to generate €4 billion in annual tariff savings for European exporters.\n\n'This agreement demonstrates that the EU remains committed to open trade and multilateral cooperation,' said European Commission President Ursula von der Leyen during the signing ceremony in Montevideo. 'It will create opportunities for businesses and workers on both sides of the Atlantic.'\n\nThe deal faced significant opposition from European farmers concerned about competition from South American agricultural exports, particularly beef. Compromise language on environmental standards and deforestation monitoring helped secure approval from skeptical EU member states.\n\nBrazilian President emphasized the agreement's importance for Latin American economic development, noting it would attract European investment in infrastructure and manufacturing. Argentina, emerging from years of economic crisis, sees the deal as crucial for its recovery strategy.\n\nEnvironmental groups have expressed mixed reactions, praising sustainable development provisions while questioning enforcement mechanisms. The agreement includes commitments to Paris Agreement implementation and deforestation reduction, though critics argue these lack binding enforcement.",
    source: "Reuters World",
    sourceUrl: "https://reuters.com/world/feed",
    publishedDate: "2026-01-14T09:30:00Z",
    imageUrl: "https://picsum.photos/seed/eumercosur/800/450",
    author: "Philip Blenkinsop",
    category: "Trade",
  },
  {
    id: "reuters_3",
    title: "WHO Endorses AI-Assisted Cancer Screening Following Breakthrough Trials",
    summary:
      "The World Health Organization has issued formal guidelines endorsing AI-assisted screening for multiple cancer types following clinical trials showing 95% accuracy in early detection. The technology could revolutionize cancer diagnosis in developing nations.",
    content:
      "The World Health Organization has released landmark guidelines endorsing the use of artificial intelligence systems for cancer screening, following extensive clinical trials demonstrating unprecedented accuracy in early detection. The guidelines cover breast, lung, colorectal, and cervical cancers, representing conditions that account for nearly half of global cancer deaths.\n\nThe AI systems, developed through collaboration between leading technology companies and medical institutions, showed 95% accuracy in identifying early-stage cancers from imaging data—significantly outperforming human radiologists' average detection rates. Critically, the technology reduced false positive rates by 40%, decreasing unnecessary follow-up procedures.\n\n'This technology has the potential to save millions of lives, particularly in regions where specialized medical expertise is scarce,' said WHO Director-General Dr. Tedros Adhanom Ghebreyesus. 'We are recommending immediate implementation in national screening programs.'\n\nThe guidelines include detailed protocols for integrating AI systems into existing healthcare infrastructure, with particular attention to developing nations. The WHO has partnered with several technology companies to provide subsidized access to AI screening tools for low-income countries.\n\nMedical professional organizations have generally welcomed the guidelines while emphasizing that AI should augment rather than replace human expertise. The recommendations specify that AI findings should be reviewed by qualified healthcare professionals before diagnosis.\n\nThe endorsement has accelerated regulatory approvals worldwide, with health ministries in over 40 countries announcing plans to implement AI-assisted screening programs. Analysts estimate the technology could prevent 2-3 million cancer deaths annually once fully deployed globally.",
    source: "Reuters World",
    sourceUrl: "https://reuters.com/world/feed",
    publishedDate: "2026-01-13T11:15:00Z",
    imageUrl: "https://picsum.photos/seed/whocancer/800/450",
    author: "Jennifer Rigby",
    category: "Health",
  },
  {
    id: "reuters_4",
    title: "Central Banks Signal Coordinated Interest Rate Cuts Amid Inflation Victory",
    summary:
      "Major central banks including the Federal Reserve, ECB, and Bank of England have signaled coordinated interest rate cuts, declaring victory in the battle against post-pandemic inflation. Markets have rallied on expectations of easier monetary policy.",
    content:
      "In a coordinated shift that marks the end of the aggressive monetary tightening cycle, the world's major central banks have signaled impending interest rate cuts following successful reduction of inflation to target levels. The Federal Reserve, European Central Bank, and Bank of England all released statements indicating rate reductions beginning in the first quarter.\n\nFederal Reserve Chair Jerome Powell announced that inflation has been 'sustainably returned' to the 2% target, allowing the Fed to begin normalizing rates. The statement indicated three rate cuts expected in 2026, totaling 75 basis points, with the first reduction likely in March.\n\n'The battle against inflation has been won, but we remain vigilant,' Powell said in prepared remarks. 'We will move gradually and remain data-dependent, but the direction of travel is clear.'\n\nThe ECB and Bank of England echoed similar sentiments, with European inflation falling to 1.8% and UK inflation at 2.1%. Coordinated messaging among central banks suggests extensive behind-the-scenes consultation to manage market expectations.\n\nGlobal equity markets surged on the announcements, with the S&P 500 reaching new all-time highs. Bond yields fell sharply as investors priced in easier monetary conditions, while the US dollar weakened against major currencies.\n\nEconomists have praised the central banks' handling of the post-pandemic inflation surge, noting the 'soft landing' achieved without triggering recession. However, some warn that premature rate cuts could reignite inflationary pressures, particularly given tight labor markets.",
    source: "Reuters World",
    sourceUrl: "https://reuters.com/world/feed",
    publishedDate: "2026-01-12T16:45:00Z",
    imageUrl: "https://picsum.photos/seed/centralbanks/800/450",
    author: "Howard Schneider",
    category: "Economy",
  },
  {
    id: "reuters_5",
    title: "India Overtakes Japan as World's Fourth-Largest Economy",
    summary:
      "India has officially surpassed Japan to become the world's fourth-largest economy by nominal GDP, marking a historic milestone in the country's economic development. Projections suggest India could become the third-largest economy within three years.",
    content:
      "India has achieved a historic economic milestone, officially overtaking Japan to become the world's fourth-largest economy by nominal GDP. The landmark was reached as India's economy grew 6.8% in the latest quarter while Japan's continued its slow-growth trajectory, with the yen's depreciation accelerating the transition.\n\nIndia's GDP now stands at approximately $4.7 trillion, compared to Japan's $4.4 trillion. Economic projections suggest India could surpass Germany to become the third-largest economy within three years if current growth differentials persist.\n\n'This milestone reflects India's transformation into a global economic powerhouse,' said Indian Finance Minister Nirmala Sitharaman. 'Our focus on manufacturing, digital infrastructure, and human capital development is delivering results.'\n\nThe achievement represents a remarkable turnaround for India, which ranked 11th globally as recently as 2010. Key drivers include the expansion of digital services, manufacturing growth under the 'Make in India' initiative, and a demographic dividend from the world's largest working-age population.\n\nJapanese officials acknowledged the shift but emphasized their country's continued strength in technology, manufacturing quality, and per-capita wealth. Japan's economy faces structural challenges including an aging population and persistent deflation.\n\nInternational business leaders have increased investment commitments to India following the announcement, with several major technology companies announcing expanded operations. India's growing middle class, projected to reach 500 million by 2030, represents an increasingly attractive consumer market.",
    source: "Reuters World",
    sourceUrl: "https://reuters.com/world/feed",
    publishedDate: "2026-01-11T07:00:00Z",
    imageUrl: "https://picsum.photos/seed/indiaeconomy/800/450",
    author: "Manoj Kumar",
    category: "Economy",
  },
  {
    id: "reuters_6",
    title: "UN Climate Summit Agrees on Historic Loss and Damage Fund Framework",
    summary:
      "The UN climate summit has concluded with a breakthrough agreement on the loss and damage fund framework, establishing a $100 billion annual commitment to help developing nations cope with climate impacts. The deal follows years of contentious negotiations.",
    content:
      "United Nations climate negotiators have achieved a historic breakthrough with agreement on the operational framework for the loss and damage fund, establishing annual commitments of $100 billion to help vulnerable nations cope with irreversible climate impacts. The agreement, reached after marathon negotiations, represents the most significant climate finance commitment since the Paris Agreement.\n\nThe fund will provide grants and concessional finance to developing countries suffering from climate-related disasters, sea level rise, and ecosystem degradation. Unlike existing climate funds focused on mitigation and adaptation, loss and damage funding addresses impacts that cannot be prevented or adapted to.\n\n'This is a victory for climate justice,' said UN Secretary-General António Guterres. 'For too long, the world's most vulnerable communities have borne the costs of a crisis they did not create. This fund begins to address that injustice.'\n\nDeveloped nations, led by the United States and European Union, committed to mobilize $75 billion annually from public sources, with the remainder expected from private finance mechanisms and innovative sources such as carbon markets and aviation levies.\n\nSmall island developing states, which led advocacy for loss and damage financing, celebrated the agreement while noting it falls short of estimated needs. Scientists estimate climate-related losses in developing countries could exceed $400 billion annually by 2030.\n\nImplementation details will be finalized at a follow-up technical meeting, with the fund expected to begin disbursements in late 2026. A new governing board with equal representation from developed and developing countries will oversee fund operations.",
    source: "Reuters World",
    sourceUrl: "https://reuters.com/world/feed",
    publishedDate: "2026-01-10T14:30:00Z",
    imageUrl: "https://picsum.photos/seed/climatefund/800/450",
    author: "Kate Abnett",
    category: "Climate",
  },
  {
    id: "reuters_7",
    title: "NATO Expands Cyber Defense Capabilities with AI-Powered Threat Detection",
    summary:
      "NATO has unveiled a comprehensive cyber defense upgrade featuring AI-powered threat detection systems capable of identifying and neutralizing attacks in milliseconds. The initiative responds to escalating state-sponsored cyber warfare.",
    content:
      "NATO has announced a major expansion of its cyber defense capabilities, deploying artificial intelligence systems across member nations' critical infrastructure to detect and respond to cyber attacks in near real-time. The initiative represents the alliance's most significant investment in digital security infrastructure.\n\nThe new Cyber Rapid Response Teams (CRRTs), equipped with AI-powered threat detection, can identify malicious network activity and initiate countermeasures within milliseconds—far faster than human operators could respond. The systems use machine learning to recognize attack patterns and adapt to emerging threats.\n\n'The cyber domain has become as critical to collective defense as land, sea, and air,' said NATO Secretary General Mark Rutte. 'These capabilities ensure we can defend our nations against increasingly sophisticated digital threats.'\n\nThe deployment follows a series of high-profile cyber attacks attributed to state actors targeting NATO member nations' government systems, energy infrastructure, and financial institutions. Recent incidents demonstrated attackers' growing sophistication and potential for causing widespread disruption.\n\nThe initiative includes establishment of a central AI operations center in Brussels, coordinating threat intelligence sharing among all 32 member nations. Individual countries will maintain national cyber defense capabilities while benefiting from collective intelligence.\n\nRussia and China have criticized the NATO announcement as 'militarization of cyberspace,' though both nations have been accused of conducting offensive cyber operations. Cybersecurity experts note that defensive capabilities are essential regardless of geopolitical tensions.",
    source: "Reuters World",
    sourceUrl: "https://reuters.com/world/feed",
    publishedDate: "2026-01-09T10:00:00Z",
    imageUrl: "https://picsum.photos/seed/natocyber/800/450",
    author: "Robin Emmott",
    category: "Security",
  },
];

// ==========================================
// HELPER FUNCTIONS
// ==========================================

export const getTweetsByUser = (userId: string): Tweet[] =>
  tweets.filter((tweet) => tweet.userId === userId);

export const getTweetsByTopic = (topic: Tweet["topic"]): Tweet[] =>
  tweets.filter((tweet) => tweet.topic === topic);

export const getUserById = (userId: string): TwitterUser | undefined =>
  twitterUsers.find((user) => user.id === userId);

export const getAllArticles = (): RSSArticle[] => [
  ...techCrunchArticles,
  ...espnSportsArticles,
  ...reutersWorldArticles,
];

export const getArticlesBySource = (sourceName: string): RSSArticle[] => {
  switch (sourceName) {
    case "TechCrunch AI":
      return techCrunchArticles;
    case "ESPN Sports":
      return espnSportsArticles;
    case "Reuters World":
      return reutersWorldArticles;
    default:
      return [];
  }
};

export const getArticlesByCategory = (category: string): RSSArticle[] =>
  getAllArticles().filter(
    (article) => article.category.toLowerCase() === category.toLowerCase()
  );

// Get tweet with user info combined
export interface TweetWithUser extends Tweet {
  user: TwitterUser;
}

export const getTweetsWithUsers = (): TweetWithUser[] =>
  tweets.map((tweet) => ({
    ...tweet,
    user: getUserById(tweet.userId)!,
  }));

export const getTweetsWithUsersByTopic = (
  topic: Tweet["topic"]
): TweetWithUser[] =>
  getTweetsByTopic(topic).map((tweet) => ({
    ...tweet,
    user: getUserById(tweet.userId)!,
  }));
