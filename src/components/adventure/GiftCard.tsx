import { motion } from 'framer-motion';
import { Sprout } from 'lucide-react';

interface GiftCardProps {
  onCta: () => void;
  ctaLabel: string;
}

export function GiftCard({ onCta, ctaLabel }: GiftCardProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 py-12 gap-8">
      <motion.div
        initial={{ opacity: 0, rotateY: 90 }}
        animate={{ opacity: 1, rotateY: 0 }}
        transition={{ duration: 0.7, type: 'spring' }}
        className="relative max-w-sm w-full rounded-2xl shadow-2xl border-4 border-double border-[#c9a84c] px-8 py-12 text-center"
        style={{ background: 'linear-gradient(135deg, #1f3d2a 0%, #14271c 100%)' }}
      >
        <span className="absolute top-3 left-3 text-[#c9a84c]/40 text-xl">❧</span>
        <span className="absolute top-3 right-3 text-[#c9a84c]/40 text-xl">❧</span>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
        >
          <Sprout className="text-[#7bc47f] mx-auto mb-5" size={56} />
        </motion.div>

        <p className="text-[#9fce9f] font-serif uppercase tracking-[0.3em] text-xs mb-4">Vale de regalo</p>

        <p className="text-[#e8d5a3] font-serif text-2xl font-bold leading-snug mb-2">
          Vale por una plantita
        </p>
        <p className="text-[#9fce9f] font-serif text-lg mb-8">
          en el vivero más cercano 🌱
        </p>

        <div className="border-t border-[#c9a84c]/30 pt-6">
          <p className="text-[#7a9a7a] font-serif text-sm italic">
            "Quiero verlo crecer con nosotros."
          </p>
        </div>
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        onClick={onCta}
        className="bg-[#c9a84c] text-[#14271c] px-8 py-3.5 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-[#e8d5a3] transition-colors"
      >
        {ctaLabel}
      </motion.button>
    </div>
  );
}
