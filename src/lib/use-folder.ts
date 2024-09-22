import useSWR, { BareFetcher } from "swr";

export interface UseFolderProps {
  cwd?: string;
}

export interface Folder {
  id: number;
  path: string;
}

export const RootFolder: Folder = {
  id: 0,
  path: "/",
};

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

export function moveInFolder(
  id: number,
  folder_id: number,
  fetch: typeof global.fetch,
) {
  return fetch(`api/folders/move_in/${id}/${folder_id}`, {
    method: "PUT",
  });
}

export function moveOutFolder(
  id: number,
  fetch: typeof global.fetch,
) {
  return fetch(`api/folders/move_out/${id}`, {
    method: "PUT",
  });
}
