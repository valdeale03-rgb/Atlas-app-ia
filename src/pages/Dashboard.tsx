import { motion } from 'framer-motion';
import { CheckCircle, Lock, Star, MapPin, ArrowLeft, Heart, Share2, Copy, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { StatCard } from '../components/common/StatCard';

export function Dashboard() {
  const { adventures, couple, user, logout } = useAppContext();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const completed = adventures.filter(a => a.status === 'completed');
  const locked = adventures.filter(a => a.status === 'locked');
  const total = adventures.length;
  const progress = total > 0 ? Math.round((completed.length / total) * 100) : 0;

  function handleCopyCode() {
    navigator.clipboard.writeText(couple.inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="min-h-screen bg-[#1a1612] px-4 py-8">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-[#8b7355] hover:text-[#c9a84c] transition-colors text-sm"
          >
            <ArrowLeft size={16} /> Volver al pasaporte
          </button>
          <button onClick={logout} className="text-[#5a4a3a] hover:text-[#8b7355] text-xs transition-colors">
            Salir
          </button>
        </div>

        <h1 className="text-3xl font-serif font-bold text-[#c9a84c] mb-1">Nuestro progreso</h1>
        <p className="text-[#8b7355] font-serif mb-8">El mapa de todas nuestras aventuras</p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <StatCard icon={<CheckCircle className="text-green-400" size={22} />} value={completed.length} label="Completadas" />
          <StatCard icon={<Lock className="text-[#c9a84c]" size={22} />} value={locked.length} label="Por vivir" />
          <StatCard icon={<Star className="text-yellow-400" size={22} />} value={total} label="Total" />
        </div>

        {/* Progress bar */}
        <div className="bg-[#2a2218] rounded-2xl p-5 mb-6">
          <div className="flex justify-between text-sm text-[#8b7355] mb-2">
            <span>Progreso del pasaporte</span>
            <span className="text-[#c9a84c] font-bold">{progress}%</span>
          </div>
          <div className="bg-[#3a2e1a] rounded-full h-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="bg-[#c9a84c] h-3 rounded-full"
            />
          </div>
          {progress === 100 && (
            <p className="text-center text-[#c9a84c] text-sm mt-3 font-serif">
              ¡Pasaporte completo! 🎉
            </p>
          )}
        </div>

        {/* Completed list */}
        {completed.length > 0 ? (
          <div className="mb-6">
            <h2 className="text-[#e8d5a3] font-semibold mb-4 flex items-center gap-2 font-serif">
              <Heart size={16} className="text-[#c9a84c]" /> Aventuras vividas
            </h2>
            <div className="space-y-3">
              {completed.map((adv, i) => (
                <motion.div
                  key={adv.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="bg-[#2a2218] rounded-xl p-4 flex items-center gap-4 border border-[#c9a84c]/20"
                >
                  {adv.image && (
                    <img src={adv.image} className="w-12 h-12 rounded-lg object-cover shrink-0" alt={adv.title} />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-[#e8d5a3] font-medium truncate">{adv.title}</div>
                    <div className="text-[#8b7355] text-sm flex items-center gap-1 mt-0.5">
                      <MapPin size={11} /> {adv.location || adv.date}
                    </div>
                  </div>
                  <CheckCircle className="text-green-400 shrink-0" size={18} />
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-10 text-[#5a4a3a] mb-6">
            <MapPin size={36} className="mx-auto mb-3 opacity-50" />
            <p className="font-serif">Aún no han completado aventuras.</p>
            <p className="text-sm mt-1">¡El primer sellito está por llegar!</p>
          </div>
        )}

        {/* Invite section */}
        <div className="bg-[#2a2218] border border-[#c9a84c]/20 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Share2 size={16} className="text-[#c9a84c]" />
            <span className="text-[#e8d5a3] font-semibold text-sm">Código de pareja</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#c9a84c] font-mono text-2xl font-bold tracking-[0.3em]">
              {couple.inviteCode}
            </span>
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 text-[#8b7355] hover:text-[#c9a84c] transition-colors text-sm"
            >
              {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
              {copied ? 'Copiado' : 'Copiar'}
            </button>
          </div>
          <p className="text-[#5a4a3a] text-xs mt-2">
            Comparte este código con tu pareja para que vea las mismas aventuras.
          </p>
        </div>

        {/* User info */}
        <div className="mt-4 flex items-center gap-3 p-4">
          {user.photoURL && (
            <img src={user.photoURL} className="w-8 h-8 rounded-full" alt={user.displayName ?? ''} />
          )}
          <span className="text-[#5a4a3a] text-sm">{user.displayName}</span>
        </div>

      </div>
    </div>
  );
}
