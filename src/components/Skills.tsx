import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { IconType } from 'react-icons';
import { 
  SiReact, 
  SiTypescript, 
  SiJavascript, 
  SiTailwindcss, 
  SiHtml5,
  SiGit, 
  SiVite, 
  SiFigma, 
  SiNpm
} from 'react-icons/si';
import { VscCode } from 'react-icons/vsc';

// Skill type with proper icon typing
interface Skill {
  name: string;
  level: number;
  icon: IconType;
}

interface SkillCategory {
  title: string;
  icon: IconType;
  skills: Skill[];
}

const skillCategories: SkillCategory[] = [
  {
    title: 'Frontend',
    icon: SiReact,
    skills: [
      { name: 'React', level: 90, icon: SiReact },
      { name: 'TypeScript', level: 85, icon: SiTypescript },
      { name: 'JavaScript', level: 95, icon: SiJavascript },
      { name: 'Tailwind CSS', level: 90, icon: SiTailwindcss },
      { name: 'HTML/CSS', level: 95, icon: SiHtml5 },
    ],
  },
  {
    title: 'Tools & Others',
    icon: SiGit,
    skills: [
      { name: 'Git', level: 85, icon: SiGit },
      { name: 'Vite', level: 80, icon: SiVite },
      { name: 'Figma', level: 70, icon: SiFigma },
      { name: 'VS Code', level: 95, icon: VscCode },
      { name: 'npm/yarn', level: 85, icon: SiNpm },
    ],
  },
];

// Icon colors for hover effect
const iconColors: Record<string, string> = {
  'React': '#61DAFB',
  'TypeScript': '#3178C6',
  'JavaScript': '#F7DF1E',
  'Tailwind CSS': '#06B6D4',
  'HTML/CSS': '#E34F26',
  'Git': '#F05032',
  'Vite': '#646CFF',
  'Figma': '#F24E1E',
  'VS Code': '#007ACC',
  'npm/yarn': '#CB3837',
};

interface SkillCardProps {
  category: SkillCategory;
  index: number;
}

