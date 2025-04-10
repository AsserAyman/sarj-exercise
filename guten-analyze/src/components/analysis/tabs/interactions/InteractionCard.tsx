import { CharacterInteraction } from "@/api/types";
import {
  getSignificanceBadgeClasses,
  getRelationshipBadgeClasses,
} from "./utils";

interface InteractionCardProps {
  interaction: CharacterInteraction;
}

export default function InteractionCard({ interaction }: InteractionCardProps) {
  return (
    <div className="p-4 rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50">
      <div className="flex justify-between items-start">
        <h3 className="font-bold text-lg">
          {interaction.character1} & {interaction.character2}
        </h3>
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSignificanceBadgeClasses(
            interaction.significance
          )}`}
        >
          Significance: {interaction.significance}/10
        </span>
      </div>
      <p className="mt-2">{interaction.relationship}</p>
      <div className="mt-2">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRelationshipBadgeClasses(
            interaction.nature
          )}`}
        >
          {interaction.nature}
        </span>
      </div>
    </div>
  );
}
