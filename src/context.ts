import { createContext } from "react";

export const CWDContext = createContext("/");
export const RequiredAuthContext = createContext({
  required: false,
  // @ts-expect-error TS6133
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  require: (required: boolean) => {},
});
