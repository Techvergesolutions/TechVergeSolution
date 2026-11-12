import { Facebook, Github, Instagram, Linkedin, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { BookingCta } from "@/components/cta/BookingCta";
import { trackEvent } from "@/lib/analytics";
import { useServices } from "@/hooks/useServices";
import { useMarketPages } from "@/hooks/useMarketPages";
import { useContactSettings } from "@/hooks/useContactSettings";
import { siteUrl } from "@/lib/seo/config";
import {
  FOOTER_SOCIAL_LINKS,
  ORG_ADDRESS_DISPLAY,
  ORG_SECONDARY_ADDRESS_DISPLAY,
  ORG_EMAIL,
  ORG_NAME,
  ORG_SITE_HOST,
  ORG_PHONE_LINES,
} from "@/data/organizationProfiles";
import { AFFILIATION_DISCLAIMER } from "@/data/team";

const socialIcons = {
  linkedin: Linkedin,
  instagram: Instagram,
  facebook: Facebook,
  github: Github,
  trustpilot: Linkedin,
  whatsapp: MessageCircle,
} as const;

const socialLinks = [
  ...FOOTER_SOCIAL_LINKS.map((link) => ({
    name: link.name,
    href: link.href,
    Icon: socialIcons[link.key] ?? Linkedin,
  })),
];

export const Footer = () => {
  const { data: services = [] } = useServices();
  const { data: markets = [] } = useMarketPages();
  const { data: contact } = useContactSettings();
  const whatsapp = contact?.whatsapp?.trim() || "";
  const whatsappLink = /^\+?[1-9]\d{6,14}$/.test(whatsapp) ? `https://wa.me/${whatsapp.replace(/^\+/, "")}` : null;
  const links = whatsappLink ? [...socialLinks, { name: "WhatsApp", href: whatsappLink, Icon: MessageCircle }] : socialLinks;
  const email = contact?.email?.trim() || ORG_EMAIL;
  const serviceLinks = services.filter((service, index) => service.slug?.trim() && services.findIndex((other) => other.slug === service.slug) === index).map((service) => ({ name: service.title?.trim() || service.slug!, to: `/services/${service.slug}` }));
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
            <Link
              to="/"
              className="flex items-center gap-2 mb-5 w-fit transition-transform hover:scale-[1.02]"
            >
              <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center">
                <img
                  src="/Logo.svg"
                  alt="TechVerge Solution logo"
                  width={40}
                  height={40}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-display font-bold text-xl text-foreground">
                TechVerge <span className="text-gradient">Solution</span>
              </span>
            </Link>
            <p className="text-muted-foreground mb-2 font-medium text-foreground/90">
              AI Automation & Software Development
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed mb-5">
              Custom AI-powered workflows, voice agents, and business software for
              companies that need faster follow-up and cleaner operations.
            </p>

            <address className="not-italic text-sm text-muted-foreground space-y-1.5 mb-5">
              <p className="font-medium text-foreground/90">{ORG_NAME}</p>
              <p>
                <a
                  href={siteUrl}
                  className="hover:text-primary transition-colors"
                >
                  {ORG_SITE_HOST}
                </a>
              </p>
              <p>
                <span className="text-foreground/80">Head office: </span>
                {ORG_ADDRESS_DISPLAY}
              </p>
              <p>
                <span className="text-foreground/80">Secondary office: </span>
                {ORG_SECONDARY_ADDRESS_DISPLAY}
              </p>
              <p>
                <a
                  href={`mailto:${email}`}
                  className="hover:text-primary transition-colors"
                  onClick={() => trackEvent("email_click", { placement: "footer" })}
                >
                  {email}
                </a>
              </p>
              {ORG_PHONE_LINES.map((line) => (
                <p key={line.tel}>
                  <a
                    href={`tel:${line.tel}`}
                    className="hover:text-primary transition-colors"
                    onClick={() => trackEvent("phone_click", { placement: "footer" })}
                  >
                    {line.display}
                  </a>
                </p>
              ))}
            </address>

            <div className="flex flex-wrap items-center gap-4 text-sm mb-5">
              {links.map(({ name, href, Icon }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                  aria-label={name}
                  onClick={() => {
                    if (name === "WhatsApp") {
                      trackEvent("whatsapp_click", { placement: "footer" });
                    }
                  }}
                >
                  <Icon className="w-4 h-4" />
                  {name}
                </a>
              ))}
            </div>

            <p className="text-xs text-muted-foreground/90 leading-relaxed">
              {AFFILIATION_DISCLAIMER}
            </p>
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
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    to="/locations"
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    Locations
                  </Link>
                </li>
                <li>
                  <Link
                    to="/ai-facts"
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    AI Facts
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
            © 2026 {ORG_NAME}. All rights reserved.
          </p>
          <BookingCta variant="link" />
        </div>
      </div>
    </footer>
  );
};
