import React from 'react';
import { motion } from 'framer-motion';
import type { Adventure } from '../../types/adventure';

interface PassportStampProps {
  adventure: Adventure;
  onClick: () => void;
}

const PassportStamp: React.FC<PassportStampProps> = ({ adventure, onClick }) => {
  const isCompleted = adventure.status === 'completed';

  return (
    <motion.div
      whileHover={{ scale: 1.05, rotate: 2 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="cursor-pointer group"
    >
      <div className="relative w-48 h-48 md:w-56 md:h-56">
        {/* Stamp Border */}
        <div className={`absolute inset-0 rounded-full border-4 border-dashed transition-colors duration-500 ${isCompleted ? 'border-vintage-gold' : 'border-vintage-ink/30'}`} />
        
        {/* Stamp Content Container */}
        <div className="absolute inset-4 rounded-full overflow-hidden shadow-inner bg-parchment/50 backdrop-blur-sm">
          <img
            src={adventure.image}
            alt={adventure.title}
            className={`w-full h-full object-cover transition-all duration-700 ${isCompleted ? 'grayscale-0 scale-100' : 'grayscale brightness-75 scale-110 blur-[1px]'}`}
          />
          
          {/* Overlay for Locked style */}
          {!isCompleted && (
            <div className="absolute inset-0 bg-vintage-ink/10 flex items-center justify-center">
               {/* Optional Lock icon could go here */}
            </div>
          )}
        </div>

        {/* Ink Stamp Effect (Date and Title) */}
        <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-max px-4 py-1 rounded bg-[#1a1612]/80 backdrop-blur-xs text-parchment text-xs font-serif uppercase tracking-widest border border-vintage-gold/50 shadow-lg transform -rotate-2 group-hover:rotate-0 transition-transform`}>
          {adventure.title}
        </div>
        
        {/* Date on the stamp */}
        <div className="absolute top-4 right-4 bg-red-900/80 text-white text-[10px] px-2 py-0.5 rounded-sm transform rotate-45 font-bold shadow-sm">
           {adventure.date}
        </div>
      </div>
    </motion.div>
  );
};

export default PassportStamp;
