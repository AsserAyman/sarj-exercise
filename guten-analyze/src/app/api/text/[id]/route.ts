import { NextResponse } from "next/server";
import { BASE_URL } from "@/api/constants";

// Disable SSL certificate verification as gutenberg certificate is expired
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: bookId } = await params;

  try {
    const response = await fetch(`${BASE_URL}/files/${bookId}/${bookId}.txt`);

    if (response.ok) {
      const text = await response.text();
      return NextResponse.json({ text });
    }

    // If the first attempt fails, we could try an alternative URL format
    const alternativeResponse = await fetch(
      `${BASE_URL}/cache/epub/${bookId}/pg${bookId}.txt`
    );

    if (alternativeResponse.ok) {
      const text = await alternativeResponse.text();
      return NextResponse.json({ text });
    }

    return NextResponse.json(
      { error: "Failed to fetch book text. Text format not available." },
      { status: 404 }
    );
  } catch (error) {
    console.error("Error fetching book text:", error);
    return NextResponse.json(
      {
        error:
          "Failed to fetch book text. Please check if the book ID is valid.",
      },
      { status: 500 }
    );
  }
}
