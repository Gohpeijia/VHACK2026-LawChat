import React, { useEffect, useState } from 'react';
import { History as HistoryIcon, Clock, ChevronRight, FileText, MessageSquare, Loader2 } from 'lucide-react';
import { auth, db } from '../firebase';
import { collection, query, where, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import { useLocalization } from '../services/localization';

interface HistoryItem {
  id: string;
  type: 'doc' | 'law';
  query: string;
  response: string;
  timestamp: Timestamp;
  language?: string;
}

export const History: React.FC<{ theme: string, onSelectItem: (item: HistoryItem) => void }> = ({ theme, onSelectItem }) => {
  const { t } = useLocalization();
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'history'),
      where('userId', '==', user.uid),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as HistoryItem[];
      setHistoryItems(items);
      setLoading(false);
    }, (error) => {
      console.error("History fetch error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="h-100 flex items-center justify-center">
        <Loader2 className={`w-8 h-8 animate-spin ${theme === 'dark' ? 'text-silver-glowing' : 'text-gold-brushed'}`} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <div className="space-y-1">
        <h2 className={`text-3xl font-bold serif ${theme === 'dark' ? 'text-off-white' : 'text-cocoa-deep'}`}>{t('history.title')}</h2>
        <p className={`font-medium opacity-60 ${theme === 'dark' ? 'text-off-white' : 'text-cocoa-deep'}`}>{t('history.subtitle')}</p>
      </div>

      <div className="space-y-4">
        {historyItems.length > 0 ? (
          historyItems.map((item) => (
            <button 
              key={item.id}
              onClick={() => onSelectItem(item)}
              className={`card w-full p-6 flex items-center justify-between transition-all group ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-gold-brushed/5'}`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  theme === 'dark' 
                    ? 'bg-silver-glowing/10 text-silver-glowing' 
                    : 'bg-gold-brushed/10 text-gold-brushed'
                }`}>
                  {item.type === 'doc' ? <FileText size={24} /> : <MessageSquare size={24} />}
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-lg line-clamp-1">{item.query}</h4>
                  <div className={`flex items-center gap-2 text-xs font-medium opacity-60 ${theme === 'dark' ? 'text-off-white' : 'text-cocoa-deep'}`}>
                    <Clock size={12} />
                    {item.timestamp?.toDate().toLocaleString()}
                  </div>
                </div>
              </div>
              <ChevronRight className={`transition-transform group-hover:translate-x-1 ${theme === 'dark' ? 'text-off-white/40' : 'text-cocoa-deep/40'}`} />
            </button>
          ))
        ) : (
          <div className={`card p-12 text-center space-y-4 opacity-50 ${theme === 'dark' ? 'bg-slate-rich' : 'bg-cream-soft'}`}>
            <HistoryIcon size={48} className={`mx-auto ${theme === 'dark' ? 'text-silver-glowing' : 'text-gold-brushed'}`} />
            <p className="font-medium">{t('history.empty')}</p>
          </div>
        )}
      </div>
    </div>
  );
};
