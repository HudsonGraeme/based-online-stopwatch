import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
}

const createParticle = (id: number): Particle => {
  // Create predictable linear directions
  const angle = Math.random() * Math.PI * 2; // Random angle
  const speed = Math.random() * 1.5 + 0.8; // 0.8 to 2.3 pixels per frame - faster but linear

  return {
    id,
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    vx: Math.cos(angle) * speed, // Pure linear movement
    vy: Math.sin(angle) * speed,
    size: Math.random() * 8 + 3,
    opacity: Math.random() * 0.4 + 0.2,
  };
};

export function FloatingParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const animationRef = useRef<number>(0);
  const particleIdRef = useRef(0);

  const initializeParticles = useCallback(() => {
    const initialParticles: Particle[] = [];
    for (let i = 0; i < 5; i++) {
      const particle = createParticle(particleIdRef.current++);
      initialParticles.push(particle);
    }
    setParticles(initialParticles);
  }, []);

  const animate = useCallback(() => {
    setParticles((prevParticles) => {
      const updatedParticles = prevParticles.map((particle) => {
        // Pure linear movement - no velocity changes at all
        particle.x += particle.vx;
        particle.y += particle.vy;

        return particle;
      });

      // Remove particles that are off-screen and replace with new ones
      const onScreenParticles = updatedParticles.filter(
        (particle) =>
          particle.x > -50 &&
          particle.x < window.innerWidth + 50 &&
          particle.y > -50 &&
          particle.y < window.innerHeight + 50
      );

      // Add new particles to maintain 5 on screen
      while (onScreenParticles.length < 5) {
        // Sometimes spawn from edges for more natural flow
        let newParticle;
        if (Math.random() < 0.5) {
          // Spawn from random edge
          const edge = Math.floor(Math.random() * 4);
          switch (edge) {
            case 0: // top
              newParticle = createParticle(particleIdRef.current++);
              newParticle.x = Math.random() * window.innerWidth;
              newParticle.y = -20;
              newParticle.vy = Math.abs(newParticle.vy); // Move downward
              break;
            case 1: // right
              newParticle = createParticle(particleIdRef.current++);
              newParticle.x = window.innerWidth + 20;
              newParticle.y = Math.random() * window.innerHeight;
              newParticle.vx = -Math.abs(newParticle.vx); // Move leftward
              break;
            case 2: // bottom
              newParticle = createParticle(particleIdRef.current++);
              newParticle.x = Math.random() * window.innerWidth;
              newParticle.y = window.innerHeight + 20;
              newParticle.vy = -Math.abs(newParticle.vy); // Move upward
              break;
            case 3: // left
              newParticle = createParticle(particleIdRef.current++);
              newParticle.x = -20;
              newParticle.y = Math.random() * window.innerHeight;
              newParticle.vx = Math.abs(newParticle.vx); // Move rightward
              break;
          }
        } else {
          // Spawn randomly on screen
          newParticle = createParticle(particleIdRef.current++);
        }
        onScreenParticles.push(newParticle!);
      }

      return onScreenParticles;
    });

    animationRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    initializeParticles();
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [initializeParticles, animate]);

  return (
    <>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          style={{
            position: "fixed",
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            borderRadius: "50%",
            backgroundColor: `rgba(255, 255, 255, ${particle.opacity})`,
            pointerEvents: "none",
            zIndex: -1,
          }}
        />
      ))}
    </>
  );
}
