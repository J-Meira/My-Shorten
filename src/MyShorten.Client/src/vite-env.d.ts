/// <reference types="vite/client" />
interface ImportMetaEnv {
  VITE_API_URL: string;
  VITE_STORAGE_KEY: string;
  VITE_URL: string;
  VITE_DELAY: string;
}

interface ImportMeta {
  env: ImportMetaEnv;
}
