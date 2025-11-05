import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Progress } from './ui/progress'
import { useAuth } from '../contexts/AuthContext'
import { projectId, publicAnonKey } from '../utils/supabase/info'
import { 
  Users, 
  Trophy, 
  BookOpen, 
  MessageSquare, 
  TrendingUp, 
  Award,
  BarChart3,
  Activity
} from 'lucide-react'

interface UserStats {
  userId: string
  totalQuizzes: number
  averageScore: number
  badges: string[]
  lastActive: string
}

interface PlatformStats {
  totalUsers: number
  totalQuizzes: number
  averageScore: number
  totalForumPosts: number
  activeUsers: number
}

export function AdminDashboard() {
  const { user } = useAuth()
  const [userStats, setUserStats] = useState<UserStats[]>([])
  const [platformStats, setPlatformStats] = useState<PlatformStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const apiCall = async (endpoint: string) => {
    const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-9ea2f3eb${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(await response.text())
    }

    return response.json()
  }

  const fetchData = async () => {
    if (!user || user.role !== 'admin') {
      setError('Admin access required')
      setIsLoading(false)
      return
    }

    try {
      const [users, stats] = await Promise.all([
        apiCall('/admin/users'),
        apiCall('/admin/stats')
      ])

      setUserStats(users)
      setPlatformStats(stats)
    } catch (err) {
      setError('Failed to fetch admin data')
      console.error('Admin data fetch error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [user])

  if (!user || user.role !== 'admin') {
    return (
      <div className="text-center py-12">
        <Activity className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl mb-2">Admin Access Required</h3>
        <p className="text-gray-600">This dashboard is only available to administrators</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
        <Button onClick={fetchData} className="mt-4">
          Retry
        </Button>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Admin Dashboard</h2>
          <p className="text-gray-600">Platform analytics and user management</p>
        </div>
        <Button onClick={fetchData} variant="outline">
          <Activity className="w-4 h-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {/* Platform Overview */}
      {platformStats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{platformStats.totalUsers}</p>
                  <p className="text-sm text-gray-600">Total Users</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Trophy className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{platformStats.totalQuizzes}</p>
                  <p className="text-sm text-gray-600">Total Quizzes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-8 h-8 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">{Math.round(platformStats.averageScore)}%</p>
                  <p className="text-sm text-gray-600">Average Score</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-8 h-8 text-orange-500" />
                <div>
                  <p className="text-2xl font-bold">{platformStats.totalForumPosts}</p>
                  <p className="text-sm text-gray-600">Forum Posts</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-8 h-8 text-red-500" />
                <div>
                  <p className="text-2xl font-bold">{platformStats.activeUsers}</p>
                  <p className="text-sm text-gray-600">Active Users</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Detailed Analytics */}
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">User Analytics</TabsTrigger>
          <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Performance Overview</CardTitle>
              <CardDescription>Detailed view of all registered users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userStats.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No user data available</p>
                ) : (
                  userStats.map((userStat, index) => (
                    <div key={userStat.userId} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">User #{index + 1}</p>
                          <p className="text-sm text-gray-600">Last active: {formatDate(userStat.lastActive)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <p className="text-lg font-bold">{userStat.totalQuizzes}</p>
                          <p className="text-xs text-gray-600">Quizzes</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold">{Math.round(userStat.averageScore)}%</p>
                          <p className="text-xs text-gray-600">Avg Score</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold">{userStat.badges.length}</p>
                          <p className="text-xs text-gray-600">Badges</p>
                        </div>
                        <div className="w-24">
                          <Progress value={userStat.averageScore} className="h-2" />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quiz Performance Distribution</CardTitle>
                <CardDescription>Score ranges across all users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { range: '90-100%', count: userStats.filter(u => u.averageScore >= 90).length, color: 'bg-green-500' },
                    { range: '75-89%', count: userStats.filter(u => u.averageScore >= 75 && u.averageScore < 90).length, color: 'bg-blue-500' },
                    { range: '60-74%', count: userStats.filter(u => u.averageScore >= 60 && u.averageScore < 75).length, color: 'bg-yellow-500' },
                    { range: 'Below 60%', count: userStats.filter(u => u.averageScore < 60).length, color: 'bg-red-500' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded ${item.color}`}></div>
                      <span className="text-sm font-medium w-20">{item.range}</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`${item.color} h-2 rounded-full`}
                          style={{ width: `${userStats.length > 0 ? (item.count / userStats.length) * 100 : 0}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">{item.count} users</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Badge Statistics</CardTitle>
                <CardDescription>Most earned badges across platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(() => {
                    const badgeCounts: Record<string, number> = {}
                    userStats.forEach(user => {
                      user.badges.forEach(badge => {
                        badgeCounts[badge] = (badgeCounts[badge] || 0) + 1
                      })
                    })
                    return Object.entries(badgeCounts)
                      .sort(([,a], [,b]) => b - a)
                      .slice(0, 5)
                      .map(([badge, count]) => (
                        <div key={badge} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Award className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm">{badge}</span>
                          </div>
                          <Badge variant="secondary">{count} earned</Badge>
                        </div>
                      ))
                  })()}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}