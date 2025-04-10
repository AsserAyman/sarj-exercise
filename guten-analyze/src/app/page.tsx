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

  // Add function to reset to landing page
  const resetToLanding = () => {
    setCurrentBookId("");
    setAnalysisStep("idle");
  };

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
    <div className="flex min-h-screen flex-col items-center p-6 bg-black text-white relative overflow-hidden">
      {/* Background graphic elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl transform rotate-45"></div>
        <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-indigo-900/20 rounded-full blur-3xl"></div>
      </div>

      <main className=" w-full space-y-8 relative z-10">
        {/* Header */}
        <div className="mt-10 text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-indigo-400">
            Explore Literary Worlds with AI
          </h1>
          <p className="max-w-2xl mx-auto mt-6 text-lg text-gray-600 dark:text-gray-400">
            Analyze classic literature through artificial intelligence. Discover
            themes, character relationships, and writing styles with our
            powerful tools.
          </p>

          {/* Home button - Only show when a book is selected */}
          {(metadata || analysisStep !== "idle") && (
            <button
              onClick={resetToLanding}
              className="absolute top-6 left-6 p-3 rounded-full bg-black border border-indigo-500 hover:border-indigo-400 hover:bg-gray-900 hover:scale-105 hover:shadow-indigo-500/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all cursor-pointer shadow-lg shadow-indigo-500/10 z-20"
              aria-label="Return to home page"
              disabled={isLoading}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            </button>
          )}
        </div>

        {/* Book Search Field - Always visible */}
        <BookSearch onSearch={handleSearch} isLoading={isLoading} />

        {/* Error Message - Show when there's an error */}
        <ErrorMessage message={errorMessage} />

        {/* Landing Page Content - Show when no book is selected */}
        {analysisStep === "idle" && !metadata && (
          <>
            {/* Featured Books Carousel */}
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
        <div className="max-w-4xl mx-auto flex flex-col space-y-10">
          {/* Analysis Progress - Show when loading */}
          {isLoading && <AnalysisProgress analysisStep={analysisStep} />}

          {metadata && <BookMetadataCard metadata={metadata} />}

          {/* Book Analysis Tabs - Show when book is loaded */}
          {metadata && (
            <BookTabs
              text={text}
              characters={characters}
              interactions={interactions}
            />
          )}
        </div>
      </main>
    </div>
  );
}
