import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "wouter";
import {
  tweets,
  twitterUsers,
  techCrunchArticles,
  espnSportsArticles,
  reutersWorldArticles,
  type Tweet,
  type RSSArticle,
  type TwitterUser,
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

interface GeminiArticle {
  id: string;
  title: string;
  summary: string;
  source: string;
  publishedDate: string;
  url: string;
}

interface NewsCluster {
  id: string;
  topic: string;
  mainHeadline: string;
  mainSummary: string;
  mainImage: string;
  timestamp: string;
  sources: Array<{
    type: "twitter" | "rss" | "gemini";
    name: string;
    icon: string;
  }>;
  items: Array<{
    type: "tweet" | "article" | "gemini";
    title: string;
    content: string;
    source: string;
    sourceHandle?: string;
    url?: string;
  }>;
}

const TOPIC_KEYWORDS: Record<string, string[]> = {
  ai: ["ai", "artificial intelligence", "gpt", "gemini", "llama", "openai", "anthropic", "claude", "machine learning", "deep learning", "neural", "model", "chip", "semiconductor"],
  cricket: ["cricket", "ipl", "test", "t20", "odi", "kohli", "batting", "bowling", "wicket", "runs", "innings"],
  geopolitics: ["geopolitics", "china", "us", "trade", "sanctions", "export", "import", "policy", "government", "war", "diplomacy", "eu", "mercosur"],
  health: ["health", "who", "medical", "cancer", "diagnosis", "treatment", "drug", "fda", "vaccine", "hospital", "disease"],
  sports: ["sports", "football", "nfl", "tennis", "basketball", "soccer", "champions", "world cup", "playoff", "championship"],
  tech: ["tech", "microsoft", "google", "meta", "apple", "startup", "funding", "investment", "ipo", "valuation"],
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

  // Check if any prompt words appear in text
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

const getUserFromHandle = (handle: string): TwitterUser | undefined => {
  return twitterUsers.find((u) => u.handle === handle);
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

function ResultsPage() {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [, setLocation] = useLocation();
  const [curatorState, setCuratorState] = useState<CuratorState | null>(null);
  const [clusters, setClusters] = useState<NewsCluster[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [askInput, setAskInput] = useState("");

  const fetchGeminiNews = useCallback(async (query: string): Promise<GeminiArticle[]> => {
    try {
      const response = await fetch("/api/gemini-news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        console.error("Gemini API error");
        return [];
      }

      const data = await response.json();
      return data.articles || [];
    } catch (error) {
      console.error("Failed to fetch Gemini news:", error);
      return [];
    }
  }, []);

  const clusterNews = useCallback(
    (
      prompt: string,
      selectedTwitterHandles: string[],
      selectedRSSNames: string[],
      geminiArticles: GeminiArticle[]
    ): NewsCluster[] => {
      const topicGroups: Record<string, NewsCluster> = {};

      // Filter and add relevant tweets
      selectedTwitterHandles.forEach((handle) => {
        const user = getUserFromHandle(handle);
        if (!user) return;

        const userTweets = tweets.filter((t) => {
          const twitterUser = twitterUsers.find((u) => u.id === t.userId);
          return twitterUser?.handle === handle;
        });

        userTweets.forEach((tweet) => {
          if (!isRelevantToPrompt(tweet.content, prompt)) return;

          const topic = detectTopic(tweet.content);
          if (!topicGroups[topic]) {
            topicGroups[topic] = {
              id: `cluster-${topic}`,
              topic: topic.charAt(0).toUpperCase() + topic.slice(1),
              mainHeadline: "",
              mainSummary: "",
              mainImage: `https://picsum.photos/seed/${topic}${Date.now()}/800/450`,
              timestamp: tweet.createdAt,
              sources: [],
              items: [],
            };
          }

          topicGroups[topic].items.push({
            type: "tweet",
            title: tweet.content.slice(0, 60) + "...",
            content: tweet.content,
            source: user.name,
            sourceHandle: user.handle,
          });

          if (!topicGroups[topic].sources.find((s) => s.name === user.handle)) {
            topicGroups[topic].sources.push({
              type: "twitter",
              name: user.handle,
              icon: "twitter",
            });
          }
        });
      });

      // Filter and add relevant RSS articles
      selectedRSSNames.forEach((sourceName) => {
        const articles = getRSSArticles(sourceName);

        articles.forEach((article) => {
          if (!isRelevantToPrompt(article.title + " " + article.summary, prompt)) return;

          const topic = detectTopic(article.title + " " + article.summary);
          if (!topicGroups[topic]) {
            topicGroups[topic] = {
              id: `cluster-${topic}`,
              topic: topic.charAt(0).toUpperCase() + topic.slice(1),
              mainHeadline: "",
              mainSummary: "",
              mainImage: article.imageUrl,
              timestamp: article.publishedDate,
              sources: [],
              items: [],
            };
          }

          // Use first article's image and headline for the cluster
          if (!topicGroups[topic].mainHeadline) {
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
          });

          if (!topicGroups[topic].sources.find((s) => s.name === article.source)) {
            topicGroups[topic].sources.push({
              type: "rss",
              name: article.source,
              icon: "rss",
            });
          }
        });
      });

      // Add Gemini articles
      geminiArticles.forEach((article) => {
        const topic = detectTopic(article.title + " " + article.summary);
        if (!topicGroups[topic]) {
          topicGroups[topic] = {
            id: `cluster-${topic}`,
            topic: topic.charAt(0).toUpperCase() + topic.slice(1),
            mainHeadline: article.title,
            mainSummary: article.summary,
            mainImage: `https://picsum.photos/seed/${article.id}/800/450`,
            timestamp: article.publishedDate,
            sources: [],
            items: [],
          };
        }

        // Use Gemini article as main if no main exists
        if (!topicGroups[topic].mainHeadline) {
          topicGroups[topic].mainHeadline = article.title;
          topicGroups[topic].mainSummary = article.summary;
        }

        topicGroups[topic].items.push({
          type: "gemini",
          title: article.title,
          content: article.summary,
          source: article.source,
          url: article.url,
        });

        if (!topicGroups[topic].sources.find((s) => s.name === "AI Search")) {
          topicGroups[topic].sources.push({
            type: "gemini",
            name: "AI Search",
            icon: "gemini",
          });
        }
      });

      // Convert to array and sort by timestamp
      return Object.values(topicGroups)
        .filter((cluster) => cluster.items.length > 0)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
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

      // Fetch from Gemini API
      const geminiArticles = await fetchGeminiNews(curatorState.prompt);

      // Cluster all news
      const newClusters = clusterNews(
        curatorState.prompt,
        curatorState.selectedTwitter,
        curatorState.selectedRSS,
        geminiArticles
      );

      setClusters(newClusters);
      setLoading(false);
    };

    loadNews();
  }, [curatorState, fetchGeminiNews, clusterNews]);

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

  const handleSpeak = (id: string, text: string) => {
    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.onend = () => setSpeakingId(null);
    window.speechSynthesis.speak(utterance);
    setSpeakingId(id);
  };

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

      {/* Navbar */}
      <nav
        className={`sticky top-0 z-50 bg-[#faf9f7]/90 backdrop-blur-md border-b border-gray-200/50 flex items-center justify-between px-6 md:px-8 py-4 transition-all duration-700 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
        }`}
      >
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center">
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
            <span className="text-xl font-semibold text-gray-900 tracking-tight">
              curious.ai
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/curator">
            <button className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-indigo-600/30 transition-all">
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
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              New Curator
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
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
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
            ) : clusters.length === 0 ? (
              // Empty State
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg
                    className="w-10 h-10 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No news found
                </h3>
                <p className="text-gray-500 mb-6">
                  Try adjusting your search or selecting different sources
                </p>
                <Link href="/curator">
                  <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-indigo-600/30 transition-all">
                    Create New Curator
                  </button>
                </Link>
              </div>
            ) : (
              // News Clusters
              <div className="space-y-6">
                {clusters.map((cluster, index) => (
                  <article
                    key={cluster.id}
                    className="bg-white rounded-2xl border border-gray-200/80 shadow-lg shadow-gray-900/5 overflow-hidden hover:shadow-xl hover:shadow-gray-900/10 transition-all duration-300"
                    style={{
                      animationDelay: `${index * 100}ms`,
                    }}
                  >
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              {cluster.topic.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {cluster.topic} Digest
                            </p>
                            <p className="text-xs text-gray-400">
                              {getTimeAgo(cluster.timestamp)}
                            </p>
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
                      </div>

                      {/* Main Content */}
                      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 leading-tight">
                        {cluster.mainHeadline ||
                          cluster.items[0]?.title ||
                          `Latest ${cluster.topic} News`}
                      </h2>

                      <p
                        className={`text-gray-600 leading-relaxed mb-4 ${
                          expandedCards.has(cluster.id) ? "" : "line-clamp-4"
                        }`}
                      >
                        {cluster.mainSummary || cluster.items[0]?.content}
                      </p>

                      {(cluster.mainSummary || cluster.items[0]?.content)?.length > 300 && (
                        <button
                          onClick={() => toggleExpanded(cluster.id)}
                          className="text-indigo-600 font-medium text-sm hover:text-indigo-700 transition-colors mb-4"
                        >
                          {expandedCards.has(cluster.id) ? "Show less" : "Show more"}
                        </button>
                      )}

                      {/* Listen Button */}
                      <button
                        onClick={() =>
                          handleSpeak(
                            cluster.id,
                            `${cluster.mainHeadline}. ${cluster.mainSummary || cluster.items[0]?.content}`
                          )
                        }
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all mb-4 ${
                          speakingId === cluster.id
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {speakingId === cluster.id ? (
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

                      {/* Sources */}
                      <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                        <span className="text-xs text-gray-400 mr-2">Sources:</span>
                        <div className="flex items-center gap-2 flex-wrap">
                          {cluster.sources.map((source, i) => (
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
                                <svg
                                  className="w-3 h-3"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                >
                                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                              )}
                              {source.type === "rss" && (
                                <svg
                                  className="w-3 h-3"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                >
                                  <path d="M6.18 15.64a2.18 2.18 0 1 1 0 4.36 2.18 2.18 0 0 1 0-4.36zM4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44zm0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93v-2.83z" />
                                </svg>
                              )}
                              {source.type === "gemini" && (
                                <svg
                                  className="w-3 h-3"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                >
                                  <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                                </svg>
                              )}
                              {source.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
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
            <h2 className="text-2xl font-['Instrument_Serif',serif] text-gray-900 mb-2">
              For You
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Your personalized content from all curators
            </p>

            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center mb-8">
              <svg
                className="w-5 h-5 text-gray-500"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M6.18 15.64a2.18 2.18 0 1 1 0 4.36 2.18 2.18 0 0 1 0-4.36zM4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44zm0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93v-2.83z" />
              </svg>
            </div>

            {/* Quick Stats */}
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-xl border border-indigo-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">
                    Topics Found
                  </span>
                  <span className="text-2xl font-bold text-indigo-600">
                    {clusters.length}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  Based on "{curatorState.prompt}"
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm font-medium text-gray-600 mb-2">
                  Sources Active
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  {curatorState.selectedTwitter.length > 0 && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-sky-100 text-sky-700 rounded text-xs font-medium">
                      <svg
                        className="w-3 h-3"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                      {curatorState.selectedTwitter.length}
                    </span>
                  )}
                  {curatorState.selectedRSS.length > 0 && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium">
                      <svg
                        className="w-3 h-3"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M6.18 15.64a2.18 2.18 0 1 1 0 4.36 2.18 2.18 0 0 1 0-4.36zM4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44zm0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93v-2.83z" />
                      </svg>
                      {curatorState.selectedRSS.length}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-violet-100 text-violet-700 rounded text-xs font-medium">
                    <svg
                      className="w-3 h-3"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                    </svg>
                    AI
                  </span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default ResultsPage;
