import { Character } from "@/api/types";

interface CharactersTabProps {
  characters: Character[];
}

export function CharactersTab({ characters }: CharactersTabProps) {
  if (characters.length === 0) return null;

  return (
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
  );
}
