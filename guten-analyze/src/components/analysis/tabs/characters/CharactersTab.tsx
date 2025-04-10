import { Character } from "@/api/types";
import CharacterCard from "./CharacterCard";

interface CharactersTabProps {
  characters: Character[];
}

export default function CharactersTab({ characters }: CharactersTabProps) {
  if (characters.length === 0) return null;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Character Analysis
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {characters.map((character, index) => (
          <CharacterCard key={index} character={character} />
        ))}
      </div>
    </div>
  );
}
