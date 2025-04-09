import { BASE_URL } from "@/api/constants";

/**
 * Fetches book text content from Gutenberg
 * Tries multiple URL formats to find the text
 */
export async function fetchBookText(bookId: string): Promise<string> {
  // Try primary URL format
  const primaryResponse = await fetch(
    `${BASE_URL}/files/${bookId}/${bookId}.txt`
  );
  if (primaryResponse.ok) {
    return await primaryResponse.text();
  }

  // Try alternative URL format as it's first always available
  const alternativeResponse = await fetch(
    `${BASE_URL}/cache/epub/${bookId}/pg${bookId}.txt`
  );
  if (alternativeResponse.ok) {
    return await alternativeResponse.text();
  }

  throw new Error("Failed to fetch book text. Text format not available.");
}
