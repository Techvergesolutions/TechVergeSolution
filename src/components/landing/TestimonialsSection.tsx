import React, { useCallback } from 'react';
import { motion } from "framer-motion";
import { AnimatedSection } from "../ui/AnimatedSection";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from 'embla-carousel-react';

const testimonials = [
  {
    name: "Sarah Chen",
    role: "CEO, FinFlow Startup",
    location: "Singapore",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop",
    content: "Techverge Solution transformed our vision into reality. Their CRM solution helped us scale from 100 to 10,000 customers in just 8 months. Absolutely phenomenal team!",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    role: "Founder, RetailMax",
    location: "United States",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop",
    content: "As a new business, we needed a partner who understood growth. Techverge Solution delivered an e-commerce platform that exceeded all expectations. Revenue up 400%!",
    rating: 5,
  },
  {
    name: "Emma Müller",
    role: "CTO, LogiTrack GmbH",
    location: "Germany",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop",
    content: "Their technical expertise is unmatched. The desktop application they built for our logistics operations saved us €2M annually. A true technology partner.",
    rating: 5,
  },
  {
    name: "David Okafor",
    role: "Operations Director",
    location: "Nigeria",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop",
    content: "The most professional dev agency we've worked with. Their cloud migration strategy was seamless and zero-downtime.",
    rating: 5,
  },
  {
    name: "Sofia Rossi",
    role: "Creative Lead",
    location: "Italy",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop",
    content: "The UI/UX design Techverge provided for our mobile app is world-class. Our user retention jumped by 60% immediately.",
    rating: 5,
  },
  {
    name: "Liam Wilson",
    role: "Product Manager",
    location: "Australia",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop",
    content: "Fast, reliable, and innovative. They don't just write code; they suggest features that actually help our business grow.",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    role: "Marketing Head",
    location: "India",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop",
    content: "Their custom analytics dashboard gives us insights we never had before. It's beautiful and highly functional.",
    rating: 5,
  },
  {
    name: "Jean Dupont",
    role: "E-commerce Manager",
    location: "France",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop",
    content: "Handling $2M+ in monthly transactions required a robust backend. Techverge built us a fortress.",
    rating: 5,
  },
  {
    name: "Yuki Tanaka",
    role: "Tech Consultant",
    location: "Japan",
    image: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=150&auto=format&fit=crop",
    content: "Incredible attention to detail. Their documentation and code quality are exceptional. Highly recommended.",
    rating: 5,
  },
  {
    name: "Ahmed Al-Sayed",
    role: "CEO, Desert Logistics",
    location: "UAE",
    image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop",
    content: "Techverge is our go-to partner for all things digital. Their support and maintenance are top-tier.",
    rating: 5,
  },
];

export const TestimonialsSection = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true, 
    align: 'start',
    dragFree: false // Set to false for better arrow control
  });

  // Navigation handlers
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <section id="testimonials" className="relative py-32 overflow-hidden bg-muted/30">
      {/* Background Decor */}
      <div className="absolute inset-0 grid-pattern opacity-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-3xl" />

      <div className="section-container relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <AnimatedSection className="text-left md:max-w-2xl">
            <span className="text-secondary font-semibold text-sm uppercase tracking-wider mb-4 block">
              Testimonials
            </span>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Trusted <span className="text-gradient">Worldwide</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              From startups to enterprises across the globe, our clients share their success stories.
            </p>
          </AnimatedSection>

          {/* Navigation Arrows */}
          <AnimatedSection className="flex gap-4">
            <button
              onClick={scrollPrev}
              className="w-12 h-12 rounded-full border border-primary/20 bg-background/50 backdrop-blur-sm flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-300 shadow-lg group"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-6 h-6 group-active:scale-90 transition-transform" />
            </button>
            <button
              onClick={scrollNext}
              className="w-12 h-12 rounded-full border border-primary/20 bg-background/50 backdrop-blur-sm flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-300 shadow-lg group"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-6 h-6 group-active:scale-90 transition-transform" />
            </button>
          </AnimatedSection>
        </div>

        {/* Slider Viewport */}
        <div className="overflow-hidden px-2" ref={emblaRef}>
          <div className="flex gap-6">
            {testimonials.map((testimonial, index) => (
              <div 
                key={testimonial.name} 
                className="flex-[0_0_100%] md:flex-[0_0_calc(50%-12px)] lg:flex-[0_0_calc(33.33%-16px)] min-w-0"
              >
                <motion.div
                  className="glass-card p-8 rounded-2xl h-full relative group border border-white/5"
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="absolute top-6 right-6 opacity-5 group-hover:opacity-15 transition-opacity pointer-events-none">
                    <Quote className="w-16 h-16 text-primary" />
                  </div>

                  <div className="flex gap-1 mb-6">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>

                  <p className="text-foreground/80 mb-8 leading-relaxed text-lg italic">
                    "{testimonial.content}"
                  </p>

                  <div className="flex items-center gap-4 mt-auto">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/20"
                    />
                    <div>
                      <h4 className="font-display font-bold text-foreground text-sm">
                        {testimonial.name}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {testimonial.role}
                      </p>
                      <p className="text-[10px] text-primary font-medium tracking-wider uppercase">
                        {testimonial.location}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Badges */}
        <AnimatedSection delay={0.5} className="mt-24 border-t border-white/5 pt-12">
          <div className="flex flex-wrap items-center justify-center gap-12 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
            {["Forbes", "TechCrunch", "Wired", "Bloomberg", "The Verge"].map((brand) => (
              <span key={brand} className="font-display text-xl font-bold tracking-tighter text-muted-foreground uppercase">
                {brand}
              </span>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};