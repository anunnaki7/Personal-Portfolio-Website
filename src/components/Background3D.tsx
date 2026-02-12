import { useEffect, useRef } from 'react';

export function Background3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Array<{ x: number; y: number; speed: number; size: number; opacity: number }> = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const particleCount = Math.min(100, Math.floor((canvas.width * canvas.height) / 15000));
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          speed: 0.2 + Math.random() * 0.5,
          size: 1 + Math.random() * 2,
          opacity: 0.1 + Math.random() * 0.4
        });
      }
    };

    const drawGrid = (time: number) => {
      const gridSize = 50;
      const offset = (time * 0.02) % gridSize;
      
      ctx.strokeStyle = 'rgba(255, 0, 64, 0.08)';
      ctx.lineWidth = 1;

      // Vertical lines
      for (let x = -gridSize + offset; x < canvas.width + gridSize; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Horizontal lines
      for (let y = -gridSize + offset; y < canvas.height + gridSize; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    };

    const drawParticles = () => {
      particles.forEach((particle) => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 0, 64, ${particle.opacity})`;
        ctx.fill();

        // Add glow effect
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 3
        );
        gradient.addColorStop(0, `rgba(255, 0, 64, ${particle.opacity * 0.5})`);
        gradient.addColorStop(1, 'rgba(255, 0, 64, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
        ctx.fill();

        // Update position
        particle.y -= particle.speed;
        if (particle.y < -10) {
          particle.y = canvas.height + 10;
          particle.x = Math.random() * canvas.width;
        }
      });
    };

    const drawMatrixRain = (time: number) => {
      const columns = Math.floor(canvas.width / 20);
      ctx.font = '12px monospace';
      
      for (let i = 0; i < columns; i++) {
        if (Math.random() > 0.98) {
          const x = i * 20;
          const y = (time * 0.1 + i * 100) % canvas.height;
          const opacity = 0.1 + Math.random() * 0.2;
          
          ctx.fillStyle = `rgba(255, 0, 64, ${opacity})`;
          ctx.fillText(
            String.fromCharCode(0x30A0 + Math.random() * 96),
            x,
            y
          );
        }
      }
    };

    const animate = (time: number) => {
      ctx.fillStyle = 'rgba(10, 10, 10, 0.95)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawGrid(time);
      drawParticles();
      drawMatrixRain(time);

      animationFrameId = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener('resize', resize);
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ background: '#0a0a0a' }}
    />
  );
}
