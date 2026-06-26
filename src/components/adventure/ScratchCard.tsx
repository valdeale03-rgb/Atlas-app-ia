import React, { useRef, useEffect, useState } from 'react';

interface ScratchCardProps {
  image: string;
  onComplete: () => void;
  width?: number;
  height?: number;
  threshold?: number;
}

const ScratchCard: React.FC<ScratchCardProps> = ({ 
  image, 
  onComplete, 
  width = 600, 
  height = 800, 
  threshold = 70 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // Fill with gold color and some texture
    ctx.fillStyle = '#c5a059';
    ctx.fillRect(0, 0, width, height);
    
    // Add some "gold dust" effect
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
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || isCompleted) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2);
    ctx.fill();

    checkProgress();
  };

  const checkProgress = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, width, height);
    const pixels = imageData.data;
    let transparentPixels = 0;

    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) transparentPixels++;
    }

    const percentage = (transparentPixels / (pixels.length / 4)) * 100;
    if (percentage >= threshold && !isCompleted) {
      setIsCompleted(true);
      onComplete();
    }
  };

  return (
    <div className="relative overflow-hidden rounded-lg shadow-2xl border-4 border-vintage-gold mx-auto" 
         style={{ width: 'max-content' }}>
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
        className="absolute top-0 left-0 cursor-crosshair touch-none"
        onMouseDown={() => setIsDrawing(true)}
        onMouseUp={() => setIsDrawing(false)}
        onMouseLeave={() => setIsDrawing(false)}
        onMouseMove={draw}
        onTouchStart={() => setIsDrawing(true)}
        onTouchEnd={() => setIsDrawing(false)}
        onTouchMove={draw}
      />
    </div>
  );
};

export default ScratchCard;
