import { useState, useEffect, useCallback } from 'react';

export function EasterEgg() {
  const [isVisible, setIsVisible] = useState(false);
  const [phase, setPhase] = useState<'glitch' | 'show' | 'fadeout'>('glitch');

  const trigger = useCallback(() => {
    if (isVisible) return;
    setIsVisible(true);
    setPhase('glitch');

    // Glitch phase
    setTimeout(() => setPhase('show'), 400);
    // Start fade out
    setTimeout(() => setPhase('fadeout'), 2800);
    // Remove
    setTimeout(() => {
      setIsVisible(false);
      setPhase('glitch');
    }, 3500);
  }, [isVisible]);

  // Ctrl+Shift+N shortcut
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'N') {
        e.preventDefault();
        trigger();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [trigger]);

  // Expose trigger for logo click
  useEffect(() => {
    (window as unknown as Record<string, unknown>).__easterEggTrigger = trigger;
    return () => {
      delete (window as unknown as Record<string, unknown>).__easterEggTrigger;
    };
  }, [trigger]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none transition-opacity duration-700 ${
        phase === 'fadeout' ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/85" />

      {/* Scan lines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,0,64,0.03) 2px, rgba(255,0,64,0.03) 4px)',
        }}
      />

      {/* Moving scan line */}
      <div
        className="absolute left-0 right-0 h-[2px] pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,0,64,0.4), transparent)',
          animation: 'easterScan 1.5s linear infinite',
        }}
      />

      {/* Content */}
      <div className="relative text-center z-10">
        {/* Glitch effect during initial phase */}
        {phase === 'glitch' && (
          <div className="relative">
            <div
              className="text-4xl md:text-5xl font-bold font-['Orbitron'] text-[#ff0040]"
              style={{
                animation: 'easterGlitch 0.1s infinite',
                textShadow: '0 0 20px rgba(255,0,64,0.8)',
              }}
            >
              ACCESS GRANTED
            </div>
          </div>
        )}

        {/* Main message */}
        {phase === 'show' && (
          <div className="space-y-4">
            {/* Access Granted */}
            <div className="relative">
              <div
                className="text-4xl md:text-5xl font-bold font-['Orbitron'] text-[#ff0040]"
                style={{
                  textShadow: '0 0 30px rgba(255,0,64,0.6), 0 0 60px rgba(255,0,64,0.3), 0 0 100px rgba(255,0,64,0.15)',
                  animation: 'easterPulse 1.5s ease-in-out infinite',
                }}
              >
                ACCESS GRANTED
              </div>

              {/* Glitch layers */}
              <div
                className="absolute inset-0 text-4xl md:text-5xl font-bold font-['Orbitron'] text-cyan-400"
                style={{
                  animation: 'easterGlitchLayer1 3s infinite',
                  clipPath: 'inset(0 0 65% 0)',
                  opacity: 0.4,
                }}
              >
                ACCESS GRANTED
              </div>
              <div
                className="absolute inset-0 text-4xl md:text-5xl font-bold font-['Orbitron'] text-red-600"
                style={{
                  animation: 'easterGlitchLayer2 3s infinite',
                  clipPath: 'inset(65% 0 0 0)',
                  opacity: 0.4,
                }}
              >
                ACCESS GRANTED
              </div>
            </div>

            {/* Subtitle */}
            <div
              className="text-base md:text-lg font-mono text-gray-400 tracking-[0.3em] uppercase"
              style={{
                textShadow: '0 0 10px rgba(255,0,64,0.3)',
                animation: 'easterFadeIn 0.5s ease-out',
              }}
            >
              Welcome back, <span className="text-[#ff0040]">Developer</span>.
            </div>

            {/* Decorative line */}
            <div className="flex justify-center mt-2">
              <div
                className="h-[1px] w-48 bg-gradient-to-r from-transparent via-[#ff0040] to-transparent"
                style={{ animation: 'easterLineGrow 0.6s ease-out' }}
              />
            </div>

            {/* Status text */}
            <div className="text-xs font-mono text-[#ff0040]/50 tracking-widest mt-3">
              [ SYSTEM AUTHENTICATED ]
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes easterScan {
          0% { top: -2px; }
          100% { top: 100%; }
        }
        @keyframes easterGlitch {
          0% { transform: translate(0); }
          20% { transform: translate(-3px, 2px); }
          40% { transform: translate(3px, -2px); }
          60% { transform: translate(-2px, -1px); }
          80% { transform: translate(2px, 1px); }
          100% { transform: translate(0); }
        }
        @keyframes easterPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.85; }
        }
        @keyframes easterGlitchLayer1 {
          0%, 90%, 100% { transform: translateX(0); }
          92% { transform: translateX(8px); }
          94% { transform: translateX(-5px); }
          96% { transform: translateX(3px); }
          98% { transform: translateX(-2px); }
        }
        @keyframes easterGlitchLayer2 {
          0%, 88%, 100% { transform: translateX(0); }
          90% { transform: translateX(-6px); }
          92% { transform: translateX(4px); }
          94% { transform: translateX(-3px); }
          96% { transform: translateX(2px); }
        }
        @keyframes easterFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes easterLineGrow {
          from { width: 0; }
          to { width: 12rem; }
        }
      `}</style>
    </div>
  );
}
