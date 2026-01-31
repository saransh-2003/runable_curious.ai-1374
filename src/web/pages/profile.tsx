import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { LogoutModal } from "../components/ui/LogoutModal";

interface User {
  email: string;
  createdAt: string;
}

interface StoredCurator {
  id: string;
  name: string;
  prompt: string;
  selectedTwitter: string[];
  selectedRss: string[];
  createdAt: string;
}

interface DisplayCurator {
  id: string;
  name: string;
  createdAt: string;
  sources: string[];
  prompt?: string;
  isDemo?: boolean;
}

const demoCurators: DisplayCurator[] = [
  {
    id: "demo_1",
    name: "AI & Tech News",
    createdAt: "2026-01-15",
    sources: ["TechCrunch AI", "@TechGuru_AI"],
    prompt: "AI developments",
    isDemo: true,
  },
  {
    id: "demo_2",
    name: "Sports Updates",
    createdAt: "2026-01-20",
    sources: ["ESPN Sports", "@GlobalPulse"],
    prompt: "Cricket news",
    isDemo: true,
  },
  {
    id: "demo_3",
    name: "Global Politics",
    createdAt: "2026-01-22",
    sources: ["Reuters World", "@GlobalPulse"],
    prompt: "Global geopolitics",
    isDemo: true,
  },
];

