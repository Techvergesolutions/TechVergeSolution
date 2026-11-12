import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, Menu, X } from "lucide-react";
import { BookingCta } from "@/components/cta/BookingCta";
import { cn } from "@/lib/utils";
import { SERVICE_MARKETS } from "@/data/locations";

const navLinks: { name: string; href: string; menu?: boolean }[] = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
  { name: "Portfolio", href: "/portfolio" },
  { name: "Blog", href: "/blog" },
  { name: "About", href: "/about" },
  { name: "Locations", href: "/locations", menu: true },
  { name: "Contact", href: "/contact" },
];

/** Active matching: Home exact `/` only; Services/Blog include nested paths; others exact path. */
function isNavLinkActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  if (href === "/services") {
    return pathname === "/services" || pathname.startsWith("/services/");
  }
  if (href === "/blog") {
    return pathname === "/blog" || pathname.startsWith("/blog/");
  }
  return pathname === href;
}

export const Navbar = () => {
  const { pathname } = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [locationsOpen, setLocationsOpen] = useState(false);
  const locationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setLocationsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isMobileMenuOpen && !locationsOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false);
        setLocationsOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isMobileMenuOpen, locationsOpen]);

  useEffect(() => {
    if (!locationsOpen) return;
    const onPointer = (event: MouseEvent) => {
      if (locationsRef.current && !locationsRef.current.contains(event.target as Node)) {
        setLocationsOpen(false);
      }
    };
    window.addEventListener("mousedown", onPointer);
    return () => window.removeEventListener("mousedown", onPointer);
  }, [locationsOpen]);

  const linkClass = (active: boolean) =>
    cn(
      "transition-colors relative group whitespace-nowrap",
      active ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground",
    );

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 min-h-[4.75rem] flex items-center transition-[padding,background-color] duration-300 animate-nav-in",
        isScrolled || isMobileMenuOpen
          ? "glass-card py-4 bg-background/80 backdrop-blur-md"
          : "py-6 bg-transparent",
      )}
    >
      <nav className="contents" aria-label="Primary">
        <div className="w-full max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between gap-6 md:gap-10">
          <Link
            to="/"
            className="flex items-center gap-2.5 group relative z-[60] shrink-0 transition-transform hover:scale-[1.02]"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg overflow-hidden flex items-center justify-center bg-muted shrink-0">
              <img
                src="/Logo.svg"
                alt="TechVerge Solution logo"
                width={40}
                height={40}
                decoding="async"
                fetchPriority="high"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-display font-bold text-base sm:text-xl text-foreground whitespace-nowrap max-[360px]:sr-only">
              TechVerge <span className="text-gradient">Solution</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-3 lg:gap-4 xl:gap-6 min-w-0 text-sm">
            {navLinks.map((link) => {
              const active = isNavLinkActive(pathname, link.href);
              if (link.menu) {
                return (
                  <div
                    key={link.name}
                    ref={locationsRef}
                    className="relative"
                    onMouseEnter={() => setLocationsOpen(true)}
                    onMouseLeave={() => setLocationsOpen(false)}
                  >
                    <Link
                      to={link.href}
                      aria-current={active ? "page" : undefined}
                      aria-expanded={locationsOpen}
                      aria-haspopup="true"
                      className={cn(linkClass(active), "inline-flex items-center gap-1")}
                      onClick={() => setLocationsOpen(false)}
                    >
                      {link.name}
                      <ChevronDown
                        className={cn(
                          "w-3.5 h-3.5 transition-transform",
                          locationsOpen && "rotate-180",
                        )}
                        aria-hidden="true"
                      />
                      <span
                        className={cn(
                          "absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-primary to-secondary transition-all duration-300",
                          active ? "w-full" : "w-0 group-hover:w-full",
                        )}
                      />
                    </Link>
                    {locationsOpen && (
                      <div className="absolute top-full right-0 pt-3 z-50">
                        <div className="w-[min(90vw,46rem)] glass-card rounded-2xl border border-border/50 shadow-2xl bg-background/95 p-5 md:p-6">
                          <div className="grid grid-cols-3 gap-5">
                            {SERVICE_MARKETS.map((market) => (
                              <div key={market.id}>
                                <Link
                                  to={`/locations#${market.id}`}
                                  className="text-xs font-semibold uppercase tracking-wider text-primary hover:underline"
                                  onClick={() => setLocationsOpen(false)}
                                >
                                  {market.shortName}
                                </Link>
                                <ul className="mt-3 space-y-1.5 max-h-64 overflow-y-auto pr-1">
                                  {market.cities.map((city) => (
                                    <li key={city.slug}>
                                      <Link
                                        to={`/locations#${city.slug}`}
                                        className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                                        onClick={() => setLocationsOpen(false)}
                                      >
                                        {city.name}
                                        {city.region ? `, ${city.region}` : ""}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                          <Link
                            to="/locations"
                            className="mt-4 inline-flex text-sm font-medium text-primary hover:underline"
                            onClick={() => setLocationsOpen(false)}
                          >
                            View all cities
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  aria-current={active ? "page" : undefined}
                  className={linkClass(active)}
                >
                  {link.name}
                  <span
                    className={cn(
                      "absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-primary to-secondary transition-all duration-300",
                      active ? "w-full" : "w-0 group-hover:w-full",
                    )}
                  />
                </Link>
              );
            })}
            <BookingCta className="hidden xl:inline-flex px-5 py-2.5 rounded-lg text-primary-foreground font-medium text-sm whitespace-nowrap" />
          </div>

          <button
            type="button"
            className="md:hidden text-foreground p-2 relative z-[60] active:scale-95 transition-transform"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-primary-nav"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <>
            <button
              type="button"
              className="fixed inset-0 bg-background/60 backdrop-blur-sm z-[40] md:hidden border-0 p-0 cursor-default"
              aria-label="Close menu overlay"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            <div
              id="mobile-primary-nav"
              className="absolute top-full left-0 right-0 z-[50] md:hidden px-4 pt-2 pb-6 animate-menu-in"
            >
              <div className="glass-card rounded-2xl border border-border/50 shadow-2xl overflow-hidden bg-background/95">
                <div className="p-6 flex flex-col gap-2">
                  {navLinks.map((link) => {
                    const active = isNavLinkActive(pathname, link.href);
                    return (
                      <div key={link.name}>
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
                        {link.menu && (
                          <div className="pb-2 pl-1 flex flex-wrap gap-x-4 gap-y-1">
                            {SERVICE_MARKETS.map((market) => (
                              <Link
                                key={market.id}
                                to={`/locations#${market.id}`}
                                className="text-sm text-muted-foreground hover:text-primary py-1"
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                {market.shortName}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  <BookingCta
                    className="w-full py-4 rounded-xl text-primary-foreground font-bold text-center mt-4"
                    onNavigate={() => setIsMobileMenuOpen(false)}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </nav>
    </header>
  );
};
