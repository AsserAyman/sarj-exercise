import { NextResponse } from "next/server";
import { BASE_URL } from "@/api/constants";
import Groq from "groq-sdk";

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "",
});

// Disable SSL certificate verification as gutenberg certificate is expired
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  // Ensure params is properly awaited before accessing id
  const resolvedParams = await params;
  const bookId = resolvedParams.id;

  try {
    // Step 1: Fetch book metadata
    const metadata = await fetchBookMetadata(bookId);

    // Step 2: Fetch book text
    const text = await fetchBookText(bookId);

    // Step 3: Analyze the book
    const analysis = await analyzeBook(text, metadata.title);

    // Return all data together
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
        error:
          "Failed to process book: " +
          (error instanceof Error ? error.message : String(error)),
      },
      { status: 500 }
    );
  }
}

async function fetchBookMetadata(bookId: string) {
  const response = await fetch(`${BASE_URL}/ebooks/${bookId}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch book metadata: ${response.statusText}`);
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

  return {
    id: bookId,
    title,
    author,
    url: `${BASE_URL}/ebooks/${bookId}`,
    summary,
  };
}

async function fetchBookText(bookId: string) {
  const response = await fetch(`${BASE_URL}/files/${bookId}/${bookId}.txt`);

  if (response.ok) {
    return await response.text();
  }

  // If the first attempt fails, we could try an alternative URL format
  const alternativeResponse = await fetch(
    `${BASE_URL}/cache/epub/${bookId}/pg${bookId}.txt`
  );

  if (alternativeResponse.ok) {
    return await alternativeResponse.text();
  }

  throw new Error("Failed to fetch book text. Text format not available.");
}

async function analyzeBook(text: string, title: string) {
  // Truncate text if it's too long (Groq has token limits)
  const truncatedText = text.slice(0, 20000);

  const prompt = `
    Analyze the following text from the book "${title || "unknown"}":
    
    ${truncatedText}
    
    Complete the following two tasks:
    
    TASK 1: Extract all main single characters from this novel text, skip any unknown characters (A gentleman, A Priest, etc..), skip the book introduction and other non-novel text. For each character provide:
    1. Full name
    2. Any aliases or nicknames 
    3. Brief description (1-2 sentences)
    4. Importance level (main, secondary, minor)
    
    TASK 2: Identify interactions between the characters. Avoid any duplicate interactions, for example if character A and character B interact, do not include character B and character A. For each pair of characters that interact, provide:
    1. The names of the two characters
    2. A brief description of their relationship (1-2 sentences)
    3. The nature of their interaction (allies, enemies, family, romantic, etc.)
    4. A significance score from 1-10 (10 being the most significant relationship in the book)
    
    Format the response as a JSON object with two properties: "characters" and "interactions".
    Example format:
    {
      "characters": [
        {
          "name": "Character Name",
          "aliases": ["nickname1", "nickname2"],
          "description": "Brief character description",
          "importance": "main"
        }
      ],
      "interactions": [
        {
          "character1": "Character Name 1",
          "character2": "Character Name 2",
          "relationship": "Brief description of their relationship",
          "nature": "allies", 
          "significance": 8
        }
      ]
    }
    
    Focus on identifying meaningful relationships between the main and secondary characters.
    Only return the JSON object, nothing else. Do not use markdown code blocks. Do not add any formatting.
  `;

  // Make API call using Groq SDK
  const response = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "meta-llama/llama-4-scout-17b-16e-instruct",
    temperature: 0.2,
  });

  // Extract and parse the response
  const content = response.choices[0].message.content;
  if (!content) {
    throw new Error("Empty response from LLM");
  }

  return JSON.parse(content);
}
