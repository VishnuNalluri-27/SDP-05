import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  Heart, 
  Flag, 
  Leaf, 
  BookOpen, 
  Users, 
  Shield,
  CheckCircle,
  Target,
  ChevronRight
} from 'lucide-react';

interface CitizensDutiesProps {
  userRole: 'citizen' | 'educator' | 'admin' | 'legal-expert';
  onComplete: () => void;
}

export function CitizensDuties({ userRole, onComplete }: CitizensDutiesProps) {
  const [acknowledgedDuties, setAcknowledgedDuties] = useState<string[]>([]);
  const [commitments, setCommitments] = useState<{[key: string]: string}>({});
  
  const fundamentalDuties = [
    {
      id: 'constitution',
      title: 'Respect the Constitution',
      icon: BookOpen,
      color: 'text-blue-600',
      description: 'To abide by the Constitution and respect its ideals and institutions, the National Flag and the National Anthem',
      practicalActions: [
        'Learn about constitutional principles',
        'Show respect during national anthem',
        'Honor the national flag properly',
        'Participate in democratic processes'
      ],
      dailyPractice: 'Start each day by reflecting on constitutional values of justice, liberty, equality, and fraternity'
    },
    {
      id: 'national-movement',
      title: 'Cherish National Ideals',
      icon: Flag,
      color: 'text-red-600',
      description: 'To cherish and follow the noble ideals which inspired our national struggle for freedom',
      practicalActions: [
        'Study freedom struggle history',
        'Visit national monuments and museums',
        'Celebrate national festivals meaningfully',
        'Share stories of freedom fighters'
      ],
      dailyPractice: 'Remember the sacrifices of freedom fighters and apply their values of truth and non-violence'
    },
    {
      id: 'sovereignty',
      title: 'Uphold Sovereignty and Unity',
      icon: Shield,
      color: 'text-green-600',
      description: 'To uphold and protect the sovereignty, unity and integrity of India',
      practicalActions: [
        'Promote national unity above regional differences',
        'Report anti-national activities',
        'Support territorial integrity',
        'Foster communal harmony'
      ],
      dailyPractice: 'Choose actions that strengthen national unity rather than create divisions'
    },
    {
      id: 'defense',
      title: 'Defend the Country',
      icon: Shield,
      color: 'text-purple-600',
      description: 'To defend the country and render national service when called upon to do so',
      practicalActions: [
        'Be prepared for national service',
        'Support defense personnel and families',
        'Contribute to national emergency funds',
        'Participate in civil defense activities'
      ],
      dailyPractice: 'Stay physically and mentally prepared to serve the nation in times of need'
    },
    {
      id: 'harmony',
      title: 'Promote Harmony',
      icon: Users,
      color: 'text-orange-600',
      description: 'To promote harmony and the spirit of common brotherhood amongst all people transcending religious, linguistic and regional diversities',
      practicalActions: [
        'Respect all religions and cultures',
        'Learn about different traditions',
        'Avoid discriminatory language or behavior',
        'Mediate conflicts peacefully'
      ],
      dailyPractice: 'Interact with people from different backgrounds with respect and openness'
    },
    {
      id: 'dignity',
      title: 'Preserve Dignity of Women',
      icon: Heart,
      color: 'text-pink-600',
      description: 'To renounce practices derogatory to the dignity of women',
      practicalActions: [
        'Speak against gender discrimination',
        'Support women\'s education and empowerment',
        'Report harassment and violence',
        'Practice gender equality at home and work'
      ],
      dailyPractice: 'Treat all women with respect and dignity, and challenge sexist attitudes'
    },
    {
      id: 'heritage',
      title: 'Value Composite Culture',
      icon: BookOpen,
      color: 'text-indigo-600',
      description: 'To value and preserve the rich heritage of our composite culture',
      practicalActions: [
        'Learn about Indian art, music, and literature',
        'Preserve historical monuments',
        'Support traditional crafts and arts',
        'Document local cultural practices'
      ],
      dailyPractice: 'Appreciate and share knowledge about India\'s diverse cultural heritage'
    },
    {
      id: 'environment',
      title: 'Protect Environment',
      icon: Leaf,
      color: 'text-green-500',
      description: 'To protect and improve the natural environment including forests, lakes, rivers and wildlife',
      practicalActions: [
        'Reduce, reuse, and recycle waste',
        'Plant and care for trees',
        'Conserve water and energy',
        'Report environmental violations'
      ],
      dailyPractice: 'Make eco-friendly choices in daily life and inspire others to do the same'
    },
    {
      id: 'scientific-temper',
      title: 'Develop Scientific Temper',
      icon: Target,
      color: 'text-blue-500',
      description: 'To develop the scientific temper, humanism and the spirit of inquiry and reform',
      practicalActions: [
        'Question superstitions and blind beliefs',
        'Support evidence-based decisions',
        'Promote education and research',
        'Encourage critical thinking'
      ],
      dailyPractice: 'Approach problems with logical thinking and encourage others to do the same'
    },
    {
      id: 'public-property',
      title: 'Safeguard Public Property',
      icon: Shield,
      color: 'text-gray-600',
      description: 'To safeguard public property and to abjure violence',
      practicalActions: [
        'Take care of public facilities',
        'Report vandalism and theft',
        'Choose non-violent conflict resolution',
        'Maintain cleanliness in public spaces'
      ],
      dailyPractice: 'Treat public property as your own and resolve conflicts through dialogue'
    },
    {
      id: 'excellence',
      title: 'Strive for Excellence',
      icon: Target,
      color: 'text-yellow-600',
      description: 'To strive towards excellence in all spheres of individual and collective activity',
      practicalActions: [
        'Pursue continuous learning and improvement',
        'Maintain high standards in work',
        'Mentor others to achieve excellence',
        'Contribute to national progress'
      ],
      dailyPractice: 'Give your best effort in everything you do and help others reach their potential'
    }
  ];

  const acknowledgeDuty = (dutyId: string) => {
    if (!acknowledgedDuties.includes(dutyId)) {
      setAcknowledgedDuties([...acknowledgedDuties, dutyId]);
    }
    
    if (acknowledgedDuties.length + 1 === fundamentalDuties.length) {
      onComplete();
    }
  };

  const setCommitment = (dutyId: string, commitment: string) => {
    setCommitments({ ...commitments, [dutyId]: commitment });
  };

  const progress = (acknowledgedDuties.length / fundamentalDuties.length) * 100;

  const getRoleGuidance = (dutyId: string) => {
    const guidance = {
      admin: {
        constitution: 'Ensure platform policies align with constitutional values and democratic principles.',
        'national-movement': 'Create content that honors freedom struggle while avoiding partisan politics.',
        sovereignty: 'Implement security measures to protect platform integrity and user data.',
        defense: 'Support national security by monitoring and reporting suspicious activities.',
        harmony: 'Foster inclusive community guidelines that promote unity in diversity.',
        dignity: 'Enforce zero-tolerance policies against gender-based harassment and discrimination.',
        heritage: 'Curate diverse cultural content representing all regions and communities.',
        environment: 'Implement sustainable practices in platform operations and data centers.',
        'scientific-temper': 'Promote fact-checking and evidence-based information sharing.',
        'public-property': 'Protect platform resources and prevent abuse of community features.',
        excellence: 'Continuously improve platform features and user experience.'
      },
      educator: {
        constitution: 'Teach constitutional values through interactive activities and real-life examples.',
        'national-movement': 'Use storytelling and role-play to bring freedom struggle history alive.',
        sovereignty: 'Organize activities that celebrate national unity while respecting diversity.',
        defense: 'Instill patriotic values while teaching peaceful conflict resolution.',
        harmony: 'Create classroom environments that celebrate all cultures and religions.',
        dignity: 'Model gender equality and teach respectful behavior towards all.',
        heritage: 'Incorporate diverse cultural elements in curriculum and activities.',
        environment: 'Lead by example in environmental conservation and teach sustainability.',
        'scientific-temper': 'Encourage questioning, experimentation, and critical thinking.',
        'public-property': 'Teach responsibility through school maintenance and community service.',
        excellence: 'Set high standards and provide support for all students to achieve their best.'
      },
      'legal-expert': {
        constitution: 'Interpret constitutional duties in light of legal precedents and contemporary challenges.',
        'national-movement': 'Analyze how freedom struggle principles apply to modern legal issues.',
        sovereignty: 'Advise on laws protecting national security while maintaining civil liberties.',
        defense: 'Clarify legal obligations during national emergencies and service requirements.',
        harmony: 'Draft and review legislation promoting communal harmony and preventing discrimination.',
        dignity: 'Strengthen legal frameworks protecting women\'s rights and dignity.',
        heritage: 'Develop legal mechanisms for cultural preservation and intellectual property protection.',
        environment: 'Create and enforce environmental laws with strong judicial backing.',
        'scientific-temper': 'Combat superstition-based practices through legal reforms.',
        'public-property': 'Strengthen laws against vandalism and ensure swift justice.',
        excellence: 'Promote legal education and access to justice for all citizens.'
      },
      citizen: {
        constitution: 'Make constitutional values part of your daily decision-making process.',
        'national-movement': 'Honor freedom fighters by living according to their ideals of truth and service.',
        sovereignty: 'Choose actions that unite rather than divide the country.',
        defense: 'Stay informed about national issues and be ready to contribute when needed.',
        harmony: 'Build bridges across communities and celebrate diversity in your neighborhood.',
        dignity: 'Stand up against gender discrimination and support women\'s empowerment.',
        heritage: 'Learn about and preserve local traditions while respecting others\' cultures.',
        environment: 'Adopt sustainable lifestyle choices and inspire others to do the same.',
        'scientific-temper': 'Question misinformation and make decisions based on facts and reason.',
        'public-property': 'Take pride in maintaining public spaces and facilities.',
        excellence: 'Pursue personal growth while contributing to community development.'
      }
    };

    return guidance[userRole][dutyId as keyof typeof guidance[typeof userRole]];
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-orange-50 to-red-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="w-6 h-6 text-red-600" />
            <span>Fundamental Duties</span>
          </CardTitle>
          <CardDescription>
            Eleven fundamental duties that guide citizens in building a strong and harmonious nation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Progress</span>
              <span className="text-sm font-medium">{acknowledgedDuties.length} of {fundamentalDuties.length}</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {fundamentalDuties.map((duty) => (
          <Card key={duty.id} className="h-fit">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <duty.icon className={`w-6 h-6 ${duty.color}`} />
                  <div>
                    <CardTitle className="text-lg">{duty.title}</CardTitle>
                    <Badge variant="outline" className="mt-1">
                      Article 51A
                    </Badge>
                  </div>
                </div>
                {acknowledgedDuties.includes(duty.id) && (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                )}
              </div>
              <CardDescription className="mt-2">{duty.description}</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-3">Practical Actions:</h4>
                <ul className="space-y-2">
                  {duty.practicalActions.map((action, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <ChevronRight className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{action}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-blue-50 rounded-lg">
                <h4 className="font-medium mb-2 text-blue-800">Daily Practice:</h4>
                <p className="text-sm text-blue-700">{duty.dailyPractice}</p>
              </div>

              {userRole !== 'citizen' && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <Badge variant="secondary" className="mb-2">
                    {userRole.charAt(0).toUpperCase() + userRole.slice(1)} Guidance
                  </Badge>
                  <p className="text-sm text-gray-700">
                    {getRoleGuidance(duty.id)}
                  </p>
                </div>
              )}

              <Button 
                onClick={() => acknowledgeDuty(duty.id)}
                disabled={acknowledgedDuties.includes(duty.id)}
                className="w-full"
                variant={acknowledgedDuties.includes(duty.id) ? "secondary" : "default"}
              >
                {acknowledgedDuties.includes(duty.id) ? 'Acknowledged' : 'I Acknowledge This Duty'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {acknowledgedDuties.length === fundamentalDuties.length && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4 mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-800">All Duties Acknowledged!</h3>
                <p className="text-green-600">You've acknowledged your commitment to all fundamental duties.</p>
              </div>
            </div>
            <div className="p-4 bg-white rounded-lg border border-green-200">
              <h4 className="font-medium mb-2">Citizen's Pledge:</h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                "I pledge to uphold the Constitution of India, respect its ideals and institutions, 
                cherish the noble ideals of our freedom struggle, protect the sovereignty and integrity 
                of India, promote harmony and brotherhood, preserve our composite culture, protect the 
                environment, develop scientific temper, safeguard public property, and strive for 
                excellence in all spheres of individual and collective activity."
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}