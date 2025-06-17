"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Mic, BookOpen, TrendingUp, MessageCircle, Play, Clock, Target } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { UserService } from "@/lib/user-service"

interface RecentActivity {
  type: string
  title: string
  time: string
  score?: number
  learned?: number
  duration?: number
}

export function DashboardOverview() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalSessions: 0,
    vocabularyLearned: 0,
    speakingTime: 0,
    fluencyScore: 0,
  })
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUserData = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        // Get user stats from profile (real data only)
        const userStats = await UserService.getUserStats(user.uid)
        setStats(userStats)

        // Get recent sessions (real data only)
        const sessions = await UserService.getUserSessions(user.uid, 5)

        // Convert sessions to recent activities with relative time
        const activities: RecentActivity[] = sessions.map((session) => {
          const timeAgo = getRelativeTime(session.createdAt)
          return {
            type: "practice",
            title: session.prompt,
            time: timeAgo,
            score: session.feedback?.fluencyScore || 0,
          }
        })

        setRecentActivities(activities)
      } catch (error) {
        console.error("Error loading user data:", error)
        // Keep default values on error - no fake data
        setStats({
          totalSessions: 0,
          vocabularyLearned: 0,
          speakingTime: 0,
          fluencyScore: 0,
        })
        setRecentActivities([])
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [user])

  // Helper function to get relative time
  const getRelativeTime = (timestamp: number): string => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`
    return `${days} day${days > 1 ? "s" : ""} ago`
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back{user?.displayName ? `, ${user.displayName}` : ""}!
        </h1>
        <p className="text-gray-600">
          {stats.totalSessions === 0
            ? "Ready to start your English learning journey?"
            : "Continue your English learning journey"}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="transition-shadow duration-200 hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <Mic className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSessions}</div>
            <p className="text-xs text-gray-500">
              {stats.totalSessions === 0 ? "Start your first session!" : "Keep practicing!"}
            </p>
          </CardContent>
        </Card>

        <Card className="transition-shadow duration-200 hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vocabulary Learned</CardTitle>
            <BookOpen className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.vocabularyLearned}</div>
            <p className="text-xs text-gray-500">
              {stats.vocabularyLearned === 0 ? "Learn your first words!" : "Expanding your vocabulary"}
            </p>
          </CardContent>
        </Card>

        <Card className="transition-shadow duration-200 hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Speaking Time</CardTitle>
            <Clock className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.speakingTime}m</div>
            <p className="text-xs text-gray-500">
              {stats.speakingTime === 0 ? "Start practicing!" : "Time well spent"}
            </p>
          </CardContent>
        </Card>

        <Card className="transition-shadow duration-200 hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fluency Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.fluencyScore}%</div>
            <p className="text-xs text-gray-500">
              {stats.fluencyScore === 0 ? "Complete a session to see your score!" : "Great progress!"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Get Started / Daily Challenge */}
        <Card className="transition-shadow duration-200 hover:shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-blue-600" />
              <span>{stats.totalSessions === 0 ? "Get Started" : "Continue Learning"}</span>
            </CardTitle>
            <CardDescription>
              {stats.totalSessions === 0
                ? "Take your first step towards better English communication"
                : "Keep building your English skills with practice"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.totalSessions === 0 ? (
              <div>
                <h4 className="font-medium mb-2">Ready to begin your journey?</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Start with a speaking practice session to get personalized AI feedback on your English skills.
                </p>
                <Link href="/dashboard/practice">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                    <Play className="mr-2 h-4 w-4" />
                    Start Your First Session
                  </Button>
                </Link>
              </div>
            ) : (
              <div>
                <h4 className="font-medium mb-2">Practice speaking about travel experiences</h4>
                <p className="text-sm text-gray-600 mb-3">Try using descriptive vocabulary in your response:</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {["memorable", "fascinating", "breathtaking", "cultural", "adventurous"].map((word, index) => (
                    <Badge key={index} variant="secondary">
                      {word}
                    </Badge>
                  ))}
                </div>
                <Link href="/dashboard/practice">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    <Play className="mr-2 h-4 w-4" />
                    Start Practice Session
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="transition-shadow duration-200 hover:shadow-lg">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              {recentActivities.length > 0 ? "Your latest learning sessions" : "No activity yet"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Mic className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{activity.title}</p>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {activity.score !== undefined && activity.score > 0 && `${activity.score}%`}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Mic className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="font-medium">No sessions yet</p>
                  <p className="text-sm">Start your first practice session to see your activity here</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="transition-shadow duration-200 hover:shadow-lg">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Jump into your favorite activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/dashboard/practice">
              <Button
                variant="outline"
                className="w-full h-20 flex flex-col space-y-2 hover:bg-blue-50 hover:border-blue-200 transition-colors"
              >
                <Mic className="h-6 w-6" />
                <span>Practice Speaking</span>
              </Button>
            </Link>
            <Link href="/dashboard/vocabulary">
              <Button
                variant="outline"
                className="w-full h-20 flex flex-col space-y-2 hover:bg-green-50 hover:border-green-200 transition-colors"
              >
                <BookOpen className="h-6 w-6" />
                <span>Study Vocabulary</span>
              </Button>
            </Link>
            <Link href="/dashboard/chat">
              <Button
                variant="outline"
                className="w-full h-20 flex flex-col space-y-2 hover:bg-purple-50 hover:border-purple-200 transition-colors"
              >
                <MessageCircle className="h-6 w-6" />
                <span>AI Conversation</span>
              </Button>
            </Link>
            <Link href="/dashboard/progress">
              <Button
                variant="outline"
                className="w-full h-20 flex flex-col space-y-2 hover:bg-orange-50 hover:border-orange-200 transition-colors"
              >
                <TrendingUp className="h-6 w-6" />
                <span>View Progress</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Progress Overview - Only show if user has data */}
      {(stats.totalSessions > 0 || stats.vocabularyLearned > 0 || stats.speakingTime > 0) && (
        <Card className="transition-shadow duration-200 hover:shadow-lg">
          <CardHeader>
            <CardTitle>Learning Progress</CardTitle>
            <CardDescription>Your improvement over time</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Fluency Score</span>
                <span>{stats.fluencyScore}%</span>
              </div>
              <Progress value={stats.fluencyScore} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Vocabulary Goal (50 words)</span>
                <span>{stats.vocabularyLearned}/50</span>
              </div>
              <Progress value={(stats.vocabularyLearned / 50) * 100} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Weekly Speaking Goal (300 min)</span>
                <span>{stats.speakingTime}/300</span>
              </div>
              <Progress value={(stats.speakingTime / 300) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
