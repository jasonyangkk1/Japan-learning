import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search } from 'lucide-react';
import { Word, Familiarity } from '../types';
import { cn } from '../lib/utils';

interface WordListProps {
  words: Word[];
  onSelect: (word: Word) => void;
  onAddClick: () => void;
}

const FAMILIARITY_LABELS: Record<string, string> = {
  all: '全部',
  new: '陌生',
  learning: '認識',
  known: '熟悉',
};

export default function WordList({ words, onSelect, onAddClick }: WordListProps) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string>('all');

  const filteredWords = words.filter(word => {
    const matchesSearch = 
      word.kanji.toLowerCase().includes(search.toLowerCase()) || 
      word.meaning.toLowerCase().includes(search.toLowerCase()) ||
      word.reading.toLowerCase().includes(search.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    return matchesSearch && word.familiarity === filter;
  });

  return (
    <div className="flex flex-col h-full bg-natural-bg">
      {/* Header */}
      <header className="p-6 pt-10 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-natural-primary rounded-xl flex items-center justify-center text-white font-bold text-xl">語</div>
          <h1 className="text-2xl font-bold tracking-tight text-natural-text">Kotoba Nest</h1>
        </div>
        
        {/* Search Bar */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-natural-secondary group-focus-within:text-natural-primary transition-colors" size={18} />
          <input 
            type="text"
            placeholder="搜尋單字..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-natural-card rounded-full py-4 pl-12 pr-6 shadow-sm border border-natural-border focus:outline-none focus:ring-2 focus:ring-natural-primary/10 transition-all text-natural-text placeholder:text-gray-400"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {Object.entries(FAMILIARITY_LABELS).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={cn(
                "px-6 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all",
                filter === key 
                  ? "bg-natural-primary text-white shadow-lg shadow-natural-primary/20" 
                  : "bg-natural-sidebar border border-natural-border text-natural-text/60 hover:border-gray-300"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      {/* Grid List */}
      <div className="flex-1 px-6 pb-6">
        <div className="grid grid-cols-1 gap-4">
          {filteredWords.map((word, index) => (
            <motion.div
              key={word.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onSelect(word)}
              className="bg-natural-card rounded-[24px] border border-natural-border p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-baseline gap-3">
                    <h3 className="text-2xl font-serif font-bold text-natural-text">{word.kanji}</h3>
                    <span className="text-sm text-gray-400 font-medium">{word.reading}</span>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-1 italic">
                    {word.meaning}
                  </p>
                </div>
                
                <div className="flex flex-col items-end gap-2">
                  <span className={cn(
                    "text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-widest",
                    "bg-natural-sidebar text-natural-primary border border-natural-border"
                  )}>
                    {word.type}
                  </span>
                  
                  {/* Familiarity dot */}
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    word.familiarity === 'mastered' ? "bg-green-500" :
                    word.familiarity === 'known' ? "bg-natural-secondary" :
                    "bg-orange-400"
                  )} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {filteredWords.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <p>找不到相關單字</p>
          </div>
        )}
      </div>
    </div>
  );
}
