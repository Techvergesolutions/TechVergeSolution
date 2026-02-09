import { useEffect } from "react";
import { toast } from "sonner";
import { Cookie, ShieldCheck } from "lucide-react";

export const CookieConsent = () => {
  const showBanner = () => {
    toast.custom((t) => (
      <div className="glass-card p-6 rounded-2xl border border-white/10 bg-[#0A0A0A]/95 backdrop-blur-xl max-w-sm shadow-2xl">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-lg text-primary">
              <Cookie size={20} />
            </div>
            <h4 className="text-white font-bold flex items-center gap-2">
              Cookie Policy <ShieldCheck size={14} className="text-secondary" />
            </h4>
          </div>
          
          <p className="text-muted-foreground text-xs leading-relaxed">
            We use cookies to enhance your experience and analyze our traffic. 
            By clicking "Accept", you agree to our digital policy.
          </p>
          
          <div className="flex gap-2">
            <button
              onClick={() => {
                localStorage.setItem("cookie-consent", "accepted");
                toast.dismiss(t);
              }}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground text-[10px] uppercase tracking-widest font-bold rounded-md hover:opacity-90 transition-all"
            >
              Accept All
            </button>
            <button
              onClick={() => {
                localStorage.setItem("cookie-consent", "declined");
                toast.dismiss(t);
              }}
              className="flex-1 px-4 py-2 bg-white/5 text-white text-[10px] uppercase tracking-widest font-bold rounded-md hover:bg-white/10 transition-colors"
            >
              Decline
            </button>
          </div>
        </div>
      </div>
    ), {
      duration: Infinity,
      position: "bottom-right",
    });
  };

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    
    // Immediate check: If no consent or previously declined, show right away
    if (!consent || consent === "declined") {
      showBanner();
    }

    // Listener for manual footer trigger
    const handleManualTrigger = () => {
      toast.dismiss();
      showBanner();
    };

    window.addEventListener("show-cookie-banner", handleManualTrigger);
    return () => window.removeEventListener("show-cookie-banner", handleManualTrigger);
  }, []);

  return null;
};