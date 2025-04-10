import { BASE_URL } from "@/api/constants";
import { BookMetadata } from "@/api/types";

/**
 * Fetches and extracts book metadata from Gutenberg
 */
export async function fetchBookMetadata(bookId: string): Promise<BookMetadata> {
  const response = await fetch(`${BASE_URL}/ebooks/${bookId}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch book metadata: ${response.statusText}`);
  }

  const html = await response.text();

  const title = html.match(/<title>(.+?)<\/title>/)?.[1] || "Unknown Title";
  const author = html.match(/by (.+?)<\/h1>/)?.[1] || "Unknown Author";

  const summary = extractSummary(html);

  return {
    id: bookId,
    title,
    author,
    url: `${BASE_URL}/ebooks/${bookId}`,
    summary,
  };
}

/**
 * Extracts book summary from HTML content
 */
function extractSummary(html: string): string {
  let summary = "No summary available for this book.";

  const summaryMatch = html.match(
    /<div class="summary-text-container">([\s\S]+?)<\/div>/
  );

  if (summaryMatch && summaryMatch[1]) {
    const fullSummaryHtml = summaryMatch[1];

    // Extract visible text and hidden text (inside toggle-content)
    const visibleTextMatch = fullSummaryHtml.match(
      /<!-- Always visible content -->\s*([\s\S]+?)<!-- Hidden checkbox/
    );
    const hiddenTextMatch = fullSummaryHtml.match(
      /<span class="toggle-content">\s*([\s\S]+?)<\/span>\s*<!-- Clickable label to show less/
    );

    if (visibleTextMatch && visibleTextMatch[1]) {
      let summaryText = visibleTextMatch[1].trim();

      // Append hidden text if available
      if (hiddenTextMatch && hiddenTextMatch[1]) {
        summaryText += " " + hiddenTextMatch[1].trim();
      }

      summary = cleanHtmlText(summaryText);
    }
  }

  // Try bibrec-desc div if no summary container found (older format)
  if (summary === "No summary available for this book.") {
    const descriptionMatch = html.match(
      /<div class="bibrec-desc">([\s\S]+?)<\/div>/
    );
    if (descriptionMatch && descriptionMatch[1]) {
      summary = cleanHtmlText(descriptionMatch[1]);
    }
  }

  return summary;
}

/**
 * Cleans HTML text by removing tags and formatting
 */
function cleanHtmlText(text: string): string {
  return text
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .replace(/\s+/g, " ") // Replace multiple spaces with a single space
    .replace(/\(This is an automatically generated summary\.\)/, "") // Remove generation note
    .replace(/^["']|["']$/g, "") // Remove quotes at beginning and end
    .trim();
}
