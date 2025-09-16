"use client"
import { useSession } from "next-auth/react"
import { useEffect } from "react"

export default function SessionManager() {
  const { data: session, status } = useSession()

  useEffect(() => {
    if (session?.user) {
      // Save complete session to localStorage
      const sessionData = {
        user: {
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
          image: session.user.image
        },
        expires: session.expires,
        lastUpdated: new Date().toISOString()
      }
      
      localStorage.setItem('session', JSON.stringify(sessionData))
      console.log("Session saved to localStorage:", sessionData)
      
    } else if (status === "unauthenticated") {
      // Clear localStorage when user signs out
      localStorage.removeItem('session')
      localStorage.removeItem('user')
      console.log("Session cleared from localStorage")
    }
  }, [session, status])

  return null
}