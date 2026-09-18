import { createClient } from '@insforge/sdk';

const baseUrl = import.meta.env.VITE_INSFORGE_BASE_URL || 'https://q4o0g4sk44ss4gwsc4wocgwc.43.134.7.185.sslip.io';
const anonKey = import.meta.env.VITE_INSFORGE_ANON_KEY || 'anon_c9b6d8b63601e183e418f038c37bb90e390ea4e24480b9eca089b223010e89ea';

export const insforge = createClient({
  baseUrl,
  anonKey,
});

export const getInsforgeClient = () => insforge;
