// Browser-based Speech Recognition (Primary Method - 100% Free)
export class BrowserSpeechRecognition {
  private recognition: any = null
  private isSupported = false
  private isListening = false

  constructor() {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition()
        this.isSupported = true
        this.setupRecognition()
      }
    }
  }

  private setupRecognition() {
    if (!this.recognition) return

    this.recognition.continuous = true
    this.recognition.interimResults = true
    this.recognition.lang = "en-US"
    this.recognition.maxAlternatives = 1
  }

  isAvailable(): boolean {
    return this.isSupported
  }

  isCurrentlyListening(): boolean {
    return this.isListening
  }

  startRecognition(
    onResult: (transcript: string, isFinal: boolean) => void,
    onError: (error: string) => void,
    onEnd?: () => void,
  ): void {
    if (!this.recognition) {
      onError("Speech recognition not supported in this browser")
      return
    }

    if (this.isListening) {
      return // Already listening
    }

    this.recognition.onresult = (event: any) => {
      let finalTranscript = ""
      let interimTranscript = ""

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcript
        } else {
          interimTranscript += transcript
        }
      }

      if (finalTranscript) {
        onResult(finalTranscript, true)
      }
      if (interimTranscript) {
        onResult(interimTranscript, false)
      }
    }

    this.recognition.onerror = (event: any) => {
      this.isListening = false
      onError(`Speech recognition error: ${event.error}`)
    }

    this.recognition.onend = () => {
      this.isListening = false
      if (onEnd) onEnd()
    }

    this.recognition.onstart = () => {
      this.isListening = true
    }

    try {
      this.recognition.start()
    } catch (error) {
      this.isListening = false
      onError("Failed to start speech recognition")
    }
  }

  stopRecognition(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop()
      this.isListening = false
    }
  }

  restartRecognition(
    onResult: (transcript: string, isFinal: boolean) => void,
    onError: (error: string) => void,
    onEnd?: () => void,
  ): void {
    this.stopRecognition()
    setTimeout(() => {
      this.startRecognition(onResult, onError, onEnd)
    }, 100)
  }
}

// Text-to-Speech using browser API (100% Free)
export class BrowserTextToSpeech {
  private synth: SpeechSynthesis | null = null
  private voices: SpeechSynthesisVoice[] = []

  constructor() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      this.synth = window.speechSynthesis
      this.loadVoices()
    }
  }

  private loadVoices() {
    if (!this.synth) return

    this.voices = this.synth.getVoices()

    // If voices aren't loaded yet, wait for the event
    if (this.voices.length === 0) {
      this.synth.onvoiceschanged = () => {
        this.voices = this.synth!.getVoices()
      }
    }
  }

  isAvailable(): boolean {
    return this.synth !== null
  }

  speak(text: string, options: { rate?: number; pitch?: number; volume?: number } = {}): void {
    if (!this.synth) return

    // Stop any current speech
    this.synth.cancel()

    const utterance = new SpeechSynthesisUtterance(text)

    // Find English voice
    const englishVoice =
      this.voices.find((voice) => voice.lang.startsWith("en") && voice.name.includes("Google")) ||
      this.voices.find((voice) => voice.lang.startsWith("en"))

    if (englishVoice) {
      utterance.voice = englishVoice
    }

    utterance.rate = options.rate || 0.8
    utterance.pitch = options.pitch || 1
    utterance.volume = options.volume || 1
    utterance.lang = "en-US"

    this.synth.speak(utterance)
  }

  stop(): void {
    if (this.synth) {
      this.synth.cancel()
    }
  }
}
