import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import type { Adventure } from '../../types/adventure';

interface AdminPanelProps {
  onAdd: (adventure: Omit<Adventure, 'id'>) => void;
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onAdd, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: new Date().toLocaleDateString(),
    location: '',
    password: '',
    message: '',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470' // Default placeholder
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      ...formData,
      status: 'locked'
    });
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="parchment-texture w-full max-w-lg rounded-xl shadow-2xl p-8 border-4 border-vintage-gold relative max-h-[90vh] overflow-y-auto"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-vintage-ink hover:text-red-900 transition-colors">
          <X size={32} />
        </button>

        <h2 className="text-3xl font-serif font-bold mb-6 text-center border-b-2 border-vintage-gold/30 pb-2">Nueva Expedición</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold uppercase tracking-widest mb-1">Título de la Aventura</label>
            <input
              required
              type="text"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-white/50 border-2 border-vintage-gold/20 p-2 rounded focus:border-vintage-gold outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold uppercase tracking-widest mb-1">Fecha</label>
              <input
                required
                type="text"
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
                className="w-full bg-white/50 border-2 border-vintage-gold/20 p-2 rounded focus:border-vintage-gold outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold uppercase tracking-widest mb-1">Contraseña</label>
              <input
                required
                type="text"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-white/50 border-2 border-vintage-gold/20 p-2 rounded focus:border-vintage-gold outline-none"
              />
            </div>
          </div>

          <div>
             <label className="block text-sm font-bold uppercase tracking-widest mb-1">Lugar / Recompensa</label>
             <input
               required
               type="text"
               value={formData.location}
               onChange={e => setFormData({ ...formData, location: e.target.value })}
               className="w-full bg-white/50 border-2 border-vintage-gold/20 p-2 rounded focus:border-vintage-gold outline-none"
             />
          </div>

          <div>
            <label className="block text-sm font-bold uppercase tracking-widest mb-1">Mensaje de Revelación</label>
            <textarea
              required
              rows={3}
              value={formData.message}
              onChange={e => setFormData({ ...formData, message: e.target.value })}
              className="w-full bg-white/50 border-2 border-vintage-gold/20 p-2 rounded focus:border-vintage-gold outline-none italic font-serif"
            />
          </div>

          <div>
             <label className="block text-sm font-bold uppercase tracking-widest mb-1">URL de Imagen (Public o Unsplash)</label>
             <input
               type="text"
               value={formData.image}
               onChange={e => setFormData({ ...formData, image: e.target.value })}
               className="w-full bg-white/50 border-2 border-vintage-gold/20 p-2 rounded focus:border-vintage-gold outline-none text-xs"
             />
          </div>

          <button
            type="submit"
            className="w-full bg-vintage-gold hover:bg-vintage-gold-dark text-white font-bold py-3 mt-4 rounded-lg shadow-lg flex items-center justify-center gap-2 uppercase tracking-tighter transition-all"
          >
            <Plus size={20} /> Sellar Pasaporte
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AdminPanel;
