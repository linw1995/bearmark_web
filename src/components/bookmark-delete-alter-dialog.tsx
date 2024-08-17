import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { RequiredAuthContext } from "@/context";
import { deleteBookmark } from "@/lib/use-bookmark";
import type { Bookmark } from "@/lib/use-bookmark";
import { fetcherMaker } from "@/lib/utils";

import { useContext } from "react";
import type { SWRInfiniteResponse } from "swr/infinite";

export function BookmarkDeleteAlertDialog({
  id,
  mutate,
  children,
}: {
  id: number;
  mutate: SWRInfiniteResponse<Bookmark[]>["mutate"];
  children: React.ReactNode;
}) {
  const { require } = useContext(RequiredAuthContext);
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            bookmark and remove its data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              await deleteBookmark(id, fetcherMaker(require));
              mutate();
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
