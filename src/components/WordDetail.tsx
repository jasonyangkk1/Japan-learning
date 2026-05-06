import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Volume2, Edit2, Trash2 } from 'lucide-react';
import { Word } from '../types';
import { cn } from '../lib/utils';

interface WordDetailProps {
  word: Word;
  onBack: () => void;
  onUpdate: (word: Word) => void;
  onDelete: (id: string) => void;
}

export default function WordDetail({ word, onBack, onUpdate, onDelete }: WordDetailProps) {
  return (
    <motion.div 
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 bg-natural-bg z-50 flex flex-col max-w-md mx-auto h-screen"
    >
      {/* Header */}
      <header className="p-4 flex items-center justify-between border-b border-natural-border bg-natural-card">
        <button onClick={onBack} className="p-2 hover:bg-natural-sidebar rounded-full transition-colors text-natural-text">
          <ChevronLeft size={24} />
        </button>
        <div className="text-natural-text/60 text-sm font-bold tracking-widest uppercase">Word Detail</div>
        <button className="p-2 hover:bg-natural-sidebar rounded-full transition-colors text-natural-text">
          <ChevronRight size={24} />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-8 space-y-10 pb-32">
        {/* Main Info */}
        <section className="space-y-4">
          <span className="text-natural-primary text-xs font-black uppercase tracking-[0.2em]">{word.type}</span>
          <div className="space-y-1">
            <h1 className="text-5xl font-serif font-bold text-natural-text">{word.kanji}</h1>
            <p className="text-2xl text-natural-secondary font-medium font-serif italic">/{word.reading}/</p>
          </div>
          <button 
            onClick={() => {
              const utterance = new SpeechSynthesisUtterance(word.kanji);
              utterance.lang = 'ja-JP';
              window.speechSynthesis.speak(utterance);
            }}
            className="flex items-center gap-2 text-white font-bold py-3 px-5 bg-natural-primary rounded-2xl shadow-lg shadow-natural-primary/20 active:scale-95 transition-all text-sm w-fit"
          >
            <Volume2 size={18} />
            <span>發音</span>
          </button>
        </section>

        {/* Meaning */}
        <section className="bg-natural-card p-6 rounded-[32px] border border-natural-border shadow-sm">
          <h4 className="text-[10px] font-black text-natural-primary uppercase tracking-[0.2em] mb-3">定義</h4>
          <p className="text-xl text-natural-text leading-relaxed font-medium">
            {word.meaning}
          </p>
        </section>

        {/* Synonyms / Antonyms */}
        <section className="space-y-4 px-2">
          {word.synonyms.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-[10px] font-black text-natural-secondary uppercase tracking-[0.2em]">同義詞</h4>
              <div className="flex flex-wrap gap-2">
                {word.synonyms.map(s => (
                  <span key={s} className="px-4 py-2 bg-natural-sidebar text-natural-primary rounded-xl text-sm font-bold border border-natural-border">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Examples */}
        <section className="space-y-4">
          <h4 className="text-[10px] font-black text-natural-secondary uppercase tracking-[0.2em] px-2">例句</h4>
          <div className="space-y-4">
            {word.examples.map((ex, i) => (
              <div key={i} className="p-6 bg-natural-card rounded-[32px] border border-natural-border space-y-3 shadow-sm">
                <p className="font-serif text-lg text-natural-text font-bold leading-relaxed">{ex.original}</p>
                <div className="h-px bg-natural-bg w-12" />
                <p className="text-sm text-gray-500 font-medium">{ex.translation}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Notes */}
        <section className="space-y-3">
          <h4 className="text-[10px] font-black text-natural-secondary uppercase tracking-[0.2em] px-2">個人筆記</h4>
          <div className="p-6 bg-natural-stats/40 rounded-[32px] border border-natural-border min-h-[120px]">
            <p className="text-natural-text leading-relaxed italic">{word.notes || '尚無筆記'}</p>
          </div>
        </section>
      </div>

      {/* Footer Actions */}
      <footer className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-32px)] p-2 bg-natural-card rounded-[28px] border border-natural-border shadow-xl flex gap-2 z-50">
        <button 
          className="flex-1 bg-natural-secondary text-white font-bold py-4 rounded-2xl active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <Edit2 size={20} />
          <span>編輯</span>
        </button>
        <button 
          onClick={() => onDelete(word.id)}
          className="w-16 bg-natural-bg text-red-500 font-bold py-4 rounded-2xl active:scale-95 transition-all flex items-center justify-center border border-natural-border"
        >
          <Trash2 size={20} />
        </button>
      </footer>
    </motion.div>
  );
}
