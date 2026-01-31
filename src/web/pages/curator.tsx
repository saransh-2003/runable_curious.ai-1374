import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";

interface User {
  email: string;
  createdAt: string;
}

interface TwitterAccount {
  id: string;
  handle: string;
  avatar: string;
  bio: string;
  selected: boolean;
}

interface RSSSource {
  id: string;
  name: string;
  url: string;
  selected: boolean;
}

const twitterAccounts: TwitterAccount[] = [
  {
    id: "1",
    handle: "@TechGuru_AI",
    avatar: "T",
    bio: "AI researcher and tech enthusiast",
    selected: false,
  },
  {
    id: "2",
    handle: "@AINewsDaily",
    avatar: "A",
    bio: "Your daily dose of AI updates",
    selected: false,
  },
  {
    id: "3",
    handle: "@GlobalPulse",
    avatar: "G",
    bio: "World news and analysis",
    selected: false,
  },
];

const rssSources: RSSSource[] = [
  {
    id: "1",
    name: "TechCrunch AI",
    url: "https://techcrunch.com/ai/feed",
    selected: false,
  },
  {
    id: "2",
    name: "ESPN Sports",
    url: "https://espn.com/rss/news",
    selected: false,
  },
  {
    id: "3",
    name: "Reuters World",
    url: "https://reuters.com/world/feed",
    selected: false,
  },
];

const suggestionChips = [
  "AI startup funding news",
  "Cricket highlights",
  "Geopolitics analysis",
  "Health & wellness",
];

