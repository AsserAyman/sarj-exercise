"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { analyzeBook } from "@/api/client";

import { BookSearch } from "@/components/BookSearch";
import { AnalysisProgress } from "@/components/AnalysisProgress";
import { BookMetadataCard } from "@/components/BookMetadata";
import { BookTabs } from "@/components/BookTabs";
import { ErrorMessage } from "@/components/ErrorMessage";
import { BookCarousel } from "@/components/BookCarousel";
import { FeatureHighlights } from "@/components/FeatureHighlights";

type AnalysisStep =
  | "idle"
  | "fetchingMetadata"
  | "fetchingText"
  | "analyzing"
  | "complete";

export default function Home() {
  const [currentBookId, setCurrentBookId] = useState("");
  const [analysisStep, setAnalysisStep] = useState<AnalysisStep>("idle");

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
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-300 dark:to-purple-300">
            Gutenberg Insights
          </h1>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
            Analyze your favourite Gutenberg books Now
          </p>
        </div>

        {/* Book Search Field - Always visible */}
        <BookSearch onSearch={handleSearch} isLoading={isLoading} />

        {/* Analysis Progress - Show when loading */}
        {isLoading && <AnalysisProgress analysisStep={analysisStep} />}

        {/* Error Message - Show when there's an error */}
        <ErrorMessage message={errorMessage} />

        {/* Landing Page Content - Show when no book is selected */}
        {analysisStep === "idle" && !metadata && (
          <>
            {/* Featured Books Carousel */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
                Discover Literary Treasures
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Explore the complex relationships between characters, analyze
                themes, and uncover insights from classic literature. Enter a
                book ID from Project Gutenberg to begin your journey.
              </p>
            </div>
            <BookCarousel
              bookIds={[
                "1342",
                "64317",
                "2701",
                "11",
                "2600",
                "1661",
                "84",
                "1787",
              ]}
              onSelectBook={handleSearch}
            />

            {/* Feature Highlights */}
            <FeatureHighlights />
          </>
        )}

        {/* Book Metadata - Show when book is loaded */}
        {metadata && <BookMetadataCard metadata={metadata} />}

        {/* Book Analysis Tabs - Show when book is loaded */}
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
