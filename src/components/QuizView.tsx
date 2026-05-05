import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Settings2, 
  Play, 
  Trash2, 
  RotateCcw,
  CheckCircle2,
  XCircle,
  Calendar as CalendarIcon
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { Word, QuizHistory, QuizSettings } from '../types';
import { cn } from '../lib/utils';

interface QuizViewProps {
  words: Word[];
  history: QuizHistory[];
  onComplete: (history: QuizHistory) => void;
}

export default function QuizView({ words, history, onComplete }: QuizViewProps) {
  const [isStarted, setIsStarted] = useState(false);
  const [settings, setSettings] = useState<QuizSettings>({
    category: '全部類別',
    familiarity: '全部',
    type: 'multiple-choice',
    direction: 'jp-to-cn',
    count: 10
  });

  // Active quiz state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [quizWords, setQuizWords] = useState<Word[]>([]);
  const [options, setOptions] = useState<string[]>([]);
  const [wrongWordIds, setWrongWordIds] = useState<string[]>([]);
  const [resultMessage, setResultMessage] = useState<string | null>(null);

  const startQuiz = () => {
    const shuffled = [...words].sort(() => Math.random() - 0.5).slice(0, settings.count);
    setQuizWords(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setWrongWordIds([]);
    setIsStarted(true);
    generateOptions(shuffled[0], words);
  };

  const generateOptions = (correctWord: Word, allWords: Word[]) => {
    const distractors = allWords
      .filter(w => w.id !== correctWord.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    const correctVal = settings.direction === 'jp-to-cn' ? correctWord.meaning : correctWord.kanji;
    const distractorVals = distractors.map(w => 
      settings.direction === 'jp-to-cn' ? w.meaning : w.kanji
    );
    
    setOptions([correctVal, ...distractorVals].sort(() => Math.random() - 0.5));
  };

  const handleAnswer = (answer: string) => {
    const correctWord = quizWords[currentIndex];
    const correctVal = settings.direction === 'jp-to-cn' ? correctWord.meaning : correctWord.kanji;
    
    if (answer === correctVal) {
      setScore(s => s + 1);
    } else {
      setWrongWordIds(prev => [...prev, correctWord.id]);
    }

    if (currentIndex < quizWords.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      generateOptions(quizWords[nextIndex], words);
    } else {
      // Finish
      const finalScore = answer === correctVal ? score + 1 : score;
      const historyRecord: QuizHistory = {
        id: Math.random().toString(36).substr(2, 9),
        date: Date.now(),
        score: finalScore,
        total: quizWords.length,
        wrongWords: wrongWordIds
      };
      onComplete(historyRecord);
      setResultMessage(`測驗結束！您的得分是 ${finalScore} / ${quizWords.length}`);
      setIsStarted(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-natural-bg">
      <AnimatePresence mode="wait">
        {!isStarted ? (
          <motion.div 
            key="setup"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-8 space-y-10 pb-40"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 bg-natural-primary rounded-xl flex items-center justify-center text-white font-bold text-xl mb-4">測</div>
              <h1 className="text-3xl font-bold text-natural-text tracking-tight">隨堂測驗</h1>
              <p className="text-sm text-natural-secondary font-medium uppercase tracking-widest opacity-60">Study Session</p>
            </div>

            {/* Settings Card */}
            <div className="bg-natural-card rounded-[32px] border border-natural-border shadow-sm p-8 space-y-8">
              <div className="space-y-4">
                <SettingRow label="題目範圍" value={settings.category} />
                <SettingRow label="熟練度" value={settings.familiarity} />
                <SettingRow label="題型" value={settings.type === 'multiple-choice' ? '選擇題' : '拼字題'} />
                <SettingRow label="題目方向" value={settings.direction === 'jp-to-cn' ? '日文 → 中文' : '中文 → 日文'} />
                <SettingRow label="出題數量" value={`${settings.count} 題`} />
              </div>

              <button 
                onClick={startQuiz}
                className="w-full bg-natural-primary text-white font-bold py-5 rounded-2xl shadow-xl shadow-natural-primary/20 active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                <Play size={20} fill="currentColor" />
                <span>開始測驗</span>
              </button>
            </div>

            {/* Calendar Tracker */}
            <div className="bg-natural-card rounded-[32px] p-8 border border-natural-border shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarIcon size={20} className="text-natural-secondary" />
                  <span className="font-bold text-natural-text text-lg">{format(new Date(), 'yyyy 年 M 月')}</span>
                </div>
              </div>
              <Calendar />
              <p className="text-center text-[10px] text-natural-secondary font-black uppercase tracking-[0.2em] opacity-40">本月尚未打卡</p>
            </div>

            {/* Wrong Records */}
            <div className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-natural-text">最近錯誤</h3>
                  <span className="bg-natural-stats text-natural-primary text-[10px] font-black px-2 py-1 rounded-lg">
                    {history.reduce((acc, curr) => acc + curr.wrongWords.length, 0)} MISSED
                  </span>
                </div>
              </div>
              
              <div className="space-y-3">
                {history.flatMap(h => h.wrongWords).slice(0, 5).map((id, idx) => {
                  const word = words.find(w => w.id === id);
                  if (!word) return null;
                  return (
                    <div key={idx} className="flex items-center justify-between p-6 bg-natural-card rounded-[28px] border border-natural-border shadow-sm">
                      <div className="flex items-baseline gap-3">
                        <p className="font-serif font-bold text-xl text-natural-text">{word.kanji}</p>
                        <p className="text-xs text-natural-secondary font-medium tracking-wide">/ {word.reading} /</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-natural-secondary font-black">×1</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="quiz"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="p-8 h-full flex flex-col pt-16"
          >
            {/* Quiz Header */}
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-natural-primary/10 rounded-lg flex items-center justify-center text-natural-primary font-black text-xs">
                  {currentIndex + 1}
                </div>
                <div className="h-1 w-32 bg-natural-border rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentIndex + 1) / quizWords.length) * 100}%` }}
                    className="h-full bg-natural-primary"
                  />
                </div>
              </div>
              <button onClick={() => setIsStarted(false)} className="text-natural-secondary/40 hover:text-natural-secondary transition-colors">
                <RotateCcw size={20} />
              </button>
            </div>

            {/* Question */}
            <div className="flex-1 flex flex-col items-center justify-center space-y-16 pb-20">
              <div className="space-y-6 text-center">
                <h3 className="text-[10px] font-black text-natural-secondary/40 uppercase tracking-[0.3em]">Question</h3>
                <h2 className="text-5xl font-serif font-bold text-natural-text leading-tight tracking-tight">
                  {settings.direction === 'jp-to-cn' ? quizWords[currentIndex].kanji : quizWords[currentIndex].meaning}
                </h2>
              </div>

              {/* Options */}
              <div className="w-full grid gap-4">
                {options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(opt)}
                    className="w-full text-left p-6 bg-natural-card border border-natural-border rounded-3xl font-bold text-natural-text hover:border-natural-primary hover:bg-natural-sidebar transition-all active:scale-98 shadow-sm flex items-center gap-4 group"
                  >
                    <div className="w-8 h-8 rounded-full border border-natural-border group-hover:bg-natural-primary group-hover:border-natural-primary group-hover:text-white flex items-center justify-center text-xs transition-all">
                      {String.fromCharCode(65 + i)}
                    </div>
                    <span className="flex-1">{opt}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result Card */}
      {resultMessage && (
        <div className="fixed inset-0 flex items-center justify-center p-8 z-[100] bg-natural-bg/80 backdrop-blur-sm">
          <div className="bg-natural-card rounded-[40px] shadow-2xl p-10 text-center space-y-8 border border-natural-border max-w-sm w-full animate-in zoom-in-95 fade-in duration-300">
            <div className="w-24 h-24 bg-natural-sidebar text-natural-primary rounded-[32px] flex items-center justify-center mx-auto border border-natural-border">
              <CheckCircle2 size={56} />
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl font-bold text-natural-text tracking-tight">測驗完成</h3>
              <p className="text-natural-secondary font-medium">{resultMessage}</p>
            </div>
            <button 
              onClick={() => { setResultMessage(null); setIsStarted(false); }}
              className="w-full py-5 bg-natural-primary text-white font-bold rounded-2xl active:scale-95 transition-all shadow-xl shadow-natural-primary/20"
            >
              確認並返還
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function SettingRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between group">
      <span className="text-gray-700 font-medium">{label}</span>
      <div className="flex items-center gap-1 text-gray-400 group-hover:text-blue-500 transition-colors cursor-pointer">
        <span className="text-sm font-bold">{value}</span>
        <ChevronRight size={16} />
      </div>
    </div>
  );
}

function ChevronRight({ size, className }: { size: number; className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function Calendar() {
  const today = new Date();
  const start = startOfMonth(today);
  const end = endOfMonth(today);
  const days = eachDayOfInterval({ start, end });
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

  return (
    <div className="bg-gray-50/50 rounded-2xl p-4">
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {weekDays.map(d => (
          <span key={d} className="text-[10px] font-bold text-gray-300 uppercase">{d}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: start.getDay() }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {days.map(day => {
          const isToday = isSameDay(day, today);
          return (
            <div 
              key={day.toString()}
              className={cn(
                "h-8 flex items-center justify-center text-xs font-bold rounded-full transition-all",
                isToday 
                  ? "bg-white text-orange-500 border-2 border-orange-400 shadow-sm shadow-orange-100" 
                  : "text-gray-400"
              )}
            >
              {format(day, 'd')}
            </div>
          );
        })}
      </div>
    </div>
  );
}
