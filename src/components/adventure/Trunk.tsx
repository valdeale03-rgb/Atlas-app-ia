import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Unlock } from 'lucide-react';

interface TrunkProps {
  onUnlock: () => void;
  correctPassword: string;
}

const Trunk: React.FC<TrunkProps> = ({ onUnlock, correctPassword }) => {
  const [password, setPassword] = useState('');
  const [isError, setIsError] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === correctPassword) {
      setIsError(false);
      setIsOpening(true);
      setTimeout(onUnlock, 1500); // Wait for open animation
    } else {
      setIsError(true);
      setTimeout(() => setIsError(false), 500);
      setPassword('');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <motion.div 
        animate={isError ? { x: [-10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-md aspect-video mb-8"
      >
        {/* Trunk Visual Representation */}
        <div className="relative w-full h-full bg-[#3d2b1f] rounded-t-3xl border-x-8 border-t-8 border-[#2a1d15] shadow-2xl overflow-hidden">
          {/* Metal bands */}
          <div className="absolute left-8 top-0 w-4 h-full bg-[#8c6d31] shadow-inner opacity-80" />
          <div className="absolute right-8 top-0 w-4 h-full bg-[#8c6d31] shadow-inner opacity-80" />
          
          {/* Lock area */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-20 bg-[#c5a059] rounded-lg border-2 border-[#8c6d31] flex items-center justify-center shadow-lg">
             {isOpening ? <Unlock className="text-[#3d2b1f] w-8 h-8" /> : <Lock className="text-[#3d2b1f] w-8 h-8" />}
          </div>

          <motion.div 
            animate={isOpening ? { y: -200, rotateX: -90 } : {}}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 bg-[#4d3626] origin-top z-10 border-b-4 border-[#2a1d15]"
          >
            {/* Trunk Lid Top Details */}
            <div className="absolute left-8 top-10 w-4 h-8 bg-[#8c6d31] opacity-50" />
            <div className="absolute right-8 top-10 w-4 h-8 bg-[#8c6d31] opacity-50" />
          </motion.div>
        </div>
        
        {/* Trunk Bottom */}
        <div className="w-full h-8 bg-[#2a1d15] rounded-b-xl" />
      </motion.div>

      <motion.form 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="w-full max-w-sm"
      >
        <div className="parchment-texture p-6 rounded-lg shadow-xl border-2 border-vintage-gold relative">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-vintage-gold text-vintage-ink px-4 py-1 rounded-full text-sm font-bold uppercase tracking-widest border-2 border-vintage-gold-dark">
            Baúl de Recuerdos
          </div>
          
          <p className="text-center mb-6 font-serif italic text-vintage-ink text-lg">
            Introduce la contraseña para abrir el baúl de "La Ruta del Dorado"
          </p>
          
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="......"
            className="w-full text-center text-3xl tracking-[1em] py-3 bg-white/30 border-2 border-vintage-gold/30 rounded focus:border-vintage-gold outline-none text-vintage-ink placeholder:text-vintage-ink/20 mb-4 font-bold"
            autoFocus
          />
          
          <button 
            type="submit"
            className="w-full bg-vintage-gold hover:bg-vintage-gold-dark text-white font-bold py-3 rounded-lg shadow-lg transition-colors duration-300 flex items-center justify-center gap-2 uppercase tracking-widest"
          >
            Abrir Aventura
          </button>
        </div>
      </motion.form>

      <div className="mt-12 flex gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-vintage-gold opacity-20" />
          <div className="w-12 h-12 rounded-full border-2 border-vintage-gold opacity-30" />
          <div className="w-12 h-12 rounded-full border-2 border-vintage-gold opacity-20" />
      </div>
    </div>
  );
};

export default Trunk;
