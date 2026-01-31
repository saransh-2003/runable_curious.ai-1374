import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "wouter";
import {
  techCrunchArticles,
  espnSportsArticles,
  reutersWorldArticles,
  type RSSArticle,
} from "../data/mockData";

interface User {
  email: string;
  createdAt: string;
}

interface CuratorState {
  prompt: string;
  selectedTwitter: string[];
  selectedRSS: string[];
}

interface DeepSeekArticle {
  id: string;
  title: string;
  summary: string;
  source: string;
  publishedDate: string;
  url: string;
}

interface FetchedTweet {
  id: string;
  content: string;
  author: string;
  handle: string;
  avatar: string;
  timestamp: string;
  url: string;
}

interface NewsCluster {
  id: string;
  topic: string;
  topicLabel: string;
  mainHeadline: string;
  mainSummary: string;
  combinedSummary: string;
  mainImage: string;
  timestamp: string;
  mostRecentTime: string;
  articleCount: number;
  sources: Array<{
    type: "twitter" | "rss" | "deepseek";
    name: string;
    icon: string;
    url?: string;
  }>;
  items: Array<{
    type: "tweet" | "article" | "deepseek";
    title: string;
    content: string;
    source: string;
    sourceHandle?: string;
    url?: string;
    timestamp?: string;
  }>;
}

// Topic keywords for better clustering
const TOPIC_KEYWORDS: Record<string, string[]> = {
  ai: [
    "ai",
    "artificial intelligence",
    "gpt",
    "deepseek",
    "llama",
    "openai",
    "anthropic",
    "claude",
    "machine learning",
    "deep learning",
    "neural",
    "model",
    "chip",
    "semiconductor",
    "language model",
    "llm",
    "chatgpt",
    "deepmind",
    "reasoning",
    "multimodal",
  ],
  cricket: [
    "cricket",
    "ipl",
    "test",
    "t20",
    "odi",
    "kohli",
    "batting",
    "bowling",
    "wicket",
    "runs",
    "innings",
    "icc",
    "world cup",
    "bcci",
    "century",
    "six",
    "four",
  ],
  geopolitics: [
    "geopolitics",
    "china",
    "us",
    "usa",
    "trade",
    "sanctions",
    "export",
    "import",
    "policy",
    "government",
    "war",
    "diplomacy",
    "eu",
    "mercosur",
    "tariff",
    "tensions",
    "bilateral",
    "summit",
    "foreign",
  ],
  health: [
    "health",
    "who",
    "medical",
    "cancer",
    "diagnosis",
    "treatment",
    "drug",
    "fda",
    "vaccine",
    "hospital",
    "disease",
    "healthcare",
    "clinical",
    "patient",
    "therapy",
  ],
  sports: [
    "sports",
    "football",
    "nfl",
    "tennis",
    "basketball",
    "soccer",
    "champions",
    "world cup",
    "playoff",
    "championship",
    "match",
    "game",
    "score",
    "player",
    "team",
  ],
  tech: [
    "tech",
    "microsoft",
    "google",
    "meta",
    "apple",
    "startup",
    "funding",
    "investment",
    "ipo",
    "valuation",
    "billion",
    "data center",
    "cloud",
    "infrastructure",
    "software",
  ],
};

// Topic display labels with colors
const TOPIC_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  ai: {
    label: "AI & Technology",
    color: "text-violet-700",
    bg: "bg-violet-50",
    border: "border-violet-200",
  },
  cricket: {
    label: "Cricket",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
  geopolitics: {
    label: "Geopolitics",
    color: "text-rose-700",
    bg: "bg-rose-50",
    border: "border-rose-200",
  },
  health: {
    label: "Health & Medicine",
    color: "text-cyan-700",
    bg: "bg-cyan-50",
    border: "border-cyan-200",
  },
  sports: {
    label: "Sports",
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  tech: {
    label: "Tech & Business",
    color: "text-indigo-700",
    bg: "bg-indigo-50",
    border: "border-indigo-200",
  },
  general: {
    label: "General News",
    color: "text-gray-700",
    bg: "bg-gray-50",
    border: "border-gray-200",
  },
};

const detectTopic = (text: string): string => {
  const lowerText = text.toLowerCase();
  let bestMatch = "general";
  let maxCount = 0;

  for (const [topic, keywords] of Object.entries(TOPIC_KEYWORDS)) {
    const count = keywords.filter((kw) => lowerText.includes(kw)).length;
    if (count > maxCount) {
      maxCount = count;
      bestMatch = topic;
    }
  }

  return bestMatch;
};

const isRelevantToPrompt = (text: string, prompt: string): boolean => {
  const lowerText = text.toLowerCase();
  const promptWords = prompt.toLowerCase().split(/\s+/);
  const promptTopic = detectTopic(prompt);
  const textTopic = detectTopic(text);

  // Check if topics match
  if (promptTopic === textTopic && promptTopic !== "general") {
    return true;
  }

  // Check if any prompt words appear in text (words longer than 3 chars)
  return promptWords.some((word) => word.length > 3 && lowerText.includes(word));
};

const getTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) return `${diffDays}d ago`;
  if (diffHours > 0) return `${diffHours}h ago`;
  return "Just now";
};

