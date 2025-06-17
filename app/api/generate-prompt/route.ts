import { google } from "@ai-sdk/google"
import { generateObject } from "ai"
import { z } from "zod"

const PromptSchema = z.object({
  title: z.string(),
  description: z.string(),
  vocabulary: z.array(z.string()).length(5),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  category: z.string(),
  tips: z.array(z.string()).max(3),
})

export async function POST(req: Request) {
  try {
    const { category = "general", difficulty = "intermediate" } = await req.json()

    const result = await generateObject({
      model: google("gemini-1.5-flash"),
      schema: PromptSchema,
      prompt: `Generate a speaking practice prompt for English learners:

CATEGORY: ${category}
DIFFICULTY: ${difficulty}

Create an engaging speaking prompt that:
1. Is appropriate for ${difficulty} level English learners
2. Relates to ${category} topics
3. Encourages 1-3 minutes of speaking
4. Includes 5 target vocabulary words to use
5. Provides 2-3 helpful tips for answering

Make it interesting and practical for real-world English communication.`,
    })

    return Response.json(result.object)
  } catch (error) {
    console.error("Prompt generation error:", error)
    return Response.json({ error: "Failed to generate prompt" }, { status: 500 })
  }
}
