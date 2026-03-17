import React, { useEffect, useState } from 'react';
import { History as HistoryIcon, Clock, ChevronRight, FileText, MessageSquare, Loader2 } from 'lucide-react';
import { auth, db } from '../firebase';
import { collection, query, where, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';

interface HistoryItem {
  id: string;
  type: 'doc' | 'law';
  query: string;
  response: string;
  timestamp: Timestamp;
  language?: string;
}

export const History: React.FC<{ theme: string }> = ({ theme }) => {
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
      <div className="h-[400px] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-olive animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="space-y-1">
        <h2 className="text-3xl font-bold text-brand-olive dark:text-brand-clay">History</h2>
        <p className="text-brand-clay font-medium opacity-80">Your simplified documents and LawChat Q&As saved to your account.</p>
      </div>

      <div className="space-y-4">
        {historyItems.length > 0 ? (
          historyItems.map((item) => (
            <button 
              key={item.id}
              className="card w-full p-6 flex items-center justify-between hover:bg-brand-cream dark:hover:bg-white/5 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.type === 'doc' ? 'bg-brand-olive/10 text-brand-olive' : 'bg-brand-clay/10 text-brand-clay'}`}>
                  {item.type === 'doc' ? <FileText size={24} /> : <MessageSquare size={24} />}
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-lg line-clamp-1">{item.query}</h4>
                  <div className="flex items-center gap-2 text-xs text-brand-clay font-medium opacity-60">
                    <Clock size={12} />
                    {item.timestamp?.toDate().toLocaleString()}
                  </div>
                </div>
              </div>
              <ChevronRight className="text-brand-clay group-hover:translate-x-1 transition-transform" />
            </button>
          ))
        ) : (
          <div className="card p-12 text-center space-y-4 opacity-50">
            <HistoryIcon size={48} className="mx-auto text-brand-olive" />
            <p className="font-medium">No history found yet.<br/>Start by asking LawChat a question or scanning a document.</p>
          </div>
        )}
      </div>
    </div>
  );
};
