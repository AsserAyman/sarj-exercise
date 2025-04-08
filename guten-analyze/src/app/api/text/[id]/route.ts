import { NextResponse } from "next/server";
import { BASE_URL } from "@/api/constants";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Await params before accessing properties
  const { id: bookId } = await params;

  try {
    const response = await fetch(`${BASE_URL}/files/${bookId}/${bookId}.txt`);

    if (response.ok) {
      const text = await response.text();
      return NextResponse.json({ text });
    }

    // If the first attempt fails, we could try an alternative URL format
    // Uncomment if needed:
    // const alternativeResponse = await fetch(
    //   `${BASE_URL}/cache/epub/${bookId}/pg${bookId}.txt`
    // );
    //
    // if (alternativeResponse.ok) {
    //   const text = await alternativeResponse.text();
    //   return NextResponse.json({ text });
    // }

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
