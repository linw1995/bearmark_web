import "@/App.css";
import { Input } from "@/components/ui/input";
import { BookmarkList } from "@/components/bookmark-list";
import { FolderList } from "@/components/folder-list";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { useContext, useState } from "react";
import { Search } from "lucide-react";
import { CWDContext, RequiredAuthContext } from "./context";
import { saveAPIKey } from "./lib/utils";

function BookmarksViewer() {
  const [cwd, setCwd] = useState<string>("/");
  const [query, setQuery] = useState<string>("");
  const [selected, select] = useState<string>("/");
  return (
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
  );
}

function APIKeyInput() {
  const { require } = useContext(RequiredAuthContext);
  const [input, setInput] = useState<string>("");
  return (
    <div className="flex items-center justify-center h-screen">
      <form className="sm:max-w-[500px] w-full px-4">
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">Bearmark API Key</Label>
            <Input
              id="api-key"
              placeholder="Enter your API key"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          <Button
            onClick={() => {
              if (input.length === 0) {
                return;
              }
              saveAPIKey(input);
              require(false);
            }}
          >
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
}

function App() {
  const [required, require] = useState<boolean>(false);
  return (
    <>
      <RequiredAuthContext.Provider value={{ require, required }}>
        {required ? <APIKeyInput /> : <BookmarksViewer />}
      </RequiredAuthContext.Provider>
    </>
  );
}

export default App;
