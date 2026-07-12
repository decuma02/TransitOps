import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL || '';

export function apiFileUrl(path: string): string {
  return `${API_URL}${path}`;
}

axios.defaults.baseURL = API_URL;
