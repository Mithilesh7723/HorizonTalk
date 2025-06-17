import { google } from "@ai-sdk/google"
import { generateObject } from "ai"
import { z } from "zod"

const WordDetailsSchema = z.object({
  word: z.string(),
  definition: z.string(),
  example: z.string(),
  pronunciation: z.string(),
})

export async function POST(req: Request) {
  try {
    const { word, category, difficulty } = await req.json()

    if (!word) {
      return Response.json({ error: "Word is required" }, { status: 400 })
    }

    const result = await generateObject({
      model: google("gemini-1.5-flash", {
        apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
      }),
      schema: WordDetailsSchema,
      prompt: `Generate detailed information for the English word: "${word}"

Category: ${category}
Difficulty Level: ${difficulty}

Provide:
1. The word (exactly as provided, corrected if misspelled)
2. A clear, concise definition appropriate for ${difficulty} level learners
3. A natural example sentence showing proper usage in context
4. Phonetic pronunciation guide (e.g., /prəˌnʌnsiˈeɪʃən/)

Make sure the definition and example are appropriate for the ${category} category and ${difficulty} difficulty level.`,
    })

    return Response.json(result.object)
  } catch (error) {
    console.error("Word details generation error:", error)
    return Response.json({ error: "Failed to generate word details" }, { status: 500 })
  }
}
