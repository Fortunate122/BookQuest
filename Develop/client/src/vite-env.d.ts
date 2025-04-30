/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly PROD: boolean; // Add other environment variables here if needed
    readonly VITE_API_URL?: string; // Example for custom variables
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }