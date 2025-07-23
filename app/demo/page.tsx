"use client"

import { useState, useEffect } from "react"
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Mic,
  MicOff,
  Volume2,
  Pause,
  BookOpen,
  TrendingUp,
  Award,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Target,
  Brain,
  MessageCircle,
  Play,
  BarChart3,
  Trophy,
  Zap,
  Activity,
} from "lucide-react"

const demoSteps = [
  {
    id: "welcome",
    title: "Welcome to HorizonTalk",
    subtitle: "AI-Powered English Learning Platform",
    icon: Sparkles,
    color: "from-blue-600 to-purple-600",
  },
  {
    id: "speech-practice",
    title: "Real-Time Speech Analysis",
    subtitle: "Record yourself and get instant AI feedback",
    icon: Mic,
    color: "from-red-500 to-pink-500",
  },
  {
    id: "ai-feedback",
    title: "AI Feedback Engine",
    subtitle: "Detailed analysis with improvement suggestions",
    icon: Brain,
    color: "from-green-500 to-emerald-500",
  },
  {
    id: "vocabulary",
    title: "Vocabulary Builder",
    subtitle: "Learn new words with pronunciation guides",
    icon: BookOpen,
    color: "from-purple-500 to-indigo-500",
  },
  {
    id: "progress",
    title: "Progress Tracking",
    subtitle: "Monitor your improvement over time",
    icon: TrendingUp,
    color: "from-orange-500 to-red-500",
  },
]

const mockFeedback = {
  fluencyScore: 85,
  grammarScore: 78,
  pronunciationScore: 92,
  suggestions: [
    "Try to reduce filler words like 'um' and 'uh'",
    "Consider using more varied vocabulary",
    "Great pronunciation of complex words!",
  ],
  transcript:
    "Hello, my name is Sarah and I'm excited to practice English with HorizonTalk. This platform seems really helpful for improving my speaking skills.",
}

const mockVocabulary = [
  {
    word: "Articulate",
    definition: "Having or showing the ability to speak fluently and coherently",
    example: "She was very articulate in expressing her thoughts during the presentation.",
    difficulty: "Advanced",
  },
  {
    word: "Eloquent",
    definition: "Fluent or persuasive in speaking or writing",
    example: "His eloquent speech moved the entire audience to tears.",
    difficulty: "Advanced",
  },
  {
    word: "Coherent",
    definition: "Logical and consistent; easy to understand",
    example: "Please provide a coherent explanation of your research findings.",
    difficulty: "Intermediate",
  },
]

