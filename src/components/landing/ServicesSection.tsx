import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { AnimatedSection } from "../ui/AnimatedSection";
import { 
  Globe, 
  Smartphone, 
  Database, 
  Layers, 
  Monitor, 
  Zap 
} from "lucide-react";

const services = [
  {
    icon: Database,
    title: "CRM & SaaS Solutions",
    description: "Custom CRM platforms and SaaS applications that streamline your business operations and scale with your growth.",
    features: ["Custom Workflows", "Analytics Dashboard", "API Integrations"],
  },
  // ... other services remain the same
  {
    icon: Smartphone,
    title: "Mobile Development",
    description: "Native and cross-platform mobile apps for iOS and Android that deliver exceptional user experiences.",
    features: ["iOS & Android", "React Native", "Flutter Apps"],
  },
  {
    icon: Globe,
    title: "Web Design & Development",
    description: "Stunning, responsive websites that convert visitors into customers and establish your digital presence.",
    features: ["Custom Design", "SEO Optimized", "Fast Performance"],
  },
  {
    icon: Monitor,
    title: "Desktop Applications",
    description: "Powerful desktop solutions for Mac and Windows that enhance productivity and streamline workflows.",
    features: ["Mac & Windows", "Cross-Platform", "Electron Apps"],
  },
  {
    icon: Layers,
    title: "Custom Applications",
    description: "Bespoke software solutions tailored to your unique business needs and industry requirements.",
    features: ["Full Stack", "Microservices", "Cloud Native"],
  },
  {
    icon: Zap,
    title: "Enterprise Solutions",
    description: "Scalable enterprise systems that transform how your organization operates and competes.",
    features: ["Scalability", "Security First", "24/7 Support"],
  },
];

// Tilt Card Component for the 3D effect
const ServiceCard = ({ service, index }: { service: typeof services[0], index: number }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  // Rotate values: adjust these numbers to increase/decrease tilt intensity
  const rotateX = useTransform(mouseYSpring, [-0.3, 0.3], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.3, 0.3], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleClick = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <AnimatedSection
      delay={index * 0.1}
      className="group"
    >
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        whileHover={{ scale: 1.02 }}
        className="glass-card p-8 rounded-2xl h-full hover-glow cursor-pointer relative overflow-hidden transition-shadow duration-300"
      >
        {/* Hover gradient overlay */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10" />
        </div>

        <div className="relative z-10" style={{ transform: "translateZ(50px)" }}>
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
            <service.icon className="w-7 h-7 text-primary" />
          </div>

          <h3 className="font-display text-xl font-bold mb-3 text-foreground group-hover:text-gradient transition-all">
            {service.title}
          </h3>

          <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
            {service.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {service.features.map((feature) => (
              <span
                key={feature}
                className="px-3 py-1 text-xs rounded-full bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatedSection>
  );
};

export const ServicesSection = () => {
  return (
    <section id="services" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-3xl" />

      <div className="section-container relative z-10">
        <AnimatedSection className="text-center mb-20">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-4 block">
            Our Services
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Solutions That <span className="text-gradient">Scale</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From startups to enterprises, we deliver technology solutions that drive growth
            and transform businesses across the globe.
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" style={{ perspective: "1000px" }}>
          {services.map((service, index) => (
            <ServiceCard key={service.title} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};