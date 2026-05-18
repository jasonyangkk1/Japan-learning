import React from 'react';
import { motion } from 'motion/react';
import { LogIn } from 'lucide-react';
import { signInWithGoogle } from '../lib/firebase';

const LoginView: React.FC = () => {
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

      <div className="w-full max-w-xs space-y-4">
        <button 
          onClick={signInWithGoogle}
          className="w-full bg-natural-card border border-natural-border p-5 rounded-[24px] shadow-sm flex items-center justify-center gap-4 hover:bg-natural-sidebar active:scale-95 transition-all text-natural-text font-bold"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-6 h-6" />
          <span>使用 Google 登入</span>
        </button>
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
