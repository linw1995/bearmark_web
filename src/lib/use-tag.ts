import { BareFetcher } from "swr";
import useSWRInfinite from "swr/infinite";

export interface UseTagsProps {
  q?: string;
}

export interface Tag {
  id: number;
  name: string;
}

export function useTags(props: UseTagsProps, fetcher: BareFetcher<Tag[]>) {
  return useSWRInfinite((pageIndex, previousPageData) => {
    previousPageData = previousPageData || [];

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
    const key = `/api/tags${query}`;
    return key;
  }, fetcher);
}
