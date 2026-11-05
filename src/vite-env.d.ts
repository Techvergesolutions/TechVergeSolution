/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GTM_ID?: string;
  readonly NEXT_PUBLIC_GA_ID: string;
  readonly IS_PRODUCTION_DEPLOY: string;
  readonly VITE_GA_MEASUREMENT_ID?: string;
  readonly VITE_BOOKING_URL?: string;
  readonly VITE_CALENDLY_URL?: string;
  readonly VITE_SANITY_PROJECT_ID?: string;
  readonly VITE_SANITY_DATASET?: string;
  readonly VITE_SANITY_API_VERSION?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
}
