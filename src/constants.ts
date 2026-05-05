import { Word } from './types';

export const INITIAL_WORDS: Word[] = [
  {
    id: '1',
    kanji: 'たまわる',
    reading: '賜わる',
    meaning: '賞賜、賜予、允許、授予',
    type: 'v.',
    familiarity: 'new',
    synonyms: ['授ける', '与える'],
    antonyms: [],
    examples: [
      { original: 'ご意見をたまわりたい。', translation: '希望能聽取您的意見。' }
    ],
    notes: '常用於正式場合。',
    createdAt: Date.now()
  },
  {
    id: '2',
    kanji: 'はいぞく',
    reading: '配属',
    meaning: '分配、任務、附著',
    type: 'n./v.',
    familiarity: 'learning',
    synonyms: ['配置'],
    antonyms: [],
    examples: [
      { original: '営業部に配属される。', translation: '被分配到營業部。' }
    ],
    notes: '職場常用語。',
    createdAt: Date.now()
  },
  {
    id: '3',
    kanji: 'いぶかしい',
    reading: '訝しい',
    meaning: '可疑的、奇怪的、覺得不對勁',
    type: 'adj.',
    familiarity: 'known',
    synonyms: ['疑わしい'],
    antonyms: [],
    examples: [
      { original: '彼は訝しい顔をした。', translation: '他露出懷疑的面孔。' }
    ],
    notes: '形容心裡的懷疑感。',
    createdAt: Date.now()
  }
];
