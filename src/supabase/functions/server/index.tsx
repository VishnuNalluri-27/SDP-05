import { Hono } from 'npm:hono'
import { cors } from 'npm:hono/cors'
import { logger } from 'npm:hono/logger'
import { createClient } from 'npm:@supabase/supabase-js'
import * as kv from './kv_store.tsx'

const app = new Hono()

// CORS and logging middleware
app.use('*', cors({
  origin: '*',
  allowHeaders: ['*'],
  allowMethods: ['*'],
}))
app.use('*', logger(console.log))

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

// User Registration
app.post('/make-server-9ea2f3eb/auth/signup', async (c) => {
  try {
    const { email, password, name, role = 'citizen' } = await c.req.json()
    
    if (!email || !password || !name) {
      return c.json({ error: 'Email, password, and name are required' }, 400)
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, role },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    })

    if (error) {
      console.log(`Signup error for ${email}: ${error.message}`)
      return c.json({ error: error.message }, 400)
    }

    // Initialize user progress
    if (data.user) {
      await kv.set(`user_progress_${data.user.id}`, {
        userId: data.user.id,
        framework: 0,
        rights: 0,
        duties: 0,
        quizzes: {},
        totalQuizzes: 0,
        averageScore: 0,
        badges: [],
        createdAt: new Date().toISOString()
      })
    }

    return c.json({ 
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata.name,
        role: data.user.user_metadata.role
      }
    })
  } catch (error) {
    console.log(`Signup error: ${error}`)
    return c.json({ error: 'Internal server error during signup' }, 500)
  }
})

// Get user progress
app.get('/make-server-9ea2f3eb/user/progress', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    if (!accessToken) {
      return c.json({ error: 'Authorization token required' }, 401)
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const progress = await kv.get(`user_progress_${user.id}`)
    if (!progress) {
      // Initialize progress if not exists
      const newProgress = {
        userId: user.id,
        framework: 0,
        rights: 0,
        duties: 0,
        quizzes: {},
        totalQuizzes: 0,
        averageScore: 0,
        badges: [],
        createdAt: new Date().toISOString()
      }
      await kv.set(`user_progress_${user.id}`, newProgress)
      return c.json(newProgress)
    }

    return c.json(progress)
  } catch (error) {
    console.log(`Progress fetch error: ${error}`)
    return c.json({ error: 'Failed to fetch progress' }, 500)
  }
})

// Update user progress
app.post('/make-server-9ea2f3eb/user/progress', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    if (!accessToken) {
      return c.json({ error: 'Authorization token required' }, 401)
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const { section, progress: newProgress } = await c.req.json()
    
    const currentProgress = await kv.get(`user_progress_${user.id}`) || {
      userId: user.id,
      framework: 0,
      rights: 0,
      duties: 0,
      quizzes: {},
      totalQuizzes: 0,
      averageScore: 0,
      badges: [],
      createdAt: new Date().toISOString()
    }

    if (section) {
      currentProgress[section] = Math.max(currentProgress[section] || 0, newProgress)
    }

    currentProgress.updatedAt = new Date().toISOString()
    await kv.set(`user_progress_${user.id}`, currentProgress)

    return c.json(currentProgress)
  } catch (error) {
    console.log(`Progress update error: ${error}`)
    return c.json({ error: 'Failed to update progress' }, 500)
  }
})

