import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { Progress } from './ui/progress';
import { Input } from './ui/input';
import { 
  BookOpen, 
  Book, 
  FileText, 
  Search, 
  Clock, 
  Star,
  Download,
  Bookmark,
  ChevronRight,
  Play,
  Pause,
  Volume2,
  RotateCcw,
  CheckCircle,
  Award,
  Calendar,
  User,
  Scale
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Textbook {
  id: string;
  title: string;
  author: string;
  description: string;
  chapters: Chapter[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  rating: number;
  category: string;
  publishedDate: string;
  isLatest?: boolean;
}

interface Chapter {
  id: string;
  title: string;
  content: string;
  estimatedReadTime: number;
  keyPoints: string[];
  quiz?: QuizQuestion[];
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface ReadingProgress {
  textbookId: string;
  chaptersCompleted: string[];
  currentChapter: string;
  readingTime: number;
  quizScores: { [key: string]: number };
}

export function ConstitutionLibrary({ userRole = 'citizen' }: { userRole?: string }) {
  const { user, updateProgress } = useAuth();
  const [selectedTextbook, setSelectedTextbook] = useState<Textbook | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [readingProgress, setReadingProgress] = useState<ReadingProgress[]>([]);
  const [isReading, setIsReading] = useState(false);
  const [readingTime, setReadingTime] = useState(0);
  const [bookmarkedBooks, setBookmarkedBooks] = useState<string[]>([]);
  const [currentQuiz, setCurrentQuiz] = useState<QuizQuestion[] | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<{ [key: string]: number }>({});
  const [showQuizResults, setShowQuizResults] = useState(false);

  const constitutionTextbooks: Textbook[] = [
    {
      id: 'intro-constitution',
      title: 'Introduction to the Indian Constitution',
      author: 'Dr. Subhash Kashyap',
      description: 'A comprehensive guide to understanding the basics of the Indian Constitution, its history, and fundamental principles.',
      difficulty: 'Beginner',
      estimatedTime: '4-6 hours',
      rating: 4.8,
      category: 'Constitutional Basics',
      publishedDate: '2024',
      isLatest: true,
      chapters: [
        {
          id: 'ch1',
          title: 'Historical Background',
          content: `The Indian Constitution stands as one of the most comprehensive and detailed constitutions in the world. Its roots can be traced back to the Government of India Act 1935, which provided the basic framework, but the true journey began with the Constituent Assembly formed in 1946.

The Constituent Assembly, chaired by Dr. Rajendra Prasad, consisted of 389 members representing various provinces and princely states. The Drafting Committee, under the able leadership of Dr. B.R. Ambedkar, worked tirelessly for nearly three years to create this magnificent document.

Key Historical Milestones:
- 1946: Formation of Constituent Assembly
- 1947: Independence and partition
- 1949: Adoption of Constitution (November 26)
- 1950: Implementation (January 26)

The Constitution draws inspiration from various sources including the Government of India Act 1935, the American Bill of Rights, the British parliamentary system, and the Irish Directive Principles.`,
          estimatedReadTime: 25,
          keyPoints: [
            'Constituent Assembly formation in 1946',
            'Dr. B.R. Ambedkar as Chairman of Drafting Committee',
            'Three years of deliberation and drafting',
            'Multiple international influences and sources'
          ],
          quiz: [
            {
              id: 'q1',
              question: 'Who was the Chairman of the Drafting Committee of the Indian Constitution?',
              options: ['Dr. Rajendra Prasad', 'Dr. B.R. Ambedkar', 'Jawaharlal Nehru', 'Sardar Patel'],
              correctAnswer: 1,
              explanation: 'Dr. B.R. Ambedkar was the Chairman of the Drafting Committee and is known as the principal architect of the Indian Constitution.'
            },
            {
              id: 'q2',
              question: 'When was the Indian Constitution adopted?',
              options: ['January 26, 1950', 'November 26, 1949', 'August 15, 1947', 'December 31, 1949'],
              correctAnswer: 1,
              explanation: 'The Indian Constitution was adopted on November 26, 1949, and came into effect on January 26, 1950.'
            }
          ]
        },
        {
          id: 'ch2',
          title: 'Salient Features',
          content: `The Indian Constitution is remarkable for its unique features that make it distinct from other constitutions worldwide. It is the longest written constitution, containing 395 articles and 12 schedules in its original form.

Written and Elaborate Constitution:
Unlike the British Constitution, the Indian Constitution is written and codified. It covers every aspect of governance and leaves little room for ambiguity.

Federal System with Unitary Bias:
The Constitution establishes a federal structure but with a strong center. During emergencies, it can function as a unitary system.

Parliamentary System:
India follows the Westminster model of parliamentary democracy with the President as the constitutional head and the Prime Minister as the real executive.

Fundamental Rights and Duties:
The Constitution guarantees fundamental rights to citizens while also prescribing fundamental duties to create a balance between rights and responsibilities.

Directive Principles of State Policy:
These are guidelines for the government to establish a welfare state and promote social justice.`,
          estimatedReadTime: 30,
          keyPoints: [
            'Longest written constitution in the world',
            'Federal structure with unitary features',
            'Parliamentary democracy model',
            'Balance of rights and duties'
          ],
          quiz: [
            {
              id: 'q3',
              question: 'Which feature makes the Indian Constitution unique in terms of length?',
              options: ['It is the shortest', 'It is unwritten', 'It is the longest written constitution', 'It has no amendments'],
              correctAnswer: 2,
              explanation: 'The Indian Constitution is the longest written constitution in the world with 395 articles and 12 schedules originally.'
            }
          ]
        },
        {
          id: 'ch3',
          title: 'Preamble and Its Significance',
          content: `The Preamble to the Indian Constitution serves as an introduction and sets forth the ideals and objectives that the Constitution seeks to achieve. It embodies the fundamental values and the philosophy on which the Constitution is based.

"WE, THE PEOPLE OF INDIA, having solemnly resolved to constitute India into a SOVEREIGN SOCIALIST SECULAR DEMOCRATIC REPUBLIC and to secure to all its citizens:

JUSTICE, social, economic and political;
LIBERTY of thought, expression, belief, faith and worship;
EQUALITY of status and of opportunity;
and to promote among them all
FRATERNITY assuring the dignity of the individual and the unity and integrity of the Nation;

IN OUR CONSTITUENT ASSEMBLY this twenty-sixth day of November, 1949, do HEREBY ADOPT, ENACT AND GIVE TO OURSELVES THIS CONSTITUTION."

Key Components:
1. Source of Authority: "We, the People of India"
2. Nature of State: Sovereign, Socialist, Secular, Democratic, Republic
3. Objectives: Justice, Liberty, Equality, Fraternity
4. Date of Adoption: November 26, 1949

The words "Socialist," "Secular," and "Integrity" were added by the 42nd Amendment in 1976.`,
          estimatedReadTime: 20,
          keyPoints: [
            'Source of authority - "We, the People"',
            'Five key characteristics of the state',
            'Four main objectives',
            '42nd Amendment additions'
          ]
        }
      ]
    },
    {
      id: 'fundamental-rights-detailed',
      title: 'Fundamental Rights: A Comprehensive Study',
      author: 'Justice V.R. Krishna Iyer',
      description: 'An in-depth analysis of fundamental rights guaranteed by the Indian Constitution, including case studies and judicial interpretations.',
      difficulty: 'Intermediate',
      estimatedTime: '6-8 hours',
      rating: 4.9,
      category: 'Rights and Liberties',
      publishedDate: '2024',
      isLatest: true,
      chapters: [
        {
          id: 'fr1',
          title: 'Evolution of Fundamental Rights',
          content: `Fundamental Rights in the Indian Constitution represent the basic human rights that are essential for the development of every individual. These rights are inspired by the Bill of Rights in the US Constitution and are justiciable, meaning they can be enforced through courts.

Historical Development:
The concept of fundamental rights evolved through various historical documents and movements:
- Magna Carta (1215) - Limited government power
- Bill of Rights (1689) - Parliamentary supremacy
- French Declaration of Rights (1789) - Natural rights
- American Bill of Rights (1791) - Individual freedoms

In the Indian context, the demand for fundamental rights emerged during the freedom struggle:
- 1895: Dadabhai Naoroji's demand for rights
- 1919: Government of India Act - Limited rights
- 1928: Nehru Report - Fundamental rights chapter
- 1931: Karachi Resolution - Economic and social rights

Categories of Fundamental Rights:
Originally, there were seven fundamental rights. After the 44th Amendment (1978), the right to property was removed, leaving six fundamental rights:

1. Right to Equality (Articles 14-18)
2. Right to Freedom (Articles 19-22)
3. Right against Exploitation (Articles 23-24)
4. Right to Freedom of Religion (Articles 25-28)
5. Cultural and Educational Rights (Articles 29-30)
6. Right to Constitutional Remedies (Article 32)`,
          estimatedReadTime: 35,
          keyPoints: [
            'Historical evolution from Magna Carta to Indian Constitution',
            'Role of freedom struggle in shaping rights',
            'Six categories of fundamental rights',
            'Justiciable nature of these rights'
          ],
          quiz: [
            {
              id: 'fr-q1',
              question: 'How many fundamental rights are currently recognized in the Indian Constitution?',
              options: ['Five', 'Six', 'Seven', 'Eight'],
              correctAnswer: 1,
              explanation: 'After the 44th Amendment in 1978 removed the right to property, there are now six fundamental rights in the Indian Constitution.'
            }
          ]
        }
      ]
    },
    {
      id: 'directive-principles',
      title: 'Directive Principles of State Policy',
      author: 'Dr. Durga Das Basu',
      description: 'Understanding the non-justiciable but fundamental guidelines for governance and policy-making in India.',
      difficulty: 'Intermediate',
      estimatedTime: '5-7 hours',
      rating: 4.7,
      category: 'State Policy',
      publishedDate: '2023',
      chapters: [
        {
          id: 'dp1',
          title: 'Introduction to Directive Principles',
          content: `The Directive Principles of State Policy (DPSP) are enshrined in Part IV of the Indian Constitution (Articles 36-51). These principles are guidelines or instructions to the federal and state governments to be kept in mind while framing laws and policies.

Nature and Characteristics:
1. Non-justiciable: Unlike Fundamental Rights, DPSPs cannot be enforced through courts
2. Positive obligations: They require the state to take positive action
3. Idealistic: They represent the ideals that the state should strive to achieve
4. Supplementary to Fundamental Rights: They complement fundamental rights

Sources of Directive Principles:
- Irish Constitution (1937) - Primary inspiration
- Universal Declaration of Human Rights (1948)
- Russian Constitution (Socialist principles)

Classification of Directive Principles:
1. Socialistic Principles (Articles 38, 39, 41, 42, 43, 43A, 47)
2. Gandhian Principles (Articles 40, 43, 46, 47, 48)
3. Liberal-Intellectual Principles (Articles 44, 45, 48A, 49, 50, 51)

The 42nd Amendment (1976) added four new directive principles:
- Article 39A: Equal justice and free legal aid
- Article 43A: Worker participation in management
- Article 48A: Environmental protection
- Article 51A: Fundamental duties`,
          estimatedReadTime: 40,
          keyPoints: [
            'Non-justiciable nature of directive principles',
            'Irish Constitution as primary source',
            'Three categories: Socialistic, Gandhian, Liberal',
            '42nd Amendment additions'
          ]
        }
      ]
    }
  ];

  const latestLawBooks: Textbook[] = [
    {
      id: 'constitutional-amendments-2024',
      title: 'Constitutional Amendments and Recent Developments 2024',
      author: 'Supreme Court Bar Association',
      description: 'Latest constitutional amendments, landmark judgments, and evolving jurisprudence in constitutional law.',
      difficulty: 'Advanced',
      estimatedTime: '8-10 hours',
      rating: 4.9,
      category: 'Recent Developments',
      publishedDate: '2024',
      isLatest: true,
      chapters: [
        {
          id: 'am2024-1',
          title: 'Recent Constitutional Amendments',
          content: `This chapter covers the most recent constitutional amendments and their implications for Indian governance and society. Understanding these changes is crucial for comprehending the evolving nature of our constitutional framework.

The 105th Constitutional Amendment Act, 2021:
This amendment restored the states' power to make their own OBC lists for local body elections, effectively overturning a Supreme Court judgment.

Key Provisions:
- Inserted clauses (6) and (7) in Article 342A
- Gave states the power to prepare and maintain state lists of SEBCs
- Addressed the concerns raised in the Vikas Bahl case

The 104th Constitutional Amendment Act, 2020:
Extended the reservation for SCs and STs in Lok Sabha and state assemblies by another 10 years.

The 103rd Constitutional Amendment Act, 2019:
Introduced 10% reservation for economically weaker sections (EWS) among forward castes.

Key Features:
- Added clauses (6) in Articles 15 and 16
- Defined EWS based on income and property criteria
- First amendment to provide reservation based on economic criteria

Recent Landmark Judgments:
1. Basic Structure Doctrine reinforcement
2. Privacy as a fundamental right
3. Environmental jurisprudence evolution
4. Digital rights and constitutional interpretation`,
          estimatedReadTime: 45,
          keyPoints: [
            '105th Amendment - OBC reservation powers to states',
            '104th Amendment - SC/ST reservation extension',
            '103rd Amendment - EWS reservation',
            'Evolving judicial interpretations'
          ]
        }
      ]
    }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isReading) {
      interval = setInterval(() => {
        setReadingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isReading]);

  const filteredTextbooks = [...constitutionTextbooks, ...latestLawBooks].filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getProgressForBook = (bookId: string) => {
    const progress = readingProgress.find(p => p.textbookId === bookId);
    if (!progress) return 0;
    const book = constitutionTextbooks.find(b => b.id === bookId) || latestLawBooks.find(b => b.id === bookId);
    if (!book) return 0;
    return (progress.chaptersCompleted.length / book.chapters.length) * 100;
  };

  const markChapterComplete = (bookId: string, chapterId: string) => {
    setReadingProgress(prev => {
      const existingProgress = prev.find(p => p.textbookId === bookId);
      if (existingProgress) {
        if (!existingProgress.chaptersCompleted.includes(chapterId)) {
          existingProgress.chaptersCompleted.push(chapterId);
        }
        return [...prev];
      } else {
        return [...prev, {
          textbookId: bookId,
          chaptersCompleted: [chapterId],
          currentChapter: chapterId,
          readingTime: 0,
          quizScores: {}
        }];
      }
    });
  };

  const toggleBookmark = (bookId: string) => {
    setBookmarkedBooks(prev => 
      prev.includes(bookId) 
        ? prev.filter(id => id !== bookId)
        : [...prev, bookId]
    );
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleQuizSubmit = () => {
    if (!currentQuiz) return;
    
    let score = 0;
    currentQuiz.forEach(question => {
      if (quizAnswers[question.id] === question.correctAnswer) {
        score++;
      }
    });
    
    const percentage = (score / currentQuiz.length) * 100;
    setShowQuizResults(true);
    
    if (selectedTextbook && selectedChapter) {
      setReadingProgress(prev => {
        const progress = prev.find(p => p.textbookId === selectedTextbook.id);
        if (progress) {
          progress.quizScores[selectedChapter.id] = percentage;
        }
        return [...prev];
      });
    }
  };

  if (selectedTextbook && selectedChapter) {
    return (
      <div className="space-y-6">
        {/* Reading Header */}
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={() => {
              setSelectedChapter(null);
              setIsReading(false);
              setCurrentQuiz(null);
              setQuizAnswers({});
              setShowQuizResults(false);
            }}
          >
            ← Back to {selectedTextbook.title}
          </Button>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                Reading Time: {formatTime(readingTime)}
              </span>
            </div>
            <Button
              variant={isReading ? "secondary" : "default"}
              size="sm"
              onClick={() => setIsReading(!isReading)}
            >
              {isReading ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {isReading ? 'Pause' : 'Start'} Reading
            </Button>
          </div>
        </div>

        {/* Chapter Content */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{selectedChapter.title}</CardTitle>
                <CardDescription>
                  Estimated reading time: {selectedChapter.estimatedReadTime} minutes
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => markChapterComplete(selectedTextbook.id, selectedChapter.id)}
                disabled={readingProgress
                  .find(p => p.textbookId === selectedTextbook.id)
                  ?.chaptersCompleted.includes(selectedChapter.id)}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                {readingProgress
                  .find(p => p.textbookId === selectedTextbook.id)
                  ?.chaptersCompleted.includes(selectedChapter.id) 
                  ? 'Completed' : 'Mark Complete'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              <div className="prose prose-gray max-w-none">
                {selectedChapter.content.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </ScrollArea>

            {/* Key Points */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium mb-3 flex items-center">
                <Star className="w-4 h-4 mr-2 text-blue-600" />
                Key Points to Remember
              </h4>
              <ul className="space-y-2">
                {selectedChapter.keyPoints.map((point, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <ChevronRight className="w-4 h-4 mt-0.5 text-blue-600 flex-shrink-0" />
                    <span className="text-sm">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Chapter Quiz */}
            {selectedChapter.quiz && (
              <div className="mt-6">
                <Button
                  onClick={() => setCurrentQuiz(selectedChapter.quiz || null)}
                  className="w-full"
                  disabled={!!currentQuiz}
                >
                  <Award className="w-4 h-4 mr-2" />
                  Take Chapter Quiz ({selectedChapter.quiz.length} questions)
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quiz Section */}
        {currentQuiz && (
          <Card>
            <CardHeader>
              <CardTitle>Chapter Quiz</CardTitle>
              <CardDescription>
                Test your understanding of the chapter content
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!showQuizResults ? (
                <div className="space-y-6">
                  {currentQuiz.map((question, index) => (
                    <div key={question.id} className="space-y-3">
                      <h4 className="font-medium">
                        {index + 1}. {question.question}
                      </h4>
                      <div className="space-y-2">
                        {question.options.map((option, optIndex) => (
                          <label key={optIndex} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="radio"
                              name={question.id}
                              value={optIndex}
                              onChange={(e) => setQuizAnswers(prev => ({
                                ...prev,
                                [question.id]: parseInt(e.target.value)
                              }))}
                              className="w-4 h-4 text-blue-600"
                            />
                            <span>{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                  <Button 
                    onClick={handleQuizSubmit}
                    disabled={Object.keys(quizAnswers).length !== currentQuiz.length}
                    className="w-full"
                  >
                    Submit Quiz
                  </Button>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <div className="text-2xl font-bold text-green-600">
                    Quiz Completed!
                  </div>
                  <div className="text-lg">
                    Score: {Object.keys(quizAnswers).filter(qId => 
                      currentQuiz.find(q => q.id === qId)?.correctAnswer === quizAnswers[qId]
                    ).length} / {currentQuiz.length}
                  </div>
                  <div className="space-y-4">
                    {currentQuiz.map((question, index) => (
                      <div key={question.id} className="text-left p-4 bg-gray-50 rounded-lg">
                        <h5 className="font-medium mb-2">{index + 1}. {question.question}</h5>
                        <p className="text-sm text-green-600 mb-1">
                          Correct Answer: {question.options[question.correctAnswer]}
                        </p>
                        <p className="text-sm text-gray-600">{question.explanation}</p>
                      </div>
                    ))}
                  </div>
                  <Button onClick={() => {
                    setCurrentQuiz(null);
                    setQuizAnswers({});
                    setShowQuizResults(false);
                  }}>
                    Continue Reading
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  if (selectedTextbook) {
    return (
      <div className="space-y-6">
        {/* Book Header */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => setSelectedTextbook(null)}>
            ← Back to Library
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toggleBookmark(selectedTextbook.id)}
          >
            <Bookmark className={`w-4 h-4 mr-2 ${bookmarkedBooks.includes(selectedTextbook.id) ? 'fill-current' : ''}`} />
            {bookmarkedBooks.includes(selectedTextbook.id) ? 'Bookmarked' : 'Bookmark'}
          </Button>
        </div>

        {/* Book Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {selectedTextbook.title}
              {selectedTextbook.isLatest && (
                <Badge variant="secondary">Latest 2024</Badge>
              )}
            </CardTitle>
            <CardDescription>
              By {selectedTextbook.author} • {selectedTextbook.category}
            </CardDescription>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{selectedTextbook.estimatedTime}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 fill-current text-yellow-400" />
                <span>{selectedTextbook.rating}</span>
              </div>
              <Badge variant="outline">{selectedTextbook.difficulty}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="mb-6">{selectedTextbook.description}</p>
            
            <div className="mb-6">
              <h4 className="font-medium mb-3">Your Progress</h4>
              <Progress value={getProgressForBook(selectedTextbook.id)} className="w-full" />
              <p className="text-sm text-gray-600 mt-2">
                {Math.round(getProgressForBook(selectedTextbook.id))}% completed
              </p>
            </div>

            <h4 className="font-medium mb-4">Chapters</h4>
            <div className="space-y-3">
              {selectedTextbook.chapters.map((chapter, index) => {
                const isCompleted = readingProgress
                  .find(p => p.textbookId === selectedTextbook.id)
                  ?.chaptersCompleted.includes(chapter.id);
                
                return (
                  <div
                    key={chapter.id}
                    className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                    onClick={() => setSelectedChapter(chapter)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isCompleted ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <span className="text-sm font-medium">{index + 1}</span>
                        )}
                      </div>
                      <div>
                        <h5 className="font-medium">{chapter.title}</h5>
                        <p className="text-sm text-gray-600">
                          {chapter.estimatedReadTime} min read
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Constitution Library</h2>
          <p className="text-gray-600">
            Comprehensive textbooks and latest legal resources for constitutional learning
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search books, authors, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-80"
            />
          </div>
        </div>
      </div>

      {/* Reading Statistics */}
      {user && readingProgress.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Reading Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {readingProgress.length}
                </div>
                <div className="text-sm text-gray-600">Books Started</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {readingProgress.reduce((acc, p) => acc + p.chaptersCompleted.length, 0)}
                </div>
                <div className="text-sm text-gray-600">Chapters Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {bookmarkedBooks.length}
                </div>
                <div className="text-sm text-gray-600">Bookmarked Books</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {formatTime(readingProgress.reduce((acc, p) => acc + p.readingTime, 0))}
                </div>
                <div className="text-sm text-gray-600">Total Reading Time</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Library Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Books</TabsTrigger>
          <TabsTrigger value="textbooks">Core Textbooks</TabsTrigger>
          <TabsTrigger value="latest">Latest 2024</TabsTrigger>
          <TabsTrigger value="bookmarked">Bookmarked</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTextbooks.map((book) => (
              <Card 
                key={book.id} 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedTextbook(book)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg line-clamp-2">{book.title}</CardTitle>
                    {book.isLatest && (
                      <Badge variant="secondary" className="ml-2">Latest</Badge>
                    )}
                  </div>
                  <CardDescription>By {book.author}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {book.description}
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>{book.estimatedTime}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-current text-yellow-400" />
                        <span>{book.rating}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{book.difficulty}</Badge>
                      <div className="text-sm text-gray-600">
                        {book.chapters.length} chapters
                      </div>
                    </div>
                    
                    {user && (
                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{Math.round(getProgressForBook(book.id))}%</span>
                        </div>
                        <Progress value={getProgressForBook(book.id)} className="w-full" />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="textbooks">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {constitutionTextbooks.filter(book =>
              book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              book.author.toLowerCase().includes(searchQuery.toLowerCase())
            ).map((book) => (
              <Card 
                key={book.id} 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedTextbook(book)}
              >
                <CardHeader>
                  <CardTitle className="text-lg">{book.title}</CardTitle>
                  <CardDescription>By {book.author}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">{book.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <Badge variant="outline">{book.difficulty}</Badge>
                    <span>{book.chapters.length} chapters</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="latest">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestLawBooks.filter(book =>
              book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              book.author.toLowerCase().includes(searchQuery.toLowerCase())
            ).map((book) => (
              <Card 
                key={book.id} 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedTextbook(book)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{book.title}</CardTitle>
                    <Badge variant="secondary">2024</Badge>
                  </div>
                  <CardDescription>By {book.author}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">{book.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <Badge variant="outline">{book.difficulty}</Badge>
                    <span>{book.chapters.length} chapters</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="bookmarked">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTextbooks.filter(book => bookmarkedBooks.includes(book.id)).map((book) => (
              <Card 
                key={book.id} 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedTextbook(book)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{book.title}</CardTitle>
                    <Bookmark className="w-5 h-5 fill-current text-blue-600" />
                  </div>
                  <CardDescription>By {book.author}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">{book.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <Badge variant="outline">{book.difficulty}</Badge>
                    <span>{book.chapters.length} chapters</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {bookmarkedBooks.length === 0 && (
            <div className="text-center py-12">
              <Bookmark className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No bookmarked books</h3>
              <p className="text-gray-600">Bookmark books to access them quickly later.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}