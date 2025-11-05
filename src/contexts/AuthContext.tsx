import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../utils/supabase/client'
import { projectId, publicAnonKey } from '../utils/supabase/info'

interface User {
  id: string
  email: string
  name: string
  role: string
}

interface Progress {
  userId: string
  framework: number
  rights: number
  duties: number
  quizzes: Record<string, any[]>
  totalQuizzes: number
  averageScore: number
  badges: string[]
  createdAt: string
  updatedAt?: string
}

interface AuthContextType {
  user: User | null
  progress: Progress | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signUp: (email: string, password: string, name: string, role: string) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
  updateProgress: (section: string, progressValue: number) => Promise<void>
  submitQuiz: (quizType: string, score: number, totalQuestions: number, answers: any[], timeSpent: number) => Promise<any>
  refreshProgress: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [progress, setProgress] = useState<Progress | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    const session = await supabase.auth.getSession()
    const token = session.data.session?.access_token || publicAnonKey

    const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-9ea2f3eb${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(error || 'API request failed')
    }

    return response.json()
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      
      if (error) {
        return { success: false, error: error.message }
      }

      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email!,
          name: data.user.user_metadata.name,
          role: data.user.user_metadata.role
        })
        await fetchProgress()
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: 'Sign in failed' }
    }
  }

  const signUp = async (email: string, password: string, name: string, role: string) => {
    try {
      const result = await apiCall('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password, name, role }),
      })

      if (result.error) {
        return { success: false, error: result.error }
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: 'Sign up failed' }
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProgress(null)
  }

  const fetchProgress = async () => {
    try {
      const progressData = await apiCall('/user/progress')
      setProgress(progressData)
    } catch (error) {
      console.error('Failed to fetch progress:', error)
    }
  }

  const updateProgress = async (section: string, progressValue: number) => {
    try {
      const updatedProgress = await apiCall('/user/progress', {
        method: 'POST',
        body: JSON.stringify({ section, progress: progressValue }),
      })
      setProgress(updatedProgress)
    } catch (error) {
      console.error('Failed to update progress:', error)
    }
  }

  const submitQuiz = async (quizType: string, score: number, totalQuestions: number, answers: any[], timeSpent: number) => {
    try {
      const result = await apiCall('/quiz/submit', {
        method: 'POST',
        body: JSON.stringify({ quizType, score, totalQuestions, answers, timeSpent }),
      })
      setProgress(result.progress)
      return result
    } catch (error) {
      console.error('Failed to submit quiz:', error)
      throw error
    }
  }

  const refreshProgress = async () => {
    if (user) {
      await fetchProgress()
    }
  }

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email!,
            name: session.user.user_metadata.name,
            role: session.user.user_metadata.role
          })
          await fetchProgress()
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        setUser(null)
        setProgress(null)
      } else if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata.name,
          role: session.user.user_metadata.role
        })
        await fetchProgress()
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{
      user,
      progress,
      isLoading,
      signIn,
      signUp,
      signOut,
      updateProgress,
      submitQuiz,
      refreshProgress
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}