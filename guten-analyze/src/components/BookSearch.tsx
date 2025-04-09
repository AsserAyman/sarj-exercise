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
    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
      <div className="flex gap-4">
        <input
          id="bookId"
          name="bookId"
          type="text"
          required
          value={bookId}
          onChange={(e) => setBookId(e.target.value)}
          className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
          placeholder="Enter book ID (e.g., 1661 for Sherlock Holmes)"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading || !bookId.trim()}
        >
          {isLoading ? "Processing..." : "Analyze"}
        </button>
      </div>
    </form>
  );
}
