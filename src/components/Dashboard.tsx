import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  ShieldCheck, 
  History, 
  Settings, 
  Moon, 
  Sun, 
  LogOut,
  Bell,
  Search,
  ChevronDown,
  Menu,
  X,
  User,
  Globe,
  CreditCard,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../context/ThemeContext';
import { ProcessInvoice } from './ProcessInvoice';
import { GuardianAI } from './GuardianAI';

type Module = 'dashboard' | 'process' | 'guardian' | 'history' | 'settings';
type Language = 'BM' | 'EN' | 'CN' | 'TA';

export const Dashboard: React.FC = () => {
  const [activeModule, setActiveModule] = useState<Module>('process');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [language, setLanguage] = useState<Language>('EN');
  const { theme, toggleTheme } = useTheme();

  const languages: { code: Language; label: string }[] = [
    { code: 'EN', label: 'English' },
    { code: 'BM', label: 'Bahasa Melayu' },
    { code: 'CN', label: 'Mandarin' },
    { code: 'TA', label: 'Tamil' },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-light-bg dark:bg-dark-bg">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 w-64 bg-white dark:bg-dark-surface border-r border-slate-200 dark:border-dark-border z-50 transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-brand-indigo to-brand-purple rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-indigo/20">
            <span className="font-black text-xl italic">B</span>
          </div>
          <span className="font-black text-2xl tracking-tighter dark:text-white">Bilboleh</span>
        </div>

        <nav className="mt-6 px-4 space-y-1 flex-1">
          <SidebarItem 
            icon={<LayoutDashboard size={20} />} 
            label="Overview" 
            active={activeModule === 'dashboard'} 
            onClick={() => setActiveModule('dashboard')}
          />
          <SidebarItem 
            icon={<FileText size={20} />} 
            label="Process Invoice" 
            active={activeModule === 'process'} 
            onClick={() => setActiveModule('process')}
          />
          <SidebarItem 
            icon={<ShieldCheck size={20} />} 
            label="Guardian AI" 
            active={activeModule === 'guardian'} 
            onClick={() => setActiveModule('guardian')}
          />
          <SidebarItem 
            icon={<History size={20} />} 
            label="History" 
            active={activeModule === 'history'} 
            onClick={() => setActiveModule('history')}
          />
          <SidebarItem 
            icon={<Settings size={20} />} 
            label="Settings" 
            active={activeModule === 'settings'} 
            onClick={() => setActiveModule('settings')}
          />
        </nav>

        <div className="p-4 border-t border-slate-100 dark:border-dark-border space-y-2">
          {/* Language Toggle */}
          <div className="relative">
            <button 
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-dark-surface transition-all"
            >
              <div className="flex items-center gap-3">
                <Globe size={18} />
                <span>{languages.find(l => l.code === language)?.label}</span>
              </div>
              <ChevronDown size={14} className={`transition-transform ${langMenuOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {langMenuOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-full left-0 w-full mb-2 bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border rounded-xl shadow-xl overflow-hidden z-50"
                >
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setLangMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${language === lang.code ? 'text-brand-indigo font-bold bg-brand-indigo/5' : 'text-slate-600 dark:text-slate-400'}`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button 
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-dark-surface transition-all"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </button>
        </div>

        {/* Combined User Profile & Sign Out */}
        <div className="p-4 border-t border-slate-100 dark:border-dark-border">
          <div className="relative">
            <button 
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-dark-surface transition-all group"
            >
              <div className="w-9 h-9 rounded-full bg-brand-indigo text-white flex items-center justify-center font-bold shadow-md">
                JD
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">Jane Doe</p>
                <p className="text-xs text-slate-500 truncate">jane@example.com</p>
              </div>
              <ChevronDown size={14} className={`text-slate-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {userMenuOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-full left-0 w-full mb-2 bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border rounded-xl shadow-2xl overflow-hidden z-50"
                >
                  <div className="p-2 space-y-1">
                    <UserMenuItem icon={<User size={16} />} label="My Profile" />
                    <UserMenuItem icon={<CreditCard size={16} />} label="Billing" />
                    <UserMenuItem icon={<HelpCircle size={16} />} label="Support" />
                    <div className="h-px bg-slate-100 dark:bg-dark-border my-1"></div>
                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-brand-rose hover:bg-brand-rose/5 transition-all">
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white/80 dark:bg-dark-surface/80 backdrop-blur border-b border-slate-200 dark:border-dark-border flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-slate-100 dark:hover:bg-dark-surface rounded-lg text-slate-600 dark:text-slate-400"
            >
              <Menu size={20} />
            </button>
            <div className="hidden md:flex items-center gap-2 text-sm font-medium text-slate-500">
              <span className="text-slate-400">Bilboleh</span>
              <span className="text-slate-300 dark:text-slate-700">/</span>
              <span className="text-slate-900 dark:text-white capitalize font-bold">{activeModule.replace('-', ' ')}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search invoices, TIN..." 
                className="pl-9 pr-4 py-1.5 bg-slate-100 dark:bg-dark-bg border-transparent rounded-full text-sm outline-none focus:ring-2 focus:ring-brand-indigo/50 w-48 lg:w-64 transition-all"
              />
            </div>
            <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-dark-border rounded-full relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-brand-rose rounded-full border-2 border-white dark:border-dark-surface"></span>
            </button>
          </div>
        </header>

        {/* Viewport */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeModule}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeModule === 'process' && <ProcessInvoice />}
              {activeModule === 'guardian' && <GuardianAI />}
              {activeModule === 'dashboard' && (
                <div className="flex flex-col items-center justify-center py-24 text-center space-y-4">
                  <div className="w-16 h-16 bg-brand-indigo/10 rounded-full flex items-center justify-center text-brand-indigo">
                    <LayoutDashboard size={32} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Overview Module</h2>
                    <p className="text-slate-500">Global analytics and revenue summaries coming soon.</p>
                  </div>
                </div>
              )}
              {activeModule === 'history' && (
                <div className="bg-white dark:bg-dark-surface rounded-2xl border border-slate-200 dark:border-dark-border overflow-hidden">
                  <div className="p-6 border-b border-slate-200 dark:border-dark-border flex items-center justify-between">
                    <h2 className="font-bold">Invoice History</h2>
                    <button className="text-xs font-bold text-brand-indigo hover:underline">Export CSV</button>
                  </div>
                  <div className="p-12 text-center text-slate-500">
                    <History className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>No history found for the current period.</p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

function SidebarItem({ icon, label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all
        ${active 
          ? 'bg-brand-indigo text-white shadow-lg shadow-brand-indigo/20' 
          : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-dark-bg dark:text-slate-400 dark:hover:text-white'}
      `}
    >
      {icon}
      {label}
    </button>
  );
}

function UserMenuItem({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-dark-bg transition-all">
      {icon}
      {label}
    </button>
  );
}
