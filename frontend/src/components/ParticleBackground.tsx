import { useCallback, useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

const ParticleBackground = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  const generateParticles = useCallback(() => {
    const newParticles: Particle[] = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 4 + 1,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 10,
      opacity: Math.random() * 0.5 + 0.1,
    }));
    setParticles(newParticles);
  }, []);

  useEffect(() => {
    generateParticles();
  }, [generateParticles]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle animate-particle-drift pointer-events-none"
          style={{
            left: `${p.x}%`,
            bottom: "-10px",
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: p.id % 3 === 0
              ? "hsla(258, 70%, 60%, 0.6)"
              : p.id % 3 === 1
              ? "hsla(174, 72%, 50%, 0.5)"
              : "hsla(220, 80%, 60%, 0.4)",
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            opacity: p.opacity,
            filter: `blur(${p.size > 3 ? 1 : 0}px)`,
          }}
        />
      ))}
    </div>
  );
};

export default ParticleBackground;
