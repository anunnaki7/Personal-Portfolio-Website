import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// Code content with syntax highlighting info
const codeLines = [
  { num: '01', content: 'const developer = {', indent: 0 },
  { num: '02', content: "    name: 'Nikola Lutovac',", indent: 1 },
  { num: '03', content: "    role: 'Vibe Coding Developer',", indent: 1 },
  { num: '04', content: "    location: 'Montenegro',", indent: 1 },
  { num: '05', content: "    focus: 'Modern Web Experiences',", indent: 1 },
  { num: '06', content: "    skills: ['React', 'JavaScript', 'Tailwind', 'Vite', 'Git'],", indent: 1 },
  { num: '07', content: "    mindset: 'Vibe Coding',", indent: 1 },
  { num: '08', content: '    passionate: true,', indent: 1 },
  { num: '09', content: '    motto: "Build Different. Build Fearless."', indent: 1 },
  { num: '10', content: '};', indent: 0 },
  { num: '11', content: '', indent: 0 },
  { num: '12', content: 'developer.showcase();', indent: 0 },
];

// Hacker typing effect - characters scramble before revealing
function HackerTypingLine({ text, isVisible, delay = 0 }: { text: string; isVisible: boolean; delay?: number }) {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  
  useEffect(() => {
    if (!isVisible) {
      setDisplayText('');
      setIsComplete(false);
      return;
    }
    
    const chars = text.split('');
    let currentIndex = 0;
    const scrambleChars = '!@#$%^&*<>[]{}|;:01';
    
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        if (currentIndex <= chars.length) {
          const revealed = text.slice(0, currentIndex);
          const scrambleLength = Math.min(4, chars.length - currentIndex);
          const scrambled = Array(scrambleLength)
            .fill(0)
            .map(() => scrambleChars[Math.floor(Math.random() * scrambleChars.length)])
            .join('');
          setDisplayText(revealed + scrambled);
          currentIndex++;
        } else {
          setDisplayText(text);
          setIsComplete(true);
          clearInterval(interval);
        }
      }, 25);
      
      return () => clearInterval(interval);
    }, delay);
    
    return () => clearTimeout(timeout);
  }, [text, isVisible, delay]);
  
  if (!isVisible && !displayText) return null;
  
  return (
    <span className={`transition-all duration-100 ${!isComplete ? 'text-cyan-400' : ''}`}>
      {isComplete ? <SyntaxHighlight code={displayText} /> : displayText}
    </span>
  );
}

// Syntax highlighter component
function SyntaxHighlight({ code }: { code: string }) {
  const highlightCode = (text: string) => {
    const parts: React.ReactElement[] = [];
    let i = 0;
    let key = 0;

    while (i < text.length) {
      // Check for keywords
      if (/const|true/.test(text.slice(i, i + 5))) {
        const match = text.slice(i).match(/^(const|true)/);
        if (match) {
          parts.push(
            <span key={key++} className="text-[#ff0040] font-bold animate-pulse-subtle" style={{ textShadow: '0 0 15px rgba(255,0,64,0.8), 0 0 30px rgba(255,0,64,0.4)' }}>
              {match[0]}
            </span>
          );
          i += match[0].length;
          continue;
        }
      }

      // Check for strings
      if (text[i] === "'" || text[i] === '"') {
        const quote = text[i];
        let end = i + 1;
        while (end < text.length && text[end] !== quote) {
          if (text[end] === '\\') end++;
          end++;
        }
        end++;
        const str = text.slice(i, end);
        parts.push(
          <span key={key++} className="text-[#ff6b8a]" style={{ textShadow: '0 0 10px rgba(255,107,138,0.5)' }}>
            {str}
          </span>
        );
        i = end;
        continue;
      }

      // Check for property keys
      const propMatch = text.slice(i).match(/^(\w+)(\s*:)/);
      if (propMatch && (i === 0 || /[\s{,]/.test(text[i-1]))) {
        parts.push(
          <span key={key++} className="text-gray-300">
            {propMatch[1]}
          </span>
        );
        parts.push(
          <span key={key++} className="text-[#ff0040]/60">
            {propMatch[2]}
          </span>
        );
        i += propMatch[0].length;
        continue;
      }

      // Check for method calls
      if (text[i] === '.') {
        const methodMatch = text.slice(i).match(/^\.(\w+)\(\)/);
        if (methodMatch) {
          parts.push(<span key={key++} className="text-gray-500">.</span>);
          parts.push(
            <span key={key++} className="text-[#ff0040] font-bold" style={{ textShadow: '0 0 15px rgba(255,0,64,0.8)' }}>
              {methodMatch[1]}
            </span>
          );
          parts.push(<span key={key++} className="text-cyan-400/80">()</span>);
          i += methodMatch[0].length;
          continue;
        }
      }

      // Check for brackets and special chars
      if (/[\[\]{}(),;=]/.test(text[i])) {
        parts.push(
          <span key={key++} className="text-[#ff0040]/50">
            {text[i]}
          </span>
        );
        i++;
        continue;
      }

      // Default
      parts.push(
        <span key={key++} className="text-gray-400">
          {text[i]}
        </span>
      );
      i++;
    }

    return parts;
  };

  return <>{highlightCode(code)}</>;
}

// Matrix rain effect for background
function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    const chars = 'アイウエオカキクケコ01<>{}[]';
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(columns).fill(1);
    
    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#ff004020';
      ctx.font = `${fontSize}px monospace`;
      
      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        
        ctx.fillStyle = `rgba(255, 0, 64, ${Math.random() * 0.3})`;
        ctx.fillText(char, x, y);
        
        if (y > canvas.height && Math.random() > 0.98) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };
    
    const interval = setInterval(draw, 50);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full opacity-30 pointer-events-none"
    />
  );
}

