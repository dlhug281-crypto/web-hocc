import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Particle {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  color: string;
}

interface ConfettiBurstProps {
  triggerKey: number;
}

export const ConfettiBurst: React.FC<ConfettiBurstProps> = ({ triggerKey }) => {
  const [particles, setParticles] = React.useState<Particle[]>([]);

  React.useEffect(() => {
    if (triggerKey === 0) return;
    const colors = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899', '#06b6d4'];
    const newParticles: Particle[] = Array.from({ length: 24 }).map((_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 240,
      y: (Math.random() - 0.8) * 200,
      rotation: Math.random() * 360,
      scale: Math.random() * 0.8 + 0.4,
      color: colors[Math.floor(Math.random() * colors.length)]
    }));

    setParticles(newParticles);
    const timer = setTimeout(() => setParticles([]), 1200);
    return () => clearTimeout(timer);
  }, [triggerKey]);

  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 1, x: 0, y: 0, scale: p.scale, rotate: 0 }}
            animate={{
              opacity: 0,
              x: p.x,
              y: p.y,
              rotate: p.rotation,
              scale: p.scale * 0.5
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'absolute',
              width: 10,
              height: 10,
              backgroundColor: p.color,
              borderRadius: p.id % 2 === 0 ? '50%' : '2px'
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
