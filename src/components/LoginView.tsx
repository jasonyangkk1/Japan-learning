import React, { useState } from 'react';
import { motion } from 'motion/react';
import { LogIn, Loader2, AlertCircle } from 'lucide-react';
import { signInWithGoogle } from '../lib/firebase';

const LoginView: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      console.error("Login failed:", err);
      if (err.code === 'auth/popup-blocked') {
        setError("登入視窗被阻擋，請在瀏覽器設定中允許彈出視窗。");
      } else if (err.code === 'auth/popup-closed-by-user') {
        setError("登入視窗已關閉。");
      } else {
        setError(err.message || '登入失敗，請稍後再試。');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-natural-bg flex flex-col items-center justify-center p-8 text-center space-y-12">
      <div className="space-y-4">
        <div className="w-24 h-24 bg-natural-primary rounded-[32px] flex items-center justify-center text-white mx-auto shadow-2xl shadow-natural-primary/20">
          <LogIn size={48} strokeWidth={2.5} />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-serif font-bold text-natural-text tracking-tight">日語單字帳</h1>
          <p className="text-natural-secondary font-medium tracking-wide uppercase text-xs opacity-60">Japanese Vocab Tracker</p>
        </div>
      </div>

      <div className="w-full max-w-xs space-y-6">
        <div className="space-y-4">
          <button 
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-natural-card border border-natural-border p-5 rounded-[24px] shadow-sm flex items-center justify-center gap-4 hover:bg-natural-sidebar active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-natural-text font-bold"
          >
            {loading ? (
              <Loader2 size={24} className="animate-spin text-natural-primary" />
            ) : (
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-6 h-6" />
            )}
            <span>{loading ? '正在登入...' : '使用 Google 登入'}</span>
          </button>
          
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-medium text-left"
            >
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
        </div>

        <p className="text-[10px] text-natural-secondary font-medium uppercase tracking-[0.2em] opacity-40">
          登入以同步您的學習進度
        </p>
      </div>

      <div className="absolute bottom-12 text-[10px] text-natural-secondary font-black uppercase tracking-[0.3em] opacity-20">
        AI Studio Project
      </div>
    </div>
  );
};

export default LoginView;
