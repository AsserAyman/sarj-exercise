"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { fetchBookMetadata, fetchBookText } from "@/api/gutenberg";
import { BookData } from "@/api/types";

export default function Home() {
  const [bookId, setBookId] = useState("");
  const [bookData, setBookData] = useState<BookData>({
    metadata: null,
    text: null,
  });
  const [error, setError] = useState<string | null>(null);

  const { mutate: analyzeBook, isPending } = useMutation({
    mutationFn: async (id: string) => {
      // Clear previous data and errors
      setError(null);

      try {
        // First fetch the metadata
        const metadata = await fetchBookMetadata(id);
        setBookData((prev) => ({ ...prev, metadata }));

        // Then fetch the text
        const text = await fetchBookText(id);
        setBookData((prev) => ({ ...prev, text }));

        return { metadata, text };
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        throw err;
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookId.trim()) return;

    analyzeBook(bookId);
  };

  // Function to display a preview of the text (first 500 characters)
  const getTextPreview = (text: string) => {
    return text.slice(0, 500) + (text.length > 500 ? "..." : "");
  };

  return (
    <div className="flex min-h-screen flex-col items-center p-6">
      <main className="max-w-4xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Gutenberg Insights
          </h1>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
            Analyze your favourite Gutenberg books Now
          </p>
        </div>

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
              disabled={isPending}
            />
            <button
              type="submit"
              className="px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isPending}
            >
              {isPending ? "Analyzing..." : "Analyze"}
            </button>
          </div>
        </form>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-700 dark:text-red-400">
            <p className="font-medium">Error</p>
            <p>{error}</p>
          </div>
        )}

        {bookData.metadata && (
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Book Information
            </h2>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Title:</span>{" "}
                {bookData.metadata.title}
              </p>
              <p>
                <span className="font-medium">Author:</span>{" "}
                {bookData.metadata.author}
              </p>
              <p>
                <span className="font-medium">Book ID:</span>{" "}
                {bookData.metadata.id}
              </p>
              <p>
                <a
                  href={bookData.metadata.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  View on Gutenberg
                </a>
              </p>
            </div>
          </div>
        )}

        {bookData.text && (
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Book Preview
            </h2>
            <div className="prose dark:prose-invert max-w-none">
              <pre className="whitespace-pre-wrap font-mono text-sm bg-gray-50 dark:bg-gray-900 p-4 rounded-md overflow-auto max-h-96">
                {getTextPreview(bookData.text)}
              </pre>
              <p className="text-right mt-2">
                <span className="text-gray-500 dark:text-gray-400">
                  {bookData.text.length.toLocaleString()} characters
                </span>
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
