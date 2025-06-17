"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Calendar, Award, Clock, Mic, BookOpen, MessageCircle } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import { useAuth } from "@/components/auth-provider"
import { UserService } from "@/lib/user-service"

export function ProgressPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalSessions: 0,
    vocabularyLearned: 0,
    speakingTime: 0,
    fluencyScore: 0,
  })
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProgressData = async () => {
      if (!user) return

      try {
        const userStats = await UserService.getUserStats(user.uid)
        setStats(userStats)

        const userSessions = await UserService.getUserSessions(user.uid, 20)
        setSessions(userSessions)
      } catch (error) {
        console.error("Error loading progress data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadProgressData()
  }, [user])

  // Generate real data from user sessions
  const fluencyData = sessions
    .map((session: any, index) => ({
      date: new Date(session.createdAt).toLocaleDateString(),
      score: session.feedback?.fluencyScore || 0,
      session: index + 1,
    }))
    .slice(-7) // Last 7 sessions

  const activityData = [
    { activity: "Speaking", minutes: stats.speakingTime },
    { activity: "Vocabulary", minutes: Math.floor(stats.vocabularyLearned * 2) }, // Estimate 2 min per word
    { activity: "Sessions", minutes: stats.totalSessions * 5 }, // Estimate 5 min per session
  ]

  // Real achievements based on actual data
  const achievements = [
    {
      title: "First Steps",
      description: "Completed your first practice session",
      earned: stats.totalSessions > 0,
      date: stats.totalSessions > 0 ? "Completed" : null,
    },
    {
      title: "Vocabulary Builder",
      description: "Learned 10 new words",
      earned: stats.vocabularyLearned >= 10,
      progress: Math.min((stats.vocabularyLearned / 10) * 100, 100),
    },
    {
      title: "Consistent Learner",
      description: "Completed 5 practice sessions",
      earned: stats.totalSessions >= 5,
      progress: Math.min((stats.totalSessions / 5) * 100, 100),
    },
    {
      title: "Fluency Milestone",
      description: "Reached 80% fluency score",
      earned: stats.fluencyScore >= 80,
      progress: Math.min((stats.fluencyScore / 80) * 100, 100),
    },
    {
      title: "Speaking Champion",
      description: "Practiced for 60 minutes",
      earned: stats.speakingTime >= 60,
      progress: Math.min((stats.speakingTime / 60) * 100, 100),
    },
  ]

  const weeklyGoals = [
    { goal: "Practice 5 sessions", current: stats.totalSessions % 5, target: 5, icon: Mic },
    { goal: "Learn 15 new words", current: stats.vocabularyLearned % 15, target: 15, icon: BookOpen },
    { goal: "Speak for 60 minutes", current: stats.speakingTime % 60, target: 60, icon: MessageCircle },
    { goal: "Improve fluency by 5%", current: Math.min(stats.fluencyScore, 5), target: 5, icon: TrendingUp },
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-24 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (stats.totalSessions === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Learning Progress</h1>
          <p className="text-gray-600">Track your English improvement journey</p>
        </div>

        <Card className="text-center py-12">
          <CardContent>
            <TrendingUp className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">No progress data yet</h3>
            <p className="text-gray-600 mb-6">
              Complete your first practice session to start tracking your progress and see detailed analytics.
            </p>
            <a
              href="/dashboard/practice"
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors"
            >
              <Mic className="mr-2 h-4 w-4" />
              Start Your First Session
            </a>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Learning Progress</h1>
        <p className="text-gray-600">Track your English improvement journey</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Fluency</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.fluencyScore}%</div>
            <p className="text-xs text-muted-foreground">
              {stats.fluencyScore > 0 ? "Keep improving!" : "Complete sessions to see score"}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSessions}</div>
            <p className="text-xs text-muted-foreground">Practice sessions completed</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Words Learned</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.vocabularyLearned}</div>
            <p className="text-xs text-muted-foreground">Vocabulary expanded</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Practiced</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.speakingTime}m</div>
            <p className="text-xs text-muted-foreground">Speaking practice time</p>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Goals */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>Weekly Goals</CardTitle>
          <CardDescription>Your progress towards this week's learning targets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {weeklyGoals.map((goal, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <goal.icon className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">{goal.goal}</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {goal.current}/{goal.target}
                  </span>
                </div>
                <Progress value={(goal.current / goal.target) * 100} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {fluencyData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Fluency Progress Chart */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Fluency Progress</CardTitle>
              <CardDescription>Your fluency score over recent sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={fluencyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="session" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip
                    formatter={(value) => [`${value}%`, "Fluency Score"]}
                    labelFormatter={(value) => `Session ${value}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Activity Breakdown */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Activity Breakdown</CardTitle>
              <CardDescription>Time spent on different activities</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="activity" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} min`, "Time"]} />
                  <Bar dataKey="minutes" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Achievements */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="h-5 w-5 text-yellow-500" />
            <span>Achievements</span>
          </CardTitle>
          <CardDescription>Your learning milestones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {achievements.map((achievement, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    achievement.earned ? "bg-yellow-100" : "bg-gray-100"
                  }`}
                >
                  <Award className={`h-4 w-4 ${achievement.earned ? "text-yellow-600" : "text-gray-400"}`} />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{achievement.title}</h4>
                    {achievement.earned ? (
                      <Badge className="bg-yellow-100 text-yellow-800">Earned</Badge>
                    ) : (
                      <Badge variant="outline">{Math.round(achievement.progress || 0)}%</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                  {achievement.earned && achievement.date && (
                    <p className="text-xs text-gray-500">{achievement.date}</p>
                  )}
                  {!achievement.earned && achievement.progress !== undefined && (
                    <Progress value={achievement.progress} className="h-1 mt-2" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest learning sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sessions.slice(0, 5).map((session: any, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <div>
                    <p className="font-medium">Speaking Practice</p>
                    <p className="text-sm text-gray-600 truncate max-w-xs">{session.prompt}</p>
                  </div>
                </div>
                <div className="text-right text-sm text-gray-500">
                  <p>{new Date(session.createdAt).toLocaleDateString()}</p>
                  <p>Score: {session.feedback?.fluencyScore || 0}%</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
