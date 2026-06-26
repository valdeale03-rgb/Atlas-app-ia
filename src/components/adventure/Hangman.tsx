import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const WORD = 'CAMPANARIO';
const MAX_ERRORS = 6;

const KEYBOARD_ROWS = [
  ['Q','W','E','R','T','Y','U','I','O','P'],
  ['A','S','D','F','G','H','J','K','L','Ñ'],
  ['Z','X','C','V','B','N','M'],
];

interface HangmanProps {
  onWin: () => void;
}

export function Hangman({ onWin }: HangmanProps) {
  const [guessed, setGuessed] = useState<Set<string>>(new Set());
  const [won, setWon] = useState(false);

  const errors = [...guessed].filter(l => !WORD.includes(l)).length;
  const isLost = errors >= MAX_ERRORS;
  const wordRevealed = WORD.split('').every(l => guessed.has(l));

  function guess(letter: string) {
    if (guessed.has(letter) || won || isLost) return;
    const next = new Set(guessed).add(letter);
    setGuessed(next);
    const newErrors = [...next].filter(l => !WORD.includes(l)).length;
    const nowWon = WORD.split('').every(l => next.has(l));
    if (nowWon && newErrors <= MAX_ERRORS) {
      setWon(true);
      setTimeout(onWin, 1800);
    }
  }

  return (
    <div className="min-h-screen bg-[#1a1612] flex flex-col items-center justify-center px-3 py-8 w-full max-w-lg mx-auto">
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
        <p className="text-[#8b7355] font-serif text-xs sm:text-sm uppercase tracking-[0.3em] mb-1">Primera prueba</p>
        <h1 className="text-[#c9a84c] font-serif text-2xl sm:text-3xl font-bold">Descifra la palabra</h1>
      </motion.div>

      {/* Gallows SVG */}
      <HangmanDrawing errors={errors} />

      {/* Lives */}
      <div className="flex gap-1.5 mb-8">
        {Array.from({ length: MAX_ERRORS }).map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full border transition-all duration-300 ${
              i < errors ? 'bg-red-600 border-red-700' : 'bg-transparent border-[#c9a84c]/40'
            }`}
          />
        ))}
      </div>

      {/* Word blanks */}
      <div className="flex gap-1 sm:gap-2 mb-8 flex-wrap justify-center px-1">
        {WORD.split('').map((letter, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex flex-col items-center"
          >
            <AnimatePresence>
              {guessed.has(letter) ? (
                <motion.span
                  key="letter"
                  initial={{ opacity: 0, scale: 0.5, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="text-[#c9a84c] text-xl sm:text-2xl font-bold font-serif w-6 sm:w-8 text-center"
                >
                  {letter}
                </motion.span>
              ) : (
                <span className="text-transparent text-xl sm:text-2xl font-bold w-6 sm:w-8 text-center select-none">_</span>
              )}
            </AnimatePresence>
            <div className="w-6 sm:w-8 h-0.5 bg-[#c9a84c]/50 mt-1" />
          </motion.div>
        ))}
      </div>

      {/* Win / lose message */}
      <AnimatePresence>
        {won && (
          <motion.p
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-green-400 font-serif text-lg mb-6 text-center"
          >
            ¡Palabra encontrada! 🗺️
          </motion.p>
        )}
        {isLost && !wordRevealed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-6">
            <p className="text-red-400 font-serif mb-3">La expedición ha fallado...</p>
            <button
              onClick={() => setGuessed(new Set())}
              className="text-[#c9a84c] border border-[#c9a84c]/40 rounded-full px-5 py-2 text-sm hover:bg-[#c9a84c]/10 transition-colors"
            >
              Intentar de nuevo
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyboard */}
      <div className="space-y-1.5 sm:space-y-2 w-full px-1">
        {KEYBOARD_ROWS.map((row, ri) => (
          <div key={ri} className="flex gap-1 sm:gap-1.5 justify-center">
            {row.map(letter => {
              const isGuessed = guessed.has(letter);
              const isCorrect = isGuessed && WORD.includes(letter);
              const isWrong = isGuessed && !WORD.includes(letter);
              return (
                <button
                  key={letter}
                  onClick={() => guess(letter)}
                  disabled={isGuessed || won || isLost}
                  className={`flex-1 max-w-[2.5rem] aspect-square sm:aspect-auto sm:h-10 rounded-md sm:rounded-lg text-xs sm:text-sm font-bold font-serif transition-all duration-200 ${
                    isCorrect ? 'bg-[#c9a84c] text-[#1a1612]' :
                    isWrong ? 'bg-[#3a1a1a] text-red-800 opacity-40' :
                    'bg-[#2a2218] text-[#e8d5a3] hover:bg-[#3a3020] border border-[#c9a84c]/20 hover:border-[#c9a84c]/60'
                  } disabled:cursor-default`}
                >
                  {letter}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function HangmanDrawing({ errors }: { errors: number }) {
  return (
    <svg width="140" height="150" viewBox="0 0 140 150" className="mb-4">
      {/* Base */}
      <line x1="20" y1="140" x2="120" y2="140" stroke="#c9a84c" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
      {/* Pole */}
      <motion.line x1="60" y1="140" x2="60" y2="10" stroke="#c9a84c" strokeWidth="3" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: errors >= 1 ? 1 : 0 }} transition={{ duration: 0.3 }} />
      {/* Top beam */}
      <motion.line x1="60" y1="10" x2="100" y2="10" stroke="#c9a84c" strokeWidth="3" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: errors >= 2 ? 1 : 0 }} transition={{ duration: 0.3 }} />
      {/* Rope */}
      <motion.line x1="100" y1="10" x2="100" y2="35" stroke="#c9a84c" strokeWidth="2" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: errors >= 3 ? 1 : 0 }} transition={{ duration: 0.3 }} />
      {/* Head */}
      <motion.circle cx="100" cy="45" r="12" fill="none" stroke="#e8d5a3" strokeWidth="2.5"
        initial={{ scale: 0, opacity: 0 }} animate={{ scale: errors >= 4 ? 1 : 0, opacity: errors >= 4 ? 1 : 0 }}
        style={{ transformOrigin: '100px 45px' }} transition={{ duration: 0.3 }} />
      {/* Body */}
      <motion.line x1="100" y1="57" x2="100" y2="95" stroke="#e8d5a3" strokeWidth="2.5" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: errors >= 5 ? 1 : 0 }} transition={{ duration: 0.3 }} />
      {/* Arms + Legs */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: errors >= 6 ? 1 : 0 }} transition={{ duration: 0.3 }}>
        <line x1="100" y1="68" x2="82" y2="82" stroke="#e8d5a3" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="100" y1="68" x2="118" y2="82" stroke="#e8d5a3" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="100" y1="95" x2="84" y2="115" stroke="#e8d5a3" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="100" y1="95" x2="116" y2="115" stroke="#e8d5a3" strokeWidth="2.5" strokeLinecap="round" />
      </motion.g>
    </svg>
  );
}
