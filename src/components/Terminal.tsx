import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Hacker closing sound
const playClosingSound = () => {
  try {
    const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Digital shutdown sound - descending tone
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 0.3);
    
    gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.35);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.35);
  } catch {
    // Silent fail
  }
};

// Ultra Mode activation sound
const playUltraSound = () => {
  try {
    const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Digital distortion sound
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(80, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(250, audioContext.currentTime + 0.1);
    oscillator.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 0.25);
    
    gainNode.gain.setValueAtTime(0.04, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  } catch {
    // Silent fail
  }
};

const ASCII_LOGO = `
███╗   ██╗██╗     
████╗  ██║██║     
██╔██╗ ██║██║     
██║╚██╗██║██║     
██║ ╚████║███████╗
╚═╝  ╚═══╝╚══════╝
`;

// Time-based greeting helper
const getTimeBasedGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Good morning';
  if (hour >= 12 && hour < 18) return 'Good afternoon';
  return 'Good evening';
};

// Check if operator mode is active
const isOperatorMode = (): boolean => {
  return localStorage.getItem('nl_operator_mode') === 'true';
};

// Set operator mode
const setOperatorMode = (): void => {
  localStorage.setItem('nl_operator_mode', 'true');
};

interface TerminalProps {
  isOpen: boolean;
  onClose: () => void;
  startInUltraMode?: boolean;
}

interface HistoryItem {
  type: 'input' | 'output' | 'ascii' | 'error' | 'success' | 'progress';
  content: string;
}

