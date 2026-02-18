import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

const projects = [
  {
    id: 1,
    title: 'Monte Quad Kolašin',
    description: 'A modern website for quad bike tours in the beautiful mountains of Kolašin, Montenegro. Features stunning visuals, tour information, and seamless user experience showcasing the breathtaking Montenegrin landscape.',
    tech: ['REACT', 'TYPESCRIPT', 'TAILWIND', 'VITE'],
    image: 'https://api.microlink.io/?url=https://monte-kl.vercel.app&screenshot=true&meta=false&embed=screenshot.url',
    fallbackImages: [
      'https://monte-kl.vercel.app/images/hero.jpg',
      'https://monte-kl.vercel.app/hero.jpg',
      'https://monte-kl.vercel.app/og-image.png',
    ],
    liveUrl: 'https://monte-kl.vercel.app',
    githubUrl: 'https://github.com/anunnaki7/brutal-ui-liquid-ux',
    featured: true,
    hasRealImage: true,
    status: 'DEPLOYED',
  },
  {
    id: 2,
    title: 'Master Perionica',
    description: 'Professional laundry service website for Master Perionica. Features modern design, service showcase, pricing information, and easy contact options for customers seeking quality laundry and dry cleaning services.',
    tech: ['REACT', 'TYPESCRIPT', 'TAILWIND', 'VITE'],
    image: 'https://image.thum.io/get/width/1280/crop/720/https://master-perionica.vercel.app',
    fallbackImages: [
      'https://master-perionica.vercel.app/og-image.png',
      'https://master-perionica.vercel.app/images/hero.jpg',
    ],
    liveUrl: 'https://master-perionica.vercel.app/',
    githubUrl: 'https://github.com/anunnaki7/Master-Perionica',
    featured: false,
    hasRealImage: true,
    status: 'DEPLOYED',
  },
  {
    id: 3,
    title: 'CryptoTracker Pro',
    description: 'Real-time cryptocurrency tracking dashboard with advanced charts, portfolio management, and price alerts.',
    tech: ['NEXT.JS', 'TYPESCRIPT', 'CHART.JS', 'API'],
    image: '',
    liveUrl: '#',
    githubUrl: '#',
    hasRealImage: false,
    status: 'IN_DEV',
  },
  {
    id: 4,
    title: 'TaskFlow',
    description: 'A sleek project management application with drag-and-drop kanban boards, team collaboration, and real-time updates.',
    tech: ['REACT', 'REDUX', 'SOCKET.IO', 'POSTGRESQL'],
    image: '',
    liveUrl: '#',
    githubUrl: '#',
    hasRealImage: false,
    status: 'IN_DEV',
  },
  {
    id: 5,
    title: 'DevPortfolio Builder',
    description: 'An open-source tool for developers to create stunning portfolio websites with customizable themes and components.',
    tech: ['TYPESCRIPT', 'REACT', 'TAILWIND', 'MDX'],
    image: '',
    liveUrl: '#',
    githubUrl: '#',
    hasRealImage: false,
    status: 'PLANNED',
  },
];

interface ProjectCardProps {
  project: typeof projects[0];
  index: number;
}

