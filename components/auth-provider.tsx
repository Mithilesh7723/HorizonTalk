"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"
import { UserService } from "@/lib/user-service"
import { useRouter, usePathname } from "next/navigation"

interface AuthContextType {
  user: User | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [initialLoad, setInitialLoad] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Check if user profile exists, create if not
        try {
          const profile = await UserService.getUserProfile(user.uid)
          if (!profile) {
            await UserService.createUserProfile(user)
          } else {
            // Update last login
            await UserService.updateUserProfile(user.uid, { lastLoginAt: Date.now() })
          }
        } catch (error) {
          console.error("Error handling user profile:", error)
        }

        // Only redirect if this is the initial load, user is on landing page,
        // and they haven't intentionally navigated to the landing page
        if (initialLoad && pathname === "/" && !sessionStorage.getItem("intentional-landing-visit")) {
          // Small delay to ensure smooth transition
          setTimeout(() => {
            router.push("/dashboard")
          }, 100)
        }
      }

      setUser(user)
      setLoading(false)
      setInitialLoad(false)
    })

    return unsubscribe
  }, [router, pathname, initialLoad])

  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>
}