function SkillCard({ category, index }: SkillCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 20;
    const y = (e.clientY - rect.top - rect.height / 2) / 20;
    setMousePosition({ x, y });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePosition({ x: 0, y: 0 });
  };

  const CategoryIcon = category.icon;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.2, duration: 0.6 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: isHovered
          ? `perspective(1000px) rotateX(${-mousePosition.y}deg) rotateY(${mousePosition.x}deg) translateZ(10px)`
          : 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)',
        transition: 'transform 0.1s ease-out',
      }}
    >
      <motion.div
        className="glass-card rounded-2xl p-8 neon-border h-full"
        animate={{
          boxShadow: isHovered
            ? '0 0 60px rgba(255, 0, 64, 0.4), 0 25px 50px rgba(0, 0, 0, 0.5)'
            : '0 0 20px rgba(255, 0, 64, 0.1)',
          y: isHovered ? -10 : 0,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {/* Category Header */}
        <div className="flex items-center gap-4 mb-8">
          <motion.div
            className="relative"
            animate={{ 
              rotate: isHovered ? 360 : 0,
            }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          >
            {/* Icon glow background */}
            <div 
              className="absolute inset-0 blur-xl opacity-50 transition-opacity duration-300"
              style={{ 
                backgroundColor: isHovered ? '#ff0040' : 'transparent',
                transform: 'scale(1.5)',
              }}
            />
            <CategoryIcon 
              size={48} 
              className="relative z-10 text-white transition-all duration-300"
              style={{
                filter: isHovered ? 'drop-shadow(0 0 20px rgba(255, 0, 64, 0.8))' : 'none',
                color: isHovered ? '#ff0040' : '#ffffff',
              }}
            />
          </motion.div>
          <h3 className="text-2xl font-bold text-white font-['Orbitron']">
            {category.title}
          </h3>
        </div>

        {/* Skills List */}
        <div className="space-y-5">
          {category.skills.map((skill, skillIndex) => {
            const SkillIcon = skill.icon;
            const isSkillHovered = hoveredSkill === skill.name;
            const brandColor = iconColors[skill.name] || '#ff0040';
            
            return (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 + skillIndex * 0.1 }}
                onMouseEnter={() => setHoveredSkill(skill.name)}
                onMouseLeave={() => setHoveredSkill(null)}
                className="group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    {/* Skill Icon */}
                    <motion.div
                      className="relative"
                      animate={{
                        scale: isSkillHovered ? 1.15 : 1,
                        rotate: isSkillHovered ? 5 : 0,
                      }}
                      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                    >
                      {/* Icon glow on hover */}
                      <motion.div
                        className="absolute inset-0 rounded-full blur-md"
                        animate={{
                          opacity: isSkillHovered ? 0.6 : 0,
                          scale: isSkillHovered ? 1.8 : 1,
                        }}
                        style={{ backgroundColor: '#ff0040' }}
                        transition={{ duration: 0.2 }}
                      />
                      <SkillIcon 
                        size={24}
                        className="relative z-10 transition-all duration-300 md:w-6 md:h-6 w-5 h-5"
                        style={{
                          color: isSkillHovered ? '#ff0040' : '#9ca3af',
                          filter: isSkillHovered 
                            ? 'drop-shadow(0 0 12px rgba(255, 0, 64, 0.8))' 
                            : 'none',
                        }}
                      />
                    </motion.div>
                    
                    {/* Skill name */}
                    <motion.span 
                      className="text-gray-300 font-mono transition-colors duration-300"
                      animate={{
                        color: isSkillHovered ? '#ffffff' : '#d1d5db',
                      }}
                    >
                      {skill.name}
                    </motion.span>
                  </div>
                  
                  {/* Percentage */}
                  <motion.span 
                    className="text-[#ff0040] font-mono font-bold"
                    animate={{
                      scale: isSkillHovered ? 1.1 : 1,
                      textShadow: isSkillHovered 
                        ? '0 0 15px rgba(255, 0, 64, 0.8)' 
                        : '0 0 0px transparent',
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                  >
                    {skill.level}%
                  </motion.span>
                </div>
                
                {/* Progress Bar */}
                <div className="h-2 bg-gray-800/80 rounded-full overflow-hidden relative">
                  {/* Background glow on hover */}
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    animate={{
                      boxShadow: isSkillHovered 
                        ? 'inset 0 0 10px rgba(255, 0, 64, 0.3)' 
                        : 'inset 0 0 0px transparent',
                    }}
                  />
                  
                  <motion.div
                    className="h-full rounded-full relative"
                    style={{
                      background: isSkillHovered 
                        ? `linear-gradient(90deg, #ff0040, ${brandColor}, #ff0040)` 
                        : 'linear-gradient(90deg, #ff0040, #ff6b8a)',
                      boxShadow: isSkillHovered 
                        ? '0 0 20px rgba(255, 0, 64, 0.8)' 
                        : '0 0 10px rgba(255, 0, 64, 0.5)',
                    }}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: index * 0.2 + skillIndex * 0.1 }}
                  >
                    {/* Shimmer effect on hover */}
                    {isSkillHovered && (
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        style={{
                          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                        }}
                        animate={{ x: ['-100%', '200%'] }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      />
                    )}
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Card corner decorations */}
        <div className="absolute top-3 left-3 w-4 h-4 border-l-2 border-t-2 border-[#ff0040]/30 rounded-tl" />
        <div className="absolute top-3 right-3 w-4 h-4 border-r-2 border-t-2 border-[#ff0040]/30 rounded-tr" />
        <div className="absolute bottom-3 left-3 w-4 h-4 border-l-2 border-b-2 border-[#ff0040]/30 rounded-bl" />
        <div className="absolute bottom-3 right-3 w-4 h-4 border-r-2 border-b-2 border-[#ff0040]/30 rounded-br" />
      </motion.div>
    </motion.div>
  );
}

export function Skills() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="skills" className="py-20 relative z-10">
      <div className="container mx-auto px-6" ref={ref}>
        {/* Section Title */}
        <div className="text-center mb-16">
          <motion.h2
            className="text-4xl md:text-5xl font-bold font-['Orbitron'] mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
          >
            <span className="text-white">&lt;</span>
            <span className="text-[#ff0040] neon-glow">SKILLS</span>
            <span className="text-white">/&gt;</span>
          </motion.h2>
          <div className="w-24 h-1 bg-[#ff0040] mx-auto rounded-full glow-box" />
          <motion.p
            className="text-gray-400 mt-4 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
          >
            Technologies and tools I use to bring ideas to life.
          </motion.p>
        </div>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {skillCategories.map((category, index) => (
            <SkillCard key={category.title} category={category} index={index} />
          ))}
        </div>

        {/* Tech stack floating badges - Desktop only */}
        <motion.div
          className="hidden lg:flex justify-center gap-4 mt-16 flex-wrap"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
        >
          {[
            { icon: SiReact, name: 'React' },
            { icon: SiTypescript, name: 'TypeScript' },
            { icon: SiTailwindcss, name: 'Tailwind' },
            { icon: SiVite, name: 'Vite' },
            { icon: SiGit, name: 'Git' },
          ].map((tech, i) => {
            const Icon = tech.icon;
            return (
              <motion.div
                key={tech.name}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#ff0040]/20 bg-black/30 backdrop-blur-sm"
                whileHover={{ 
                  scale: 1.05, 
                  borderColor: '#ff0040',
                  boxShadow: '0 0 20px rgba(255, 0, 64, 0.3)',
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.1 }}
              >
                <Icon size={18} className="text-[#ff0040]" />
                <span className="text-gray-400 text-sm font-mono">{tech.name}</span>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
