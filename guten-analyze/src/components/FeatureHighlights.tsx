"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useState } from "react";

interface Feature {
  title: string;
  description: string;
  icon: ReactNode;
}

export function FeatureHighlights() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const features: Feature[] = [
    {
      title: "Access to Classical Literature",
      description:
        "Explore the vast collection of Project Gutenberg with over 60,000 free e-books.",
      icon: (
        <svg
          className="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 6.25278V19.2528M12 6.25278C10.8321 5.47686 9.24649 5 7.5 5C5.75351 5 4.16789 5.47686 3 6.25278V19.2528C4.16789 18.4769 5.75351 18 7.5 18C9.24649 18 10.8321 18.4769 12 19.2528M12 6.25278C13.1679 5.47686 14.7535 5 16.5 5C18.2465 5 19.8321 5.47686 21 6.25278V19.2528C19.8321 18.4769 18.2465 18 16.5 18C14.7535 18 13.1679 18.4769 12 19.2528"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      title: "Character Analysis",
      description:
        "Discover the complex relationships between characters and their significance in the story.",
      icon: (
        <svg
          className="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      title: "Visual Relationship Graph",
      description:
        "Visualize character relationships and interactions with an interactive network graph.",
      icon: (
        <svg
          className="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="5" cy="12" r="2" stroke="currentColor" strokeWidth="2" />
          <circle cx="19" cy="12" r="2" stroke="currentColor" strokeWidth="2" />
          <circle cx="12" cy="19" r="2" stroke="currentColor" strokeWidth="2" />
          <circle cx="12" cy="5" r="2" stroke="currentColor" strokeWidth="2" />
          <path d="M7 12H17" stroke="currentColor" strokeWidth="2" />
          <path d="M12 7V17" stroke="currentColor" strokeWidth="2" />
        </svg>
      ),
    },
  ];

  return (
    <div className="mt-10 mb-6 px-4 py-8 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950 rounded-xl">
      <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-white mb-8">
        Unlock the Power of Literary Analysis
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className={`p-5 rounded-lg cursor-pointer transition-all duration-300 ${
              hoveredIndex === index
                ? "bg-white dark:bg-gray-800 shadow-lg"
                : "bg-transparent hover:bg-white/60 dark:hover:bg-gray-800/60"
            }`}
            whileHover={{ scale: 1.03 }}
            onHoverStart={() => setHoveredIndex(index)}
            onHoverEnd={() => setHoveredIndex(null)}
          >
            <div
              className={`flex items-center justify-center h-12 w-12 rounded-full mb-4 transition-colors duration-300 ${
                hoveredIndex === index
                  ? "bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
              }`}
            >
              {feature.icon}
            </div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">
              {feature.title}
            </h3>
            <motion.div
              animate={{
                height: hoveredIndex === index ? "auto" : 0,
                opacity: hoveredIndex === index ? 1 : 0,
                marginTop: hoveredIndex === index ? 8 : 0,
              }}
              initial={{ height: 0, opacity: 0, marginTop: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
