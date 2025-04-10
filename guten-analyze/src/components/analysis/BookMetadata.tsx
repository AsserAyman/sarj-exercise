import Image from "next/image";
import { BookMetadata as BookMetadataType } from "@/api/types";
import { getBookCoverUrl } from "../carousel/utils";

interface BookMetadataProps {
  metadata: BookMetadataType;
}

export function BookMetadataCard({ metadata }: BookMetadataProps) {
  // Function to get the book cover URL

  return (
    <div className=" bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/3 bg-gradient-to-br from-indigo-900 to-indigo-700 dark:from-gray-900 dark:to-gray-700 p-6 flex items-center justify-center">
          <div className="relative w-48 h-64 rounded-lg overflow-hidden shadow-xl transform hover:scale-105 transition-transform duration-300">
            {metadata.id && (
              <Image
                src={getBookCoverUrl(metadata.id)}
                alt={`Cover for ${metadata.title}`}
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
                {metadata.title}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mt-1">
                by <span className="font-semibold">{metadata.author}</span>
              </p>
            </div>

            {metadata.summary && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 mb-3">
                  Summary
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {metadata.summary}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="mb-3 sm:mb-0">
                <span className="text-gray-500 dark:text-gray-400 text-sm block">
                  Book ID:
                </span>
                <span className="font-mono text-gray-700 dark:text-gray-300">
                  {metadata.id}
                </span>
              </div>

              <a
                href={metadata.url}
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
  );
}
