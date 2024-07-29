import "./App.css";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { BookmarkList } from "@/components/bookmark-list";
import { Search } from "lucide-react";

function App() {
  const [query, setQuery] = useState<string>("");
  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6 gap-2">
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
        <BookmarkList query={query} />
      </div>
    </>
  );
}

export default App;
