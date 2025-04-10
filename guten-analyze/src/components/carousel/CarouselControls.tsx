"use client";

import { motion } from "framer-motion";
import { CarouselControlsProps } from "./types";

export function CarouselControls({
  currentIndex,
  totalItems,
  onPrev,
  onNext,
  onSelect,
}: CarouselControlsProps) {
  return (
    <div className="flex justify-center mt-20 space-x-6">
      <PrevButton onClick={onPrev} />

      <Pagination
        currentIndex={currentIndex}
        totalItems={totalItems}
        onSelect={onSelect}
      />

      <NextButton onClick={onNext} />
    </div>
  );
}

function PrevButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
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
  );
}

function NextButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
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
  );
}

function Pagination({
  currentIndex,
  totalItems,
  onSelect,
}: {
  currentIndex: number;
  totalItems: number;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="flex space-x-3 items-center">
      {Array.from({ length: totalItems }).map((_, index) => (
        <motion.button
          key={index}
          onClick={() => onSelect(index)}
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
  );
}
