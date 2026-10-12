import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname, hash, search } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Legacy home hash contact links → dedicated contact page
    if (pathname === "/" && hash.startsWith("#contact")) {
      const queryIndex = hash.indexOf("?");
      const intentSearch =
        queryIndex >= 0 ? `?${hash.slice(queryIndex + 1)}` : "";
      navigate(`/contact${intentSearch}`, { replace: true });
      return;
    }

    // Legacy home hash work/solutions → portfolio / services
    if (pathname === "/" && hash === "#work") {
      navigate("/portfolio", { replace: true });
      return;
    }

    if (hash) {
      const id = hash.replace(/^#/, "").split("?")[0];
      const scrollToHash = () => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
          return true;
        }
        return false;
      };

      if (scrollToHash()) return;

      const timeout = window.setTimeout(() => {
        scrollToHash();
      }, 100);

      return () => window.clearTimeout(timeout);
    }

    if (pathname === "/contact" && search.includes("intent=")) {
      const timeout = window.setTimeout(() => {
        document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
      }, 50);
      return () => window.clearTimeout(timeout);
    }

    window.scrollTo(0, 0);
  }, [pathname, hash, search, navigate]);

  return null;
};

export default ScrollToTop;
