import { BookMetadata, Character, CharacterInteraction } from "./types";

/**
 * Analyzes a book by ID and returns all metadata, text, and analysis results
 */
export async function analyzeBook(bookId: string): Promise<{
  metadata: BookMetadata;
  text: string;
  characters: Character[];
  interactions: CharacterInteraction[];
}> {
  const response = await fetch(`/api/analyze/${bookId}`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.error || `Failed to analyze book: ${response.statusText}`
    );
  }

  return await response.json();
}
