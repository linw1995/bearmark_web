import "./App.css";
import { Input } from "@/components/ui/input";
import { BookmarkList } from "@/components/bookmark-list";
import { FolderList } from "@/components/folder-list";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import { useState } from "react";
import { Search } from "lucide-react";
import { CWDContext } from "./context";

function App() {
  const [query, setQuery] = useState<string>("");
  const [cwd, setCwd] = useState<string>("/");
  const [selected, select] = useState<string>("/");
  return (
    <>
      <CWDContext.Provider value={cwd}>
        <ResizablePanelGroup
          direction="horizontal"
          className="w-full y-full px-4 py-8"
        >
          <ResizablePanel defaultSize={20}>
            <FolderList
              key={cwd}
              cwd={cwd}
              cd={(path) => {
                setCwd(path);
                select(path);
              }}
              select={select}
            />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel className="w-full h-full pl-4 flex flex-col">
            <div className="flex justify-between items-center mb-6 gap-2 pt-2">
              <h1 className="text-2xl font-bold">Bookmarks</h1>
              <div className="flex items-center rounded-md bg-card gap-2">
                <Input
                  type="search"
                  placeholder="Search..."
                  className="bg-transparent flex-1 focus:outline-none"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <Search className="text-card-foreground hover:bg-muted/50 transition-colors" />
              </div>
            </div>
            <BookmarkList
              className="pr-4 flex-grow"
              query={query}
              cwd={selected}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </CWDContext.Provider>
    </>
  );
}

export default App;
