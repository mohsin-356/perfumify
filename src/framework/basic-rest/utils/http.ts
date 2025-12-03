import axios from "axios";
import { getToken } from "./get-token";

const isBrowser = typeof window !== "undefined";
const resolvedBaseURL = (() => {
  const envBase = process.env.NEXT_PUBLIC_REST_API_ENDPOINT;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || process.env.VERCEL_URL || process.env.URL;

  if (envBase) {
    if (isBrowser) return envBase;
    if (/^https?:\/\//i.test(envBase)) {
      // If absolute but points to localhost on the server, rewrite to site origin when available
      try {
        const u = new URL(envBase);
        const isLocal = ["localhost", "127.0.0.1", "::1"].includes(u.hostname);
        if (isLocal && siteUrl) {
          const origin = /^https?:\/\//i.test(siteUrl) ? siteUrl : `https://${siteUrl}`;
          return `${origin}${u.pathname}${u.search}`;
        }
      } catch {}
      return envBase; // absolute provided and not localhost
    }
    // if a site origin is available, build absolute from it
    if (siteUrl) {
      const origin = /^https?:\/\//i.test(siteUrl) ? siteUrl : `https://${siteUrl}`;
      return `${origin}${envBase.startsWith("/") ? envBase : `/${envBase}`}`;
    }
    const port = process.env.PORT || "3000";
    const host = process.env.HOST || "localhost";
    return `http://${host}:${port}${envBase.startsWith("/") ? envBase : `/${envBase}`}`;
  }

  if (isBrowser) return "/api";
  if (siteUrl) {
    const origin = /^https?:\/\//i.test(siteUrl) ? siteUrl : `https://${siteUrl}`;
    return `${origin}/api`;
  }
  const port = process.env.PORT || "3000";
  const host = process.env.HOST || "localhost";
  return `http://${host}:${port}/api`;
})();

const http = axios.create({
  baseURL: resolvedBaseURL,
  timeout: 30000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Change request data/error here
http.interceptors.request.use(
  (config) => {
    const token = getToken();
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token ? token : ""}`,
    };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default http;