const getRSSArticles = (sourceName: string): RSSArticle[] => {
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

// Generate a combined summary from multiple sources
const generateCombinedSummary = (items: NewsCluster["items"]): string => {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0].content;

  // Get unique key points from different sources
  const summaryParts: string[] = [];
  const seenContent = new Set<string>();

  // Prioritize articles over tweets for main content
  const sortedItems = [...items].sort((a, b) => {
    if (a.type === "article" || a.type === "deepseek") return -1;
    if (b.type === "article" || b.type === "deepseek") return 1;
    return 0;
  });

  for (const item of sortedItems.slice(0, 3)) {
    // Get first 2 sentences of content
    const sentences = item.content.split(/[.!?]+/).filter((s) => s.trim().length > 20);
    const keyPoint = sentences.slice(0, 2).join(". ").trim();

    if (keyPoint && !seenContent.has(keyPoint.toLowerCase().slice(0, 50))) {
      summaryParts.push(keyPoint);
      seenContent.add(keyPoint.toLowerCase().slice(0, 50));
    }
  }

  return summaryParts.join(". ") + (summaryParts.length > 0 ? "." : "");
};

// Generate narration script - reads exactly what's shown on screen (max 480 chars for Sarvam limit)
const generateNarrationScript = (cluster: NewsCluster): string => {
  const headline = cluster.mainHeadline || cluster.items[0]?.title || "";
  
  // Use the exact same text that's displayed on screen
  const displayedSummary = cluster.combinedSummary || cluster.mainSummary || cluster.items[0]?.content || "";
  
  // Combine headline and summary, same as what user sees
  let narration = headline ? `${headline}. ${displayedSummary}` : displayedSummary;
  
  // Truncate to fit Sarvam's 500 char limit
  if (narration.length > 480) {
    narration = narration.substring(0, 477) + "...";
  }
  
  return narration;
};

