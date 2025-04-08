"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { fetchBookMetadata, fetchBookText } from "@/api/gutenberg";
import { BookData, Character, CharacterInteraction } from "@/api/types";
import CharacterGraph from "@/components/CharacterGraph";
import Image from "next/image";

export default function Home() {
  const [bookId, setBookId] = useState("");
  const [bookData, setBookData] = useState<BookData>({
    metadata: null,
    text: null,
  });
  const [characters, setCharacters] = useState<Character[]>([]);
  const [interactions, setInteractions] = useState<CharacterInteraction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "book" | "characters" | "interactions" | "graph"
  >("book");
  const [analysisStep, setAnalysisStep] = useState<
    "idle" | "fetchingMetadata" | "fetchingText" | "analyzing" | "complete"
  >("idle");

  const { mutate: analyzeBook, isPending } = useMutation({
    mutationFn: async (id: string) => {
      // Clear previous data and errors
      setError(null);
      setCharacters([]);
      setInteractions([]);
      setActiveTab("book");
      setAnalysisStep("fetchingMetadata");

      try {
        // First fetch the metadata
        const metadata = await fetchBookMetadata(id);
        setBookData((prev) => ({ ...prev, metadata }));

        // Then fetch the text
        setAnalysisStep("fetchingText");
        const text = await fetchBookText(id);
        setBookData((prev) => ({ ...prev, text }));

        // Now analyze the book content
        setAnalysisStep("analyzing");

        const response = await fetch("/api/analyze/book", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text,
            title: metadata.title,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to analyze book");
        }

        const analysisData = await response.json();
        setCharacters(analysisData.characters || []);
        setInteractions(analysisData.interactions || []);
        setActiveTab("characters");
        setAnalysisStep("complete");

        return { metadata, text, analysisData };
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        setAnalysisStep("idle");
        throw err;
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!bookId.trim()) return;

    analyzeBook(bookId);
  };

  // Function to get the book cover URL
  const getBookCoverUrl = (bookId: string) => {
    return `https://www.gutenberg.org/cache/epub/${bookId}/pg${bookId}.cover.medium.jpg`;
  };

  // Function to display a preview of the text (first 500 characters)
  const getTextPreview = (text: string) => {
    return text.slice(0, 500) + (text.length > 500 ? "..." : "");
  };

  const getAnalysisStatusText = () => {
    switch (analysisStep) {
      case "fetchingMetadata":
        return "Fetching book metadata...";
      case "fetchingText":
        return "Fetching book text...";
      case "analyzing":
        return "Analyzing characters & interactions...";
      default:
        return "Analyze";
    }
  };

  const analysisSteps = [
    {
      id: "fetchingMetadata",
      label: "Metadata",
      description: "Fetching book metadata",
    },
    {
      id: "fetchingText",
      label: "Book Text",
      description: "Downloading book content",
    },
    {
      id: "analyzing",
      label: "Analysis",
      description: "Identifying characters & relationships",
    },
  ];

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
              {isPending ? "Processing..." : "Analyze"}
            </button>
          </div>
        </form>

        {isPending && (
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mt-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {getAnalysisStatusText()}
            </h2>

            <div className="space-y-6">
              <div className="relative">
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
                  <div
                    className="transition-all duration-500 shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
                    style={{
                      width:
                        analysisStep === "idle"
                          ? "0%"
                          : analysisStep === "fetchingMetadata"
                          ? "33%"
                          : analysisStep === "fetchingText"
                          ? "67%"
                          : "100%",
                    }}
                  ></div>
                </div>
              </div>

              <div className="flex justify-between">
                {analysisSteps.map((step) => (
                  <div
                    key={step.id}
                    className={`text-center flex flex-col items-center relative w-1/3 ${
                      analysisStep === step.id ||
                      (analysisStep === "complete" &&
                        step.id === "analyzing") ||
                      (analysisStep === "analyzing" &&
                        (step.id === "fetchingMetadata" ||
                          step.id === "fetchingText")) ||
                      (analysisStep === "fetchingText" &&
                        step.id === "fetchingMetadata")
                        ? "text-indigo-600 dark:text-indigo-400"
                        : "text-gray-400 dark:text-gray-500"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 mb-2 rounded-full flex items-center justify-center text-xs transition-colors ${
                        analysisStep === step.id ||
                        (analysisStep === "complete" &&
                          step.id === "analyzing") ||
                        (analysisStep === "analyzing" &&
                          (step.id === "fetchingMetadata" ||
                            step.id === "fetchingText")) ||
                        (analysisStep === "fetchingText" &&
                          step.id === "fetchingMetadata")
                          ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border-2 border-indigo-500"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 border border-gray-300 dark:border-gray-700"
                      }`}
                    >
                      {analysisStep === step.id && (
                        <div className="absolute w-8 h-8 rounded-full animate-ping opacity-30 bg-indigo-400 dark:bg-indigo-600"></div>
                      )}
                      <span className="relative">
                        {analysisStep === "complete" &&
                        (step.id === "fetchingMetadata" ||
                          step.id === "fetchingText" ||
                          step.id === "analyzing")
                          ? "✓"
                          : analysisStep === "analyzing" &&
                            (step.id === "fetchingMetadata" ||
                              step.id === "fetchingText")
                          ? "✓"
                          : analysisStep === "fetchingText" &&
                            step.id === "fetchingMetadata"
                          ? "✓"
                          : step.id === analysisStep
                          ? "●"
                          : "○"}
                      </span>
                    </div>
                    <div className="text-xs font-medium">{step.label}</div>
                    <div className="text-xs mt-1 hidden sm:block max-w-[120px] mx-auto">
                      {step.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-700 dark:text-red-400">
            <p className="font-medium">Error</p>
            <p>{error}</p>
          </div>
        )}

        {bookData.metadata && (
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-1/3 bg-gradient-to-br from-indigo-900 to-indigo-700 dark:from-gray-900 dark:to-gray-700 p-6 flex items-center justify-center">
                <div className="relative w-48 h-64 rounded-lg overflow-hidden shadow-xl transform hover:scale-105 transition-transform duration-300">
                  {bookData.metadata.id && (
                    <Image
                      src={getBookCoverUrl(bookData.metadata.id)}
                      alt={`Cover for ${bookData.metadata.title}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 192px"
                      className="object-cover"
                      style={{ objectFit: "cover" }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src =
                          "https://via.placeholder.com/192x256?text=No+Cover+Available";
                      }}
                    />
                  )}
                </div>
              </div>

              <div className="w-full md:w-2/3 p-6">
                <div className="space-y-5">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                      {bookData.metadata.title}
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 mt-1">
                      by{" "}
                      <span className="font-semibold">
                        {bookData.metadata.author}
                      </span>
                    </p>
                  </div>

                  {bookData.metadata.summary && (
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 mb-3">
                        Summary
                      </h2>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {bookData.metadata.summary}
                      </p>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="mb-3 sm:mb-0">
                      <span className="text-gray-500 dark:text-gray-400 text-sm block">
                        Book ID:
                      </span>
                      <span className="font-mono text-gray-700 dark:text-gray-300">
                        {bookData.metadata.id}
                      </span>
                    </div>

                    <a
                      href={bookData.metadata.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-colors shadow-sm"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                      View on Gutenberg
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {bookData.metadata && (
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex flex-wrap">
                <button
                  onClick={() => setActiveTab("book")}
                  className={`px-4 py-3.5 font-medium text-sm ${
                    activeTab === "book"
                      ? "border-b-2 border-indigo-500 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20"
                      : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/30"
                  }`}
                >
                  <span className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                    Book Preview
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab("characters")}
                  className={`px-4 py-3.5 font-medium text-sm ${
                    activeTab === "characters"
                      ? "border-b-2 border-indigo-500 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20"
                      : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/30"
                  }`}
                  disabled={characters.length === 0}
                >
                  <span className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    Characters
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab("interactions")}
                  className={`px-4 py-3.5 font-medium text-sm ${
                    activeTab === "interactions"
                      ? "border-b-2 border-indigo-500 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20"
                      : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/30"
                  }`}
                  disabled={interactions.length === 0}
                >
                  <span className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    Interactions
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab("graph")}
                  className={`px-4 py-3.5 font-medium text-sm ${
                    activeTab === "graph"
                      ? "border-b-2 border-indigo-500 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20"
                      : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/30"
                  }`}
                  disabled={interactions.length === 0}
                >
                  <span className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 3v4a1 1 0 001 1h4M7 3h10a1 1 0 011 1v8m0 0H6m12 0v8a1 1 0 01-1 1H7a1 1 0 01-1-1v-4"
                      />
                    </svg>
                    Relationship Graph
                  </span>
                </button>
              </nav>
            </div>

            <div className="p-6">
              {activeTab === "book" && bookData.text && (
                <div>
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

              {activeTab === "characters" && characters.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Character Analysis
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {characters.map((character, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border ${
                          character.importance === "main"
                            ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
                            : character.importance === "secondary"
                            ? "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20"
                            : "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50"
                        }`}
                      >
                        <h3 className="font-bold text-lg">{character.name}</h3>
                        {character.aliases && character.aliases.length > 0 && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Also known as: {character.aliases.join(", ")}
                          </p>
                        )}
                        <p className="mt-2">{character.description}</p>
                        <div className="mt-2">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              character.importance === "main"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                : character.importance === "secondary"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                            }`}
                          >
                            {character.importance}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "interactions" && interactions.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Character Interactions
                  </h2>
                  <div className="space-y-4">
                    {interactions.map((interaction, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50"
                      >
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-lg">
                            {interaction.character1} & {interaction.character2}
                          </h3>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              interaction.significance >= 8
                                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                : interaction.significance >= 5
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                            }`}
                          >
                            Significance: {interaction.significance}/10
                          </span>
                        </div>
                        <p className="mt-2">{interaction.relationship}</p>
                        <div className="mt-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                            {interaction.nature}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "graph" &&
                characters.length > 0 &&
                interactions.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      Character Relationship Graph
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Interactive graph showing relationships between
                      characters. Click on a character to see details. Drag to
                      reposition nodes, scroll to zoom, and use the controls on
                      the right for additional options.
                    </p>
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                      <CharacterGraph
                        characters={characters}
                        interactions={interactions}
                      />
                    </div>
                  </div>
                )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
