import axios, { AxiosHeaders } from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

async function getClerkToken() {
  const clerk = (window as any).Clerk;
  if (clerk?.session) {
    return clerk.session.getToken();
  }
  return null;
}

api.interceptors.request.use(async (config) => {
  const token = await getClerkToken();
  if (token) {
    const headers = config.headers;
    if (headers && typeof (headers as AxiosHeaders).set === 'function') {
      (headers as AxiosHeaders).set('Authorization', `Bearer ${token}`);
    } else {
      config.headers = {
        ...(headers ?? {}),
        Authorization: `Bearer ${token}`,
      };
    }
  }
  return config;
});

export default api;
