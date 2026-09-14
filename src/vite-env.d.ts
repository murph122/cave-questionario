/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PUBLIC_SITE_URL?: string
  readonly VITE_LAB_LOCATION?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
