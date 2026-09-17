import { createClient } from '@insforge/sdk';

const baseUrl = import.meta.env.VITE_INSFORGE_BASE_URL || 'https://ewg4gkogo44o8g04c4o8g0cw.43.134.7.185.sslip.io';
const anonKey = import.meta.env.VITE_INSFORGE_ANON_KEY || 'anon_2a256987936df23f772e73c028f9e0cfbdd1e097f57f5d5e75ffb8d9eaf01cfa';

export const insforge = createClient({
  baseUrl,
  anonKey,
});

export const getInsforgeClient = () => insforge;