// Sound wave animation component
const SoundWave = ({ isActive }: { isActive: boolean }) => {
  return (
    <div className="flex items-center justify-center space-x-1">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="w-1 bg-white rounded-full"
          animate={
            isActive
              ? {
                height: [4, 20, 4],
                opacity: [0.4, 1, 0.4],
              }
              : { height: 4, opacity: 0.4 }
          }
          transition={{
            duration: 0.8,
            repeat: isActive ? Number.POSITIVE_INFINITY : 0,
            delay: i * 0.1,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}

// Recording pulse animation
const RecordingPulse = () => {
  return (
    <div className="absolute inset-0 rounded-full">
      <motion.div
        className="absolute inset-0 rounded-full border-4 border-red-400"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.8, 0.2, 0.8],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-red-300"
        animate={{
          scale: [1, 1.8, 1],
          opacity: [0.6, 0, 0.6],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          delay: 0.5,
          ease: "easeInOut",
        }}
      />
    </div>
  )
}

export default function DemoPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingProgress, setRecordingProgress] = useState(0)
  const [showFeedback, setShowFeedback] = useState(false)
  const [currentWord, setCurrentWord] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioLevels, setAudioLevels] = useState<number[]>([])

  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(() => {
        setRecordingProgress((prev) => {
          if (prev >= 100) {
            setIsRecording(false)
            setTimeout(() => setShowFeedback(true), 500)
            return 100
          }
          return prev + 2
        })

        // Simulate audio levels
        setAudioLevels((prev) => [...prev.slice(-20), Math.random() * 100])
      }, 100)
      return () => clearInterval(interval)
    }
  }, [isRecording])

  const nextStep = () => {
    if (currentStep < demoSteps.length - 1) {
      setCurrentStep(currentStep + 1)
      setShowFeedback(false)
      setRecordingProgress(0)
      setAudioLevels([])
    }
  }

  const startRecording = () => {
    setIsRecording(true)
    setRecordingProgress(0)
    setShowFeedback(false)
    setAudioLevels([])
  }

  const playPronunciation = () => {
    setIsPlaying(true)
    setTimeout(() => setIsPlaying(false), 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-lg">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Mic className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  HorizonTalk
                </h1>
                <p className="text-sm text-gray-600">Interactive Demo</p>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
              <Activity className="w-3 h-3 mr-1" />
              Live Demo
            </Badge>
          </div>
        </div>
      </header>

      {/* Enhanced Progress Indicator */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-4">
          {demoSteps.map((step, index) => {
            const StepIcon = step.icon
            return (
              <div key={step.id} className={`flex items-center ${index < demoSteps.length - 1 ? "flex-1" : ""}`}>
                <motion.div
                  className={`relative w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-500 ${index <= currentStep
                    ? `bg-gradient-to-r ${step.color} text-white shadow-lg`
                    : "bg-gray-200 text-gray-600"
                    }`}
                  animate={index === currentStep ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <StepIcon className="w-5 h-5" />
                  {index <= currentStep && (
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-white/30"
                      animate={{ scale: [1, 1.3, 1], opacity: [0.8, 0.2, 0.8] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    />
                  )}
                </motion.div>
                {index < demoSteps.length - 1 && (
                  <div className="flex-1 h-2 mx-4 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full bg-gradient-to-r ${step.color} rounded-full`}
                      initial={{ width: "0%" }}
                      animate={{ width: index < currentStep ? "100%" : "0%" }}
                      transition={{ duration: 0.8, ease: "easeInOut" }}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
        <motion.div
          className="text-center"
          key={currentStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-1">{demoSteps[currentStep].title}</h2>
          <p className="text-gray-600">{demoSteps[currentStep].subtitle}</p>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {/* Welcome Step */}
          {currentStep === 0 && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-8"
            >
              <div className="space-y-6">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto relative"
                >
                  <Sparkles className="w-12 h-12 text-white" />
                  <motion.div
                    className="absolute inset-0 rounded-full border-4 border-blue-300"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  />
                </motion.div>
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-3xl font-bold text-gray-900"
                >
                  Transform Your English Speaking Skills
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-lg text-gray-600 max-w-2xl mx-auto"
                >
                  Experience AI-powered speech analysis, real-time feedback, and personalized vocabulary building
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto"
              >
                {[
                  {
                    icon: Mic,
                    title: "Speech Analysis",
                    desc: "Real-time recording and AI-powered feedback",
                    color: "blue",
                  },
                  {
                    icon: BookOpen,
                    title: "Vocabulary Builder",
                    desc: "Learn new words with pronunciation guides",
                    color: "purple",
                  },
                  {
                    icon: TrendingUp,
                    title: "Progress Tracking",
                    desc: "Monitor improvement over time",
                    color: "green",
                  },
                ].map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  >

                    <Card
                      className={`h-full border-2 transition-all duration-300 group bg-white rounded-lg shadow-sm hover:shadow-md ${feature.color === 'blue'
                          ? 'border-blue-100 hover:border-blue-200'
                          : feature.color === 'purple'
                            ? 'border-purple-100 hover:border-purple-200'
                            : 'border-green-100 hover:border-green-200'
                        }`}
                    >
                      <CardContent className="p-6 text-center h-full flex flex-col justify-between">
                        <div className="flex flex-col items-center">
                          <motion.div whileHover={{ scale: 1.1, rotate: 5 }} transition={{ duration: 0.2 }}>
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${feature.color === 'blue'
                                ? 'bg-blue-50'
                                : feature.color === 'purple'
                                  ? 'bg-purple-50'
                                  : 'bg-green-50'
                              }`}>
                              <feature.icon className={`w-8 h-8 ${feature.color === 'blue'
                                  ? 'text-blue-600'
                                  : feature.color === 'purple'
                                    ? 'text-purple-600'
                                    : 'text-green-600'
                                }`} />
                            </div>
                          </motion.div>
                          <h4 className="font-semibold text-gray-900 mb-3 text-lg">{feature.title}</h4>
                          <p className="text-sm text-gray-600 leading-relaxed">{feature.desc}</p>
                        </div>
                      </CardContent>
                    </Card>

                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* Speech Practice Step */}
          {currentStep === 1 && (
            <motion.div
              key="speech-practice"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto"
            >
              <Card className="border-2 border-red-100 shadow-xl">
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center space-x-2">
                    <Mic className="w-6 h-6 text-red-600" />
                    <span>Speech Practice Session</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="text-center space-y-6">
                    <motion.p
                      className="text-gray-600 text-lg"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      Click the microphone to start recording. Try introducing yourself!
                    </motion.p>

                    {/* Enhanced Recording Button */}
                    <div className="relative flex flex-col items-center space-y-6">
                      <motion.div className="relative" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          size="lg"
                          onClick={startRecording}
                          disabled={isRecording}
                          className={`w-32 h-32 rounded-full text-white shadow-2xl transition-all duration-300 ${isRecording
                            ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                            : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                            }`}
                        >
                          {isRecording ? (
                            <div className="flex flex-col items-center space-y-2">
                              <MicOff className="w-10 h-10" />
                              <SoundWave isActive={isRecording} />
                            </div>
                          ) : (
                            <Mic className="w-10 h-10" />
                          )}
                        </Button>

                        {isRecording && <RecordingPulse />}
                      </motion.div>

                      {/* Audio Visualization */}
                      {isRecording && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex items-center justify-center space-x-1 h-16"
                        >
                          {audioLevels.slice(-15).map((level, index) => (
                            <motion.div
                              key={index}
                              className="w-2 bg-gradient-to-t from-red-400 to-red-600 rounded-full"
                              animate={{ height: `${Math.max(4, level * 0.6)}px` }}
                              transition={{ duration: 0.1 }}
                            />
                          ))}
                        </motion.div>
                      )}
                    </div>

                    {isRecording && (
                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                          <p className="text-red-600 font-medium text-lg">Recording in progress...</p>
                        </div>
                        <div className="max-w-md mx-auto">
                          <div className="flex justify-between text-sm text-gray-600 mb-2">
                            <span>Progress</span>
                            <span>{recordingProgress}%</span>
                          </div>
                          <Progress value={recordingProgress} className="h-3" />
                        </div>
                      </motion.div>
                    )}

                    {recordingProgress === 100 && !showFeedback && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center space-y-4"
                      >
                        <div className="inline-flex items-center space-x-3 bg-blue-50 px-6 py-3 rounded-full">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                          >
                            <Brain className="w-6 h-6 text-blue-600" />
                          </motion.div>
                          <span className="text-blue-700 font-medium">AI analyzing your speech...</span>
                        </div>
                        <div className="flex justify-center space-x-1">
                          {[...Array(3)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="w-2 h-2 bg-blue-400 rounded-full"
                              animate={{ y: [0, -10, 0] }}
                              transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY, delay: i * 0.2 }}
                            />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* AI Feedback Step */}
          {currentStep === 2 && (
            <motion.div
              key="ai-feedback"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto space-y-6"
            >
              <Card className="border-2 border-green-100 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    >
                      <Award className="w-6 h-6 text-green-600" />
                    </motion.div>
                    <span>AI Analysis Results</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Transcript */}
                  <motion.div
                    className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-xl border"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="flex items-center space-x-2 mb-3">
                      <MessageCircle className="w-5 h-5 text-blue-600" />
                      <h4 className="font-medium text-gray-900">Your Speech Transcript:</h4>
                    </div>
                    <p className="text-gray-700 italic leading-relaxed">"{mockFeedback.transcript}"</p>
                  </motion.div>

                  {/* Enhanced Scores */}
                  <div className="grid md:grid-cols-3 gap-6">
                    {[
                      { label: "Fluency", score: mockFeedback.fluencyScore, icon: Zap, color: "blue" },
                      { label: "Grammar", score: mockFeedback.grammarScore, icon: BookOpen, color: "purple" },
                      { label: "Pronunciation", score: mockFeedback.pronunciationScore, icon: Volume2, color: "green" },
                    ].map((item, index) => (
                      <motion.div
                        key={item.label}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.4 + index * 0.2, type: "spring", stiffness: 200 }}
                      >
                        <Card
                          className={`text-center bg-gradient-to-br from-${item.color}-50 to-${item.color}-100 border-${item.color}-200`}
                        >
                          <CardContent className="p-6">
                            <motion.div
                              animate={{ rotate: [0, 10, -10, 0] }}
                              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: index * 0.5 }}
                            >
                              <item.icon className={`w-8 h-8 text-${item.color}-600 mx-auto mb-3`} />
                            </motion.div>
                            <motion.div
                              className={`text-3xl font-bold text-${item.color}-600 mb-2`}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.6 + index * 0.2 }}
                            >
                              {item.score}%
                            </motion.div>
                            <div className="text-sm text-gray-600 mb-3">{item.label}</div>
                            <Progress value={item.score} className="h-2" />
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>

                  {/* Enhanced Suggestions */}
                  <div>
                    <div className="flex items-center space-x-2 mb-4">
                      <Target className="w-5 h-5 text-orange-600" />
                      <h4 className="font-medium text-gray-900">AI Improvement Suggestions:</h4>
                    </div>
                    <div className="space-y-3">
                      {mockFeedback.suggestions.map((suggestion, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -30 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.8 + index * 0.2 }}
                          className="flex items-start space-x-4 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl border border-orange-200"
                        >
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: index * 0.5 }}
                          >
                            <Target className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                          </motion.div>
                          <span className="text-gray-700 leading-relaxed">{suggestion}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Vocabulary Step */}
          {currentStep === 3 && (
            <motion.div
              key="vocabulary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto"
            >
              <Card className="border-2 border-purple-100 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <motion.div
                      animate={{ rotateY: [0, 180, 360] }}
                      transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                    >
                      <BookOpen className="w-6 h-6 text-purple-600" />
                    </motion.div>
                    <span>Daily Vocabulary Builder</span>
                  </CardTitle>
                </CardHeader>



                <CardContent>
                  <div className="space-y-6">
                    {mockVocabulary.map((vocab, index) => (
                      <motion.div
                        key={vocab.word}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.3 }}
                        whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                        className={`p-4 sm:p-6 rounded-xl border-2 transition-all duration-300 ${index === currentWord
                          ? "border-purple-300 bg-gradient-to-r from-purple-50 to-indigo-50 shadow-lg"
                          : "border-gray-200 bg-white hover:border-purple-200"
                          }`}
                      >
                        {/* Header section with word, badge, and pronunciation */}
                        <div className="mb-4 space-y-3">
                          {/* Word and badge row */}
                          <div className="flex items-center space-x-3">
                            <motion.h4
                              className="text-xl sm:text-2xl font-bold text-gray-900 flex-1 min-w-0"
                              animate={index === currentWord ? { scale: [1, 1.05, 1] } : {}}
                              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                            >
                              {vocab.word}
                            </motion.h4>
                            <Badge
                              variant={vocab.difficulty === "Advanced" ? "destructive" : "secondary"}
                              className="text-xs shrink-0"
                            >
                              {vocab.difficulty}
                            </Badge>
                          </div>

                          {/* Pronunciation button row - full width on mobile */}
                          <div className="w-full">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={playPronunciation}
                              disabled={isPlaying}
                              className="flex items-center justify-center space-x-2 bg-transparent hover:bg-purple-50 w-full sm:w-auto"
                            >
                              <motion.div
                                animate={isPlaying ? { scale: [1, 1.2, 1] } : {}}
                                transition={{ duration: 0.3, repeat: isPlaying ? Number.POSITIVE_INFINITY : 0 }}
                              >
                                {isPlaying ? <Pause className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                              </motion.div>
                              <span className="text-sm">{isPlaying ? "Playing..." : "Pronounce"}</span>
                            </Button>
                          </div>
                        </div>

                        <motion.p
                          className="text-gray-700 mb-4 leading-relaxed text-sm sm:text-base"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 + index * 0.3 }}
                        >
                          <strong className="text-purple-700">Definition:</strong> {vocab.definition}
                        </motion.p>

                        <motion.div
                          className="bg-gradient-to-r from-gray-50 to-purple-50 p-3 sm:p-4 rounded-lg border"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 + index * 0.3 }}
                        >
                          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                            <strong className="text-purple-700">Example:</strong> {vocab.example}
                          </p>
                        </motion.div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>





              </Card>
            </motion.div>
          )}

          {/* Progress Step */}
          {currentStep === 4 && (
            <motion.div
              key="progress"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto space-y-6"
            >
              <Card className="border-2 border-orange-100 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    >
                      <BarChart3 className="w-6 h-6 text-orange-600" />
                    </motion.div>
                    <span>Your Progress Dashboard</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Enhanced Stats Overview */}
                  <div className="grid md:grid-cols-4 gap-6">
                    {[
                      { value: "47", label: "Sessions", icon: Play, color: "blue" },
                      { value: "156", label: "Words Learned", icon: BookOpen, color: "purple" },
                      { value: "23h", label: "Practice Time", icon: Activity, color: "green" },
                      { value: "12", label: "Day Streak", icon: Trophy, color: "orange" },
                    ].map((stat, index) => (
                      <motion.div
                        key={stat.label}
                        initial={{ scale: 0, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        transition={{ delay: 0.1 + index * 0.1, type: "spring", stiffness: 200 }}
                      >
                        <Card
                          className={`text-center bg-gradient-to-br from-${stat.color}-50 to-${stat.color}-100 border-${stat.color}-200 hover:shadow-lg transition-all duration-300`}
                        >
                          <CardContent className="p-6">
                            <motion.div
                              animate={{ rotate: [0, 360] }}
                              transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, delay: index * 0.5 }}
                            >
                              <stat.icon className={`w-8 h-8 text-${stat.color}-600 mx-auto mb-3`} />
                            </motion.div>
                            <motion.div
                              className={`text-3xl font-bold text-${stat.color}-600 mb-1`}
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: index * 0.3 }}
                            >
                              {stat.value}
                            </motion.div>
                            <div className="text-sm text-gray-600">{stat.label}</div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>

                  {/* Enhanced Achievements */}
                  <div>
                    <div className="flex items-center space-x-2 mb-6">
                      <Trophy className="w-6 h-6 text-yellow-600" />
                      <h4 className="font-medium text-gray-900 text-lg">Recent Achievements</h4>
                    </div>
                    <div className="space-y-4">
                      {[
                        { title: "Fluency Master", desc: "Achieved 90%+ fluency score", icon: "🎯", color: "blue" },
                        {
                          title: "Vocabulary Builder",
                          desc: "Learned 50 new words this week",
                          icon: "📚",
                          color: "purple",
                        },
                        { title: "Consistent Learner", desc: "10-day practice streak", icon: "🔥", color: "orange" },
                      ].map((achievement, index) => (
                        <motion.div
                          key={achievement.title}
                          initial={{ opacity: 0, x: -30 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + index * 0.2 }}
                          whileHover={{ scale: 1.02, x: 10 }}
                          className={`flex items-center space-x-4 p-4 bg-gradient-to-r from-${achievement.color}-50 to-${achievement.color}-100 rounded-xl border border-${achievement.color}-200 cursor-pointer`}
                        >
                          <motion.div
                            className="text-3xl"
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: index * 0.5 }}
                          >
                            {achievement.icon}
                          </motion.div>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900">{achievement.title}</div>
                            <div className="text-sm text-gray-600">{achievement.desc}</div>
                          </div>
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: index * 0.3 }}
                          >
                            <CheckCircle className="w-6 h-6 text-green-600" />
                          </motion.div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced Navigation */}
        <div className="flex justify-center mt-12">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={nextStep}
              disabled={currentStep === demoSteps.length - 1}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-4 shadow-xl"
            >
              {currentStep === demoSteps.length - 1 ? (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Demo Complete
                </>
              ) : (
                <>
                  Next Step
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Enhanced Footer CTA */}
      {currentStep === demoSteps.length - 1 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white border-t py-16 mt-12"
        >
          <div className="max-w-4xl mx-auto text-center px-6">
            <div className="space-y-8">
              <motion.div
                className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
              >
                <CheckCircle className="w-10 h-10 text-white" />
              </motion.div>
              <div>
                <motion.h3
                  className="text-4xl font-bold text-gray-900 mb-4"
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                >
                  Ready to Transform Your English?
                </motion.h3>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                  Join thousands of learners who are already improving their speaking confidence with HorizonTalk's
                  AI-powered platform
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/app">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg shadow-xl"
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Start Learning Now
                    </Button>
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/app">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 text-lg bg-transparent"
                    >
                      Learn More
                    </Button>
                  </Link>
                </motion.div>
              </div>
              <div className="flex items-center justify-center space-x-8 text-sm text-gray-500 pt-4">
                {[
                  { icon: CheckCircle, text: "Free to start" },
                  { icon: CheckCircle, text: "No downloads required" },
                  { icon: CheckCircle, text: "Works in any browser" },
                ].map((item, index) => (
                  <motion.div
                    key={item.text}
                    className="flex items-center space-x-2"
                    animate={{ y: [0, -2, 0] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: index * 0.3 }}
                  >
                    <item.icon className="w-4 h-4 text-green-500" />
                    <span>{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
