import { Character, CharacterInteraction } from "@/api/types";
import CharacterGraph from "./graph";

interface GraphTabProps {
  characters: Character[];
  interactions: CharacterInteraction[];
}

export function GraphTab({ characters, interactions }: GraphTabProps) {
  if (characters.length === 0 || interactions.length === 0) return null;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Character Relationship Graph
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Interactive graph showing relationships between characters. Click on a
        character to see details. Drag to reposition nodes, scroll to zoom, and
        use the controls on the right for additional options.
      </p>
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <CharacterGraph characters={characters} interactions={interactions} />
      </div>
    </div>
  );
}
