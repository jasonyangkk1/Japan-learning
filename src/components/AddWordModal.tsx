import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Save, Plus, Trash2 } from 'lucide-react';
import { Word, ExampleSentence } from '../types';
import { cn } from '../lib/utils';

interface AddWordModalProps {
  onClose: () => void;
  onAdd: (word: Word) => void;
}

export default function AddWordModal({ onClose, onAdd }: AddWordModalProps) {
  const [kanji, setKanji] = useState('');
  const [reading, setReading] = useState('');
  const [meaning, setMeaning] = useState('');
  const [type, setType] = useState('n.');
  const [examples, setExamples] = useState<ExampleSentence[]>([{ original: '', translation: '' }]);
  const [notes, setNotes] = useState('');

  const handleSave = () => {
    if (!kanji || !meaning) return;
    
    const newWord: Word = {
      id: Math.random().toString(36).substr(2, 9),
      kanji,
      reading: reading || kanji,
      meaning,
      type,
      familiarity: 'new',
      synonyms: [],
      antonyms: [],
      examples: examples.filter(ex => ex.original),
      notes,
      createdAt: Date.now()
    };
    
    onAdd(newWord);
  };

  const addExample = () => {
    setExamples([...examples, { original: '', translation: '' }]);
  };

  const updateExample = (index: number, field: keyof ExampleSentence, value: string) => {
    const newExamples = [...examples];
    newExamples[index][field] = value;
    setExamples(newExamples);
  };

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 bg-natural-bg z-[60] flex flex-col max-w-md mx-auto"
    >
      <header className="px-6 py-8 border-b border-natural-border flex items-center justify-between bg-natural-card">
        <button onClick={onClose} className="p-2 hover:bg-natural-sidebar rounded-full transition-colors text-natural-text">
          <X size={24} />
        </button>
        <h2 className="text-xl font-bold text-natural-text tracking-tight">新增單字</h2>
        <button 
          onClick={handleSave}
          className="bg-natural-primary text-white px-6 py-2 rounded-xl font-bold text-sm active:scale-95 transition-all shadow-lg shadow-natural-primary/20"
        >
          保存
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-8 space-y-10 pb-32">
        {/* Core Info */}
        <section className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-natural-secondary uppercase tracking-[0.2em] pl-1">漢字</label>
            <input 
              value={kanji}
              onChange={(e) => setKanji(e.target.value)}
              placeholder="例如：配屬"
              className="w-full bg-natural-card rounded-[24px] p-5 border border-natural-border focus:ring-4 focus:ring-natural-primary/5 outline-none transition-all font-serif font-bold text-2xl text-natural-text"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-natural-secondary uppercase tracking-[0.2em] pl-1">假名 (讀音)</label>
            <input 
              value={reading}
              onChange={(e) => setReading(e.target.value)}
              placeholder="例如：はいぞく"
              className="w-full bg-natural-card rounded-[24px] p-5 border border-natural-border focus:ring-4 focus:ring-natural-primary/5 outline-none transition-all font-serif font-medium text-lg text-natural-text"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-natural-secondary uppercase tracking-[0.2em] pl-1">意思</label>
            <textarea 
              value={meaning}
              onChange={(e) => setMeaning(e.target.value)}
              placeholder="單字的意思..."
              className="w-full bg-natural-card rounded-[24px] p-5 border border-natural-border focus:ring-4 focus:ring-natural-primary/5 outline-none transition-all min-h-[120px] resize-none text-natural-text font-medium"
            />
          </div>
        </section>

        {/* Word Type */}
        <section className="space-y-4">
          <label className="text-[10px] font-black text-natural-secondary uppercase tracking-[0.2em] pl-1">詞性</label>
          <div className="flex flex-wrap gap-2">
            {['n.', 'v.', 'adj.', 'adv.', 'phr.'].map(t => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={cn(
                  "px-5 py-3 rounded-2xl text-sm font-bold transition-all border",
                  type === t 
                    ? "bg-natural-primary border-natural-primary text-white shadow-lg shadow-natural-primary/20" 
                    : "bg-natural-card border-natural-border text-natural-text/40 hover:border-natural-secondary/30"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </section>

        {/* Examples */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-black text-natural-secondary uppercase tracking-[0.2em] pl-1">例句</label>
            <button onClick={addExample} className="text-natural-primary p-2 bg-natural-card rounded-xl border border-natural-border">
              <Plus size={20} />
            </button>
          </div>
          <div className="space-y-6">
            {examples.map((ex, i) => (
              <div key={i} className="space-y-2 p-6 bg-natural-card rounded-[32px] border border-natural-border shadow-sm">
                <input 
                  value={ex.original}
                  onChange={(e) => updateExample(i, 'original', e.target.value)}
                  placeholder="日文例句..."
                  className="w-full bg-natural-bg rounded-xl p-4 outline-none text-sm font-serif font-bold"
                />
                <input 
                  value={ex.translation}
                  onChange={(e) => updateExample(i, 'translation', e.target.value)}
                  placeholder="中文翻譯..."
                  className="w-full bg-natural-bg rounded-xl p-4 outline-none text-sm text-gray-500 font-medium"
                />
              </div>
            ))}
          </div>
        </section>
        {/* Notes */}
        <section className="space-y-2">
          <label className="text-[10px] font-black text-natural-secondary uppercase tracking-[0.2em] pl-1">個人筆記</label>
          <textarea 
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="記錄一些筆記或聯想法..."
            className="w-full bg-natural-card rounded-[24px] p-5 border border-natural-border focus:ring-4 focus:ring-natural-primary/5 outline-none transition-all min-h-[120px] resize-none text-natural-text font-medium"
          />
        </section>
      </div>
    </motion.div>
  );
}
