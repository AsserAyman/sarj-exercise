"use client";

import { useState } from "react";

export default function Home() {
  const [bookId, setBookId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Book ID:", bookId);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      <main className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Gutenberg Insights
          </h1>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
            Analyze your favourite Gutenberg books Now
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label htmlFor="bookId" className="sr-only">
              Book ID
            </label>
            <input
              id="bookId"
              name="bookId"
              type="text"
              required
              value={bookId}
              onChange={(e) => setBookId(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
              placeholder="Enter book ID"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Analyze
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
