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

// Visitor tracking - record each visit
const recordVisit = () => {
  const now = new Date();
  const visit = {
    id: Date.now(),
    date: now.toLocaleDateString('en-GB', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }),
    time: now.toLocaleTimeString('en-GB', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    }),
    timestamp: now.getTime(),
    device: /Mobile|Android|iPhone/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop',
    screen: `${window.innerWidth}x${window.innerHeight}`,
  };
  
  // Get existing visits
  const visits = JSON.parse(localStorage.getItem('nl_visits') || '[]');
  
  // Add new visit (keep last 100)
  const updated = [visit, ...visits].slice(0, 100);
  localStorage.setItem('nl_visits', JSON.stringify(updated));
  
  // Update total count
  const total = parseInt(localStorage.getItem('nl_total_visits') || '0') + 1;
  localStorage.setItem('nl_total_visits', total.toString());
  
  // Save first visit
  if (!localStorage.getItem('nl_first_visit')) {
    localStorage.setItem('nl_first_visit', now.toISOString());
  }
  
  // Save last visit
  localStorage.setItem('nl_last_visit', now.toISOString());
  
  console.log(`[VISITOR LOG] Visit #${total} recorded at ${visit.time} on ${visit.date}`);
};

export function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [secretInput, setSecretInput] = useState('');

  // Record visit on first load
  useEffect(() => {
    recordVisit();
  }, []);
  const [startInUltraMode, setStartInUltraMode] = useState(false);

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

  // Logo click handler - OPENS TERMINAL IMMEDIATELY
  const handleLogoClick = () => {
    // Open terminal IMMEDIATELY on single click
    setStartInUltraMode(false);
    setIsTerminalOpen(true);
  };

  // Logo LONG PRESS handler - Opens terminal in ULTRA MODE
  const handleUltraModeActivate = () => {
    setStartInUltraMode(true);
    setIsTerminalOpen(true);
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
          <Navbar onLogoClick={handleLogoClick} onUltraModeActivate={handleUltraModeActivate} />
          
          <main>
            <CodeEditorHero onLogoClick={handleLogoClick} onUltraModeActivate={handleUltraModeActivate} />
            <About />
            <Skills />
            <Projects />
            <Contact />
          </main>
          
          <Footer />
        </div>

        {/* Secret Terminal */}
        <Terminal isOpen={isTerminalOpen} onClose={() => { setIsTerminalOpen(false); setStartInUltraMode(false); }} startInUltraMode={startInUltraMode} />

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
