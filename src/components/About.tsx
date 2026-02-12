import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

export function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-20 relative z-10">
      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          {/* Section Title */}
          <div className="text-center mb-16">
            <motion.h2
              className="text-4xl md:text-5xl font-bold font-['Orbitron'] mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
            >
              <span className="text-white">&lt;</span>
              <span className="text-[#ff0040] neon-glow">ABOUT</span>
              <span className="text-white">/&gt;</span>
            </motion.h2>
            <div className="w-24 h-1 bg-[#ff0040] mx-auto rounded-full glow-box" />
          </div>

          {/* About Card */}
          <motion.div
            className="max-w-4xl mx-auto glass-card rounded-2xl p-8 md:p-12 neon-border"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.4, duration: 0.6 }}
            whileHover={{ 
              boxShadow: '0 0 40px rgba(255, 0, 64, 0.3)',
              borderColor: '#ff0040'
            }}
          >
            <div className="grid md:grid-cols-3 gap-8 items-center">
              {/* Avatar/Image placeholder */}
              <motion.div
                className="flex justify-center"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="w-48 h-48 rounded-full border-4 border-[#ff0040] flex items-center justify-center bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] glow-box">
                  <span className="text-6xl font-bold font-['Orbitron'] text-[#ff0040]">NL</span>
                </div>
              </motion.div>

              {/* Bio Content */}
              <div className="md:col-span-2 space-y-6">
                <motion.p
                  className="text-gray-300 text-lg leading-relaxed"
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.5 }}
                >
                  <span className="text-[#ff0040] font-bold">Hello, World!</span> I am a Vibe Coding developer from Montenegro with over one year of hands-on experience building modern and visually powerful web experiences. I focus on clean code, performance, and bold design. My goal is to create digital products that feel confident, fast, and different.
                </motion.p>

                {/* Stats */}
                <motion.div
                  className="grid grid-cols-3 gap-4 pt-6 border-t border-[#ff0040]/30"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.8 }}
                >
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#ff0040] neon-glow">1+</div>
                    <div className="text-sm text-gray-500">Years Exp</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#ff0040] neon-glow">20+</div>
                    <div className="text-sm text-gray-500">Projects</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#ff0040] neon-glow">∞</div>
                    <div className="text-sm text-gray-500">Passion</div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
