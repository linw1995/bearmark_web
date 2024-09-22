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
  PlusIcon,
} from "lucide-react";
import { useState, useContext, Fragment } from "react";

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
  return `flex snap-start items-center p-4 cursor-pointer transition-colors ${isSelected(folder, selectedFolder)
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
  onCD,
  onSelect,
  mode = FolderListMode.FilterBookmarks,
}: {
  cwd: Folder;
  onSelect: (target: Folder) => void;
  onCD: (target: Folder) => void;
  mode?: FolderListMode;
}) {
  const { setAuthRequiredReason } = useContext(RequiredAuthContext);
  const { data, mutate } = useFolders(
    { cwd: cwd.path },
    jsonFetcherMaker(setAuthRequiredReason)
  );
  const [selected, setSelected] = useState<Folder | null | undefined>(null);
  const [history, setHistory] = useState<Folder[]>([]);
  const [input, setInput] = useState<string>("");
  const filtered = (data || []).filter((value) =>
    folderName(value.path).match(input)
  );

  const clearSelect = (cwd: Folder) => {
    setSelected(null);
    onSelect(cwd);
  }
  const cdBackward = () => {
    if (history.length === 0) {
      clearSelect(cwd);
      return;
    }
    const last = history.pop();
    if (last) {
      clearSelect(last);
      onCD(last);
    }
  }
  const cd = (folder: Folder) => {
    setHistory([...history, cwd]);
    onCD(folder);
  }
  const selectFolder = (folder: Folder | undefined) => {
    if (folder === selected) {
      clearSelect(cwd);
    } else {
      setSelected(folder);
      if (folder) {
        onSelect(folder);
      } else {
        // not in folder
        if (cwd.path == "/") {
          onSelect({
            id: cwd.id,
            path: "//"
          });
        } else {
          onSelect({
            id: cwd.id,
            path: cwd.path + "//"
          });
        }
      }
    }
  };
  const onSubmit = async () => {
    if (input.length === 0) {
      return;
    }
    await createFolder(cwd.path + "/" + input, fetcherMaker(setAuthRequiredReason));
    await mutate();
    setInput("");
  };
  return (
    <div className="h-full flex flex-col select-none">
      <div className="flex-none mb-4">
        <div className="flex items-center gap-2 p-1">
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
              cdBackward();
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
                      cd(folder);
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
  children,
}: {
  defaultCWD: Folder;
  onChange: (value: Folder) => void;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [cwd, setCwd] = useState<Folder>(defaultCWD);
  const [selected, setSelected] = useState<Folder>(defaultCWD);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Move bookmarks to
          </DialogTitle>
          <DialogDescription>
            {selected && `Directory ${selected.path}` || "Nowhere"}
          </DialogDescription>
        </DialogHeader>
        <div className="h-[30vh]">
          <FolderList
            cwd={cwd}
            onSelect={setSelected}
            onCD={(path) => {
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
              setOpen(false);
            }
          }>
            Move
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

