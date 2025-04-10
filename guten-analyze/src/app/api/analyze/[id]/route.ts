import { NextResponse } from "next/server";
import { fetchBookMetadata } from "./metadata";
import { fetchBookText } from "./text";
import { analyzeBook } from "./analysis";

/**
 * API route handler for /api/analyze/[id]
 * Fetches and analyzes a book from Project Gutenberg
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: bookId } = await params;

  try {
    const [metadata, text] = await Promise.all([
      fetchBookMetadata(bookId),
      fetchBookText(bookId),
    ]);

    const analysis = await analyzeBook(text, metadata.title);

    return NextResponse.json({
      metadata,
      text,
      characters: analysis.characters,
      interactions: analysis.interactions,
    });
  } catch (error) {
    console.error("Error processing book:", error);
    return NextResponse.json(
      {
        error: `Failed to process book: ${
          error instanceof Error ? error.message : String(error)
        }`,
      },
      { status: 500 }
    );
  }
}
