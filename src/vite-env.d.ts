/// <reference types="vite/client" />


interface ImportMetaEnv {
  readonly VITE_RESET_PRODUCT_LOCATION_TIMEOUT_MS: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}