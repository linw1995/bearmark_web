import useSWR, { BareFetcher } from "swr";

export interface UseFolderProps {
  cwd?: string;
}

export interface Folder {
  id: number;
  path: string;
}

export function useFolders(
  props: UseFolderProps,
  fetcher: BareFetcher<Folder[]>
) {
  const qs = new URLSearchParams();
  if (props.cwd) {
    qs.set("cwd", props.cwd);
  }

  let query = "";
  if (qs.size > 0) {
    query = `?${qs.toString()}`;
  }
  return useSWR(`api/folders${query}`, fetcher);
}

export function createFolder(path: string, fetch: typeof global.fetch) {
  return fetch("api/folders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ path }),
  });
}