// Glitch overlay effect
function GlitchOverlay({ active }: { active: boolean }) {
  if (!active) return null;
  
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none z-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 0] }}
      transition={{ duration: 0.1, repeat: 2 }}
    >
      <div className="absolute inset-0 bg-[#ff0040]/10" />
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,0,64,0.1) 2px, rgba(255,0,64,0.1) 4px)',
        }}
      />
    </motion.div>
  );
}

// Scan line animation
function ScanLine() {
  return (
    <motion.div
      className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#ff0040] to-transparent pointer-events-none z-10"
      initial={{ top: 0, opacity: 0 }}
      animate={{ 
        top: ['0%', '100%'],
        opacity: [0, 0.5, 0.5, 0]
      }}
      transition={{ 
        duration: 3,
        repeat: Infinity,
        repeatDelay: 2,
        ease: 'linear'
      }}
      style={{ boxShadow: '0 0 20px #ff0040, 0 0 40px #ff0040' }}
    />
  );
}

// Binary rain in background
function BinaryBackground() {
  const [lines, setLines] = useState<string[]>([]);
  
  useEffect(() => {
    const generateLine = () => {
      return Array(50).fill(0).map(() => Math.random() > 0.5 ? '1' : '0').join(' ');
    };
    
    setLines(Array(20).fill(0).map(() => generateLine()));
    
    const interval = setInterval(() => {
      setLines(prev => {
        const newLines = [...prev];
        const randomIndex = Math.floor(Math.random() * newLines.length);
        newLines[randomIndex] = generateLine();
        return newLines;
      });
    }, 200);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="absolute inset-0 overflow-hidden opacity-[0.03] pointer-events-none font-mono text-[10px] text-[#ff0040]">
      {lines.map((line, i) => (
        <div key={i} className="whitespace-nowrap">{line}</div>
      ))}
    </div>
  );
}

interface CodeEditorHeroProps {
  onLogoClick: () => void;
}

export function CodeEditorHero({ onLogoClick }: CodeEditorHeroProps) {
  const [visibleLines, setVisibleLines] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [glitchActive, setGlitchActive] = useState(false);
  const [showAccessGranted, setShowAccessGranted] = useState(false);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Staggered line animation
  useEffect(() => {
    if (visibleLines < codeLines.length) {
      const timeout = setTimeout(() => {
        setVisibleLines(prev => prev + 1);
      }, 200);
      return () => clearTimeout(timeout);
    } else {
      // Show "Access Granted" effect when done
      setTimeout(() => setShowAccessGranted(true), 500);
    }
  }, [visibleLines]);

  // Random glitch effect
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setGlitchActive(true);
        setTimeout(() => setGlitchActive(false), 150);
      }
    }, 3000);
    
    return () => clearInterval(glitchInterval);
  }, []);

  // Logo click handler
  const handleLogoClick = () => {
    setGlitchActive(true);
    setTimeout(() => setGlitchActive(false), 200);
    
    setClickCount(prev => prev + 1);
    
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }
    
    clickTimeoutRef.current = setTimeout(() => {
      setClickCount(0);
    }, 2000);
    
    if (clickCount >= 4) {
      onLogoClick();
      setClickCount(0);
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden py-20 lg:py-0 lg:h-screen lg:max-h-screen">
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0000] via-[#0a0a0a] to-[#1a0000]" />
      <BinaryBackground />
      
      {/* Large N.L Background Text - Desktop Only */}
      <div className="hidden lg:block absolute inset-0 pointer-events-none select-none overflow-hidden">
        <motion.div 
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[14vw] xl:text-[12vw] font-['Orbitron'] font-black tracking-wider text-white whitespace-nowrap"
          style={{
            opacity: 0.03,
            filter: 'blur(2px)',
            textShadow: '0 0 80px rgba(255,0,64,0.15)',
          }}
          animate={{
            opacity: [0.02, 0.04, 0.02],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          N.L
        </motion.div>
      </div>
      
      {/* Ambient red glow */}
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] lg:w-[700px] lg:h-[500px] pointer-events-none"
        animate={{
          opacity: [0.06, 0.12, 0.06],
          scale: [1, 1.05, 1],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background: 'radial-gradient(ellipse at center, rgba(255,0,64,0.12) 0%, transparent 70%)',
        }}
      />

      <div className="container mx-auto px-4 md:px-6 lg:px-8 z-10 max-w-5xl lg:max-w-4xl xl:max-w-5xl">
        {/* Status bar - Hacker style */}
        <motion.div
          className="flex items-center justify-center gap-4 mb-4 lg:mb-5 font-mono text-xs"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="flex items-center gap-2 text-[#ff0040]/60">
            <motion.span 
              className="w-2 h-2 rounded-full bg-[#ff0040]"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            SYSTEM ONLINE
          </span>
          <span className="text-gray-600">|</span>
          <span className="text-gray-500">
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              _
            </motion.span>
            LOADING PORTFOLIO
          </span>
        </motion.div>

        {/* N.L Logo */}
        <motion.div
          className="flex justify-center mb-6 lg:mb-5"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            onClick={handleLogoClick}
            className="cursor-pointer select-none relative group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Custom SVG Logo */}
            <svg 
              width="140" 
              height="70" 
              viewBox="0 0 120 60" 
              className="drop-shadow-[0_0_30px_rgba(255,0,64,0.6)]"
            >
              <defs>
                <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="glitch">
                  <feOffset in="SourceGraphic" dx="2" dy="0" result="offset1" />
                  <feOffset in="SourceGraphic" dx="-2" dy="0" result="offset2" />
                </filter>
              </defs>
              
              {/* N letter */}
              <motion.path
                d="M10 50 L10 10 L15 10 L35 40 L35 10 L42 10 L42 50 L37 50 L17 20 L17 50 Z"
                fill="#ff0040"
                filter="url(#neonGlow)"
                animate={isHovered ? { 
                  fill: ['#ff0040', '#ff3366', '#ff0040'],
                } : {}}
                transition={{ duration: 0.3 }}
              />
              
              {/* Dot */}
              <motion.circle 
                cx="55" 
                cy="45" 
                r="4" 
                fill="#ff0040" 
                filter="url(#neonGlow)"
                animate={{ 
                  r: [4, 5, 4],
                  opacity: [1, 0.8, 1]
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              
              {/* L letter */}
              <motion.path
                d="M68 10 L75 10 L75 43 L100 43 L100 50 L68 50 Z"
                fill="#ff0040"
                filter="url(#neonGlow)"
                animate={isHovered ? { 
                  fill: ['#ff0040', '#ff3366', '#ff0040'],
                } : {}}
                transition={{ duration: 0.3, delay: 0.1 }}
              />
              
              {/* Accent lines */}
              <motion.line 
                x1="5" y1="55" x2="115" y2="55" 
                stroke="#ff0040" 
                strokeWidth="1" 
                opacity="0.4"
                animate={{ opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </svg>
            
            {/* Glitch overlay */}
            {isHovered && (
              <>
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.7, 0], x: [0, -3, 3, 0] }}
                  transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 0.5 }}
                >
                  <svg width="140" height="70" viewBox="0 0 120 60" style={{ transform: 'translateX(3px)' }}>
                    <path d="M10 50 L10 10 L15 10 L35 40 L35 10 L42 10 L42 50 L37 50 L17 20 L17 50 Z" fill="cyan" opacity="0.5" />
                    <path d="M68 10 L75 10 L75 43 L100 43 L100 50 L68 50 Z" fill="cyan" opacity="0.5" />
                  </svg>
                </motion.div>
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.5, 0], x: [0, 3, -3, 0] }}
                  transition={{ duration: 0.15, repeat: Infinity, repeatDelay: 0.3 }}
                >
                  <svg width="140" height="70" viewBox="0 0 120 60" style={{ transform: 'translateX(-3px)' }}>
                    <path d="M10 50 L10 10 L15 10 L35 40 L35 10 L42 10 L42 50 L37 50 L17 20 L17 50 Z" fill="#ff0040" opacity="0.3" />
                    <path d="M68 10 L75 10 L75 43 L100 43 L100 50 L68 50 Z" fill="#ff0040" opacity="0.3" />
                  </svg>
                </motion.div>
              </>
            )}
          </motion.div>
        </motion.div>

        {/* Code Editor Card */}
        <motion.div
          className="max-w-4xl lg:max-w-3xl xl:max-w-4xl mx-auto relative"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Glitch overlay */}
          <GlitchOverlay active={glitchActive} />
          
          <div 
            className="relative rounded-xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(20,0,5,0.95) 0%, rgba(10,10,10,0.98) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,0,64,0.4)',
              boxShadow: '0 0 60px rgba(255,0,64,0.2), inset 0 0 80px rgba(255,0,64,0.03)',
            }}
          >
            {/* Matrix rain inside card */}
            <MatrixRain />
            
            {/* Scan line */}
            <ScanLine />
            
            {/* Editor Header */}
            <div className="relative z-10 flex items-center justify-between px-4 py-3 bg-[#0a0a0a]/90 border-b border-[#ff0040]/30">
              {/* macOS circles */}
              <div className="flex items-center gap-2">
                <motion.div 
                  className="w-3 h-3 rounded-full bg-[#ff5f57] cursor-pointer"
                  whileHover={{ scale: 1.3, boxShadow: '0 0 10px #ff5f57' }}
                />
                <motion.div 
                  className="w-3 h-3 rounded-full bg-[#febc2e] cursor-pointer"
                  whileHover={{ scale: 1.3, boxShadow: '0 0 10px #febc2e' }}
                />
                <motion.div 
                  className="w-3 h-3 rounded-full bg-[#28c840] cursor-pointer"
                  whileHover={{ scale: 1.3, boxShadow: '0 0 10px #28c840' }}
                />
              </div>
              
              {/* File name with typing effect */}
              <div className="flex items-center gap-2">
                <motion.span 
                  className="text-[#ff0040]/80"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ▶
                </motion.span>
                <span 
                  className="font-mono text-sm font-bold text-[#ff0040] tracking-wider"
                  style={{ textShadow: '0 0 15px rgba(255,0,64,0.6)' }}
                >
                  Portfolio.ts
                </span>
                <motion.span
                  className="text-cyan-400 text-xs"
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  [EXECUTING]
                </motion.span>
              </div>
              
              {/* Terminal icons */}
              <div className="flex items-center gap-3 text-gray-500 text-xs font-mono">
                <span>UTF-8</span>
                <span className="text-[#ff0040]">TS</span>
              </div>
            </div>

            {/* Code Content */}
            <div className="relative z-10 p-4 md:p-5 lg:p-5 font-['Fira_Code','JetBrains_Mono',monospace] text-sm md:text-base lg:text-[15px] overflow-x-auto">
              {codeLines.map((line, index) => (
                <motion.div
                  key={line.num}
                  className="flex items-start gap-4 leading-6 md:leading-7 lg:leading-7 group"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ 
                    opacity: index < visibleLines ? 1 : 0,
                    x: index < visibleLines ? 0 : -30 
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Line number */}
                  <span className="text-[#ff0040]/40 select-none w-6 text-right shrink-0 font-bold group-hover:text-[#ff0040]/80 transition-colors">
                    {line.num}
                  </span>
                  
                  {/* Separator */}
                  <span className="text-[#ff0040]/20 select-none">│</span>
                  
                  {/* Code content with hacker typing effect */}
                  <div className="whitespace-pre">
                    <HackerTypingLine 
                      text={line.content} 
                      isVisible={index < visibleLines} 
                      delay={index * 50}
                    />
                  </div>
                </motion.div>
              ))}
              
              {/* Blinking cursor */}
              {visibleLines >= codeLines.length && (
                <motion.div
                  className="flex items-center gap-4 mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <span className="text-[#ff0040]/40 select-none w-6 text-right font-bold">13</span>
                  <span className="text-[#ff0040]/20 select-none">│</span>
                  <motion.span
                    className="inline-block w-3 h-6 bg-[#ff0040]"
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    style={{ boxShadow: '0 0 15px rgba(255,0,64,0.8), 0 0 30px rgba(255,0,64,0.4)' }}
                  />
                </motion.div>
              )}
            </div>

            {/* Access Granted overlay */}
            {showAccessGranted && (
              <motion.div
                className="absolute bottom-4 right-4 z-20"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div 
                  className="px-4 py-2 bg-black/80 border border-green-500/50 rounded font-mono text-xs text-green-400"
                  style={{ textShadow: '0 0 10px rgba(0,255,0,0.5)' }}
                >
                  <motion.span
                    animate={{ opacity: [1, 0.7, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    ✓ COMPILATION SUCCESSFUL
                  </motion.span>
                </div>
              </motion.div>
            )}

            {/* Glow animation */}
            <motion.div
              className="absolute inset-0 pointer-events-none rounded-xl"
              animate={{
                boxShadow: [
                  'inset 0 0 30px rgba(255,0,64,0.03), 0 0 30px rgba(255,0,64,0.1)',
                  'inset 0 0 60px rgba(255,0,64,0.06), 0 0 60px rgba(255,0,64,0.2)',
                  'inset 0 0 30px rgba(255,0,64,0.03), 0 0 30px rgba(255,0,64,0.1)',
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
            
            {/* Corner decorations */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#ff0040]/50 pointer-events-none" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#ff0040]/50 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#ff0040]/50 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#ff0040]/50 pointer-events-none" />
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center mt-8 lg:mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: visibleLines >= codeLines.length ? 1 : 0, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <motion.a
            href="#projects"
            className="group relative px-6 py-3 lg:px-8 lg:py-3 bg-[#ff0040] text-black font-bold font-['Orbitron'] rounded-lg overflow-hidden
              border-2 border-[#ff0040] transition-all duration-300 text-center text-sm lg:text-base"
            whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(255, 0, 64, 0.6)' }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <span>VIEW PROJECTS</span>
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                →
              </motion.span>
            </span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"
              animate={{ translateX: ['−100%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            />
          </motion.a>
          
          <motion.a
            href="#contact"
            className="group relative px-6 py-3 lg:px-8 lg:py-3 border-2 border-[#ff0040] text-[#ff0040] font-bold font-['Orbitron'] rounded-lg
              hover:bg-[#ff0040] hover:text-black transition-all duration-300 text-center overflow-hidden text-sm lg:text-base"
            whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(255, 0, 64, 0.5)' }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10">CONTACT ME</span>
          </motion.a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-4 lg:bottom-6 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
        >
          <div className="flex flex-col items-center gap-1 lg:gap-2">
            <span className="text-[#ff0040]/50 text-[10px] lg:text-xs font-mono">SCROLL</span>
            <div className="w-5 h-8 lg:w-6 lg:h-9 border-2 border-[#ff0040]/50 rounded-full flex justify-center">
              <motion.div
                className="w-1 h-1 lg:w-1.5 lg:h-1.5 bg-[#ff0040] rounded-full mt-2"
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
