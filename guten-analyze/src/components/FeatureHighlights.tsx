import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface Feature {
  title: string;
  description: string;
  icon: ReactNode;
}

export function FeatureHighlights() {
  const features: Feature[] = [
    {
      title: "Access to Classical Literature",
      description:
        "Explore the vast collection of Project Gutenberg with over 60,000 free e-books. Discover classics from Shakespeare to Austen, all in one place.",
      icon: (
        <svg
          className="w-8 h-8"
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
        "Discover the complex relationships between characters and their significance in the story. See who interacts with whom and how they influence the narrative.",
      icon: (
        <svg
          className="w-8 h-8"
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
        "Visualize character relationships and interactions with an interactive network graph. Drag, zoom, and explore connections between characters in a dynamic visualization.",
      icon: (
        <svg
          className="w-8 h-8"
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
    <div className="mt-2 mb-10 rounded-xl overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="group relative overflow-hidden rounded-xl bg-black/40 shadow-lg transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{
              y: -12,
              scale: 1.05,
              boxShadow:
                "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)",
              transition: { duration: 0.2 },
            }}
          >
            {/* Decorative diagonal gradient stripe */}
            <div className="absolute right-0 top-0 h-24 w-24 -mr-10 -mt-10 bg-gradient-to-br from-indigo-600/30 to-indigo-800/20 rounded-full transform rotate-12"></div>

            <div className="relative z-10 p-8">
              <div className="flex flex-col items-start">
                <div
                  className="flex items-center justify-center h-16 w-16 rounded-full mb-6 transition-colors duration-300
                  bg-gray-800/70 text-gray-400 group-hover:bg-indigo-900/80 group-hover:text-indigo-200"
                >
                  {feature.icon}
                </div>

                <div className="mt-2">
                  <h3
                    className="text-2xl font-semibold mb-4 transition-colors duration-300
                    text-gray-100 group-hover:text-indigo-300"
                  >
                    {feature.title}
                  </h3>

                  <p className="text-base text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
