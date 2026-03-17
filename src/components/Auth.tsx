import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogIn, UserPlus, Mail, Lock, User, ArrowRight, Scale, AlertCircle } from 'lucide-react';
import { auth, db } from '../firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useLocalization } from '../services/localization';

interface AuthProps {
  onSuccess: () => void;
  theme: string;
}

export function Auth({ onSuccess, theme }: AuthProps) {
  const { t } = useLocalization();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName });
        
        // Create user document
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          displayName: displayName,
          role: 'user',
          createdAt: serverTimestamp()
        });
      }
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email address first.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Check if user document exists, if not create it
      // We use setDoc with merge: true to be safe
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        role: 'user',
        createdAt: serverTimestamp()
      }, { merge: true });
      
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-hidden">
      {/* Vibrant Mesh Gradient Background */}
      <div className={`absolute inset-0 -z-10 transition-colors duration-500 ${theme === 'dark' ? 'bg-charcoal-deep' : 'bg-[#f5f5f0]'}`}>
        <div className={`absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] animate-pulse ${theme === 'dark' ? 'bg-silver-glowing/10' : 'bg-gold-brushed/20'}`} />
        <div className={`absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full blur-[120px] animate-pulse ${theme === 'dark' ? 'bg-slate-rich/30' : 'bg-gold-brushed/10'}`} style={{ animationDelay: '1s' }} />
        <div className={`absolute top-[20%] right-[10%] w-[40%] h-[40%] rounded-full blur-[100px] animate-pulse ${theme === 'dark' ? 'bg-silver-glowing/5' : 'bg-gold-brushed/5'}`} style={{ animationDelay: '2s' }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md relative"
      >
        {/* Glassmorphism Card */}
        <div className={`backdrop-blur-2xl border rounded-[32px] shadow-2xl overflow-hidden p-8 md:p-10 transition-all duration-500 ${
          theme === 'dark' 
            ? 'bg-slate-rich/60 border-white/10' 
            : 'bg-white/40 border-white/40'
        }`}>
          <div className="flex flex-col items-center mb-8">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-4 shadow-xl transition-all ${
              theme === 'dark' 
                ? 'bg-silver-glowing text-charcoal-deep shadow-silver-glowing/20 glow-silver' 
                : 'bg-gold-brushed text-white shadow-gold-brushed/20 glow-gold'
            }`}>
              <Scale size={32} />
            </div>
            <h2 className={`text-3xl font-bold serif ${theme === 'dark' ? 'text-off-white' : 'text-cocoa-deep'}`}>{t('law.title')}</h2>
            <p className={`text-sm font-medium mt-1 ${theme === 'dark' ? 'text-off-white/60' : 'text-gold-brushed'}`}>
              {isLogin ? t('auth.loginTitle') : t('auth.signupTitle')}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-1"
                >
                  <label className={`text-[10px] font-bold uppercase tracking-widest ml-4 ${theme === 'dark' ? 'text-off-white/40' : 'text-cocoa-deep/40'}`}>{t('auth.fullName')}</label>
                  <div className="relative">
                    <User className={`absolute left-4 top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'text-off-white/20' : 'text-cocoa-deep/20'}`} size={18} />
                    <input 
                      type="text"
                      required
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="John Doe"
                      className={`w-full border rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 transition-all ${
                        theme === 'dark' 
                          ? 'bg-charcoal-deep/50 border-white/10 text-off-white focus:ring-silver-glowing/20' 
                          : 'bg-white/50 border-white/60 text-cocoa-deep focus:ring-gold-brushed/20'
                      }`}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-1">
              <label className={`text-[10px] font-bold uppercase tracking-widest ml-4 ${theme === 'dark' ? 'text-off-white/40' : 'text-cocoa-deep/40'}`}>{t('auth.email')}</label>
              <div className="relative">
                <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'text-off-white/20' : 'text-cocoa-deep/20'}`} size={18} />
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className={`w-full border rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 transition-all ${
                    theme === 'dark' 
                      ? 'bg-charcoal-deep/50 border-white/10 text-off-white focus:ring-silver-glowing/20' 
                      : 'bg-white/50 border-white/60 text-cocoa-deep focus:ring-gold-brushed/20'
                  }`}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between px-4">
                <label className={`text-[10px] font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-off-white/40' : 'text-cocoa-deep/40'}`}>{t('auth.password')}</label>
                {isLogin && (
                  <button 
                    type="button"
                    onClick={handleForgotPassword}
                    className={`text-[10px] font-bold uppercase tracking-widest hover:underline ${theme === 'dark' ? 'text-silver-glowing' : 'text-gold-brushed'}`}
                  >
                    {t('auth.forgotPassword')}
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'text-off-white/20' : 'text-cocoa-deep/20'}`} size={18} />
                <input 
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full border rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 transition-all ${
                    theme === 'dark' 
                      ? 'bg-charcoal-deep/50 border-white/10 text-off-white focus:ring-silver-glowing/20' 
                      : 'bg-white/50 border-white/60 text-cocoa-deep focus:ring-gold-brushed/20'
                  }`}
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 text-red-600 text-xs font-medium"
              >
                <AlertCircle size={14} />
                {error}
              </motion.div>
            )}

            {resetSent && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 p-3 rounded-xl bg-green-500/10 text-green-600 text-xs font-medium"
              >
                <AlertCircle size={14} className="text-green-600" />
                {t('auth.resetEmailSent')}
              </motion.div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className={`w-full rounded-2xl py-4 font-bold text-sm shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 ${
                theme === 'dark' 
                  ? 'bg-silver-glowing text-charcoal-deep shadow-silver-glowing/20' 
                  : 'bg-gold-brushed text-white shadow-gold-brushed/20'
              }`}
            >
              {loading ? t('auth.processing') : (isLogin ? t('auth.signIn') : t('auth.signUp'))}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className={`w-full border-t ${theme === 'dark' ? 'border-white/10' : 'border-cocoa-deep/10'}`}></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
              <span className={`bg-transparent px-4 ${theme === 'dark' ? 'text-off-white/40' : 'text-cocoa-deep/40'}`}>{t('auth.orContinue')}</span>
            </div>
          </div>

          <button 
            onClick={handleGoogleSignIn}
            disabled={loading}
            className={`w-full border rounded-2xl py-4 font-bold text-sm transition-all flex items-center justify-center gap-3 ${
              theme === 'dark' 
                ? 'bg-white/5 border-white/10 text-off-white hover:bg-white/10' 
                : 'bg-white/60 border-white/80 text-cocoa-deep hover:bg-white/80'
            }`}
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
            {t('auth.google')}
          </button>

          <div className="mt-8 flex flex-col items-center gap-4">
            <button 
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className={`text-xs font-bold hover:underline underline-offset-4 ${theme === 'dark' ? 'text-silver-glowing' : 'text-gold-brushed'}`}
            >
              {isLogin ? t('auth.noAccount') : t('auth.hasAccount')}
            </button>

            <button 
              type="button"
              onClick={onSuccess}
              className={`text-xs font-bold opacity-40 hover:opacity-100 transition-opacity ${theme === 'dark' ? 'text-off-white' : 'text-cocoa-deep'}`}
            >
              {t('auth.continueGuest')}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
