import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

interface CodeEntryProps {
  correctCode: string;
  onUnlock: () => void;
}

export function CodeEntry({ correctCode, onUnlock }: CodeEntryProps) {
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (value.trim() === correctCode) {
      onUnlock();
    } else {
      setError(true);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm text-center"
      >
        <motion.div
          animate={{ rotate: [0, -8, 8, -8, 0] }}
          transition={{ repeat: Infinity, duration: 3, repeatDelay: 2 }}
        >
          <Lock className="text-[#c9a84c] mx-auto mb-6" size={48} />
        </motion.div>

        <p className="text-[#8b7355] font-serif uppercase tracking-[0.3em] text-xs mb-4">Última prueba</p>
        <p className="text-[#e8d5a3] font-serif text-lg leading-relaxed mb-2">
          Hay criaturas que custodian secretos.
        </p>
        <p className="text-[#e8d5a3] font-serif text-lg leading-relaxed mb-8">
          Las tres ranas te confiaron uno.
        </p>
        <h2 className="text-[#c9a84c] font-serif text-xl font-bold mb-6">
          Ingresa el código secreto
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            inputMode="numeric"
            value={value}
            onChange={e => { setValue(e.target.value); setError(false); }}
            placeholder="••••••"
            autoFocus
            maxLength={6}
            className={`w-full bg-[#2a2218] border rounded-xl px-4 py-4 text-[#e8d5a3] placeholder-[#5a4a3a] text-center text-3xl tracking-[0.4em] font-mono focus:outline-none transition-colors ${
              error ? 'border-red-500' : 'border-[#c9a84c]/40 focus:border-[#c9a84c]'
            }`}
          />
          {error && <p className="text-red-400 text-sm">Código incorrecto. Inténtalo de nuevo.</p>}
          <button
            type="submit"
            className="w-full bg-[#c9a84c] text-[#1a1612] rounded-xl py-3.5 font-bold uppercase tracking-widest text-sm hover:bg-[#e8d5a3] transition-colors"
          >
            Desbloquear
          </button>
        </form>
      </motion.div>
    </div>
  );
}
