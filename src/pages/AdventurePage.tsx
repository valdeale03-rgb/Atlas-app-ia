import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useAppContext } from '../context/AppContext';
import Trunk from '../components/adventure/Trunk';
import ScratchCard from '../components/adventure/ScratchCard';

const AdventurePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { adventures, completeAdventure } = useAppContext();
  const adventure = adventures.find(a => a.id === id);

  const [stage, setStage] = useState<'trunk' | 'scratch' | 'reveal' | 'final'>(
    adventure?.status === 'completed' ? 'reveal' : 'trunk'
  );
  const [showButton, setShowButton] = useState(adventure?.status === 'completed');

  if (!adventure) return <div className="text-white p-10">Exploración extraviada...</div>;

  const handleUnlock = () => {
    setStage('scratch');
  };

  const handleScratchComplete = () => {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({ particleCount: 2, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#c5a059', '#f4e4bc', '#ffffff'] });
      confetti({ particleCount: 2, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#c5a059', '#f4e4bc', '#ffffff'] });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();

    if ('vibrate' in navigator) navigator.vibrate([100, 50, 100]);

    completeAdventure(adventure.id);

    setTimeout(() => {
      setStage('reveal');
      setTimeout(() => setShowButton(true), 1500);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#1a1612] text-vintage-ink overflow-auto pb-20 relative">
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 text-parchment/40 hover:text-vintage-gold flex items-center gap-2 font-serif uppercase tracking-widest text-xs z-50 transition-colors"
      >
        ← Volver al Pasaporte
      </button>

      <AnimatePresence mode="wait">
        {stage === 'trunk' && (
          <motion.div key="trunk" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
            <Trunk correctPassword={adventure.password || 'libertad'} onUnlock={handleUnlock} />
          </motion.div>
        )}

        {stage === 'scratch' && (
          <motion.div
            key="scratch"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center min-h-screen pt-10"
          >
            <div className="parchment-texture p-4 rounded-xl shadow-2xl border-8 border-vintage-gold mb-8 max-w-[95vw]">
              <ScratchCard
                image={adventure.image}
                onComplete={handleScratchComplete}
                width={window.innerWidth > 600 ? 500 : window.innerWidth - 60}
                height={window.innerWidth > 600 ? 650 : 500}
              />
            </div>
            <p className="text-vintage-gold font-handwriting text-2xl animate-pulse">
              Raspa para descubrir el tesoro...
            </p>
          </motion.div>
        )}

        {(stage === 'reveal' || stage === 'final') && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center min-h-screen p-6 text-center"
          >
            <div className="parchment-texture max-w-2xl p-10 rounded-lg shadow-2xl border-2 border-vintage-gold relative">
              <div className="absolute -top-6 -right-6 w-20 h-20 bg-red-800 rounded-full flex items-center justify-center shadow-lg border-4 border-red-900 rotate-12">
                <span className="text-white font-bold text-4xl">{adventure.title[0]}</span>
              </div>

              <motion.div
                initial={{ opacity: adventure.status === 'completed' ? 1 : 0, y: adventure.status === 'completed' ? 0 : 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <p className="font-handwriting text-3xl mb-8 leading-relaxed">"{adventure.message}"</p>
              </motion.div>

              <motion.div
                initial={{ opacity: adventure.status === 'completed' ? 1 : 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="mb-8"
              >
                <h3 className="text-vintage-gold uppercase tracking-[0.3em] font-serif mb-2">
                  {adventure.status === 'completed' ? 'Expedición Completada' : 'Último capítulo desbloqueado'}
                </h3>
                <h2 className="text-5xl font-serif font-bold text-vintage-ink mb-2 uppercase">{adventure.location}</h2>
                <p className="italic text-vintage-ink opacity-70">Revelado el {adventure.date}</p>
              </motion.div>

              {showButton && stage !== 'final' && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setStage('final')}
                  className="mt-8 bg-vintage-ink text-parchment px-8 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-[#3d2b1f] transition-colors"
                >
                  Ver Reflexión Final
                </motion.button>
              )}

              {stage === 'final' && (
                <motion.div
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  className="mt-12 pt-8 border-t-2 border-vintage-gold/30 origin-top"
                >
                  <p className="font-handwriting text-2xl leading-loose">
                    "Cada paso en esta aventura ha sido una victoria.<br />
                    La Ciudad Blanca guarda nuestros secretos...<br />
                    pero nuestro Atlas apenas comienza.<br />
                    <span className="text-vintage-gold-dark font-bold text-3xl mt-4 block">Tesoro encontrado.</span>"
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdventurePage;
