import { ScrollArea } from "@/components/ui/scroll-area";
import { useBookmarks } from "@/lib/use-bookmark";
import type { Bookmark } from "@/lib/use-bookmark";
import { Card, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, AlertCircle } from "lucide-react";
import { BookmarkEditor } from "@/components/bookmark-editor";
import type { SWRInfiniteResponse } from "swr/infinite";
import { BookmarkDeleteAlertDialog } from "./bookmark-delete-alter-dialog";

function SkeletonBookmark() {
  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center gap-4">
        <CardTitle>
          <Skeleton className="h-[24px] w-[500px]" />
        </CardTitle>

        <div className="flex gap-2">
          <Skeleton className="rounded w-[40px] h-[40px]" />
          <Skeleton className="rounded w-[60px] h-[40px] px-[12px]" />
          <Skeleton className="rounded w-[77px] h-[40px] px-[12px]" />
        </div>
      </CardHeader>
      <CardFooter>
        <div className="flex flex-wrap gap-2">
          <Skeleton className="rounded w-[80px] h-[16px] px-2.5 py-0.5" />
          <Skeleton className="rounded w-[50px] h-[16px] px-2.5 py-0.5" />
          <Skeleton className="rounded w-[60px] h-[16px] px-2.5 py-0.5" />
        </div>
      </CardFooter>
    </Card>
  );
}

function Bookmark({
  data,
  mutate,
}: {
  data: Bookmark;
  mutate: SWRInfiniteResponse<Bookmark[]>["mutate"];
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center gap-4">
        <CardTitle>{data.title}</CardTitle>
        <div className="flex gap-2">
          <Button size="icon" asChild>
            <a href={data.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink />
            </a>
          </Button>
          <BookmarkEditor data={data} mutate={mutate}>
            <Button variant="outline">Edit</Button>
          </BookmarkEditor>
          <BookmarkDeleteAlertDialog id={data.id} mutate={mutate}>
            <Button variant="outline">Delete</Button>
          </BookmarkDeleteAlertDialog>
        </div>
      </CardHeader>

      {data.tags.length > 0 && (
        <CardFooter>
          <div className="flex flex-wrap gap-2">
            {data.tags.map((tag, index) => (
              <Badge key={index} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </CardFooter>
      )}
    </Card>
  );
}

export function BookmarkList() {
  const {
    data: paginatedBookmarks,
    error: isError,
    isLoading,
    size,
    setSize,
    mutate,
  } = useBookmarks({});
  const isEmpty = paginatedBookmarks?.[0]?.length === 0;
  const isReachingEnd =
    isEmpty ||
    (paginatedBookmarks &&
      paginatedBookmarks[paginatedBookmarks.length - 1]?.length === 0);

  return (
    <>
      <ScrollArea>
        <div className="space-y-4 overflow-y-auto max-h-[80vh]">
          {paginatedBookmarks &&
            paginatedBookmarks.map((bookmarks) =>
              bookmarks.map((bookmark) => (
                <Bookmark key={bookmark.id} data={bookmark} mutate={mutate} />
              ))
            )}
          {isError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Run into an error while fetching bookmarks.
              </AlertDescription>
            </Alert>
          )}
          {isLoading ? (
            <>
              <SkeletonBookmark />
              <SkeletonBookmark />
              <SkeletonBookmark />
            </>
          ) : (
            <div className="flex justify-center mt-4">
              <Button
                onClick={() => setSize(size + 1)}
                disabled={isReachingEnd}
              >
                {!isReachingEnd ? "Load More" : "No More"}
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>
    </>
  );
}
