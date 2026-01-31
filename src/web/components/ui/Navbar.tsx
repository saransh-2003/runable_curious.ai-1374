import { Link, useLocation } from "wouter";
import { useEffect, useState } from "react";

interface User {
  email: string;
  createdAt: string;
}

interface NavbarProps {
  showNewCurator?: boolean;
  transparent?: boolean;
}

export function Navbar({ showNewCurator = true, transparent = false }: NavbarProps) {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setMounted(true);
    const userData = localStorage.getItem("curious_user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const getInitial = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  return (
    <nav
      className={`relative z-50 flex items-center justify-between px-6 md:px-12 py-5 transition-all duration-700 ${
        mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
      } ${transparent ? "" : "bg-[#faf9f7]/90 backdrop-blur-md border-b border-gray-200/50"}`}
    >
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
          <span className="text-xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
              curious
            </span>
            <span className="text-gray-900">.ai</span>
          </span>
        </div>
      </Link>

      <div className="flex items-center gap-3">
        {user ? (
          <>
            {showNewCurator && (
              <Link href="/curator">
                <span className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-violet-600 rounded-full hover:shadow-lg hover:shadow-indigo-600/30 transition-all cursor-pointer">
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
                </span>
              </Link>
            )}
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
          </>
        ) : (
          <>
            <Link href="/login">
              <span className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors cursor-pointer">
                Login
              </span>
            </Link>
            <Link href="/signup">
              <span className="px-5 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-full hover:bg-gray-800 transition-all hover:shadow-lg hover:shadow-gray-900/20 cursor-pointer">
                Sign Up
              </span>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
