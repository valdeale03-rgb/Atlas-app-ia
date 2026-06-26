import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Hangman } from '../components/adventure/Hangman';
import ScratchCard from '../components/adventure/ScratchCard';
import { Compass, MapPin } from 'lucide-react';

type Stage = 'hangman' | 'message' | 'scratch' | 'final';

export function RutaDelDorado() {
  const [stage, setStage] = useState<Stage>('hangman');

  function handleHangmanWin() {
    setStage('message');
  }

  function handleContinueToScratch() {
    setStage('scratch');
  }

  function handleScratchComplete() {
    const duration = 4000;
    const end = Date.now() + duration;
    const frame = () => {
      confetti({ particleCount: 3, angle: 60, spread: 60, origin: { x: 0 }, colors: ['#c5a059', '#f4e4bc', '#fff'] });
      confetti({ particleCount: 3, angle: 120, spread: 60, origin: { x: 1 }, colors: ['#c5a059', '#f4e4bc', '#fff'] });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
    if ('vibrate' in navigator) navigator.vibrate([200, 100, 200, 100, 400]);
    setTimeout(() => setStage('final'), 800);
  }

  return (
    <div className="min-h-screen bg-[#1a1612]">
      <AnimatePresence mode="wait">

        {/* STAGE 1: Hangman */}
        {stage === 'hangman' && (
          <motion.div key="hangman" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -40 }}>
            <Hangman onWin={handleHangmanWin} />
          </motion.div>
        )}

        {/* STAGE 2: Adventure starts message */}
        {stage === 'message' && (
          <motion.div
            key="message"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -40 }}
            className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
          >
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="mb-8"
            >
              <Compass className="text-[#c9a84c] mx-auto mb-4" size={56} />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-[#8b7355] font-serif uppercase tracking-[0.3em] text-sm mb-4"
            >
              ¡Campanario desbloqueado!
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-[#e8d5a3] font-serif text-3xl md:text-4xl font-bold leading-tight mb-6"
            >
              Empieza la aventura
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-[#2a2218] border border-[#c9a84c]/30 rounded-2xl px-8 py-6 max-w-sm mb-12"
            >
              <p className="text-[#c9a84c] font-serif text-xl leading-relaxed">
                Pídele al guía de exploración<br />
                <span className="font-bold">tu primera prueba.</span>
              </p>
            </motion.div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleContinueToScratch}
              className="text-[#5a4a3a] hover:text-[#8b7355] text-sm font-serif border border-[#5a4a3a]/30 rounded-full px-6 py-2 transition-colors"
            >
              Siguiente prueba →
            </motion.button>
          </motion.div>
        )}

        {/* STAGE 3: Scratch card */}
        {stage === 'scratch' && (
          <motion.div
            key="scratch"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <p className="text-[#8b7355] font-serif uppercase tracking-[0.3em] text-sm mb-2">Última prueba</p>
              <h2 className="text-[#c9a84c] font-serif text-2xl font-bold">Raspa para revelar el destino final</h2>
            </motion.div>

            <div className="relative">
              <ScratchCard
                image="/images/dizi.png"
                onComplete={handleScratchComplete}
                width={Math.min(window.innerWidth - 40, 420)}
                height={Math.min(window.innerWidth - 40, 420) * 1.33}
                threshold={70}
              />
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-[#c9a84c] font-serif text-lg mt-6 animate-pulse"
            >
              Raspa para descubrir el tesoro...
            </motion.p>
          </motion.div>
        )}

        {/* STAGE 4: Final reveal */}
        {stage === 'final' && (
          <motion.div
            key="final"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
          >
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 180, damping: 12, delay: 0.2 }}
              className="mb-6"
            >
              <MapPin className="text-[#c9a84c] mx-auto" size={60} />
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-[#8b7355] font-serif uppercase tracking-[0.3em] text-sm mb-3"
            >
              Expedición completada ✦
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-[#e8d5a3] font-serif text-5xl font-bold uppercase tracking-wider mb-2"
            >
              Dizi Restobar
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="text-[#c9a84c] font-serif text-xl mb-10"
            >
              Popayán ✦ La Ciudad Blanca
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="bg-[#2a2218] border border-[#c9a84c]/30 rounded-2xl px-8 py-6 max-w-sm"
            >
              <p className="text-[#c9a84c] font-serif text-lg italic leading-relaxed">
                "Una noche.<br />
                Buen sabor.<br />
                Tú y yo.<br />
                Y las estrellas de testigo."
              </p>
              <p className="text-[#8b7355] font-serif mt-4 text-sm">♡</p>
            </motion.div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
