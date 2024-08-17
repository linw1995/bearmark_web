import { BareFetcher } from "swr";
import useSWRInfinite from "swr/infinite";

export interface UseBookmarksProps {
  q?: string;
  limit?: number;
  cwd?: string;
}

export interface Bookmark {
  id: number;
  title: string;
  url: string;
  tags: Array<string>;
}

export function useBookmarks(
  props: UseBookmarksProps,
  fetcher: BareFetcher<Bookmark[]>
) {
  const limit = props.limit || 10;

  return useSWRInfinite(
    (pageIndex, previousPageData) => {
      previousPageData = previousPageData || [];

      if (
        pageIndex > 0 &&
        (!previousPageData || previousPageData.length < limit)
      )
        return null;

      const qs = new URLSearchParams();
      qs.set("limit", limit.toString());
      if (props.q) {
        qs.set("q", props.q);
      }
      if (props.cwd) {
        qs.set("cwd", props.cwd);
      }
      if (pageIndex !== 0) {
        const cursor = previousPageData[previousPageData.length - 1];
        qs.set("before", cursor.id.toString());
      }

      let query = "";
      if (qs.size > 0) {
        query = `?${qs.toString()}`;
      }
      const key = `/api/bookmarks${query}`;
      return key;
    },
    fetcher,
    {
      initialSize: 1,
    }
  );
}

export function updateBookmark(
  id: number,
  modify: Partial<Omit<Bookmark, "id">>,
  fetch: typeof global.fetch
) {
  return fetch(`/api/bookmarks/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(modify),
  });
}

export function deleteBookmark(id: number, fetch: typeof global.fetch) {
  return fetch(`/api/bookmarks/${id}`, {
    method: "DELETE",
  });
}
