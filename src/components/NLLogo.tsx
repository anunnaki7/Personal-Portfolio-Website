import { useState } from 'react';
import { motion } from 'framer-motion';

interface NLLogoProps {
  size?: number;
  onClick?: () => void;
}

export function NLLogo({ size = 120, onClick }: NLLogoProps) {
  const [isHovered, setIsHovered] = useState(false);
  const height = size / 2;

  return (
    <motion.div
      onClick={onClick}
      className="cursor-pointer select-none relative group"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Custom SVG Logo */}
      <svg 
        width={size} 
        height={height} 
        viewBox="0 0 120 60" 
        className="drop-shadow-[0_0_20px_rgba(255,0,64,0.5)]"
      >
        {/* Glow filter */}
        <defs>
          <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {/* N letter - angular cyberpunk style */}
        <path
          d="M10 50 L10 10 L15 10 L35 40 L35 10 L42 10 L42 50 L37 50 L17 20 L17 50 Z"
          fill="#ff0040"
          filter="url(#neonGlow)"
          className={isHovered ? 'animate-pulse' : ''}
        />
        
        {/* Dot separator */}
        <circle cx="55" cy="45" r="4" fill="#ff0040" filter="url(#neonGlow)" />
        
        {/* L letter - angular cyberpunk style */}
        <path
          d="M68 10 L75 10 L75 43 L100 43 L100 50 L68 50 Z"
          fill="#ff0040"
          filter="url(#neonGlow)"
          className={isHovered ? 'animate-pulse' : ''}
        />
        
        {/* Accent lines */}
        <line x1="5" y1="55" x2="115" y2="55" stroke="#ff0040" strokeWidth="1" opacity="0.3" />
        <line x1="5" y1="5" x2="50" y2="5" stroke="#ff0040" strokeWidth="1" opacity="0.3" />
        <line x1="70" y1="5" x2="115" y2="5" stroke="#ff0040" strokeWidth="1" opacity="0.3" />
      </svg>
      
      {/* Glitch overlay on hover */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0] }}
          transition={{ duration: 0.2, repeat: Infinity }}
        >
          <svg 
            width={size} 
            height={height} 
            viewBox="0 0 120 60" 
            style={{ transform: 'translateX(2px)' }}
          >
            <path
              d="M10 50 L10 10 L15 10 L35 40 L35 10 L42 10 L42 50 L37 50 L17 20 L17 50 Z"
              fill="cyan"
              opacity="0.5"
            />
            <path
              d="M68 10 L75 10 L75 43 L100 43 L100 50 L68 50 Z"
              fill="cyan"
              opacity="0.5"
            />
          </svg>
        </motion.div>
      )}
    </motion.div>
  );
}
