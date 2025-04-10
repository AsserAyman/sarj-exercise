import React from "react";
import { Character, CharacterInteraction } from "@/api/types";
import CharacterGraph from "./graph/CharacterGraph";

interface TabButtonProps {
  isActive: boolean;
  onClick: () => void;
  disabled?: boolean;
  icon: React.ReactNode;
  label: string;
}

function TabButton({
  isActive,
  onClick,
  disabled,
  icon,
  label,
}: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-3.5 font-medium text-sm transition-all duration-200 cursor-pointer relative ${
        isActive
          ? "border-b-2 border-indigo-500 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20"
          : "text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 hover:shadow-sm"
      } ${disabled ? "opacity-50 cursor-not-allowed" : "hover:scale-105"}`}
      disabled={disabled}
    >
      <span className="flex items-center">
        {icon}
        {label}
      </span>
      {!disabled && !isActive && (
        <span className="absolute inset-x-0 bottom-0 h-0.5 bg-indigo-500/0 group-hover:bg-indigo-500/40 transition-all duration-200" />
      )}
    </button>
  );
}

interface BookTabsProps {
  text: string | null;
  characters: Character[];
  interactions: CharacterInteraction[];
}

export function BookTabs({ text, characters, interactions }: BookTabsProps) {
  const [activeTab, setActiveTab] = React.useState<
    "book" | "characters" | "interactions" | "graph"
  >("book");

  const BookIcon = (
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
  );

  const CharactersIcon = (
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
  );

  const InteractionsIcon = (
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
  );

  const GraphIcon = (
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
  );

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex flex-wrap">
          <TabButton
            isActive={activeTab === "book"}
            onClick={() => setActiveTab("book")}
            icon={BookIcon}
            label="Book Preview"
          />
          <TabButton
            isActive={activeTab === "characters"}
            onClick={() => setActiveTab("characters")}
            disabled={characters.length === 0}
            icon={CharactersIcon}
            label="Characters"
          />
          <TabButton
            isActive={activeTab === "interactions"}
            onClick={() => setActiveTab("interactions")}
            disabled={interactions.length === 0}
            icon={InteractionsIcon}
            label="Interactions"
          />
          <TabButton
            isActive={activeTab === "graph"}
            onClick={() => setActiveTab("graph")}
            disabled={interactions.length === 0}
            icon={GraphIcon}
            label="Relationship Graph"
          />
        </nav>
      </div>

      <div className="p-6">
        {activeTab === "book" && text && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Book Preview
            </h2>
            <div className="prose dark:prose-invert max-w-none">
              <pre className="whitespace-pre-wrap font-mono text-sm bg-gray-50 dark:bg-gray-900 p-4 rounded-md overflow-auto max-h-96">
                {text}
              </pre>
              <p className="text-right mt-2">
                <span className="text-gray-500 dark:text-gray-400">
                  {text.length.toLocaleString()} characters
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
                Interactive graph showing relationships between characters.
                Click on a character to see details. Drag to reposition nodes,
                scroll to zoom, and use the controls on the right for additional
                options.
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
  );
}
