"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { analyzeBook } from "@/api/client";

// Import our components
import { BookSearch } from "@/components/BookSearch";
import { AnalysisProgress } from "@/components/AnalysisProgress";
import { BookMetadataCard } from "@/components/BookMetadata";
import { BookTabs } from "@/components/BookTabs";
import { ErrorMessage } from "@/components/ErrorMessage";

type AnalysisStep =
  | "idle"
  | "fetchingMetadata"
  | "fetchingText"
  | "analyzing"
  | "complete";

export default function Home() {
  const [currentBookId, setCurrentBookId] = useState("");
  const [analysisStep, setAnalysisStep] = useState<AnalysisStep>("idle");

  // Book analysis query with optimized structure
  const {
    data,
    isLoading,
    error: queryError,
  } = useQuery({
    queryKey: ["bookAnalysis", currentBookId],
    queryFn: async () => {
      if (!currentBookId) return null;

      try {
        setAnalysisStep("fetchingMetadata");

        // Start the actual API call early
        const apiPromise = analyzeBook(currentBookId);

        // Simulate multi-step progress for user feedback
        await new Promise((resolve) => setTimeout(resolve, 500));
        setAnalysisStep("fetchingText");

        await new Promise((resolve) => setTimeout(resolve, 500));
        setAnalysisStep("analyzing");

        // Await the actual API response
        const result = await apiPromise;
        setAnalysisStep("complete");
        return result;
      } catch (err) {
        setAnalysisStep("idle");
        throw err;
      }
    },
    enabled: Boolean(currentBookId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
  });

  // Extract data for better code readability
  const metadata = data?.metadata ?? null;
  const text = data?.text ?? null;
  const characters = data?.characters ?? [];
  const interactions = data?.interactions ?? [];

  // Format error message
  const errorMessage =
    queryError instanceof Error
      ? queryError.message
      : queryError
      ? "An unknown error occurred"
      : null;

  // Handle search submission
  const handleSearch = (bookId: string) => {
    if (bookId !== currentBookId) {
      setCurrentBookId(bookId);
      setAnalysisStep("idle");
    }
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
        <BookSearch onSearch={handleSearch} isLoading={isLoading} />

        {/* Analysis Progress */}
        {isLoading && <AnalysisProgress analysisStep={analysisStep} />}

        {/* Error Message */}
        <ErrorMessage message={errorMessage} />

        {/* Book Metadata */}
        {metadata && <BookMetadataCard metadata={metadata} />}

        {/* Book Content Tabs */}
        {metadata && (
          <BookTabs
            text={text}
            characters={characters}
            interactions={interactions}
          />
        )}
      </main>
    </div>
  );
}
