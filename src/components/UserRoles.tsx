import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { User, BookOpen, Shield, Gavel } from 'lucide-react';

interface UserRolesProps {
  currentUser: 'citizen' | 'educator' | 'admin' | 'legal-expert';
  setCurrentUser: (role: 'citizen' | 'educator' | 'admin' | 'legal-expert') => void;
}

export function UserRoles({ currentUser, setCurrentUser }: UserRolesProps) {
  const roles = [
    {
      id: 'citizen' as const,
      icon: User,
      title: 'Citizen',
      description: 'Explore content, participate in discussions, and engage with educational resources',
      color: 'bg-blue-500',
      features: ['Access all content', 'Take quizzes', 'Join discussions', 'Track progress']
    },
    {
      id: 'educator' as const,
      icon: BookOpen,
      title: 'Educator',
      description: 'Create educational content, conduct interactive sessions, and provide insights',
      color: 'bg-green-500',
      features: ['Create content', 'Host sessions', 'Moderate discussions', 'Analytics access']
    },
    {
      id: 'admin' as const,
      icon: Shield,
      title: 'Admin',
      description: 'Oversee platform content, manage user roles, and ensure information accuracy',
      color: 'bg-red-500',
      features: ['User management', 'Content oversight', 'Platform analytics', 'System configuration']
    },
    {
      id: 'legal-expert' as const,
      icon: Gavel,
      title: 'Legal Expert',
      description: 'Offer legal insights, update constitutional content, and provide guidance',
      color: 'bg-purple-500',
      features: ['Legal insights', 'Content validation', 'Expert guidance', 'Case law updates']
    }
  ];

  return (
    <div className="mb-8">
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Select Your Role</h2>
        <p className="text-gray-600">Choose your role to access personalized features and content</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {roles.map((role) => (
          <Card 
            key={role.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              currentUser === role.id 
                ? 'ring-2 ring-blue-500 bg-blue-50' 
                : 'hover:shadow-md'
            }`}
            onClick={() => setCurrentUser(role.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 ${role.color} rounded-full flex items-center justify-center`}>
                  <role.icon className="w-5 h-5 text-white" />
                </div>
                {currentUser === role.id && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    Active
                  </Badge>
                )}
              </div>
              <CardTitle className="text-lg">{role.title}</CardTitle>
              <CardDescription className="text-sm">
                {role.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {role.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                    <span className="text-sm text-gray-600">{feature}</span>
                  </div>
                ))}
              </div>
              {currentUser !== role.id && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-3"
                  onClick={() => setCurrentUser(role.id)}
                >
                  Switch to {role.title}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}