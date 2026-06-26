import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Compass, MapPin } from 'lucide-react';
import { Hangman } from '../components/adventure/Hangman';
import ScratchCard from '../components/adventure/ScratchCard';
import { AncientCard } from '../components/adventure/AncientCard';
import { TimedQuestion } from '../components/adventure/TimedQuestion';
import { GiftCard } from '../components/adventure/GiftCard';
import { CodeEntry } from '../components/adventure/CodeEntry';

type Stage =
  | 'hangman'
  | 'startMessage'    // "Empieza la aventura, pídele tu primera prueba"
  | 'prueba1'         // tarjeta: reúne 8 monedas
  | 'prueba1Done'     // tarjeta: prueba 1 superada + pregunta con timer (bajo la tarjeta)
  | 'questionDone'    // "Bien hecho, dile a tu guía..."
  | 'prueba2'         // tarjeta: deja evidencia / cronistas
  | 'prueba3'         // tarjeta: adopta un guardián verde
  | 'gift'            // vale de regalo plantita
  | 'code'            // ingresar código 080121
  | 'scratch'         // raspar imagen destino final
  | 'final';          // reveal DIZI

export function RutaDelDorado() {
  const [stage, setStage] = useState<Stage>('hangman');
  const [showReveal, setShowReveal] = useState(false);

  function fireConfetti() {
    const duration = 4000;
    const end = Date.now() + duration;
    const frame = () => {
      confetti({ particleCount: 3, angle: 60, spread: 60, origin: { x: 0 }, colors: ['#c5a059', '#f4e4bc', '#fff'] });
      confetti({ particleCount: 3, angle: 120, spread: 60, origin: { x: 1 }, colors: ['#c5a059', '#f4e4bc', '#fff'] });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    confetti({ particleCount: 120, spread: 90, origin: { y: 0.5 }, colors: ['#c5a059', '#f4e4bc', '#fff', '#e8d5a3'] });
    frame();
    if ('vibrate' in navigator) navigator.vibrate([200, 100, 200, 100, 400]);
  }

  function handleScratchComplete() {
    fireConfetti();
    setShowReveal(true);
    setTimeout(() => setStage('final'), 5000);
  }

  return (
    <div className="min-h-screen bg-[#1a1612]">
      <AnimatePresence mode="wait">

        {/* 1 — Ahorcado */}
        {stage === 'hangman' && (
          <motion.div key="hangman" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -40 }}>
            <Hangman onWin={() => setStage('startMessage')} />
          </motion.div>
        )}

        {/* 2 — Empieza la aventura */}
        {stage === 'startMessage' && (
          <motion.div
            key="startMessage"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -40 }}
            className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
          >
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }} className="mb-8"
            >
              <Compass className="text-[#c9a84c] mx-auto mb-4" size={56} />
            </motion.div>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="text-[#8b7355] font-serif uppercase tracking-[0.3em] text-sm mb-4">
              ¡Campanario desbloqueado!
            </motion.p>
            <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              className="text-[#e8d5a3] font-serif text-3xl md:text-4xl font-bold leading-tight mb-6">
              Empieza la aventura
            </motion.h2>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
              className="bg-[#2a2218] border border-[#c9a84c]/30 rounded-2xl px-6 sm:px-8 py-6 max-w-sm mb-12">
              <p className="text-[#c9a84c] font-serif text-lg sm:text-xl leading-relaxed">
                Pídele a tu guía que aliste<br /><span className="font-bold">su caballito metálico.</span> 🏍️
              </p>
            </motion.div>
            <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              onClick={() => setStage('prueba1')}
              className="text-[#5a4a3a] hover:text-[#8b7355] text-sm font-serif border border-[#5a4a3a]/30 rounded-full px-6 py-2 transition-colors">
              Ya estoy en Campanario →
            </motion.button>
          </motion.div>
        )}

        {/* 3 — PRIMERA PRUEBA: 8 monedas */}
        {stage === 'prueba1' && (
          <motion.div key="prueba1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -40 }}>
            <AncientCard
              eyebrow="Primera prueba"
              ctaLabel="Ya completé la prueba"
              onCta={() => setStage('prueba1Done')}
            >
              <p>Los exploradores modernos ya no empuñan espadas. Hoy demuestran su destreza entre máquinas y desafíos.</p>
              <p className="font-bold text-[#3d2b1f]">
                Objetivo: Reúne 8 monedas, te servirán para reclamar una sorpresa más adelante.
              </p>
            </AncientCard>
          </motion.div>
        )}

        {/* 4 — Prueba 1 superada + pregunta debajo (timer 40s) */}
        {stage === 'prueba1Done' && (
          <Prueba1DoneCard key="prueba1Done" onCorrect={() => setStage('questionDone')} />
        )}

        {/* 5 — Bien hecho, dile a tu guía */}
        {stage === 'questionDone' && (
          <motion.div key="questionDone" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -40 }}>
            <AncientCard
              eyebrow="¡Rumbo fijado!"
              ctaLabel="Ya estoy en el lugar"
              onCta={() => setStage('prueba2')}
            >
              <p className="text-xl font-bold text-[#3d2b1f]">¡Bien hecho!</p>
              <p>Dile a tu guía de aventura que emprendan camino.</p>
            </AncientCard>
          </motion.div>
        )}

        {/* 7 — SEGUNDA PRUEBA: deja evidencia */}
        {stage === 'prueba2' && (
          <motion.div key="prueba2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -40 }}>
            <AncientCard
              eyebrow="Segunda prueba"
              ctaLabel="Ya completé la prueba, ¡siguiente!"
              onCta={() => setStage('prueba3')}
            >
              <p>Toda expedición merece ser recordada.</p>
              <p>Antes de continuar, deberás dejar evidencia de que esta aventura realmente ocurrió. Los cronistas antiguos sabrán cómo hacerlo.</p>
              <p className="text-sm italic text-[#6b5638]">PD: No olvides recargar energías con algún alimento local.</p>
              <p className="text-sm font-bold text-[#8a6d3b]">PISTA: Aguita</p>
            </AncientCard>
          </motion.div>
        )}

        {/* 8 — TERCERA PRUEBA: guardián verde */}
        {stage === 'prueba3' && (
          <motion.div key="prueba3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -40 }}>
            <AncientCard
              eyebrow="Tercera prueba"
              ctaLabel="¡Descubre la sorpresa!"
              onCta={() => setStage('gift')}
            >
              <p>Todo explorador sabe que el verdadero tesoro nunca se lleva completo.</p>
              <p>Siempre deja una parte de sí en el camino... y regresa con algo que le recuerde por qué emprendió el viaje.</p>
              <p>Entre decenas de guardianes verdes encontrarás uno muy especial.</p>
              <p className="italic">No busques el más grande.<br />No busques el más bonito.</p>
              <p>Elige aquel que te haga pensar:</p>
              <p className="font-bold text-[#3d2b1f] italic">"Quiero verlo crecer con nosotros."</p>
              <p className="font-bold text-[#3d2b1f]">Objetivo: Adopta un Guardián Verde.</p>
            </AncientCard>
          </motion.div>
        )}

        {/* 9 — Vale de regalo */}
        {stage === 'gift' && (
          <motion.div key="gift" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -40 }}>
            <GiftCard ctaLabel="¡Ir a la última prueba!" onCta={() => setStage('code')} />
          </motion.div>
        )}

        {/* 10 — Código 080121 */}
        {stage === 'code' && (
          <motion.div key="code" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -40 }}>
            <CodeEntry correctCode="080121" onUnlock={() => setStage('scratch')} />
          </motion.div>
        )}

        {/* 11 — Raspar imagen final */}
        {stage === 'scratch' && (
          <motion.div
            key="scratch" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
          >
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
              {showReveal ? (
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
                  <p className="text-[#8b7355] font-serif uppercase tracking-[0.3em] text-sm mb-2">¡Tesoro encontrado!</p>
                  <h2 className="text-[#e8d5a3] font-serif text-3xl font-bold">Aquí es 🗺️</h2>
                </motion.div>
              ) : (
                <>
                  <p className="text-[#8b7355] font-serif uppercase tracking-[0.3em] text-sm mb-2">Última prueba</p>
                  <h2 className="text-[#c9a84c] font-serif text-2xl font-bold">Raspa para revelar el destino final</h2>
                </>
              )}
            </motion.div>

            <ScratchCard
              image="/images/dizi.png"
              onComplete={handleScratchComplete}
              width={Math.min(window.innerWidth - 40, 420)}
              height={Math.min(window.innerWidth - 40, 420) * 1.33}
              revealAt={50}
            />

            {!showReveal && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                className="text-[#c9a84c] font-serif text-lg mt-6 animate-pulse">
                Raspa para descubrir el tesoro...
              </motion.p>
            )}
          </motion.div>
        )}

        {/* 12 — Reveal final DIZI */}
        {stage === 'final' && (
          <motion.div key="final" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
            <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 180, damping: 12, delay: 0.2 }} className="mb-6">
              <MapPin className="text-[#c9a84c] mx-auto" size={60} />
            </motion.div>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              className="text-[#8b7355] font-serif uppercase tracking-[0.3em] text-sm mb-3">
              Expedición completada ✦
            </motion.p>
            <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
              className="text-[#e8d5a3] font-serif text-5xl font-bold uppercase tracking-wider mb-2">
              Dizi Restobar
            </motion.h2>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
              className="text-[#c9a84c] font-serif text-xl mb-10">
              Popayán ✦ La Ciudad Blanca
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}
              className="bg-[#2a2218] border border-[#c9a84c]/30 rounded-2xl px-8 py-6 max-w-sm">
              <p className="text-[#c9a84c] font-serif text-lg italic leading-relaxed">
                "Una noche.<br />Buen sabor.<br />Tú y yo.<br />Y las estrellas de testigo."
              </p>
              <p className="text-[#8b7355] font-serif mt-4 text-sm">♡</p>
            </motion.div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}