function CuratorPage() {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [, setLocation] = useLocation();
  const [prompt, setPrompt] = useState("");
  const [showTwitterModal, setShowTwitterModal] = useState(false);
  const [showRSSModal, setShowRSSModal] = useState(false);
  const [selectedTwitter, setSelectedTwitter] = useState<TwitterAccount[]>(twitterAccounts);
  const [selectedRSS, setSelectedRSS] = useState<RSSSource[]>(rssSources);

  useEffect(() => {
    setMounted(true);
    const userData = localStorage.getItem("curious_user");
    if (!userData) {
      setLocation("/login");
      return;
    }
    setUser(JSON.parse(userData));
  }, [setLocation]);

  const getInitial = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  const toggleTwitterAccount = (id: string) => {
    setSelectedTwitter((prev) =>
      prev.map((acc) =>
        acc.id === id ? { ...acc, selected: !acc.selected } : acc
      )
    );
  };

  const toggleRSSSource = (id: string) => {
    setSelectedRSS((prev) =>
      prev.map((source) =>
        source.id === id ? { ...source, selected: !source.selected } : source
      )
    );
  };

  const removeTwitterSource = (id: string) => {
    setSelectedTwitter((prev) =>
      prev.map((acc) => (acc.id === id ? { ...acc, selected: false } : acc))
    );
  };

  const removeRSSSource = (id: string) => {
    setSelectedRSS((prev) =>
      prev.map((source) =>
        source.id === id ? { ...source, selected: false } : source
      )
    );
  };

  const selectedTwitterSources = selectedTwitter.filter((acc) => acc.selected);
  const selectedRSSSources = selectedRSS.filter((source) => source.selected);
  const hasSelectedSources = selectedTwitterSources.length > 0 || selectedRSSSources.length > 0;
  const canGenerate = prompt.trim().length > 0;

  const handleChipClick = (chip: string) => {
    setPrompt(chip);
  };

  const handleGenerate = () => {
    // Store state in localStorage for results page
    const curatorState = {
      prompt,
      selectedTwitter: selectedTwitterSources.map((acc) => acc.handle),
      selectedRSS: selectedRSSSources.map((source) => source.name),
    };
    localStorage.setItem("curator_state", JSON.stringify(curatorState));
    setLocation("/results");
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#faf9f7] font-['Sora',sans-serif] overflow-hidden">
      {/* Subtle background pattern */}
      <div
        className="fixed inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #d4d1cc 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Decorative gradient blob */}
      <div
        className="fixed top-[10%] left-[-15%] w-[500px] h-[500px] rounded-full pointer-events-none opacity-20 blur-3xl"
        style={{
          background:
            "linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)",
        }}
      />

      {/* Navbar */}
      <nav
        className={`relative z-50 flex items-center justify-between px-6 md:px-12 py-5 transition-all duration-700 ${
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
          <Link href="/profile">
            <div className="flex items-center gap-3 cursor-pointer group">
              <span className="hidden md:block text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors max-w-[150px] truncate">
                {user.email}
              </span>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white font-semibold text-sm ring-2 ring-white shadow-md group-hover:shadow-lg group-hover:shadow-indigo-600/20 transition-all">
                {getInitial(user.email)}
              </div>
            </div>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 px-6 md:px-12 py-8 md:py-16">
        <div className="max-w-3xl mx-auto">
          {/* Main Title */}
          <h1
            className={`text-3xl md:text-5xl font-['Instrument_Serif',serif] text-gray-900 text-center mb-10 md:mb-14 transition-all duration-700 delay-100 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            What do you want to follow?
          </h1>

          {/* Prompt Input */}
          <div
            className={`mb-6 transition-all duration-700 delay-200 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Tell me a topic, trend, or interest..."
                rows={3}
                className="w-full px-6 py-5 pr-16 bg-white border border-gray-200/80 rounded-2xl text-gray-900 placeholder-gray-400 text-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 shadow-lg shadow-gray-900/5 transition-all"
              />
              <button
                onClick={handleGenerate}
                disabled={!canGenerate}
                className={`absolute right-4 bottom-4 w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
                  canGenerate
                    ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/30 hover:shadow-xl hover:shadow-indigo-600/40 hover:scale-105"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
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
                    d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Suggestion Chips */}
          <div
            className={`flex flex-wrap justify-center gap-3 mb-12 transition-all duration-700 delay-300 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            {suggestionChips.map((chip, index) => (
              <button
                key={chip}
                onClick={() => handleChipClick(chip)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/80 backdrop-blur border border-gray-200/80 rounded-full text-sm font-medium text-gray-700 hover:border-indigo-300 hover:bg-indigo-50/50 hover:text-indigo-700 transition-all shadow-sm hover:shadow-md"
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                {chip}
              </button>
            ))}
          </div>

          {/* Source Selection */}
          <div
            className={`transition-all duration-700 delay-400 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <p className="text-center text-gray-500 text-sm mb-6">
              or add a source directly
            </p>

            <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
              {/* Twitter Card */}
              <button
                onClick={() => setShowTwitterModal(true)}
                className="group p-6 bg-white/80 backdrop-blur rounded-2xl border border-gray-200/80 hover:border-sky-300 hover:shadow-xl hover:shadow-sky-500/10 transition-all"
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg
                      className="w-6 h-6 text-sky-500"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </div>
                  <span className="font-medium text-gray-800">X / Twitter</span>
                </div>
              </button>

              {/* RSS Card */}
              <button
                onClick={() => setShowRSSModal(true)}
                className="group p-6 bg-white/80 backdrop-blur rounded-2xl border border-gray-200/80 hover:border-orange-300 hover:shadow-xl hover:shadow-orange-500/10 transition-all"
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg
                      className="w-6 h-6 text-orange-500"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M6.18 15.64a2.18 2.18 0 1 1 0 4.36 2.18 2.18 0 0 1 0-4.36zM4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44zm0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93v-2.83z" />
                    </svg>
                  </div>
                  <span className="font-medium text-gray-800">RSS Feed</span>
                </div>
              </button>
            </div>

            {/* Selected Sources Pills */}
            {hasSelectedSources && (
              <div className="mt-8 flex flex-wrap justify-center gap-2">
                {selectedTwitterSources.map((acc) => (
                  <span
                    key={acc.id}
                    className="inline-flex items-center gap-2 pl-3 pr-2 py-1.5 bg-sky-50 text-sky-700 rounded-full text-sm font-medium border border-sky-200"
                  >
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    {acc.handle}
                    <button
                      onClick={() => removeTwitterSource(acc.id)}
                      className="w-5 h-5 rounded-full bg-sky-200 hover:bg-sky-300 flex items-center justify-center transition-colors"
                    >
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </span>
                ))}
                {selectedRSSSources.map((source) => (
                  <span
                    key={source.id}
                    className="inline-flex items-center gap-2 pl-3 pr-2 py-1.5 bg-orange-50 text-orange-700 rounded-full text-sm font-medium border border-orange-200"
                  >
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M6.18 15.64a2.18 2.18 0 1 1 0 4.36 2.18 2.18 0 0 1 0-4.36zM4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44zm0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93v-2.83z" />
                    </svg>
                    {source.name}
                    <button
                      onClick={() => removeRSSSource(source.id)}
                      className="w-5 h-5 rounded-full bg-orange-200 hover:bg-orange-300 flex items-center justify-center transition-colors"
                    >
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Generate Button */}
          <div
            className={`mt-12 flex justify-center transition-all duration-700 delay-500 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <button
              onClick={handleGenerate}
              disabled={!canGenerate}
              className={`inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-lg font-semibold transition-all ${
                canGenerate
                  ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-xl shadow-indigo-600/30 hover:shadow-2xl hover:shadow-indigo-600/40 hover:-translate-y-0.5"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
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
                  d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                />
              </svg>
              Generate News Feed
            </button>
          </div>
        </div>
      </main>

      {/* Twitter Modal */}
      {showTwitterModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowTwitterModal(false)}
          />
          <div
            className={`relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 md:p-8 transform transition-all ${
              showTwitterModal
                ? "opacity-100 scale-100"
                : "opacity-0 scale-95"
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-sky-500"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Select X Accounts
                </h3>
              </div>
              <button
                onClick={() => setShowTwitterModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <svg
                  className="w-4 h-4 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-3">
              {selectedTwitter.map((account) => (
                <button
                  key={account.id}
                  onClick={() => toggleTwitterAccount(account.id)}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                    account.selected
                      ? "border-sky-400 bg-sky-50"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
                        account.selected
                          ? "bg-sky-500 text-white"
                          : "bg-gradient-to-br from-gray-300 to-gray-400 text-white"
                      }`}
                    >
                      {account.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900">
                        {account.handle}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {account.bio}
                      </p>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        account.selected
                          ? "bg-sky-500 border-sky-500"
                          : "border-gray-300"
                      }`}
                    >
                      {account.selected && (
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowTwitterModal(false)}
              className="w-full mt-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-600/30 transition-all"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* RSS Modal */}
      {showRSSModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowRSSModal(false)}
          />
          <div
            className={`relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 md:p-8 transform transition-all ${
              showRSSModal ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-orange-500"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M6.18 15.64a2.18 2.18 0 1 1 0 4.36 2.18 2.18 0 0 1 0-4.36zM4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44zm0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93v-2.83z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Select RSS Feeds
                </h3>
              </div>
              <button
                onClick={() => setShowRSSModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <svg
                  className="w-4 h-4 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-3">
              {selectedRSS.map((source) => (
                <button
                  key={source.id}
                  onClick={() => toggleRSSSource(source.id)}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                    source.selected
                      ? "border-orange-400 bg-orange-50"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        source.selected ? "bg-orange-500" : "bg-orange-100"
                      }`}
                    >
                      <svg
                        className={`w-6 h-6 ${
                          source.selected ? "text-white" : "text-orange-500"
                        }`}
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M6.18 15.64a2.18 2.18 0 1 1 0 4.36 2.18 2.18 0 0 1 0-4.36zM4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44zm0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93v-2.83z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900">{source.name}</p>
                      <p className="text-sm text-gray-500 truncate">
                        {source.url}
                      </p>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        source.selected
                          ? "bg-orange-500 border-orange-500"
                          : "border-gray-300"
                      }`}
                    >
                      {source.selected && (
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowRSSModal(false)}
              className="w-full mt-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-600/30 transition-all"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer
        className={`relative z-10 px-6 md:px-12 py-8 border-t border-gray-200/50 mt-12 transition-all duration-700 delay-600 ${
          mounted ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
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
            <span className="text-sm font-medium text-gray-700">curious.ai</span>
          </div>
          <p className="text-sm text-gray-500">
            © curious.ai 2026. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default CuratorPage;
