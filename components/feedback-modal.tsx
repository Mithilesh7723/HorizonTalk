"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Star, Send } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth-provider"

interface FeedbackModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function FeedbackModal({ open, onOpenChange }: FeedbackModalProps) {
  const [rating, setRating] = useState("")
  const [category, setCategory] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { toast } = useToast()
  const { user } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?.uid,
          userEmail: user?.email,
          rating: Number.parseInt(rating),
          category,
          subject,
          message,
        }),
      })

      if (response.ok) {
        toast({
          title: "Feedback sent!",
          description: "Thank you for your feedback. We appreciate your input!",
        })

        // Reset form
        setRating("")
        setCategory("")
        setSubject("")
        setMessage("")
        onOpenChange(false)
      } else {
        throw new Error("Failed to send feedback")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send feedback. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center space-x-2 text-xl">
            <Star className="h-5 w-5 text-yellow-500" />
            <span>Share Your Feedback</span>
          </DialogTitle>
          <DialogDescription className="text-sm">
            Help us improve HorizonTalk by sharing your thoughts and suggestions.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rating */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">How would you rate your experience?</Label>
            <RadioGroup value={rating} onValueChange={setRating} className="flex space-x-4">
              {[1, 2, 3, 4, 5].map((value) => (
                <div key={value} className="flex items-center space-x-1">
                  <RadioGroupItem value={value.toString()} id={`rating-${value}`} />
                  <Label htmlFor={`rating-${value}`} className="text-sm cursor-pointer">
                    {value}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Feedback Category</Label>
            <RadioGroup value={category} onValueChange={setCategory} className="space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="feature-request" id="feature-request" />
                <Label htmlFor="feature-request" className="text-sm cursor-pointer">
                  Feature Request
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bug-report" id="bug-report" />
                <Label htmlFor="bug-report" className="text-sm cursor-pointer">
                  Bug Report
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="general-feedback" id="general-feedback" />
                <Label htmlFor="general-feedback" className="text-sm cursor-pointer">
                  General Feedback
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ui-ux" id="ui-ux" />
                <Label htmlFor="ui-ux" className="text-sm cursor-pointer">
                  UI/UX Improvement
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="feedback-subject" className="text-sm font-medium">
              Subject
            </Label>
            <Input
              id="feedback-subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Brief description of your feedback"
              required
            />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="feedback-message" className="text-sm font-medium">
              Details
            </Label>
            <Textarea
              id="feedback-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Please provide detailed feedback..."
              required
              className="min-h-[80px] resize-none"
            />
          </div>

          <div className="flex space-x-3 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !rating || !category}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Feedback
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
