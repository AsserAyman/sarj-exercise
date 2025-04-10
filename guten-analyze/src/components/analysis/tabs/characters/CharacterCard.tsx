import { Character } from "@/api/types";
import { getCardClasses, getImportanceBadgeClasses } from "./utils";

interface CharacterCardProps {
  character: Character;
}

export default function CharacterCard({ character }: CharacterCardProps) {
  return (
    <div
      className={`p-4 rounded-lg border ${getCardClasses(
        character.importance
      )}`}
    >
      <h3 className="font-bold text-lg">{character.name}</h3>
      {character.aliases && character.aliases.length > 0 && (
        <p className="text-sm text-gray-400 mt-1">
          Also known as: {character.aliases.join(", ")}
        </p>
      )}
      <p className="mt-2">{character.description}</p>
      <div className="mt-2">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getImportanceBadgeClasses(
            character.importance
          )}`}
        >
          {character.importance}
        </span>
      </div>
    </div>
  );
}
