import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface CinematicLoaderProps {
  onComplete: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  speed: number;
  angle: number;
  gravity?: number;
  friction?: number;
  pulseSpeed?: number;
}

export default function CinematicLoader({ onComplete }: CinematicLoaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stage, setStage] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const [isMobile, setIsMobile] = useState(false);

  // Timings:
  // t=0.5s: Stage 2 (Diamond Emergence)
  // t=2.6s: Stage 3 (Diamond Splash)
  // t=3.0s: Stage 4 (Logo Reveal)
  // t=3.8s: Stage 5 (Tagline Reveal)
  // t=5.2s: Stage 6 (Transition out / complete)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(2), 500),
      setTimeout(() => setStage(3), 2600),
      setTimeout(() => setStage(4), 3000),
      setTimeout(() => setStage(5), 3800),
      setTimeout(() => {
        setStage(6);
        setTimeout(onComplete, 800); // Wait for transition fade to finish
      }, 5200),
    ];

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles: Particle[] = [];
    const maxAmbientParticles = isMobile ? 25 : 60;

    // Helper to spawn ambient dust
    const spawnAmbientParticle = (yOffset = false): Particle => {
      return {
        x: Math.random() * width,
        y: yOffset ? Math.random() * height : height + 10,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -0.3 - Math.random() * 0.8,
        size: Math.random() * 1.5 + 0.5,
        color: Math.random() > 0.3 ? '#BF953F' : '#FCF6BA', // Gold dust
        alpha: Math.random() * 0.5 + 0.1,
        life: 0,
        maxLife: 300 + Math.random() * 200,
        speed: 0.1,
        angle: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.02,
      };
    };

    // Pre-populate ambient dust across screen
    for (let i = 0; i < maxAmbientParticles; i++) {
      particles.push(spawnAmbientParticle(true));
    }

    // Trigger splash explosion particles
    const triggerSplash = () => {
      const particleCount = isMobile ? 70 : 160;
      const centerX = width / 2;
      const centerY = height / 2;

      for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const force = 3 + Math.random() * 8;
        const size = Math.random() * 3 + 1;
        const colorVal = Math.random();
        
        // Gemstone inspired splash colors (Gold, Crystal White, Emerald Green, Ruby Red, Sapphire Blue)
        let color = '#BF953F'; // Gold
        if (colorVal > 0.8) color = '#FFFFFF'; // Crystal White
        else if (colorVal > 0.6) color = '#10B981'; // Emerald
        else if (colorVal > 0.4) color = '#EF4444'; // Ruby
        else if (colorVal > 0.2) color = '#3B82F6'; // Sapphire

        particles.push({
          x: centerX,
          y: centerY,
          vx: Math.cos(angle) * force,
          vy: Math.sin(angle) * force,
          size,
          color,
          alpha: 1,
          life: 0,
          maxLife: 60 + Math.random() * 80,
          speed: force,
          angle,
          friction: 0.96,
          gravity: 0.03, // Slight downward drift
        });
      }
    };

    let splashTriggered = false;

    // Render loop
    const render = () => {
      ctx.fillStyle = '#030303';
      ctx.fillRect(0, 0, width, height);

      // Draw subtle background radial lighting glow
      const gradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        10,
        width / 2,
        height / 2,
        width * 0.7
      );
      gradient.addColorStop(0, 'rgba(28, 20, 10, 0.18)');
      gradient.addColorStop(0.5, 'rgba(8, 6, 4, 0.05)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Trigger splash once when stage becomes 3
      if (stage === 3 && !splashTriggered) {
        triggerSplash();
        splashTriggered = true;
      }

      // Update & Draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;

        // Apply physics
        if (p.friction) {
          p.vx *= p.friction;
          p.vy *= p.friction;
        }
        if (p.gravity) {
          p.vy += p.gravity;
        }

        p.x += p.vx;
        p.y += p.vy;

        // Fade ambient particles or decay splash particles
        let alpha = p.alpha;
        if (!p.friction) {
          // Ambient float: oscillate opacity gently
          p.alpha += Math.sin(p.life * (p.pulseSpeed || 0.02)) * 0.01;
          p.alpha = Math.max(0.1, Math.min(0.7, p.alpha));
          alpha = p.alpha;
          // Slowly drift ambient up, wrap around
          if (p.y < -10) {
            particles[i] = spawnAmbientParticle(false);
          }
        } else {
          // Splash fade out
          alpha = 1 - p.life / p.maxLife;
        }

        if (p.life >= p.maxLife || alpha <= 0) {
          if (!p.friction) {
            particles[i] = spawnAmbientParticle(false);
          } else {
            particles.splice(i, 1);
          }
          continue;
        }

        // Draw particle with glow
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;
        
        // Add subtle shadow blur for diamond dust sparkle
        if (p.size > 1.5) {
          ctx.shadowBlur = 8;
          ctx.shadowColor = p.color;
        }
        ctx.fill();
        ctx.restore();
      }

      // Draw light rays when diamond is emerging (Stage 2)
      if (stage === 2) {
        const time = Date.now() * 0.001;
        ctx.save();
        ctx.translate(width / 2, height / 2);
        ctx.globalCompositeOperation = 'screen';
        
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3 + time * 0.05;
          const rayGrad = ctx.createLinearGradient(0, 0, Math.cos(angle) * 180, Math.sin(angle) * 180);
          rayGrad.addColorStop(0, 'rgba(212, 175, 55, 0.15)');
          rayGrad.addColorStop(0.5, 'rgba(252, 246, 186, 0.05)');
          rayGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(Math.cos(angle - 0.05) * 200, Math.sin(angle - 0.05) * 200);
          ctx.lineTo(Math.cos(angle + 0.05) * 200, Math.sin(angle + 0.05) * 200);
          ctx.closePath();
          ctx.fillStyle = rayGrad;
          ctx.fill();
        }
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [stage, isMobile]);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#030303] select-none flex items-center justify-center">
      {/* Dynamic Background Particles Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {/* SVG Glass-Reflective Diamond (Stage 2 and fading out in Stage 3) */}
      <AnimatePresence>
        {stage === 2 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7, rotate: -25 }}
            animate={{ opacity: 1, scale: 1.05, rotate: 15 }}
            exit={{ opacity: 0, scale: 0.8, filter: 'blur(10px)', transition: { duration: 0.3 } }}
            transition={{
              duration: 2.2,
              ease: [0.16, 1, 0.3, 1], // Custom slow ease-out
            }}
            className="absolute z-10 w-44 h-44 flex items-center justify-center pointer-events-none drop-shadow-[0_0_35px_rgba(212,175,55,0.25)]"
          >
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full overflow-visible"
              style={{
                filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.4))',
              }}
            >
              <defs>
                <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#BF953F" />
                  <stop offset="25%" stopColor="#FCF6BA" />
                  <stop offset="50%" stopColor="#B38728" />
                  <stop offset="75%" stopColor="#FBF5B7" />
                  <stop offset="100%" stopColor="#AA771C" />
                </linearGradient>
                <linearGradient id="shine-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0)" />
                  <stop offset="50%" stopColor="rgba(255,255,255,0.6)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                </linearGradient>
              </defs>

              {/* Diamond Facets Outer Path */}
              <polygon points="50,15 82,38 50,88 18,38" fill="rgba(255, 255, 255, 0.03)" stroke="url(#gold-grad)" strokeWidth="0.85" />
              
              {/* Inner Facet Lines for high reflection realism */}
              <line x1="50" y1="15" x2="50" y2="88" stroke="url(#gold-grad)" strokeWidth="0.6" strokeOpacity="0.8" />
              <line x1="18" y1="38" x2="82" y2="38" stroke="url(#gold-grad)" strokeWidth="0.6" strokeOpacity="0.8" />
              
              {/* Star facets crown */}
              <line x1="50" y1="15" x2="32" y2="38" stroke="url(#gold-grad)" strokeWidth="0.5" strokeOpacity="0.7" />
              <line x1="50" y1="15" x2="68" y2="38" stroke="url(#gold-grad)" strokeWidth="0.5" strokeOpacity="0.7" />

              {/* Pavilion facets bottom */}
              <line x1="32" y1="38" x2="50" y2="88" stroke="url(#gold-grad)" strokeWidth="0.5" strokeOpacity="0.7" />
              <line x1="68" y1="38" x2="50" y2="88" stroke="url(#gold-grad)" strokeWidth="0.5" strokeOpacity="0.7" />
              
              {/* Extra light reflections */}
              <polygon points="50,15 68,38 50,38" fill="rgba(255,255,255,0.06)" />
              <polygon points="50,38 82,38 50,88" fill="rgba(255,255,255,0.02)" />
              <polygon points="18,38 50,38 50,88" fill="rgba(255,255,255,0.04)" />

              {/* Moving shimmer sweep across the diamond */}
              <motion.path
                d="M 18,38 L 82,38 L 50,88 Z"
                fill="url(#shine-grad)"
                opacity="0.5"
                initial={{ translateX: -100 }}
                animate={{ translateX: 100 }}
                transition={{
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 2.5,
                  ease: "easeInOut"
                }}
              />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LUXEORA Logo and Tagline Reveal (Stages 4, 5) */}
      <div className="absolute z-20 flex flex-col items-center text-center px-4">
        <AnimatePresence>
          {stage >= 4 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center gap-1.5"
            >
              {/* Logo Typography with Gold Metallic Reflection */}
              <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-[0.3em] text-gold-foil relative select-none">
                LUXEORA
                {/* Micro-sparkle overlays on text */}
                <motion.span 
                  className="absolute -top-2 -right-4 text-[#FCF6BA] text-sm opacity-70"
                  animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  ✦
                </motion.span>
              </h1>
              
              {/* Shimmer sweep line beneath logo */}
              <motion.div 
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 140, opacity: 0.5 }}
                transition={{ delay: 0.5, duration: 1.2 }}
                className="h-[1px] bg-gradient-to-r from-transparent via-[#BF953F] to-transparent mt-1"
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {stage >= 5 && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 0.85, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-xs md:text-sm font-mono tracking-[0.45em] text-[#FCF6BA] uppercase mt-4"
            >
              Crafted Brilliance. Timeless Luxury.
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Screen blur/brightness overlay for transition out (Stage 6) */}
      <AnimatePresence>
        {stage === 6 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 bg-[#030303] backdrop-blur-xl pointer-events-none"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
