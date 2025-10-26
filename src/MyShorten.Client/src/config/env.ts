const { DEV, VITE_DELAY, VITE_STORAGE_KEY, VITE_API_URL, VITE_URL } =
  import.meta.env;

export const env = {
  apiURL: DEV ? VITE_API_URL : '/api',
  delay: VITE_DELAY === 'true',
  isDev: DEV,
  url: window.__ENV__?.url ?? VITE_URL,
  storageKey: VITE_STORAGE_KEY,
};
