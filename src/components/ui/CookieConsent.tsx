import { useEffect } from "react";
import { toast } from "sonner";
import { Cookie, ShieldCheck } from "lucide-react";

const CONSENT_KEY = "cookie-consent";

export const CookieConsent = () => {
  const showBanner = () => {
    toast.custom((t) => (
      <div className="p-5 rounded-xl border border-slate-700/80 bg-slate-950/95 backdrop-blur-md max-w-sm shadow-lg">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-slate-800 text-slate-300">
              <Cookie size={18} />
            </div>
            <h4 className="text-slate-100 font-semibold text-sm flex items-center gap-2">
              Cookie Policy <ShieldCheck size={14} className="text-slate-400" />
            </h4>
          </div>

          <p className="text-slate-400 text-xs leading-relaxed">
            We use cookies to enhance your experience and analyze our traffic.
            By clicking &quot;Accept&quot;, you agree to our digital policy.
          </p>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                localStorage.setItem(CONSENT_KEY, "accepted");
                window.dispatchEvent(new Event("cookie-consent-updated"));
                toast.dismiss(t);
              }}
              className="flex-1 px-4 py-2 bg-slate-100 text-slate-900 text-[10px] uppercase tracking-widest font-semibold rounded-md hover:bg-white transition-colors"
            >
              Accept All
            </button>
            <button
              type="button"
              onClick={() => {
                localStorage.setItem(CONSENT_KEY, "declined");
                window.dispatchEvent(new Event("cookie-consent-updated"));
                toast.dismiss(t);
              }}
              className="flex-1 px-4 py-2 border border-slate-700 bg-transparent text-slate-300 text-[10px] uppercase tracking-widest font-semibold rounded-md hover:bg-slate-800/60 hover:text-slate-100 transition-colors"
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
    const consent = localStorage.getItem(CONSENT_KEY);

    // Only auto-show when the user has never chosen (missing / null)
    if (!consent) {
      showBanner();
    }

    // Footer "Cookies" link can reopen settings manually
    const handleManualTrigger = () => {
      toast.dismiss();
      showBanner();
    };

    window.addEventListener("show-cookie-banner", handleManualTrigger);
    return () => window.removeEventListener("show-cookie-banner", handleManualTrigger);
  }, []);

  return null;
};