function ProfilePage() {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [, setLocation] = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [userCurators, setUserCurators] = useState<DisplayCurator[]>([]);

  useEffect(() => {
    setMounted(true);
    const userData = localStorage.getItem("curious_user");
    if (!userData) {
      setLocation("/login");
      return;
    }
    setUser(JSON.parse(userData));

    // Load user-created curators from localStorage
    const storedCurators = localStorage.getItem("curious_curators");
    if (storedCurators) {
      const parsed: StoredCurator[] = JSON.parse(storedCurators);
      const displayCurators: DisplayCurator[] = parsed.map((c) => ({
        id: c.id,
        name: c.name,
        createdAt: c.createdAt,
        sources: [...c.selectedTwitter.map(t => t.startsWith('@') ? t : `@${t}`), ...c.selectedRss],
        prompt: c.prompt,
        isDemo: false,
      }));
      setUserCurators(displayCurators);
    }
  }, [setLocation]);

  const handleLogout = () => {
    localStorage.removeItem("curious_user");
    localStorage.removeItem("curator_state");
    setLocation("/");
  };

  const handleCuratorClick = (curator: DisplayCurator) => {
    // Set up curator state and navigate to results
    const curatorState = {
      prompt: curator.prompt || curator.name,
      selectedTwitter: curator.sources.filter(s => s.startsWith('@')),
      selectedRSS: curator.sources.filter(s => !s.startsWith('@')),
    };
    localStorage.setItem("curator_state", JSON.stringify(curatorState));
    const encodedPrompt = encodeURIComponent(curator.prompt || curator.name);
    setLocation(`/results?prompt=${encodedPrompt}`);
  };

  const getInitial = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getCuratorIcon = (name: string) => {
    if (name.toLowerCase().includes("tech") || name.toLowerCase().includes("ai")) {
      return (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z" />
        </svg>
      );
    }
    if (name.toLowerCase().includes("sports") || name.toLowerCase().includes("cricket")) {
      return (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
        </svg>
      );
    }
    if (name.toLowerCase().includes("politics") || name.toLowerCase().includes("global") || name.toLowerCase().includes("world")) {
      return (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
        </svg>
      );
    }
    if (name.toLowerCase().includes("health")) {
      return (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
      );
    }
    // Default icon
    return (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    );
  };

  // Combine user curators with demo curators
  const allCurators = [...userCurators, ...demoCurators];

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
          backgroundSize: '32px 32px',
        }}
      />
      
      {/* Decorative gradient blob */}
      <div 
        className="fixed top-[20%] right-[-15%] w-[600px] h-[600px] rounded-full pointer-events-none opacity-20 blur-3xl"
        style={{
          background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)',
        }}
      />

      {/* Navbar */}
      <nav 
        className={`relative z-50 flex items-center justify-between px-6 md:px-12 py-5 transition-all duration-700 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}
      >
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-indigo-600/30 transition-shadow">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
                curious
              </span>
              <span className="text-gray-900">.ai</span>
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/curator">
            <span className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-violet-600 rounded-full hover:shadow-lg hover:shadow-indigo-600/30 transition-all cursor-pointer">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              New Curator
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white font-semibold text-sm">
              {getInitial(user.email)}
            </div>
            <span className="hidden md:block text-sm font-medium text-gray-700 max-w-[150px] truncate">
              {user.email}
            </span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 px-6 md:px-12 py-8 md:py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div 
            className={`mb-10 transition-all duration-700 delay-100 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold text-3xl shadow-lg shadow-indigo-600/20">
                  {getInitial(user.email)}
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-['Instrument_Serif',serif] text-gray-900 mb-1">
                    Your Profile
                  </h1>
                  <p className="text-gray-600">{user.email}</p>
                </div>
              </div>
              <button
                onClick={() => setShowLogoutModal(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                </svg>
                Logout
              </button>
            </div>
          </div>

          {/* Curators Section */}
          <div 
            className={`transition-all duration-700 delay-200 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">My Curators</h2>
                <p className="text-sm text-gray-600 mt-1">Your personalized news feeds powered by AI</p>
              </div>
              <Link href="/curator">
                <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-600/30 transition-all w-full sm:w-auto justify-center">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Create New Curator
                </button>
              </Link>
            </div>

            {/* User's Custom Curators Section */}
            {userCurators.length > 0 && (
              <div className="mb-6">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">
                  Your Curators
                </p>
                <div className="space-y-4">
                  {userCurators.map((curator, index) => (
                    <button
                      key={curator.id}
                      onClick={() => handleCuratorClick(curator)}
                      className={`w-full text-left group p-6 bg-white/80 backdrop-blur rounded-2xl border border-gray-200/50 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-600/5 transition-all duration-300 ${
                        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                      }`}
                      style={{
                        transitionDelay: mounted ? `${300 + index * 100}ms` : '0ms',
                      }}
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white flex-shrink-0 group-hover:scale-105 transition-transform">
                            {getCuratorIcon(curator.name)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-semibold text-gray-900 mb-1">{curator.name}</h3>
                              <span className="px-2 py-0.5 bg-indigo-100 text-indigo-600 text-xs font-medium rounded-full">Custom</span>
                            </div>
                            <p className="text-sm text-gray-500">Created {formatDate(curator.createdAt)}</p>
                          </div>
                        </div>
                        <div className="md:text-right">
                          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Sources</p>
                          <div className="flex flex-wrap gap-2 md:justify-end">
                            {curator.sources.slice(0, 3).map((source) => (
                              <span
                                key={source}
                                className="inline-flex items-center px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg"
                              >
                                {source}
                              </span>
                            ))}
                            {curator.sources.length > 3 && (
                              <span className="inline-flex items-center px-2.5 py-1 bg-gray-100 text-gray-500 text-xs font-medium rounded-lg">
                                +{curator.sources.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      {/* Click to open indicator */}
                      <div className="flex items-center justify-end mt-4 pt-4 border-t border-gray-100">
                        <span className="text-xs text-indigo-600 font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          View feed
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                          </svg>
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Demo Curators */}
            <div>
              {userCurators.length > 0 && (
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">
                  Sample Curators
                </p>
              )}
              <div className="space-y-4">
                {demoCurators.map((curator, index) => (
                  <button
                    key={curator.id}
                    onClick={() => handleCuratorClick(curator)}
                    className={`w-full text-left group p-6 bg-white/80 backdrop-blur rounded-2xl border border-gray-200/50 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-600/5 transition-all duration-300 ${
                      mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                    style={{
                      transitionDelay: mounted ? `${300 + (userCurators.length + index) * 100}ms` : '0ms',
                    }}
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 flex items-center justify-center text-indigo-600 flex-shrink-0 group-hover:scale-105 transition-transform">
                          {getCuratorIcon(curator.name)}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">{curator.name}</h3>
                          <p className="text-sm text-gray-500">Created {formatDate(curator.createdAt)}</p>
                        </div>
                      </div>
                      <div className="md:text-right">
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Sources</p>
                        <div className="flex flex-wrap gap-2 md:justify-end">
                          {curator.sources.map((source) => (
                            <span
                              key={source}
                              className="inline-flex items-center px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg"
                            >
                              {source}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    {/* Click to open indicator */}
                    <div className="flex items-center justify-end mt-4 pt-4 border-t border-gray-100">
                      <span className="text-xs text-indigo-600 font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        View feed
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Empty State (hidden when there are curators) */}
            {allCurators.length === 0 && (
              <div className="text-center py-16 px-8 bg-white/50 backdrop-blur rounded-2xl border border-gray-200/50">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 flex items-center justify-center">
                  <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No curators yet</h3>
                <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                  Create your first curator to start receiving personalized news summaries.
                </p>
                <Link href="/curator">
                  <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-600/30 transition-all">
                    Create Your First Curator
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer 
        className={`relative z-10 px-6 md:px-12 py-8 border-t border-gray-200/50 mt-12 transition-all duration-700 delay-500 ${
          mounted ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
            </div>
            <span className="text-sm font-bold">
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">curious</span>
              <span className="text-gray-700">.ai</span>
            </span>
          </div>
          <p className="text-sm text-gray-500">© curious.ai 2026. All rights reserved.</p>
        </div>
      </footer>

      {/* Logout Confirmation Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
}

export default ProfilePage;
