import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { 
  Shield, 
  Scale, 
  Users, 
  BookOpen, 
  Briefcase, 
  Home,
  CheckCircle,
  Info
} from 'lucide-react';

interface FundamentalRightsProps {
  userRole: 'citizen' | 'educator' | 'admin' | 'legal-expert';
  onComplete: () => void;
}

export function FundamentalRights({ userRole, onComplete }: FundamentalRightsProps) {
  const [studiedRights, setStudiedRights] = useState<string[]>([]);
  
  const fundamentalRights = [
    {
      id: 'equality',
      title: 'Right to Equality',
      articles: 'Articles 14-18',
      icon: Scale,
      color: 'text-blue-600',
      description: 'Ensures equal treatment before law and prohibits discrimination',
      provisions: [
        'Equality before law (Article 14)',
        'Prohibition of discrimination (Article 15)',
        'Equality of opportunity in public employment (Article 16)',
        'Abolition of untouchability (Article 17)',
        'Abolition of titles (Article 18)'
      ],
      examples: [
        'No discrimination in public places',
        'Equal access to government jobs',
        'Protection from untouchability practices',
        'Prohibition of hereditary titles'
      ],
      limitations: [
        'Reasonable restrictions allowed',
        'Special provisions for backward classes',
        'Emergency provisions may suspend some rights'
      ]
    },
    {
      id: 'freedom',
      title: 'Right to Freedom',
      articles: 'Articles 19-22',
      icon: Users,
      color: 'text-green-600',
      description: 'Protects individual liberties and freedoms',
      provisions: [
        'Freedom of speech and expression (Article 19)',
        'Protection in respect of conviction (Article 20)',
        'Protection of life and personal liberty (Article 21)',
        'Right to education (Article 21A)',
        'Protection against arrest and detention (Article 22)'
      ],
      examples: [
        'Freedom to express opinions',
        'Right to peaceful assembly',
        'Freedom of movement within India',
        'Right to practice any profession'
      ],
      limitations: [
        'Reasonable restrictions on public order',
        'Restrictions during emergencies',
        'Defamation and contempt of court limits'
      ]
    },
    {
      id: 'exploitation',
      title: 'Right against Exploitation',
      articles: 'Articles 23-24',
      icon: Shield,
      color: 'text-red-600',
      description: 'Prohibits human trafficking and forced labor',
      provisions: [
        'Prohibition of traffic in human beings (Article 23)',
        'Prohibition of employment of children (Article 24)'
      ],
      examples: [
        'Ban on buying and selling humans',
        'Prohibition of forced labor',
        'Protection of children from hazardous work',
        'Beggar (forced) prohibition'
      ],
      limitations: [
        'State can impose compulsory service for public purposes',
        'Military service obligations',
        'Community service as legal punishment'
      ]
    },
    {
      id: 'religion',
      title: 'Right to Freedom of Religion',
      articles: 'Articles 25-28',
      icon: BookOpen,
      color: 'text-purple-600',
      description: 'Ensures religious freedom and secularism',
      provisions: [
        'Freedom of conscience and religion (Article 25)',
        'Freedom to manage religious affairs (Article 26)',
        'Freedom from religious instruction (Article 27-28)'
      ],
      examples: [
        'Freedom to practice any religion',
        'Right to establish religious institutions',
        'Freedom from religious taxation',
        'No religious instruction in government schools'
      ],
      limitations: [
        'Subject to public order, morality and health',
        'State can regulate secular activities of religions',
        'Anti-conversion laws in some states'
      ]
    },
    {
      id: 'culture',
      title: 'Cultural and Educational Rights',
      articles: 'Articles 29-30',
      icon: Briefcase,
      color: 'text-orange-600',
      description: 'Protects cultural diversity and educational rights',
      provisions: [
        'Protection of language, script and culture (Article 29)',
        'Right of minorities to establish educational institutions (Article 30)'
      ],
      examples: [
        'Right to conserve distinct culture',
        'Protection of minority languages',
        'Right to establish educational institutions',
        'Admission without discrimination'
      ],
      limitations: [
        'Reasonable regulations by the state',
        'Standards of education must be maintained',
        'Anti-national activities not protected'
      ]
    },
    {
      id: 'constitutional',
      title: 'Right to Constitutional Remedies',
      articles: 'Article 32',
      icon: Home,
      color: 'text-indigo-600',
      description: 'Provides means to enforce fundamental rights',
      provisions: [
        'Right to approach Supreme Court directly (Article 32)',
        'Supreme Court empowered to issue writs',
        'Parliament cannot abridge this right'
      ],
      examples: [
        'Habeas Corpus - protection from illegal detention',
        'Mandamus - compel public officials to act',
        'Prohibition - prevent excess of jurisdiction',
        'Certiorari - quash illegal orders'
      ],
      limitations: [
        'Cannot be suspended except during emergency',
        'Must exhaust other remedies first in some cases',
        'Frivolous petitions may be dismissed'
      ]
    }
  ];

  const markRightStudied = (rightId: string) => {
    if (!studiedRights.includes(rightId)) {
      setStudiedRights([...studiedRights, rightId]);
    }
    
    if (studiedRights.length + 1 === fundamentalRights.length) {
      onComplete();
    }
  };

  const getRoleSpecificInsight = (rightId: string) => {
    const insights = {
      admin: {
        equality: 'Monitor platform for discriminatory content and ensure equal access to all users.',
        freedom: 'Balance freedom of expression with content moderation policies.',
        exploitation: 'Implement safeguards against user exploitation and data misuse.',
        religion: 'Maintain religious neutrality in content and user policies.',
        culture: 'Promote cultural diversity in educational content and user representation.',
        constitutional: 'Ensure users have clear channels to report rights violations on platform.'
      },
      educator: {
        equality: 'Use case studies to demonstrate equality principles in classroom settings.',
        freedom: 'Encourage open discussions while maintaining respectful dialogue.',
        exploitation: 'Educate about modern forms of exploitation including cyber crimes.',
        religion: 'Foster interfaith understanding and religious tolerance.',
        culture: 'Celebrate cultural diversity and include diverse perspectives in curriculum.',
        constitutional: 'Teach students how to access legal remedies and constitutional protections.'
      },
      'legal-expert': {
        equality: 'Analyze landmark cases like Kesavananda Bharati and Indra Sawhney.',
        freedom: 'Examine evolving interpretations of Article 21 and privacy rights.',
        exploitation: 'Review contemporary challenges in human trafficking and child labor laws.',
        religion: 'Study recent judgments on religious freedom and secularism.',
        culture: 'Analyze minority rights jurisprudence and educational autonomy cases.',
        constitutional: 'Explain writ jurisdiction and PIL (Public Interest Litigation) developments.'
      },
      citizen: {
        equality: 'Understand your right to equal treatment and how to report discrimination.',
        freedom: 'Know the boundaries of your freedoms and responsibilities as a citizen.',
        exploitation: 'Recognize signs of exploitation and know how to seek help.',
        religion: 'Respect religious diversity while practicing your own faith freely.',
        culture: 'Appreciate cultural diversity and protect minority rights in your community.',
        constitutional: 'Learn how to approach courts if your fundamental rights are violated.'
      }
    };

    return insights[userRole][rightId as keyof typeof insights[typeof userRole]];
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-6 h-6 text-blue-600" />
            <span>Fundamental Rights</span>
          </CardTitle>
          <CardDescription>
            Six categories of fundamental rights that form the foundation of Indian democracy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Info className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-gray-600">
              These rights are justiciable and can be enforced through courts
            </span>
          </div>
          <div className="text-sm text-gray-600">
            Progress: {studiedRights.length} of {fundamentalRights.length} rights studied
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {fundamentalRights.map((right) => (
          <Card key={right.id} className="overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <right.icon className={`w-6 h-6 ${right.color}`} />
                  <div>
                    <CardTitle className="text-lg">{right.title}</CardTitle>
                    <Badge variant="outline" className="mt-1">
                      {right.articles}
                    </Badge>
                  </div>
                </div>
                {studiedRights.includes(right.id) && (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                )}
              </div>
              <CardDescription>{right.description}</CardDescription>
            </CardHeader>
            
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="provisions">
                  <AccordionTrigger>Constitutional Provisions</AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2">
                      {right.provisions.map((provision, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-sm">{provision}</span>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="examples">
                  <AccordionTrigger>Practical Examples</AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2">
                      {right.examples.map((example, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-sm">{example}</span>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="limitations">
                  <AccordionTrigger>Limitations & Restrictions</AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2">
                      {right.limitations.map((limitation, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-sm">{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {userRole !== 'citizen' && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <Badge variant="secondary" className="mb-2">
                    {userRole.charAt(0).toUpperCase() + userRole.slice(1)} Perspective
                  </Badge>
                  <p className="text-sm text-gray-700">
                    {getRoleSpecificInsight(right.id)}
                  </p>
                </div>
              )}

              <Button 
                onClick={() => markRightStudied(right.id)}
                disabled={studiedRights.includes(right.id)}
                className="w-full mt-4"
              >
                {studiedRights.includes(right.id) ? 'Studied' : 'Mark as Studied'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {studiedRights.length === fundamentalRights.length && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="flex items-center space-x-4 pt-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div>
              <h3 className="font-semibold text-green-800">Fundamental Rights Completed!</h3>
              <p className="text-green-600">You've successfully studied all six categories of fundamental rights.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}