export function Terminal({ isOpen, onClose, startInUltraMode = false }: TerminalProps) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHacking, setIsHacking] = useState(false);
  const [hackProgress, setHackProgress] = useState(0);
  const [showAccessGranted, setShowAccessGranted] = useState(false);
  const [isRootAccess, setIsRootAccess] = useState(false);
  const [isBooting, setIsBooting] = useState(true);
  const [glowIntensity, setGlowIntensity] = useState(0);
  // Ultra Mode states
  const [isUltraMode, setIsUltraMode] = useState(false);
  const [showUltraGlitch, setShowUltraGlitch] = useState(false);
  const [showOmegaOverlay, setShowOmegaOverlay] = useState(false);
  // Hacker-style closing states
  const [isClosing, setIsClosing] = useState(false);
  const [closingText, setClosingText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const hasBootedRef = useRef(false);
  const isFirstOpenRef = useRef(true);
  const headerRef = useRef<HTMLDivElement>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const keysPressed = useRef<Set<string>>(new Set());

  const scrollToBottom = () => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  };

  // Hacker-style closing sequence
  const initiateHackerClose = useCallback(() => {
    if (isClosing) return;
    
    playClosingSound();
    setIsClosing(true);
    
    // Phase 1: Glitch effect
    setClosingText('TERMINATING...');
    
    setTimeout(() => {
      setClosingText('CONNECTION LOST');
    }, 200);
    
    setTimeout(() => {
      setClosingText('SIGNAL TERMINATED');
    }, 400);
    
    setTimeout(() => {
      setClosingText('');
      setIsClosing(false);
      setIsUltraMode(false);
      onClose();
    }, 700);
  }, [isClosing, onClose]);

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  // Ultra Mode activation function
  const activateUltraMode = useCallback(() => {
    if (isUltraMode) return;
    
    // Play sound
    playUltraSound();
    
    // Show glitch effect
    setShowUltraGlitch(true);
    
    setTimeout(() => {
      setShowUltraGlitch(false);
      setIsUltraMode(true);
      
      // Add Ultra Mode message to terminal
      setHistory(prev => [...prev, 
        { type: 'output', content: '' },
        { type: 'success', content: '[ULTRA MODE ACTIVATED]' },
        { type: 'success', content: 'Clearance level: OMEGA' },
        { type: 'success', content: 'Welcome back, Operator.' },
        { type: 'output', content: '' },
      ]);
    }, 300);
  }, [isUltraMode]);

  // Auto-activate Ultra Mode if startInUltraMode is true
  useEffect(() => {
    if (isOpen && startInUltraMode && !isUltraMode) {
      // Small delay to let terminal render first
      const timer = setTimeout(() => {
        activateUltraMode();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, startInUltraMode, isUltraMode, activateUltraMode]);

  // Keyboard activation: Shift + N + L
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.key.toLowerCase());
      
      // Check for Shift + N + L
      if (e.shiftKey && keysPressed.current.has('n') && keysPressed.current.has('l')) {
        activateUltraMode();
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key.toLowerCase());
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      keysPressed.current.clear();
    };
  }, [isOpen, activateUltraMode]);

  // Mobile long press on header (1.5s)
  const handleHeaderTouchStart = useCallback(() => {
    longPressTimerRef.current = setTimeout(() => {
      activateUltraMode();
    }, 1500);
  }, [activateUltraMode]);

  const handleHeaderTouchEnd = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, []);

  // Typewriter effect for premium feel
  const typewriterEffect = useCallback((lines: HistoryItem[], callback?: () => void) => {
    let currentIndex = 0;
    const typeNextLine = () => {
      if (currentIndex < Math.min(lines.length, 3)) {
        const line = lines[currentIndex];
        const chars = line.content.split('');
        let charIndex = 0;
        
        // Add empty line first
        setHistory(prev => [...prev, { ...line, content: '' }]);
        
        const typeChar = () => {
          if (charIndex < chars.length) {
            setHistory(prev => {
              const newHistory = [...prev];
              const lastItem = newHistory[newHistory.length - 1];
              lastItem.content = chars.slice(0, charIndex + 1).join('');
              return newHistory;
            });
            charIndex++;
            setTimeout(typeChar, 40); // 40ms per character
          } else {
            currentIndex++;
            setTimeout(typeNextLine, 60);
          }
        };
        typeChar();
      } else {
        // Add remaining lines instantly
        setHistory(prev => [...prev, ...lines.slice(currentIndex)]);
        callback?.();
      }
    };
    typeNextLine();
  }, []);

  useEffect(() => {
    if (isOpen) {
      // Animate glow intensity
      setGlowIntensity(0);
      const glowTimer = setTimeout(() => setGlowIntensity(1), 50);
      
      // Boot delay only on first open (80ms for premium feel)
      const bootDelay = hasBootedRef.current ? 0 : 80;
      const useTypewriter = isFirstOpenRef.current;
      hasBootedRef.current = true;
      isFirstOpenRef.current = false;
      
      setIsBooting(true);
      
      const bootTimer = setTimeout(() => {
        // Check for operator mode (returning user)
        if (isOperatorMode()) {
          // Returning user - show recognition protocol
          const greeting = getTimeBasedGreeting();
          const lines: HistoryItem[] = [
            { type: 'success', content: '[RECOGNITION PROTOCOL INITIATED...]' },
            { type: 'output', content: '' },
            { type: 'success', content: `${greeting}, Operator.` },
            { type: 'output', content: '' },
            { type: 'output', content: 'System integrity: STABLE' },
            { type: 'output', content: 'Access level: ROOT' },
            { type: 'output', content: 'Memory state: RESTORED' },
            { type: 'output', content: '' },
            { type: 'output', content: 'Type "help" for available commands.\n' },
          ];
          
          if (useTypewriter) {
            setHistory([]);
            typewriterEffect(lines, () => setIsBooting(false));
          } else {
            setHistory(lines);
            setIsBooting(false);
          }
        } else {
          // First time user - show default intro and set operator mode
          const lines: HistoryItem[] = [
            { type: 'ascii', content: ASCII_LOGO },
            { type: 'output', content: 'NIKOLA LUTOVAC TERMINAL v1.0.0' },
            { type: 'output', content: 'Type "help" for available commands.\n' },
          ];
          
          if (useTypewriter) {
            setHistory([]);
            typewriterEffect(lines, () => setIsBooting(false));
          } else {
            setHistory(lines);
            setIsBooting(false);
          }
          // Set operator mode for next time
          setOperatorMode();
        }
        inputRef.current?.focus();
      }, bootDelay);
      
      return () => {
        clearTimeout(bootTimer);
        clearTimeout(glowTimer);
      };
    }
  }, [isOpen, typewriterEffect]);

  const playSound = (type: 'key' | 'success' | 'error') => {
    // Audio context for sound effects
    try {
      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      if (type === 'key') {
        oscillator.frequency.value = 800;
        gainNode.gain.value = 0.1;
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.05);
      } else if (type === 'success') {
        oscillator.frequency.value = 1200;
        gainNode.gain.value = 0.2;
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.2);
      } else if (type === 'error') {
        oscillator.frequency.value = 200;
        gainNode.gain.value = 0.2;
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.3);
      }
    } catch {
      // Audio not supported
    }
  };

  const executeCommand = useCallback((cmd: string) => {
    const command = cmd.toLowerCase().trim();
    
    setHistory(prev => [...prev, { type: 'input', content: `> ${cmd}` }]);
    
    // Check for sudo nl --root command
    if (command === 'sudo nl --root') {
      setIsRootAccess(true);
      playSound('success');
      
      setHistory(prev => [...prev, {
        type: 'success',
        content: '\n[ROOT ACCESS GRANTED]'
      }]);
      
      setTimeout(() => {
        setHistory(prev => [...prev, {
          type: 'success',
          content: 'Redirecting to GODMODE...'
        }]);
      }, 400);
      
      setTimeout(() => {
        // Set sessionStorage and navigate
        sessionStorage.setItem('godmode', 'true');
        window.location.href = '/godmode';
      }, 1200);
      
      return;
    }
    
    switch (command) {
      case 'help':
        setHistory(prev => [...prev, {
          type: 'output',
          content: `
Available Commands:
─────────────────────────────
  help     - Show this help message
  about    - Learn about Nikola
  skills   - View technical skills
  projects - List all projects
  github   - Open GitHub profile
  contact  - Contact information
  visits   - View visitor log
  hack     - [CLASSIFIED] Mini-game
  clear    - Clear terminal
  exit     - Close terminal
─────────────────────────────`
        }]);
        break;
        
      case 'about':
        setHistory(prev => [...prev, {
          type: 'output',
          content: `
╔══════════════════════════════════════╗
║           NIKOLA LUTOVAC             ║
╠══════════════════════════════════════╣
║  Location: Montenegro                ║
║  Role: Vibe Coding Developer         ║
║  Experience: 1+ year                 ║
║  Passion: Building digital dreams    ║
╚══════════════════════════════════════╝

"Code is poetry written in logic."
`
        }]);
        break;
        
      case 'skills':
        setHistory(prev => [...prev, {
          type: 'output',
          content: `
[SKILL MATRIX LOADING...]

Frontend:  React ████████████ 95%
           TypeScript █████████░ 90%
           Tailwind ████████████ 92%
           
Backend:   Node.js ██████████░ 85%
           Python ████████░░░ 80%
           SQL ████████░░░ 82%
           
Tools:     Git ████████████ 90%
           Docker ███████░░░░ 75%
`
        }]);
        break;
        
      case 'projects':
        setHistory(prev => [...prev, {
          type: 'output',
          content: `
[ACCESSING PROJECT DATABASE...]

1. Monte Quad Kolašin
   Status: DEPLOYED ✓
   Tech: React, TypeScript, Tailwind
   
2. CryptoTracker Pro
   Status: DEPLOYED ✓
   Tech: Next.js, Chart.js
   
3. TaskFlow
   Status: DEPLOYED ✓
   Tech: React, Redux, Socket.io
   
4. DevPortfolio Builder
   Status: DEPLOYED ✓
   Tech: TypeScript, React, MDX

Type 'github' to view source code.
`
        }]);
        break;
        
      case 'github':
        setHistory(prev => [...prev, {
          type: 'success',
          content: '[OPENING GITHUB...] Redirecting to profile...'
        }]);
        setTimeout(() => {
          window.open('https://github.com', '_blank');
        }, 1000);
        break;
        
      case 'contact':
        setHistory(prev => [...prev, {
          type: 'output',
          content: `
╔══════════════════════════════════════╗
║         CONTACT INFORMATION          ║
╠══════════════════════════════════════╣
║  Email:    dzoni.luta07@gmail.com    ║
║  GitHub:   github.com                ║
║  Instagram: @38nikola                ║
║  LinkedIn: linkedin.com              ║
╚══════════════════════════════════════╝
`
        }]);
        break;
        
      case 'visits':
      case 'log':
      case 'history':
        const totalVisits = localStorage.getItem('nl_total_visits') || '0';
        const firstVisit = localStorage.getItem('nl_first_visit');
        const lastVisit = localStorage.getItem('nl_last_visit');
        const visits = JSON.parse(localStorage.getItem('nl_visits') || '[]');
        
        const firstDate = firstVisit ? new Date(firstVisit).toLocaleDateString('en-GB', {
          year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        }) : 'N/A';
        
        const lastDate = lastVisit ? new Date(lastVisit).toLocaleDateString('en-GB', {
          year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        }) : 'N/A';
        
        // Get last 5 visits for display
        const recentVisits = visits.slice(0, 5).map((v: { date: string; time: string; device: string; screen: string }, i: number) => 
          `  ${i + 1}. ${v.date} at ${v.time} (${v.device}, ${v.screen})`
        ).join('\n');
        
        setHistory(prev => [...prev, {
          type: 'output',
          content: `
╔══════════════════════════════════════╗
║           VISITOR LOG                ║
╠══════════════════════════════════════╣
║  Total Visits: ${totalVisits.padEnd(22)}║
║  First Visit:  ${firstDate.padEnd(22)}║
║  Last Visit:   ${lastDate.padEnd(22)}║
╚══════════════════════════════════════╝

Recent Visits:
─────────────────────────────
${recentVisits || '  No visits recorded yet.'}
─────────────────────────────
`
        }]);
        break;
        
      case 'hack':
        if (!isHacking) {
          setIsHacking(true);
          setHackProgress(0);
          setHistory(prev => [...prev, {
            type: 'output',
            content: '[INITIATING HACK SEQUENCE...]'
          }]);
          
          // Simulate hacking progress
          let progress = 0;
          const hackInterval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
              progress = 100;
              clearInterval(hackInterval);
              setIsHacking(false);
              setShowAccessGranted(true);
              playSound('success');
              
              setHistory(prev => [...prev, {
                type: 'success',
                content: `
╔══════════════════════════════════════╗
║         █ ACCESS GRANTED █           ║
╠══════════════════════════════════════╣
║   Welcome to the inner sanctum.      ║
║   You've proven your hacking skills! ║
║                                      ║
║   Easter Egg Unlocked: You're 🔥     ║
╚══════════════════════════════════════╝
`
              }]);
              
              setTimeout(() => setShowAccessGranted(false), 3000);
            }
            setHackProgress(Math.min(progress, 100));
          }, 200);
        }
        break;
        
      case 'clear':
        setHistory([
          { type: 'ascii', content: ASCII_LOGO },
          { type: 'output', content: 'Terminal cleared.\n' },
        ]);
        break;
        
      case 'exit':
        setHistory(prev => [...prev, {
          type: 'output',
          content: '[CLOSING TERMINAL...] Goodbye!'
        }]);
        setTimeout(onClose, 500);
        break;
        
      case 'sudo nl':
      case 'sudo':
        setHistory(prev => [...prev, {
          type: 'success',
          content: '[ROOT ACCESS GRANTED] Welcome, Administrator.'
        }]);
        break;
      
      case 'omega':
        if (isUltraMode) {
          // Full screen cinematic ACCESS GRANTED
          setShowOmegaOverlay(true);
          playSound('success');
          
          setTimeout(() => {
            setShowOmegaOverlay(false);
            setIsUltraMode(false);
            setHistory(prev => [...prev, {
              type: 'success',
              content: '[OMEGA PROTOCOL COMPLETE] Returning to normal mode.'
            }]);
          }, 1500);
        } else {
          setHistory(prev => [...prev, {
            type: 'error',
            content: 'Access denied. Ultra Mode required.'
          }]);
        }
        break;
        
      default:
        playSound('error');
        setHistory(prev => [...prev, {
          type: 'error',
          content: `Command not found: "${cmd}". Type 'help' for available commands.`
        }]);
    }
  }, [isHacking, onClose, isUltraMode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isRootAccess) {
      executeCommand(input);
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      initiateHackerClose();
    }
    playSound('key');
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
          style={{ willChange: 'opacity' }}
        >
          {/* Backdrop with blur - Enhanced for Ultra Mode */}
          <motion.div
            className={`absolute inset-0 ${
              isUltraMode || startInUltraMode
                ? 'bg-black/85 backdrop-blur-xl'
                : 'bg-black/70 backdrop-blur-md'
            }`}
            onClick={initiateHackerClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: isUltraMode || startInUltraMode ? 0.4 : 0.12, ease: 'easeOut' }}
            style={{ 
              willChange: 'opacity',
              WebkitBackdropFilter: isUltraMode || startInUltraMode ? 'blur(20px)' : 'blur(10px)',
              backdropFilter: isUltraMode || startInUltraMode ? 'blur(20px)' : 'blur(10px)'
            }}
          />
          
          {/* Ultra Mode Spotlight/Vignette Effect */}
          {(isUltraMode || startInUltraMode) && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              style={{
                background: 'radial-gradient(ellipse at center, transparent 25%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.8) 100%)',
              }}
            />
          )}
          
          {/* Subtle red ambient glow for Ultra Mode */}
          {(isUltraMode || startInUltraMode) && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{
                background: 'radial-gradient(ellipse at center, rgba(255,0,64,0.15) 0%, transparent 60%)',
              }}
            />
          )}
          
          {/* Terminal Window - Enhanced glow for Ultra Mode */}
          <motion.div
            className="relative w-[95vw] sm:w-full max-w-4xl h-[85dvh] sm:h-[80vh] max-h-[600px] bg-black/95 rounded-lg overflow-hidden"
            initial={{ opacity: 0, scale: 0.985, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 4 }}
            transition={{ 
              duration: isUltraMode || startInUltraMode ? 0.25 : 0.14, 
              ease: [0.22, 1, 0.36, 1]
            }}
            style={{ 
              willChange: 'transform, opacity',
              border: `${isUltraMode ? '2px' : '1px'} solid rgba(255, 0, 64, ${isUltraMode ? 0.9 : 0.4 + glowIntensity * 0.6})`,
              boxShadow: isUltraMode 
                ? `0 0 80px rgba(255, 0, 64, 0.4), 0 0 120px rgba(255, 0, 64, 0.2), 0 25px 50px rgba(0, 0, 0, 0.8), inset 0 0 40px rgba(255, 0, 64, 0.05)`
                : `0 0 ${40 + glowIntensity * 30}px rgba(255, 0, 64, ${0.15 + glowIntensity * 0.15}), 0 25px 50px rgba(0, 0, 0, 0.5), inset 0 0 30px rgba(255, 0, 64, 0.03)`,
              transition: 'box-shadow 300ms ease-out, border-color 300ms ease-out, border-width 300ms ease-out'
            }}
          >
            {/* Ultra Glitch Overlay */}
            <AnimatePresence>
              {showUltraGlitch && (
                <motion.div
                  className="absolute inset-0 z-50 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.1 }}
                >
                  <div className="absolute inset-0 bg-[#ff0040]/30 animate-pulse" />
                  <div className="absolute inset-0" style={{ 
                    background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,0,64,0.1) 2px, rgba(255,0,64,0.1) 4px)',
                    animation: 'glitch-shift 0.1s infinite'
                  }} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Hacker Closing Overlay */}
            <AnimatePresence>
              {isClosing && (
                <motion.div
                  className="absolute inset-0 z-[60] flex items-center justify-center bg-black/95"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {/* Glitch background */}
                  <div className="absolute inset-0 overflow-hidden">
                    {/* Scan lines */}
                    <div 
                      className="absolute inset-0" 
                      style={{ 
                        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,0,64,0.1) 2px, rgba(255,0,64,0.1) 4px)' 
                      }} 
                    />
                    {/* Horizontal glitch bars */}
                    <motion.div 
                      className="absolute h-8 w-full bg-[#ff0040]/20"
                      animate={{ top: ['0%', '100%'] }}
                      transition={{ duration: 0.3, ease: 'linear' }}
                    />
                    <motion.div 
                      className="absolute h-4 w-full bg-[#00ffff]/10"
                      animate={{ top: ['100%', '0%'] }}
                      transition={{ duration: 0.25, ease: 'linear' }}
                    />
                  </div>
                  
                  {/* Main closing text */}
                  <motion.div
                    className="text-center z-10"
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <motion.div 
                      className="text-2xl sm:text-4xl font-bold text-[#ff0040] font-['Orbitron'] mb-2"
                      style={{ textShadow: '0 0 20px rgba(255, 0, 64, 0.8), 0 0 40px rgba(255, 0, 64, 0.5)' }}
                      animate={{ 
                        x: [0, -3, 3, -2, 2, 0],
                        opacity: [1, 0.8, 1, 0.9, 1]
                      }}
                      transition={{ duration: 0.2, repeat: 2 }}
                    >
                      {closingText || 'DISCONNECTING...'}
                    </motion.div>
                    
                    {/* Signal bars */}
                    <div className="flex justify-center gap-1 mt-4">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-2 h-4 bg-[#ff0040]"
                          initial={{ opacity: 1, scaleY: 1 }}
                          animate={{ opacity: 0, scaleY: 0 }}
                          transition={{ delay: i * 0.1, duration: 0.2 }}
                        />
                      ))}
                    </div>
                    
                    <motion.div 
                      className="text-sm text-[#ff0040]/60 font-mono mt-3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      {'>'} connection_terminated
                    </motion.div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Omega Overlay */}
            <AnimatePresence>
              {showOmegaOverlay && (
                <motion.div
                  className="absolute inset-0 z-50 flex items-center justify-center bg-black/95"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    className="text-center"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div 
                      className="text-4xl sm:text-6xl font-bold text-green-400 font-['Orbitron'] mb-4"
                      style={{ textShadow: '0 0 30px rgba(74, 222, 128, 0.8), 0 0 60px rgba(74, 222, 128, 0.5)' }}
                    >
                      ACCESS GRANTED
                    </div>
                    <div className="text-xl text-green-400/60 font-mono">
                      OMEGA PROTOCOL COMPLETE
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Scanline effect */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden scanline opacity-20" />
            
            {/* Terminal Header - Long press for Ultra Mode on mobile */}
            <div 
              ref={headerRef}
              className="flex items-center justify-between px-4 py-2 bg-[#1a0a0a] border-b border-[#ff0040]/50 select-none cursor-default"
              onTouchStart={handleHeaderTouchStart}
              onTouchEnd={handleHeaderTouchEnd}
              onTouchCancel={handleHeaderTouchEnd}
            >
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${isUltraMode ? 'bg-green-500 animate-pulse' : 'bg-[#ff0040]'}`} />
                <div className={`w-3 h-3 rounded-full ${isUltraMode ? 'bg-green-500/50' : 'bg-[#ff0040]/50'}`} />
                <div className={`w-3 h-3 rounded-full ${isUltraMode ? 'bg-green-500/30' : 'bg-[#ff0040]/30'}`} />
              </div>
              <span className={`font-mono text-sm ${isUltraMode ? 'text-green-400' : 'text-[#ff0040]'}`}>
                {isUltraMode ? 'nl@portfolio:~# [OMEGA]' : 'nl@portfolio:~$'}
              </span>
              <button
                onClick={initiateHackerClose}
                className="text-[#ff0040] hover:text-white transition-colors font-mono"
              >
                [X]
              </button>
            </div>
            
            {/* Terminal Content */}
            <div
              ref={terminalRef}
              className="h-[calc(100%-110px)] sm:h-[calc(100%-100px)] overflow-y-auto overflow-x-hidden p-3 sm:p-4 font-mono text-[11px] sm:text-sm"
              onClick={() => inputRef.current?.focus()}
            >
              {history.map((item, index) => (
                <motion.div
                  key={`${index}-${item.type}`}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    duration: 0.08,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  className={`whitespace-pre-wrap mb-1 ${
                    item.type === 'input' ? 'text-white' :
                    item.type === 'ascii' ? 'text-[#ff0040]' :
                    item.type === 'error' ? 'text-red-500' :
                    item.type === 'success' ? 'text-green-400' :
                    'text-gray-400'
                  }`}
                  style={item.type === 'ascii' ? { 
                    textShadow: '0 0 10px rgba(255, 0, 64, 0.5)' 
                  } : undefined}
                >
                  {item.content}
                </motion.div>
              ))}
              
              {/* Hack Progress Bar */}
              {isHacking && (
                <div className="mt-4">
                  <div className="text-[#ff0040] mb-2">
                    [HACKING IN PROGRESS] {Math.floor(hackProgress)}%
                  </div>
                  <div className="w-full h-4 bg-gray-900 rounded overflow-hidden border border-[#ff0040]/30">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[#ff0040] to-[#ff4060]"
                      style={{ width: `${hackProgress}%` }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                  <div className="mt-2 text-[#ff0040]/60 text-xs animate-pulse">
                    {'>'} Bypassing firewall... {'>'} Decrypting data... {'>'} Injecting payload...
                  </div>
                </div>
              )}
              
              {/* Root Access Progress */}
              {isRootAccess && (
                <div className="mt-4">
                  <div className="w-full h-2 bg-gray-900 rounded overflow-hidden">
                    <motion.div
                      className="h-full bg-green-500"
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                </div>
              )}
            </div>
            
            {/* Input Line */}
            <form
              onSubmit={handleSubmit}
              className="absolute bottom-0 left-0 right-0 flex items-center px-3 sm:px-4 py-3 sm:py-3 bg-[#0a0a0a] border-t border-[#ff0040]/30 safe-area-bottom"
            >
              <span className="text-[#ff0040] mr-2">{'>'}</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent text-white font-mono outline-none"
                placeholder="Enter command..."
                autoFocus
                disabled={isHacking || isRootAccess || isBooting}
              />
              <motion.span
                className="w-2 h-5 bg-[#ff0040] ml-1"
                animate={{ opacity: [1, 1, 0, 0] }}
                transition={{ 
                  duration: 1, 
                  repeat: Infinity,
                  ease: 'linear',
                  times: [0, 0.5, 0.5, 1]
                }}
                style={{ boxShadow: '0 0 8px rgba(255, 0, 64, 0.5)' }}
              />
            </form>
            
            {/* Access Granted Overlay */}
            <AnimatePresence>
              {showAccessGranted && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center bg-black/80"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    className="text-6xl font-bold text-[#ff0040] font-['Orbitron'] neon-glow"
                    initial={{ scale: 0.5 }}
                    animate={{ scale: [0.5, 1.2, 1] }}
                    transition={{ duration: 0.5 }}
                  >
                    ACCESS GRANTED
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
