"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, Send, Bot, User, Lightbulb, Globe, Briefcase, GraduationCap } from "lucide-react"
import { useChat } from "ai/react"

const conversationScenarios = [
  {
    id: "casual",
    title: "Casual Conversation",
    description: "Practice everyday English conversations",
    icon: MessageCircle,
    color: "bg-blue-500",
  },
  {
    id: "business",
    title: "Business English",
    description: "Professional workplace conversations",
    icon: Briefcase,
    color: "bg-green-500",
  },
  {
    id: "travel",
    title: "Travel & Tourism",
    description: "Conversations for travelers",
    icon: Globe,
    color: "bg-purple-500",
  },
  {
    id: "academic",
    title: "Academic Discussion",
    description: "Educational and academic topics",
    icon: GraduationCap,
    color: "bg-orange-500",
  },
]

export function ChatPage() {
  const [selectedScenario, setSelectedScenario] = useState(conversationScenarios[0])
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "1",
        role: "assistant",
        content: `Hello! I'm your AI conversation partner. I'm here to help you practice English through natural conversations. 

I can help you with:
- Casual everyday conversations
- Business and professional English
- Travel-related discussions
- Academic topics and debates

What would you like to talk about today? Feel free to ask me questions, share your thoughts, or just have a friendly chat!`,
      },
    ],
  })

  const startScenario = (scenario: (typeof conversationScenarios)[0]) => {
    setSelectedScenario(scenario)
    // In a real app, you would send a system message to set the conversation context
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">AI Conversation Partner</h1>
        <p className="text-gray-600">Practice English through natural conversations with AI</p>
      </div>

      {/* Scenario Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Choose Conversation Type</CardTitle>
          <CardDescription>Select the type of conversation you'd like to practice</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {conversationScenarios.map((scenario) => (
              <div
                key={scenario.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                  selectedScenario.id === scenario.id ? "border-blue-500 bg-blue-50" : "border-gray-200"
                }`}
                onClick={() => startScenario(scenario)}
              >
                <div className={`w-10 h-10 ${scenario.color} rounded-lg flex items-center justify-center mb-3`}>
                  <scenario.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-medium mb-1">{scenario.title}</h3>
                <p className="text-sm text-gray-600">{scenario.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center space-x-2">
                <div className={`w-8 h-8 ${selectedScenario.color} rounded-lg flex items-center justify-center`}>
                  <selectedScenario.icon className="h-4 w-4 text-white" />
                </div>
                <span>{selectedScenario.title}</span>
              </CardTitle>
              <CardDescription>{selectedScenario.description}</CardDescription>
            </CardHeader>

            <CardContent className="flex-1 p-0">
              <ScrollArea className="h-full p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-start space-x-3 ${
                        message.role === "user" ? "flex-row-reverse space-x-reverse" : ""
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          message.role === "user" ? "bg-blue-600" : "bg-gradient-to-r from-purple-600 to-blue-600"
                        }`}
                      >
                        {message.role === "user" ? (
                          <User className="h-4 w-4 text-white" />
                        ) : (
                          <Bot className="h-4 w-4 text-white" />
                        )}
                      </div>
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.role === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r from-purple-600 to-blue-600">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                      <div className="bg-gray-100 p-3 rounded-lg">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>

            <div className="border-t p-4">
              <form onSubmit={handleSubmit} className="flex space-x-2">
                <Input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Type your message..."
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button type="submit" disabled={isLoading || !input.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </Card>
        </div>

        {/* Tips & Suggestions */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                <span>Conversation Tips</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm space-y-2">
                <p>
                  <strong>Be natural:</strong> Speak as you would in real life
                </p>
                <p>
                  <strong>Ask questions:</strong> Keep the conversation flowing
                </p>
                <p>
                  <strong>Use new words:</strong> Try vocabulary you've learned
                </p>
                <p>
                  <strong>Don't worry:</strong> Make mistakes and learn from them
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Suggested Topics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Badge variant="outline" className="w-full justify-start">
                  Tell me about your hobbies
                </Badge>
                <Badge variant="outline" className="w-full justify-start">
                  Describe your hometown
                </Badge>
                <Badge variant="outline" className="w-full justify-start">
                  What's your dream job?
                </Badge>
                <Badge variant="outline" className="w-full justify-start">
                  Favorite travel destination
                </Badge>
                <Badge variant="outline" className="w-full justify-start">
                  Current events discussion
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Session Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Messages sent:</span>
                  <span className="font-medium">{messages.filter((m) => m.role === "user").length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Conversation time:</span>
                  <span className="font-medium">5 min</span>
                </div>
                <div className="flex justify-between">
                  <span>Topic:</span>
                  <span className="font-medium">{selectedScenario.title}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