function ResultsPage() {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [, setLocation] = useLocation();
  const [curatorState, setCuratorState] = useState<CuratorState | null>(null);
  const [clusters, setClusters] = useState<NewsCluster[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [loadingAudioId, setLoadingAudioId] = useState<string | null>(null);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [askInput, setAskInput] = useState("");
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  const fetchDeepSeekNews = useCallback(async (query: string): Promise<DeepSeekArticle[]> => {
    try {
      console.log('Making API call to /api/deepseek-news with query:', query);
      const response = await fetch("/api/deepseek-news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      console.log('API response status:', response.status, response.ok);
      
      if (!response.ok) {
        console.error("DeepSeek API error - response not ok");
        return [];
      }

      const data = await response.json();
      console.log('DeepSeek returned', data.articles?.length, 'articles');
      return data.articles || [];
    } catch (error) {
      console.error("Failed to fetch DeepSeek news:", error);
      return [];
    }
  }, []);

  // Fetch tweets from selected Twitter accounts
  const fetchTweets = useCallback(async (handles: string[]): Promise<FetchedTweet[]> => {
    if (handles.length === 0) return [];
    
    try {
      console.log('Fetching tweets for handles:', handles);
      const response = await fetch("/api/fetch-tweets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ handles }),
      });

      if (!response.ok) {
        console.error("Failed to fetch tweets");
        return [];
      }

      const data = await response.json();
      console.log('Fetched tweets:', data.tweets?.length);
      return data.tweets || [];
    } catch (error) {
      console.error("Error fetching tweets:", error);
      return [];
    }
  }, []);

  // Filter tweets using DeepSeek
  const filterTweetsWithAI = useCallback(async (tweets: FetchedTweet[], prompt: string): Promise<FetchedTweet[]> => {
    if (tweets.length === 0) return [];
    
    try {
      console.log('Filtering tweets with DeepSeek for prompt:', prompt);
      const response = await fetch("/api/filter-tweets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tweets, prompt }),
      });

      if (!response.ok) {
        console.error("Failed to filter tweets");
        return tweets; // Return all tweets as fallback
      }

      const data = await response.json();
      console.log('Filtered tweets:', data.filteredTweets?.length, 'out of', tweets.length);
      return data.filteredTweets || [];
    } catch (error) {
      console.error("Error filtering tweets:", error);
      return tweets;
    }
  }, []);

  const clusterNews = useCallback(
    (
      prompt: string,
      filteredTweets: FetchedTweet[],
      selectedRSSNames: string[],
      deepseekArticles: DeepSeekArticle[]
    ): NewsCluster[] => {
      const topicGroups: Record<string, NewsCluster> = {};

      // Helper to ensure topic group exists
      const ensureTopicGroup = (topic: string, timestamp: string, imageUrl?: string) => {
        if (!topicGroups[topic]) {
          const config = TOPIC_CONFIG[topic] || TOPIC_CONFIG.general;
          topicGroups[topic] = {
            id: `cluster-${topic}-${Date.now()}`,
            topic,
            topicLabel: config.label,
            mainHeadline: "",
            mainSummary: "",
            combinedSummary: "",
            mainImage: imageUrl || `https://picsum.photos/seed/${topic}${Date.now()}/800/450`,
            timestamp,
            mostRecentTime: timestamp,
            articleCount: 0,
            sources: [],
            items: [],
          };
        }
      };

      // Add filtered tweets (already filtered by DeepSeek)
      filteredTweets.forEach((tweet) => {
        const topic = detectTopic(tweet.content);
        ensureTopicGroup(topic, tweet.timestamp);

        topicGroups[topic].items.push({
          type: "tweet",
          title: tweet.content.slice(0, 60) + "...",
          content: tweet.content,
          source: tweet.author,
          sourceHandle: tweet.handle,
          url: tweet.url,
          timestamp: tweet.timestamp,
        });

        topicGroups[topic].articleCount++;

        // Update most recent time
        if (new Date(tweet.timestamp) > new Date(topicGroups[topic].mostRecentTime)) {
          topicGroups[topic].mostRecentTime = tweet.timestamp;
        }

        if (!topicGroups[topic].sources.find((s) => s.name === tweet.handle)) {
          topicGroups[topic].sources.push({
            type: "twitter",
            name: tweet.handle,
            icon: "twitter",
            url: tweet.url,
          });
        }
      });

      // Filter and add relevant RSS articles
      selectedRSSNames.forEach((sourceName) => {
        const articles = getRSSArticles(sourceName);

        articles.forEach((article) => {
          if (!isRelevantToPrompt(article.title + " " + article.summary, prompt)) return;

          const topic = detectTopic(article.title + " " + article.summary);
          ensureTopicGroup(topic, article.publishedDate, article.imageUrl);

          // Use first article's image and headline for the cluster (prioritize articles)
          if (!topicGroups[topic].mainHeadline || topicGroups[topic].items.every((i) => i.type === "tweet")) {
            topicGroups[topic].mainHeadline = article.title;
            topicGroups[topic].mainSummary = article.summary;
            topicGroups[topic].mainImage = article.imageUrl;
          }

          topicGroups[topic].items.push({
            type: "article",
            title: article.title,
            content: article.summary,
            source: article.source,
            url: article.sourceUrl,
            timestamp: article.publishedDate,
          });

          topicGroups[topic].articleCount++;

          // Update most recent time
          if (new Date(article.publishedDate) > new Date(topicGroups[topic].mostRecentTime)) {
            topicGroups[topic].mostRecentTime = article.publishedDate;
          }

          if (!topicGroups[topic].sources.find((s) => s.name === article.source)) {
            topicGroups[topic].sources.push({
              type: "rss",
              name: article.source,
              icon: "rss",
            });
          }
        });
      });

      // Add DeepSeek articles
      // When only DeepSeek articles (no tweets/RSS), show each as individual card
      const onlyDeepSeekArticles = filteredTweets.length === 0 && selectedRSSNames.length === 0;
      
      console.log('Processing DeepSeek articles:', deepseekArticles.length, 'onlyDeepSeek:', onlyDeepSeekArticles);
      
      deepseekArticles.forEach((article, idx) => {
        // If only DeepSeek articles, create individual clusters for each article
        const topic = onlyDeepSeekArticles 
          ? `deepseek-article-${idx}` 
          : detectTopic(article.title + " " + article.summary);
        
        console.log(`DeepSeek article ${idx}: topic=${topic}, title=${article.title.substring(0, 50)}`);
        
        const config = onlyDeepSeekArticles 
          ? { label: article.source, color: "text-violet-700", bg: "bg-violet-50", border: "border-violet-200" }
          : (TOPIC_CONFIG[topic] || TOPIC_CONFIG.general);
        
        if (!topicGroups[topic]) {
          topicGroups[topic] = {
            id: `cluster-${topic}-${Date.now()}-${idx}`,
            topic,
            topicLabel: config.label,
            mainHeadline: article.title,
            mainSummary: article.summary,
            combinedSummary: "",
            mainImage: `https://picsum.photos/seed/${article.title.slice(0, 10)}${idx}/800/450`,
            timestamp: article.publishedDate,
            mostRecentTime: article.publishedDate,
            articleCount: 1,
            sources: [{
              type: "deepseek" as const,
              name: article.source,
              icon: "deepseek",
              url: article.url,
            }],
            items: [{
              type: "deepseek" as const,
              title: article.title,
              content: article.summary,
              source: article.source,
              url: article.url,
              timestamp: article.publishedDate,
            }],
          };
        } else {
          // Clustering mode - add to existing topic group
          if (!topicGroups[topic].mainHeadline || topicGroups[topic].items.every((i) => i.type === "tweet")) {
            topicGroups[topic].mainHeadline = article.title;
            topicGroups[topic].mainSummary = article.summary;
          }

          topicGroups[topic].items.push({
            type: "deepseek",
            title: article.title,
            content: article.summary,
            source: article.source,
            url: article.url,
            timestamp: article.publishedDate,
          });

          topicGroups[topic].articleCount++;

          if (new Date(article.publishedDate) > new Date(topicGroups[topic].mostRecentTime)) {
            topicGroups[topic].mostRecentTime = article.publishedDate;
          }

          if (!topicGroups[topic].sources.find((s) => s.name === article.source)) {
            topicGroups[topic].sources.push({
              type: "deepseek",
              name: article.source,
              icon: "deepseek",
              url: article.url,
            });
          }
        }
      });

      // Generate combined summaries and finalize clusters
      const finalClusters = Object.values(topicGroups)
        .filter((cluster) => cluster.items.length > 0)
        .map((cluster) => ({
          ...cluster,
          combinedSummary: generateCombinedSummary(cluster.items),
        }))
        .sort((a, b) => new Date(b.mostRecentTime).getTime() - new Date(a.mostRecentTime).getTime());

      return finalClusters;
    },
    []
  );

  useEffect(() => {
    setMounted(true);

    const userData = localStorage.getItem("curious_user");
    if (!userData) {
      setLocation("/login");
      return;
    }
    setUser(JSON.parse(userData));

    const stateData = localStorage.getItem("curator_state");
    if (!stateData) {
      setLocation("/curator");
      return;
    }
    setCuratorState(JSON.parse(stateData));
  }, [setLocation]);

  useEffect(() => {
    if (!curatorState) return;

    const loadNews = async () => {
      setLoading(true);

      // Fetch from DeepSeek API (always)
      console.log('Fetching DeepSeek news for prompt:', curatorState.prompt);
      const deepseekArticles = await fetchDeepSeekNews(curatorState.prompt);
      console.log('DeepSeek articles received:', deepseekArticles.length);

      // Fetch and filter tweets if Twitter accounts are selected
      let filteredTweets: FetchedTweet[] = [];
      if (curatorState.selectedTwitter.length > 0) {
        console.log('Fetching tweets for:', curatorState.selectedTwitter);
        const allTweets = await fetchTweets(curatorState.selectedTwitter);
        console.log('All tweets fetched:', allTweets.length);
        
        if (allTweets.length > 0) {
          filteredTweets = await filterTweetsWithAI(allTweets, curatorState.prompt);
          console.log('Tweets after DeepSeek filtering:', filteredTweets.length);
        }
      }

      // Cluster all news
      const newClusters = clusterNews(
        curatorState.prompt,
        filteredTweets,
        curatorState.selectedRSS,
        deepseekArticles
      );
      console.log('Clusters created:', newClusters.length);

      setClusters(newClusters);
      setLoading(false);
    };

    loadNews();
  }, [curatorState, fetchDeepSeekNews, fetchTweets, filterTweetsWithAI, clusterNews]);

  const getInitial = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  const toggleExpanded = (id: string) => {
    setExpandedCards((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSpeak = async (id: string, cluster: NewsCluster) => {
    // If currently speaking this item, stop it
    if (speakingId === id) {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        setCurrentAudio(null);
      }
      setSpeakingId(null);
      return;
    }

    // Stop any currently playing audio
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentAudio(null);
    }
    setSpeakingId(null);
    setAudioError(null);

    // Generate narration script
    const narrationText = generateNarrationScript(cluster);

    // Set loading state
    setLoadingAudioId(id);

    try {
      const response = await fetch("/api/sarvam-tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: narrationText }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate audio");
      }

      const data = await response.json();

      if (!data.audio) {
        throw new Error("No audio received");
      }

      // Decode base64 and create audio element
      const audioBlob = base64ToBlob(data.audio, "audio/wav");
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      audio.onended = () => {
        setSpeakingId(null);
        setCurrentAudio(null);
        URL.revokeObjectURL(audioUrl);
      };

      audio.onerror = () => {
        setAudioError("Failed to play audio");
        setSpeakingId(null);
        setCurrentAudio(null);
        URL.revokeObjectURL(audioUrl);
      };

      setCurrentAudio(audio);
      setSpeakingId(id);
      await audio.play();
    } catch (error) {
      console.error("TTS error:", error);
      setAudioError("Failed to generate audio. Please try again.");
      setTimeout(() => setAudioError(null), 3000);
    } finally {
      setLoadingAudioId(null);
    }
  };

  // Helper function to convert base64 to Blob
  const base64ToBlob = (base64: string, mimeType: string): Blob => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  };

  // Check if no sources are selected
  const noSourcesSelected =
    curatorState &&
    curatorState.selectedTwitter.length === 0 &&
    curatorState.selectedRSS.length === 0;

  if (!user || !curatorState) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#faf9f7] font-['Sora',sans-serif]">
      {/* Subtle background pattern */}
      <div
        className="fixed inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #d4d1cc 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Error Toast */}
      {audioError && (
        <div className="fixed top-4 right-4 z-[100] animate-in slide-in-from-top fade-in duration-300">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl shadow-lg flex items-center gap-3">
            <svg
              className="w-5 h-5 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
            <span className="text-sm font-medium">{audioError}</span>
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav
        className={`sticky top-0 z-50 bg-[#faf9f7]/90 backdrop-blur-md border-b border-gray-200/50 flex items-center justify-between px-4 md:px-8 py-4 transition-all duration-700 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
        }`}
      >
        <div className="flex items-center gap-3">
          {/* Mobile menu button */}
          <button
            onClick={() => setShowMobileSidebar(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-indigo-600/30 transition-shadow">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                  />
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight hidden sm:flex">
                <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
                  curious
                </span>
                <span className="text-gray-900">.ai</span>
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <Link href="/curator">
            <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-indigo-600/30 transition-all">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              New Curator
            </button>
            <button className="sm:hidden p-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-lg">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </button>
          </Link>
          <Link href="/profile">
            <div className="flex items-center gap-3 cursor-pointer group">
              <span className="hidden lg:block text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors max-w-[150px] truncate">
                {user.email}
              </span>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white font-semibold text-sm ring-2 ring-white shadow-md group-hover:shadow-lg group-hover:shadow-indigo-600/20 transition-all">
                {getInitial(user.email)}
              </div>
            </div>
          </Link>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      {showMobileSidebar && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowMobileSidebar(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-80 bg-white shadow-2xl animate-in slide-in-from-left duration-300">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                </div>
                <span className="text-lg font-bold tracking-tight">
                  <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">curious</span>
                  <span className="text-gray-900">.ai</span>
                </span>
              </div>
              <button
                onClick={() => setShowMobileSidebar(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              {/* For You Section */}
              <div className="mb-6">
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-indigo-50 to-violet-50 rounded-xl border border-indigo-100">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">For You</p>
                    <p className="text-xs text-gray-500">From all your curators</p>
                  </div>
                </div>
              </div>
              {/* AI Curators */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">AI Curators</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 transition-colors">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 truncate">{curatorState.prompt}</p>
                      <p className="text-xs text-gray-400">Just now</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* New Curator Button */}
              <Link href="/curator">
                <div 
                  className="mt-6 flex items-center gap-3 p-3 rounded-xl border border-dashed border-gray-300 hover:border-indigo-400 hover:bg-indigo-50/50 transition-all cursor-pointer group"
                  onClick={() => setShowMobileSidebar(false)}
                >
                  <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-600 group-hover:text-indigo-700">New AI Curator</p>
                    <p className="text-xs text-gray-400">Build your own AI</p>
                  </div>
                </div>
              </Link>
              {/* Profile Link */}
              <Link href="/profile">
                <div 
                  className="mt-4 flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => setShowMobileSidebar(false)}
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white font-semibold text-sm">
                    {getInitial(user.email)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">{user.email}</p>
                    <p className="text-xs text-gray-400">View profile</p>
                  </div>
                </div>
              </Link>
            </div>
          </aside>
        </div>
      )}

      {/* Main Layout */}
      <div className="flex relative">
        {/* Left Sidebar */}
        <aside
          className={`hidden lg:block w-72 shrink-0 h-[calc(100vh-73px)] sticky top-[73px] border-r border-gray-200/50 bg-white/50 backdrop-blur-sm transition-all duration-700 delay-100 ${
            mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
          }`}
        >
          <div className="p-6">
            {/* For You Section */}
            <div className="mb-8">
              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-indigo-50 to-violet-50 rounded-xl border border-indigo-100">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">For You</p>
                  <p className="text-xs text-gray-500">From all your curators</p>
                </div>
              </div>
            </div>

            {/* AI Curators */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                AI Curators
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                      />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate group-hover:text-gray-900">
                      {curatorState.prompt}
                    </p>
                    <p className="text-xs text-gray-400">Just now</p>
                  </div>
                </div>
              </div>
            </div>

            {/* New Curator Button */}
            <Link href="/curator">
              <div className="mt-6 flex items-center gap-3 p-3 rounded-xl border border-dashed border-gray-300 hover:border-indigo-400 hover:bg-indigo-50/50 transition-all cursor-pointer group">
                <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                  <svg
                    className="w-5 h-5 text-gray-400 group-hover:text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-600 group-hover:text-indigo-700">
                    New AI Curator
                  </p>
                  <p className="text-xs text-gray-400">Build your own AI</p>
                </div>
              </div>
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main
          className={`flex-1 min-w-0 transition-all duration-700 delay-200 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Tab Navigation */}
          <div className="sticky top-[73px] z-40 bg-[#faf9f7]/90 backdrop-blur-md border-b border-gray-200/50 px-6 md:px-8 py-3">
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 shadow-sm text-sm font-medium text-gray-800">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
                  />
                </svg>
                Digests
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-100 transition-colors">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z"
                  />
                </svg>
                News
              </button>
            </div>
          </div>

          {/* News Content */}
          <div className="p-6 md:p-8">
            {loading ? (
              // Skeleton Loader
              <div className="space-y-6 animate-pulse">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl border border-gray-200/80 shadow-lg overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-gray-200" />
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded w-48 mb-2" />
                          <div className="h-3 bg-gray-100 rounded w-24" />
                        </div>
                      </div>
                      <div className="h-48 bg-gray-200 rounded-xl mb-4" />
                      <div className="h-6 bg-gray-200 rounded w-3/4 mb-3" />
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-100 rounded w-full" />
                        <div className="h-4 bg-gray-100 rounded w-5/6" />
                        <div className="h-4 bg-gray-100 rounded w-4/6" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : noSourcesSelected && clusters.length === 0 ? (
              // Empty State - No Sources Selected
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-amber-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-3">No Sources Selected</h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  You haven't selected any sources to curate from. Add Twitter accounts or RSS feeds
                  to get personalized news.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                  <Link href="/curator">
                    <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-indigo-600/30 transition-all flex items-center gap-2">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 4.5v15m7.5-7.5h-15"
                        />
                      </svg>
                      Add Sources
                    </button>
                  </Link>
                </div>
                <div className="max-w-lg mx-auto">
                  <p className="text-sm text-gray-400 mb-4">Suggested topics to explore:</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {["AI developments", "Cricket news", "Global geopolitics", "Health tech"].map(
                      (topic) => (
                        <span
                          key={topic}
                          className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-indigo-50 hover:text-indigo-600 transition-colors cursor-pointer"
                        >
                          {topic}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>
            ) : clusters.length === 0 ? (
              // Empty State - No Relevant Content
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-3">No Matching News Found</h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  We couldn't find any news matching <strong>"{curatorState.prompt}"</strong> from
                  your selected sources. Try adjusting your search or adding more sources.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                  <Link href="/curator">
                    <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-indigo-600/30 transition-all">
                      Try Different Search
                    </button>
                  </Link>
                  <Link href="/curator">
                    <button className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all">
                      Add More Sources
                    </button>
                  </Link>
                </div>
                <div className="max-w-lg mx-auto">
                  <p className="text-sm text-gray-400 mb-4">Popular topics that work well:</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {["AI & Machine Learning", "Cricket matches", "Tech funding", "Global politics"].map(
                      (topic) => (
                        <span
                          key={topic}
                          className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-indigo-50 hover:text-indigo-600 transition-colors cursor-pointer"
                        >
                          {topic}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>
            ) : (
              // News Clusters
              <div className="space-y-6">
                {clusters.map((cluster, index) => {
                  const topicConfig = TOPIC_CONFIG[cluster.topic] || TOPIC_CONFIG.general;

                  return (
                    <article
                      key={cluster.id}
                      className="bg-white rounded-2xl border border-gray-200/80 shadow-lg shadow-gray-900/5 overflow-hidden hover:shadow-xl hover:shadow-gray-900/10 transition-all duration-300"
                      style={{
                        animationDelay: `${index * 100}ms`,
                      }}
                    >
                      <div className="p-6">
                        {/* Header with Topic Badge and Article Count */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                              <span className="text-white font-bold text-sm">
                                {cluster.topicLabel.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-gray-900">{cluster.topicLabel} Digest</p>
                                {/* Topic Badge */}
                                <span
                                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${topicConfig.bg} ${topicConfig.color} ${topicConfig.border} border`}
                                >
                                  {cluster.topic.toUpperCase()}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-gray-400">
                                <span>{getTimeAgo(cluster.mostRecentTime)}</span>
                                <span>•</span>
                                <span className="font-medium">
                                  {cluster.articleCount}{" "}
                                  {cluster.articleCount === 1 ? "article" : "articles"}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600">
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                                />
                              </svg>
                            </button>
                            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600">
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>

                        {/* Main Image */}
                        <div className="relative mb-4 rounded-xl overflow-hidden aspect-[16/9] bg-gray-100">
                          <img
                            src={cluster.mainImage}
                            alt={cluster.mainHeadline}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                          {/* Overlay badge for article count */}
                          <div className="absolute top-3 right-3 px-2.5 py-1 bg-black/60 backdrop-blur-sm text-white text-xs font-medium rounded-lg flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                            </svg>
                            {cluster.articleCount} sources
                          </div>
                        </div>

                        {/* Main Content */}
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 leading-tight">
                          {cluster.mainHeadline ||
                            cluster.items[0]?.title ||
                            `Latest ${cluster.topicLabel} News`}
                        </h2>

                        {/* Combined Summary from multiple sources */}
                        <p
                          className={`text-gray-600 leading-relaxed mb-4 ${
                            expandedCards.has(cluster.id) ? "" : "line-clamp-4"
                          }`}
                        >
                          {cluster.combinedSummary || cluster.mainSummary || cluster.items[0]?.content}
                        </p>

                        {(cluster.combinedSummary || cluster.mainSummary || cluster.items[0]?.content)
                          ?.length > 300 && (
                          <button
                            onClick={() => toggleExpanded(cluster.id)}
                            className="text-indigo-600 font-medium text-sm hover:text-indigo-700 transition-colors mb-4"
                          >
                            {expandedCards.has(cluster.id) ? "Show less" : "Show more"}
                          </button>
                        )}

                        {/* Listen Button */}
                        <button
                          onClick={() => handleSpeak(cluster.id, cluster)}
                          disabled={loadingAudioId === cluster.id}
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all mb-4 ${
                            speakingId === cluster.id
                              ? "bg-indigo-600 text-white"
                              : loadingAudioId === cluster.id
                              ? "bg-indigo-100 text-indigo-600 cursor-wait"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {loadingAudioId === cluster.id ? (
                            <>
                              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                />
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                              </svg>
                              Generating...
                            </>
                          ) : speakingId === cluster.id ? (
                            <>
                              <svg
                                className="w-4 h-4 animate-pulse"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                              </svg>
                              Stop
                            </>
                          ) : (
                            <>
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z"
                                />
                              </svg>
                              Listen
                            </>
                          )}
                        </button>

                        {/* Sources with proper icons */}
                        <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                          <span className="text-xs text-gray-400 mr-2">Sources:</span>
                          <div className="flex items-center gap-2 flex-wrap">
                            {cluster.sources.map((source, i) => (
                              source.type === "twitter" && source.url ? (
                                <a
                                  key={i}
                                  href={source.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-sky-50 text-sky-700 hover:bg-sky-100 transition-colors cursor-pointer"
                                >
                                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                  </svg>
                                  {source.name}
                                  <svg className="w-3 h-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                  </svg>
                                </a>
                              ) : (
                                <span
                                  key={i}
                                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                                    source.type === "twitter"
                                      ? "bg-sky-50 text-sky-700"
                                      : source.type === "rss"
                                      ? "bg-orange-50 text-orange-700"
                                      : "bg-violet-50 text-violet-700"
                                  }`}
                                >
                                  {source.type === "twitter" && (
                                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                    </svg>
                                  )}
                                  {source.type === "rss" && (
                                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                                      <path d="M6.18 15.64a2.18 2.18 0 1 1 0 4.36 2.18 2.18 0 0 1 0-4.36zM4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44zm0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93v-2.83z" />
                                    </svg>
                                  )}
                                  {source.type === "deepseek" && (
                                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                                      <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                                    </svg>
                                  )}
                                  {source.name}
                                </span>
                              )
                            ))}
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>

          {/* Ask Input */}
          <div className="sticky bottom-0 bg-gradient-to-t from-[#faf9f7] via-[#faf9f7] to-transparent pt-8 pb-6 px-6 md:px-8">
            <div className="max-w-3xl mx-auto relative">
              <input
                type="text"
                value={askInput}
                onChange={(e) => setAskInput(e.target.value)}
                placeholder="Ask about your For You feed..."
                className="w-full px-5 py-4 pr-14 bg-white border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 shadow-lg shadow-gray-900/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 hover:shadow-xl hover:shadow-indigo-600/40 transition-all">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                  />
                </svg>
              </button>
            </div>
          </div>
        </main>

        {/* Right Sidebar */}
        <aside
          className={`hidden xl:block w-80 shrink-0 h-[calc(100vh-73px)] sticky top-[73px] border-l border-gray-200/50 bg-white/50 backdrop-blur-sm transition-all duration-700 delay-300 ${
            mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
          }`}
        >
          <div className="p-6">
            <h2 className="text-2xl font-['Instrument_Serif',serif] text-gray-900 mb-2">For You</h2>
            <p className="text-sm text-gray-500 mb-6">
              Your personalized content from all curators
            </p>

            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center mb-8">
              <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6.18 15.64a2.18 2.18 0 1 1 0 4.36 2.18 2.18 0 0 1 0-4.36zM4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44zm0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93v-2.83z" />
              </svg>
            </div>

            {/* Quick Stats */}
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-xl border border-indigo-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Topics Found</span>
                  <span className="text-2xl font-bold text-indigo-600">{clusters.length}</span>
                </div>
                <div className="text-xs text-gray-500">Based on "{curatorState.prompt}"</div>
              </div>

              {/* Total Articles */}
              <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Total Articles</span>
                  <span className="text-2xl font-bold text-emerald-600">
                    {clusters.reduce((acc, c) => acc + c.articleCount, 0)}
                  </span>
                </div>
                <div className="text-xs text-gray-500">From all selected sources</div>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm font-medium text-gray-600 mb-2">Sources Active</p>
                <div className="flex items-center gap-2 flex-wrap">
                  {curatorState.selectedTwitter.length > 0 && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-sky-100 text-sky-700 rounded text-xs font-medium">
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                      {curatorState.selectedTwitter.length}
                    </span>
                  )}
                  {curatorState.selectedRSS.length > 0 && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium">
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6.18 15.64a2.18 2.18 0 1 1 0 4.36 2.18 2.18 0 0 1 0-4.36zM4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44zm0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93v-2.83z" />
                      </svg>
                      {curatorState.selectedRSS.length}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-violet-100 text-violet-700 rounded text-xs font-medium">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                    </svg>
                    AI
                  </span>
                </div>
              </div>

              {/* Topic Breakdown */}
              {clusters.length > 0 && (
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm font-medium text-gray-600 mb-3">Topics Breakdown</p>
                  <div className="space-y-2">
                    {clusters.map((cluster) => {
                      const config = TOPIC_CONFIG[cluster.topic] || TOPIC_CONFIG.general;
                      return (
                        <div key={cluster.id} className="flex items-center justify-between">
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.color}`}
                          >
                            {cluster.topicLabel}
                          </span>
                          <span className="text-xs text-gray-500">{cluster.articleCount} articles</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default ResultsPage;
