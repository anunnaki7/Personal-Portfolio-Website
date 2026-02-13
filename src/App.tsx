import { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { CodeEditorHero } from './components/CodeEditorHero';
import { About } from './components/About';
import { Skills } from './components/Skills';
import { Projects } from './components/Projects';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { Terminal } from './components/Terminal';
import { Background3D } from './components/Background3D';
import { EasterEgg } from './components/EasterEgg';
import { BackToTop } from './components/BackToTop';
import Preloader from './components/Preloader';

export function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [secretInput, setSecretInput] = useState('');
  const [logoClickCount, setLogoClickCount] = useState(0);
  const [logoClickTimer, setLogoClickTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  // Handle keyboard shortcuts and secret commands
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Ctrl+Shift+T to open terminal
    if (e.ctrlKey && e.shiftKey && e.key === 'T') {
      e.preventDefault();
      setIsTerminalOpen(true);
    }
    
    // Track "sudo nl" typing
    if (!isTerminalOpen) {
      const newInput = secretInput + e.key;
      if ('sudo nl'.startsWith(newInput.toLowerCase())) {
        setSecretInput(newInput);
        if (newInput.toLowerCase() === 'sudo nl') {
          setIsTerminalOpen(true);
          setSecretInput('');
        }
      } else {
        setSecretInput('');
      }
    }
    
    // Escape to close terminal
    if (e.key === 'Escape' && isTerminalOpen) {
      setIsTerminalOpen(false);
    }
  }, [isTerminalOpen, secretInput]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Logo click handler - 5 clicks triggers Easter Egg, single clicks for terminal still work via CodeEditorHero
  const handleLogoClick = () => {
    const newCount = logoClickCount + 1;
    setLogoClickCount(newCount);

    if (logoClickTimer) clearTimeout(logoClickTimer);

    const timer = setTimeout(() => {
      setLogoClickCount(0);
    }, 2000);
    setLogoClickTimer(timer);

    // 5 clicks → Easter Egg
    if (newCount >= 5) {
      setLogoClickCount(0);
      if (logoClickTimer) clearTimeout(logoClickTimer);
      // Trigger easter egg
      const trigger = (window as unknown as Record<string, (() => void) | undefined>).__easterEggTrigger;
      if (trigger) trigger();
    }
  };

  return (
    <>
      {/* Preloader */}
      {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
      
      {/* Main content */}
      <div 
        className={`relative min-h-screen bg-[#0a0a0a] overflow-x-hidden transition-opacity duration-500 ${
          isLoading ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        {/* Canvas Background */}
        <Background3D />

        {/* Gradient overlays */}
        <div className="fixed inset-0 bg-gradient-to-b from-transparent via-[#0a0a0a]/50 to-[#0a0a0a] pointer-events-none z-[1]" />
        
        {/* Content */}
        <div className="relative z-10">
          <Navbar onLogoClick={handleLogoClick} />
          
          <main>
            <CodeEditorHero onLogoClick={handleLogoClick} />
            <About />
            <Skills />
            <Projects />
            <Contact />
          </main>
          
          <Footer />
        </div>

        {/* Secret Terminal */}
        <Terminal isOpen={isTerminalOpen} onClose={() => setIsTerminalOpen(false)} />

        {/* Easter Egg Overlay */}
        <EasterEgg />

        {/* Secret hint indicator */}
        {secretInput.length > 0 && secretInput.length < 7 && (
          <div className="fixed bottom-4 left-4 text-[#ff0040]/50 font-mono text-xs z-50">
            {secretInput}_
          </div>
        )}
      </div>

      {/* Back to Top Button - Outside all containers for true fixed positioning */}
      <BackToTop />
    </>
  );
}
