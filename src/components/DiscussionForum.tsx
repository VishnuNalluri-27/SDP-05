import React, { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { useAuth } from '../contexts/AuthContext'
import { MessageSquare, Plus, Heart, Clock, User } from 'lucide-react'
import { projectId, publicAnonKey } from '../utils/supabase/info'

interface ForumPost {
  id: string
  title: string
  content: string
  category: string
  authorId: string
  authorName: string
  authorRole: string
  createdAt: string
  replies: Reply[]
  likes: number
  likedBy: string[]
}

interface Reply {
  id: string
  content: string
  authorId: string
  authorName: string
  authorRole: string
  createdAt: string
  likes: number
  likedBy: string[]
}

const categories = [
  'fundamental-rights',
  'directive-principles',
  'constitutional-amendments',
  'judicial-system',
  'governance',
  'citizenship',
  'general-discussion'
]

const categoryLabels: Record<string, string> = {
  'fundamental-rights': 'Fundamental Rights',
  'directive-principles': 'Directive Principles',
  'constitutional-amendments': 'Constitutional Amendments',
  'judicial-system': 'Judicial System',
  'governance': 'Governance',
  'citizenship': 'Citizenship',
  'general-discussion': 'General Discussion'
}

export function DiscussionForum() {
  const { user } = useAuth()
  const [selectedCategory, setSelectedCategory] = useState('general-discussion')
  const [posts, setPosts] = useState<ForumPost[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showNewPostDialog, setShowNewPostDialog] = useState(false)
  const [newPostTitle, setNewPostTitle] = useState('')
  const [newPostContent, setNewPostContent] = useState('')
  const [newPostCategory, setNewPostCategory] = useState('general-discussion')
  const [expandedPost, setExpandedPost] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')

  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-9ea2f3eb${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
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

  const fetchPosts = async (category: string) => {
    setIsLoading(true)
    try {
      const postsData = await apiCall(`/forum/posts/${category}`)
      setPosts(postsData)
    } catch (error) {
      console.error('Failed to fetch posts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const createPost = async () => {
    if (!user || !newPostTitle.trim() || !newPostContent.trim()) return

    try {
      const post = await apiCall('/forum/posts', {
        method: 'POST',
        body: JSON.stringify({
          title: newPostTitle,
          content: newPostContent,
          category: newPostCategory
        }),
      })

      setPosts(prev => [post, ...prev])
      setNewPostTitle('')
      setNewPostContent('')
      setNewPostCategory('general-discussion')
      setShowNewPostDialog(false)
    } catch (error) {
      console.error('Failed to create post:', error)
    }
  }

  const addReply = async (postId: string) => {
    if (!user || !replyContent.trim()) return

    try {
      const reply = await apiCall(`/forum/posts/${postId}/replies`, {
        method: 'POST',
        body: JSON.stringify({ content: replyContent }),
      })

      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, replies: [...post.replies, reply] }
          : post
      ))
      setReplyContent('')
    } catch (error) {
      console.error('Failed to add reply:', error)
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 24 * 7) return `${Math.floor(diffInHours / 24)}d ago`
    return date.toLocaleDateString()
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800'
      case 'legal_expert': return 'bg-purple-100 text-purple-800'
      case 'educator': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  useEffect(() => {
    fetchPosts(selectedCategory)
  }, [selectedCategory])

  if (!user) {
    return (
      <div className="text-center py-12">
        <MessageSquare className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl mb-2">Join the Discussion</h3>
        <p className="text-gray-600">Sign in to participate in constitutional discussions</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl">Discussion Forum</h2>
        <Dialog open={showNewPostDialog} onOpenChange={setShowNewPostDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Discussion</DialogTitle>
              <DialogDescription>
                Start a new conversation about constitutional topics, share insights, or ask questions to engage with the community.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  placeholder="Enter discussion title"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={newPostCategory} onValueChange={setNewPostCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>
                        {categoryLabels[cat]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="Share your thoughts..."
                  rows={6}
                />
              </div>
              <Button onClick={createPost} className="w-full">
                Create Post
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
          >
            {categoryLabels[category]}
          </Button>
        ))}
      </div>

      {/* Posts */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8">Loading discussions...</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">No discussions yet in this category</p>
          </div>
        ) : (
          posts.map(post => (
            <Card key={post.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{post.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={getRoleColor(post.authorRole)}>
                        {post.authorRole.replace('_', ' ')}
                      </Badge>
                      <span className="text-sm text-gray-600">by {post.authorName}</span>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Clock className="w-3 h-3" />
                        {formatTimeAgo(post.createdAt)}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                  >
                    <MessageSquare className="w-4 h-4 mr-1" />
                    {post.replies.length}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">{post.content}</p>
                
                {expandedPost === post.id && (
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-3">Replies ({post.replies.length})</h4>
                    
                    {/* Add Reply */}
                    <div className="mb-4">
                      <Textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="Add your reply..."
                        rows={3}
                        className="mb-2"
                      />
                      <Button onClick={() => addReply(post.id)} size="sm">
                        Post Reply
                      </Button>
                    </div>

                    {/* Replies List */}
                    <div className="space-y-3">
                      {post.replies.map(reply => (
                        <div key={reply.id} className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getRoleColor(reply.authorRole)}>
                              {reply.authorRole.replace('_', ' ')}
                            </Badge>
                            <span className="text-sm">{reply.authorName}</span>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Clock className="w-3 h-3" />
                              {formatTimeAgo(reply.createdAt)}
                            </div>
                          </div>
                          <p className="text-sm text-gray-700">{reply.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}