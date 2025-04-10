import { CharacterInteraction } from "@/api/types";
import InteractionCard from "./InteractionCard";

interface InteractionsTabProps {
  interactions: CharacterInteraction[];
}

export function InteractionsTab({ interactions }: InteractionsTabProps) {
  if (interactions.length === 0) return null;

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">
        Character Interactions
      </h2>
      <div className="space-y-4">
        {interactions.map((interaction, index) => (
          <InteractionCard key={index} interaction={interaction} />
        ))}
      </div>
    </div>
  );
}
