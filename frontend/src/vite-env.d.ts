/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FUTURE_CASH_REGISTRY_ADDRESS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
