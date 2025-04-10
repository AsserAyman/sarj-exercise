import { SimulationNodeDatum } from "d3-force";
import { Character, CharacterInteraction } from "@/api/types";

export interface SimulationNode extends SimulationNodeDatum {
  id: string;
  x?: number;
  y?: number;
}

export interface CharacterNodeProps {
  data: {
    character: Character;
  };
}

export interface FlowProps {
  characters: Character[];
  interactions: CharacterInteraction[];
}

export interface CharacterGraphProps {
  characters: Character[];
  interactions: CharacterInteraction[];
}

export interface ImportanceStyleMap {
  [key: string]: string;
}
