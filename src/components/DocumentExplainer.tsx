import React, { useState, useRef } from 'react';
import { Camera, Upload, FileText, ArrowRight, Loader2, CheckCircle2, Download, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { explainDocument } from '../services/gemini';
import { auth, db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const DocumentExplainer: React.FC<{ language: string, theme: string }> = ({ language, theme }) => {
  const [file, setFile] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFile(reader.result as string);
        processDocument(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const processDocument = async (base64: string) => {
    setLoading(true);
    try {
      const base64Data = base64.split(',')[1];
      const data = await explainDocument(base64Data, language);
      setResult(data);

      // Save to Firestore if logged in
      if (auth.currentUser) {
        await addDoc(collection(db, 'history'), {
          userId: auth.currentUser.uid,
          type: 'doc',
          query: 'Document Analysis', // We could use a more descriptive title if available
          response: data.explanation || '',
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

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-brand-olive dark:text-brand-clay">Document Explainer</h2>
        <p className="text-brand-clay font-medium opacity-80">Snap or upload any government letter, policy, or form.</p>
      </div>

      {!result && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="card p-12 flex flex-col items-center justify-center gap-4 hover:bg-brand-cream dark:hover:bg-white/5 transition-colors group"
          >
            <div className="w-20 h-20 bg-brand-olive/10 rounded-full flex items-center justify-center text-brand-olive group-hover:scale-110 transition-transform">
              <Camera size={40} />
            </div>
            <div className="text-center">
              <p className="font-bold text-xl">Snap a Photo</p>
              <p className="text-sm text-brand-clay">Use your camera to scan a letter</p>
            </div>
          </button>

          <button 
            onClick={() => fileInputRef.current?.click()}
            className="card p-12 flex flex-col items-center justify-center gap-4 hover:bg-brand-cream dark:hover:bg-white/5 transition-colors group"
          >
            <div className="w-20 h-20 bg-brand-clay/10 rounded-full flex items-center justify-center text-brand-clay group-hover:scale-110 transition-transform">
              <Upload size={40} />
            </div>
            <div className="text-center">
              <p className="font-bold text-xl">Upload File</p>
              <p className="text-sm text-brand-clay">PDF or images from your device</p>
            </div>
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
            accept="image/*,application/pdf"
          />
        </div>
      )}

      {loading && (
        <div className="card p-20 flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-12 h-12 text-brand-olive animate-spin" />
          <div className="text-center">
            <p className="font-bold text-xl">LawChat is reading...</p>
            <p className="text-sm text-brand-clay">Analyzing your document and simplifying to plain language.</p>
          </div>
        </div>
      )}

      <AnimatePresence>
        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="card p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-brand-cream dark:border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <FileText className="text-brand-olive" />
                  <h3 className="text-xl font-bold">Simplified Explanation</h3>
                </div>
                <span className="text-xs font-bold uppercase tracking-widest bg-brand-olive/10 text-brand-olive px-3 py-1 rounded-full">
                  {result.detectedLanguage || 'Detected'}
                </span>
              </div>
              
              <div className="prose prose-brand dark:prose-invert max-w-none">
                <Markdown>{result.explanation}</Markdown>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card p-8 bg-brand-olive text-white space-y-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <CheckCircle2 size={24} />
                  Actionable Points
                </h3>
                <div className="space-y-4">
                  {result.actionGuide?.map((step: string, i: number) => (
                    <div key={i} className="flex gap-4 items-start">
                      <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold shrink-0">
                        {i + 1}
                      </span>
                      <p className="font-medium">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">Reply Draft</h3>
                  <button className="text-brand-olive hover:bg-brand-olive/10 p-2 rounded-full transition-colors">
                    <Download size={20} />
                  </button>
                </div>
                <div className="bg-brand-cream dark:bg-white/5 p-4 rounded-2xl text-sm font-serif italic text-brand-ink/70 dark:text-white/70 border border-brand-olive/10">
                  <Markdown>{result.replyDraft}</Markdown>
                </div>
                <button className="w-full pill-button bg-brand-olive text-white flex items-center justify-center gap-2">
                  <Share2 size={18} />
                  Send via WhatsApp
                </button>
              </div>
            </div>

            <button 
              onClick={() => { setResult(null); setFile(null); }}
              className="w-full py-4 text-brand-clay font-bold hover:text-brand-olive transition-colors"
            >
              Scan another document
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
