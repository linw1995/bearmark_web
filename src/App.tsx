import "./App.css";

import { BookmarkList } from "@/components/bookmark-list";

function App() {
  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Bookmarks</h1>
        </div>
        <BookmarkList />
      </div>
    </>
  );
}

export default App;
