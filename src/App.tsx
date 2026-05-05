/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  MessageSquare, 
  ListTodo, 
  PenTool, 
  HelpCircle, 
  Plus
} from 'lucide-react';
import { cn } from './lib/utils';
import { Word, Familiarity, QuizHistory } from './types';
import { INITIAL_WORDS } from './constants';

// Views
import WordList from './components/WordList';
import QuizView from './components/QuizView';
import WordDetail from './components/WordDetail';
import AddWordModal from './components/AddWordModal';

type Tab = 'words' | 'phrases' | 'grammar' | 'patterns' | 'quiz';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('words');
  const [words, setWords] = useState<Word[]>(() => {
    const saved = localStorage.getItem('vocab_words');
    return saved ? JSON.parse(saved) : INITIAL_WORDS;
  });
  const [quizHistory, setQuizHistory] = useState<QuizHistory[]>(() => {
    const saved = localStorage.getItem('vocab_quiz_history');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [isAddingWord, setIsAddingWord] = useState(false);

  useEffect(() => {
    localStorage.setItem('vocab_words', JSON.stringify(words));
  }, [words]);

  useEffect(() => {
    localStorage.setItem('vocab_quiz_history', JSON.stringify(quizHistory));
  }, [quizHistory]);

  const handleUpdateWord = (updatedWord: Word) => {
    setWords(prev => prev.map(w => w.id === updatedWord.id ? updatedWord : w));
    if (selectedWord?.id === updatedWord.id) setSelectedWord(updatedWord);
  };

  const handleAddWord = (newWord: Word) => {
    setWords(prev => [newWord, ...prev]);
    setIsAddingWord(false);
  };

  const handleDeleteWord = (id: string) => {
    setWords(prev => prev.filter(w => w.id !== id));
    setSelectedWord(null);
  };

  return (
    <div className="min-h-screen bg-natural-bg flex flex-col max-w-md mx-auto relative overflow-hidden shadow-2xl">
      {/* Content Area */}
      <main className="flex-1 overflow-y-auto pb-24 h-screen scrollbar-hide">
        <AnimatePresence mode="wait">
          {selectedWord ? (
            <WordDetail 
              word={selectedWord} 
              onBack={() => setSelectedWord(null)}
              onUpdate={handleUpdateWord}
              onDelete={handleDeleteWord}
            />
          ) : activeTab === 'words' ? (
            <WordList 
              words={words} 
              onSelect={setSelectedWord}
              onAddClick={() => setIsAddingWord(true)}
            />
          ) : activeTab === 'quiz' ? (
            <QuizView 
              words={words} 
              history={quizHistory} 
              onComplete={(h) => setQuizHistory(prev => [h, ...prev])}
            />
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-8 text-center text-gray-400 mt-20"
            >
              此功能尚在開發中
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating Add Button - Only on words tab and when no detail view */}
      {activeTab === 'words' && !selectedWord && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={() => setIsAddingWord(true)}
          className="fixed bottom-24 right-6 w-14 h-14 bg-natural-secondary text-white rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-transform z-40"
          id="add-word-btn"
        >
          <Plus size={28} />
        </motion.button>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-natural-sidebar border-t border-natural-border flex items-center justify-around py-3 px-2 z-50">
        <NavButton 
          active={activeTab === 'words'} 
          icon={<BookOpen size={20} />} 
          label="單字" 
          count={words.length > 99 ? '99+' : words.length}
          onClick={() => { setActiveTab('words'); setSelectedWord(null); }} 
        />
        <NavButton 
          active={activeTab === 'phrases'} 
          icon={<MessageSquare size={20} />} 
          label="片語" 
          count="1"
          onClick={() => { setActiveTab('phrases'); setSelectedWord(null); }} 
        />
        <NavButton 
          active={activeTab === 'grammar'} 
          icon={<ListTodo size={20} />} 
          label="文法" 
          onClick={() => { setActiveTab('grammar'); setSelectedWord(null); }} 
        />
        <NavButton 
          active={activeTab === 'patterns'} 
          icon={<PenTool size={20} />} 
          label="句型" 
          onClick={() => { setActiveTab('patterns'); setSelectedWord(null); }} 
        />
        <NavButton 
          active={activeTab === 'quiz'} 
          icon={<HelpCircle size={20} />} 
          label="測驗" 
          onClick={() => { setActiveTab('quiz'); setSelectedWord(null); }} 
        />
      </nav>

      {/* Add Modal */}
      <AnimatePresence>
        {isAddingWord && (
          <AddWordModal 
            onClose={() => setIsAddingWord(false)}
            onAdd={handleAddWord}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function NavButton({ 
  active, 
  icon, 
  label, 
  count,
  onClick 
}: { 
  active: boolean; 
  icon: React.ReactNode; 
  label: string; 
  count?: string | number;
  onClick: () => void;
}) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1 transition-colors relative px-2",
        active ? "text-natural-primary" : "text-gray-400"
      )}
    >
      <div className="relative">
        {icon}
        {count && (
          <span className="absolute -top-3 -right-4 bg-natural-primary text-white text-[10px] px-1 min-w-[16px] h-[16px] rounded-full flex items-center justify-center font-bold border-2 border-white">
            {count}
          </span>
        )}
      </div>
      <span className="text-[10px] font-medium">{label}</span>
      {active && (
        <motion.div 
          layoutId="nav-indicator"
          className="absolute -bottom-1 w-1 h-1 rounded-full bg-natural-primary"
        />
      )}
    </button>
  );
}
