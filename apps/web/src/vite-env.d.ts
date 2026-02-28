/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_PROXY_TARGET: string;
  readonly VITE_OTP_EXPIRY_SECONDS?: string;
  readonly VITE_API_TIMEOUT_MS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
