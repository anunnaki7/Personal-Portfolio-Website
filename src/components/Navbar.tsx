import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  onLogoClick: () => void;
  onUltraModeActivate: () => void;
}

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Projects', href: '#projects' },
  { name: 'Contact', href: '#contact' },
];

export function Navbar({ onLogoClick, onUltraModeActivate }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [showGlitch, setShowGlitch] = useState(false);
  const [isLongPressing, setIsLongPressing] = useState(false);
  const [menuGlitch, setMenuGlitch] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  // Toggle mobile menu with glitch effect
  const toggleMobileMenu = () => {
    if (!isMobileMenuOpen) {
      setMenuGlitch(true);
      setTimeout(() => setMenuGlitch(false), 300);
    }
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const glitchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const longPressTriggeredRef = useRef(false);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (glitchTimeoutRef.current) {
        clearTimeout(glitchTimeoutRef.current);
      }
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
    };
  }, []);

  // Long press handlers for Ultra Mode activation
  const handleTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    longPressTriggeredRef.current = false;
    setIsLongPressing(true);
    
    longPressTimerRef.current = setTimeout(() => {
      longPressTriggeredRef.current = true;
      setIsLongPressing(false);
      // Show glitch
      setShowGlitch(true);
      setTimeout(() => setShowGlitch(false), 300);
      // Activate Ultra Mode
      onUltraModeActivate();
    }, 1500); // 1.5 seconds
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.stopPropagation();
    setIsLongPressing(false);
    
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }
    
    // If long press was triggered, don't do normal click
    if (longPressTriggeredRef.current) {
      e.preventDefault();
      return;
    }
    
    // Normal tap - open terminal
    handleLogoClick();
  };

  const handleTouchCancel = () => {
    setIsLongPressing(false);
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }
  };

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      const sections = navLinks.map(link => link.href.slice(1));
      for (const section of sections.reverse()) {
        const element = document.getElementById(section);
        if (element && window.scrollY >= element.offsetTop - 200) {
          setActiveSection(section);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // SIMPLE SINGLE CLICK - Opens terminal IMMEDIATELY
  const handleLogoClick = () => {
    // Clear any existing timeout
    if (glitchTimeoutRef.current) {
      clearTimeout(glitchTimeoutRef.current);
    }
    
    // Show glitch effect
    setShowGlitch(true);
    
    // Open terminal IMMEDIATELY - no delay
    onLogoClick();
    
    // Hide glitch after 200ms (visual only, terminal already open)
    glitchTimeoutRef.current = setTimeout(() => {
      setShowGlitch(false);
    }, 200);
  };

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled ? 'bg-black/90 backdrop-blur-md border-b border-[#ff0040]/20' : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo - SINGLE CLICK opens terminal, LONG PRESS opens Ultra Mode */}
          <motion.button
            type="button"
            onClick={handleLogoClick}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchCancel}
            className={`cursor-pointer relative z-50 select-none ${isLongPressing ? 'scale-95' : ''}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            style={{ touchAction: 'none' }}
          >
            <svg 
              width="60" 
              height="30" 
              viewBox="0 0 120 60" 
              className="drop-shadow-[0_0_10px_rgba(255,0,64,0.5)]"
            >
              <defs>
                <filter id="navGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <path
                d="M10 50 L10 10 L15 10 L35 40 L35 10 L42 10 L42 50 L37 50 L17 20 L17 50 Z"
                fill="#ff0040"
                filter="url(#navGlow)"
              />
              <circle cx="55" cy="45" r="3" fill="#ff0040" filter="url(#navGlow)" />
              <path
                d="M68 10 L75 10 L75 43 L100 43 L100 50 L68 50 Z"
                fill="#ff0040"
                filter="url(#navGlow)"
              />
            </svg>
          </motion.button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <motion.a
                key={link.name}
                href={link.href}
                className={`font-mono text-sm transition-colors relative group ${
                  activeSection === link.href.slice(1)
                    ? 'text-[#ff0040]'
                    : 'text-gray-400 hover:text-white'
                }`}
                whileHover={{ y: -2 }}
              >
                {link.name}
                {activeSection === link.href.slice(1) && (
                  <motion.div
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#ff0040]"
                    layoutId="activeSection"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    style={{ boxShadow: '0 0 8px rgba(255,0,64,0.5)' }}
                  />
                )}
                {activeSection !== link.href.slice(1) && (
                  <span 
                    className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#ff0040]/70 group-hover:w-full transition-all duration-300 ease-out"
                    style={{ boxShadow: '0 0 6px rgba(255,0,64,0.4)' }}
                  />
                )}
              </motion.a>
            ))}
          </div>

          {/* Mobile Menu Button - Hacker Style */}
          <motion.button
            className="md:hidden relative p-3 group"
            onClick={toggleMobileMenu}
            whileTap={{ scale: 0.9 }}
            style={{
              filter: 'drop-shadow(0 0 8px rgba(255,0,64,0.6))',
            }}
          >
            {/* Hamburger to X animation */}
            <div className="relative w-6 h-5 flex flex-col justify-between">
              <motion.span
                className="block h-0.5 w-full bg-[#ff0040] origin-left"
                animate={isMobileMenuOpen ? { rotate: 45, y: 0, x: 1 } : { rotate: 0, y: 0, x: 0 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                style={{ boxShadow: '0 0 8px rgba(255,0,64,0.8)' }}
              />
              <motion.span
                className="block h-0.5 w-full bg-[#ff0040]"
                animate={isMobileMenuOpen ? { opacity: 0, x: -20 } : { opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                style={{ boxShadow: '0 0 8px rgba(255,0,64,0.8)' }}
              />
              <motion.span
                className="block h-0.5 w-full bg-[#ff0040] origin-left"
                animate={isMobileMenuOpen ? { rotate: -45, y: 0, x: 1 } : { rotate: 0, y: 0, x: 0 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                style={{ boxShadow: '0 0 8px rgba(255,0,64,0.8)' }}
              />
            </div>
            
            {/* Glow pulse ring */}
            <motion.div
              className="absolute inset-0 rounded-lg border border-[#ff0040]/30"
              animate={{ 
                boxShadow: isMobileMenuOpen 
                  ? ['0 0 10px rgba(255,0,64,0.3)', '0 0 20px rgba(255,0,64,0.5)', '0 0 10px rgba(255,0,64,0.3)']
                  : '0 0 0px rgba(255,0,64,0)'
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu - Cyberpunk Hacker Style */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop with blur */}
            <motion.div
              className="md:hidden fixed inset-0 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsMobileMenuOpen(false)}
              style={{
                background: 'rgba(0,0,0,0.85)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
              }}
            />

            {/* Menu Panel - Slide from right */}
            <motion.div
              className="md:hidden fixed top-0 right-0 bottom-0 z-50 w-[85%] max-w-[320px] flex flex-col overflow-hidden"
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ 
                type: 'spring',
                damping: 30,
                stiffness: 300,
                duration: 0.3
              }}
              style={{
                background: 'linear-gradient(135deg, rgba(10,10,10,0.98) 0%, rgba(20,0,5,0.98) 100%)',
                borderLeft: '1px solid rgba(255,0,64,0.4)',
                boxShadow: '-10px 0 60px rgba(255,0,64,0.2), inset 1px 0 30px rgba(255,0,64,0.05)',
              }}
            >
              {/* Scan line effect */}
              <div 
                className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                  background: 'repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(255,0,64,0.03) 2px, rgba(255,0,64,0.03) 4px)',
                }}
              />

              {/* Matrix-like animated lines - 5% opacity */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.05]">
                {/* Vertical falling lines */}
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={`matrix-line-${i}`}
                    className="absolute top-0 w-[1px] bg-gradient-to-b from-transparent via-[#ff0040] to-transparent"
                    style={{
                      left: `${8 + i * 8}%`,
                      height: '100%',
                    }}
                    animate={{
                      y: ['-100%', '100%'],
                      opacity: [0, 1, 1, 0],
                    }}
                    transition={{
                      duration: 2 + (i % 3) * 0.5,
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: 'linear',
                    }}
                  />
                ))}
                
                {/* Horizontal scanning lines */}
                <motion.div
                  className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#ff0040] to-transparent"
                  animate={{
                    y: [0, 500, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />
                <motion.div
                  className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#ff0040]/50 to-transparent"
                  animate={{
                    y: [500, 0, 500],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />

                {/* Random flickering dots */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={`matrix-dot-${i}`}
                    className="absolute w-1 h-1 rounded-full bg-[#ff0040]"
                    style={{
                      left: `${10 + (i * 12) % 80}%`,
                      top: `${15 + (i * 17) % 70}%`,
                    }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1 + (i % 3) * 0.5,
                      repeat: Infinity,
                      delay: i * 0.3,
                    }}
                  />
                ))}

                {/* Data stream characters */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={`matrix-char-${i}`}
                    className="absolute font-mono text-[8px] text-[#ff0040]"
                    style={{
                      left: `${5 + i * 18}%`,
                    }}
                    animate={{
                      y: ['-20px', '120%'],
                      opacity: [0, 1, 1, 0],
                    }}
                    transition={{
                      duration: 3 + (i % 2),
                      repeat: Infinity,
                      delay: i * 0.5,
                      ease: 'linear',
                    }}
                  >
                    {['0', '1', 'N', 'L', '>', '<'][i % 6]}
                  </motion.div>
                ))}
              </div>

              {/* Glitch effect on open */}
              {menuGlitch && (
                <motion.div
                  className="absolute inset-0 z-50 pointer-events-none"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-[#ff0040]/20"
                    animate={{ x: [0, -10, 5, -3, 0] }}
                    transition={{ duration: 0.15 }}
                  />
                  <motion.div
                    className="absolute inset-0 bg-cyan-500/10"
                    animate={{ x: [0, 10, -5, 3, 0] }}
                    transition={{ duration: 0.15 }}
                  />
                </motion.div>
              )}

              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-[#ff0040]/20">
                <div className="flex items-center gap-3">
                  <motion.div
                    className="w-2 h-2 rounded-full bg-[#ff0040]"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    style={{ boxShadow: '0 0 8px rgba(255,0,64,0.8)' }}
                  />
                  <span className="font-mono text-xs text-[#ff0040]/70 tracking-wider">
                    NAVIGATION_SYSTEM
                  </span>
                </div>
                <motion.button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-[#ff0040] hover:bg-[#ff0040]/10 rounded transition-colors"
                  whileTap={{ scale: 0.9 }}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>
              
              {/* Navigation Links */}
              <div className="flex-1 flex flex-col py-8 px-6 space-y-2">
                {navLinks.map((link, index) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    className={`relative block font-mono text-lg py-4 px-4 rounded-lg transition-all duration-200 group overflow-hidden ${
                      activeSection === link.href.slice(1)
                        ? 'text-[#ff0040] bg-[#ff0040]/10'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.08, duration: 0.3 }}
                    onMouseEnter={() => setHoveredLink(link.name)}
                    onMouseLeave={() => setHoveredLink(null)}
                    onTouchStart={() => setHoveredLink(link.name)}
                    onTouchEnd={() => setHoveredLink(null)}
                  >
                    {/* Scan line hover effect */}
                    {hoveredLink === link.name && (
                      <motion.div
                        className="absolute inset-0 pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <motion.div
                          className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#ff0040] to-transparent"
                          initial={{ top: 0 }}
                          animate={{ top: '100%' }}
                          transition={{ duration: 0.5, repeat: Infinity }}
                          style={{ opacity: 0.5 }}
                        />
                      </motion.div>
                    )}
                    
                    {/* Active indicator */}
                    {activeSection === link.href.slice(1) && (
                      <motion.div
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#ff0040] rounded-r"
                        layoutId="mobileActiveIndicator"
                        style={{ boxShadow: '0 0 15px rgba(255,0,64,0.8)' }}
                      />
                    )}

                    <div className="flex items-center gap-3">
                      <span className="text-[#ff0040] opacity-50 group-hover:opacity-100 transition-opacity">
                        {'>'}
                      </span>
                      <span className="relative">
                        {link.name}
                        {/* Flicker effect on hover */}
                        {hoveredLink === link.name && (
                          <motion.span
                            className="absolute inset-0 text-[#ff0040]"
                            animate={{ opacity: [0, 1, 0, 1, 0] }}
                            transition={{ duration: 0.3 }}
                          >
                            {link.name}
                          </motion.span>
                        )}
                      </span>
                    </div>

                    {/* Link number */}
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-xs text-[#ff0040]/30">
                      0{index + 1}
                    </span>
                  </motion.a>
                ))}
              </div>
              
              {/* Footer */}
              <div className="p-6 border-t border-[#ff0040]/20">
                {/* Status indicator */}
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs text-gray-500">STATUS:</span>
                  <div className="flex items-center gap-2">
                    <motion.div
                      className="w-2 h-2 rounded-full bg-green-500"
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      style={{ boxShadow: '0 0 6px rgba(34,197,94,0.8)' }}
                    />
                    <span className="font-mono text-xs text-green-500">ONLINE</span>
                  </div>
                </div>
                
                {/* Logo */}
                <div className="flex justify-center">
                  <motion.svg 
                    width="60" 
                    height="30" 
                    viewBox="0 0 120 60" 
                    className="opacity-40"
                    animate={{ opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <path d="M10 50 L10 10 L15 10 L35 40 L35 10 L42 10 L42 50 L37 50 L17 20 L17 50 Z" fill="#ff0040" />
                    <circle cx="55" cy="45" r="3" fill="#ff0040" />
                    <path d="M68 10 L75 10 L75 43 L100 43 L100 50 L68 50 Z" fill="#ff0040" />
                  </motion.svg>
                </div>
              </div>

              {/* Corner decorations */}
              <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-[#ff0040]/30" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-[#ff0040]/30" />
              <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-[#ff0040]/30" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-[#ff0040]/30" />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Glitch Overlay Effect */}
      <AnimatePresence>
        {showGlitch && (
          <motion.div
            className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.05 }}
          >
            <motion.div
              className="absolute inset-0 bg-red-500/30 mix-blend-screen"
              animate={{ x: [0, -8, 4, -2, 0], opacity: [0.3, 0.5, 0.3, 0.6, 0.3] }}
              transition={{ duration: 0.2, ease: 'linear' }}
            />
            <motion.div
              className="absolute inset-0 bg-cyan-500/30 mix-blend-screen"
              animate={{ x: [0, 8, -4, 2, 0], opacity: [0.3, 0.6, 0.3, 0.5, 0.3] }}
              transition={{ duration: 0.2, ease: 'linear' }}
            />
            <motion.div
              className="absolute inset-0"
              animate={{ x: [0, -4, 4, -2, 2, 0] }}
              transition={{ duration: 0.15, ease: 'linear' }}
            >
              <div 
                className="absolute inset-0"
                style={{
                  background: 'repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(255,0,64,0.1) 2px, rgba(255,0,64,0.1) 4px)',
                }}
              />
            </motion.div>
            <motion.div
              className="absolute inset-0 bg-[#ff0040]/20"
              animate={{ opacity: [0, 0.4, 0, 0.3, 0] }}
              transition={{ duration: 0.2, ease: 'linear' }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
