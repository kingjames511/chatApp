/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, FormEvent, useRef } from 'react';
import { 
  MessageSquare, 
  Shield, 
  Zap, 
  Smartphone, 
  Moon, 
  Sun, 
  Menu, 
  X, 
  ArrowRight, 
  CheckCircle2, 
  Star,
  Lock,
  Globe,
  Phone
} from 'lucide-react';
import { motion, AnimatePresence, useInView, useMotionValue, useTransform, animate } from 'motion/react';

// --- Components ---

const Counter = ({ value, suffix = "", decimals = 0 }: { value: number, suffix?: string, decimals?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => latest.toFixed(decimals));

  useEffect(() => {
    if (isInView) {
      animate(count, value, { duration: 2, ease: "easeOut" });
    }
  }, [isInView, count, value]);

  return <span ref={ref}><motion.span>{rounded}</motion.span>{suffix}</span>;
};

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-40 p-4 bg-brand-600 text-white rounded-full shadow-2xl shadow-brand-600/30 hover:bg-brand-700 transition-all"
        >
          <ArrowRight className="-rotate-90" size={24} />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

const SectionReveal = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const Navbar = ({ toggleTheme, isDark, onAuthClick }: { toggleTheme: () => void, isDark: boolean, onAuthClick: (view: 'login' | 'signup') => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'Security', href: '#security' },
    { name: 'Testimonials', href: '#testimonials' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center p-6 pointer-events-none">
      <nav className={`
        pointer-events-auto
        flex items-center justify-between
        px-6 py-3 rounded-full transition-all duration-500
        ${isScrolled 
          ? 'w-full max-w-4xl glass shadow-2xl shadow-brand-600/10 border-white/10' 
          : 'w-full max-w-7xl bg-transparent border-transparent'}
      `}>
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-600/30 group-hover:rotate-6 transition-transform duration-300">
            <Zap className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-display font-bold tracking-tight dark:text-white">Lumina</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className="text-sm font-bold text-zinc-500 dark:text-zinc-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
            >
              {link.name}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-white/10 transition-all duration-300 text-zinc-600 dark:text-zinc-400"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button 
            onClick={() => onAuthClick('login')}
            className="text-sm font-bold text-zinc-900 dark:text-white px-5 py-2.5 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-xl transition-all"
          >
            Log in
          </button>
          <button 
            onClick={() => onAuthClick('signup')}
            className="bg-brand-600 text-white px-7 py-3 rounded-xl text-sm font-bold hover:bg-brand-700 hover:scale-[1.05] active:scale-[0.95] transition-all duration-300 shadow-xl shadow-brand-600/20"
          >
            Get Started
          </button>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center gap-3">
          <button onClick={toggleTheme} className="p-2 text-zinc-600 dark:text-zinc-400">
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-zinc-900 dark:text-white">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] md:hidden bg-navy-950/95 backdrop-blur-2xl"
          >
            <div className="flex flex-col h-full p-8">
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center">
                    <Zap className="text-white w-6 h-6" />
                  </div>
                  <span className="text-2xl font-display font-bold text-white">Lumina.ai</span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-white/70 hover:text-white">
                  <X size={32} />
                </button>
              </div>

              <div className="flex flex-col gap-8">
                {navLinks.map((link, i) => (
                  <motion.a 
                    key={link.name} 
                    href={link.href} 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-3xl font-display font-bold text-white/80 hover:text-brand-400 transition-colors"
                  >
                    {link.name}
                  </motion.a>
                ))}
              </div>

              <div className="mt-auto flex flex-col gap-4">
                <button 
                  onClick={() => { onAuthClick('login'); setMobileMenuOpen(false); }}
                  className="w-full py-5 rounded-2xl border border-white/10 text-white font-bold text-lg"
                >
                  Log in
                </button>
                <button 
                  onClick={() => { onAuthClick('signup'); setMobileMenuOpen(false); }}
                  className="w-full py-5 bg-brand-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-brand-600/20"
                >
                  Get Started
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

const Hero = ({ onAuthClick }: { onAuthClick: (view: 'signup') => void }) => {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-40 overflow-hidden bg-navy-950">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full hero-glow" />
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-brand-600/10 blur-[140px] rounded-full" />
        <div className="absolute bottom-[10%] right-[-10%] w-[60%] h-[60%] bg-accent-purple/5 blur-[140px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-brand-400 text-xs font-bold uppercase tracking-[0.2em] mb-8">
              <span className="w-2 h-2 rounded-full bg-brand-500 animate-ping" />
              Next Gen AI Messaging
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-extrabold tracking-tight text-white mb-8 leading-[1.1]">
              The Future of <br /> <span className="text-brand-500">Intelligent</span> <br /> Conversations
            </h1>
            <p className="text-lg md:text-xl text-zinc-400 mb-10 leading-relaxed font-medium max-w-xl">
              Experience a messaging platform that thinks with you. Personalized AI summaries, smart predictions, and absolute privacy.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <button 
                onClick={() => onAuthClick('signup')}
                className="btn-primary w-full sm:w-auto"
              >
                Get Started Free <ArrowRight size={20} />
              </button>
              <button className="btn-secondary w-full sm:w-auto">
                Watch Demo
              </button>
            </div>
            
            <div className="mt-12 flex items-center gap-6 opacity-50">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <img key={i} src={`https://picsum.photos/seed/user${i}/100/100`} className="w-10 h-10 rounded-full border-2 border-navy-950" alt="User" referrerPolicy="no-referrer" />
                ))}
              </div>
              <div className="text-sm text-white font-medium">
                Joined by <span className="text-brand-400 font-bold">50k+</span> early adopters
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9, x: 30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            <div className="glass-card rounded-[3rem] overflow-hidden p-3 shadow-2xl relative z-20">
              <div className="rounded-[2.5rem] overflow-hidden bg-navy-950 aspect-[4/5] sm:aspect-[16/10] lg:aspect-[4/5] relative">
                <div className="absolute inset-0 flex flex-col p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-600 flex items-center justify-center">
                        <Zap className="text-white w-5 h-5" />
                      </div>
                      <div className="h-3 w-24 bg-white/20 rounded" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/5" />
                  </div>
                  
                  <div className="space-y-4 flex-1">
                    <div className="bg-brand-600 text-white p-4 rounded-2xl rounded-tr-none max-w-[80%] ml-auto text-sm">
                      Lumina just summarized our 2-hour meeting into 5 key points.
                    </div>
                    <div className="bg-white/10 p-4 rounded-2xl rounded-tl-none max-w-[80%] text-sm text-white">
                      That's insane! Can it handle the action items too?
                    </div>
                    <div className="bg-brand-600 text-white p-4 rounded-2xl rounded-tr-none max-w-[80%] ml-auto text-sm">
                      Already done. They're synced to our calendar. 📅
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between">
                    <div className="h-2 w-32 bg-white/20 rounded" />
                    <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
                      <ArrowRight size={16} className="text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-500/20 blur-[80px] -z-10" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-accent-purple/20 blur-[80px] -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Features = () => {
  const features = [
    {
      title: 'AI Predictions',
      desc: 'Suggests best times for engagement.',
      icon: <Zap className="text-brand-500" />,
      className: 'md:col-span-2 md:row-span-1'
    },
    {
      title: 'Smart Routes',
      desc: 'Faster communication paths.',
      icon: <Globe className="text-accent-blue" />,
      className: 'md:col-span-1 md:row-span-1'
    },
    {
      title: 'Secure Access',
      desc: 'Enterprise-grade encryption.',
      icon: <Lock className="text-rose-500" />,
      className: 'md:col-span-1 md:row-span-2'
    },
    {
      title: 'Team Dynamics',
      desc: 'Real-time sentiment analysis.',
      icon: <MessageSquare className="text-teal-500" />,
      className: 'md:col-span-1 md:row-span-1'
    },
    {
      title: 'HD Voice',
      desc: 'Crystal clear AI audio.',
      icon: <Phone className="text-brand-500" />,
      className: 'md:col-span-2 md:row-span-1'
    }
  ];

  return (
    <section id="features" className="py-32 bg-zinc-50/50 dark:bg-navy-950/50">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <div className="max-w-2xl">
            <div className="inline-block px-4 py-1 rounded-full bg-brand-500/10 text-brand-600 text-xs font-bold uppercase tracking-widest mb-4">
              Intelligence
            </div>
            <h2 className="text-4xl md:text-6xl font-display font-bold text-zinc-900 dark:text-white">
              Built for the <span className="text-brand-600">next era</span> of work.
            </h2>
          </div>
          <p className="text-zinc-500 dark:text-zinc-400 font-medium max-w-sm">
            Lumina combines advanced AI with a sleek interface to redefine how teams interact.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`p-8 rounded-[2.5rem] bg-white dark:bg-navy-900/40 border border-zinc-200/50 dark:border-white/5 hover:shadow-2xl transition-all duration-500 group flex flex-col justify-between ${f.className}`}
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  {f.icon}
                </div>
                <h3 className="text-2xl font-display font-bold text-zinc-900 dark:text-white mb-3">{f.title}</h3>
                <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                  {f.desc}
                </p>
              </div>
              <div className="mt-8">
                <button className="text-brand-600 dark:text-brand-400 text-xs font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
                  Explore <ArrowRight size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => {
  const testimonials = [
    { name: 'Sarah Chen', role: 'CTO at TechFlow', content: 'Lumina has completely transformed how our engineering team communicates. The AI summaries are a lifesaver.', avatar: 'https://picsum.photos/seed/sarah/100/100' },
    { name: 'Marcus Wright', role: 'Product Designer', content: 'The interface is stunning. It feels like a tool from the future, yet it is incredibly intuitive to use.', avatar: 'https://picsum.photos/seed/marcus/100/100' },
    { name: 'Elena Rodriguez', role: 'Marketing Lead', content: 'Security was our main concern, and Lumina exceeded our expectations. Truly enterprise-grade.', avatar: 'https://picsum.photos/seed/elena/100/100' },
    { name: 'David Kim', role: 'Startup Founder', content: 'We scaled from 5 to 50 people using Lumina. It kept our culture intact while improving efficiency.', avatar: 'https://picsum.photos/seed/david/100/100' },
    { name: 'Jessica Lee', role: 'UX Researcher', content: 'The attention to detail in the micro-interactions is what sets Lumina apart from other platforms.', avatar: 'https://picsum.photos/seed/jessica/100/100' },
    { name: 'Tom Wilson', role: 'DevOps Engineer', content: 'Integration was seamless. The API is well-documented and the support team is top-notch.', avatar: 'https://picsum.photos/seed/tom/100/100' },
  ];

  return (
    <section id="testimonials" className="py-32 bg-white dark:bg-navy-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-8 mb-20 text-center">
        <h2 className="text-4xl md:text-6xl font-display font-bold text-zinc-900 dark:text-white mb-6">Loved by teams worldwide.</h2>
        <p className="text-zinc-500 dark:text-zinc-400 font-medium max-w-2xl mx-auto">
          Join thousands of forward-thinking companies that have already switched to Lumina.
        </p>
      </div>

      <div className="relative flex overflow-x-hidden">
        <div className="animate-marquee whitespace-nowrap flex gap-8 py-4">
          {[...testimonials, ...testimonials].map((t, i) => (
            <div 
              key={i}
              className="inline-block w-[400px] p-8 rounded-[2.5rem] bg-zinc-50 dark:bg-navy-900/40 border border-zinc-200/50 dark:border-white/5 shadow-sm"
            >
              <div className="flex items-center gap-4 mb-6">
                <img src={t.avatar} className="w-12 h-12 rounded-2xl object-cover" alt={t.name} referrerPolicy="no-referrer" />
                <div>
                  <div className="text-zinc-900 dark:text-white font-bold">{t.name}</div>
                  <div className="text-zinc-500 dark:text-zinc-400 text-xs font-medium">{t.role}</div>
                </div>
              </div>
              <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed font-medium italic whitespace-normal">
                "{t.content}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="py-24 border-t border-zinc-100 dark:border-white/5 bg-white dark:bg-[#09090b]">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid md:grid-cols-12 gap-16 mb-24">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-brand-700 rounded-2xl flex items-center justify-center shadow-xl shadow-brand-600/20">
                <Zap className="text-white w-7 h-7" />
              </div>
              <span className="text-3xl font-display font-black tracking-tighter dark:text-white">Lumina.ai</span>
            </div>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-sm mb-10 text-lg leading-relaxed font-medium">
              The next-generation AI messaging platform for teams who value speed, intelligence, and absolute privacy.
            </p>
            <div className="flex gap-4">
              {[Globe, MessageSquare, Phone, Shield].map((Icon, i) => (
                <motion.div 
                  key={i} 
                  whileHover={{ scale: 1.1, backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                  whileTap={{ scale: 0.9 }}
                  className="w-12 h-12 rounded-2xl border border-zinc-200 dark:border-white/10 flex items-center justify-center text-zinc-400 hover:text-brand-500 hover:border-brand-500 transition-all cursor-pointer"
                >
                  <Icon size={20} />
                </motion.div>
              ))}
            </div>
          </div>
          
          <div className="md:col-span-2">
            <h4 className="font-display font-bold text-zinc-900 dark:text-white mb-8 text-lg uppercase tracking-widest">Product</h4>
            <ul className="space-y-5 font-medium">
              <li><a href="#features" className="footer-link">AI Features</a></li>
              <li><a href="#security" className="footer-link">Security First</a></li>
              <li><a href="#" className="footer-link">Enterprise</a></li>
              <li><a href="#" className="footer-link">Pricing</a></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-display font-bold text-zinc-900 dark:text-white mb-8 text-lg uppercase tracking-widest">Company</h4>
            <ul className="space-y-5 font-medium">
              <li><a href="#" className="footer-link">About Us</a></li>
              <li><a href="#" className="footer-link">Privacy Policy</a></li>
              <li><a href="#" className="footer-link">Terms of Service</a></li>
              <li><a href="#" className="footer-link">Careers</a></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="font-display font-bold text-zinc-900 dark:text-white mb-8 text-lg uppercase tracking-widest">Newsletter</h4>
            <p className="text-zinc-500 dark:text-zinc-400 mb-6 text-sm font-medium">Get the latest updates on AI communication.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Email address" 
                className="bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500 transition-colors w-full"
              />
              <button className="p-3 bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition-colors">
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-zinc-100 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-sm text-zinc-500 dark:text-zinc-500 font-medium">
            © 2026 Lumina Messaging Inc. Built with intelligence.
          </p>
          <div className="flex gap-10 text-sm font-medium">
            <a href="#" className="footer-link">Privacy</a>
            <a href="#" className="footer-link">Terms</a>
            <a href="#" className="footer-link">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const AuthModal = ({ isOpen, onClose, initialView }: { isOpen: boolean, onClose: () => void, initialView: 'login' | 'signup' }) => {
  const [view, setView] = useState(initialView);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    setView(initialView);
    setError('');
    setIsSuccess(false);
  }, [initialView, isOpen]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (view === 'signup' && !name) {
      setError('Please enter your full name');
      return;
    }

    if (!phone || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (phone.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      // For demo, close after a delay
      setTimeout(() => {
        onClose();
      }, 2000);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-navy-950/80 backdrop-blur-md"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-lg glass-card rounded-[2.5rem] sm:rounded-[3rem] overflow-hidden shadow-3xl max-h-[90vh] overflow-y-auto scrollbar-hide"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 sm:top-8 sm:right-8 p-2 sm:p-3 rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors dark:text-white z-10"
        >
          <X size={24} />
        </button>

        <div className="p-8 sm:p-12 md:p-16">
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-500/30">
                  <CheckCircle2 className="text-white w-12 h-12" />
                </div>
                <h2 className="text-4xl font-display font-extrabold text-zinc-900 dark:text-white mb-4">
                  Success!
                </h2>
                <p className="text-zinc-500 dark:text-zinc-400 text-lg font-medium">
                  {view === 'login' ? 'Welcome back to Lumina.ai' : 'Your account has been created'}
                </p>
                <p className="mt-8 text-sm text-zinc-400">Redirecting you to dashboard...</p>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="text-center mb-10 sm:mb-12">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-brand-600 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-2xl shadow-brand-600/30">
                    <Zap className="text-white w-8 h-8 sm:w-10 sm:h-10" />
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-zinc-900 dark:text-white mb-2 sm:mb-3">
                    {view === 'login' ? 'Welcome back' : 'Create account'}
                  </h2>
                  <p className="text-zinc-500 dark:text-zinc-400 text-base sm:text-lg font-medium">
                    {view === 'login' ? 'Enter your details to continue' : 'Join thousands of users today'}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                  {view === 'signup' && (
                    <div className="space-y-2 sm:space-y-3">
                      <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 ml-2 uppercase tracking-widest">Full Name</label>
                      <div className="relative">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400">
                          <Star size={20} />
                        </div>
                        <input 
                          type="text" 
                          placeholder="John Doe"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="input-field"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2 sm:space-y-3">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 ml-2 uppercase tracking-widest">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
                      <input 
                        type="tel" 
                        placeholder="+1 (555) 000-0000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 ml-2 uppercase tracking-widest">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
                      <input 
                        type="password" 
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input-field"
                      />
                    </div>
                  </div>

                  {view === 'login' && (
                    <div className="flex items-center justify-between px-2">
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <div className={`w-5 h-5 rounded border transition-all flex items-center justify-center ${rememberMe ? 'bg-brand-600 border-brand-600' : 'border-zinc-300 dark:border-zinc-700 group-hover:border-brand-500'}`}>
                          {rememberMe && <CheckCircle2 size={14} className="text-white" />}
                        </div>
                        <input 
                          type="checkbox" 
                          className="hidden" 
                          checked={rememberMe}
                          onChange={() => setRememberMe(!rememberMe)}
                        />
                        <span className="text-sm text-zinc-600 dark:text-zinc-400 font-medium">Remember me</span>
                      </label>
                      <button type="button" className="text-sm text-brand-500 font-bold hover:underline">
                        Forgot password?
                      </button>
                    </div>
                  )}

                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-4 sm:p-5 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-500 text-sm font-bold flex items-center gap-3"
                    >
                      <X size={18} /> {error}
                    </motion.div>
                  )}

                  <button 
                    disabled={isLoading}
                    className="btn-primary w-full py-4 sm:py-5 text-lg sm:text-xl"
                  >
                    {isLoading ? (
                      <div className="w-6 h-6 sm:w-7 sm:h-7 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      view === 'login' ? 'Log In' : 'Create Account'
                    )}
                  </button>

                  <div className="relative py-2 sm:py-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-zinc-200 dark:border-zinc-800"></div>
                    </div>
                    <div className="relative flex justify-center text-[10px] sm:text-xs uppercase">
                      <span className="bg-white dark:bg-navy-900 px-4 text-zinc-500 dark:text-zinc-400 font-bold tracking-widest">Or continue with</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <button type="button" className="flex items-center justify-center gap-2 sm:gap-3 py-3 sm:py-4 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all font-bold dark:text-white text-sm sm:text-base">
                      <Globe size={18} /> Google
                    </button>
                    <button type="button" className="flex items-center justify-center gap-2 sm:gap-3 py-3 sm:py-4 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all font-bold dark:text-white text-sm sm:text-base">
                      <Smartphone size={18} /> Apple
                    </button>
                  </div>
                </form>

                <div className="mt-8 sm:mt-10 text-center">
                  <p className="text-zinc-500 dark:text-zinc-400 text-sm sm:text-base">
                    {view === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
                    <button 
                      onClick={() => setView(view === 'login' ? 'signup' : 'login')}
                      className="text-brand-500 font-bold hover:underline ml-1"
                    >
                      {view === 'login' ? 'Sign up' : 'Log in'}
                    </button>
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [authModal, setAuthModal] = useState<{ isOpen: boolean, view: 'login' | 'signup' }>({
    isOpen: false,
    view: 'login'
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  const openAuth = (view: 'login' | 'signup') => {
    setAuthModal({ isOpen: true, view });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="min-h-screen bg-white dark:bg-[#09090b] transition-colors duration-500 glow-mesh"
    >
      <Navbar toggleTheme={toggleTheme} isDark={isDark} onAuthClick={openAuth} />
      
      <main>
        <Hero onAuthClick={openAuth} />
        
        <SectionReveal>
          {/* Trusted By Section */}
          <section className="py-16 border-y border-zinc-100 dark:border-white/5 bg-zinc-50/30 dark:bg-navy-900/10">
            <div className="max-w-7xl mx-auto px-8">
              <p className="text-center text-xs font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-[0.4em] mb-12">
                Powering conversations for the world's best teams
              </p>
              <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24">
                {['TechFlow', 'Quantum', 'Nexus', 'Aether', 'Vortex'].map((brand, i) => (
                  <motion.div 
                    key={brand} 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 0.4, y: 0 }}
                    whileHover={{ opacity: 1, scale: 1.1, filter: 'grayscale(0%)' }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3 grayscale dark:invert cursor-pointer transition-all duration-300"
                  >
                    <div className="w-10 h-10 bg-zinc-400 dark:bg-zinc-600 rounded-xl" />
                    <span className="text-2xl font-display font-bold tracking-tight">{brand}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </SectionReveal>

        <SectionReveal>
          <Features />
        </SectionReveal>
        
        <SectionReveal>
          {/* Security Section */}
          <section id="security" className="py-32 bg-navy-950 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-brand-600/5 blur-[120px] rounded-full" />
            
            <div className="max-w-7xl mx-auto px-8 relative z-10">
              <div className="glass-card rounded-[3.5rem] p-12 md:p-20 border-white/10 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-brand-600/10 to-transparent pointer-events-none" />
                
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                  <div>
                    <div className="w-16 h-16 rounded-2xl bg-brand-600 flex items-center justify-center mb-8 shadow-xl shadow-brand-600/40">
                      <Shield className="text-white w-8 h-8" />
                    </div>
                    <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-8 leading-tight">
                      Your privacy is <br /> our <span className="text-brand-500">priority</span>.
                    </h2>
                    <p className="text-zinc-400 text-lg mb-10 leading-relaxed font-medium">
                      We believe privacy is a fundamental right. Lumina is built from the ground up to ensure your data stays yours.
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {['End-to-end AES-256 encryption', 'Self-destructing message options', 'Zero-knowledge architecture', 'Biometric authentication'].map((b, i) => (
                        <div key={i} className="flex items-center gap-3 text-white font-medium">
                          <div className="w-5 h-5 rounded-full bg-brand-500/20 flex items-center justify-center shrink-0">
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                          </div>
                          {b}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="relative">
                    <div className="relative z-10 bg-navy-900/80 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-full bg-brand-600 flex items-center justify-center">
                          <Lock className="text-white w-6 h-6" />
                        </div>
                        <div>
                          <div className="text-white font-bold">Security Shield</div>
                          <div className="text-brand-400 text-xs font-bold uppercase tracking-widest">Active</div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: '100%' }}
                            transition={{ duration: 2 }}
                            className="h-full bg-brand-500" 
                          />
                        </div>
                        <div className="flex justify-between text-xs font-bold text-zinc-500 uppercase tracking-widest">
                          <span>Encryption</span>
                          <span className="text-brand-400">Verified</span>
                        </div>
                      </div>
                      <div className="mt-8 pt-8 border-t border-white/5 grid grid-cols-2 gap-4">
                         <div className="text-center">
                            <div className="text-2xl font-display font-bold text-white">256</div>
                            <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Bit AES</div>
                         </div>
                         <div className="text-center">
                            <div className="text-2xl font-display font-bold text-white">0</div>
                            <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Logs Kept</div>
                         </div>
                      </div>
                    </div>
                    
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-white/5 rounded-full -z-10" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] border border-white/5 rounded-full -z-10" />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </SectionReveal>

        <SectionReveal>
          <Testimonials />
        </SectionReveal>

        <SectionReveal>
          {/* Stats Section */}
          <section className="py-32 bg-brand-600 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
            <div className="max-w-7xl mx-auto px-8 relative z-10">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
                {[
                  { label: 'Active Users', value: 2.4, suffix: 'M+', decimals: 1 },
                  { label: 'Messages Daily', value: 150, suffix: 'M+' },
                  { label: 'Uptime', value: 99.99, suffix: '%', decimals: 2 },
                  { label: 'Countries', value: 120, suffix: '+' },
                ].map((s, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-5xl md:text-7xl font-display font-black text-white mb-4 tracking-tighter">
                      <Counter value={s.value} suffix={s.suffix} decimals={s.decimals} />
                    </div>
                    <div className="text-brand-100 text-sm font-bold uppercase tracking-[0.2em]">{s.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </SectionReveal>

        <SectionReveal>
          {/* CTA Section */}
          <section className="py-24 md:py-48 relative overflow-hidden">
            {/* Background Visuals */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[#09090b]" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-600/20 blur-[160px] rounded-full animate-pulse" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-purple/20 blur-[140px] rounded-full animate-pulse" style={{ animationDelay: '-2s' }} />
              <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/carbon-fibre.png")' }} />
            </div>

            <div className="max-w-7xl mx-auto px-8 text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative z-10"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-brand-400 text-sm font-bold mb-8 backdrop-blur-md">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
                  </span>
                  Join 5M+ users today
                </div>

                <h2 className="text-5xl md:text-9xl font-display font-black text-white mb-10 leading-[0.9] tracking-tighter">
                  Ready to experience <br /> 
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-brand-500 to-accent-purple italic">
                    the future of chat?
                  </span>
                </h2>

                <p className="text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto mb-16 leading-relaxed font-medium">
                  Experience the most refined, secure, and powerful communication platform ever built. 
                  No compromises. Just pure connection.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => openAuth('signup')}
                    className="btn-primary w-full sm:w-auto"
                  >
                    Get Started for Free
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-secondary w-full sm:w-auto"
                  >
                    View Demo
                  </motion.button>
                </div>

                {/* Trust Badges */}
                <div className="mt-20 pt-10 border-t border-white/5 flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-40 grayscale">
                  {['App Store', 'Google Play', 'Web', 'Desktop'].map((platform) => (
                    <div key={platform} className="flex items-center gap-2 text-white font-bold text-sm uppercase tracking-widest">
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      {platform}
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>
        </SectionReveal>
      </main>

      <Footer />
      <ScrollToTop />

      <AnimatePresence>
        {authModal.isOpen && (
          <AuthModal 
            isOpen={authModal.isOpen} 
            onClose={() => setAuthModal({ ...authModal, isOpen: false })} 
            initialView={authModal.view}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
