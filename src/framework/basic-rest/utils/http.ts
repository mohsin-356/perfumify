import axios from "axios";
import { getToken } from "./get-token";

const isBrowser = typeof window !== "undefined";
const resolvedBaseURL = (() => {
  const envBase = process.env.NEXT_PUBLIC_REST_API_ENDPOINT;
  if (envBase) {
    if (isBrowser) return envBase;
    // On the server: ensure absolute URL
    if (/^https?:\/\//i.test(envBase)) return envBase;
    const port = process.env.PORT || "3000";
    const host = process.env.HOST || "localhost";
    return `http://${host}:${port}${envBase.startsWith("/") ? envBase : `/${envBase}`}`;
  }
  if (isBrowser) return "/api";
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