// Submit quiz result
app.post('/make-server-9ea2f3eb/quiz/submit', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    if (!accessToken) {
      return c.json({ error: 'Authorization token required' }, 401)
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const { quizType, score, totalQuestions, answers, timeSpent } = await c.req.json()
    
    const currentProgress = await kv.get(`user_progress_${user.id}`) || {
      userId: user.id,
      framework: 0,
      rights: 0,
      duties: 0,
      quizzes: {},
      totalQuizzes: 0,
      averageScore: 0,
      badges: [],
      createdAt: new Date().toISOString()
    }

    // Update quiz records
    const quizResult = {
      score,
      totalQuestions,
      percentage: (score / totalQuestions) * 100,
      answers,
      timeSpent,
      completedAt: new Date().toISOString()
    }

    if (!currentProgress.quizzes[quizType]) {
      currentProgress.quizzes[quizType] = []
    }
    currentProgress.quizzes[quizType].push(quizResult)

    // Calculate overall statistics
    const allQuizzes = Object.values(currentProgress.quizzes).flat()
    currentProgress.totalQuizzes = allQuizzes.length
    currentProgress.averageScore = allQuizzes.reduce((sum, quiz) => sum + quiz.percentage, 0) / allQuizzes.length

    // Award badges
    const percentage = quizResult.percentage
    if (percentage === 100 && !currentProgress.badges.includes('Perfect Score')) {
      currentProgress.badges.push('Perfect Score')
    }
    if (percentage >= 90 && !currentProgress.badges.includes('Excellence')) {
      currentProgress.badges.push('Excellence')
    }
    if (currentProgress.totalQuizzes >= 10 && !currentProgress.badges.includes('Quiz Master')) {
      currentProgress.badges.push('Quiz Master')
    }

    currentProgress.updatedAt = new Date().toISOString()
    await kv.set(`user_progress_${user.id}`, currentProgress)

    return c.json({ 
      result: quizResult,
      progress: currentProgress,
      newBadges: currentProgress.badges
    })
  } catch (error) {
    console.log(`Quiz submission error: ${error}`)
    return c.json({ error: 'Failed to submit quiz' }, 500)
  }
})

// Get quiz history
app.get('/make-server-9ea2f3eb/quiz/history', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    if (!accessToken) {
      return c.json({ error: 'Authorization token required' }, 401)
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const progress = await kv.get(`user_progress_${user.id}`)
    return c.json(progress?.quizzes || {})
  } catch (error) {
    console.log(`Quiz history error: ${error}`)
    return c.json({ error: 'Failed to fetch quiz history' }, 500)
  }
})

// Discussion forum - Create post
app.post('/make-server-9ea2f3eb/forum/posts', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    if (!accessToken) {
      return c.json({ error: 'Authorization token required' }, 401)
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const { title, content, category } = await c.req.json()
    const postId = `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const post = {
      id: postId,
      title,
      content,
      category,
      authorId: user.id,
      authorName: user.user_metadata.name,
      authorRole: user.user_metadata.role,
      createdAt: new Date().toISOString(),
      replies: [],
      likes: 0,
      likedBy: []
    }

    await kv.set(`forum_post_${postId}`, post)
    
    // Add to category index
    const categoryPosts = await kv.get(`forum_category_${category}`) || []
    categoryPosts.unshift(postId)
    await kv.set(`forum_category_${category}`, categoryPosts)

    return c.json(post)
  } catch (error) {
    console.log(`Forum post creation error: ${error}`)
    return c.json({ error: 'Failed to create post' }, 500)
  }
})

// Get forum posts by category
app.get('/make-server-9ea2f3eb/forum/posts/:category', async (c) => {
  try {
    const category = c.req.param('category')
    const postIds = await kv.get(`forum_category_${category}`) || []
    
    const posts = []
    for (const postId of postIds.slice(0, 20)) { // Limit to 20 posts
      const post = await kv.get(`forum_post_${postId}`)
      if (post) posts.push(post)
    }

    return c.json(posts)
  } catch (error) {
    console.log(`Forum posts fetch error: ${error}`)
    return c.json({ error: 'Failed to fetch posts' }, 500)
  }
})

// Add reply to forum post
app.post('/make-server-9ea2f3eb/forum/posts/:postId/replies', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    if (!accessToken) {
      return c.json({ error: 'Authorization token required' }, 401)
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const postId = c.req.param('postId')
    const { content } = await c.req.json()
    
    const post = await kv.get(`forum_post_${postId}`)
    if (!post) {
      return c.json({ error: 'Post not found' }, 404)
    }

    const reply = {
      id: `reply_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      content,
      authorId: user.id,
      authorName: user.user_metadata.name,
      authorRole: user.user_metadata.role,
      createdAt: new Date().toISOString(),
      likes: 0,
      likedBy: []
    }

    post.replies.push(reply)
    await kv.set(`forum_post_${postId}`, post)

    return c.json(reply)
  } catch (error) {
    console.log(`Forum reply error: ${error}`)
    return c.json({ error: 'Failed to add reply' }, 500)
  }
})

