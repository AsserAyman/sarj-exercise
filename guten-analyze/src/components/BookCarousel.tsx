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
  const isAutoPlaying = true; // Changed to constant since we don't need to modify it
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

  // Function to get book titles
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
    onSelectBook(bookId);
  };

  if (books.length === 0) return null;

  return (
    <div className="relative overflow-hidden py-14 px-4">
      <div className="relative flex justify-center items-center h-[480px]">
        {/* Spotlight effect for active book */}
        <div className="absolute w-[320px] h-[480px] bg-gradient-to-b from-indigo-900/10 via-indigo-800/5 to-transparent dark:from-indigo-600/20 dark:via-indigo-500/10 dark:to-transparent rounded-[100%] blur-xl"></div>

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

          // Calculate rotation for 3D effect
          const rotation = position * 5; // 5 degrees tilt for side books

          return (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, scale: 0.8, rotateY: rotation }}
              animate={{
                x: `${position * 130}%`,
                scale,
                zIndex,
                opacity,
                rotateY: rotation,
              }}
              transition={{
                duration: 0.6,
                ease: [0.19, 1, 0.22, 1], // Easing for smooth motion
              }}
              className={`absolute w-[280px] h-[400px] cursor-pointer
                ${
                  isActive
                    ? "pointer-events-auto"
                    : "pointer-events-none md:pointer-events-auto"
                }
                transition-all duration-300 ease-in-out
                hover:shadow-2xl hover:scale-105 dark:shadow-indigo-900/30`}
              onClick={() => isActive && handleBookClick(book.id)}
              style={{
                transformStyle: "preserve-3d",
                perspective: "1000px",
              }}
            >
              <div
                className={`relative w-full h-full rounded-lg overflow-hidden shadow-lg
                ${
                  isActive
                    ? "border-2 border-indigo-500/30 dark:border-indigo-500/30 shadow-indigo-200/50 dark:shadow-indigo-800/30"
                    : "border border-indigo-300/30 dark:border-indigo-700/30"
                }
                transition-all duration-300`}
              >
                <Image
                  src={book.coverUrl}
                  alt={book.title || `Book cover ${book.id}`}
                  fill
                  sizes="(max-width: 768px) 280px, 280px"
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src =
                      "https://via.placeholder.com/280x400?text=No+Cover";
                  }}
                />
                {/* Book spine effect */}
                <div className="absolute left-0 top-0 bottom-0 w-[5px] bg-gradient-to-r from-black/20 to-transparent dark:from-black/40"></div>

                {/* Book edge effect */}
                <div className="absolute right-0 top-0 h-full w-[2px] bg-gradient-to-l from-white/30 to-transparent dark:from-white/10"></div>

                {/* Book shadow overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-black/30 via-transparent to-transparent opacity-30"></div>
              </div>

              {isActive && (
                <motion.div
                  className="absolute -bottom-14 left-0 right-0 text-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                >
                  <span className="inline-block text-lg font-medium bg-black/70 text-indigo-200 dark:bg-black/90 dark:text-indigo-300 px-6 py-3 rounded-full shadow-sm">
                    {book.title}
                  </span>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="flex justify-center mt-20 space-x-6">
        <motion.button
          onClick={handlePrev}
          className="p-3 rounded-full bg-black/20 dark:bg-black/50 hover:bg-black/30 dark:hover:bg-black/70 shadow-sm transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg
            className="w-6 h-6 text-indigo-600 dark:text-indigo-400"
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
        </motion.button>

        <div className="flex space-x-3 items-center">
          {books.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-indigo-600 dark:bg-indigo-400 w-6 h-6"
                  : "bg-gray-600/40 dark:bg-gray-700/40 w-4 h-4 hover:bg-indigo-400/50 dark:hover:bg-indigo-500/50"
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <motion.button
          onClick={handleNext}
          className="p-3 rounded-full bg-black/20 dark:bg-black/50 hover:bg-black/30 dark:hover:bg-black/70 shadow-sm transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg
            className="w-6 h-6 text-indigo-600 dark:text-indigo-400"
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
        </motion.button>
      </div>
    </div>
  );
}
