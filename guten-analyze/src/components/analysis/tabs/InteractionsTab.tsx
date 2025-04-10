import { CharacterInteraction } from "@/api/types";

interface InteractionsTabProps {
  interactions: CharacterInteraction[];
}

export function InteractionsTab({ interactions }: InteractionsTabProps) {
  if (interactions.length === 0) return null;

  return (
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
  );
}
