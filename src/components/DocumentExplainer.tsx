import React, { useState, useRef } from 'react';
import { MessageSquare, Scale, FileSearch, ShieldAlert, Send, Mic, Camera, ChevronRight, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { askLaw, analyzeContract } from '../services/gemini';
import { auth, db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useLocalization } from '../services/localization';

export const DocumentExplainer: React.FC<{ language: string, theme: string }> = ({ language, theme }) => {
  const { t } = useLocalization();

  const CATEGORIES = React.useMemo(() => [
    { id: 'tenancy', name: t('cat.tenancy'), icon: '🏠', desc: t('cat.tenancy.desc') },
    { id: 'employment', name: t('cat.employment'), icon: '💼', desc: t('cat.employment.desc') },
    { id: 'consumer', name: t('cat.consumer'), icon: '🛒', desc: t('cat.consumer.desc') },
    { id: 'family', name: t('cat.family'), icon: '👨‍👩‍👧', desc: t('cat.family.desc') },
    { id: 'accidents', name: t('cat.accidents'), icon: '🚗', desc: t('cat.accidents.desc') },
    { id: 'welfare', name: t('cat.welfare'), icon: '🤝', desc: t('cat.welfare.desc') },
  ], [t]);

  const [mode, setMode] = useState<'chat' | 'contract'>('chat');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [contractResult, setContractResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChat = async (e?: React.FormEvent, customQuery?: string) => {
    e?.preventDefault();
    const messageToSend = customQuery || query;
    if (!messageToSend.trim()) return;

    setQuery('');
    setChatHistory(prev => [...prev, { role: 'user', text: messageToSend }]);
    setLoading(true);
    setMode('chat');

    try {
      const response = await askLaw(messageToSend, language);
      setChatHistory(prev => [...prev, { role: 'ai', text: response || '' }]);
      
      // Save to Firestore if logged in
      if (auth.currentUser) {
        await addDoc(collection(db, 'history'), {
          userId: auth.currentUser.uid,
          type: 'law',
          query: messageToSend,
          response: response || '',
          timestamp: serverTimestamp(),
          language
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (cat: typeof CATEGORIES[0]) => {
    setActiveCategory(cat.id);
    handleChat(undefined, `Tell me about ${cat.name} rights in Malaysia.`);
  };

  const clearChat = () => {
    setChatHistory([]);
    setActiveCategory(null);
    setMode('chat');
  };

  const handleContractUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        setLoading(true);
        try {
          const dataUrl = reader.result as string;
          const extractedMimeType = dataUrl.split(':')[1].split(';')[0];
          const base64Data = dataUrl.split(',')[1];
          const data = await analyzeContract(base64Data, extractedMimeType, language);
          setContractResult(data);
          setMode('contract');
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={`max-w-6xl mx-auto space-y-6 pb-10 p-4 md:p-6 rounded-4xl transition-all duration-500 ${theme === 'dark' ? 'bg-slate-rich border border-white/5' : 'bg-cream-soft border border-gold-brushed/10 shadow-xl'}`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className={`text-2xl font-bold serif ${theme === 'dark' ? 'text-off-white' : 'text-cocoa-deep'}`}>{t('law.title')}</h2>
          <p className={`text-sm ${theme === 'dark' ? 'text-off-white/60' : 'text-cocoa-deep/60'} font-medium`}>{t('law.subtitle')}</p>
        </div>
        <div className="flex items-center gap-3">
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Categories Sidebar (Beside Chat) */}
        <div className="lg:col-span-1 space-y-4">
          <div className="space-y-2">
            <h3 className={`text-[10px] font-bold uppercase tracking-widest px-2 ${theme === 'dark' ? 'text-off-white/40' : 'text-cocoa-deep/40'}`}>{t('law.quick_topics')}</h3>
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
              {CATEGORIES.map((cat) => (
                <button 
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat)}
                  className={`flex items-center gap-2 p-3 rounded-xl border transition-all text-left group ${
                    activeCategory === cat.id 
                      ? (theme === 'dark' ? 'bg-silver-glowing text-charcoal-deep border-silver-glowing glow-silver' : 'bg-gold-brushed text-white border-gold-brushed glow-gold') 
                      : (theme === 'dark' ? 'bg-charcoal-deep border-white/5 text-off-white hover:border-silver-glowing/30 hover:bg-white/5' : 'bg-cream-soft border-gold-brushed/10 text-cocoa-deep hover:border-gold-brushed/30 hover:bg-beige-pale')
                  }`}
                >
                  <span className={`text-lg transition-transform ${activeCategory === cat.id ? '' : 'group-hover:scale-110'}`}>{cat.icon}</span>
                  <div>
                    <p className="text-xs font-bold">{cat.name}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className={`text-[10px] font-bold uppercase tracking-widest px-2 ${theme === 'dark' ? 'text-off-white/40' : 'text-cocoa-deep/40'}`}>{t('law.tools')}</h3>
            <div className="grid grid-cols-1 gap-2">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className={`flex items-center gap-2 p-3 rounded-xl border transition-all text-left group ${
                  mode === 'contract' 
                    ? (theme === 'dark' ? 'bg-silver-glowing text-charcoal-deep border-silver-glowing' : 'bg-gold-brushed text-white border-gold-brushed') 
                    : (theme === 'dark' ? 'bg-white/5 border-white/10 text-off-white hover:bg-white/10' : 'bg-gold-brushed/5 border-gold-brushed/10 text-gold-brushed hover:bg-gold-brushed/10')
                }`}
              >
                <Camera size={18} />
                <p className="text-xs font-bold">{t('law.snap_contract')}</p>
              </button>
              <button 
                onClick={clearChat}
                className={`flex items-center gap-2 p-3 rounded-xl border transition-all text-left ${
                  theme === 'dark' 
                    ? 'bg-white/5 border-white/10 text-off-white hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-500' 
                    : 'bg-white border border-cocoa-deep/5 text-cocoa-deep hover:bg-red-50 hover:border-red-200 hover:text-red-600'
                }`}
              >
                <MessageSquare size={18} />
                <p className="text-xs font-bold">{t('law.new_chat')}</p>
              </button>
            </div>
          </div>
          <input type="file" ref={fileInputRef} onChange={handleContractUpload} className="hidden" accept="image/*" />
        </div>

        {/* Main Interaction Area */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {mode === 'chat' && (
              <motion.div 
                key="chat"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className={`card min-h-137.5 flex flex-col shadow-2xl overflow-hidden ${theme === 'dark' ? 'bg-charcoal-deep border-white/5' : 'bg-cream-soft border-gold-brushed/10'}`}>
                  <div className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto max-h-150">
                    {chatHistory.length === 0 && (
                      <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-40">
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-silver-glowing/10 text-silver-glowing' : 'bg-gold-brushed/10 text-gold-brushed'}`}>
                          <MessageSquare size={40} />
                        </div>
                        <div className="space-y-2 max-w-sm">
                          <p className="font-bold text-xl serif">{t('law.welcome.title')}</p>
                          <p className="text-sm font-medium">{t('law.welcome.desc')}<br/>{t('law.welcome.example')}</p>
                        </div>
                      </div>
                    )}
                    {chatHistory.map((msg, i) => (
                      <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-5 rounded-3xl shadow-sm ${
                          msg.role === 'user' 
                            ? (theme === 'dark' ? 'bg-silver-glowing text-charcoal-deep rounded-tr-none glow-silver' : 'bg-gold-brushed text-white rounded-tr-none glow-gold') 
                            : (theme === 'dark' ? 'bg-slate-rich text-off-white rounded-tl-none border border-white/5' : 'bg-beige-pale text-cocoa-deep rounded-tl-none border border-gold-brushed/5')
                        }`}>
                          <div className={`prose prose-sm max-w-none ${theme === 'dark' ? 'prose-invert' : 'prose-brand'}`}>
                            <Markdown>{msg.text}</Markdown>
                          </div>
                        </div>
                      </div>
                    ))}
                    {loading && (
                      <div className="flex justify-start">
                        <div className={`p-5 rounded-3xl rounded-tl-none border flex items-center gap-3 ${theme === 'dark' ? 'bg-slate-rich border-white/5 text-off-white' : 'bg-beige-pale border-gold-brushed/5 text-cocoa-deep'}`}>
                          <Loader2 className={`w-5 h-5 animate-spin ${theme === 'dark' ? 'text-silver-glowing' : 'text-gold-brushed'}`} />
                          <span className="text-sm font-bold">{t('law.thinking')}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <form onSubmit={handleChat} className={`p-6 border-t flex gap-3 ${theme === 'dark' ? 'bg-slate-rich border-white/5' : 'bg-beige-pale border-gold-brushed/5'}`}>
                    <button type="button" className={`p-3 transition-colors ${theme === 'dark' ? 'text-off-white/40 hover:text-silver-glowing' : 'text-cocoa-deep/40 hover:text-gold-brushed'}`}>
                      <Mic size={24} />
                    </button>
                    <input 
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder={t('law.placeholder')}
                      className={`flex-1 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 shadow-inner transition-all ${
                        theme === 'dark' 
                          ? 'bg-charcoal-deep border-white/10 text-off-white focus:ring-silver-glowing/20' 
                          : 'bg-cream-soft border-cocoa-deep/10 text-cocoa-deep focus:ring-gold-brushed/20'
                      }`}
                    />
                    <button 
                      disabled={loading || !query.trim()}
                      className={`p-4 rounded-2xl disabled:opacity-50 transition-all active:scale-90 shadow-xl ${
                        theme === 'dark' 
                          ? 'bg-silver-glowing text-charcoal-deep shadow-silver-glowing/20' 
                          : 'bg-gold-brushed text-white shadow-gold-brushed/20'
                      }`}
                    >
                      <Send size={24} />
                    </button>
                  </form>
                </div>
              </motion.div>
            )}

            {mode === 'contract' && contractResult && (
              <motion.div 
                key="contract"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className={`card p-8 space-y-6 ${theme === 'dark' ? 'bg-slate-rich border-white/5' : 'bg-cream-soft border-gold-brushed/10'}`}>
                  <div className={`flex items-center gap-3 border-b pb-4 ${theme === 'dark' ? 'border-white/5' : 'border-gold-brushed/10'}`}>
                    <ShieldAlert className={theme === 'dark' ? 'text-silver-glowing' : 'text-gold-brushed'} />
                    <h3 className="text-xl font-bold">{t('law.contractAnalysis')}</h3>
                  </div>
                  
                  <div className="space-y-4">
                    {contractResult.flags?.map((flag: any, i: number) => (
                      <div key={i} className={`p-5 rounded-3xl border-l-8 transition-all hover:scale-[1.01] ${
                        flag.isIllegal 
                          ? (theme === 'dark' ? 'bg-red-500/10 border-red-500' : 'bg-red-50 border-red-500') 
                          : (theme === 'dark' ? 'bg-silver-glowing/10 border-silver-glowing' : 'bg-gold-brushed/5 border-gold-brushed')
                      }`}>
                        <p className="font-bold text-[10px] uppercase tracking-widest mb-2">{flag.isIllegal ? t('law.illegalClause') : t('law.unfairClause')}</p>
                        <p className={`font-serif italic text-lg mb-3 ${theme === 'dark' ? 'text-off-white' : 'text-cocoa-deep'}`}>"{flag.clause}"</p>
                        <p className={`text-sm font-medium leading-relaxed ${theme === 'dark' ? 'text-off-white/70' : 'text-cocoa-deep/70'}`}>{flag.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`card p-10 text-white space-y-6 relative overflow-hidden shadow-2xl ${theme === 'dark' ? 'bg-silver-glowing text-charcoal-deep glow-silver' : 'bg-gold-brushed text-white glow-gold'}`}>
                  <div className="absolute top-0 right-0 p-12 opacity-10">
                    <Scale size={160} />
                  </div>
                  <div className="relative z-10 space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-3xl font-bold serif">{t('law.knowYourRights')}</h3>
                      <button className={`p-3 rounded-full transition-colors ${theme === 'dark' ? 'bg-charcoal-deep/10 hover:bg-charcoal-deep/20' : 'bg-white/20 hover:bg-white/30'}`}>
                        <Share2 size={24} />
                      </button>
                    </div>
                    <div className={`prose prose-lg max-w-none ${theme === 'dark' ? 'prose-invert text-charcoal-deep' : 'prose-invert'}`}>
                      <Markdown>{contractResult.rightsSummary}</Markdown>
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">{t('law.source')}</p>
                  </div>
                </div>

                <button 
                  onClick={() => { setContractResult(null); setMode('chat'); }}
                  className={`w-full py-6 font-bold text-sm uppercase tracking-widest transition-all hover:opacity-80 ${theme === 'dark' ? 'text-silver-glowing' : 'text-gold-brushed'}`}
                >
                  {t('law.analyzeAnother')}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

function Loader2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
