// Keep as relative path for ts-node
import { cache } from "react";
import { auth } from "./auth";

export const getServerCookieSession = cache((cookie: string) => {
  return auth.api.getSession({
    headers: { cookie },
  });
});
