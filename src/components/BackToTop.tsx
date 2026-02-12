import { useState, useEffect } from 'react';

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={scrollToTop}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Back to top"
      className={`fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 w-12 h-12 md:w-14 md:h-14 
        flex items-center justify-center rounded-lg cursor-pointer
        transition-all duration-500 ease-out group
        ${isVisible 
          ? 'opacity-100 translate-y-0 pointer-events-auto' 
          : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      style={{
        background: isHovered
          ? 'linear-gradient(135deg, rgba(255,0,64,0.15) 0%, rgba(20,0,5,0.95) 100%)'
          : 'linear-gradient(135deg, rgba(20,0,5,0.9) 0%, rgba(10,5,5,0.95) 100%)',
        border: `1px solid ${isHovered ? 'rgba(255,0,64,0.8)' : 'rgba(255,0,64,0.3)'}`,
        boxShadow: isHovered
          ? '0 0 25px rgba(255,0,64,0.4), 0 0 50px rgba(255,0,64,0.15), inset 0 0 20px rgba(255,0,64,0.1)'
          : '0 0 10px rgba(255,0,64,0.1), inset 0 0 10px rgba(255,0,64,0.03)',
        backdropFilter: 'blur(10px)',
        transform: `${isVisible ? 'translateY(0)' : 'translateY(16px)'} scale(${isHovered ? 1.08 : 1})`,
      }}
    >
      {/* Arrow icon */}
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        className="transition-all duration-300"
        style={{
          filter: isHovered
            ? 'drop-shadow(0 0 8px rgba(255,0,64,0.8))'
            : 'drop-shadow(0 0 3px rgba(255,0,64,0.4))',
          transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
        }}
      >
        <path
          d="M10 3L3 12H7.5V17H12.5V12H17L10 3Z"
          fill="#ff0040"
          stroke="#ff0040"
          strokeWidth="0.5"
          strokeLinejoin="round"
        />
      </svg>

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-[#ff0040]/40 rounded-tl-lg" />
      <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-[#ff0040]/40 rounded-tr-lg" />
      <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-[#ff0040]/40 rounded-bl-lg" />
      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-[#ff0040]/40 rounded-br-lg" />

      {/* Pulse ring on hover */}
      {isHovered && (
        <div
          className="absolute inset-0 rounded-lg"
          style={{
            border: '1px solid rgba(255,0,64,0.3)',
            animation: 'bttPulseRing 1.2s ease-out infinite',
          }}
        />
      )}

      {/* Scan line inside button */}
      <div
        className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,0,64,0.02) 3px, rgba(255,0,64,0.02) 6px)',
        }}
      />

      <style>{`
        @keyframes bttPulseRing {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.5); opacity: 0; }
        }
      `}</style>
    </button>
  );
}
