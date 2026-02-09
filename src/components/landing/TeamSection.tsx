import { motion } from "framer-motion";
import { AnimatedSection } from "../ui/AnimatedSection";

// --- EDIT TEAM DETAILS HERE ---
const team = [
  {
    name: "Umer Arshad",
    role: "Founder & CEO",
    image: "/Umer.png",
  },
  {
    name: "Rana Hamza",
    role: "Co-Founder & Lead Software Architect",
    image: "/Hamza.png",
  },
  {
    name: "Faseeh Tahir",
    role: "Chief Project Manager",
    image: "/Faseeh.jpeg",
  },
  {
    name: "Aliza Fayyaz",
    role: "UI/UX Designer",
    image: "/Aliza.jpg",
  },
  {
    name: "Mujtaba Ahmad",
    role: "Full Stack Developer",
    image: "/Mujtaba.png",
  },
  {
    name: "Uzair Ahmad",
    role: "Quality Assurance Engineer",
    image: "/Uzair.png",
  }
];

export const TeamSection = () => {
  return (
    <section id="team" className="relative py-32 overflow-hidden">
      {/* Background blobs for visual depth */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="section-container relative z-10">
        <AnimatedSection className="text-center mb-20">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-4 block">
            Our Professionals
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            The Creative <span className="text-gradient">Powerhouse</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A diverse team of experts committed to delivering excellence and 
            pushing the boundaries of technology.
          </p>
        </AnimatedSection>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {team.map((member, index) => (
            <AnimatedSection key={member.name} delay={index * 0.1}>
              <motion.div
                whileHover={{ y: -12 }}
                className="glass-card group p-0 rounded-[2.5rem] border border-white/10 hover:border-primary/50 transition-all duration-500 overflow-hidden h-[450px]"
              >
                {/* Full Size Profile Image */}
                <div className="relative h-full w-full">
                  {/* Subtle Gradient Overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                  
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-110"
                  />

                  {/* Content Overlaid on Image */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                    <h3 className="font-display text-2xl font-bold text-white mb-1 group-hover:tracking-wide transition-all duration-300">
                      {member.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <p className="text-primary text-sm font-semibold uppercase tracking-tighter">
                        {member.role}
                      </p>
                      <div className="h-px flex-1 bg-gradient-to-r from-primary/50 to-transparent ml-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};