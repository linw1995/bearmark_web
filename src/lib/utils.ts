import { type ClassValue, clsx } from "clsx";
import { BareFetcher } from "swr";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function jsonFetcherMaker<Data>(
  requireAuth: (required: boolean) => void
): BareFetcher<Data> {
  return async (url, init) => {
    const api_key = loadAPIKey() || "";
    const update = { ...init };
    if (api_key) {
      update.headers = {
        ...update.headers,
        Authorization: api_key,
      };
    }
    const res = await fetch(url, update);
    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        removeAPIKey();
        requireAuth(true);
      }
      throw new Error(res.statusText);
    }
    return await res.json();
  };
}

export function fetcherMaker(
  requireAuth: (required: boolean) => void
): typeof global.fetch {
  return async (url, init) => {
    const api_key = loadAPIKey() || "";
    const update = { ...init };
    if (api_key) {
      update.headers = {
        ...update.headers,
        Authorization: api_key,
      };
    }
    const res = await fetch(url, update);
    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        removeAPIKey();
        requireAuth(true);
      }
      throw new Error(res.statusText);
    }
    return res;
  };
}

const API_KEY_NAME = "API_KEY";

export function loadAPIKey() {
  return localStorage.getItem(API_KEY_NAME);
}

export function saveAPIKey(api_key: string) {
  localStorage.setItem(API_KEY_NAME, api_key);
}

export function removeAPIKey() {
  localStorage.removeItem(API_KEY_NAME);
}
