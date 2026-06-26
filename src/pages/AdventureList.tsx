import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Settings, BookOpen, BarChart2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import PassportStamp from '../components/common/PassportStamp';
import AdminPanel from '../components/admin/AdminPanel';

const AdventureList: React.FC = () => {
  const { adventures, addAdventure } = useAppContext();
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#1a1612] py-12 px-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 border-8 border-vintage-gold rounded-full rotate-12" />
        <div className="absolute bottom-20 right-20 w-96 h-96 border-4 border-vintage-gold rounded-full -rotate-12" />
      </div>

      <header className="max-w-6xl mx-auto mb-16 text-center relative z-10">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center justify-center gap-4 mb-4"
        >
          <BookOpen className="text-vintage-gold w-10 h-10" />
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-parchment tracking-tighter">Atlas</h1>
        </motion.div>
        <p className="font-handwriting text-2xl text-parchment/60">Nuestro Pasaporte de Aventuras</p>

        {/* Dashboard button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          onClick={() => navigate('/dashboard')}
          className="mt-6 inline-flex items-center gap-2 text-[#8b7355] hover:text-[#c9a84c] transition-colors text-sm font-serif border border-[#8b7355]/30 hover:border-[#c9a84c]/50 rounded-full px-4 py-1.5"
        >
          <BarChart2 size={14} /> Ver nuestro progreso
        </motion.button>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 place-items-center relative z-10">
        {adventures.map((adventure, index) => (
          <motion.div
            key={adventure.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <PassportStamp
              adventure={adventure}
              onClick={() => navigate(`/adventure/${adventure.id}`)}
            />
          </motion.div>
        ))}

        <motion.div
          whileHover={{ scale: 1.05 }}
          onClick={() => setIsAdminOpen(true)}
          className="w-48 h-48 md:w-56 md:h-56 border-4 border-dashed border-parchment/20 rounded-full flex flex-col items-center justify-center text-parchment/30 hover:border-vintage-gold hover:text-vintage-gold transition-all cursor-pointer group"
        >
          <Settings className="w-12 h-12 mb-2 group-hover:rotate-90 transition-transform duration-500" />
          <span className="font-serif uppercase tracking-[0.2em] text-xs font-bold">Añadir Sello</span>
        </motion.div>
      </main>

      {isAdminOpen && (
        <AdminPanel onAdd={addAdventure} onClose={() => setIsAdminOpen(false)} />
      )}

      <footer className="mt-20 text-center text-parchment/20 font-serif text-sm uppercase tracking-widest">
        &copy; {new Date().getFullYear()} Expedición "Atlas" • Reservado para Exploradores
      </footer>
    </div>
  );
};

export default AdventureList;
