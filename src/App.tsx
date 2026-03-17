import React, { useState, useEffect, Component, ErrorInfo, ReactNode } from 'react';
import { FileText, Scale, History as HistoryIcon, ShieldCheck, Sun, Moon, Globe, LogIn, User, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DocumentExplainer } from './components/DocumentExplainer';
import { LawExplainer } from './components/LawExplainer';
import { History } from './components/History';
import { Auth } from './components/Auth';
import { auth } from './firebase';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';

// Error Boundary Component
interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      let errorMessage = "Something went wrong.";
      try {
        const parsedError = JSON.parse(this.state.error?.message || "");
        if (parsedError.error) {
          errorMessage = `Firestore Error: ${parsedError.error} at ${parsedError.path}`;
        }
      } catch (e) {
        errorMessage = this.state.error?.message || errorMessage;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-red-50">
          <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-red-100">
            <h2 className="text-2xl font-bold text-red-600 mb-4 serif">Application Error</h2>
            <p className="text-sm text-gray-600 mb-6">{errorMessage}</p>
            <button 
              onClick={() => window.location.reload()}
              className="w-full bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition-colors"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  const [activeTab, setActiveTab] = useState<'docs' | 'law' | 'history'>('law');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [language, setLanguage] = useState('en');
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);
      if (currentUser) setShowAuth(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'ms', name: 'Bahasa Malaysia' },
    { code: 'id', name: 'Bahasa Indonesia' },
    { code: 'tl', name: 'Tagalog' },
    { code: 'kel', name: 'Dialek Kelantan' },
    { code: 'swk', name: 'Dialek Sarawak' },
  ];

  if (!isAuthReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f0]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-[#5A5A40] rounded-xl animate-spin flex items-center justify-center text-white">
            <Scale size={24} />
          </div>
          <p className="text-sm font-bold text-[#5A5A40] animate-pulse">Initializing LawChat...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'dark bg-[#1a1a1a] text-[#f5f5f0]' : 'bg-[#f5f5f0] text-[#1a1a1a]'} font-sans selection:bg-brand-olive/20`}>
        <AnimatePresence>
          {showAuth && !user && (
            <Auth onSuccess={() => setShowAuth(false)} />
          )}
        </AnimatePresence>

        {/* Main Layout */}
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <aside className="hidden md:flex w-64 flex-col bg-[#242424] border-r border-white/5 sticky top-0 h-screen transition-colors duration-300">
            <div className="p-6 border-b border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#5A5A40] rounded-lg flex items-center justify-center text-white">
                  <Scale size={18} />
                </div>
                <h1 className="text-lg font-bold serif text-white">LawChat</h1>
              </div>
            </div>
            
            <nav className="flex-1 p-4 space-y-2">
              <SidebarButton 
                active={activeTab === 'docs'} 
                onClick={() => setActiveTab('docs')}
                icon={<FileText size={20} />}
                label="Document Explainer"
              />
              <SidebarButton 
                active={activeTab === 'law'} 
                onClick={() => setActiveTab('law')}
                icon={<Scale size={20} />}
                label="LawChat"
              />
              <SidebarButton 
                active={activeTab === 'history'} 
                onClick={() => setActiveTab('history')}
                icon={<HistoryIcon size={20} />}
                label="History"
              />
            </nav>

            <div className="p-4 space-y-4 border-t border-white/5">
              {/* Language Selector */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/50 px-2">
                  <Globe size={12} />
                  Language
                </div>
                <select 
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                >
                  {languages.map(lang => (
                    <option key={lang.code} value={lang.code} className="text-black">{lang.name}</option>
                  ))}
                </select>
              </div>

              {/* Theme Toggle */}
              <button 
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className="w-full flex items-center justify-between px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all"
              >
                <span className="text-xs font-bold">Theme</span>
                {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
              </button>

              {/* Login Selection */}
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/10 text-white font-bold text-xs">
                    <User size={16} />
                    <span className="truncate">{user.displayName || user.email}</span>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all font-bold text-xs"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setShowAuth(true)}
                  className="w-full flex items-center gap-3 px-4 py-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all font-bold text-xs"
                >
                  <LogIn size={16} />
                  Login / Sign Up
                </button>
              )}

              <div className="flex items-center gap-2 text-xs font-bold text-white bg-white/10 px-3 py-2 rounded-xl">
                <ShieldCheck size={14} />
                RAG Grounded
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col">
            {/* Mobile Header */}
            <header className={`md:hidden sticky top-0 z-50 transition-colors duration-300 ${theme === 'dark' ? 'bg-[#1a1a1a]/80' : 'bg-[#f5f5f0]/80'} backdrop-blur-md border-b border-black/5 px-6 py-4 flex items-center justify-between`}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#5A5A40] rounded-lg flex items-center justify-center text-white">
                  <Scale size={18} />
                </div>
                <h1 className="text-lg font-bold serif">LawChat</h1>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setActiveTab('docs')} className={activeTab === 'docs' ? 'text-[#5A5A40]' : 'text-[#a67c52]'}><FileText size={20} /></button>
                <button onClick={() => setActiveTab('law')} className={activeTab === 'law' ? 'text-[#5A5A40]' : 'text-[#a67c52]'}><Scale size={20} /></button>
                <button onClick={() => setActiveTab('history')} className={activeTab === 'history' ? 'text-[#5A5A40]' : 'text-[#a67c52]'}><HistoryIcon size={20} /></button>
              </div>
            </header>

            <main className="flex-1 px-6 py-8 overflow-y-auto">
              {!user && activeTab === 'history' ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                  <div className="w-20 h-20 bg-brand-olive/10 rounded-full flex items-center justify-center text-brand-olive">
                    <ShieldCheck size={40} />
                  </div>
                  <div className="max-w-sm">
                    <h3 className="text-xl font-bold serif mb-2">Login Required</h3>
                    <p className="text-sm opacity-60">Please sign in to view your interaction history and saved documents.</p>
                  </div>
                  <button 
                    onClick={() => setShowAuth(true)}
                    className="bg-[#5A5A40] text-white px-8 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-[#5A5A40]/20 hover:scale-[1.02] transition-all"
                  >
                    Sign In Now
                  </button>
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {activeTab === 'docs' && <DocumentExplainer language={language} theme={theme} />}
                    {activeTab === 'law' && <LawExplainer language={language} theme={theme} />}
                    {activeTab === 'history' && <History theme={theme} />}
                  </motion.div>
                </AnimatePresence>
              )}
            </main>

            <footer className="px-6 py-4 text-center opacity-40">
              <p className="text-[10px] font-medium">
                LawChat provides general information based on official statutes. 
                Not legal advice.
              </p>
            </footer>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

function SidebarButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${active ? 'bg-[#5A5A40] text-white shadow-lg shadow-[#5A5A40]/20' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
    >
      {icon}
      {label}
    </button>
  );
}

export default App;
