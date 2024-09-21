import { createContext } from "react";

export const CWDContext = createContext({
  id: 0,
  path: "/",
});

export const RequiredAuthContext = createContext({
  reason: "",
  // @ts-expect-error TS6133
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setAuthRequiredReason: (reason: string) => { },
});
