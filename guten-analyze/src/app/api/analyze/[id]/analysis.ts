import Groq from "groq-sdk";
import { Character, CharacterInteraction } from "@/api/types";

interface BookAnalysis {
  characters: Character[];
  interactions: CharacterInteraction[];
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "",
});

const MAX_TEXT_LENGTH = 20000;

/**
 * Analyzes book text using Groq LLM to extract characters and interactions
 */
export async function analyzeBook(
  text: string,
  title: string
): Promise<BookAnalysis> {
  // Limit text length to avoid token limits
  const truncatedText =
    text.length > MAX_TEXT_LENGTH ? text.slice(0, MAX_TEXT_LENGTH) : text;

  const prompt = createAnalysisPrompt(title, truncatedText);

  try {
    const response = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      temperature: 0.2,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("Empty response from LLM");
    }

    return JSON.parse(content);
  } catch (error) {
    console.error("Error analyzing book:", error);
    throw new Error(
      `Analysis failed: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

/**
 * Creates the prompt for book analysis
 */
function createAnalysisPrompt(title: string, text: string): string {
  return `
    Analyze the following text from the book "${title || "unknown"}":
    
    ${text}
    
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
}
