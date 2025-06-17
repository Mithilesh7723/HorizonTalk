import { google } from "@ai-sdk/google"
import { generateObject } from "ai"
import { z } from "zod"

const FeedbackSchema = z.object({
  fluencyScore: z.number().min(0).max(100),
  grammarScore: z.number().min(0).max(100),
  vocabularyUsage: z.number().min(0).max(5),
  fillerWords: z.number().min(0),
  suggestions: z.array(z.string()).max(5),
  improvedVocabulary: z
    .array(
      z.object({
        word: z.string(),
        definition: z.string(),
        example: z.string(),
      }),
    )
    .max(5),
})

export async function POST(req: Request) {
  try {
    const { transcript, prompt } = await req.json()

    if (!transcript || !prompt) {
      return Response.json({ error: "Missing transcript or prompt" }, { status: 400 })
    }

    const result = await generateObject({
      model: google("gemini-1.5-flash", {
        apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
      }),
      schema: FeedbackSchema,
      prompt: `Analyze this English speech transcript and provide detailed feedback:

ORIGINAL PROMPT: "${prompt}"

TRANSCRIPT: "${transcript}"

Please provide:
1. Fluency score (0-100) - How smoothly and naturally they spoke
2. Grammar score (0-100) - Correctness of grammar usage
3. Vocabulary usage (0-5) - How many target vocabulary words they used effectively
4. Filler words count - Number of "um", "uh", "like", etc.
5. 3-5 specific improvement suggestions
6. 3-5 advanced vocabulary words they could learn with definitions and examples

Be encouraging and constructive in your feedback. Focus on specific improvements they can make.`,
    })

    return Response.json(result.object)
  } catch (error) {
    console.error("Speech analysis error:", error)
    return Response.json({ error: "Failed to analyze speech" }, { status: 500 })
  }
}
