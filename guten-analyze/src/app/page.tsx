"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { analyzeBook } from "@/api/client";
import { BookData, Character, CharacterInteraction } from "@/api/types";

// Import our components
import { BookSearch } from "@/components/BookSearch";
import { AnalysisProgress } from "@/components/AnalysisProgress";
import { BookMetadataCard } from "@/components/BookMetadata";
import { BookTabs } from "@/components/BookTabs";
import { ErrorMessage } from "@/components/ErrorMessage";

export default function Home() {
  const [currentBookId, setCurrentBookId] = useState("");
  const [bookData, setBookData] = useState<BookData>({
    metadata: null,
    text: null,
  });
  const [characters, setCharacters] = useState<Character[]>([]);
  const [interactions, setInteractions] = useState<CharacterInteraction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [analysisStep, setAnalysisStep] = useState<
    "idle" | "fetchingMetadata" | "fetchingText" | "analyzing" | "complete"
  >("idle");

  // Book analysis query
  const { data, isFetching } = useQuery({
    queryKey: ["bookAnalysis", currentBookId],
    queryFn: async () => {
      if (!currentBookId) return null;

      if (isFetching) {
        // Reset state for new analysis
        setError(null);
        setCharacters([]);
        setInteractions([]);
        setAnalysisStep("fetchingMetadata");

        try {
          // Simulate multi-step progress
          const apiPromise = analyzeBook(currentBookId);

          // Simulate fetching steps with delays
          await new Promise((resolve) => setTimeout(resolve, 500));
          setAnalysisStep("fetchingText");

          await new Promise((resolve) => setTimeout(resolve, 500));
          setAnalysisStep("analyzing");

          // Await the actual API response
          return await apiPromise;
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "An unknown error occurred"
          );
          setAnalysisStep("idle");
          throw err;
        }
      }

      // If using cache, just call the API without UI indicators
      return await analyzeBook(currentBookId);
    },
    enabled: currentBookId !== "",
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
  });

  // Update UI state when data changes
  useEffect(() => {
    if (data) {
      setBookData({
        metadata: data.metadata,
        text: data.text,
      });
      setCharacters(data.characters || []);
      setInteractions(data.interactions || []);
      setAnalysisStep("complete");
    }
  }, [data]);

  // Handle search submission
  const handleSearch = (bookId: string) => {
    setCurrentBookId(bookId);
  };

  return (
    <div className="flex min-h-screen flex-col items-center p-6">
      <main className="max-w-4xl w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Gutenberg Insights
          </h1>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
            Analyze your favourite Gutenberg books Now
          </p>
        </div>

        {/* Search Form */}
        <BookSearch onSearch={handleSearch} isLoading={isFetching} />

        {/* Analysis Progress */}
        {isFetching && <AnalysisProgress analysisStep={analysisStep} />}

        {/* Error Message */}
        <ErrorMessage message={error} />

        {/* Book Metadata */}
        {bookData.metadata && <BookMetadataCard metadata={bookData.metadata} />}

        {/* Book Content Tabs */}
        {bookData.metadata && (
          <BookTabs
            text={bookData.text}
            characters={characters}
            interactions={interactions}
          />
        )}
      </main>
    </div>
  );
}
