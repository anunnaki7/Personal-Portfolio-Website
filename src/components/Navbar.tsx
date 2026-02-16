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

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden text-[#ff0040] p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileTap={{ scale: 0.95 }}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu - Full Screen Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden fixed inset-0 top-0 z-50 bg-black/98 backdrop-blur-xl flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex justify-end p-6">
              <motion.button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-[#ff0040] p-2"
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center space-y-8">
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  className={`block font-mono text-2xl ${
                    activeSection === link.href.slice(1)
                      ? 'text-[#ff0040]'
                      : 'text-gray-400'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  style={{ textShadow: activeSection === link.href.slice(1) ? '0 0 20px rgba(255,0,64,0.5)' : 'none' }}
                >
                  <span className="text-[#ff0040]">{'>'}</span> {link.name}
                </motion.a>
              ))}
            </div>
            
            <div className="p-8 flex justify-center">
              <svg width="80" height="40" viewBox="0 0 120 60" className="opacity-30">
                <path d="M10 50 L10 10 L15 10 L35 40 L35 10 L42 10 L42 50 L37 50 L17 20 L17 50 Z" fill="#ff0040" />
                <circle cx="55" cy="45" r="3" fill="#ff0040" />
                <path d="M68 10 L75 10 L75 43 L100 43 L100 50 L68 50 Z" fill="#ff0040" />
              </svg>
            </div>
          </motion.div>
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
