"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface BookCarouselProps {
  bookIds: string[];
  onSelectBook: (bookId: string) => void;
}

interface BookDetails {
  id: string;
  coverUrl: string;
  title?: string;
}

export function BookCarousel({ bookIds, onSelectBook }: BookCarouselProps) {
  const [books, setBooks] = useState<BookDetails[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // Generate book details from IDs
  useEffect(() => {
    const bookDetails = bookIds.map((id) => ({
      id,
      coverUrl: `https://www.gutenberg.org/cache/epub/${id}/pg${id}.cover.medium.jpg`,
      title: getBookTitle(id),
    }));
    setBooks(bookDetails);
  }, [bookIds]);

  // Function to get book titles (would be better to fetch from an API)
  function getBookTitle(id: string): string {
    const titles: Record<string, string> = {
      "1342": "Pride and Prejudice",
      "64317": "The Great Gatsby",
      "2701": "Moby Dick",
      "11": "Alice's Adventures in Wonderland",
      "2600": "War and Peace",
      "1661": "The Adventures of Sherlock Holmes",
      "84": "Frankenstein",
      "1787": "Hamlet",
    };
    return titles[id] || `Book #${id}`;
  }

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === books.length - 1 ? 0 : prevIndex + 1
        );
      }, 3000);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, books.length]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === books.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? books.length - 1 : prevIndex - 1
    );
  };

  const handleBookClick = (bookId: string) => {
    // Pause autoplay when a book is selected
    setIsAutoPlaying(false);
    onSelectBook(bookId);
  };

  if (books.length === 0) return null;

  return (
    <div className="relative overflow-hidden py-10 px-4 rounded-xl">
      <div className="relative flex justify-center items-center h-[400px]">
        {books.map((book, index) => {
          // Calculate the position offset based on the current index
          const offset =
            (((index - currentIndex) % books.length) + books.length) %
            books.length;
          const isActive = offset === 0;
          const distanceFromActive = Math.min(offset, books.length - offset);

          // Position and style based on distance from active book
          const position =
            offset === 0 ? 0 : offset > books.length / 2 ? -1 : 1;
          const scale = 1 - 0.15 * distanceFromActive;
          const zIndex = books.length - distanceFromActive;
          const opacity = 1 - 0.25 * distanceFromActive;

          return (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                x: `${position * 130}%`,
                scale,
                zIndex,
                opacity,
              }}
              transition={{ duration: 0.5 }}
              className={`absolute w-[220px] h-[320px] cursor-pointer
                ${
                  isActive
                    ? "pointer-events-auto"
                    : "pointer-events-none md:pointer-events-auto"
                }
                transition-all duration-300 ease-in-out
                hover:shadow-xl dark:shadow-indigo-900/30`}
              onClick={() => isActive && handleBookClick(book.id)}
            >
              <div className="relative w-full h-full rounded-lg overflow-hidden shadow-md border-2 border-white/80 dark:border-gray-800">
                <Image
                  src={book.coverUrl}
                  alt={book.title || `Book cover ${book.id}`}
                  fill
                  sizes="(max-width: 768px) 220px, 220px"
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src =
                      "https://via.placeholder.com/220x320?text=No+Cover";
                  }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="flex justify-center mt-16 space-x-3">
        <button
          onClick={handlePrev}
          className="p-2 rounded-full bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 shadow-sm transition-colors"
        >
          <svg
            className="w-5 h-5 text-gray-700 dark:text-gray-300"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 18L9 12L15 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div className="flex space-x-1">
          {books.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "bg-indigo-600 dark:bg-indigo-400 w-4"
                  : "bg-gray-300 dark:bg-gray-600"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="p-2 rounded-full bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 shadow-sm transition-colors"
        >
          <svg
            className="w-5 h-5 text-gray-700 dark:text-gray-300"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 6L15 12L9 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
