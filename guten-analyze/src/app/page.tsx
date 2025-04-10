"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { analyzeBook } from "@/api/client";

import { BookSearch } from "@/components/BookSearch";
import { AnalysisProgress } from "@/components/progress-indicator";
import { BookMetadataCard } from "@/components/BookMetadata";
import { BookTabs } from "@/components/BookTabs";
import { ErrorMessage } from "@/components/ErrorMessage";

import { FeatureHighlights } from "@/components/FeatureHighlights";
import { Header } from "@/components/Header";
import { HomeButton } from "@/components/HomeButton";
import { AnalysisStepStatus } from "@/components/progress-indicator/types";
import { BookCarousel } from "@/components/carousel";

export default function Home() {
  const [currentBookId, setCurrentBookId] = useState("");
  const [analysisStep, setAnalysisStep] = useState<AnalysisStepStatus>("idle");

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

        await new Promise((resolve) => setTimeout(resolve, 700));
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

  const metadata = data?.metadata ?? null;
  const text = data?.text ?? null;
  const characters = data?.characters ?? [];
  const interactions = data?.interactions ?? [];

  const errorMessage =
    queryError instanceof Error
      ? queryError.message
      : queryError
      ? "An unknown error occurred"
      : null;

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
        <Header />

        {/* Home button - Only show when a book is selected */}
        <HomeButton
          resetToLanding={resetToLanding}
          isLoading={isLoading}
          showButton={Boolean(metadata || analysisStep !== "idle")}
        />

        <BookSearch onSearch={handleSearch} isLoading={isLoading} />

        <ErrorMessage message={errorMessage} />

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

            <FeatureHighlights />
          </>
        )}

        <div className="max-w-4xl mx-auto flex flex-col space-y-10">
          {isLoading && <AnalysisProgress analysisStep={analysisStep} />}

          {metadata && <BookMetadataCard metadata={metadata} />}

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
