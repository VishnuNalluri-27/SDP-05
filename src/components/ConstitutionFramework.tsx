import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { 
  BookOpen, 
  Calendar, 
  Users, 
  Gavel, 
  Building, 
  ChevronRight,
  CheckCircle,
  Star
} from 'lucide-react';

interface ConstitutionFrameworkProps {
  userRole: 'citizen' | 'educator' | 'admin' | 'legal-expert';
  onComplete: () => void;
}

export function ConstitutionFramework({ userRole, onComplete }: ConstitutionFrameworkProps) {
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  
  const sections = [
    {
      id: 'preamble',
      title: 'The Preamble',
      icon: Star,
      content: 'The Preamble to the Constitution of India is a brief introductory statement that sets out the guiding purpose, principles and philosophy of the constitution.',
      keyPoints: [
        'Sovereign, Socialist, Secular, Democratic Republic',
        'Justice - Social, Economic, and Political',
        'Liberty of thought, expression, belief, faith and worship',
        'Equality of status and opportunity',
        'Fraternity assuring dignity of individual and unity of nation'
      ]
    },
    {
      id: 'structure',
      title: 'Constitutional Structure',
      icon: Building,
      content: 'The Constitution of India is divided into 25 Parts containing 448 Articles and 12 Schedules.',
      keyPoints: [
        '25 Parts organizing the Constitution',
        '448 Articles (originally 395)',
        '12 Schedules containing detailed provisions',
        'World\'s longest written constitution',
        'Adopted on 26 November 1949, effective 26 January 1950'
      ]
    },
    {
      id: 'government',
      title: 'Structure of Government',
      icon: Users,
      content: 'India follows a federal system with three tiers of government and separation of powers.',
      keyPoints: [
        'Union Government (Central)',
        'State Governments',
        'Local Governments (Panchayati Raj & Municipalities)',
        'Three branches: Executive, Legislative, Judicial',
        'Independent Election Commission'
      ]
    },
    {
      id: 'amendments',
      title: 'Amendment Process',
      icon: Gavel,
      content: 'The Constitution provides for amendments while maintaining its basic structure.',
      keyPoints: [
        'Article 368 governs amendment procedure',
        'Simple majority for some provisions',
        'Special majority for most amendments',
        'Ratification by states for federal provisions',
        '105 amendments passed since 1950'
      ]
    }
  ];

  const markSectionComplete = (sectionId: string) => {
    if (!completedSections.includes(sectionId)) {
      setCompletedSections([...completedSections, sectionId]);
    }
    
    if (completedSections.length + 1 === sections.length) {
      onComplete();
    }
  };

  const getRoleSpecificContent = (sectionId: string) => {
    const roleContent = {
      admin: {
        preamble: 'As an admin, ensure accuracy of preamble content and monitor user engagement with foundational principles.',
        structure: 'Oversee content management for structural information and validate accuracy of constitutional details.',
        government: 'Manage user access to government structure content and ensure balanced representation.',
        amendments: 'Monitor discussions about amendments and ensure factual accuracy in legal interpretations.'
      },
      educator: {
        preamble: 'Use interactive methods to explain preamble concepts. Create engaging activities around constitutional values.',
        structure: 'Develop structured learning paths for constitutional organization. Design visual aids for complex structures.',
        government: 'Facilitate discussions on federal structure. Create comparative studies with other democracies.',
        amendments: 'Explain amendment process through case studies. Conduct mock amendment procedures.'
      },
      'legal-expert': {
        preamble: 'Provide legal interpretation of preamble\'s significance in constitutional jurisprudence.',
        structure: 'Offer expert analysis on constitutional organization and its impact on governance.',
        government: 'Share insights on federal structure evolution and inter-governmental relations.',
        amendments: 'Explain landmark amendments and their constitutional implications through case law.'
      },
      citizen: {
        preamble: 'Understand how preamble values apply to daily life and civic participation.',
        structure: 'Learn about constitutional organization to better understand governance.',
        government: 'Explore how different government levels serve citizens and protect rights.',
        amendments: 'Understand how constitution evolves to meet changing societal needs.'
      }
    };

    return roleContent[userRole][sectionId as keyof typeof roleContent[typeof userRole]];
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <span>Constitutional Framework</span>
          </CardTitle>
          <CardDescription>
            Explore the foundational structure and principles of the Indian Constitution
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Adopted: 26 November 1949</span>
            </div>
            <div className="flex items-center space-x-2">
              <Building className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Effective: 26 January 1950</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sections.map((section) => (
          <Card key={section.id} className="h-fit">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <section.icon className="w-5 h-5 text-blue-600" />
                  <CardTitle className="text-lg">{section.title}</CardTitle>
                </div>
                {completedSections.includes(section.id) && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
              </div>
              <CardDescription>{section.content}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-3">Key Points:</h4>
                <ul className="space-y-2">
                  {section.keyPoints.map((point, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <ChevronRight className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {userRole !== 'citizen' && (
                <div className="border-t pt-4">
                  <Badge variant="secondary" className="mb-2">
                    {userRole.charAt(0).toUpperCase() + userRole.slice(1)} Insights
                  </Badge>
                  <p className="text-sm text-gray-600">
                    {getRoleSpecificContent(section.id)}
                  </p>
                </div>
              )}

              <Button 
                onClick={() => markSectionComplete(section.id)}
                disabled={completedSections.includes(section.id)}
                className="w-full"
              >
                {completedSections.includes(section.id) ? 'Completed' : 'Mark as Complete'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {completedSections.length === sections.length && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="flex items-center space-x-4 pt-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div>
              <h3 className="font-semibold text-green-800">Framework Section Completed!</h3>
              <p className="text-green-600">You've successfully learned about the constitutional framework.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}