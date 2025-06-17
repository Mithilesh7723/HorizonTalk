"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Mic, MicOff, Square, Brain, Volume2, Wifi, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth-provider"
import { UserService } from "@/lib/user-service"
import { BrowserSpeechRecognition, BrowserTextToSpeech } from "@/lib/speech-recognition"

interface PracticePrompt {
  id: string
  title: string
  vocabulary: string[]
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  category: string
}

export function PracticePage() {
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [interimTranscript, setInterimTranscript] = useState("")
  const [feedback, setFeedback] = useState<any>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [speechSupported, setSpeechSupported] = useState(false)
  const [selectedPromptId, setSelectedPromptId] = useState<string>("")

  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const speechRecognitionRef = useRef<BrowserSpeechRecognition | null>(null)
  const textToSpeechRef = useRef<BrowserTextToSpeech | null>(null)

  const { toast } = useToast()
  const { user } = useAuth()

  const dailyPrompts: PracticePrompt[] = [
    {
      id: "vacation-destination",
      title: "Describe your ideal vacation destination",
      vocabulary: ["picturesque", "serene", "adventurous", "cultural", "breathtaking"],
      difficulty: "Intermediate",
      category: "travel",
    },
    {
      id: "teamwork-workplace",
      title: "Explain the importance of teamwork in the workplace",
      vocabulary: ["collaboration", "synergy", "productivity", "communication", "efficiency"],
      difficulty: "Advanced",
      category: "business",
    },
    {
      id: "favorite-hobby",
      title: "Talk about your favorite hobby and why you enjoy it",
      vocabulary: ["passionate", "fulfilling", "relaxing", "challenging", "rewarding"],
      difficulty: "Beginner",
      category: "personal",
    },
    {
      id: "learning-language",
      title: "Discuss the benefits of learning a new language",
      vocabulary: ["fluency", "immersive", "articulate", "comprehension", "multilingual"],
      difficulty: "Intermediate",
      category: "education",
    },
    {
      id: "childhood-memory",
      title: "Describe a memorable experience from your childhood",
      vocabulary: ["nostalgic", "vivid", "cherished", "formative", "reminisce"],
      difficulty: "Advanced",
      category: "personal",
    },
  ]

  // Set default selected prompt
  useEffect(() => {
    if (!selectedPromptId && dailyPrompts.length > 0) {
      setSelectedPromptId(dailyPrompts[0].id)
    }
  }, [selectedPromptId])

  const selectedPrompt = dailyPrompts.find((prompt) => prompt.id === selectedPromptId) || dailyPrompts[0]

  useEffect(() => {
    // Initialize speech services
    speechRecognitionRef.current = new BrowserSpeechRecognition()
    textToSpeechRef.current = new BrowserTextToSpeech()

    setSpeechSupported(speechRecognitionRef.current.isAvailable())

    if (!speechRecognitionRef.current.isAvailable()) {
      toast({
        title: "Speech Recognition Unavailable",
        description: "Your browser doesn't support speech recognition. You can still type your responses.",
        variant: "destructive",
      })
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.stopRecognition()
      }
      if (textToSpeechRef.current) {
        textToSpeechRef.current.stop()
      }
    }
  }, [])

  const handlePromptSelection = (promptId: string) => {
    setSelectedPromptId(promptId)
    // Reset any ongoing recording or feedback
    if (isRecording) {
      stopRecording()
    }
    setTranscript("")
    setInterimTranscript("")
    setFeedback(null)
  }

  const startRecording = async () => {
    if (!speechRecognitionRef.current?.isAvailable()) {
      toast({
        title: "Speech Recognition Not Available",
        description: "Please type your response in the text area below",
        variant: "destructive",
      })
      return
    }

    setIsRecording(true)
    setRecordingTime(0)
    setTranscript("")
    setInterimTranscript("")

    // Start timer
    timerRef.current = setInterval(() => {
      setRecordingTime((prev) => prev + 1)
    }, 1000)

    // Start speech recognition
    speechRecognitionRef.current.startRecognition(
      (text, isFinal) => {
        if (isFinal) {
          setTranscript((prev) => {
            const newTranscript = prev + (prev ? " " : "") + text
            return newTranscript
          })
          setInterimTranscript("")

          // Restart recognition to continue listening
          if (isRecording) {
            setTimeout(() => {
              if (speechRecognitionRef.current && isRecording) {
                speechRecognitionRef.current.restartRecognition(
                  (text, isFinal) => {
                    if (isFinal) {
                      setTranscript((prev) => prev + (prev ? " " : "") + text)
                      setInterimTranscript("")
                    } else {
                      setInterimTranscript(text)
                    }
                  },
                  (error) => {
                    console.error("Speech recognition error:", error)
                  },
                )
              }
            }, 100)
          }
        } else {
          setInterimTranscript(text)
        }
      },
      (error) => {
        console.error("Speech recognition error:", error)
        toast({
          title: "Speech Recognition Error",
          description: "There was an issue with speech recognition. You can continue typing.",
          variant: "destructive",
        })
      },
      () => {
        // On end - restart if still recording
        if (isRecording) {
          setTimeout(() => {
            if (speechRecognitionRef.current && isRecording) {
              speechRecognitionRef.current.restartRecognition(
                (text, isFinal) => {
                  if (isFinal) {
                    setTranscript((prev) => prev + (prev ? " " : "") + text)
                    setInterimTranscript("")
                  } else {
                    setInterimTranscript(text)
                  }
                },
                (error) => {
                  console.error("Speech recognition error:", error)
                },
              )
            }
          }, 100)
        }
      },
    )

    toast({
      title: "Recording started",
      description: "Start speaking! Your words will appear below in real-time.",
    })
  }

  const stopRecording = () => {
    setIsRecording(false)

    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    if (speechRecognitionRef.current) {
      speechRecognitionRef.current.stopRecognition()
    }

    // Add any remaining interim transcript to final transcript
    if (interimTranscript) {
      setTranscript((prev) => prev + (prev ? " " : "") + interimTranscript)
      setInterimTranscript("")
    }

    toast({
      title: "Recording stopped",
      description: "Great job! Now get your AI feedback.",
    })
  }

  const analyzeTranscript = async () => {
    const finalTranscript = transcript.trim()

    if (!finalTranscript) {
      toast({
        title: "No speech detected",
        description: "Please record some speech or type your response first.",
        variant: "destructive",
      })
      return
    }

    setIsAnalyzing(true)

    try {
      // Analyze with Gemini API
      const response = await fetch("/api/analyze-speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transcript: finalTranscript,
          prompt: selectedPrompt.title,
        }),
      })

      if (!response.ok) {
        throw new Error("Analysis failed")
      }

      const feedbackData = await response.json()
      setFeedback(feedbackData)

      // Save session to Firebase Realtime Database
      if (user) {
        const session = {
          userId: user.uid,
          prompt: selectedPrompt.title,
          transcript: finalTranscript,
          feedback: feedbackData,
          createdAt: Date.now(),
          duration: recordingTime,
        }

        await UserService.savePracticeSession(session)

        // Update user stats
        const stats = await UserService.getUserProfile(user.uid)
        if (stats) {
          await UserService.updateUserProfile(user.uid, {
            totalSessions: (stats.totalSessions || 0) + 1,
            speakingTime: (stats.speakingTime || 0) + Math.floor(recordingTime / 60),
            fluencyScore: Math.round(((stats.fluencyScore || 0) + feedbackData.fluencyScore) / 2),
          })
        }
      }

      toast({
        title: "Analysis complete!",
        description: "Your personalized AI feedback is ready below.",
      })
    } catch (error) {
      console.error("Analysis error:", error)
      toast({
        title: "Analysis failed",
        description: "Please try again or check your internet connection.",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const playPronunciation = (word: string) => {
    if (textToSpeechRef.current?.isAvailable()) {
      textToSpeechRef.current.speak(word, { rate: 0.8 })
    } else {
      toast({
        title: "Text-to-Speech Unavailable",
        description: "Your browser doesn't support text-to-speech",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Speaking Practice</h1>
        <p className="text-gray-600">Practice speaking with real-time AI transcription and feedback</p>
      </div>

      {/* Browser Support Status */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {speechSupported ? (
                <>
                  <Wifi className="h-5 w-5 text-green-600" />
                  <span className="text-green-700 font-medium">Speech Recognition: Available</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                  <span className="text-orange-700 font-medium">Speech Recognition: Not Supported</span>
                </>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {textToSpeechRef.current?.isAvailable() ? (
                <>
                  <Volume2 className="h-5 w-5 text-green-600" />
                  <span className="text-green-700 font-medium">Text-to-Speech: Available</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                  <span className="text-orange-700 font-medium">Text-to-Speech: Not Supported</span>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Prompt Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Choose Your Practice Topic</CardTitle>
          <CardDescription>Select a prompt to practice speaking</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {dailyPrompts.map((prompt) => (
              <div
                key={prompt.id}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedPromptId === prompt.id
                    ? "border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 shadow-md ring-2 ring-blue-200"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
                onClick={() => handlePromptSelection(prompt.id)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className={`font-medium ${selectedPromptId === prompt.id ? "text-blue-900" : "text-gray-900"}`}>
                    {prompt.title}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={
                        prompt.difficulty === "Beginner"
                          ? "secondary"
                          : prompt.difficulty === "Intermediate"
                            ? "default"
                            : "destructive"
                      }
                    >
                      {prompt.difficulty}
                    </Badge>
                    {selectedPromptId === prompt.id && (
                      <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {prompt.vocabulary.map((word, wordIndex) => (
                    <Badge
                      key={wordIndex}
                      variant="outline"
                      className={`text-xs ${
                        selectedPromptId === prompt.id
                          ? "border-blue-300 text-blue-700 bg-blue-50"
                          : "border-gray-300 text-gray-600"
                      }`}
                    >
                      {word}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recording Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Mic className="h-5 w-5" />
              <span>Record Your Response</span>
            </CardTitle>
            <CardDescription>
              {speechSupported
                ? "Speak naturally - your words will appear in real-time below"
                : "Speech recognition not available - please type your response"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="w-32 h-32 mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4">
                {isRecording ? (
                  <div className="w-16 h-16 bg-red-500 rounded-full animate-pulse flex items-center justify-center">
                    <MicOff className="h-8 w-8 text-white" />
                  </div>
                ) : (
                  <Mic className="h-16 w-16 text-white" />
                )}
              </div>

              {isRecording && <div className="text-2xl font-mono text-red-600 mb-2">{formatTime(recordingTime)}</div>}

              <div className="space-y-2">
                {speechSupported ? (
                  !isRecording ? (
                    <Button onClick={startRecording} size="lg" className="w-full">
                      <Mic className="mr-2 h-4 w-4" />
                      Start Speaking
                    </Button>
                  ) : (
                    <Button onClick={stopRecording} size="lg" variant="destructive" className="w-full">
                      <Square className="mr-2 h-4 w-4" />
                      Stop Recording
                    </Button>
                  )
                ) : (
                  <div className="text-sm text-gray-600 p-4 bg-gray-50 rounded-lg">
                    Speech recognition is not available in your browser. Please type your response in the text area
                    below.
                  </div>
                )}

                {(transcript || !speechSupported) && (
                  <Button onClick={analyzeTranscript} disabled={isAnalyzing} className="w-full">
                    {isAnalyzing ? (
                      <>
                        <Brain className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing with AI...
                      </>
                    ) : (
                      <>
                        <Brain className="mr-2 h-4 w-4" />
                        Get AI Feedback
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Prompt */}
        <Card>
          <CardHeader>
            <CardTitle>Your Topic</CardTitle>
            <CardDescription>Use the vocabulary words in your response</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
              <h3 className="font-medium text-blue-900 mb-2">{selectedPrompt.title}</h3>
              <p className="text-sm text-blue-700">
                Try to speak for 1-3 minutes and incorporate the vocabulary words below.
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Target Vocabulary:</h4>
              <div className="grid grid-cols-1 gap-2">
                {selectedPrompt.vocabulary.map((word, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="font-medium">{word}</span>
                    <Button size="sm" variant="ghost" onClick={() => playPronunciation(word)}>
                      <Volume2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Transcript */}
      <Card>
        <CardHeader>
          <CardTitle>Your Response</CardTitle>
          <CardDescription>
            {speechSupported
              ? "Real-time transcription of your speech (you can also edit manually)"
              : "Type your response here"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={transcript + (interimTranscript ? ` ${interimTranscript}` : "")}
            onChange={(e) => setTranscript(e.target.value)}
            className="min-h-[150px]"
            placeholder={
              speechSupported
                ? "Your speech will appear here in real-time as you speak..."
                : "Type your response to the prompt above..."
            }
          />
          {interimTranscript && speechSupported && (
            <p className="text-sm text-blue-600 mt-2 italic">Currently speaking: "{interimTranscript}"</p>
          )}
          <p className="text-xs text-gray-500 mt-2">
            Word count: {transcript.split(" ").filter((word) => word.length > 0).length}
          </p>
        </CardContent>
      </Card>

      {/* AI Feedback */}
      {feedback && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-blue-600" />
              <span>AI Feedback & Analysis</span>
            </CardTitle>
            <CardDescription>Personalized insights powered by Google Gemini</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Scores */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{feedback.fluencyScore}%</div>
                <div className="text-sm text-green-700">Fluency Score</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{feedback.grammarScore}%</div>
                <div className="text-sm text-blue-700">Grammar Score</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{feedback.vocabularyUsage}/5</div>
                <div className="text-sm text-purple-700">Vocabulary Used</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{feedback.fillerWords}</div>
                <div className="text-sm text-orange-700">Filler Words</div>
              </div>
            </div>

            {/* Suggestions */}
            <div>
              <h4 className="font-medium mb-3">💡 Improvement Suggestions:</h4>
              <div className="space-y-2">
                {feedback.suggestions.map((suggestion: string, index: number) => (
                  <div key={index} className="flex items-start space-x-2 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm">{suggestion}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Vocabulary Suggestions */}
            <div>
              <h4 className="font-medium mb-3">📚 New Vocabulary to Learn:</h4>
              <div className="grid gap-3">
                {feedback.improvedVocabulary.map((vocab: any, index: number) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-blue-600">{vocab.word}</span>
                      <Button size="sm" variant="ghost" onClick={() => playPronunciation(vocab.word)}>
                        <Volume2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{vocab.definition}</p>
                    <p className="text-sm text-gray-500 italic">Example: {vocab.example}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
