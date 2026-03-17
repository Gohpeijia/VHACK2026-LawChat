import React, { useState, useRef } from 'react';
import { MessageSquare, Scale, FileSearch, ShieldAlert, Send, Mic, Sparkles, Camera, ChevronRight, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { askLaw, analyzeContract } from '../services/gemini';
import { auth, db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const CATEGORIES = [
  { id: 'tenancy', name: 'Tenancy', icon: '🏠', desc: 'Rent, deposits, eviction' },
  { id: 'employment', name: 'Employment', icon: '💼', desc: 'Salary, EPF, termination' },
  { id: 'consumer', name: 'Consumer', icon: '🛒', desc: 'Refunds, scams, warranties' },
  { id: 'family', name: 'Family', icon: '👨‍👩‍👧', desc: 'Marriage, divorce, custody' },
  { id: 'accidents', name: 'Road Accidents', icon: '🚗', desc: 'Insurance, claims, police' },
  { id: 'welfare', name: 'Welfare Rights', icon: '🤝', desc: 'JKM, subsidies, aid' },
];

export const LawExplainer: React.FC<{ language: string, theme: string }> = ({ language, theme }) => {
  const [mode, setMode] = useState<'chat' | 'contract'>('chat');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [simpleMode, setSimpleMode] = useState(false);
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
      const response = await askLaw(messageToSend, simpleMode, language);
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
          const base64Data = (reader.result as string).split(',')[1];
          const data = await analyzeContract(base64Data, language);
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
    <div className={`max-w-6xl mx-auto space-y-8 pb-20 p-6 rounded-[40px] transition-all duration-500 ${simpleMode ? 'bg-[#0f0f0f] text-white shadow-2xl' : ''}`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className={`text-3xl font-bold serif ${simpleMode ? 'text-white' : 'text-brand-olive'}`}>LawChat</h2>
          <p className={`${simpleMode ? 'text-white/60' : 'text-brand-clay'} font-medium`}>Know your rights in plain language.</p>
        </div>
        <button 
          onClick={() => setSimpleMode(!simpleMode)}
          className={`pill-button flex items-center gap-2 border-2 transition-all ${simpleMode ? 'bg-white text-black border-white' : 'border-brand-clay/20 text-brand-clay'}`}
        >
          <Sparkles size={18} />
          {simpleMode ? 'Budak Sekolah Mode: ON' : 'Simple Mode'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Categories Sidebar (Beside Chat) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="space-y-2">
            <h3 className={`text-xs font-bold uppercase tracking-widest px-2 ${simpleMode ? 'text-white/40' : 'text-brand-clay'}`}>Quick Topics</h3>
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
              {CATEGORIES.map((cat) => (
                <button 
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat)}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left group ${activeCategory === cat.id ? 'bg-brand-olive text-white border-brand-olive shadow-md' : (simpleMode ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'bg-white border-black/5 hover:border-brand-olive/30 hover:bg-brand-cream')}`}
                >
                  <span className={`text-xl transition-transform ${activeCategory === cat.id ? '' : 'group-hover:scale-110'}`}>{cat.icon}</span>
                  <div>
                    <p className={`text-sm font-bold ${activeCategory === cat.id ? 'text-white' : (simpleMode ? 'text-white' : 'text-brand-ink')}`}>{cat.name}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className={`text-xs font-bold uppercase tracking-widest px-2 ${simpleMode ? 'text-white/40' : 'text-brand-clay'}`}>Tools</h3>
            <div className="grid grid-cols-1 gap-2">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left group ${mode === 'contract' ? 'bg-brand-olive text-white border-brand-olive' : (simpleMode ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'bg-brand-olive/5 border-brand-olive/10 hover:bg-brand-olive/10')}`}
              >
                <Camera size={20} className={mode === 'contract' ? 'text-white' : (simpleMode ? 'text-white' : 'text-brand-olive')} />
                <p className={`text-sm font-bold ${mode === 'contract' ? 'text-white' : (simpleMode ? 'text-white' : 'text-brand-olive')}`}>Snap Contract</p>
              </button>
              <button 
                onClick={clearChat}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${simpleMode ? 'bg-white/5 border-white/10 text-white hover:bg-red-900/20 hover:border-red-900/40' : 'bg-white border border-black/5 hover:bg-red-50 hover:border-red-200 hover:text-red-600'}`}
              >
                <MessageSquare size={20} />
                <p className="text-sm font-bold">New Chat</p>
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
                <div className={`card min-h-[550px] flex flex-col shadow-xl ${simpleMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white shadow-brand-olive/5'}`}>
                  <div className="flex-1 p-6 space-y-6 overflow-y-auto max-h-[600px]">
                    {chatHistory.length === 0 && (
                      <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center ${simpleMode ? 'bg-white/10 text-white' : 'bg-brand-olive/10 text-brand-olive'}`}>
                          <MessageSquare size={32} />
                        </div>
                        <div className="space-y-1">
                          <p className="font-bold text-lg">Apa khabar? I'm LawChat.</p>
                          <p className="text-sm">Select a topic on the left or ask me anything about national law.<br/>"Can my landlord evict me in 3 days?"</p>
                        </div>
                      </div>
                    )}
                    {chatHistory.map((msg, i) => (
                      <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-4 rounded-2xl ${msg.role === 'user' ? 'bg-brand-olive text-white rounded-tr-none shadow-md' : (simpleMode ? 'bg-white/5 text-white rounded-tl-none border border-white/10' : 'bg-[#f8f8f4] text-brand-ink rounded-tl-none border border-brand-olive/10')}`}>
                          <div className={`prose prose-sm max-w-none ${simpleMode ? 'prose-invert' : 'prose-brand'}`}>
                            <Markdown>{msg.text}</Markdown>
                          </div>
                        </div>
                      </div>
                    ))}
                    {loading && (
                      <div className="flex justify-start">
                        <div className={`p-4 rounded-2xl rounded-tl-none border flex items-center gap-2 ${simpleMode ? 'bg-white/5 border-white/10 text-white' : 'bg-[#f8f8f4] border-brand-olive/10'}`}>
                          <Loader2 className={`w-4 h-4 animate-spin ${simpleMode ? 'text-white' : 'text-brand-olive'}`} />
                          <span className="text-sm font-medium">LawChat is thinking...</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <form onSubmit={handleChat} className={`p-4 border-t flex gap-2 ${simpleMode ? 'bg-white/5 border-white/10' : 'bg-brand-cream/30 border-brand-cream'}`}>
                    <button type="button" className={`p-3 transition-colors ${simpleMode ? 'text-white/60 hover:text-white' : 'text-brand-clay hover:text-brand-olive'}`}>
                      <Mic size={24} />
                    </button>
                    <input 
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Type your question..."
                      className={`flex-1 rounded-full px-6 py-3 focus:outline-none focus:ring-2 shadow-inner ${simpleMode ? 'bg-white/10 border-white/10 text-white focus:ring-white/20' : 'bg-white border border-black/5 focus:ring-brand-olive/20'}`}
                    />
                    <button 
                      disabled={loading || !query.trim()}
                      className={`p-3 rounded-full disabled:opacity-50 transition-all active:scale-90 shadow-lg ${simpleMode ? 'bg-white text-black shadow-white/10' : 'bg-brand-olive text-white shadow-brand-olive/20'}`}
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
                <div className={`card p-8 space-y-6 ${simpleMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white'}`}>
                  <div className={`flex items-center gap-3 border-b pb-4 ${simpleMode ? 'border-white/10' : 'border-brand-cream'}`}>
                    <ShieldAlert className={simpleMode ? 'text-white/60' : 'text-brand-clay'} />
                    <h3 className="text-xl font-bold">Contract Analysis</h3>
                  </div>
                  
                  <div className="space-y-4">
                    {contractResult.flags?.map((flag: any, i: number) => (
                      <div key={i} className={`p-4 rounded-2xl border-l-4 ${flag.isIllegal ? (simpleMode ? 'bg-red-900/20 border-red-500' : 'bg-red-50 border-red-500') : (simpleMode ? 'bg-orange-900/20 border-orange-500' : 'bg-orange-50 border-orange-500')}`}>
                        <p className="font-bold text-sm uppercase tracking-wider mb-1">{flag.isIllegal ? 'Illegal Clause' : 'Unfair Clause'}</p>
                        <p className={`font-serif italic mb-2 ${simpleMode ? 'text-white/80' : 'text-brand-ink/80'}`}>"{flag.clause}"</p>
                        <p className={`text-sm font-medium ${simpleMode ? 'text-white/60' : 'text-brand-ink/60'}`}>{flag.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`card p-8 text-white space-y-6 relative overflow-hidden ${simpleMode ? 'bg-white/10' : 'bg-brand-clay'}`}>
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Scale size={120} />
                  </div>
                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-bold">Know Your Rights</h3>
                      <button className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                        <Share2 size={20} />
                      </button>
                    </div>
                    <div className="prose prose-invert max-w-none">
                      <Markdown>{contractResult.rightsSummary}</Markdown>
                    </div>
                    <p className="text-xs font-bold uppercase tracking-widest opacity-60">Source: National Statutes & Case Law</p>
                  </div>
                </div>

                <button 
                  onClick={() => { setContractResult(null); setMode('chat'); }}
                  className={`w-full py-4 font-bold transition-colors ${simpleMode ? 'text-white hover:text-white/80' : 'text-brand-clay hover:text-brand-olive'}`}
                >
                  Analyze another contract
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
