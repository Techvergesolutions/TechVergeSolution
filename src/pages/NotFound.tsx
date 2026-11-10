import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Home } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Seo } from "@/components/Seo";
import { pageSeo } from "@/lib/seo";

const NotFound = () => {
  const location = useLocation();
  const seo = pageSeo.notFound;

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <>
      <Seo
        title={seo.title}
        description={seo.description}
        path={location.pathname}
        noindex
      />
      <div className="min-h-screen bg-background overflow-x-hidden flex flex-col">
        <Navbar />
        <main className="flex flex-1 items-center justify-center px-4 py-24">
          <div className="text-center max-w-lg">
            <p className="text-primary font-semibold tracking-widest text-sm uppercase mb-3" aria-hidden="true">
              Error 404
            </p>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Page not found
            </h1>
            <p className="text-muted-foreground text-lg mb-2">
              We could not find a page at{" "}
              <code className="text-sm bg-muted px-2 py-0.5 rounded">{location.pathname}</code>.
            </p>
            <p className="text-muted-foreground mb-8">
              The link may be outdated or the page may have moved. Try one of these instead:
            </p>
            <nav aria-label="Helpful links" className="flex flex-wrap justify-center gap-3">
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 font-semibold text-primary-foreground hover:bg-primary/90"
              >
                <Home className="h-4 w-4" aria-hidden />
                Home
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 font-semibold hover:bg-muted"
              >
                Services
              </Link>
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 font-semibold hover:bg-muted"
              >
                Blog
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 font-semibold hover:bg-muted"
              >
                Contact
              </Link>
            </nav>
            <p className="mt-10">
              <Link to="/" className="text-primary text-sm font-medium inline-flex items-center gap-1 hover:underline">
                <ArrowLeft className="h-4 w-4" aria-hidden />
                Back to homepage
              </Link>
            </p>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default NotFound;
