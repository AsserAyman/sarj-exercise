"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { BookCardProps } from "./types";

export function BookCard({
  book,
  isActive,
  position,
  distanceFromActive,
  zIndex,
  scale,
  opacity,
  rotation,
  onClick,
}: BookCardProps) {
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
      onClick={onClick}
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
            target.src = "https://via.placeholder.com/280x400?text=No+Cover";
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
}
