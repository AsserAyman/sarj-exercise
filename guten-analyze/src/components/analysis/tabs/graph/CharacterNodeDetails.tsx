"use client";

import { Character, CharacterInteraction } from "@/api/types";
import { getImportanceBadgeClass } from "./utils";

interface CharacterNodeDetailsProps {
  character: Character;
  interactions: CharacterInteraction[];
  onClose: () => void;
}

export default function CharacterNodeDetails({
  character,
  interactions,
  onClose,
}: CharacterNodeDetailsProps) {
  const characterInteractions = interactions.filter(
    (interaction) =>
      interaction.character1 === character.name ||
      interaction.character2 === character.name
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold">{character.name}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="mt-4">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getImportanceBadgeClass(
                character.importance
              )}`}
            >
              {character.importance}
            </span>
          </div>

          {character.aliases.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-400">
                Also known as
              </h3>
              <div className="flex flex-wrap gap-2 mt-1">
                {character.aliases.map((alias, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-300"
                  >
                    {alias}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-400">Description</h3>
            <p className="mt-1 text-sm text-gray-100">
              {character.description}
            </p>
          </div>

          {characterInteractions.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium border-b border-gray-700 pb-2">
                Relationships
              </h3>
              <div className="space-y-4 mt-3">
                {characterInteractions.map((interaction, index) => {
                  const otherCharacter =
                    interaction.character1 === character.name
                      ? interaction.character2
                      : interaction.character1;

                  return (
                    <div
                      key={index}
                      className="p-3 rounded-md border border-gray-700"
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">{otherCharacter}</h4>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            interaction.significance >= 8
                              ? "bg-red-900 text-red-300"
                              : interaction.significance >= 5
                              ? "bg-yellow-900 text-yellow-300"
                              : "bg-blue-900 text-blue-300"
                          }`}
                        >
                          {interaction.significance}/10
                        </span>
                      </div>
                      <p className="mt-1 text-sm">{interaction.relationship}</p>
                      <div className="mt-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-900 text-purple-300">
                          {interaction.nature}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
