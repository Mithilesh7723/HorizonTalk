"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Settings, Save, Mail, Calendar, Edit3 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth-provider"
import { updateProfile } from "firebase/auth"
import { UserService } from "@/lib/user-service"

interface SettingsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const [displayName, setDisplayName] = useState("")
  const [bio, setBio] = useState("")
  const [learningGoals, setLearningGoals] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)
  const [userProfile, setUserProfile] = useState<any>(null)

  const { toast } = useToast()
  const { user } = useAuth()

  useEffect(() => {
    if (user && open) {
      setDisplayName(user.displayName || "")
      loadUserProfile()
    }
  }, [user, open])

  const loadUserProfile = async () => {
    if (!user) return

    try {
      const profile = await UserService.getUserProfile(user.uid)
      if (profile) {
        setUserProfile(profile)
        setBio(profile.bio || "")
        setLearningGoals(profile.learningGoals || "")
      }
    } catch (error) {
      console.error("Error loading user profile:", error)
    }
  }

  const handleSave = async () => {
    if (!user) return

    setIsUpdating(true)
    try {
      // Update Firebase Auth profile
      if (displayName !== user.displayName) {
        await updateProfile(user, { displayName })
      }

      // Update user profile in database
      await UserService.updateUserProfile(user.uid, {
        displayName,
        bio,
        learningGoals,
        updatedAt: Date.now(),
      })

      toast({
        title: "Profile updated!",
        description: "Your profile information has been saved successfully.",
      })

      onOpenChange(false)
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6">
          <DialogTitle className="flex items-center space-x-2 text-2xl">
            <Settings className="h-6 w-6 text-blue-600" />
            <span>Profile Settings</span>
          </DialogTitle>
          <DialogDescription>Manage your profile information and learning preferences.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Header */}
          <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xl font-semibold">
                {user?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">{user?.displayName || user?.email?.split("@")[0]}</h3>
              <p className="text-sm text-gray-600 flex items-center">
                <Mail className="h-4 w-4 mr-1" />
                {user?.email}
              </p>
              {userProfile?.createdAt && (
                <p className="text-xs text-gray-500 flex items-center mt-1">
                  <Calendar className="h-3 w-3 mr-1" />
                  Member since {formatDate(userProfile.createdAt)}
                </p>
              )}
            </div>
          </div>

          {/* Profile Stats */}
          {userProfile && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-xl font-bold text-blue-600">{userProfile.totalSessions || 0}</div>
                <div className="text-xs text-gray-600">Sessions</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-xl font-bold text-green-600">{userProfile.vocabularyLearned || 0}</div>
                <div className="text-xs text-gray-600">Words Learned</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-xl font-bold text-purple-600">{userProfile.speakingTime || 0}m</div>
                <div className="text-xs text-gray-600">Speaking Time</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-xl font-bold text-orange-600">{userProfile.fluencyScore || 0}%</div>
                <div className="text-xs text-gray-600">Fluency Score</div>
              </div>
            </div>
          )}

          {/* Edit Profile Form */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Edit3 className="h-5 w-5 text-gray-600" />
              <h4 className="text-lg font-medium">Edit Profile</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="displayName" className="text-sm font-medium">
                  Display Name
                </Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter your display name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <Input id="email" value={user?.email || ""} disabled className="bg-gray-50" />
                <p className="text-xs text-gray-500">Email cannot be changed</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio" className="text-sm font-medium">
                Bio
              </Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself and your English learning journey..."
                className="min-h-[80px] resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="learningGoals" className="text-sm font-medium">
                Learning Goals
              </Label>
              <Textarea
                id="learningGoals"
                value={learningGoals}
                onChange={(e) => setLearningGoals(e.target.value)}
                placeholder="What are your English learning goals? (e.g., improve business communication, prepare for IELTS, etc.)"
                className="min-h-[80px] resize-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isUpdating}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isUpdating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
