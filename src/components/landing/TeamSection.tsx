import { motion } from "framer-motion";
import { AnimatedSection } from "../ui/AnimatedSection";
import { teamMembers } from "@/data/team";

export const TeamSection = () => {
  return (
    <section id="team" className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="section-container relative z-10">
        <AnimatedSection className="text-center mb-14 md:mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-4 block">
            Team
          </span>
          <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold mb-6">
            People Behind The Builds
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            Roles, experience, and ownership across architecture, delivery, design,
            engineering, and QA — the team that ships your automation and software.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {teamMembers.map((member, index) => (
            <AnimatedSection key={member.name} delay={index * 0.08}>
              <motion.div
                whileHover={{ y: -8 }}
                className="glass-card group p-0 rounded-[2rem] border border-white/10 hover:border-primary/50 transition-all duration-500 overflow-hidden h-[420px]"
              >
                <div className="relative h-full w-full">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent z-10" />
                  <img
                    src={member.image}
                    alt={`${member.name}, ${member.role} at TechVerge Solutions`}
                    width={640}
                    height={640}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    srcSet={
                      member.image.endsWith(".webp")
                        ? `${member.image.replace(/\.webp$/, "")}-160w.webp 160w, ${member.image.replace(/\.webp$/, "")}-320w.webp 320w, ${member.image.replace(/\.webp$/, "")}-640w.webp 640w, ${member.image} 800w`
                        : undefined
                    }
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-105"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-7 z-20">
                    <h3 className="font-display text-2xl font-bold text-white mb-1">
                      {member.name}
                    </h3>
                    <p className="text-primary text-sm font-semibold uppercase tracking-wide mb-2">
                      {member.role}
                    </p>
                    <p className="text-white/80 text-sm leading-relaxed">
                      {member.experience}
                    </p>
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
