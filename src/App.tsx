import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { ScrollArea } from './components/ui/scroll-area';
import { Progress } from './components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from './components/ui/avatar';
import { Separator } from './components/ui/separator';
import { 
  BookOpen, 
  Scale, 
  Users, 
  Award, 
  User, 
  Shield, 
  Gavel,
  BookText,
  CheckCircle,
  ChevronRight,
  Clock,
  Target,
  MessageCircle,
  LogIn,
  LogOut,
  UserPlus
} from 'lucide-react';
import { ConstitutionFramework } from './components/ConstitutionFramework';
import { FundamentalRights } from './components/FundamentalRights';
import { CitizensDuties } from './components/CitizensDuties';
import { InteractiveQuiz } from './components/InteractiveQuiz';
import { UserRoles } from './components/UserRoles';
import { NitiChatBot } from './components/NitiChatBot';
import { DiscussionForum } from './components/DiscussionForum';
import { ConstitutionLibrary } from './components/ConstitutionLibrary';
import { AuthModal } from './components/AuthModal';

import { AuthProvider, useAuth } from './contexts/AuthContext';

function AppContent() {
  const { user, progress, signOut, updateProgress } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  
  const localProgress = (completedSections.length / 5) * 100;

  const userRoleConfig = {
    citizen: { icon: User, color: 'bg-blue-500', label: 'Citizen' },
    educator: { icon: BookOpen, color: 'bg-green-500', label: 'Educator' },
    admin: { icon: Shield, color: 'bg-red-500', label: 'Admin' },
    'legal-expert': { icon: Gavel, color: 'bg-purple-500', label: 'Legal Expert' }
  };

  const currentRole = user ? userRoleConfig[user.role as keyof typeof userRoleConfig] : userRoleConfig.citizen;

  const markSectionComplete = async (sectionId: string) => {
    if (!completedSections.includes(sectionId)) {
      setCompletedSections([...completedSections, sectionId]);
      if (user) {
        const sectionProgress = Math.min(100, (completedSections.length + 1) * 20);
        await updateProgress(sectionId, sectionProgress);
      }
    }
  };

  const openAuthModal = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-2 border-orange-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Scale className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
              <h1 className="text-lg sm:text-xl font-bold text-gray-800">Samvidhan 360</h1>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              {user ? (
                <>
                  <div className="hidden sm:flex items-center space-x-2">
                    <div className={`w-8 h-8 ${currentRole.color} rounded-full flex items-center justify-center`}>
                      <currentRole.icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{user.name}</div>
                      <div className="text-xs text-gray-500">{currentRole.label}</div>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center space-x-2">
                    <Target className="w-4 h-4 text-gray-500" />
                    <Progress value={progress?.averageScore || localProgress} className="w-20 sm:w-24" />
                    <span className="text-sm text-gray-600">
                      {Math.round(progress?.averageScore || localProgress)}%
                    </span>
                  </div>
                  <Button variant="outline" size="sm" onClick={signOut}>
                    <LogOut className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Sign Out</span>
                  </Button>
                </>
              ) : (
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <Button variant="outline" size="sm" onClick={() => openAuthModal('signin')}>
                    <LogIn className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Sign In</span>
                  </Button>
                  <Button size="sm" onClick={() => openAuthModal('signup')}>
                    <UserPlus className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Sign Up</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Welcome Section */}
        <div className="mb-6 sm:mb-8">
          <Card className="bg-gradient-to-r from-orange-100 to-green-100 border-none">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-3 sm:space-x-6 w-full sm:w-auto">
                  <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-orange-600 rounded-full flex-shrink-0">
                    <Scale className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <div className="flex-1 sm:flex-none">
                    <h2 className="text-lg sm:text-2xl font-bold text-gray-800 mb-1 sm:mb-2">
                      Welcome to Constitutional Learning
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600">
                      Explore the Indian Constitution with interactive learning modules designed for your role as a {currentRole.label.toLowerCase()}.
                    </p>
                  </div>
                </div>
                <div className="text-center sm:text-right w-full sm:w-auto">
                  <div className="text-2xl sm:text-3xl font-bold text-orange-600">
                    {user ? progress?.totalQuizzes || 0 : 0}
                  </div>
                  <div className="text-sm text-gray-600">Quizzes Completed</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="framework" className="space-y-4 sm:space-y-6">
          <div className="w-full overflow-x-auto">
            <TabsList className="inline-flex w-auto min-w-full sm:grid sm:w-full sm:grid-cols-4 lg:grid-cols-8 h-auto p-1">
              <TabsTrigger value="framework" className="flex items-center space-x-1 sm:space-x-2 whitespace-nowrap px-2 sm:px-3">
                <Scale className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm">Framework</span>
              </TabsTrigger>
              <TabsTrigger value="rights" className="flex items-center space-x-1 sm:space-x-2 whitespace-nowrap px-2 sm:px-3">
                <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm">Rights</span>
              </TabsTrigger>
              <TabsTrigger value="duties" className="flex items-center space-x-1 sm:space-x-2 whitespace-nowrap px-2 sm:px-3">
                <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm">Duties</span>
              </TabsTrigger>
              <TabsTrigger value="library" className="flex items-center space-x-1 sm:space-x-2 whitespace-nowrap px-2 sm:px-3">
                <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm">Library</span>
              </TabsTrigger>
              <TabsTrigger value="quiz" className="flex items-center space-x-1 sm:space-x-2 whitespace-nowrap px-2 sm:px-3">
                <Award className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm">Quiz</span>
              </TabsTrigger>
              <TabsTrigger value="roles" className="flex items-center space-x-1 sm:space-x-2 whitespace-nowrap px-2 sm:px-3">
                <User className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm">Roles</span>
              </TabsTrigger>
              <TabsTrigger value="forum" className="flex items-center space-x-1 sm:space-x-2 whitespace-nowrap px-2 sm:px-3">
                <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm">Forum</span>
              </TabsTrigger>
              <TabsTrigger value="chatbot" className="flex items-center space-x-1 sm:space-x-2 whitespace-nowrap px-2 sm:px-3">
                <BookText className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm">Niti Chat</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="framework">
            <ConstitutionFramework 
              userRole={user?.role || 'citizen'} 
              onComplete={() => markSectionComplete('framework')}
            />
          </TabsContent>

          <TabsContent value="rights">
            <FundamentalRights 
              userRole={user?.role || 'citizen'} 
              onComplete={() => markSectionComplete('rights')}
            />
          </TabsContent>

          <TabsContent value="duties">
            <CitizensDuties 
              userRole={user?.role || 'citizen'} 
              onComplete={() => markSectionComplete('duties')}
            />
          </TabsContent>

          <TabsContent value="library">
            <ConstitutionLibrary 
              userRole={user?.role || 'citizen'} 
            />
          </TabsContent>

          <TabsContent value="quiz">
            <InteractiveQuiz 
              userRole={user?.role || 'citizen'} 
              onComplete={() => markSectionComplete('quiz')}
            />
          </TabsContent>

          <TabsContent value="roles">
            <UserRoles currentUser={user?.role || 'citizen'} />
          </TabsContent>

          <TabsContent value="forum">
            <DiscussionForum />
          </TabsContent>

          <TabsContent value="chatbot">
            <NitiChatBot userRole={user?.role || 'citizen'} />
          </TabsContent>
        </Tabs>

        {/* Progress Dashboard */}
        {user && progress && (
          <div className="mt-6 sm:mt-8">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg sm:text-xl">Your Learning Journey</CardTitle>
                <CardDescription className="text-sm">Track your constitutional learning progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                  <div className="text-center p-2 sm:p-0">
                    <div className="text-lg sm:text-2xl font-bold text-blue-600">{progress.totalQuizzes}</div>
                    <div className="text-xs sm:text-sm text-gray-600">Total Quizzes</div>
                  </div>
                  <div className="text-center p-2 sm:p-0">
                    <div className="text-lg sm:text-2xl font-bold text-green-600">
                      {Math.round(progress.averageScore)}%
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">Average Score</div>
                  </div>
                  <div className="text-center p-2 sm:p-0">
                    <div className="text-lg sm:text-2xl font-bold text-purple-600">{progress.badges.length}</div>
                    <div className="text-xs sm:text-sm text-gray-600">Badges Earned</div>
                  </div>
                  <div className="text-center p-2 sm:p-0">
                    <div className="text-lg sm:text-2xl font-bold text-orange-600">
                      {Math.round((progress.framework + progress.rights + progress.duties) / 3)}%
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">Content Progress</div>
                  </div>
                </div>
                
                {progress.badges.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2 text-sm sm:text-base">Your Badges:</h4>
                    <div className="flex flex-wrap gap-2">
                      {progress.badges.map((badge, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          <Award className="w-3 h-3 mr-1" />
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}