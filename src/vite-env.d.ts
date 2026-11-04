/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GTM_ID?: string;
  readonly NEXT_PUBLIC_GA_ID: string;
  readonly IS_PRODUCTION_DEPLOY: string;
  readonly VITE_BOOKING_URL?: string;
  readonly VITE_CALENDLY_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
