import React, { useState, useEffect, Component, ErrorInfo, ReactNode } from 'react';
import { FileText, Scale, History as HistoryIcon, ShieldCheck, Sun, Moon, Globe, LogIn, User, LogOut, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DocumentExplainer } from './components/DocumentExplainer';
import { LawExplainer } from './components/LawExplainer';
import { History } from './components/History';
import { Auth } from './components/Auth';
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut, getRedirectResult, User as FirebaseUser } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { LocalizationProvider, useLocalization, LanguageCode } from './services/localization';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';

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
      return <ErrorScreen error={this.state.error} />;
    }

    return this.props.children;
  }
}

function ErrorScreen({ error }: { error: Error | null }) {
  const { t } = useLocalization();
  
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-red-50">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-red-100">
        <h2 className="text-2xl font-bold text-red-600 mb-4 serif">{t('app.error.title')}</h2>
        <p className="text-sm text-gray-600 mb-6">{error?.message || "Something went wrong."}</p>
        <button 
          onClick={() => window.location.reload()}
          className="w-full bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition-colors"
        >
          {t('app.error.reload')}
        </button>
      </div>
    </div>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState<'docs' | 'law' | 'history'>('law');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [isReadingMode, setIsReadingMode] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);
      if (currentUser) setShowAuth(false);
    });

    // Handle Google sign-in redirect result (mobile WebView)
    getRedirectResult(auth).then((result) => {
      if (result?.user) {
        setDoc(doc(db, 'users', result.user.uid), {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          role: 'user',
          createdAt: serverTimestamp()
        }, { merge: true });
      }
    }).catch(console.error);

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Update native status bar to match theme
    if (Capacitor.isNativePlatform()) {
      StatusBar.setStyle({ style: theme === 'dark' ? Style.Dark : Style.Light }).catch(() => {});
      StatusBar.setBackgroundColor({ color: theme === 'dark' ? '#0A0A0A' : '#F7F3E9' }).catch(() => {});
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

  return (
    <LocalizationProvider language={language}>
      <ErrorBoundary>
        {!isAuthReady ? (
          <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-charcoal-deep' : 'bg-beige-pale'}`}>
            <div className="flex flex-col items-center gap-4">
              <div className={`w-12 h-12 rounded-xl animate-spin flex items-center justify-center text-white ${theme === 'dark' ? 'bg-silver-glowing glow-silver' : 'bg-gold-brushed glow-gold'}`}>
                <Scale size={24} />
              </div>
              <LoadingText theme={theme} />
            </div>
          </div>
        ) : (
          <AppContent 
            activeTab={activeTab} 
            setActiveTab={setActiveTab}
            theme={theme}
            setTheme={setTheme}
            language={language}
            setLanguage={setLanguage}
            isReadingMode={isReadingMode}
            setIsReadingMode={setIsReadingMode}
            selectedHistory={selectedHistory}
            setSelectedHistory={setSelectedHistory}
            user={user}
            showAuth={showAuth}
            setShowAuth={setShowAuth}
            handleLogout={handleLogout}
          />
        )}
      </ErrorBoundary>
    </LocalizationProvider>
  );
}

function LoadingText({ theme }: { theme: string }) {
  const { t } = useLocalization();
  return (
    <p className={`text-sm font-bold animate-pulse ${theme === 'dark' ? 'text-silver-glowing' : 'text-gold-brushed'}`}>
      {t('app.initializing')}
    </p>
  );
}

