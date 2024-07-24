import useSWRInfinite from "swr/infinite";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

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
  return useSWRInfinite<Bookmark[]>(
    (pageIndex, previousPageData) => {
      // 已经到最后一页
      if (pageIndex > 0 && !previousPageData) return null;

      const qs = new URLSearchParams();
      Object.entries(props).forEach(([key, value]) => {
        if (value) {
          qs.append(key, value.toString());
        }
      });
      if (pageIndex !== 0) {
        const cursor = previousPageData[previousPageData.length - 1];
        qs.set("before", cursor.id.toString());
      }

      let query = "";
      if (qs.size > 0) {
        query = `?${qs.toString()}`;
      }
      // 将游标添加到 API
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
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(modify),
  });
}
