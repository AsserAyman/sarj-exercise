import { useState } from "react";

interface BookSearchProps {
  onSearch: (bookId: string) => void;
  isLoading: boolean;
}

export function BookSearch({ onSearch, isLoading }: BookSearchProps) {
  const [bookId, setBookId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookId.trim()) return;
    onSearch(bookId);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-3">
          <input
            id="bookId"
            name="bookId"
            type="text"
            required
            value={bookId}
            onChange={(e) => setBookId(e.target.value)}
            className="w-full px-4 py-4 border border-indigo-500/30 bg-black/60 text-white rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"
            placeholder="Enter book ID (e.g., 1661 for Sherlock Holmes)"
            disabled={isLoading}
          />
        </div>
        <div className="col-span-1">
          <button
            type="submit"
            className="w-full px-4 py-4 text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            disabled={isLoading || !bookId.trim()}
          >
            {isLoading ? "Processing..." : "Start Analyzing"}
          </button>
        </div>
      </div>
    </form>
  );
}
