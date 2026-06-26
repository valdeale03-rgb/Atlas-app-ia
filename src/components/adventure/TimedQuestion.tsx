import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

interface TimedQuestionProps {
  question: string;
  /** respuestas válidas (se comparan en minúsculas, sin acentos ni espacios extra) */
  answers: string[];
  seconds?: number;
  onCorrect: () => void;
  /** si true, no ocupa toda la pantalla (para mostrar debajo de otra tarjeta) */
  embedded?: boolean;
}

const ACCENTS = new RegExp('[\\u0300-\\u036f]', 'g');

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(ACCENTS, '') // quitar acentos
    .replace(/\s+/g, ' ')
    .trim();
}

export function TimedQuestion({ question, answers, seconds = 40, onCorrect, embedded = false }: TimedQuestionProps) {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const [value, setValue] = useState('');
  const [feedback, setFeedback] = useState<'none' | 'wrong' | 'timeout'>('none');
  const [solved, setSolved] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    startTimer();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  function startTimer() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimeLeft(seconds);
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setFeedback('timeout');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (solved) return;
    const normalized = normalize(value);
    const correct = answers.some(a => normalize(a) === normalized);
    if (correct) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setSolved(true);
      setTimeout(onCorrect, 800);
    } else {
      setFeedback('wrong');
    }
  }

  function retry() {
    setFeedback('none');
    setValue('');
    startTimer();
  }

  const isTimeout = feedback === 'timeout';
  const danger = timeLeft <= 10;

  return (
    <div className={`flex flex-col items-center justify-center px-5 ${embedded ? 'py-2' : 'min-h-screen py-12'}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md text-center"
      >
        {/* Timer */}
        <motion.div
          animate={danger && !solved && !isTimeout ? { scale: [1, 1.12, 1] } : {}}
          transition={{ repeat: Infinity, duration: 0.8 }}
          className={`inline-flex items-center gap-2 mb-8 px-5 py-2 rounded-full border font-mono text-2xl font-bold ${
            danger ? 'border-red-500 text-red-400' : 'border-[#c9a84c]/50 text-[#c9a84c]'
          }`}
        >
          <Clock size={22} />
          {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:{String(timeLeft % 60).padStart(2, '0')}
        </motion.div>

        <h2 className="text-[#e8d5a3] font-serif text-2xl font-bold mb-8 leading-snug">
          {question}
        </h2>

        {solved ? (
          <motion.p initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-green-400 font-serif text-xl">
            ¡Correcto! 🧭
          </motion.p>
        ) : isTimeout ? (
          <div>
            <p className="text-red-400 font-serif mb-4">⏱ ¡Se acabó el tiempo!</p>
            <button
              onClick={retry}
              className="bg-[#c9a84c] text-[#1a1612] px-6 py-3 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-[#e8d5a3] transition-colors"
            >
              Intentar de nuevo
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={value}
              onChange={e => { setValue(e.target.value); setFeedback('none'); }}
              placeholder="Escribe tu respuesta..."
              autoFocus
              className="w-full bg-[#2a2218] border border-[#c9a84c]/40 rounded-xl px-4 py-4 text-[#e8d5a3] placeholder-[#5a4a3a] text-center text-lg focus:outline-none focus:border-[#c9a84c]"
            />
            {feedback === 'wrong' && (
              <p className="text-red-400 text-sm">Esa no es... piensa en el corazón de la ciudad.</p>
            )}
            <button
              type="submit"
              className="w-full bg-[#c9a84c] text-[#1a1612] rounded-xl py-3.5 font-bold uppercase tracking-widest text-sm hover:bg-[#e8d5a3] transition-colors"
            >
              Responder
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
