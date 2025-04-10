"use client";

import { useState, useEffect, useRef } from "react";
import { BookCarouselProps, BookDetails } from "./types";
import { generateBookDetails } from "./utils";
import { BookCard } from "./BookCard";
import { CarouselControls } from "./CarouselControls";

// Re-export components and types
export * from "./types";
export * from "./utils";
export * from "./BookCard";
export * from "./CarouselControls";

export function BookCarousel({ bookIds, onSelectBook }: BookCarouselProps) {
  const [books, setBooks] = useState<BookDetails[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // Generate book details from IDs
  useEffect(() => {
    const bookDetails = generateBookDetails(bookIds);
    setBooks(bookDetails);
  }, [bookIds]);

  // Auto-play functionality
  useEffect(() => {
    autoPlayRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === books.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [books.length]);

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
            <BookCard
              key={book.id}
              book={book}
              isActive={isActive}
              position={position}
              distanceFromActive={distanceFromActive}
              zIndex={zIndex}
              scale={scale}
              opacity={opacity}
              rotation={rotation}
              onClick={() => isActive && handleBookClick(book.id)}
            />
          );
        })}
      </div>

      <CarouselControls
        currentIndex={currentIndex}
        totalItems={books.length}
        onPrev={handlePrev}
        onNext={handleNext}
        onSelect={setCurrentIndex}
      />
    </div>
  );
}
