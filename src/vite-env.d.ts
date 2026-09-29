/// <reference types="vite/client" />

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_SOCKET_URL: string;
}

// Microsoft Clarity client API (window.clarity).
interface Window {
  clarity?: (action: string, ...args: unknown[]) => void;
}
