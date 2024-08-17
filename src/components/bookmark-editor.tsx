import { updateBookmark, type Bookmark } from "@/lib/use-bookmark";
import { TagsInput } from "@/components/tags-list";
import {
  Dialog,
  DialogTitle,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { fetcherMaker } from "@/lib/utils";
import { RequiredAuthContext } from "@/context";

import { z } from "zod";
import { useForm } from "react-hook-form";
import type { SWRInfiniteResponse } from "swr/infinite";
import { useContext, useState } from "react";

const formSchema = z.object({
  title: z.string(),
  url: z.string().url(),
  tags: z.string().array(),
});

export function BookmarkEditor({
  data,
  mutate,
  children,
}: {
  data: Bookmark;
  mutate: SWRInfiniteResponse<Bookmark[]>["mutate"];
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: data.title,
      url: data.url,
      tags: data.tags,
    },
  });

  const { require } = useContext(RequiredAuthContext);
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const changeset: Partial<Bookmark> = {};
    if (data.title !== values.title) {
      changeset.title = values.title;
    }
    if (data.url !== values.url) {
      changeset.url = values.url;
    }
    if (data.tags != values.tags) {
      changeset.tags = values.tags.map((tag) => tag.trim());
    }
    await updateBookmark(data.id, changeset, fetcherMaker(require));
    await mutate();
    setOpen(false);
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col"
          >
            <DialogHeader>
              <DialogTitle>Edit bookmark</DialogTitle>
              <DialogDescription />
            </DialogHeader>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <TagsInput {...field} />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="sm:justify-end">
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
