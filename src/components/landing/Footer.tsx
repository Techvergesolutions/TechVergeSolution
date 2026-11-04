import { motion } from "framer-motion";
import { Facebook, Github, Instagram, Linkedin, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { BookingCta } from "@/components/cta/BookingCta";
import { trackEvent } from "@/lib/analytics";
import { useServices } from "@/hooks/useServices";
import { useMarketPages } from "@/hooks/useMarketPages";
import { useContactSettings } from "@/hooks/useContactSettings";

const socialLinks = [
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/company/techverg-solution/",
    Icon: Linkedin,
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/techvergsolutions/",
    Icon: Instagram,
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61579426794497",
    Icon: Facebook,
  },
  {
    name: "GitHub",
    href: "https://github.com/solutiontechverge-hub",
    Icon: Github,
  },
];

export const Footer = () => {
  const { data: services = [] } = useServices();
  const { data: markets = [] } = useMarketPages();
  const { data: contact } = useContactSettings();
  const whatsapp = contact?.whatsapp?.trim() || "";
  const whatsappLink = /^\+?[1-9]\d{6,14}$/.test(whatsapp) ? `https://wa.me/${whatsapp.replace(/^\+/, "")}` : null;
  const links = whatsappLink ? [...socialLinks, { name: "WhatsApp", href: whatsappLink, Icon: MessageCircle }] : socialLinks;
  const email = contact?.email?.trim() || "info@techvergesolution.com";
  const seenServiceSlugs = new Set<string>();
  const uniqueServices = services.filter((service) => {
    const slug = service.slug?.trim();
    if (!slug || seenServiceSlugs.has(slug)) return false;
    seenServiceSlugs.add(slug);
    return true;
  });
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
                    loading="lazy"
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
                href={`mailto:${email}`}
                className="text-muted-foreground hover:text-primary transition-colors"
                onClick={() => trackEvent("email_click", { placement: "footer" })}
              >
                {email}
              </a>
              {links.map(({ name, href, Icon }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                  aria-label={name}
                  onClick={name === "WhatsApp" ? () => trackEvent("whatsapp_click", { placement: "footer" }) : undefined}
                >
                  <Icon className="w-4 h-4" />
                  {name}
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-8 sm:gap-12">
            <div>
              <p className="font-display font-bold text-foreground mb-4">Services</p>
              <ul className="space-y-3">
                {uniqueServices.map((service) => (
                  <li key={service._id}>
                    <Link
                      to={`/services/${service.slug}`}
                      className="text-muted-foreground hover:text-primary transition-colors text-sm"
                    >
                      {service.title?.trim() || service.slug}
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
                    to="/"
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/services"
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    Services
                  </Link>
                </li>
                <li>
                  <Link
                    to="/portfolio"
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    Portfolio
                  </Link>
                </li>
                <li>
                  <Link
                    to="/blog"
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    Contact
                  </Link>
                </li>
                {markets.filter((market, index) => market.slug && market.title && markets.findIndex((other) => other.slug === market.slug) === index).map((market) => <li key={market._id}>
                  <Link to={`/markets/${encodeURIComponent(market.slug!)}`} className="text-muted-foreground hover:text-primary transition-colors text-sm">{market.title}</Link>
                </li>)}
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
                  <Link
                    to="/privacy-policy"
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms-of-service"
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={triggerCookieBanner}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
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