// Project icons for non-image projects (SVG based)
const projectIcons: Record<string, React.ReactNode> = {
  'Master Perionica': (
    <svg className="w-24 h-24" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5">
      {/* Washing machine body */}
      <rect x="8" y="8" width="48" height="48" rx="4" strokeWidth="2"/>
      {/* Door circle */}
      <circle cx="32" cy="36" r="16" strokeWidth="2"/>
      {/* Inner drum */}
      <circle cx="32" cy="36" r="10" strokeWidth="1.5" strokeDasharray="4 2"/>
      {/* Water/clothes inside */}
      <path d="M26 33c2-3 4-2 6 0s4 3 6 0" strokeWidth="2" strokeLinecap="round"/>
      <path d="M26 39c2-3 4-2 6 0s4 3 6 0" strokeWidth="2" strokeLinecap="round"/>
      {/* Control panel */}
      <line x1="12" y1="18" x2="52" y2="18" strokeWidth="1.5"/>
      {/* Buttons */}
      <circle cx="18" cy="13" r="2" fill="currentColor"/>
      <circle cx="26" cy="13" r="2" fill="currentColor"/>
      <rect x="40" y="11" width="8" height="4" rx="1" fill="currentColor"/>
    </svg>
  ),
  'CryptoTracker Pro': (
    <svg className="w-20 h-20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 3v18h18" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M18 9l-5 5-4-4-3 3" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="18" cy="9" r="2" fill="currentColor"/>
      <circle cx="13" cy="14" r="2" fill="currentColor"/>
      <circle cx="9" cy="10" r="2" fill="currentColor"/>
    </svg>
  ),
  'TaskFlow': (
    <svg className="w-20 h-20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="7" height="7" rx="1" strokeLinecap="round"/>
      <rect x="14" y="3" width="7" height="7" rx="1" strokeLinecap="round"/>
      <rect x="3" y="14" width="7" height="7" rx="1" strokeLinecap="round"/>
      <rect x="14" y="14" width="7" height="7" rx="1" strokeLinecap="round"/>
      <path d="M6.5 6.5h0M17.5 6.5h0M6.5 17.5h0M17.5 17.5h0" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  'DevPortfolio Builder': (
    <svg className="w-20 h-20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2L2 7l10 5 10-5-10-5z" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 17l10 5 10-5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};

function ProjectCard({ project, index }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [glitchActive, setGlitchActive] = useState(false);

  // Glitch effect on hover
  useEffect(() => {
    if (isHovered) {
      const interval = setInterval(() => {
        setGlitchActive(true);
        setTimeout(() => setGlitchActive(false), 100);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isHovered]);

  const getImageUrls = () => {
    if (project.title === 'Monte Quad Kolašin') {
      return [
        `https://api.microlink.io/?url=${encodeURIComponent('https://monte-kl.vercel.app')}&screenshot=true&meta=false&embed=screenshot.url&viewport.width=1280&viewport.height=720`,
        `https://image.thum.io/get/width/1280/crop/720/https://monte-kl.vercel.app`,
        'https://monte-kl.vercel.app/og-image.png',
      ];
    }
    if (project.title === 'Master Perionica') {
      return [
        // Primary: s.wordpress.com screenshot service (very reliable)
        `https://s.wordpress.com/mshots/v1/https://master-perionica.vercel.app?w=1280&h=720`,
        // Backup 1: thumbnail.ws 
        `https://api.thumbnail.ws/api/ab38f32e0c0c56e9f50c14f6e6ad2a6f4e91c2f1d5e1/thumbnail/get?url=https://master-perionica.vercel.app&width=1280`,
        // Backup 2: microlink with longer wait
        `https://api.microlink.io/?url=${encodeURIComponent('https://master-perionica.vercel.app')}&screenshot=true&meta=false&embed=screenshot.url&viewport.width=1280&viewport.height=720&waitForTimeout=5000`,
        // Backup 3: pagepeeker
        `https://api.pagepeeker.com/v2/thumbs.php?size=x&url=https://master-perionica.vercel.app`,
      ];
    }
    return [];
  };

  const imageUrls = getImageUrls();

  const handleImageError = () => {
    if (currentImageIndex < imageUrls.length - 1) {
      setCurrentImageIndex(prev => prev + 1);
      setImageLoaded(false);
    } else {
      setImageError(true);
    }
  };

  const getCurrentImageSrc = () => {
    if (imageUrls.length > 0) {
      return imageUrls[currentImageIndex];
    }
    return project.image;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15, duration: 0.6 }}
      className={`${project.featured ? 'md:col-span-2' : ''} group`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="relative rounded-xl overflow-hidden h-full cursor-pointer"
        style={{
          background: 'linear-gradient(135deg, rgba(15,5,5,0.95) 0%, rgba(5,5,5,0.98) 100%)',
          border: project.featured ? '2px solid rgba(255,0,64,0.5)' : '1px solid rgba(255,0,64,0.2)',
        }}
        animate={{
          boxShadow: isHovered 
            ? project.featured
              ? '0 0 60px rgba(255,0,64,0.4), 0 0 100px rgba(255,0,64,0.2), inset 0 0 60px rgba(255,0,64,0.05)'
              : '0 0 40px rgba(255,0,64,0.3), 0 0 80px rgba(255,0,64,0.15)'
            : project.featured
              ? '0 0 30px rgba(255,0,64,0.2), inset 0 0 30px rgba(255,0,64,0.02)'
              : '0 0 15px rgba(255,0,64,0.1)',
          scale: isHovered ? 1.03 : 1,
          borderColor: isHovered ? 'rgba(255,0,64,0.8)' : project.featured ? 'rgba(255,0,64,0.5)' : 'rgba(255,0,64,0.2)',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        {/* Glitch overlay */}
        {glitchActive && (
          <div className="absolute inset-0 z-50 pointer-events-none">
            <div className="absolute inset-0 bg-[#ff0040]/20" style={{ transform: 'translateX(-3px)' }} />
            <div className="absolute inset-0 bg-cyan-500/20" style={{ transform: 'translateX(3px)' }} />
          </div>
        )}

        {/* Project Preview */}
        <div className="relative h-52 md:h-64 lg:h-72 overflow-hidden">
          {/* Grid pattern overlay */}
          <div 
            className="absolute inset-0 z-10 pointer-events-none opacity-30"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,0,64,0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,0,64,0.03) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px',
            }}
          />
          
          {project.hasRealImage && !imageError ? (
            <>
              {/* Loading skeleton */}
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gradient-to-br from-[#1a0a0a] to-[#0a0a0a] flex items-center justify-center">
                  <div className="flex items-center gap-2">
                    <motion.div 
                      className="w-2 h-2 bg-[#ff0040] rounded-full"
                      animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: 0 }}
                    />
                    <motion.div 
                      className="w-2 h-2 bg-[#ff0040] rounded-full"
                      animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
                    />
                    <motion.div 
                      className="w-2 h-2 bg-[#ff0040] rounded-full"
                      animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
                    />
                  </div>
                </div>
              )}
              <motion.img
                src={getCurrentImageSrc()}
                alt={project.title}
                className={`w-full h-full object-cover transition-all duration-700 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setImageLoaded(true)}
                onError={handleImageError}
                animate={{ 
                  scale: isHovered ? 1.08 : 1,
                  filter: isHovered ? 'brightness(1.05) contrast(1.1) saturate(1.1)' : 'brightness(0.95) contrast(1.05)',
                }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
              {/* Gradient overlays - reduced opacity for better image visibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-transparent to-[#ff0040]/10"
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.4 }}
              />
            </>
          ) : (
            /* Icon fallback for other projects */
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#150505] to-[#0a0505]">
              <motion.div
                className="text-[#ff0040]/60"
                animate={{ 
                  scale: isHovered ? 1.15 : 1,
                  rotateY: isHovered ? 15 : 0,
                }}
                transition={{ type: 'spring', stiffness: 200 }}
                style={{ filter: 'drop-shadow(0 0 20px rgba(255,0,64,0.3))' }}
              >
                {projectIcons[project.title] || (
                  <svg className="w-20 h-20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                    <path d="M2 17l10 5 10-5"/>
                    <path d="M2 12l10 5 10-5"/>
                  </svg>
                )}
              </motion.div>
              {/* Animated rings */}
              <motion.div 
                className="absolute w-32 h-32 border border-[#ff0040]/20 rounded-full"
                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <motion.div 
                className="absolute w-48 h-48 border border-[#ff0040]/10 rounded-full"
                animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0, 0.2] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
              />
            </div>
          )}
          
          {/* Hover Overlay with buttons */}
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Backdrop */}
            <motion.div 
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
            />
            
            {/* Buttons */}
            <motion.div 
              className="relative z-10 flex flex-col sm:flex-row gap-3"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
              transition={{ delay: 0.1 }}
            >
              <motion.a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group/btn relative px-6 py-3 font-bold text-sm rounded-lg overflow-hidden
                  border-2 border-[#ff0040] text-[#ff0040] hover:text-white transition-colors duration-300"
                whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(255,0,64,0.5)' }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Button glow background */}
                <motion.div 
                  className="absolute inset-0 bg-[#ff0040]"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
                <span className="relative z-10 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  LIVE DEMO
                </span>
              </motion.a>
              
              {project.githubUrl !== '#' && (
                <motion.a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/btn relative px-6 py-3 font-bold text-sm rounded-lg
                    bg-black/50 border border-[#ff0040]/50 text-gray-300 hover:text-white hover:border-[#ff0040] transition-all duration-300"
                  whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(255,0,64,0.3)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                    </svg>
                    SOURCE
                  </span>
                </motion.a>
              )}
            </motion.div>
          </motion.div>

          {/* Featured badge - Hacker style */}
          {project.featured && (
            <motion.div 
              className="absolute top-4 right-4 z-30"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <motion.div 
                className="relative px-3 py-1.5 text-[10px] font-bold tracking-wider"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,0,64,0.9) 0%, rgba(200,0,50,0.9) 100%)',
                  border: '1px solid rgba(255,100,100,0.5)',
                  boxShadow: '0 0 20px rgba(255,0,64,0.5)',
                }}
                animate={{ 
                  boxShadow: isHovered 
                    ? ['0 0 20px rgba(255,0,64,0.5)', '0 0 30px rgba(255,0,64,0.7)', '0 0 20px rgba(255,0,64,0.5)']
                    : '0 0 20px rgba(255,0,64,0.5)'
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <span className="relative z-10 text-white flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  FEATURED
                </span>
              </motion.div>
            </motion.div>
          )}

          {/* Status indicator */}
          <motion.div 
            className="absolute top-4 left-4 z-30"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className={`px-2 py-1 font-mono text-[9px] tracking-wider rounded border ${
              project.status === 'DEPLOYED' 
                ? 'bg-green-500/20 border-green-500/50 text-green-400' 
                : project.status === 'IN_DEV'
                  ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400'
                  : 'bg-gray-500/20 border-gray-500/50 text-gray-400'
            }`}>
              [{project.status}]
            </div>
          </motion.div>

          {/* Scan line effect */}
          <motion.div 
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,0,64,0.02) 2px, rgba(255,0,64,0.02) 4px)',
            }}
          />
          
          {/* Moving scan line */}
          <motion.div
            className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#ff0040]/50 to-transparent z-10 pointer-events-none"
            animate={{ top: ['0%', '100%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            style={{ opacity: isHovered ? 0.5 : 0.2 }}
          />
        </div>

        {/* Project Info */}
        <div className="p-5 md:p-6 relative">
          {/* Top accent line */}
          <motion.div 
            className="absolute top-0 left-0 right-0 h-[1px]"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,0,64,0.5), transparent)',
            }}
            animate={{ opacity: isHovered ? 1 : 0.3 }}
          />
          
          {/* Project title */}
          <motion.h3 
            className="text-xl md:text-2xl font-bold text-white mb-2 transition-colors duration-300"
            animate={{ color: isHovered ? '#ff0040' : '#ffffff' }}
          >
            <span className="text-[#ff0040]/50 mr-2">//</span>
            {project.title}
          </motion.h3>
          
          {/* Description */}
          <p className="text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">
            {project.description}
          </p>
          
          {/* Tech Stack - System tags style */}
          <div className="flex flex-wrap gap-2 mb-5">
            {project.tech.map((tech, i) => (
              <motion.span
                key={tech}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                className="group/tag relative px-2.5 py-1 text-[10px] font-mono font-bold tracking-wider
                  bg-black/50 text-gray-400 rounded border border-[#ff0040]/20
                  hover:border-[#ff0040]/60 hover:text-[#ff0040] hover:bg-[#ff0040]/10 transition-all duration-300"
                whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(255,0,64,0.3)' }}
              >
                {tech}
              </motion.span>
            ))}
          </div>

          {/* Featured project CTA button */}
          {project.featured && (
            <motion.a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group/cta relative flex items-center justify-center gap-3 w-full md:w-auto md:inline-flex
                px-6 py-3 font-bold text-sm rounded-lg overflow-hidden
                border-2 border-[#ff0040] text-white transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, rgba(255,0,64,0.2) 0%, rgba(255,0,64,0.1) 100%)',
              }}
              whileHover={{ 
                scale: 1.02, 
                boxShadow: '0 0 40px rgba(255,0,64,0.4), inset 0 0 20px rgba(255,0,64,0.1)' 
              }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              />
              <span className="relative z-10 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                EXPLORE PROJECT
                <motion.svg 
                  className="w-4 h-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </motion.svg>
              </span>
            </motion.a>
          )}

          {/* Corner decorations */}
          <div className="absolute bottom-3 right-3 w-6 h-6 border-r border-b border-[#ff0040]/30" />
          <div className="absolute bottom-3 right-3 w-3 h-3 border-r border-b border-[#ff0040]/50" />
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="projects" className="py-20 md:py-28 relative z-10">
      {/* Background accents */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-30"
          style={{
            background: 'radial-gradient(circle, rgba(255,0,64,0.08) 0%, transparent 70%)',
          }}
        />
      </div>

      <div className="container mx-auto px-4 md:px-6" ref={ref}>
        {/* Section Title */}
        <div className="text-center mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="inline-block mb-4"
          >
            <span className="px-3 py-1 font-mono text-xs text-[#ff0040] border border-[#ff0040]/30 rounded bg-[#ff0040]/5">
              {'<'} PORTFOLIO {'/>'} 
            </span>
          </motion.div>
          
          <motion.h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
          >
            <span className="text-white">MY </span>
            <span 
              className="text-[#ff0040]"
              style={{ textShadow: '0 0 30px rgba(255,0,64,0.5), 0 0 60px rgba(255,0,64,0.3)' }}
            >
              PROJECTS
            </span>
          </motion.h2>
          
          <motion.div 
            className="w-20 h-1 bg-gradient-to-r from-transparent via-[#ff0040] to-transparent mx-auto rounded-full"
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
          />
          
          <motion.p
            className="text-gray-500 mt-4 max-w-xl mx-auto text-sm md:text-base font-mono"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
          >
            // Showcasing digital experiences crafted with precision
          </motion.p>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 gap-5 md:gap-6 lg:gap-8 max-w-5xl mx-auto">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        {/* View More Button */}
        <motion.div
          className="text-center mt-12 md:mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
        >
          <motion.a
            href="https://github.com/anunnaki7?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-3 px-8 py-3.5 font-bold text-sm
              border border-[#ff0040]/50 text-[#ff0040] rounded-lg overflow-hidden
              hover:border-[#ff0040] transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, rgba(255,0,64,0.05) 0%, transparent 100%)',
            }}
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(255,0,64,0.3)' }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
            </svg>
            <span>VIEW ALL REPOS</span>
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
