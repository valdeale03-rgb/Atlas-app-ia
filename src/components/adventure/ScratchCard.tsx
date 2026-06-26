import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ScratchCardProps {
  image: string;
  onComplete: () => void;
  width?: number;
  height?: number;
  /** % de raspado a partir del cual aparece el botón "Revelar todo" */
  revealAt?: number;
}

const ScratchCard: React.FC<ScratchCardProps> = ({
  image,
  onComplete,
  width = 600,
  height = 800,
  revealAt = 50,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [canReveal, setCanReveal] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    ctx.fillStyle = '#c5a059';
    ctx.fillRect(0, 0, width, height);
    for (let i = 0; i < 1000; i++) {
      ctx.fillStyle = `rgba(255, 215, 0, ${Math.random() * 0.3})`;
      ctx.fillRect(Math.random() * width, Math.random() * height, 2, 2);
    }
    ctx.globalCompositeOperation = 'destination-out';
  }, [width, height]);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * (width / rect.width),
      y: (clientY - rect.top) * (height / rect.height),
    };
  };

  const scratchLine = (from: { x: number; y: number } | null, to: { x: number; y: number }) => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const radius = 34;
    if (from) {
      ctx.lineWidth = radius * 2;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(to.x, to.y, radius, 0, Math.PI * 2);
    ctx.fill();
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || revealed) return;
    const pos = getPos(e);
    scratchLine(lastPos.current, pos);
    lastPos.current = pos;
    checkProgress();
  };

  const checkProgress = () => {
    const ctx = canvasRef.current?.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    const pixels = ctx.getImageData(0, 0, width, height).data;
    let transparent = 0;
    // muestreo cada 4to pixel para rendimiento
    for (let i = 3; i < pixels.length; i += 16) {
      if (pixels[i] === 0) transparent++;
    }
    const percentage = (transparent / (pixels.length / 16)) * 100;
    if (percentage >= revealAt && !canReveal) setCanReveal(true);
  };

  const revealAll = () => {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) ctx.clearRect(0, 0, width, height);
    setRevealed(true);
    onComplete();
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div
        className="relative overflow-hidden rounded-lg shadow-2xl border-4 border-vintage-gold mx-auto"
        style={{ width: 'max-content' }}
      >
        <img
          src={image}
          alt="Secret Treasure"
          style={{ width, height, objectFit: 'cover' }}
          className="block"
        />
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className={`absolute top-0 left-0 touch-none ${revealed ? 'pointer-events-none' : 'cursor-crosshair'}`}
          onMouseDown={() => { setIsDrawing(true); lastPos.current = null; }}
          onMouseUp={() => { setIsDrawing(false); lastPos.current = null; }}
          onMouseLeave={() => { setIsDrawing(false); lastPos.current = null; }}
          onMouseMove={draw}
          onTouchStart={() => { setIsDrawing(true); lastPos.current = null; }}
          onTouchEnd={() => { setIsDrawing(false); lastPos.current = null; }}
          onTouchMove={draw}
        />
      </div>

      <AnimatePresence>
        {canReveal && !revealed && (
          <motion.button
            initial={{ opacity: 0, y: 16, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            onClick={revealAll}
            className="bg-[#c9a84c] text-[#1a1612] px-8 py-3.5 rounded-full font-bold uppercase tracking-widest text-sm shadow-lg hover:bg-[#e8d5a3] transition-colors"
          >
            ✨ Revelar todo
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ScratchCard;
