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
      className={`fixed z-[9999] w-11 h-11 md:w-12 md:h-12
        flex items-center justify-center rounded-full cursor-pointer
        transition-all duration-500 ease-out group
        ${isVisible 
          ? 'opacity-100 pointer-events-auto' 
          : 'opacity-0 pointer-events-none'
        }`}
      style={{
        bottom: '24px',
        right: '24px',
        transform: isVisible 
          ? `scale(${isHovered ? 1.1 : 1})` 
          : 'translateY(20px) scale(0.9)',
        background: isHovered
          ? 'linear-gradient(135deg, rgba(255,0,64,0.25) 0%, rgba(20,0,5,0.95) 100%)'
          : 'linear-gradient(135deg, rgba(20,0,5,0.95) 0%, rgba(10,5,5,0.98) 100%)',
        border: `2px solid ${isHovered ? 'rgba(255,0,64,1)' : 'rgba(255,0,64,0.5)'}`,
        boxShadow: isHovered
          ? '0 0 35px rgba(255,0,64,0.6), 0 0 70px rgba(255,0,64,0.3), inset 0 0 20px rgba(255,0,64,0.15)'
          : '0 0 20px rgba(255,0,64,0.2), inset 0 0 10px rgba(255,0,64,0.05)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Arrow icon */}
      <svg
        width="18"
        height="18"
        viewBox="0 0 20 20"
        fill="none"
        className="transition-all duration-300"
        style={{
          filter: isHovered
            ? 'drop-shadow(0 0 12px rgba(255,0,64,1))'
            : 'drop-shadow(0 0 5px rgba(255,0,64,0.6))',
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
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#ff0040]/50 rounded-tl-lg" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#ff0040]/50 rounded-tr-lg" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#ff0040]/50 rounded-bl-lg" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#ff0040]/50 rounded-br-lg" />

      {/* Pulse ring on hover */}
      {isHovered && (
        <div
          className="absolute inset-0 rounded-lg"
          style={{
            border: '1px solid rgba(255,0,64,0.4)',
            animation: 'bttPulseRing 1.2s ease-out infinite',
          }}
        />
      )}

      {/* Scan line inside button */}
      <div
        className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,0,64,0.03) 3px, rgba(255,0,64,0.03) 6px)',
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
