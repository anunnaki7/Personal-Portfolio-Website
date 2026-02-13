import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ASCII_LOGO = `
███╗   ██╗██╗     
████╗  ██║██║     
██╔██╗ ██║██║     
██║╚██╗██║██║     
██║ ╚████║███████╗
╚═╝  ╚═══╝╚══════╝
`;

interface TerminalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface HistoryItem {
  type: 'input' | 'output' | 'ascii' | 'error' | 'success' | 'progress';
  content: string;
}

export function Terminal({ isOpen, onClose }: TerminalProps) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHacking, setIsHacking] = useState(false);
  const [hackProgress, setHackProgress] = useState(0);
  const [showAccessGranted, setShowAccessGranted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  useEffect(() => {
    if (isOpen) {
      setHistory([
        { type: 'ascii', content: ASCII_LOGO },
        { type: 'output', content: 'NIKOLA LUTOVAC TERMINAL v1.0.0' },
        { type: 'output', content: 'Type "help" for available commands.\n' },
      ]);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

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
║  Role: Full Stack Developer          ║
║  Experience: 5+ years                ║
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
        
      default:
        playSound('error');
        setHistory(prev => [...prev, {
          type: 'error',
          content: `Command not found: "${cmd}". Type 'help' for available commands.`
        }]);
    }
  }, [isHacking, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      executeCommand(input);
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
    playSound('key');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/90"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          
          {/* Terminal Window */}
          <motion.div
            className="relative w-full max-w-4xl h-[80vh] bg-black border border-[#ff0040] rounded-lg overflow-hidden shadow-2xl"
            initial={{ scale: 0.9, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 50 }}
            style={{ boxShadow: '0 0 50px rgba(255, 0, 64, 0.3)' }}
          >
            {/* Scanline effect */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden scanline opacity-20" />
            
            {/* Terminal Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-[#1a0a0a] border-b border-[#ff0040]/50">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ff0040]" />
                <div className="w-3 h-3 rounded-full bg-[#ff0040]/50" />
                <div className="w-3 h-3 rounded-full bg-[#ff0040]/30" />
              </div>
              <span className="text-[#ff0040] font-mono text-sm">nl@portfolio:~$</span>
              <button
                onClick={onClose}
                className="text-[#ff0040] hover:text-white transition-colors font-mono"
              >
                [X]
              </button>
            </div>
            
            {/* Terminal Content */}
            <div
              ref={terminalRef}
              className="h-[calc(100%-100px)] overflow-y-auto p-4 font-mono text-sm"
              onClick={() => inputRef.current?.focus()}
            >
              {history.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.1 }}
                  className={`whitespace-pre-wrap mb-1 ${
                    item.type === 'input' ? 'text-white' :
                    item.type === 'ascii' ? 'text-[#ff0040] neon-glow' :
                    item.type === 'error' ? 'text-red-500' :
                    item.type === 'success' ? 'text-green-400' :
                    'text-gray-400'
                  }`}
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
            </div>
            
            {/* Input Line */}
            <form
              onSubmit={handleSubmit}
              className="absolute bottom-0 left-0 right-0 flex items-center px-4 py-3 bg-[#0a0a0a] border-t border-[#ff0040]/30"
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
                disabled={isHacking}
              />
              <motion.span
                className="w-2 h-5 bg-[#ff0040] ml-1"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
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
