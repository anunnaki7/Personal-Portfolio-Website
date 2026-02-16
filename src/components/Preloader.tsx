import { useState, useEffect, useRef } from 'react';

interface PreloaderProps {
  onComplete: () => void;
}

// Status messages that change during loading (reduced for faster load)
const statusMessages = [
  'Initializing...',
  'Loading modules...',
  'Access granted.',
];

export default function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(0);
  const [glitchActive, setGlitchActive] = useState(false);
  const [particles, setParticles] = useState<Array<{id: number; x: number; y: number; delay: number; duration: number}>>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate floating particles (reduced for performance)
  useEffect(() => {
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 2,
    }));
    setParticles(newParticles);
  }, []);

  // Animated grid background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    let animationId: number;
    let offset = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const gridSize = 60;
      ctx.strokeStyle = 'rgba(255, 0, 60, 0.03)';
      ctx.lineWidth = 1;

      // Animated vertical lines
      for (let x = -gridSize + (offset % gridSize); x < canvas.width + gridSize; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Animated horizontal lines
      for (let y = -gridSize + (offset % gridSize); y < canvas.height + gridSize; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      offset += 0.2;
      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  // Progress animation over 1.2 seconds (FAST)
  useEffect(() => {
    const duration = 1200;
    const interval = 20;
    const increment = 100 / (duration / interval);
    
    const timer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + increment;
        if (newProgress >= 100) {
          clearInterval(timer);
          return 100;
        }
        return newProgress;
      });
    }, interval);

    return () => clearInterval(timer);
  }, []);

  // Update status message based on progress
  useEffect(() => {
    const statusIndex = Math.min(
      Math.floor(progress / (100 / statusMessages.length)),
      statusMessages.length - 1
    );
    setCurrentStatus(statusIndex);
  }, [progress]);

  // Glitch effect once during load
  useEffect(() => {
    const glitchTimeout = setTimeout(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 80);
    }, 600);

    return () => clearTimeout(glitchTimeout);
  }, []);
  
  // Second glitch near end
  useEffect(() => {
    if (progress > 80 && progress < 90) {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 50);
    }
  }, [progress]);

  // Cleanup - placeholder for old interval
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      // Disabled for performance
    }, 10000);

    return () => clearInterval(glitchInterval);
  }, []);

  // Complete transition (FAST)
  useEffect(() => {
    if (progress >= 100) {
      const fadeTimer = setTimeout(() => {
        // Quick final glitch
        setGlitchActive(true);
        setTimeout(() => {
          setGlitchActive(false);
          setIsFading(true);
          setTimeout(() => {
            onComplete();
          }, 400);
        }, 100);
      }, 150);

      return () => clearTimeout(fadeTimer);
    }
  }, [progress, onComplete]);

  return (
    <div 
      className={`fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center overflow-hidden transition-opacity duration-700 ${
        isFading ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ cursor: 'none' }}
    >
      {/* Animated Grid Canvas */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 pointer-events-none"
      />

      {/* Vignette Effect */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, transparent 40%, rgba(0,0,0,0.8) 100%)'
        }}
      />

      {/* Radar Scan Circle */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div 
          className="w-[500px] h-[500px] md:w-[600px] md:h-[600px] rounded-full border border-[#ff003c]/10"
          style={{ animation: 'radarPulse 3s ease-out infinite' }}
        />
        <div 
          className="absolute w-[350px] h-[350px] md:w-[450px] md:h-[450px] rounded-full border border-[#ff003c]/15"
          style={{ animation: 'radarPulse 3s ease-out infinite 0.5s' }}
        />
        <div 
          className="absolute w-[200px] h-[200px] md:w-[300px] md:h-[300px] rounded-full border border-[#ff003c]/20"
          style={{ animation: 'radarPulse 3s ease-out infinite 1s' }}
        />
        
        {/* Radar sweep line */}
        <div 
          className="absolute w-[250px] md:w-[300px] h-[2px] origin-left"
          style={{ 
            background: 'linear-gradient(90deg, rgba(255, 0, 60, 0.6) 0%, transparent 100%)',
            animation: 'radarSweep 4s linear infinite',
            boxShadow: '0 0 20px rgba(255, 0, 60, 0.3)'
          }}
        />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 rounded-full bg-[#ff003c]"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              opacity: 0.3,
              boxShadow: '0 0 6px rgba(255, 0, 60, 0.8)',
              animation: `floatParticle ${particle.duration}s ease-in-out infinite`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Main Content Container */}
      <div className="relative flex flex-col items-center z-10">
        
        {/* N.L Logo Section */}
        <div className="relative mb-14 md:mb-16">
          {/* Intense glow backdrop */}
          <div 
            className="absolute inset-0 blur-[80px]"
            style={{
              background: 'radial-gradient(circle, rgba(255, 0, 60, 0.5) 0%, transparent 70%)',
              transform: 'scale(3)',
              animation: 'glowPulse 2s ease-in-out infinite',
              opacity: progress >= 100 ? 0.8 : 0.4,
              transition: 'opacity 0.3s ease'
            }}
          />
          
          {/* Glitch layers */}
          {glitchActive && (
            <>
              <div 
                className="absolute inset-0 flex items-center justify-center"
                style={{ transform: 'translateX(-3px)', opacity: 0.7 }}
              >
                <span 
                  className="text-7xl sm:text-8xl md:text-9xl font-black tracking-tight"
                  style={{
                    fontFamily: "'Orbitron', sans-serif",
                    color: '#00ffff',
                    filter: 'blur(1px)'
                  }}
                >
                  N.L
                </span>
              </div>
              <div 
                className="absolute inset-0 flex items-center justify-center"
                style={{ transform: 'translateX(3px)', opacity: 0.7 }}
              >
                <span 
                  className="text-7xl sm:text-8xl md:text-9xl font-black tracking-tight"
                  style={{
                    fontFamily: "'Orbitron', sans-serif",
                    color: '#ff003c',
                    filter: 'blur(1px)'
                  }}
                >
                  N.L
                </span>
              </div>
            </>
          )}
          
          {/* Main Logo Text */}
          <div className="relative flex items-center">
            <h1 
              className={`text-7xl sm:text-8xl md:text-9xl font-black tracking-tight select-none transition-all duration-300 ${
                glitchActive ? 'opacity-90' : 'opacity-100'
              }`}
              style={{
                fontFamily: "'Orbitron', sans-serif",
                color: '#ff003c',
                textShadow: `
                  0 0 10px rgba(255, 0, 60, 1),
                  0 0 20px rgba(255, 0, 60, 0.8),
                  0 0 40px rgba(255, 0, 60, 0.6),
                  0 0 80px rgba(255, 0, 60, 0.4),
                  0 0 120px rgba(255, 0, 60, 0.2)
                `,
                animation: 'logoPulse 2s ease-in-out infinite'
              }}
            >
              N<span className="text-white/80 mx-1">.</span>L
            </h1>
            
            {/* Blinking Terminal Cursor */}
            <div 
              className="ml-2 md:ml-4 w-[3px] md:w-1 h-12 md:h-16 bg-[#ff003c]"
              style={{
                boxShadow: '0 0 10px rgba(255, 0, 60, 0.8), 0 0 20px rgba(255, 0, 60, 0.4)',
                animation: 'cursorBlink 1s step-end infinite'
              }}
            />
          </div>

          {/* Light Sweep Effect */}
          <div 
            className="absolute inset-0 overflow-hidden pointer-events-none"
            style={{ animation: 'sweepAnimation 3s ease-in-out infinite' }}
          >
            <div 
              className="absolute top-0 -left-full w-full h-full"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
                transform: 'skewX(-20deg)',
                animation: 'lightSweep 3s ease-in-out infinite'
              }}
            />
          </div>

          {/* Reflection line */}
          <div 
            className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-40 h-[2px] rounded-full"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255, 0, 60, 0.5), transparent)',
              animation: 'reflectionPulse 2s ease-in-out infinite'
            }}
          />
        </div>

        {/* Progress Bar Section */}
        <div className="w-72 sm:w-80 md:w-[400px] relative">
          {/* Progress bar container */}
          <div 
            className="h-[3px] md:h-1 bg-gray-900/80 rounded-full overflow-hidden backdrop-blur-sm"
            style={{ 
              border: '1px solid rgba(255, 0, 60, 0.2)',
              boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)'
            }}
          >
            {/* Progress bar fill */}
            <div 
              className="h-full rounded-full relative overflow-hidden"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #ff003c, #ff3366, #ff003c)',
                boxShadow: '0 0 15px rgba(255, 0, 60, 0.8), 0 0 30px rgba(255, 0, 60, 0.4)',
                transition: 'width 0.1s ease-out'
              }}
            >
              {/* Shimmer effect */}
              <div 
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
                  animation: 'shimmer 1.5s ease-in-out infinite'
                }}
              />
            </div>
          </div>

          {/* Status Text */}
          <div className="mt-6 text-center">
            <div 
              className={`text-xs md:text-sm tracking-[0.2em] transition-all duration-300 ${
                progress >= 100 ? 'text-green-400' : 'text-gray-500'
              }`}
              style={{ 
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                textShadow: progress >= 100 ? '0 0 10px rgba(74, 222, 128, 0.5)' : 'none'
              }}
            >
              {progress >= 100 ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Access granted.</span>
                </span>
              ) : (
                <span>
                  <span className="text-[#ff003c]">{'>'}</span> {statusMessages[currentStatus]}
                </span>
              )}
            </div>
          </div>

          {/* Percentage */}
          <div 
            className="absolute -right-12 md:-right-16 top-0 text-xs md:text-sm font-bold"
            style={{ 
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              color: '#ff003c',
              textShadow: '0 0 10px rgba(255, 0, 60, 0.5)'
            }}
          >
            {Math.round(progress)}%
          </div>
        </div>

        {/* Decorative Tech Lines */}
        <div className="absolute -left-20 md:-left-32 top-1/2 -translate-y-1/2 flex flex-col gap-2 opacity-30">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i}
              className="h-[1px] bg-[#ff003c]"
              style={{
                width: `${30 + i * 15}px`,
                opacity: 0.3 + i * 0.1,
                animation: `techLine 2s ease-in-out infinite ${i * 0.2}s`
              }}
            />
          ))}
        </div>
        <div className="absolute -right-20 md:-right-32 top-1/2 -translate-y-1/2 flex flex-col gap-2 items-end opacity-30">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i}
              className="h-[1px] bg-[#ff003c]"
              style={{
                width: `${30 + i * 15}px`,
                opacity: 0.3 + i * 0.1,
                animation: `techLine 2s ease-in-out infinite ${i * 0.2}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Corner Decorations */}
      <div className="absolute top-6 left-6">
        <div className="w-16 h-16 border-l-2 border-t-2 border-[#ff003c]/30" />
        <div className="absolute top-2 left-2 w-2 h-2 bg-[#ff003c]/50 rounded-full" style={{ animation: 'cornerDot 2s ease-in-out infinite' }} />
      </div>
      <div className="absolute top-6 right-6">
        <div className="w-16 h-16 border-r-2 border-t-2 border-[#ff003c]/30" />
        <div className="absolute top-2 right-2 w-2 h-2 bg-[#ff003c]/50 rounded-full" style={{ animation: 'cornerDot 2s ease-in-out infinite 0.5s' }} />
      </div>
      <div className="absolute bottom-6 left-6">
        <div className="w-16 h-16 border-l-2 border-b-2 border-[#ff003c]/30" />
        <div className="absolute bottom-2 left-2 w-2 h-2 bg-[#ff003c]/50 rounded-full" style={{ animation: 'cornerDot 2s ease-in-out infinite 1s' }} />
      </div>
      <div className="absolute bottom-6 right-6">
        <div className="w-16 h-16 border-r-2 border-b-2 border-[#ff003c]/30" />
        <div className="absolute bottom-2 right-2 w-2 h-2 bg-[#ff003c]/50 rounded-full" style={{ animation: 'cornerDot 2s ease-in-out infinite 1.5s' }} />
      </div>

      {/* System Info Text */}
      <div 
        className="absolute top-8 left-1/2 -translate-x-1/2 text-[10px] text-[#ff003c]/40 tracking-[0.3em] uppercase"
        style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}
      >
        SECURE SYSTEM v2.0
      </div>

      {/* Bottom Copyright */}
      <div 
        className="absolute bottom-8 text-xs text-gray-600 tracking-[0.2em]"
        style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}
      >
        <span className="text-[#ff003c]/50">{'<'}</span>
        {' '}NIKOLA LUTOVAC © 2026{' '}
        <span className="text-[#ff003c]/50">{'/>'}</span>
      </div>

      {/* Keyframe Animations */}
      <style>{`
        @keyframes logoPulse {
          0%, 100% {
            transform: scale(1);
            filter: brightness(1);
          }
          50% {
            transform: scale(1.02);
            filter: brightness(1.1);
          }
        }

        @keyframes cursorBlink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }

        @keyframes glowPulse {
          0%, 100% { opacity: 0.4; transform: scale(3); }
          50% { opacity: 0.6; transform: scale(3.2); }
        }

        @keyframes shimmer {
          0% { transform: translateX(-200%); }
          100% { transform: translateX(200%); }
        }

        @keyframes lightSweep {
          0% { transform: translateX(-100%) skewX(-20deg); }
          100% { transform: translateX(300%) skewX(-20deg); }
        }

        @keyframes reflectionPulse {
          0%, 100% { opacity: 0.3; width: 160px; }
          50% { opacity: 0.6; width: 200px; }
        }

        @keyframes radarPulse {
          0% { transform: scale(0.8); opacity: 0.3; }
          50% { transform: scale(1); opacity: 0.1; }
          100% { transform: scale(1.2); opacity: 0; }
        }

        @keyframes radarSweep {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes floatParticle {
          0%, 100% { 
            transform: translateY(0) translateX(0); 
            opacity: 0.2;
          }
          25% { 
            transform: translateY(-20px) translateX(10px); 
            opacity: 0.5;
          }
          50% { 
            transform: translateY(-10px) translateX(-5px); 
            opacity: 0.3;
          }
          75% { 
            transform: translateY(-30px) translateX(5px); 
            opacity: 0.4;
          }
        }

        @keyframes techLine {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }

        @keyframes cornerDot {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }

        @keyframes sweepAnimation {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
