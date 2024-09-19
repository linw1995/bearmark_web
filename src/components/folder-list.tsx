import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Folder, useFolders, createFolder } from "@/lib/use-folder";
import { RequiredAuthContext } from "@/context";
import { Dialog, DialogTitle, DialogDescription, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { fetcherMaker, jsonFetcherMaker } from "@/lib/utils";

import {
  FolderIcon,
  FolderOpenIcon,
  FileQuestionIcon,
  FileSearchIcon,
  ArrowLeftIcon,
  ArrowLeftRightIcon,
  PlusIcon,
} from "lucide-react";
import { useState, useContext, Fragment } from "react";

function parentPath(path: string): string {
  return path.split("/").slice(0, -1).join("/");
}

function folderName(path: string): string {
  return path.split("/").pop() || "";
}

function isSelected(
  folder: Folder | undefined,
  selectedFolder: Folder | null | undefined
): boolean {
  return (
    (folder === undefined && selectedFolder === undefined) ||
    (folder !== undefined && selectedFolder?.path === folder?.path)
  );
}

function className(
  folder: Folder | undefined,
  selectedFolder: Folder | null | undefined
): string {
  return `flex snap-start items-center px-4 h-[48px] last:mb-[calc(100%-48px)] cursor-pointer transition-colors ${isSelected(folder, selectedFolder)
    ? "bg-primary text-primary-foreground"
    : "hover:bg-muted"
    }`;
}

export enum FolderListMode {
  SelectFolder,
  FilterBookmarks,
}

export function FolderList({
  cwd,
  cd,
  select,
  mode = FolderListMode.FilterBookmarks,
}: {
  cwd: string;
  select: (path: string) => void;
  cd: (path: string) => void;
  mode?: FolderListMode;
}) {
  const { setAuthRequiredReason } = useContext(RequiredAuthContext);
  const { data, mutate } = useFolders(
    { cwd },
    jsonFetcherMaker(setAuthRequiredReason)
  );
  const [selected, setSelected] = useState<Folder | null | undefined>(null);
  const [input, setInput] = useState<string>("");
  const filtered = (data || []).filter((value) =>
    folderName(value.path).match(input)
  );

  const selectFolder = (folder: Folder | undefined) => {
    if (folder === selected) {
      setSelected(null);
      select(cwd);
      return;
    }
    setSelected(folder);
    if (folder) {
      select(folder.path);
    } else {
      // not in folder
      if (cwd == "/") {
        select("//");
      } else {
        select(cwd + "//");
      }
    }
  };
  const onSubmit = async () => {
    if (input.length === 0) {
      return;
    }
    await createFolder(cwd + "/" + input, fetcherMaker(setAuthRequiredReason));
    await mutate();
    setInput("");
  };
  return (
    <div className="w-full h-full flex flex-col select-none">
      <div className="flex-none mb-4">
        <div className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Search or create a new folder"
            className="w-full"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button
            variant="ghost"
            size="icon"
            className="ml-3 rounded-full hover:bg-muted"
            onClick={() => {
              cd(parentPath(cwd));
              setSelected(null);
            }}
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="mx-3 rounded-full hover:bg-muted"
            onClick={onSubmit}
          >
            <PlusIcon className="h-5 w-5" />
            <span className="sr-only">Create</span>
          </Button>
        </div>
      </div>
      <div className="grow overflow-hidden overflow-y-auto snap-y snap-mandatory">
        {filtered.map((folder) => (
          <Fragment key={folder.id}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={className(folder, selected)}
                    onClick={() => selectFolder(folder)}
                    onDoubleClick={() => {
                      cd(folder.path);
                    }}
                  >
                    {isSelected(folder, selected) ? (
                      <FolderOpenIcon className="mr-3 h-5 w-5" />
                    ) : (
                      <FolderIcon className="mr-3 h-5 w-5" />
                    )}
                    <span>{folderName(folder.path)}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    Double click to open the folder. <br />
                    {/* Right click for more options. */}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Fragment>
        ))}
        {(filtered.length || 0) > 0 ? (
          mode == FolderListMode.FilterBookmarks && input.length === 0 && (
            <div
              key="un-categorized"
              className={className(undefined, selected)}
              onClick={() => selectFolder(undefined)}
            >
              {isSelected(undefined, selected) ? (
                <FileSearchIcon className="mr-3 h-5 w-5" />
              ) : (
                <FileQuestionIcon className="mr-3 h-5 w-5" />
              )}
              <span>Not in folder</span>
            </div>
          )
        ) : (
          <div className="flex items-center justify-center px-4 py-6 text-muted-foreground">
            No folders found
          </div>
        )}
      </div>
    </div>
  );
}


export function FolderChooser({
  defaultCWD,
  onChange,
}: {
  defaultCWD: string;
  onChange: (path: string) => void;
}) {
  const [cwd, setCwd] = useState<string>(defaultCWD);
  const [selected, setSelected] = useState<string>("/");
  return (
    <Dialog>
      <DialogTrigger>
        <ArrowLeftRightIcon />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Move bookmarks to
          </DialogTitle>
          <DialogDescription>
            {selected && `Directory ${selected}` || "Nowhere"}
          </DialogDescription>
        </DialogHeader>
        <div className="h-44">
          <FolderList
            cwd={cwd}
            select={setSelected}
            cd={(path) => {
              setCwd(path);
              setSelected(path);
            }}
            mode={FolderListMode.SelectFolder}
          />
        </div>
        <DialogFooter>
          <Button onClick={
            () => {
              onChange(selected);
            }
          }>
            Move
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

