import { motion } from "framer-motion";
import { Linkedin } from "lucide-react";
import { Link } from "react-router-dom";
import { BookingCta } from "@/components/cta/BookingCta";
import { trackEvent } from "@/lib/analytics";

const serviceLinks = [
  { name: "AI Lead Follow-Up", to: "/ai-automation" },
  { name: "AI Voice Agents", to: "/ai-voice-agents" },
  { name: "Business Automation", to: "/business-automation" },
  { name: "AI SaaS Development", to: "/ai-saas-development" },
];

export const Footer = () => {
  const triggerCookieBanner = (e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(new Event("show-cookie-banner"));
  };

  return (
    <footer className="relative pt-16 pb-8 overflow-hidden border-t border-border/50">
      <div className="absolute inset-0 grid-pattern opacity-10" />

      <div className="section-container relative z-10">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10 mb-12">
          <div className="max-w-md">
            <motion.div whileHover={{ scale: 1.02 }}>
              <Link to="/" className="flex items-center gap-2 mb-5">
                <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center">
                  <img
                    src="/Logo.svg"
                    alt="TechVerge Solutions logo"
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="font-display font-bold text-xl text-foreground">
                  TechVerge<span className="text-gradient"> Solutions</span>
                </span>
              </Link>
            </motion.div>
            <p className="text-muted-foreground mb-2 font-medium text-foreground/90">
              AI Automation & Software Development
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Custom AI-powered workflows, voice agents, and business software for US companies
              that need faster follow-up and cleaner operations.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <a
                href="mailto:info@techvergesolution.com"
                className="text-muted-foreground hover:text-primary transition-colors"
                onClick={() => trackEvent("email_click", { placement: "footer" })}
              >
                info@techvergesolution.com
              </a>
              <a
                href="https://www.linkedin.com/company/techverg-solution/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-8 sm:gap-12">
            <div>
              <p className="font-display font-bold text-foreground mb-4">Services</p>
              <ul className="space-y-3">
                {serviceLinks.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-muted-foreground hover:text-primary transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-display font-bold text-foreground mb-4">Navigate</p>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/#solutions"
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    Solutions
                  </Link>
                </li>
                <li>
                  <Link
                    to="/#work"
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    Work
                  </Link>
                </li>
                <li>
                  <Link
                    to="/#process"
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    Process
                  </Link>
                </li>
                <li>
                  <BookingCta
                    variant="link"
                    className="text-muted-foreground hover:text-primary hover:opacity-100 transition-colors font-normal min-h-0 py-0"
                  />
                </li>
              </ul>
            </div>
            <div>
              <p className="font-display font-bold text-foreground mb-4">Legal</p>
              <ul className="space-y-3">
                <li>
                  <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={triggerCookieBanner}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    Cookies
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            © 2026 TechVerge Solutions. All rights reserved.
          </p>
          <BookingCta variant="link" />
        </div>
      </div>
    </footer>
  );
};
