import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { AnimatedSection } from "../ui/AnimatedSection";
import { 
  Globe, 
  Smartphone, 
  Database, 
  Layers, 
  Bot, 
  Cloud 
} from "lucide-react";

const services = [
  {
    icon: Database,
    title: "CRM & SaaS Solutions",
    description:
      "Custom CRM platforms and SaaS products that streamline operations—from lead management and analytics dashboards to multi-tenant apps that scale with your business.",
    features: ["Custom Workflows", "Analytics Dashboards", "API Integrations", "Multi-Tenant SaaS"],
  },
  {
    icon: Smartphone,
    title: "Mobile App Development",
    description:
      "Native and cross-platform mobile apps for iOS and Android—React Native, Flutter, and production-ready experiences that feel fast and polished.",
    features: ["iOS & Android", "React Native", "Flutter", "App Store Launch"],
  },
  {
    icon: Globe,
    title: "Web Design & Development",
    description:
      "UI/UX design, branding, and graphic design paired with responsive websites—React, Next.js, Node.js, and WordPress/CMS builds that convert and perform.",
    features: ["UI/UX & Branding", "React & Next.js", "WordPress / CMS", "SEO-Ready Sites"],
  },
  {
    icon: Bot,
    title: "AI Automation & Chatbots",
    description:
      "AI chatbots, LLM integrations, and workflow automation that cut manual work—from customer support assistants to business process automation.",
    features: ["AI Chatbots", "LLM Integrations", "Workflow Automation", "Business Automation"],
  },
  {
    icon: Layers,
    title: "Custom & Enterprise Software",
    description:
      "Bespoke full-stack systems, enterprise apps, APIs, and microservices—built for your industry requirements, security needs, and growth plans.",
    features: ["Full Stack", "APIs & Microservices", "Enterprise Apps", "Cloud Native"],
  },
  {
    icon: Cloud,
    title: "Cloud, DevOps & Deployment",
    description:
      "Cloud architecture, CI/CD pipelines, and production deployment—so new and established stacks ship reliably from design through live operations.",
    features: ["Cloud Architecture", "CI/CD Pipelines", "Production Deploy", "Digital Transformation"],
  },
];

const ServiceCard = ({ service, index }: { service: typeof services[0], index: number }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

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
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            From UI/UX and branding through web, mobile, CRM, SaaS, custom enterprise software,
            cloud DevOps, and AI automation—we take products from design to production for startups
            and established businesses worldwide.
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
