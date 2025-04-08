import { NextResponse } from "next/server";
import { BASE_URL } from "@/api/constants";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const bookId = params.id;

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

    return NextResponse.json({
      id: bookId,
      title,
      author,
      url: `${BASE_URL}/ebooks/${bookId}`,
    });
  } catch (error) {
    console.error("Error fetching book metadata:", error);
    return NextResponse.json(
      { error: "Failed to fetch book metadata" },
      { status: 500 }
    );
  }
}
