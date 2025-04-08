export interface BookMetadata {
  id: string;
  title: string;
  author: string;
  url: string;
}

export interface BookData {
  metadata: BookMetadata | null;
  text: string | null;
}

export interface Character {
  name: string;
  aliases: string[];
  description: string;
  importance: "main" | "secondary" | "minor";
}

export interface CharacterInteraction {
  character1: string;
  character2: string;
  relationship: string;
  nature: string;
  significance: number;
}