/** Tarjeta "Prueba 1 superada" + pregunta que aparece debajo (sin que la tarjeta desaparezca) */
function Prueba1DoneCard({ onCorrect }: { onCorrect: () => void }) {
  const [showQuestion, setShowQuestion] = useState(false);

  useEffect(() => {
    // tiempo cómodo de lectura antes de mostrar la pregunta
    const t = setTimeout(() => setShowQuestion(true), 8000);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -40 }}
      className="min-h-screen flex flex-col items-center px-5 py-10 gap-8"
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative max-w-md w-full rounded-lg shadow-2xl border-2 border-vintage-gold px-8 py-10 text-center"
        style={{ background: 'linear-gradient(135deg, #f4e4bc 0%, #e8d2a0 100%)' }}
      >
        <span className="absolute top-2 left-2 text-vintage-gold/50 text-lg">✦</span>
        <span className="absolute top-2 right-2 text-vintage-gold/50 text-lg">✦</span>
        <span className="absolute bottom-2 left-2 text-vintage-gold/50 text-lg">✦</span>
        <span className="absolute bottom-2 right-2 text-vintage-gold/50 text-lg">✦</span>
        <p className="text-[#8a6d3b] font-serif uppercase tracking-[0.35em] text-xs font-bold mb-3">Prueba 1 superada ✦</p>
        <h2 className="text-[#3d2b1f] font-serif text-2xl font-bold mb-6 leading-snug">La prueba 1 ha sido superada</h2>
        <p className="text-[#4a3826] font-serif text-base leading-relaxed">
          Pero ningún explorador puede encontrar el tesoro sin visitar el corazón de la Ciudad Blanca.
          Allí, los viajeros dejan constancia de su paso.
        </p>
      </motion.div>

      {/* La pregunta aparece DEBAJO, la tarjeta sigue visible */}
      <AnimatePresence>
        {showQuestion && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="w-full"
          >
            <TimedQuestion
              question="¿A dónde nos dirigiremos ahora?"
              answers={['parque caldas', 'caldas', 'centro', 'parque']}
              seconds={40}
              embedded
              onCorrect={onCorrect}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
