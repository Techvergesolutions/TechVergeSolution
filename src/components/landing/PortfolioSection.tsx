import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, TrendingUp, ChevronLeft, ChevronRight, X, LayoutGrid } from "lucide-react";

interface Project {
  title: string;
  category: string;
  tagline: string;
  image: string;
  metrics: string;
  tags: string[];
  link: string;
}

const projects: Project[] = [
  {
    title: "ClockLog",
    category: "SaaS / Management",
    tagline: "A comprehensive time-tracking and productivity management platform for modern teams.",
    image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&auto=format&fit=crop",
    metrics: "+40% Efficiency",
    tags: ["React", "Dashboard", "Auth"],
    link: "https://clocklog-fe-app.vercel.app/login"
  },
  {
    title: "EventForce",
    category: "Event Management",
    tagline: "Professional event coordination platform specializing in Saudi Arabian large-scale events.",
    image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&auto=format&fit=crop",
    metrics: "Top Rated",
    tags: ["EventTech", "Planning", "Logistics"],
    link: "https://eventforce.sa.com/"
  },
  {
    title: "Student Help Squad",
    category: "Education Support",
    tagline: "A UK-based dedicated platform providing academic and personal assistance to students.",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop",
    metrics: "10K+ Students",
    tags: ["EdTech", "UK", "Community"],
    link: "https://studenthelpsquad.co.uk/"
  },
  {
    title: "ShareMyDine",
    category: "Food & Social",
    tagline: "Innovative dining experience platform connecting food enthusiasts across the UK.",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop",
    metrics: "Social Growth",
    tags: ["Marketplace", "Food", "Social"],
    link: "https://sharemydine.co.uk/"
  },
  {
    title: "BuzzHR",
    category: "Human Resources",
    tagline: "Streamlined HR management solution focusing on employee engagement and payroll.",
    image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&auto=format&fit=crop",
    metrics: "Enterprise Grade",
    tags: ["HRMS", "Management", "Saas"],
    link: "https://www.buzzhr.co.uk/"
  },
  {
    title: "Peoples Creed AI",
    category: "Artificial Intelligence",
    tagline: "AI-driven platform focused on ethical human resources and workforce intelligence.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop",
    metrics: "AI Integrated",
    tags: ["AI", "Innovation", "Web3"],
    link: "https://peoplescreed.ai/"
  },
  {
    title: "HealthPulse Interpreter",
    category: "Mobile App / AI",
    tagline: "Diagnostic interpretation app using AI/ML for health metrics analysis.",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop",
    metrics: "50K+ Downloads",
    tags: ["Android", "AI/ML", "Health"],
    link: "https://play.google.com/store/apps/details?id=org.auderenow.healthpulse.dxa.interpreter&hl=en"
  },
  {
    title: "Agentic Creed",
    category: "Next-Gen AI",
    tagline: "Autonomous AI agency platform for managing complex digital workflows.",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop",
    metrics: "Future Tech",
    tags: ["Agentic AI", "Automation", "Home"],
    link: "https://agenticcreed.ai/home"
  },
  {
    title: "Vogue Scents",
    category: "E-Commerce",
    tagline: "Luxury fragrance marketplace offering premium scents with a seamless experience.",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&auto=format&fit=crop",
    metrics: "High Conversion",
    tags: ["E-com", "Luxury", "Design"],
    link: "http://voguescents.com/"
  },
];

