import { database } from "./firebase"
import { ref, set, get, update, push } from "firebase/database"
import type { User } from "firebase/auth"

export interface UserProfile {
  uid: string
  email: string
  displayName?: string
  bio?: string
  learningGoals?: string
  createdAt: number
  lastLoginAt: number
  updatedAt?: number
  fluencyScore: number
  totalSessions: number
  vocabularyLearned: number
  speakingTime: number // in minutes
}

export interface PracticeSession {
  id?: string
  userId: string
  prompt: string
  transcript: string
  audioUrl?: string
  feedback: {
    fluencyScore: number
    grammarScore: number
    vocabularyUsage: number
    fillerWords: number
    suggestions: string[]
    improvedVocabulary: Array<{
      word: string
      definition: string
      example: string
    }>
  }
  createdAt: number
  duration: number // in seconds
}

export interface VocabularyWord {
  id?: string
  userId: string
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

export class UserService {
  static async createUserProfile(user: User): Promise<void> {
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email!,
      displayName: user.displayName || undefined,
      createdAt: Date.now(),
      lastLoginAt: Date.now(),
      fluencyScore: 0,
      totalSessions: 0,
      vocabularyLearned: 0,
      speakingTime: 0,
    }

    await set(ref(database, `users/${user.uid}`), userProfile)
  }

  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const snapshot = await get(ref(database, `users/${userId}`))
      return snapshot.exists() ? snapshot.val() : null
    } catch (error) {
      console.error("Error getting user profile:", error)
      return null
    }
  }

  static async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<void> {
    try {
      await update(ref(database, `users/${userId}`), {
        ...updates,
        lastLoginAt: Date.now(),
      })
    } catch (error) {
      console.error("Error updating user profile:", error)
      throw error
    }
  }

  static async savePracticeSession(session: Omit<PracticeSession, "id">): Promise<string> {
    try {
      const sessionRef = push(ref(database, `users/${session.userId}/sessions`))
      await set(sessionRef, session)
      return sessionRef.key!
    } catch (error) {
      console.error("Error saving practice session:", error)
      throw error
    }
  }

  static async getUserSessions(userId: string, limit = 10): Promise<PracticeSession[]> {
    try {
      const sessionsRef = ref(database, `users/${userId}/sessions`)

      // First, get all sessions without ordering to avoid index requirement
      const snapshot = await get(sessionsRef)

      if (!snapshot.exists()) return []

      const sessions: PracticeSession[] = []
      snapshot.forEach((childSnapshot) => {
        sessions.push({
          id: childSnapshot.key!,
          ...childSnapshot.val(),
        })
      })

      // Sort by createdAt in JavaScript and limit
      return sessions.sort((a, b) => b.createdAt - a.createdAt).slice(0, limit)
    } catch (error) {
      console.error("Error getting user sessions:", error)
      return []
    }
  }

  static async saveVocabularyWord(word: Omit<VocabularyWord, "id">): Promise<string> {
    try {
      const wordRef = push(ref(database, `users/${word.userId}/vocabulary`))
      await set(wordRef, word)
      return wordRef.key!
    } catch (error) {
      console.error("Error saving vocabulary word:", error)
      throw error
    }
  }

  static async getUserVocabulary(userId: string): Promise<VocabularyWord[]> {
    try {
      const vocabRef = ref(database, `users/${userId}/vocabulary`)
      const snapshot = await get(vocabRef)

      if (!snapshot.exists()) return []

      const vocabulary: VocabularyWord[] = []
      snapshot.forEach((childSnapshot) => {
        vocabulary.push({
          id: childSnapshot.key!,
          ...childSnapshot.val(),
        })
      })

      // Sort by createdAt in JavaScript
      return vocabulary.sort((a, b) => b.createdAt - a.createdAt)
    } catch (error) {
      console.error("Error getting user vocabulary:", error)
      return []
    }
  }

  static async updateVocabularyWord(userId: string, wordId: string, updates: Partial<VocabularyWord>): Promise<void> {
    try {
      await update(ref(database, `users/${userId}/vocabulary/${wordId}`), updates)
    } catch (error) {
      console.error("Error updating vocabulary word:", error)
      throw error
    }
  }

  // Helper method to get user stats without complex queries
  static async getUserStats(userId: string): Promise<{
    totalSessions: number
    vocabularyLearned: number
    speakingTime: number
    fluencyScore: number
  }> {
    try {
      const profile = await this.getUserProfile(userId)

      if (!profile) {
        return {
          totalSessions: 0,
          vocabularyLearned: 0,
          speakingTime: 0,
          fluencyScore: 0,
        }
      }

      return {
        totalSessions: profile.totalSessions || 0,
        vocabularyLearned: profile.vocabularyLearned || 0,
        speakingTime: profile.speakingTime || 0,
        fluencyScore: profile.fluencyScore || 0,
      }
    } catch (error) {
      console.error("Error getting user stats:", error)
      return {
        totalSessions: 0,
        vocabularyLearned: 0,
        speakingTime: 0,
        fluencyScore: 0,
      }
    }
  }
}
