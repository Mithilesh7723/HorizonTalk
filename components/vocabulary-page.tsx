"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import {
  BookOpen,
  Volume2,
  RotateCcw,
  Plus,
  Search,
  Star,
  CheckCircle,
  XCircle,
  Brain,
  Sparkles,
  RefreshCw,
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { UserService } from "@/lib/user-service"
import { useToast } from "@/hooks/use-toast"

interface VocabularyWord {
  id: string
  word: string
  definition: string
  example: string
  pronunciation: string
  difficulty: "beginner" | "intermediate" | "advanced"
  category: string
  learned: boolean
  reviewCount: number
  lastReviewed?: number
  createdAt: number
}

interface DailyWord {
  word: string
  definition: string
  example: string
  pronunciation: string
  difficulty: "beginner" | "intermediate" | "advanced"
  category: string
}

export function VocabularyPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [vocabularyWords, setVocabularyWords] = useState<VocabularyWord[]>([])
  const [dailyWords, setDailyWords] = useState<DailyWord[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingDaily, setLoadingDaily] = useState(false)
  const [addingWord, setAddingWord] = useState(false)

  // Add word form state
  const [newWord, setNewWord] = useState({
    word: "",
    category: "general",
    difficulty: "intermediate" as "beginner" | "intermediate" | "advanced",
  })

  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    const loadVocabulary = async () => {
      if (!user) return

      try {
        const words = await UserService.getUserVocabulary(user.uid)
        setVocabularyWords(words)

        // Load daily words on component mount
        await generateDailyWords()
      } catch (error) {
        console.error("Error loading vocabulary:", error)
      } finally {
        setLoading(false)
      }
    }

    loadVocabulary()
  }, [user])

  const categories = ["all", ...new Set(vocabularyWords.map((word) => word.category))]

  const filteredWords = vocabularyWords.filter((word) => {
    const matchesSearch =
      word.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
      word.definition.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || word.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const wordsToReview = vocabularyWords.filter((word) => !word.learned || word.reviewCount < 3)
  const currentCard = wordsToReview[currentCardIndex]

  const generateDailyWords = async () => {
    setLoadingDaily(true)
    try {
      const response = await fetch("/api/generate-daily-words", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ count: 10 }),
      })

      if (response.ok) {
        const data = await response.json()
        setDailyWords(data.words)
      } else {
        throw new Error("Failed to generate daily words")
      }
    } catch (error) {
      console.error("Error generating daily words:", error)
      toast({
        title: "Error",
        description: "Failed to generate daily words. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoadingDaily(false)
    }
  }

  const addWordWithAI = async () => {
    if (!newWord.word.trim()) {
      toast({
        title: "Error",
        description: "Please enter a word to add.",
        variant: "destructive",
      })
      return
    }

    setAddingWord(true)
    try {
      const response = await fetch("/api/generate-word-details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          word: newWord.word,
          category: newWord.category,
          difficulty: newWord.difficulty,
        }),
      })

      if (response.ok) {
        const wordDetails = await response.json()

        // Save to Firebase
        const wordToSave = {
          userId: user!.uid,
          word: wordDetails.word,
          definition: wordDetails.definition,
          example: wordDetails.example,
          pronunciation: wordDetails.pronunciation,
          difficulty: newWord.difficulty,
          category: newWord.category,
          learned: false,
          reviewCount: 0,
          createdAt: Date.now(),
        }

        const wordId = await UserService.saveVocabularyWord(wordToSave)

        // Update local state
        setVocabularyWords((prev) => [
          {
            id: wordId,
            ...wordToSave,
          },
          ...prev,
        ])

        // Reset form
        setNewWord({
          word: "",
          category: "general",
          difficulty: "intermediate",
        })

        toast({
          title: "Word added!",
          description: `"${wordDetails.word}" has been added to your vocabulary.`,
        })
      } else {
        throw new Error("Failed to generate word details")
      }
    } catch (error) {
      console.error("Error adding word:", error)
      toast({
        title: "Error",
        description: "Failed to add word. Please try again.",
        variant: "destructive",
      })
    } finally {
      setAddingWord(false)
    }
  }

  const addDailyWordToVocabulary = async (dailyWord: DailyWord) => {
    if (!user) return

    try {
      const wordToSave = {
        userId: user.uid,
        word: dailyWord.word,
        definition: dailyWord.definition,
        example: dailyWord.example,
        pronunciation: dailyWord.pronunciation,
        difficulty: dailyWord.difficulty,
        category: dailyWord.category,
        learned: false,
        reviewCount: 0,
        createdAt: Date.now(),
      }

      const wordId = await UserService.saveVocabularyWord(wordToSave)

      // Update local state
      setVocabularyWords((prev) => [
        {
          id: wordId,
          ...wordToSave,
        },
        ...prev,
      ])

      toast({
        title: "Word added!",
        description: `"${dailyWord.word}" has been added to your vocabulary.`,
      })
    } catch (error) {
      console.error("Error adding daily word:", error)
      toast({
        title: "Error",
        description: "Failed to add word. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleCardAnswer = async (correct: boolean) => {
    if (!currentCard || !user) return

    try {
      // Update word status
      await UserService.updateVocabularyWord(user.uid, currentCard.id!, {
        learned: correct,
        reviewCount: (currentCard.reviewCount || 0) + 1,
        lastReviewed: Date.now(),
      })

      // Update local state
      setVocabularyWords((prev) =>
        prev.map((word) =>
          word.id === currentCard.id
            ? { ...word, learned: correct, reviewCount: (word.reviewCount || 0) + 1, lastReviewed: Date.now() }
            : word,
        ),
      )

      // Move to next card
      if (currentCardIndex < wordsToReview.length - 1) {
        setCurrentCardIndex(currentCardIndex + 1)
      } else {
        setCurrentCardIndex(0)
      }
      setShowAnswer(false)
    } catch (error) {
      console.error("Error updating vocabulary word:", error)
    }
  }

  const playPronunciation = (word: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(word)
      utterance.rate = 0.8
      speechSynthesis.speak(utterance)
    }
  }

  const stats = {
    totalWords: vocabularyWords.length,
    learnedWords: vocabularyWords.filter((w) => w.learned).length,
    reviewWords: wordsToReview.length,
    weeklyGoal: 20,
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-24 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Vocabulary Builder</h1>
        <p className="text-gray-600">
          Expand your English vocabulary with AI-powered flashcards and daily word suggestions
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{stats.totalWords}</p>
                <p className="text-sm text-gray-600">Total Words</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{stats.learnedWords}</p>
                <p className="text-sm text-gray-600">Learned</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <RotateCcw className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{stats.reviewWords}</p>
                <p className="text-sm text-gray-600">To Review</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Weekly Goal</span>
                <span>
                  {stats.learnedWords}/{stats.weeklyGoal}
                </span>
              </div>
              <Progress value={(stats.learnedWords / stats.weeklyGoal) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="daily" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="daily">Daily Words</TabsTrigger>
          <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
          <TabsTrigger value="wordlist">Word List</TabsTrigger>
          <TabsTrigger value="add">Add Words</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                    <span>Daily Word Suggestions</span>
                  </CardTitle>
                  <CardDescription>AI-generated vocabulary words to expand your knowledge</CardDescription>
                </div>
                <Button onClick={generateDailyWords} disabled={loadingDaily} variant="outline">
                  {loadingDaily ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loadingDaily ? (
                <div className="grid gap-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-20 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid gap-4">
                  {dailyWords.map((word, index) => (
                    <Card key={index} className="border border-purple-200 hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center space-x-3">
                              <h3 className="text-lg font-semibold text-purple-700">{word.word}</h3>
                              <Button size="sm" variant="ghost" onClick={() => playPronunciation(word.word)}>
                                <Volume2 className="h-4 w-4" />
                              </Button>
                              <span className="text-sm text-gray-500">{word.pronunciation}</span>
                            </div>
                            <p className="text-gray-700">{word.definition}</p>
                            <p className="text-sm text-gray-600 italic">"{word.example}"</p>
                            <div className="flex items-center space-x-2">
                              <Badge
                                variant={
                                  word.difficulty === "beginner"
                                    ? "secondary"
                                    : word.difficulty === "intermediate"
                                      ? "default"
                                      : "destructive"
                                }
                              >
                                {word.difficulty}
                              </Badge>
                              <Badge variant="outline">{word.category}</Badge>
                            </div>
                          </div>
                          <Button
                            onClick={() => addDailyWordToVocabulary(word)}
                            className="ml-4 bg-purple-600 hover:bg-purple-700"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="flashcards" className="space-y-4">
          {wordsToReview.length > 0 ? (
            <Card className="max-w-2xl mx-auto hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Flashcard Review</CardTitle>
                  <Badge variant="outline">
                    {currentCardIndex + 1} of {wordsToReview.length}
                  </Badge>
                </div>
                <Progress value={((currentCardIndex + 1) / wordsToReview.length) * 100} className="h-2" />
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center space-y-4">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-bold text-blue-600">{currentCard?.word}</h2>
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-gray-500">{currentCard?.pronunciation}</span>
                      <Button size="sm" variant="ghost" onClick={() => playPronunciation(currentCard?.word || "")}>
                        <Volume2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <Badge
                      variant={
                        currentCard?.difficulty === "beginner"
                          ? "secondary"
                          : currentCard?.difficulty === "intermediate"
                            ? "default"
                            : "destructive"
                      }
                    >
                      {currentCard?.difficulty}
                    </Badge>
                  </div>

                  {showAnswer && (
                    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium mb-2">Definition:</h3>
                        <p className="text-gray-700">{currentCard?.definition}</p>
                      </div>
                      <div>
                        <h3 className="font-medium mb-2">Example:</h3>
                        <p className="text-gray-700 italic">"{currentCard?.example}"</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-center space-x-4">
                  {!showAnswer ? (
                    <Button onClick={() => setShowAnswer(true)} className="w-32">
                      Show Answer
                    </Button>
                  ) : (
                    <div className="flex space-x-4">
                      <Button variant="destructive" onClick={() => handleCardAnswer(false)} className="w-24">
                        <XCircle className="mr-2 h-4 w-4" />
                        Hard
                      </Button>
                      <Button variant="default" onClick={() => handleCardAnswer(true)} className="w-24">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Easy
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="max-w-2xl mx-auto">
              <CardContent className="text-center py-12">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">Great job!</h3>
                <p className="text-gray-600">You've reviewed all your vocabulary words for today.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="wordlist" className="space-y-4">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search words..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* Word List */}
          <div className="grid gap-4">
            {filteredWords.length > 0 ? (
              filteredWords.map((word) => (
                <Card key={word.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-medium">{word.word}</h3>
                          <Button size="sm" variant="ghost" onClick={() => playPronunciation(word.word)}>
                            <Volume2 className="h-4 w-4" />
                          </Button>
                          <span className="text-sm text-gray-500">{word.pronunciation}</span>
                        </div>
                        <p className="text-gray-700">{word.definition}</p>
                        <p className="text-sm text-gray-600 italic">"{word.example}"</p>
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant={
                              word.difficulty === "beginner"
                                ? "secondary"
                                : word.difficulty === "intermediate"
                                  ? "default"
                                  : "destructive"
                            }
                          >
                            {word.difficulty}
                          </Badge>
                          <Badge variant="outline">{word.category}</Badge>
                          {word.learned && (
                            <Badge variant="default" className="bg-green-600">
                              Learned
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        <p>Reviewed {word.reviewCount} times</p>
                        {word.learned && <Star className="h-4 w-4 text-yellow-500 inline" />}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-medium mb-2">No words found</h3>
                  <p className="text-gray-600">Try adjusting your search or add some new words.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="add" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="h-5 w-5" />
                <span>Add New Words</span>
              </CardTitle>
              <CardDescription>Add words manually and let AI generate definitions and examples</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="word" className="text-sm font-medium mb-2 block">
                    Word *
                  </Label>
                  <Input
                    id="word"
                    placeholder="Enter a word..."
                    value={newWord.word}
                    onChange={(e) => setNewWord({ ...newWord, word: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="category" className="text-sm font-medium mb-2 block">
                    Category
                  </Label>
                  <Select
                    value={newWord.category}
                    onValueChange={(value) => setNewWord({ ...newWord, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="academic">Academic</SelectItem>
                      <SelectItem value="travel">Travel</SelectItem>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="science">Science</SelectItem>
                      <SelectItem value="arts">Arts</SelectItem>
                      <SelectItem value="sports">Sports</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="difficulty" className="text-sm font-medium mb-2 block">
                    Difficulty
                  </Label>
                  <Select
                    value={newWord.difficulty}
                    onValueChange={(value: "beginner" | "intermediate" | "advanced") =>
                      setNewWord({ ...newWord, difficulty: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={addWordWithAI} disabled={addingWord || !newWord.word.trim()} className="w-full">
                {addingWord ? (
                  <>
                    <Brain className="mr-2 h-4 w-4 animate-spin" />
                    Generating with AI...
                  </>
                ) : (
                  <>
                    <Brain className="mr-2 h-4 w-4" />
                    Add Word with AI
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
