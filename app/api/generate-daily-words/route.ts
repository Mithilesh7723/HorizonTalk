import { google } from "@ai-sdk/google"
import { generateObject } from "ai"
import { z } from "zod"

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
    )
    .length(10),
})

export async function POST(req: Request) {
  try {
    const { count = 10 } = await req.json()

    const result = await generateObject({
      model: google("gemini-1.5-flash", {
        apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
      }),
      schema: DailyWordsSchema,
      prompt: `Generate ${count} diverse English vocabulary words for daily learning. Include a mix of difficulty levels and categories.

Requirements:
- Mix of beginner (30%), intermediate (50%), and advanced (20%) words
- Diverse categories: business, academic, general, technology, science, arts, travel, etc.
- Clear, concise definitions
- Natural example sentences that show proper usage
- Phonetic pronunciation guide (e.g., /prəˌnʌnsiˈeɪʃən/)
- Words should be useful for English learners
- Avoid overly technical or obscure terms
- Focus on words that improve communication skills

Make the words engaging and practical for everyday English usage.`,
    })

    return Response.json(result.object)
  } catch (error) {
    console.error("Daily words generation error:", error)
    return Response.json({ error: "Failed to generate daily words" }, { status: 500 })
  }
}