// Chat history for Niti ChatBot
app.get('/make-server-9ea2f3eb/chat/history', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    if (!accessToken) {
      return c.json({ error: 'Authorization token required' }, 401)
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const history = await kv.get(`chat_history_${user.id}`) || []
    return c.json(history)
  } catch (error) {
    console.log(`Chat history error: ${error}`)
    return c.json({ error: 'Failed to fetch chat history' }, 500)
  }
})

// Save chat message
app.post('/make-server-9ea2f3eb/chat/message', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    if (!accessToken) {
      return c.json({ error: 'Authorization token required' }, 401)
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const { message, response } = await c.req.json()
    
    const history = await kv.get(`chat_history_${user.id}`) || []
    const chatEntry = {
      id: `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      message,
      response,
      timestamp: new Date().toISOString()
    }
    
    history.unshift(chatEntry)
    // Keep only last 50 conversations
    if (history.length > 50) {
      history.splice(50)
    }
    
    await kv.set(`chat_history_${user.id}`, history)
    return c.json(chatEntry)
  } catch (error) {
    console.log(`Chat message save error: ${error}`)
    return c.json({ error: 'Failed to save chat message' }, 500)
  }
})

// Admin dashboard - Get all users (admin only)
app.get('/make-server-9ea2f3eb/admin/users', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    if (!accessToken) {
      return c.json({ error: 'Authorization token required' }, 401)
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    if (!user || error || user.user_metadata.role !== 'admin') {
      return c.json({ error: 'Admin access required' }, 403)
    }

    // Get user progress data
    const progressData = await kv.getByPrefix('user_progress_')
    const userStats = progressData.map(progress => ({
      userId: progress.userId,
      totalQuizzes: progress.totalQuizzes,
      averageScore: progress.averageScore,
      badges: progress.badges,
      lastActive: progress.updatedAt || progress.createdAt
    }))

    return c.json(userStats)
  } catch (error) {
    console.log(`Admin users fetch error: ${error}`)
    return c.json({ error: 'Failed to fetch user data' }, 500)
  }
})

// Admin dashboard - Get platform statistics
app.get('/make-server-9ea2f3eb/admin/stats', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    if (!accessToken) {
      return c.json({ error: 'Authorization token required' }, 401)
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    if (!user || error || user.user_metadata.role !== 'admin') {
      return c.json({ error: 'Admin access required' }, 403)
    }

    const progressData = await kv.getByPrefix('user_progress_')
    const forumPosts = await kv.getByPrefix('forum_post_')
    
    const stats = {
      totalUsers: progressData.length,
      totalQuizzes: progressData.reduce((sum, p) => sum + (p.totalQuizzes || 0), 0),
      averageScore: progressData.length > 0 ? 
        progressData.reduce((sum, p) => sum + (p.averageScore || 0), 0) / progressData.length : 0,
      totalForumPosts: forumPosts.length,
      activeUsers: progressData.filter(p => {
        const lastActive = new Date(p.updatedAt || p.createdAt)
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        return lastActive > weekAgo
      }).length
    }

    return c.json(stats)
  } catch (error) {
    console.log(`Admin stats error: ${error}`)
    return c.json({ error: 'Failed to fetch statistics' }, 500)
  }
})

// Health check
app.get('/make-server-9ea2f3eb/health', (c) => {
  return c.json({ status: 'healthy', timestamp: new Date().toISOString() })
})

Deno.serve(app.fetch)