function AppContent({ 
  activeTab, setActiveTab, theme, setTheme, language, setLanguage, isReadingMode, setIsReadingMode, selectedHistory, setSelectedHistory, user, showAuth, setShowAuth, handleLogout 
}: any) {
  const { t } = useLocalization();

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'ms', name: 'Bahasa Malaysia' },
    { code: 'id', name: 'Bahasa Indonesia' },
    { code: 'tl', name: 'Tagalog' },
    { code: 'kel', name: 'Dialek Kelantan' },
    { code: 'swk', name: 'Dialek Sarawak' },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-500 ${theme === 'dark' ? 'dark bg-charcoal-deep text-off-white' : 'bg-beige-pale text-cocoa-deep'} font-sans selection:bg-gold-brushed/20`}>
      <AnimatePresence>
        {showAuth && !user && (
          <Auth theme={theme} onSuccess={() => setShowAuth(false)} />
        )}
      </AnimatePresence>

      {/* Main Layout */}
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className={`hidden md:flex w-72 flex-col sticky top-0 h-screen transition-all duration-500 ${theme === 'dark' ? 'sidebar-dark' : 'sidebar-light'}`}>
          <div className={`p-6 border-b ${theme === 'dark' ? 'border-white/5' : 'border-cocoa-deep/5'}`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${theme === 'dark' ? 'bg-silver-glowing glow-silver' : 'bg-gold-brushed glow-gold'}`}>
                <Scale size={22} />
              </div>
              <h1 className={`text-xl font-bold serif ${theme === 'dark' ? 'text-off-white' : 'text-cocoa-deep'}`}>{t('law.title')}</h1>
            </div>
          </div>
          
          <nav className="flex-1 p-6 space-y-3">
            <SidebarButton 
              active={activeTab === 'docs'} 
              onClick={() => setActiveTab('docs')}
              icon={<FileText size={20} />}
              label={t('nav.docs')}
              theme={theme}
            />
            <SidebarButton 
              active={activeTab === 'law'} 
              onClick={() => setActiveTab('law')}
              icon={<Scale size={20} />}
              label={t('nav.lawchat')}
              theme={theme}
            />
            <SidebarButton 
              active={activeTab === 'history'} 
              onClick={() => setActiveTab('history')}
              icon={<HistoryIcon size={20} />}
              label={t('nav.history')}
              theme={theme}
            />
          </nav>

            <div className={`p-4 space-y-4 border-t ${theme === 'dark' ? 'border-white/5' : 'border-cocoa-deep/5'}`}>
              {/* Reading Mode Toggle */}
              <button 
                onClick={() => setIsReadingMode(!isReadingMode)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-bold text-xs ${
                  isReadingMode 
                    ? 'bg-gold-brushed text-white shadow-lg glow-gold scale-105' 
                    : (theme === 'dark' ? 'bg-white/5 text-off-white/60 hover:bg-white/10 hover:text-off-white' : 'bg-cocoa-deep/5 text-cocoa-deep/60 hover:bg-cocoa-deep/10 hover:text-cocoa-deep')
                }`}
              >
                <div className="flex items-center gap-3">
                  <BookOpen size={16} />
                  <div className="text-left">
                    <div>{t('nav.readingMode')}</div>
                    <div className={`text-[8px] opacity-60 font-medium ${isReadingMode ? 'text-white' : ''}`}>{t('nav.readingMode.desc')}</div>
                  </div>
                </div>
                <div className={`w-8 h-4 rounded-full relative transition-all ${isReadingMode ? 'bg-white/30' : 'bg-black/10'}`}>
                  <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${isReadingMode ? 'left-4.5' : 'left-0.5'}`} />
                </div>
              </button>

              {/* Language Selector */}
            <div className="space-y-2">
              <div className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest px-2 ${theme === 'dark' ? 'text-off-white/50' : 'text-cocoa-deep/50'}`}>
                <Globe size={12} />
                {t('nav.language')}
              </div>
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value as LanguageCode)}
                className={`w-full rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 transition-all ${
                  theme === 'dark' 
                    ? 'bg-white/5 border-white/10 text-off-white focus:ring-silver-glowing/20' 
                    : 'bg-cream-soft border-cocoa-deep/10 text-cocoa-deep focus:ring-gold-brushed/20'
                }`}
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code} className="text-black">{lang.name}</option>
                ))}
              </select>
            </div>

            {/* Theme Toggle - Pill Shaped */}
            <div className={`flex p-1 rounded-full transition-all ${theme === 'dark' ? 'bg-slate-rich border border-white/5' : 'bg-cream-soft border border-gold-brushed/20'}`}>
              <button 
                onClick={() => setTheme('light')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-full text-[10px] font-bold transition-all ${
                  theme === 'light' 
                    ? 'bg-gold-brushed text-white shadow-md glow-gold scale-105' 
                    : 'text-cocoa-deep/40 hover:text-cocoa-deep'
                }`}
              >
                <Sun size={12} />
                {theme === 'light' ? `${t('nav.theme.light')}: ON` : t('nav.theme.light')}
              </button>
              <button 
                onClick={() => setTheme('dark')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-full text-[10px] font-bold transition-all ${
                  theme === 'dark' 
                    ? 'bg-silver-glowing text-charcoal-deep shadow-md glow-silver scale-105' 
                    : 'text-off-white/40 hover:text-off-white'
                }`}
              >
                <Moon size={12} />
                {theme === 'dark' ? `${t('nav.theme.dark')}: ON` : t('nav.theme.dark')}
              </button>
            </div>

            {/* Login Selection */}
            {user ? (
              <div className="space-y-2">
                <div className={`flex items-center gap-3 px-4 py-2 rounded-xl font-bold text-xs ${theme === 'dark' ? 'bg-white/10 text-off-white' : 'bg-cocoa-deep/5 text-cocoa-deep'}`}>
                  <User size={16} />
                  <span className="truncate">{user.displayName || user.email}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all font-bold text-xs"
                >
                  <LogOut size={16} />
                  {t('nav.logout')}
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowAuth(true)}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl transition-all font-bold text-xs ${
                  theme === 'dark' 
                    ? 'bg-white/5 text-off-white hover:bg-white/10' 
                    : 'bg-cocoa-deep/5 text-cocoa-deep hover:bg-cocoa-deep/10'
                }`}
              >
                <LogIn size={16} />
                {t('nav.login')}
              </button>
            )}

            <div className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest px-3 py-2 rounded-xl ${theme === 'dark' ? 'bg-silver-glowing/10 text-silver-glowing' : 'bg-gold-brushed/10 text-gold-brushed'}`}>
              <ShieldCheck size={14} />
              {t('nav.grounded')}
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Mobile Header */}
          <header className={`md:hidden sticky top-0 z-50 transition-all duration-500 ${theme === 'dark' ? 'bg-charcoal-deep/80 border-white/5' : 'bg-beige-pale/80 border-cocoa-deep/5'} backdrop-blur-md border-b px-6 py-4 flex items-center justify-between`} style={{ paddingTop: `calc(0.75rem + var(--safe-area-top))` }}>
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white ${theme === 'dark' ? 'bg-silver-glowing glow-silver' : 'bg-gold-brushed glow-gold'}`}>
                <Scale size={18} />
              </div>
              <h1 className={`text-lg font-bold serif ${theme === 'dark' ? 'text-off-white' : 'text-cocoa-deep'}`}>{t('law.title')}</h1>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setActiveTab('docs')} className={activeTab === 'docs' ? (theme === 'dark' ? 'text-silver-glowing' : 'text-gold-brushed') : (theme === 'dark' ? 'text-off-white/40' : 'text-cocoa-deep/40')}><FileText size={20} /></button>
              <button onClick={() => setActiveTab('law')} className={activeTab === 'law' ? (theme === 'dark' ? 'text-silver-glowing' : 'text-gold-brushed') : (theme === 'dark' ? 'text-off-white/40' : 'text-cocoa-deep/40')}><Scale size={20} /></button>
              <button onClick={() => setActiveTab('history')} className={activeTab === 'history' ? (theme === 'dark' ? 'text-silver-glowing' : 'text-gold-brushed') : (theme === 'dark' ? 'text-off-white/40' : 'text-cocoa-deep/40')}><HistoryIcon size={20} /></button>
            </div>
          </header>

          <main className="flex-1 px-4 py-4 md:px-6 md:py-6 overflow-y-auto">
            {!user && activeTab === 'history' ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-silver-glowing/10 text-silver-glowing' : 'bg-gold-brushed/10 text-gold-brushed'}`}>
                  <ShieldCheck size={40} />
                </div>
                <div className="max-w-sm">
                  <h3 className={`text-xl font-bold serif mb-2 ${theme === 'dark' ? 'text-off-white' : 'text-cocoa-deep'}`}>{t('history.login_required')}</h3>
                  <p className={`text-sm opacity-60 ${theme === 'dark' ? 'text-off-white' : 'text-cocoa-deep'}`}>{t('history.login_desc')}</p>
                </div>
                <button 
                  onClick={() => setShowAuth(true)}
                  className={`px-8 py-3 rounded-2xl font-bold text-sm transition-all hover:scale-[1.02] ${
                    theme === 'dark' 
                      ? 'bg-silver-glowing text-charcoal-deep shadow-lg shadow-silver-glowing/20' 
                      : 'bg-gold-brushed text-white shadow-lg shadow-gold-brushed/20'
                  }`}
                >
                  {t('history.sign_in_btn')}
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
                  {activeTab === 'docs' && (
                    <DocumentExplainer 
                      language={language} 
                      theme={theme} 
                      isReadingMode={isReadingMode} 
                      initialHistory={selectedHistory?.type === 'doc' ? selectedHistory : null}
                    />
                  )}
                  {activeTab === 'law' && (
                    <LawExplainer 
                      language={language} 
                      theme={theme} 
                      isReadingMode={isReadingMode} 
                      initialHistory={selectedHistory?.type === 'law' ? selectedHistory : null}
                    />
                  )}
                  {activeTab === 'history' && (
                    <History 
                      theme={theme} 
                      onSelectItem={(item: any) => {
                        setSelectedHistory(item);
                        setActiveTab(item.type === 'doc' ? 'docs' : 'law');
                      }}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </main>

          <footer className={`px-6 py-4 text-center opacity-40 ${theme === 'dark' ? 'text-off-white' : 'text-cocoa-deep'}`} style={{ paddingBottom: `calc(1rem + var(--safe-area-bottom))` }}>
            <p className="text-[10px] font-medium">
              {t('footer.disclaimer')}
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}

function SidebarButton({ active, onClick, icon, label, theme }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string, theme: string }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-base transition-all ${
        active 
          ? (theme === 'dark' 
              ? 'bg-slate-rich text-silver-glowing shadow-lg border border-white/5 glow-silver' 
              : 'bg-cream-soft text-gold-brushed shadow-lg border border-gold-brushed/20 glow-gold') 
          : (theme === 'dark' 
              ? 'text-off-white/50 hover:bg-white/5 hover:text-off-white' 
              : 'text-cocoa-deep/50 hover:bg-cocoa-deep/5 hover:text-cocoa-deep')
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

export default App;
