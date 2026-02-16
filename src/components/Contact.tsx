import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';

export function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setFormData({ name: '', email: '', message: '' });
      alert('Message sent successfully!');
    }, 2000);
  };

  const socialLinks = [
    {
      name: 'GitHub',
      url: 'https://github.com',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
        </svg>
      ),
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/38nikola?utm_source=qr',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
        </svg>
      ),
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
    },
    {
      name: 'Email',
      url: 'mailto:dzoni.luta07@gmail.com',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  return (
    <section id="contact" className="py-16 md:py-20 lg:py-24 relative z-10">
      <div className="container mx-auto px-6" ref={ref}>
        {/* Section Title */}
        <div className="text-center mb-10 md:mb-12 lg:mb-16">
          <motion.h2
            className="text-4xl md:text-5xl font-bold font-['Orbitron'] mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
          >
            <span className="text-white">&lt;</span>
            <span className="text-[#ff0040] neon-glow">CONTACT</span>
            <span className="text-white">/&gt;</span>
          </motion.h2>
          <div className="w-24 h-1 bg-[#ff0040] mx-auto rounded-full glow-box" />
          <motion.p
            className="text-gray-400 mt-4 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
          >
            Have a project in mind? Let's connect and build something amazing together.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 md:gap-10 lg:gap-12 max-w-5xl mx-auto">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-8 neon-border space-y-6">
              <div>
                <label className="block text-[#ff0040] font-mono text-sm mb-2">
                  {'>'} NAME_
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-black/50 border border-[#ff0040]/30 rounded-lg px-4 py-3 text-white 
                    focus:border-[#ff0040] focus:outline-none focus:ring-2 focus:ring-[#ff0040]/20 transition-all"
                  placeholder="Enter your name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-[#ff0040] font-mono text-sm mb-2">
                  {'>'} EMAIL_
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-black/50 border border-[#ff0040]/30 rounded-lg px-4 py-3 text-white 
                    focus:border-[#ff0040] focus:outline-none focus:ring-2 focus:ring-[#ff0040]/20 transition-all"
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <div>
                <label className="block text-[#ff0040] font-mono text-sm mb-2">
                  {'>'} MESSAGE_
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={5}
                  className="w-full bg-black/50 border border-[#ff0040]/30 rounded-lg px-4 py-3 text-white 
                    focus:border-[#ff0040] focus:outline-none focus:ring-2 focus:ring-[#ff0040]/20 transition-all resize-none"
                  placeholder="Type your message..."
                  required
                />
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#ff0040] text-black font-bold font-['Orbitron'] rounded-lg
                  hover:bg-transparent hover:text-[#ff0040] border-2 border-[#ff0040] transition-all duration-300
                  disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(255, 0, 64, 0.5)' }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.span
                      className="inline-block w-5 h-5 border-2 border-current border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                    SENDING...
                  </span>
                ) : (
                  'SEND MESSAGE'
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Contact Info & Social */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-col justify-center"
          >
            <div className="glass-card rounded-2xl p-8 neon-border mb-8">
              <h3 className="text-2xl font-bold text-white font-['Orbitron'] mb-6">
                <span className="text-[#ff0040]">//</span> Connect With Me
              </h3>
              <p className="text-gray-400 mb-4">
                I'm always open to discussing new projects, creative ideas, or opportunities to be 
                part of your vision. Feel free to reach out through any of these platforms.
              </p>
              
              {/* Direct Email Link */}
              <motion.a
                href="mailto:dzoni.luta07@gmail.com"
                className="inline-flex items-center gap-3 px-4 py-3 mb-8 rounded-lg border border-[#ff0040]/30 
                  hover:border-[#ff0040] hover:bg-[#ff0040]/10 transition-all group"
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.7 }}
                whileHover={{ scale: 1.02, boxShadow: '0 0 25px rgba(255, 0, 64, 0.3)' }}
              >
                <span className="text-[#ff0040] group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <span className="text-[#ff0040] font-mono text-sm md:text-base" style={{ textShadow: '0 0 10px rgba(255,0,64,0.3)' }}>
                  dzoni.luta07@gmail.com
                </span>
              </motion.a>
              
              {/* Social Links */}
              <div className="grid grid-cols-2 gap-4">
                {socialLinks.map((link, index) => (
                  <motion.a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 rounded-lg border border-[#ff0040]/30 
                      hover:border-[#ff0040] hover:bg-[#ff0040]/10 transition-all group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(255, 0, 64, 0.3)' }}
                  >
                    <span className="text-[#ff0040] group-hover:scale-110 transition-transform">
                      {link.icon}
                    </span>
                    <span className="text-white font-mono">{link.name}</span>
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Terminal hint */}
            <motion.div
              className="text-center text-gray-500 text-sm font-mono"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 1.2 }}
            >
              <span className="text-[#ff0040]">TIP:</span> Try typing "sudo nl" or pressing Ctrl+Shift+T
            </motion.div>
          </motion.div>
        </div>

        {/* Footer removed - using Footer.tsx component instead */}
      </div>
    </section>
  );
}
