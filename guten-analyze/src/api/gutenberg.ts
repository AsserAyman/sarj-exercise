import { BookMetadata } from "./types";

/**
 * Fetches book metadata from our API proxy to Gutenberg
 */
export async function fetchBookMetadata(bookId: string): Promise<BookMetadata> {
  const response = await fetch(`/api/metadata/${bookId}`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.error || `Failed to fetch book metadata: ${response.statusText}`
    );
  }

  return await response.json();
}

/**
 * Fetches book text content from our API proxy to Gutenberg
 */
export async function fetchBookText(bookId: string): Promise<string> {
  const response = await fetch(`/api/text/${bookId}`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.error || `Failed to fetch book text: ${response.statusText}`
    );
  }

  const data = await response.json();
  return data.text;
}
