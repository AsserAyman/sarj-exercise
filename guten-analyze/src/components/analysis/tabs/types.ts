import { Character, CharacterInteraction } from "@/api/types";
import React from "react";

export type TabType = "book" | "characters" | "interactions" | "graph";

export interface TabButtonProps {
  isActive: boolean;
  onClick: () => void;
  disabled?: boolean;
  icon: React.ReactNode;
  label: string;
}

export interface BookTabsProps {
  text: string | null;
  characters: Character[];
  interactions: CharacterInteraction[];
}

export interface TabContentProps {
  text: string | null;
  characters: Character[];
  interactions: CharacterInteraction[];
  activeTab: TabType;
}
