import Cookies from "js-cookie";

export const getToken = () => {
  // Ensure SSR safety
  if (typeof window === "undefined") {
    return null;
  }
  return Cookies.get("auth_token");
};
