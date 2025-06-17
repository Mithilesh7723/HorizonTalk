import { GoogleSpeechService } from "@/lib/speech-recognition"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const audioFile = formData.get("audio") as File

    if (!audioFile) {
      return Response.json({ error: "No audio file provided" }, { status: 400 })
    }

    const apiKey = process.env.GOOGLE_CLOUD_API_KEY
    if (!apiKey) {
      return Response.json({ error: "Google Cloud API key not configured" }, { status: 500 })
    }

    const speechService = new GoogleSpeechService(apiKey)
    const transcript = await speechService.transcribeAudio(audioFile)

    return Response.json({ transcript })
  } catch (error) {
    console.error("Transcription error:", error)
    return Response.json({ error: "Failed to transcribe audio" }, { status: 500 })
  }
}
