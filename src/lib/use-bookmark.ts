import useSWRInfinite from "swr/infinite";
import { fetcher } from "./utils";

export interface UseBookmarksProps {
  q?: string;
  limit?: number;
}

export interface Bookmark {
  id: number;
  title: string;
  url: string;
  tags: Array<string>;
}

export function useBookmarks(props: UseBookmarksProps) {
  const limit = props.limit || 10;

  return useSWRInfinite<Bookmark[]>(
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
  modify: Partial<Omit<Bookmark, "id">>
) {
  return fetch(`/api/bookmarks/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(modify),
  });
}

export function deleteBookmark(id: number) {
  return fetch(`/api/bookmarks/${id}`, {
    method: "DELETE",
  });
}
