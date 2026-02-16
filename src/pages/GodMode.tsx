import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

export function GodMode() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Check authorization
  useEffect(() => {
    const hasAccess = sessionStorage.getItem('godmode') === 'true';
    if (!hasAccess) {
      // Redirect to homepage
      window.location.href = '/';
      return;
    }
    setIsAuthorized(true);
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  // Animated grid background
  useEffect(() => {
    if (!isAuthorized) return;
    
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
    let time = 0;

    const draw = () => {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      const gridSize = 50;
      ctx.strokeStyle = 'rgba(255, 0, 64, 0.1)';
      ctx.lineWidth = 1;

      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Floating particles
      const particleCount = 30;
      for (let i = 0; i < particleCount; i++) {
        const x = ((i * 137.5 + time * 0.5) % canvas.width);
        const y = ((i * 73.3 + time * 0.3) % canvas.height);
        const size = 2 + Math.sin(time * 0.01 + i) * 1;
        
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 0, 64, ${0.3 + Math.sin(time * 0.02 + i) * 0.2})`;
        ctx.fill();
      }

      // Center glow
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, 400
      );
      gradient.addColorStop(0, 'rgba(255, 0, 64, 0.15)');
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      time++;
      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, [isAuthorized]);

  const handleReturn = () => {
    sessionStorage.removeItem('godmode');
    window.location.href = '/';
  };

  const handleDownloadCV = () => {
    // Check if CV file exists, otherwise show alert
    const cvUrl = '/cv.pdf';
    
    // Try to fetch the CV
    fetch(cvUrl, { method: 'HEAD' })
      .then(response => {
        if (response.ok) {
          const link = document.createElement('a');
          link.href = cvUrl;
          link.download = 'Nikola_Lutovac_CV.pdf';
          link.click();
        } else {
          alert('CV file is classified. Contact directly for access.');
        }
      })
      .catch(() => {
        alert('CV file is classified. Contact directly for access.');
      });
  };

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {/* Animated Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
      />

      {/* Scan line overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,0,64,0.03) 2px, rgba(255,0,64,0.03) 4px)',
        }}
      />

      {/* Corner decorations */}
      <div className="absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 border-[#ff0040]/50" />
      <div className="absolute top-4 right-4 w-16 h-16 border-r-2 border-t-2 border-[#ff0040]/50" />
      <div className="absolute bottom-4 left-4 w-16 h-16 border-l-2 border-b-2 border-[#ff0040]/50" />
      <div className="absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 border-[#ff0040]/50" />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[100dvh] px-4 py-8 sm:p-8 overflow-y-auto">
        
        {/* Glitch Title */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="relative mb-8"
        >
          <h1 
            className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-bold font-['Orbitron'] text-white text-center"
            style={{
              textShadow: '0 0 20px rgba(255,0,64,0.5), 0 0 40px rgba(255,0,64,0.3)',
            }}
          >
            <span className="text-[#ff0040]">ACCESS LEVEL:</span>
            <br />
            <span className="relative inline-block">
              GODMODE
              {/* Glitch layers */}
              <span 
                className="absolute inset-0 text-cyan-400 opacity-70 animate-pulse"
                style={{ transform: 'translateX(-2px)', clipPath: 'inset(10% 0 60% 0)' }}
              >
                GODMODE
              </span>
              <span 
                className="absolute inset-0 text-[#ff0040] opacity-70"
                style={{ transform: 'translateX(2px)', clipPath: 'inset(60% 0 10% 0)' }}
              >
                GODMODE
              </span>
            </span>
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isLoaded ? { opacity: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-base sm:text-xl md:text-2xl text-gray-400 font-mono mb-4 sm:mb-6 text-center"
        >
          Welcome back, <span className="text-[#ff0040]">Nikola</span>.
        </motion.p>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isLoaded ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="max-w-xl mx-auto p-4 sm:p-6 border border-[#ff0040]/30 rounded-lg bg-black/50 backdrop-blur-sm mb-6 sm:mb-8"
          style={{
            boxShadow: '0 0 30px rgba(255,0,64,0.1)',
          }}
        >
          <p className="text-gray-300 font-mono text-center leading-relaxed">
            <span className="text-green-400">System unlocked.</span>
            <br />
            This portfolio is now running in <span className="text-[#ff0040]">elite mode</span>.
          </p>

          {/* System Stats */}
          <div className="mt-4 pt-4 border-t border-[#ff0040]/20 grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-[#ff0040] font-mono text-xs">CLEARANCE</div>
              <div className="text-white font-bold">LEVEL 5</div>
            </div>
            <div>
              <div className="text-[#ff0040] font-mono text-xs">ENCRYPTION</div>
              <div className="text-white font-bold">AES-256</div>
            </div>
            <div>
              <div className="text-[#ff0040] font-mono text-xs">STATUS</div>
              <div className="text-green-400 font-bold">ACTIVE</div>
            </div>
          </div>
        </motion.div>

        {/* Return Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7, duration: 0.6 }}
          onClick={handleReturn}
          className="px-6 sm:px-8 py-2.5 sm:py-3 border-2 border-[#ff0040] text-[#ff0040] font-bold font-['Orbitron'] rounded-lg
            hover:bg-[#ff0040] hover:text-black transition-all duration-300 mb-6 sm:mb-8 text-sm sm:text-base"
          style={{
            boxShadow: '0 0 20px rgba(255,0,64,0.2)',
          }}
          whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(255,0,64,0.4)' }}
          whileTap={{ scale: 0.95 }}
        >
          Return to Surface
        </motion.button>

        {/* Classified CV Download */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isLoaded ? { opacity: 1 } : {}}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-8"
        >
          <button
            onClick={handleDownloadCV}
            className="text-gray-500 hover:text-[#ff0040] font-mono text-sm transition-colors duration-300 
              border border-gray-700 hover:border-[#ff0040]/50 px-4 py-2 rounded"
          >
            [ Download Classified CV ]
          </button>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isLoaded ? { opacity: 0.3 } : {}}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="absolute bottom-4 left-0 right-0 text-center"
        >
          <p className="text-gray-600 font-mono text-xs">
            &gt; session: godmode | user: root | access: unlimited
          </p>
        </motion.div>
      </div>
    </div>
  );
}
