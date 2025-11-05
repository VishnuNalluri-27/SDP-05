import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { useAuth } from '../contexts/AuthContext';
import { 
  Award, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  Trophy,
  Target,
  Clock,
  Book
} from 'lucide-react';

interface InteractiveQuizProps {
  userRole: 'citizen' | 'educator' | 'admin' | 'legal-expert';
  onComplete: () => void;
}

export function InteractiveQuiz({ userRole, onComplete }: InteractiveQuizProps) {
  const { user, submitQuiz } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{[key: number]: string}>({});
  const [showResults, setShowResults] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [startTime] = useState(Date.now());

  const questions = [
    {
      id: 1,
      question: "Which article of the Constitution is known as the 'Heart and Soul' of the Constitution?",
      options: [
        "Article 14 - Right to Equality",
        "Article 19 - Right to Freedom",
        "Article 32 - Right to Constitutional Remedies",
        "Article 21 - Right to Life and Personal Liberty"
      ],
      correct: 2,
      explanation: "Article 32 is called the 'Heart and Soul' of the Constitution by Dr. B.R. Ambedkar because it provides the means to enforce fundamental rights through the Supreme Court.",
      category: "Fundamental Rights"
    },
    {
      id: 2,
      question: "How many fundamental duties are mentioned in the Indian Constitution?",
      options: [
        "10 duties",
        "11 duties", 
        "12 duties",
        "9 duties"
      ],
      correct: 1,
      explanation: "There are 11 fundamental duties listed in Article 51A of the Constitution, added by the 42nd Amendment in 1976.",
      category: "Fundamental Duties"
    },
    {
      id: 3,
      question: "The Preamble declares India to be a:",
      options: [
        "Socialist, Secular, Democratic Republic",
        "Sovereign, Socialist, Secular, Democratic Republic",
        "Federal, Democratic Republic",
        "Sovereign, Democratic Republic"
      ],
      correct: 1,
      explanation: "The Preamble declares India to be a 'Sovereign, Socialist, Secular, Democratic Republic'. The terms 'Socialist' and 'Secular' were added by the 42nd Amendment in 1976.",
      category: "Preamble"
    },
    {
      id: 4,
      question: "Which part of the Constitution deals with Fundamental Rights?",
      options: [
        "Part II",
        "Part III",
        "Part IV",
        "Part V"
      ],
      correct: 1,
      explanation: "Part III of the Constitution (Articles 12-35) deals with Fundamental Rights.",
      category: "Constitutional Framework"
    },
    {
      id: 5,
      question: "The right to constitutional remedies empowers citizens to directly approach which court?",
      options: [
        "High Court only",
        "District Court",
        "Supreme Court only",
        "Both Supreme Court and High Court"
      ],
      correct: 2,
      explanation: "Article 32 empowers citizens to directly approach the Supreme Court for the enforcement of their fundamental rights.",
      category: "Fundamental Rights"
    },
    {
      id: 6,
      question: "Which fundamental duty relates to environmental protection?",
      options: [
        "To protect and improve the natural environment",
        "To safeguard public property",
        "To develop scientific temper",
        "To preserve composite culture"
      ],
      correct: 0,
      explanation: "Article 51A(g) makes it a fundamental duty 'to protect and improve the natural environment including forests, lakes, rivers and wild life and to have compassion for living creatures'.",
      category: "Fundamental Duties"
    },
    {
      id: 7,
      question: "The Constitution of India was adopted on:",
      options: [
        "26 January 1950",
        "15 August 1947",
        "26 November 1949",
        "2 October 1950"
      ],
      correct: 2,
      explanation: "The Constitution was adopted by the Constituent Assembly on 26 November 1949 and came into effect on 26 January 1950.",
      category: "Constitutional Framework"
    },
    {
      id: 8,
      question: "Which article prohibits discrimination on grounds of religion, race, caste, sex or place of birth?",
      options: [
        "Article 14",
        "Article 15",
        "Article 16",
        "Article 17"
      ],
      correct: 1,
      explanation: "Article 15 prohibits discrimination on grounds of religion, race, caste, sex or place of birth in matters of access to public places and services.",
      category: "Fundamental Rights"
    },
    {
      id: 9,
      question: "The duty to develop scientific temper and humanism is found in:",
      options: [
        "Article 51A(f)",
        "Article 51A(h)",
        "Article 51A(j)",
        "Article 51A(i)"
      ],
      correct: 1,
      explanation: "Article 51A(h) makes it a fundamental duty 'to develop the scientific temper, humanism and the spirit of inquiry and reform'.",
      category: "Fundamental Duties"
    },
    {
      id: 10,
      question: "How many schedules are there in the Indian Constitution currently?",
      options: [
        "10 schedules",
        "11 schedules",
        "12 schedules",
        "13 schedules"
      ],
      correct: 2,
      explanation: "The Indian Constitution currently has 12 schedules. The 12th schedule was added by the 73rd Amendment dealing with Panchayati Raj institutions.",
      category: "Constitutional Framework"
    }
  ];

  const handleAnswerSelect = (questionIndex: number, answerIndex: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: answerIndex
    });
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((question, index) => {
      if (selectedAnswers[index] !== undefined && 
          parseInt(selectedAnswers[index]) === question.correct) {
        correct++;
      }
    });
    return correct;
  };

  const getScoreMessage = (score: number) => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 90) return { message: "Excellent! You have mastery of constitutional knowledge.", color: "text-green-600" };
    if (percentage >= 75) return { message: "Very Good! You have a strong understanding.", color: "text-blue-600" };
    if (percentage >= 60) return { message: "Good! You have basic understanding, keep learning.", color: "text-yellow-600" };
    return { message: "Keep studying! Review the content and try again.", color: "text-red-600" };
  };

  const finishQuiz = async () => {
    const score = calculateScore();
    const timeSpent = Math.floor((Date.now() - startTime) / 1000); // in seconds
    
    setShowResults(true);
    setQuizCompleted(true);
    onComplete();

    // Submit quiz results to backend if user is logged in
    if (user) {
      try {
        const answers = questions.map((q, index) => ({
          questionId: q.id,
          selectedOption: selectedAnswers[index],
          isCorrect: selectedAnswers[index] !== undefined ? parseInt(selectedAnswers[index]) === q.correct : false
        }));

        await submitQuiz('constitutional-knowledge', score, questions.length, answers, timeSpent);
      } catch (error) {
        console.error('Failed to submit quiz results:', error);
      }
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setShowResults(false);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      finishQuiz();
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const answeredQuestions = Object.keys(selectedAnswers).length;

  if (showResults) {
    const score = calculateScore();
    const scoreInfo = getScoreMessage(score);
    
    return (
      <div className="space-y-6">
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Trophy className="w-16 h-16 text-yellow-500" />
            </div>
            <CardTitle className="text-2xl">Quiz Results</CardTitle>
            <CardDescription>Here's how you performed on the Constitution Quiz</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-blue-600">{score}/{questions.length}</div>
              <div className="text-lg text-gray-600">Correct Answers</div>
              <div className={`text-lg font-medium ${scoreInfo.color}`}>
                {Math.round((score / questions.length) * 100)}% Score
              </div>
            </div>
            
            <div className="p-4 bg-white rounded-lg border">
              <p className={`font-medium ${scoreInfo.color}`}>
                {scoreInfo.message}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="font-medium text-green-800">Correct</div>
                <div className="text-2xl font-bold text-green-600">{score}</div>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <div className="font-medium text-red-800">Incorrect</div>
                <div className="text-2xl font-bold text-red-600">{questions.length - score}</div>
              </div>
            </div>

            <Button onClick={resetQuiz} className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retake Quiz
            </Button>
          </CardContent>
        </Card>

        {/* Detailed Results */}
        <Card>
          <CardHeader>
            <CardTitle>Detailed Results</CardTitle>
            <CardDescription>Review your answers and learn from explanations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {questions.map((question, index) => {
              const userAnswer = selectedAnswers[index] ? parseInt(selectedAnswers[index]) : -1;
              const isCorrect = userAnswer === question.correct;
              
              return (
                <div key={question.id} className="p-4 border rounded-lg">
                  <div className="flex items-start space-x-3">
                    {isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-medium">Question {index + 1}</span>
                        <Badge variant="outline">{question.category}</Badge>
                      </div>
                      <p className="text-sm mb-3">{question.question}</p>
                      
                      <div className="space-y-1 text-sm">
                        <div className="text-green-600 font-medium">
                          ✓ Correct: {question.options[question.correct]}
                        </div>
                        {userAnswer !== -1 && userAnswer !== question.correct && (
                          <div className="text-red-600">
                            ✗ Your answer: {question.options[userAnswer]}
                          </div>
                        )}
                        {userAnswer === -1 && (
                          <div className="text-gray-600">
                            No answer selected
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800">{question.explanation}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="w-6 h-6 text-purple-600" />
            <span>Constitutional Knowledge Quiz</span>
          </CardTitle>
          <CardDescription>
            Test your understanding of the Indian Constitution
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span>Progress</span>
              <span>{currentQuestion + 1} of {questions.length}</span>
            </div>
            <Progress value={progress} className="w-full" />
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>No time limit</span>
              </div>
              <div className="flex items-center space-x-1">
                <Target className="w-4 h-4" />
                <span>Answered: {answeredQuestions}/{questions.length}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Question {currentQuestion + 1}</CardTitle>
              <Badge variant="outline" className="mt-1">
                {currentQ.category}
              </Badge>
            </div>
          </div>
          <CardDescription className="text-base mt-3">
            {currentQ.question}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <RadioGroup
            value={selectedAnswers[currentQuestion] || ""}
            onValueChange={(value) => handleAnswerSelect(currentQuestion, value)}
          >
            {currentQ.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={previousQuestion}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>
            
            <Button
              onClick={nextQuestion}
              disabled={selectedAnswers[currentQuestion] === undefined}
            >
              {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quiz Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Book className="w-5 h-5" />
            <span>Quiz Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
            {questions.map((_, index) => (
              <Button
                key={index}
                variant={currentQuestion === index ? "default" : "outline"}
                size="sm"
                className={`w-8 h-8 p-0 ${
                  selectedAnswers[index] !== undefined 
                    ? 'bg-green-100 border-green-300' 
                    : ''
                }`}
                onClick={() => setCurrentQuestion(index)}
              >
                {index + 1}
              </Button>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-3">
            Click on any question number to jump to that question
          </p>
        </CardContent>
      </Card>
    </div>
  );
}