import React from 'react';
import { motion } from 'framer-motion';

interface AncientCardProps {
  eyebrow?: string;
  title?: string;
  children: React.ReactNode;
  /** texto del botón principal; si no se pasa, no se muestra botón */
  ctaLabel?: string;
  onCta?: () => void;
  /** deshabilita el CTA (p.ej. mientras corre algo) */
  ctaDisabled?: boolean;
}

/** Tarjeta de pergamino antiguo reutilizable */
export function AncientCard({ eyebrow, title, children, ctaLabel, onCta, ctaDisabled }: AncientCardProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 py-12">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="parchment-texture relative max-w-md w-full rounded-lg shadow-2xl border-2 border-vintage-gold px-8 py-10"
        style={{
          background: 'linear-gradient(135deg, #f4e4bc 0%, #e8d2a0 100%)',
        }}
      >
        {/* esquinas decorativas */}
        <span className="absolute top-2 left-2 text-vintage-gold/50 text-lg">✦</span>
        <span className="absolute top-2 right-2 text-vintage-gold/50 text-lg">✦</span>
        <span className="absolute bottom-2 left-2 text-vintage-gold/50 text-lg">✦</span>
        <span className="absolute bottom-2 right-2 text-vintage-gold/50 text-lg">✦</span>

        {eyebrow && (
          <p className="text-center text-[#8a6d3b] font-serif uppercase tracking-[0.35em] text-xs font-bold mb-3">
            {eyebrow}
          </p>
        )}
        {title && (
          <h2 className="text-center text-[#3d2b1f] font-serif text-2xl font-bold mb-6 leading-snug">
            {title}
          </h2>
        )}

        <div className="text-[#4a3826] font-serif text-base leading-relaxed space-y-4 text-center">
          {children}
        </div>

        {ctaLabel && onCta && (
          <motion.button
            whileHover={{ scale: ctaDisabled ? 1 : 1.04 }}
            whileTap={{ scale: ctaDisabled ? 1 : 0.97 }}
            onClick={onCta}
            disabled={ctaDisabled}
            className="mt-8 w-full bg-[#3d2b1f] text-[#f4e4bc] py-3.5 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-[#54392a] transition-colors disabled:opacity-50"
          >
            {ctaLabel}
          </motion.button>
        )}
      </motion.div>
    </div>
  );
}
