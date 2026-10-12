import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { BookingCta } from "@/components/cta/BookingCta";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
  { name: "Portfolio", href: "/portfolio" },
  { name: "About Us", href: "/about" },
  { name: "Contact", href: "/contact" },
];

/** Active matching: Home exact `/` only; Services includes `/services/:slug`; others exact path. */
function isNavLinkActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  if (href === "/services") {
    return pathname === "/services" || pathname.startsWith("/services/");
  }
  return pathname === href;
}

export const Navbar = () => {
  const { pathname } = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isMobileMenuOpen
          ? "glass-card py-4 bg-background/80 backdrop-blur-md"
          : "py-6 bg-transparent"
      }`}
    >
      <nav className="contents" aria-label="Primary">
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between">
        <motion.div whileHover={{ scale: 1.02 }}>
          <Link to="/" className="flex items-center gap-2 group relative z-[60]">
            <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center bg-muted">
              <img
                src="/Logo.svg"
                alt="TechVerge Solutions logo"
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-display font-bold text-xl text-foreground whitespace-nowrap">
              TechVerge<span className="text-gradient"> Solutions</span>
            </span>
          </Link>
        </motion.div>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const active = isNavLinkActive(pathname, link.href);
            return (
              <motion.div key={link.name} whileHover={{ y: -2 }}>
                <Link
                  to={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "transition-colors relative group",
                    active
                      ? "text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {link.name}
                  <span
                    className={cn(
                      "absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-primary to-secondary transition-all duration-300",
                      active ? "w-full" : "w-0 group-hover:w-full",
                    )}
                  />
                </Link>
              </motion.div>
            );
          })}
          <BookingCta className="px-5 py-2.5 rounded-lg text-primary-foreground font-medium text-sm whitespace-nowrap" />
        </div>

        <motion.button
          type="button"
          className="md:hidden text-foreground p-2 relative z-[60]"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          whileTap={{ scale: 0.95 }}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-primary-nav"
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </motion.button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/60 backdrop-blur-sm z-[40] md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            <motion.div
              id="mobile-primary-nav"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 right-0 z-[50] md:hidden px-4 pt-2 pb-6"
            >
              <div className="glass-card rounded-2xl border border-border/50 shadow-2xl overflow-hidden bg-background/95">
                <div className="p-6 flex flex-col gap-2">
                  {navLinks.map((link, i) => {
                    const active = isNavLinkActive(pathname, link.href);
                    return (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        key={link.name}
                      >
                        <Link
                          to={link.href}
                          aria-current={active ? "page" : undefined}
                          className={cn(
                            "block text-lg py-3 border-b border-border/10 transition-colors",
                            active
                              ? "text-primary font-semibold"
                              : "text-muted-foreground font-medium hover:text-primary",
                          )}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {link.name}
                        </Link>
                      </motion.div>
                    );
                  })}
                  <BookingCta
                    className="w-full py-4 rounded-xl text-primary-foreground font-bold text-center mt-4"
                    onNavigate={() => setIsMobileMenuOpen(false)}
                  />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      </nav>
    </motion.header>
  );
};
