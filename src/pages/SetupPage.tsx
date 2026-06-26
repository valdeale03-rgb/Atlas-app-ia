import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, LogIn, Copy, Check } from 'lucide-react';
import type { User } from 'firebase/auth';
import type { Couple } from '../hooks/useCouple';

interface SetupPageProps {
  user: User;
  createCouple: () => Promise<Couple>;
  joinCouple: (code: string) => Promise<boolean>;
}

export function SetupPage({ user, createCouple, joinCouple }: SetupPageProps) {
  const [view, setView] = useState<'choose' | 'join' | 'created'>('choose');
  const [inviteCode, setInviteCode] = useState('');
  const [createdCouple, setCreatedCouple] = useState<Couple | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    setLoading(true);
    const couple = await createCouple();
    setCreatedCouple(couple);
    setView('created');
    setLoading(false);
  }

  async function handleJoin() {
    if (inviteCode.trim().length < 6) { setError('El código tiene 6 caracteres.'); return; }
    setLoading(true);
    const ok = await joinCouple(inviteCode);
    if (!ok) { setError('Código inválido o ya usado. Pídele uno nuevo a tu pareja.'); }
    setLoading(false);
  }

  function handleCopy() {
    if (!createdCouple) return;
    navigator.clipboard.writeText(createdCouple.inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const firstName = user.displayName?.split(' ')[0] ?? 'Exploradora';

  return (
    <div className="min-h-screen bg-[#1a1612] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <h2 className="text-3xl font-serif font-bold text-[#c9a84c] text-center mb-2">
          ¡Bienvenida, {firstName}!
        </h2>
        <p className="text-[#8b7355] text-center mb-10 font-serif">¿Qué quieres hacer?</p>

        {view === 'choose' && (
          <div className="space-y-4">
            <button
              onClick={handleCreate}
              disabled={loading}
              className="w-full flex items-center gap-4 bg-[#2a2218] border border-[#c9a84c]/30 rounded-2xl p-5 hover:border-[#c9a84c] transition-colors text-left disabled:opacity-60"
            >
              <Heart className="text-[#c9a84c] shrink-0" size={28} />
              <div>
                <div className="text-[#e8d5a3] font-semibold">Crear nuestro espacio</div>
                <div className="text-[#8b7355] text-sm">Empieza las aventuras e invita a tu pareja</div>
              </div>
            </button>
            <button
              onClick={() => setView('join')}
              className="w-full flex items-center gap-4 bg-[#2a2218] border border-[#c9a84c]/30 rounded-2xl p-5 hover:border-[#c9a84c] transition-colors text-left"
            >
              <LogIn className="text-[#c9a84c] shrink-0" size={28} />
              <div>
                <div className="text-[#e8d5a3] font-semibold">Unirme con código</div>
                <div className="text-[#8b7355] text-sm">Tu pareja ya creó un espacio</div>
              </div>
            </button>
          </div>
        )}

        {view === 'join' && (
          <div className="space-y-4">
            <input
              type="text"
              value={inviteCode}
              onChange={e => { setInviteCode(e.target.value.toUpperCase()); setError(''); }}
              placeholder="XXXXXX"
              className="w-full bg-[#2a2218] border border-[#c9a84c]/30 rounded-xl px-4 py-4 text-[#e8d5a3] placeholder-[#5a4a3a] text-center text-3xl tracking-[0.4em] font-mono focus:outline-none focus:border-[#c9a84c]"
              maxLength={6}
            />
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            <button
              onClick={handleJoin}
              disabled={loading}
              className="w-full bg-[#c9a84c] text-[#1a1612] rounded-xl py-3.5 font-bold hover:bg-[#e8d5a3] transition-colors disabled:opacity-60"
            >
              {loading ? 'Uniéndome...' : 'Unirme'}
            </button>
            <button onClick={() => setView('choose')} className="w-full text-[#8b7355] py-2 hover:text-[#c9a84c] transition-colors text-sm">
              ← Volver
            </button>
          </div>
        )}

        {view === 'created' && createdCouple && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
            <div className="bg-[#2a2218] border border-[#c9a84c]/40 rounded-2xl p-6 text-center">
              <p className="text-[#8b7355] text-sm mb-3">Código para tu pareja</p>
              <div className="text-[#c9a84c] text-5xl font-mono font-bold tracking-[0.3em] mb-4">
                {createdCouple.inviteCode}
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 mx-auto text-[#8b7355] hover:text-[#c9a84c] transition-colors text-sm"
              >
                {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                {copied ? 'Copiado' : 'Copiar código'}
              </button>
            </div>
            <p className="text-[#8b7355] text-sm text-center">
              Comparte este código con tu pareja para que entre al mismo espacio.
            </p>
            <a
              href="/"
              className="block w-full bg-[#c9a84c] text-[#1a1612] rounded-xl py-3.5 font-bold text-center hover:bg-[#e8d5a3] transition-colors"
            >
              Ir a nuestras aventuras →
            </a>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
