import { motion } from "framer-motion";
import { Github, Twitter, Linkedin, Instagram } from "lucide-react";

const footerLinks = {
  services: [
    { name: "CRM Solutions", href: "#services" },
    { name: "Mobile Apps", href: "#services" },
    { name: "Web Development", href: "#services" },
    { name: "Desktop Apps", href: "#services" },
  ],
  company: [
    { name: "About Us", href: "#" },
    { name: "Portfolio", href: "#portfolio" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "Contact", href: "#contact" },
  ],
  resources: [
    { name: "Blog", href: "#" },
    { name: "Case Studies", href: "#portfolio" },
    { name: "Documentation", href: "#" },
    { name: "Support", href: "#contact" },
  ],
};

const socialLinks = [
  { icon: Linkedin, href: "https://www.linkedin.com/company/techverg-solution/", label: "LinkedIn" },
  { icon: Github, href: "https://github.com/Techvergesolutions", label: "GitHub" },
  { icon: Instagram, href: "https://www.instagram.com/techvergsolutions/", label: "Instagram" },
];

export const Footer = () => {
  return (
    <footer className="relative pt-20 pb-8 overflow-hidden border-t border-border/50">
      {/* Background */}
      <div className="absolute inset-0 grid-pattern opacity-10" />

      <div className="section-container relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <motion.a
              href="#"
              className="flex items-center gap-2 mb-6"
              whileHover={{ scale: 1.02 }}
            >
              {/* Updated Logo Container */}
              <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center">
                <img 
                  src="/Logo.svg" 
                  alt="Techverge Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-display font-bold text-xl text-foreground">
                Techverge<span className="text-gradient"> Solution</span>
              </span>
            </motion.a>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Innovation at Scale. We build unique websites and applications that help
              businesses grow and succeed in the digital world.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 rounded-lg bg-muted hover:bg-primary/10 flex items-center justify-center transition-colors group"
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <social.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display font-bold text-foreground mb-4">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-foreground mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-foreground mb-4">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            © 2024 Techverge Solution. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};