export const PortfolioSection: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [isGridOpen, setIsGridOpen] = useState(false);

  const nextSlide = () => setIndex((prev) => (prev + 1) % projects.length);
  const prevSlide = () => setIndex((prev) => (prev - 1 + projects.length) % projects.length);

  const onDragEnd = (e: any, info: any) => {
    if (info.offset.x < -50) nextSlide();
    if (info.offset.x > 50) prevSlide();
  };

  return (
    <section id="portfolio" className="relative py-32 overflow-hidden bg-[#050505]">
      {/* Background Decor */}
      <div className="absolute inset-0 grid-pattern opacity-10" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center gap-16">
        
        {/* Left Side: Info Content */}
        <div className="w-full lg:w-1/2 text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-secondary font-semibold text-sm uppercase tracking-widest mb-4 block">
              Portfolio
            </span>
            <h2 className="font-display text-4xl md:text-5xl lg:text-7xl font-bold mb-10 text-white">
              Success <span className="text-gradient">Stories</span>
            </h2>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 text-xs font-bold tracking-widest uppercase bg-secondary/10 text-secondary rounded-full border border-secondary/20">
                  {projects[index].category}
                </span>
                <div className="flex items-center gap-2 text-primary font-bold text-sm">
                  <TrendingUp size={16} />
                  {projects[index].metrics}
                </div>
              </div>

              <h3 className="text-white font-display text-4xl md:text-5xl font-extrabold tracking-tight">
                {projects[index].title}
              </h3>
              
              <p className="text-muted-foreground text-lg leading-relaxed max-w-md">
                {projects[index].tagline}
              </p>

              {/* Slider Navigation */}
              <div className="flex items-center gap-6 py-8">
                <div className="flex gap-3">
                  <button onClick={prevSlide} className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
                    <ChevronLeft size={20} />
                  </button>
                  <button onClick={nextSlide} className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
                    <ChevronRight size={20} />
                  </button>
                </div>
                <span className="font-mono text-white/20 text-xl tracking-widest">
                  {String(index + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center">
                <motion.a 
                  href={projects[index].link} 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-white font-bold border-b-2 border-secondary pb-1 group transition-all"
                >
                  Launch Project <ArrowUpRight className="text-secondary group-hover:rotate-45 transition-transform" />
                </motion.a>

                <button 
                  onClick={() => setIsGridOpen(true)}
                  className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm font-medium uppercase tracking-widest group"
                >
                  <LayoutGrid size={18} className="text-primary group-hover:rotate-90 transition-transform" />
                  View All Work
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Side: 3D Visual Swipe Card */}
        <div className="w-full lg:w-1/2 perspective-[1500px] flex justify-center py-10 lg:py-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={onDragEnd}
              initial={{ opacity: 0, rotateY: 30, scale: 0.9, x: 50 }}
              animate={{ opacity: 1, rotateY: -15, scale: 1, x: 0 }}
              exit={{ opacity: 0, rotateY: -45, scale: 0.8, x: -50 }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
              whileHover={{ rotateY: -5, scale: 1.05 }}
              style={{
                backgroundImage: `url(${projects[index].image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
              className="relative w-full max-w-[500px] h-[450px] md:h-[600px] rounded-[40px] shadow-[0_50px_100px_rgba(0,0,0,0.8)] border border-white/10 cursor-grab active:cursor-grabbing overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-transparent to-white/5" />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* --- Full Portfolio Grid Modal --- */}
      <AnimatePresence>
        {isGridOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] bg-[#050505] overflow-y-auto px-6 py-20"
          >
            <div className="max-w-7xl mx-auto">
              <div className="flex justify-between items-center mb-16">
                <div>
                  <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-2">
                    Full <span className="text-gradient">Portfolio</span>
                  </h2>
                  <p className="text-muted-foreground">Exploring our complete collection of digital solutions.</p>
                </div>
                <button 
                  onClick={() => setIsGridOpen(false)}
                  className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-secondary transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {projects.map((project, i) => (
                  <motion.a
                    key={i}
                    href={project.link}
                    target="_blank"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="group block"
                  >
                    <div className="relative aspect-[4/3] rounded-3xl overflow-hidden mb-6 border border-white/10">
                      <img 
                        src={project.image} 
                        alt={project.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-6 text-center">
                        <p className="text-white text-sm mb-4 line-clamp-3">{project.tagline}</p>
                        <ArrowUpRight className="text-secondary w-8 h-8" />
                      </div>
                    </div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-white font-bold text-xl mb-1">{project.title}</h4>
                        <p className="text-primary text-xs font-semibold tracking-widest uppercase">{project.category}</p>
                      </div>
                      <span className="text-white/20 font-mono text-sm">#{i + 1}</span>
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default PortfolioSection;