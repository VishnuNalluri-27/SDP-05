import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Sparkles,
  BookOpen,
  Scale,
  Users,
  Building,
  Calendar,
  HelpCircle
} from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  quickReplies?: string[];
}

interface NitiChatBotProps {
  userRole: 'citizen' | 'educator' | 'admin' | 'legal-expert';
}

export function NitiChatBot({ userRole }: NitiChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hello! I'm Niti, your Constitutional Assistant. I can answer any questions about the Indian Constitution. Feel free to ask me anything about fundamental rights, duties, constitutional framework, or any other aspect of our Constitution!",
      timestamp: new Date(),
      quickReplies: [
        "What are fundamental rights?",
        "Tell me about the Preamble",
        "How many fundamental duties are there?",
        "Tell me about the Constituent Assembly"
      ]
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showPrompts, setShowPrompts] = useState(true);
  const [selectedPromptCategory, setSelectedPromptCategory] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const constitutionalKnowledge = {
    // INDIAN CONSTITUTION
    "fundamental rights": {
      answer: "The Indian Constitution guarantees 6 fundamental rights: 1) Right to Equality (Articles 14-18), 2) Right to Freedom (Articles 19-22), 3) Right against Exploitation (Articles 23-24), 4) Right to Freedom of Religion (Articles 25-28), 5) Cultural and Educational Rights (Articles 29-30), 6) Right to Constitutional Remedies (Article 32).",
      tags: ["rights", "constitution", "india"]
    },
    "fundamental duties": {
      answer: "The Indian Constitution contains 11 fundamental duties listed in Article 51A. These were added by the 42nd Amendment in 1976. They include respecting the Constitution, national unity, environmental protection, developing scientific temper, and more.",
      tags: ["duties", "amendment", "india"]
    },
    "indian preamble": {
      answer: "The Preamble to the Indian Constitution states: 'We, the people of India, having solemnly resolved to constitute India into a Sovereign, Socialist, Secular, Democratic Republic and to secure to all its citizens Justice, Liberty, Equality, and Fraternity.'",
      tags: ["preamble", "principles", "india"]
    },
    "constituent assembly": {
      answer: "The Indian Constituent Assembly was formed in 1946. Dr. Rajendra Prasad was its President and Dr. B.R. Ambedkar chaired the Drafting Committee. The Assembly adopted the Constitution on November 26, 1949, and it came into effect on January 26, 1950.",
      tags: ["history", "assembly", "india"]
    },
    "article 32": {
      answer: "Article 32 is called the 'Heart and Soul' of the Indian Constitution. It guarantees the right to constitutional remedies. Citizens can directly approach the Supreme Court for enforcement of their fundamental rights. The court can issue writs like Habeas Corpus, Mandamus, Prohibition, Certiorari, and Quo Warranto.",
      tags: ["article", "rights", "court", "india"]
    },
    "indian amendment": {
      answer: "The Indian Constitution amendment process is outlined in Article 368. There are three types of procedures: 1) Simple majority for some provisions, 2) Special majority (2/3 of members present + majority of total members), 3) Special majority + ratification by state legislatures for federal provisions.",
      tags: ["amendment", "procedure", "india"]
    },
    "directive principles": {
      answer: "Directive Principles of State Policy are in Part IV (Articles 36-51) of the Indian Constitution. They are not enforceable by courts but are fundamental guidelines for governance. They include equal justice, economic equality, village panchayats, education, and welfare of people.",
      tags: ["principles", "governance", "india"]
    },
    "indian federalism": {
      answer: "India has a federal system with powers divided between Center and States. The Seventh Schedule contains three lists: Union List (97 subjects), State List (66 subjects), and Concurrent List (47 subjects). Residuary powers vest with the Center.",
      tags: ["federalism", "powers", "india"]
    },

    // UNITED STATES CONSTITUTION
    "us constitution": {
      answer: "The US Constitution, adopted in 1787, establishes a federal republic with separation of powers among three branches: legislative (Congress), executive (President), and judicial (Supreme Court). It includes the Bill of Rights (first 10 amendments) guaranteeing fundamental freedoms like speech, religion, and due process.",
      tags: ["usa", "constitution", "bill of rights"]
    },
    "bill of rights": {
      answer: "The US Bill of Rights comprises the first 10 amendments to the Constitution, ratified in 1791. Key rights include: 1st Amendment (freedom of speech, religion, press), 2nd Amendment (right to bear arms), 4th Amendment (protection against unreasonable searches), 5th Amendment (due process), and others.",
      tags: ["usa", "rights", "amendments"]
    },
    "us federalism": {
      answer: "The US follows a federal system where powers are divided between federal and state governments. The Constitution grants specific powers to the federal government (enumerated powers) while reserving others to states (10th Amendment). This creates a balance between national unity and state autonomy.",
      tags: ["usa", "federalism", "powers"]
    },
    "us amendment process": {
      answer: "The US Constitution can be amended through two methods: 1) Congressional proposal (2/3 majority in both houses) + ratification by 3/4 of states, or 2) Constitutional convention called by 2/3 of states + ratification by 3/4 of states. All 27 amendments have used the first method.",
      tags: ["usa", "amendment", "procedure"]
    },

    // UNITED KINGDOM CONSTITUTION
    "uk constitution": {
      answer: "The UK has an unwritten constitution based on statutes, common law, conventions, and traditions. Key documents include Magna Carta (1215), Bill of Rights (1689), and various Acts of Parliament. It features parliamentary sovereignty, rule of law, and constitutional monarchy.",
      tags: ["uk", "constitution", "unwritten"]
    },
    "parliamentary sovereignty": {
      answer: "Parliamentary sovereignty is a fundamental principle of the UK constitution, meaning Parliament has supreme legal authority and can make or unmake any law. No other body can override or set aside Parliament's legislation, and no Parliament can bind its successors.",
      tags: ["uk", "parliament", "sovereignty"]
    },
    "magna carta": {
      answer: "Magna Carta (1215) is a foundational document limiting royal power and establishing rule of law. Key principles include due process, protection from arbitrary imprisonment, and the idea that even the monarch is subject to law. It influenced constitutional development worldwide.",
      tags: ["uk", "magna carta", "history"]
    },

    // GERMAN CONSTITUTION (BASIC LAW)
    "german constitution": {
      answer: "Germany's Basic Law (Grundgesetz), adopted in 1949, establishes a federal parliamentary republic. It emphasizes human dignity (Article 1), federal structure with 16 states (Länder), and a mixed-member proportional electoral system. The Federal Constitutional Court is a key guardian of constitutional rights.",
      tags: ["germany", "constitution", "basic law"]
    },
    "german federalism": {
      answer: "Germany has a federal system with 16 states (Länder) having significant autonomy in education, culture, and local administration. The Bundesrat (Federal Council) represents state interests at the federal level. This system balances central coordination with regional self-governance.",
      tags: ["germany", "federalism", "länder"]
    },
    "human dignity": {
      answer: "Article 1 of the German Basic Law states 'Human dignity shall be inviolable.' This principle is the foundation of all other rights and cannot be amended. It influenced post-war European human rights development and emphasizes the inherent worth of every individual.",
      tags: ["germany", "human dignity", "rights"]
    },

    // FRENCH CONSTITUTION
    "french constitution": {
      answer: "France's current Constitution (Fifth Republic, 1958) establishes a semi-presidential system with both a President and Prime Minister. It includes the Declaration of Rights of Man and Citizen (1789) and emphasizes principles of liberty, equality, fraternity, and laïcité (secularism).",
      tags: ["france", "constitution", "fifth republic"]
    },
    "french rights": {
      answer: "French constitutional rights stem from the 1789 Declaration of Rights of Man and Citizen, which proclaimed natural rights including liberty, property, security, and resistance to oppression. Modern France also recognizes social and economic rights through various constitutional texts.",
      tags: ["france", "rights", "declaration"]
    },
    "laicite": {
      answer: "Laïcité is a fundamental principle of French republicanism, ensuring strict separation of church and state. It guarantees freedom of conscience while maintaining state neutrality in religious matters. This principle is more restrictive than US-style religious freedom.",
      tags: ["france", "secularism", "laicite"]
    },

    // CANADIAN CONSTITUTION
    "canadian constitution": {
      answer: "Canada's Constitution includes the Constitution Act 1867 (creating the federation) and Constitution Act 1982 (patriating the constitution and adding the Charter of Rights and Freedoms). It establishes a federal parliamentary democracy and constitutional monarchy.",
      tags: ["canada", "constitution", "charter"]
    },
    "canadian charter": {
      answer: "The Canadian Charter of Rights and Freedoms (1982) guarantees fundamental freedoms, democratic rights, mobility rights, legal rights, equality rights, and language rights. It allows reasonable limits on rights and includes the notwithstanding clause (Section 33).",
      tags: ["canada", "charter", "rights"]
    },
    "notwithstanding clause": {
      answer: "Section 33 of the Canadian Charter allows federal Parliament and provincial legislatures to override certain Charter rights for up to 5 years (renewable). This provides legislative supremacy in exceptional cases while maintaining judicial review of most rights.",
      tags: ["canada", "notwithstanding", "charter"]
    },

    // SOUTH AFRICAN CONSTITUTION
    "south african constitution": {
      answer: "South Africa's Constitution (1996) is considered one of the world's most progressive, emphasizing human dignity, equality, and freedom. It includes extensive socio-economic rights, multiple official languages, and a strong Constitutional Court. It was crucial in the post-apartheid transition.",
      tags: ["south africa", "constitution", "human rights"]
    },
    "socio-economic rights": {
      answer: "South Africa's Constitution uniquely includes justiciable socio-economic rights such as housing, healthcare, food, water, and social security. The Constitutional Court has developed progressive realization doctrine, requiring the state to take reasonable measures to achieve these rights.",
      tags: ["south africa", "socio-economic rights", "progressive"]
    },

    // JAPANESE CONSTITUTION
    "japanese constitution": {
      answer: "Japan's Constitution (1947) is known for its pacifist Article 9, which renounces war and prohibits maintaining armed forces. It establishes popular sovereignty, fundamental human rights, and separation of powers. The Emperor serves as a symbol of state with no political power.",
      tags: ["japan", "constitution", "pacifist"]
    },
    "article 9": {
      answer: "Article 9 of Japan's Constitution states that Japan 'forever renounces war as a sovereign right of the nation and the threat or use of force as means of settling international disputes.' This pacifist clause has been reinterpreted to allow Self-Defense Forces.",
      tags: ["japan", "article 9", "pacifism"]
    },

    // COMPARATIVE CONSTITUTIONAL ANALYSIS
    "constitutional comparison": {
      answer: "World constitutions vary greatly: India (longest written constitution), UK (unwritten), Germany (emphasizing human dignity), France (semi-presidential), Canada (Charter of Rights), South Africa (socio-economic rights), Japan (pacifist), USA (oldest written). Each reflects unique historical experiences and values.",
      tags: ["comparative", "analysis", "global"]
    },
    "judicial review": {
      answer: "Judicial review powers vary globally: USA (Marbury v. Madison established it), Germany (strong Constitutional Court), India (extensive review powers), UK (limited due to parliamentary sovereignty), France (Constitutional Council), Canada (Charter-based review). Each system balances judicial and legislative power differently.",
      tags: ["comparative", "judicial review", "courts"]
    },
    "amendment difficulty": {
      answer: "Constitutional amendment difficulty varies: USA (very rigid - only 27 amendments in 230+ years), Germany (moderate flexibility with eternity clauses), India (detailed procedures but over 100 amendments), UK (parliamentary acts can change constitution), France (presidential/parliamentary routes available).",
      tags: ["comparative", "amendments", "flexibility"]
    }
  };

  const quickQuestions = [
    { icon: Scale, text: "What are fundamental rights?", category: "Indian Rights" },
    { icon: Users, text: "Compare US and Indian constitutions", category: "Comparison" },
    { icon: BookOpen, text: "Tell me about the German Basic Law", category: "Germany" },
    { icon: Building, text: "What is UK's unwritten constitution?", category: "UK" },
    { icon: Calendar, text: "Compare amendment processes globally", category: "Amendments" },
    { icon: HelpCircle, text: "What are socio-economic rights?", category: "South Africa" }
  ];

  const customPrompts = {
    "Constitutional Basics": [
      "What is a constitution and why do countries need one?",
      "How many countries have written constitutions vs unwritten ones?",
      "What are the key components every constitution should have?",
      "Which is the world's longest constitution and which is the shortest?"
    ],
    "Rights & Freedoms": [
      "Compare fundamental rights in India, USA, and Germany",
      "What are socio-economic rights and which countries guarantee them?",
      "How do different countries protect freedom of speech and expression?",
      "What is the difference between civil rights and human rights?"
    ],
    "Government Structure": [
      "Explain the difference between federal and unitary systems with examples",
      "Compare presidential, parliamentary, and semi-presidential systems",
      "How does separation of powers work in different countries?",
      "What is the role of judiciary in constitutional interpretation globally?"
    ],
    "Constitutional History": [
      "How did the US Constitution influence other countries' constitutions?",
      "What lessons did India learn from other constitutions while drafting ours?",
      "How did Germany's constitution change after World War II?",
      "What makes South Africa's post-apartheid constitution unique?"
    ],
    "Comparative Analysis": [
      "Which country has the most flexible constitution for amendments?",
      "Compare how different countries handle emergency powers",
      "How do various countries balance individual rights with collective security?",
      "Which constitutional model would work best for a new democracy?"
    ],
    "Modern Challenges": [
      "How are constitutions adapting to digital age and cyber rights?",
      "What role do constitutions play in addressing climate change?",
      "How do different countries constitutionally handle immigration and citizenship?",
      "What are the emerging trends in constitutional reform globally?"
    ]
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const generateResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase().trim();
    
    // Handle greetings first
    const greetings = [
      'hi', 'hello', 'hey', 'hola', 'greetings', 'good morning', 'good afternoon', 
      'good evening', 'good day', 'namaste', 'namaskar', 'howdy', 'what\'s up', 
      'whats up', 'sup', 'yo', 'hiya', 'salutations'
    ];
    
    if (greetings.some(greeting => lowerQuery === greeting || lowerQuery.startsWith(greeting + ' ') || lowerQuery.endsWith(' ' + greeting))) {
      const greetingResponses = [
        "Hello! I'm Niti, your Global Constitutional Assistant. I can help you explore constitutional systems from around the world - India, USA, UK, Germany, France, Canada, South Africa, Japan, and more. What would you like to know?",
        "Hi there! Welcome to Samvidhan 360. I have knowledge about constitutional systems worldwide and can help you compare different countries, understand various rights frameworks, and explore global constitutional principles. How can I assist you today?",
        "Greetings! I'm delighted to help you explore constitutional law globally. Whether you're curious about fundamental rights, comparing different systems, or understanding how various democracies work, I'm here to guide you. What's your question?",
        "Hello and welcome! I'm Niti, and I love discussing constitutional systems from around the world. You can ask me about specific countries, compare constitutional features, or learn about global legal principles. What interests you most?",
        "Hi! It's wonderful to meet you. I'm your friendly Global Constitutional Assistant, ready to share knowledge about constitutional systems worldwide - from India's comprehensive framework to America's Bill of Rights, Germany's Basic Law, and beyond. What would you like to learn about today?"
      ];
      return greetingResponses[Math.floor(Math.random() * greetingResponses.length)];
    }

    // Handle basic conversational responses
    if (lowerQuery.includes('how are you') || lowerQuery.includes('how do you do')) {
      return "I'm doing great, thank you for asking! I'm always excited to discuss constitutional systems from around the world. From India's comprehensive framework to America's pioneering Bill of Rights, each constitution tells a unique story of democracy. What constitutional topic interests you today?";
    }

    if (lowerQuery.includes('thank you') || lowerQuery.includes('thanks') || lowerQuery.includes('thank u')) {
      return "You're very welcome! I'm glad I could help you explore constitutional law. Feel free to ask me anything else about different countries' constitutions, comparative analysis, global rights frameworks, or any other constitutional topic from around the world. I'm here to help!";
    }

    if (lowerQuery.includes('bye') || lowerQuery.includes('goodbye') || lowerQuery.includes('see you') || lowerQuery.includes('farewell')) {
      return "Goodbye! It was wonderful exploring constitutional systems with you. Remember, understanding different constitutional frameworks helps us appreciate the diversity of democratic governance worldwide. Feel free to come back anytime you want to compare constitutions or learn more about global legal systems!";
    }

    // Check for matches in knowledge base
    for (const [key, value] of Object.entries(constitutionalKnowledge)) {
      if (lowerQuery.includes(key.toLowerCase()) || 
          lowerQuery.includes(key.toLowerCase().replace(/\s+/g, '')) ||
          value.tags.some(tag => lowerQuery.includes(tag.toLowerCase()))) {
        return value.answer;
      }
    }

    // Country-specific constitutional queries
    if (lowerQuery.includes('usa') || lowerQuery.includes('america') || lowerQuery.includes('us constitution')) {
      return constitutionalKnowledge["us constitution"].answer;
    }
    
    if (lowerQuery.includes('bill of rights') && (lowerQuery.includes('us') || lowerQuery.includes('america'))) {
      return constitutionalKnowledge["bill of rights"].answer;
    }
    
    if (lowerQuery.includes('uk') || lowerQuery.includes('british') || lowerQuery.includes('britain') || lowerQuery.includes('unwritten constitution')) {
      return constitutionalKnowledge["uk constitution"].answer;
    }
    
    if (lowerQuery.includes('germany') || lowerQuery.includes('german') || lowerQuery.includes('basic law')) {
      return constitutionalKnowledge["german constitution"].answer;
    }
    
    if (lowerQuery.includes('france') || lowerQuery.includes('french')) {
      return constitutionalKnowledge["french constitution"].answer;
    }
    
    if (lowerQuery.includes('canada') || lowerQuery.includes('canadian')) {
      return constitutionalKnowledge["canadian constitution"].answer;
    }
    
    if (lowerQuery.includes('south africa') || lowerQuery.includes('south african')) {
      return constitutionalKnowledge["south african constitution"].answer;
    }
    
    if (lowerQuery.includes('japan') || lowerQuery.includes('japanese')) {
      return constitutionalKnowledge["japanese constitution"].answer;
    }

    // Comparative and general constitutional concepts
    if (lowerQuery.includes('compare') || lowerQuery.includes('comparison') || lowerQuery.includes('difference')) {
      return constitutionalKnowledge["constitutional comparison"].answer;
    }
    
    if (lowerQuery.includes('judicial review')) {
      return constitutionalKnowledge["judicial review"].answer;
    }
    
    if (lowerQuery.includes('human dignity')) {
      return constitutionalKnowledge["human dignity"].answer;
    }
    
    if (lowerQuery.includes('socio-economic rights')) {
      return constitutionalKnowledge["socio-economic rights"].answer;
    }
    
    if (lowerQuery.includes('article 9') || lowerQuery.includes('pacifist')) {
      return constitutionalKnowledge["article 9"].answer;
    }
    
    if (lowerQuery.includes('charter') && lowerQuery.includes('canada')) {
      return constitutionalKnowledge["canadian charter"].answer;
    }
    
    if (lowerQuery.includes('magna carta')) {
      return constitutionalKnowledge["magna carta"].answer;
    }
    
    if (lowerQuery.includes('laicite') || lowerQuery.includes('secularism')) {
      return constitutionalKnowledge["laicite"].answer;
    }

    // Indian Constitution specific queries
    if (lowerQuery.includes('fundamental right')) {
      return constitutionalKnowledge["fundamental rights"].answer;
    }
    
    if (lowerQuery.includes('fundamental dut')) {
      return constitutionalKnowledge["fundamental duties"].answer;
    }
    
    if (lowerQuery.includes('preamble') && !lowerQuery.includes('us') && !lowerQuery.includes('america')) {
      return constitutionalKnowledge["indian preamble"].answer;
    }
    
    if (lowerQuery.includes('constituent assembly')) {
      return constitutionalKnowledge["constituent assembly"].answer;
    }
    
    if (lowerQuery.includes('article 32')) {
      return constitutionalKnowledge["article 32"].answer;
    }
    
    if (lowerQuery.includes('amendment') && !lowerQuery.includes('us') && !lowerQuery.includes('america')) {
      return constitutionalKnowledge["indian amendment"].answer;
    }
    
    if (lowerQuery.includes('federal') && !lowerQuery.includes('us') && !lowerQuery.includes('america') && !lowerQuery.includes('germany')) {
      return constitutionalKnowledge["indian federalism"].answer;
    }
    
    if (lowerQuery.includes('directive principle')) {
      return constitutionalKnowledge["directive principles"].answer;
    }

    // General responses for common queries
    if (lowerQuery.includes('when')) {
      if (lowerQuery.includes('us') || lowerQuery.includes('america')) {
        return "The US Constitution was written in 1787 and ratified in 1788. The Bill of Rights was added in 1791.";
      } else if (lowerQuery.includes('germany')) {
        return "Germany's Basic Law was adopted on May 23, 1949, and came into effect for West Germany, later extended to unified Germany in 1990.";
      } else if (lowerQuery.includes('france')) {
        return "France's current Constitution (Fifth Republic) was adopted on October 4, 1958, under Charles de Gaulle.";
      } else if (lowerQuery.includes('canada')) {
        return "Canada's Constitution Act was patriated in 1982, adding the Charter of Rights and Freedoms. The original British North America Act was from 1867.";
      } else if (lowerQuery.includes('south africa')) {
        return "South Africa's current Constitution came into effect on February 4, 1997, replacing the interim Constitution of 1994.";
      } else {
        return "The Indian Constitution was adopted on November 26, 1949, and came into effect on January 26, 1950.";
      }
    }
    
    if (lowerQuery.includes('how many')) {
      if (lowerQuery.includes('amendment')) {
        return "Constitutional amendments vary by country: USA has 27 amendments (since 1789), India has over 100 amendments, Germany allows amendments but with some eternal clauses, while the UK can amend through regular legislation.";
      } else {
        return "The Indian Constitution currently has 448 articles, 25 parts, and 12 schedules. There are 6 fundamental rights and 11 fundamental duties. Other countries have different structures - the US Constitution has 7 articles, Germany's Basic Law has 146 articles.";
      }
    }
    
    if (lowerQuery.includes('why')) {
      return "Constitutions serve as the supreme law that defines government powers, protects citizen rights, and establishes the legal framework for society. Each country's constitution reflects its unique history, values, and democratic aspirations.";
    }
    
    if (lowerQuery.includes('which country') || lowerQuery.includes('best constitution')) {
      return "Each constitution reflects its country's unique needs and history. India's is the longest written constitution, Germany's emphasizes human dignity, South Africa's includes socio-economic rights, the US Constitution is the oldest written one still in use, while the UK's unwritten constitution offers flexibility.";
    }

    // Handle unclear or vague queries
    if (lowerQuery.length < 3) {
      return "I'd love to help you! Could you please ask a more specific question about the Indian Constitution? For example, you could ask about fundamental rights, duties, constitutional history, or any specific article.";
    }

    // Default response for unrecognized queries
    return "I'd be happy to help you explore constitutional systems worldwide! I can provide detailed information about constitutions from India, USA, UK, Germany, France, Canada, South Africa, Japan, and more. You can ask about specific countries, compare constitutional features, or learn about concepts like fundamental rights, federalism, judicial review, and amendment processes. Try asking 'Compare US and Indian constitutions' or 'What is Germany's Basic Law?'";
  };

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse = generateResponse(message);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: botResponse,
        timestamp: new Date(),
        quickReplies: getQuickReplies(message)
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // 1-2 seconds delay
  };

  const handlePromptSelect = (prompt: string) => {
    setInputMessage(prompt);
    setShowPrompts(false);
  };

  const getQuickReplies = (query: string): string[] => {
    const lowerQuery = query.toLowerCase();
    
    // After greetings, show popular topics
    const greetings = ['hi', 'hello', 'hey', 'hola', 'greetings', 'good morning', 'good afternoon', 'good evening'];
    if (greetings.some(greeting => lowerQuery.includes(greeting))) {
      return [
        "Compare US and Indian constitutions",
        "What is Germany's Basic Law?",
        "Tell me about UK's unwritten constitution",
        "What are socio-economic rights in South Africa?"
      ];
    }
    
    // Country-specific follow-ups
    if (lowerQuery.includes('us') || lowerQuery.includes('america')) {
      return [
        "What is the Bill of Rights?",
        "How does US federalism work?",
        "What is judicial review in the US?"
      ];
    }
    
    if (lowerQuery.includes('uk') || lowerQuery.includes('britain')) {
      return [
        "What is parliamentary sovereignty?",
        "Tell me about Magna Carta",
        "How does UK's unwritten constitution work?"
      ];
    }
    
    if (lowerQuery.includes('germany')) {
      return [
        "What is human dignity in German law?",
        "How does German federalism work?",
        "What are eternity clauses?"
      ];
    }
    
    if (lowerQuery.includes('compare') || lowerQuery.includes('comparison')) {
      return [
        "Compare amendment processes globally",
        "Which constitution is most flexible?",
        "Compare judicial review systems"
      ];
    }
    
    if (lowerQuery.includes('fundamental right')) {
      return [
        "Compare rights in US vs India",
        "What is the right to equality?",
        "Tell me about right to freedom"
      ];
    }
    
    if (lowerQuery.includes('fundamental dut')) {
      return [
        "Do other countries have fundamental duties?",
        "Environmental protection duty",
        "Compare duties vs rights"
      ];
    }
    
    return [
      "Compare constitutional structures globally",
      "What is the longest constitution?",
      "Which country has the oldest constitution?"
    ];
  };

  const handleQuickReply = (reply: string) => {
    handleSendMessage(reply);
  };

  const getRoleSpecificWelcome = () => {
    const welcomes = {
      citizen: "As a citizen, you can learn about rights and duties from constitutions worldwide, comparing how different democracies protect their people.",
      educator: "As an educator, you can get comparative constitutional information to teach students about different democratic systems and global legal frameworks.",
      admin: "As an admin, you can explore constitutional provisions and legal frameworks from various countries to understand different governance models.",
      'legal-expert': "As a legal expert, you can analyze constitutional systems globally, compare judicial interpretations, and explore how different countries handle similar legal challenges."
    };
    return welcomes[userRole];
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span>Niti Chat Bot</span>
            <Badge variant="secondary">AI Assistant</Badge>
          </CardTitle>
          <CardDescription>
            Your Global Constitutional Assistant - Ask me about constitutional systems worldwide
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            {getRoleSpecificWelcome()}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickQuestions.slice(0, 3).map((question, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleQuickReply(question.text)}
                className="flex items-center space-x-2 justify-start h-auto p-3"
              >
                <question.icon className="w-4 h-4 text-blue-500" />
                <div className="text-left">
                  <div className="text-xs text-gray-500">{question.category}</div>
                  <div className="text-sm">{question.text}</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Custom Prompts Section */}
      {showPrompts && (
        <Card className="border-2 border-dashed border-blue-200 bg-gradient-to-r from-blue-50/50 to-purple-50/50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <span className="text-2xl">💡</span>
                <span>Custom Prompts - Click to Ask</span>
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowPrompts(false)}
              >
                Hide Prompts
              </Button>
            </CardTitle>
            <CardDescription>
              Choose from these expertly crafted questions to explore constitutional topics worldwide
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Category Selector */}
              <div className="flex flex-wrap gap-2 mb-4">
                {Object.keys(customPrompts).map((category) => (
                  <Button
                    key={category}
                    variant={selectedPromptCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedPromptCategory(
                      selectedPromptCategory === category ? null : category
                    )}
                    className="text-xs"
                  >
                    {category}
                  </Button>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedPromptCategory(null)}
                  className="text-xs"
                >
                  Show All
                </Button>
              </div>

              {/* Prompts Display */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                {Object.entries(customPrompts)
                  .filter(([category]) => 
                    !selectedPromptCategory || selectedPromptCategory === category
                  )
                  .map(([category, prompts]) => (
                    <div key={category} className="space-y-2">
                      <h4 className="font-medium text-sm text-gray-700 border-l-4 border-blue-500 pl-2 bg-blue-50 py-1">
                        {category}
                      </h4>
                      <div className="space-y-1">
                        {prompts.map((prompt, index) => (
                          <Button
                            key={index}
                            variant="ghost"
                            size="sm"
                            className="w-full text-left justify-start h-auto p-2 text-xs hover:bg-blue-50 hover:text-blue-700 border border-transparent hover:border-blue-200"
                            onClick={() => handlePromptSelect(prompt)}
                          >
                            <span className="line-clamp-2 leading-relaxed">{prompt}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>

              {/* Quick Action Buttons */}
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                <div className="text-xs text-gray-500">
                  💡 Tip: Click any prompt to auto-fill your message
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPrompts(false)}
                  className="text-xs"
                >
                  Start Chatting →
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Show Prompts Button when hidden */}
      {!showPrompts && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPrompts(true)}
            className="text-xs"
          >
            💡 Show Custom Prompts
          </Button>
        </div>
      )}

      <Card className="h-[600px] flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageCircle className="w-5 h-5 text-blue-600" />
            <span>Chat Window</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex space-x-2 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className={message.type === 'user' ? 'bg-blue-500 text-white' : 'bg-purple-500 text-white'}>
                        {message.type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`space-y-2 ${message.type === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                      <div
                        className={`p-3 rounded-lg ${
                          message.type === 'user'
                            ? 'bg-blue-500 text-white rounded-br-none'
                            : 'bg-gray-100 text-gray-900 rounded-bl-none'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                      <div className="text-xs text-gray-500">
                        {message.timestamp.toLocaleTimeString('hi-IN', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                      {message.quickReplies && message.quickReplies.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {message.quickReplies.map((reply, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuickReply(reply)}
                              className="text-xs h-8"
                            >
                              {reply}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex space-x-2 max-w-[80%]">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-purple-500 text-white">
                        <Bot className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-gray-100 text-gray-900 p-3 rounded-lg rounded-bl-none">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          
          <div className="border-t p-4">
            <div className="space-y-2">
              {/* Quick Access Prompt Buttons */}
              {!showPrompts && inputMessage === '' && (
                <div className="flex flex-wrap gap-1 mb-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePromptSelect("Compare US and Indian constitutions")}
                    className="text-xs h-6 px-2 bg-blue-50 hover:bg-blue-100 text-blue-700"
                  >
                    Compare US & India
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePromptSelect("What are socio-economic rights and which countries guarantee them?")}
                    className="text-xs h-6 px-2 bg-green-50 hover:bg-green-100 text-green-700"
                  >
                    Socio-Economic Rights
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePromptSelect("Which country has the most flexible constitution for amendments?")}
                    className="text-xs h-6 px-2 bg-purple-50 hover:bg-purple-100 text-purple-700"
                  >
                    Amendment Flexibility
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPrompts(true)}
                    className="text-xs h-6 px-2 bg-gray-50 hover:bg-gray-100 text-gray-700"
                  >
                    More Prompts...
                  </Button>
                </div>
              )}
              
              <div className="flex space-x-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type your question here or use prompts above..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(inputMessage);
                    }
                  }}
                  className="flex-1"
                />
                <Button 
                  onClick={() => handleSendMessage(inputMessage)}
                  disabled={!inputMessage.trim() || isTyping}
                  size="icon"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Press Enter or click Send button. Niti will answer your constitutional questions.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}