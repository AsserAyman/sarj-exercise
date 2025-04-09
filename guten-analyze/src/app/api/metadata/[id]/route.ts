import { NextResponse } from "next/server";
import { BASE_URL } from "@/api/constants";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Await params before accessing properties
  const { id: bookId } = await params;

  try {
    const response = await fetch(`${BASE_URL}/ebooks/${bookId}`);

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch book metadata: ${response.statusText}` },
        { status: response.status }
      );
    }

    const html = await response.text();

    // Extract basic metadata from HTML response
    const title = html.match(/<title>(.+?)<\/title>/)?.[1] || "Unknown Title";
    const author = html.match(/by (.+?)<\/h1>/)?.[1] || "Unknown Author";

    // Extract summary from Gutenberg page
    let summary = "No summary available for this book.";

    // Try to find the summary in the summary-text-container
    const summaryMatch = html.match(
      /<div class="summary-text-container">([\s\S]+?)<\/div>/
    );
    if (summaryMatch && summaryMatch[1]) {
      // Extract all text content, including both visible and hidden parts
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

        // Clean up HTML tags and extra whitespace
        summary = summaryText
          .replace(/<[^>]*>/g, "") // Remove HTML tags
          .replace(/\s+/g, " ") // Replace multiple spaces with a single space
          .replace(/\(This is an automatically generated summary\.\)/, "") // Remove generation note
          .replace(/^["']|["']$/g, "") // Remove quotes at beginning and end
          .trim();
      }
    }

    // If no summary container found, try to extract from bibrec-desc div (older format)
    if (summary === "No summary available for this book.") {
      const descriptionMatch = html.match(
        /<div class="bibrec-desc">([\s\S]+?)<\/div>/
      );
      if (descriptionMatch && descriptionMatch[1]) {
        summary = descriptionMatch[1]
          .replace(/<[^>]*>/g, "") // Remove HTML tags
          .replace(/\s+/g, " ") // Replace multiple spaces with a single space
          .trim();
      }
    }

    return NextResponse.json({
      id: bookId,
      title,
      author,
      url: `${BASE_URL}/ebooks/${bookId}`,
      summary,
    });
  } catch (error) {
    console.error("Error fetching book metadata:", error);
    return NextResponse.json(
      { error: "Failed to fetch book metadata" },
      { status: 500 }
    );
  }
}
