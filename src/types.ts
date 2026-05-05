export type Familiarity = 'new' | 'learning' | 'known' | 'mastered';

export interface ExampleSentence {
  original: string;
  translation: string;
}

export interface Word {
  id: string;
  kanji: string;
  reading: string;
  meaning: string;
  type: string; // n., v., adj., phr.
  familiarity: Familiarity;
  synonyms: string[];
  antonyms: string[];
  examples: ExampleSentence[];
  notes: string;
  createdAt: number;
}

export type QuizType = 'multiple-choice' | 'spelling';
export type QuizDirection = 'jp-to-cn' | 'cn-to-jp';

export interface QuizSettings {
  category: string;
  familiarity: string;
  type: QuizType;
  direction: QuizDirection;
  count: number;
}

export interface QuizHistory {
  id: string;
  date: number;
  score: number;
  total: number;
  wrongWords: string[]; // word IDs
}
