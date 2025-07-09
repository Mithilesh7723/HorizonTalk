import { google } from "@ai-sdk/google"
import { generateObject } from "ai"
import { z } from "zod"

// Update this function for your database logic
async function getRecentUserWords(userId: string, limit: number): Promise<string[]> {
  // TODO: Implement logic to fetch recent words for the user from your database.
  // Return an array of lowercase word strings (e.g. ["apple", "run", ...])
  return [];
}

const DailyWordsSchema = z.object({
  words: z
    .array(
      z.object({
        word: z.string(),
        definition: z.string(),
        example: z.string(),
        pronunciation: z.string(),
        difficulty: z.enum(["beginner", "intermediate", "advanced"]),
        category: z.string(),
      }),
    ),
})

export async function POST(req: Request) {
  try {
    const { count = 10, userId } = await req.json()

    // 1. Fetch user's recent words (optional but recommended for "newness")
    let previousWords: string[] = []
    if (userId) {
      previousWords = await getRecentUserWords(userId, 50)
    }
    const previousWordList = previousWords.join(", ")

    // 2. Prompt Gemini with exclusions
    const prompt = `Generate ${count} diverse English vocabulary words for daily learning. 
${previousWords.length > 0 ? `Do NOT include any of these words: ${previousWordList}` : ""}
Include a mix of difficulty levels and categories.

Requirements:
- Mix of beginner (30%), intermediate (50%), and advanced (20%) words
- Diverse categories: business, academic, general, technology, science, arts, travel, etc.
- Clear, concise definitions
- Natural example sentences that show proper usage
- Phonetic pronunciation guide (e.g., /prəˌnʌnsiˈeɪʃən/)
- Words should be useful for English learners
- Avoid overly technical or obscure terms
- Focus on words that improve communication skills

Make the words engaging and practical for everyday English usage.`

    // 3. Generate with Gemini
    const result = await generateObject({
      model: google("gemini-1.5-flash", {
        apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
      }),
      schema: DailyWordsSchema,
      prompt,
    })
    console.log("Gemini raw result:", result);

    // 4. Filter out any accidental repeats (safety net)
    let words = result.object.words
    if (previousWords.length > 0) {
      words = words.filter(w => !previousWords.includes(w.word.toLowerCase()))
    }

    return Response.json({ words })
  } catch (error) {
    console.error("Daily words generation error:", error)
    return Response.json({ error: "Failed to generate daily words" }, { status: 500 })
  }
}
