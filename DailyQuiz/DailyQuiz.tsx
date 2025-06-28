import React, { useState, useEffect, useCallback, useMemo } from 'react';

// Types
interface Question {
  id: string;
  date: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface QuizResult {
  questionId: string;
  date: string;
  answered: boolean;
  correct: boolean;
  timeSpent: number;
  attempts: number;
}

interface AnimationState {
  screen: 'quiz' | 'result' | 'history';
  isTransitioning: boolean;
}

// Sample quiz data - In production, this would come from an API
const sampleQuestions: Question[] = [
  {
    id: '1',
    date: new Date().toISOString().split('T')[0], // Today's date
    question: "What is the largest planet in our solar system?",
    options: ["Earth", "Mars", "Jupiter", "Saturn"],
    correctAnswer: 2,
    explanation: "Jupiter is the largest planet in our solar system, with a mass more than twice that of all other planets combined!"
  },
  {
    id: '2',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0], // Yesterday
    question: "Which programming language was created by Brendan Eich?",
    options: ["Python", "JavaScript", "Java", "Ruby"],
    correctAnswer: 1,
    explanation: "JavaScript was created by Brendan Eich in just 10 days in 1995 while working at Netscape!"
  },
  {
    id: '3',
    date: new Date(Date.now() - 172800000).toISOString().split('T')[0], // Day before yesterday
    question: "What is the speed of light in vacuum?",
    options: ["299,792 km/s", "150,000 km/s", "500,000 km/s", "1,000,000 km/s"],
    correctAnswer: 0,
    explanation: "The speed of light in vacuum is exactly 299,792,458 meters per second, a fundamental constant of nature!"
  }
];

// Utility functions for localStorage persistence
const getStorageKey = (questionId: string) => `quiz_result_${questionId}`;

const saveResult = (result: QuizResult) => {
  localStorage.setItem(getStorageKey(result.questionId), JSON.stringify(result));
};

const loadResult = (questionId: string): QuizResult | null => {
  const stored = localStorage.getItem(getStorageKey(questionId));
  return stored ? JSON.parse(stored) : null;
};

const loadAllResults = (): QuizResult[] => {
  const results: QuizResult[] = [];
  // Scan all localStorage keys for quiz results
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith('quiz_result_')) {
      const result = localStorage.getItem(key);
      if (result) results.push(JSON.parse(result));
    }
  }
  // Sort by date, newest first
  return results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Animated background with floating SVG elements
const BackgroundAnimation: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        <defs>
          {/* Gradient definitions using brand colors */}
          <radialGradient id="gradient1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#509166" stopOpacity="0.1"/>
            <stop offset="100%" stopColor="#A41623" stopOpacity="0.05"/>
          </radialGradient>
          <radialGradient id="gradient2" cx="30%" cy="70%" r="40%">
            <stop offset="0%" stopColor="#F85E00" stopOpacity="0.08"/>
            <stop offset="100%" stopColor="#FFB563" stopOpacity="0.03"/>
          </radialGradient>
        </defs>
        
        {/* Floating circles with different animation durations for organic movement */}
        <circle cx="20" cy="20" r="15" fill="url(#gradient1)" className="animate-float-1">
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0,0; 10,15; 0,0"
            dur="8s"
            repeatCount="indefinite"
          />
        </circle>
        
        <circle cx="80" cy="30" r="12" fill="url(#gradient2)" className="animate-float-2">
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0,0; -8,12; 0,0"
            dur="6s"
            repeatCount="indefinite"
          />
        </circle>
        
        <circle cx="70" cy="80" r="18" fill="url(#gradient1)" className="animate-float-3">
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0,0; 12,-10; 0,0"
            dur="10s"
            repeatCount="indefinite"
          />
        </circle>
        
        <circle cx="15" cy="70" r="10" fill="url(#gradient2)" className="animate-float-4">
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0,0; 15,8; 0,0"
            dur="7s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    </div>
  );
};

// Timer component with visual urgency indicators
const Timer: React.FC<{ seconds: number; isRunning: boolean }> = ({ seconds, isRunning }) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  
  return (
    <div className={`flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg mb-4 sm:mb-6 border border-white/20 ${
      isRunning && seconds <= 10 ? 'animate-pulse ring-2 ring-red-400' : '' // Visual urgency when time is low
    }`}>
      <div className="relative">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#509166] sm:w-7 sm:h-7">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
          <path d="M12 6 L12 12 L16 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        {/* Animated ping effect while timer is running */}
        {isRunning && (
          <div className="absolute inset-0 rounded-full bg-[#509166]/20 animate-ping"></div>
        )}
      </div>
      <span className="text-xl sm:text-2xl font-bold text-[#509166] font-mono tracking-wide">
        {minutes}:{secs.toString().padStart(2, '0')}
      </span>
    </div>
  );
};

// Question display with multiple choice options
const QuestionCard: React.FC<{
  question: Question;
  selectedAnswer: number | null;
  onSelectAnswer: (index: number) => void;
  disabled: boolean;
}> = ({ question, selectedAnswer, onSelectAnswer, disabled }) => {
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl border border-white/30 animate-slide-up">
      <div className="mb-6 sm:mb-8">
        {/* Visual accent bar using brand gradient */}
        <div className="w-12 sm:w-16 h-1 bg-gradient-to-r from-[#A41623] to-[#F85E00] rounded-full mb-4 sm:mb-6"></div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 leading-relaxed">
          {question.question}
        </h2>
      </div>
      
      <div className="space-y-3 sm:space-y-4">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onSelectAnswer(index)}
            disabled={disabled}
            className={`group relative w-full flex items-center p-4 sm:p-5 rounded-xl sm:rounded-2xl text-left font-medium transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] border-2 ${
              selectedAnswer === index 
                ? 'bg-[#F85E00] text-white border-[#F85E00] shadow-lg scale-[0.98]' // Selected state
                : 'bg-[#FFD29D]/50 hover:bg-[#FFB563]/70 text-gray-800 border-[#FFB563]/30 hover:border-[#FFB563] hover:shadow-lg' // Default state
            } ${disabled ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
            style={{ touchAction: 'manipulation' }} // Optimize for touch
          >
            {/* Letter indicator (A, B, C, D) */}
            <div className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl font-bold text-base sm:text-lg mr-3 sm:mr-4 transition-colors ${
              selectedAnswer === index 
                ? 'bg-white/20 text-white' 
                : 'bg-white/60 text-[#A41623] group-hover:bg-white/80'
            }`}>
              {String.fromCharCode(65 + index)}
            </div>
            <span className="flex-1 text-base sm:text-lg">{option}</span>
            {/* Checkmark for selected answer */}
            {selectedAnswer === index && (
              <div className="absolute right-4 text-white">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

// Results screen with explanation and action buttons
const ResultScreen: React.FC<{
  question: Question;
  correct: boolean;
  timeSpent: number;
  attempts: number;
  onRetry: () => void;
  onShare: () => void;
  onViewHistory: () => void;
}> = ({ question, correct, timeSpent, attempts, onRetry, onShare, onViewHistory }) => {
  const minutes = Math.floor(timeSpent / 60);
  const seconds = timeSpent % 60;

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/30 animate-slide-up">
      <div className="text-center mb-8">
        {/* Success/failure indicator with bounce animation */}
        <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full text-white mb-6 animate-bounce-in shadow-2xl ${
          correct ? 'bg-[#509166]' : 'bg-[#F85E00]'
        }`}>
          {correct ? (
            <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
          ) : (
            <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          )}
        </div>
        
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          {correct ? 'Excellent!' : 'Good Try!'}
        </h2>
        
        <p className="text-lg text-gray-600">
          {correct ? 'You got it right!' : 'Keep learning and improving!'}
        </p>
      </div>
      
      {/* Educational explanation section */}
      <div className="bg-gradient-to-r from-[#FFD29D]/50 to-[#FFB563]/30 rounded-2xl p-6 mb-8 border border-[#FFB563]/20">
        <h3 className="text-lg font-bold text-[#A41623] mb-3 flex items-center">
          <svg width="20" height="20" className="mr-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          Did you know?
        </h3>
        <p className="text-gray-700 leading-relaxed">{question.explanation}</p>
      </div>
      
      {/* Performance statistics */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="text-center p-4 bg-white/50 rounded-2xl border border-white/30">
          <div className="text-sm font-medium text-gray-600 mb-2">Time Taken</div>
          <div className="text-3xl font-bold text-[#509166]">
            {minutes}:{seconds.toString().padStart(2, '0')}
          </div>
        </div>
        <div className="text-center p-4 bg-white/50 rounded-2xl border border-white/30">
          <div className="text-sm font-medium text-gray-600 mb-2">Attempts</div>
          <div className="text-3xl font-bold text-[#509166]">{attempts}</div>
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="space-y-4">
        <button 
          onClick={onRetry}
          className="w-full p-4 bg-[#FFB563] hover:bg-[#F85E00] text-white rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
        >
          Try Again for Fun!
        </button>
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={onShare}
            className="p-4 bg-[#509166] hover:bg-[#509166]/80 text-white rounded-2xl font-semibold transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
          >
            Share Score
          </button>
          <button 
            onClick={onViewHistory}
            className="p-4 bg-[#A41623] hover:bg-[#A41623]/80 text-white rounded-2xl font-semibold transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
          >
            View History
          </button>
        </div>
      </div>
    </div>
  );
};

// History screen with mobile-responsive layouts
const HistoryScreen: React.FC<{
  questions: Question[];
  results: QuizResult[];
  onBack: () => void;
}> = ({ questions, results, onBack }) => {
  // Create lookup map for efficient question retrieval
  const questionMap = useMemo(() => {
    const map = new Map<string, Question>();
    questions.forEach(q => map.set(q.id, q));
    return map;
  }, [questions]);

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/30 min-h-[calc(100vh-3rem)] animate-slide-up">
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 px-5 py-3 bg-[#FFB563] hover:bg-[#F85E00] text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
          Back to Quiz
        </button>
        <div className="text-right">
          <h2 className="text-3xl font-bold text-gray-800">Quiz History</h2>
          <p className="text-gray-600">Your learning journey</p>
        </div>
      </div>
      
      <div className="space-y-3">
        {results.map((result, index) => {
          const question = questionMap.get(result.questionId);
          if (!question) return null;
          
          return (
            <div 
              key={result.questionId} 
              className="group p-4 sm:p-6 bg-gradient-to-r from-white/80 to-[#FFD29D]/20 rounded-xl sm:rounded-2xl border border-white/30 hover:shadow-lg transition-all duration-300 animate-fade-in-delayed"
              style={{ animationDelay: `${index * 100}ms` }} // Staggered animation
            >
              {/* Mobile-optimized layout */}
              <div className="block sm:hidden">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs font-bold text-[#A41623] bg-[#FFD29D]/50 px-2 py-1 rounded">
                    {new Date(result.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      result.correct ? 'bg-[#509166]' : 'bg-[#F85E00]'
                    }`}></div>
                    <span className={`text-xs font-semibold ${
                      result.correct ? 'text-[#509166]' : 'text-[#F85E00]'
                    }`}>
                      {result.correct ? 'Correct' : 'Incorrect'}
                    </span>
                  </div>
                </div>
                
                <h3 className="text-base font-semibold text-gray-800 mb-2 leading-tight">
                  {question.question}
                </h3>
                
                {/* Correct answer display */}
                <div className="mb-3 p-2 bg-[#509166]/10 rounded border-l-2 border-[#509166]">
                  <div className="flex items-center gap-1 mb-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-[#509166]">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                    <span className="text-xs font-medium text-[#509166]">Answer:</span>
                  </div>
                  <p className="text-xs text-gray-700 font-medium">
                    {String.fromCharCode(65 + question.correctAnswer)}. {question.options[question.correctAnswer]}
                  </p>
                </div>
                
                {/* Performance stats */}
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span className="font-mono">
                    {Math.floor(result.timeSpent / 60)}:{(result.timeSpent % 60).toString().padStart(2, '0')}
                  </span>
                  <span>{result.attempts} attempt{result.attempts !== 1 ? 's' : ''}</span>
                </div>
              </div>

              {/* Desktop layout with more detailed information */}
              <div className="hidden sm:block">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="text-sm font-bold text-[#A41623] bg-[#FFD29D]/50 px-3 py-1 rounded-lg">
                      {new Date(result.date).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-[#A41623] transition-colors">
                      {question.question}
                    </h3>
                    
                    <div className="mb-3 p-3 bg-[#509166]/10 rounded-lg border-l-4 border-[#509166]">
                      <div className="flex items-center gap-2 mb-1">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-[#509166]">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                        </svg>
                        <span className="text-sm font-medium text-[#509166]">Correct Answer:</span>
                      </div>
                      <p className="text-sm text-gray-700 font-medium">
                        {String.fromCharCode(65 + question.correctAnswer)}. {question.options[question.correctAnswer]}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${
                          result.correct ? 'bg-[#509166]' : 'bg-[#F85E00]'
                        }`}></div>
                        <span className={`font-semibold ${
                          result.correct ? 'text-[#509166]' : 'text-[#F85E00]'
                        }`}>
                          {result.correct ? 'Correct' : 'Incorrect'}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-gray-600">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M15,1H9V3H15M19,8H17V6H15V8H9V6H7V8H5V10H7V12H5V14H7V16H5V18H7V20H9V18H15V20H17V18H19V16H17V14H19M15,12H9V10H15"/>
                        </svg>
                        <span className="font-mono">
                          {Math.floor(result.timeSpent / 60)}:{(result.timeSpent % 60).toString().padStart(2, '0')}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-gray-600">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z"/>
                        </svg>
                        <span>{result.attempts} attempt{result.attempts !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        
        {/* Empty state when no quiz history exists */}
        {results.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-[#FFD29D]/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-[#A41623]">
                <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No quizzes completed yet</h3>
            <p className="text-gray-600 text-lg">Complete today's quiz to start your learning journey!</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Main container component - handles all state and business logic
const DailyQuizContainer: React.FC = () => {
  const [currentQuestion] = useState<Question>(sampleQuestions[0]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [attempts, setAttempts] = useState(1);
  const [animation, setAnimation] = useState<AnimationState>({
    screen: 'quiz',
    isTransitioning: false
  });

  // Load quiz history when screen changes
  const allResults = useMemo(() => loadAllResults(), [animation.screen]);

  // Timer effect - runs every second when active
  useEffect(() => {
    let interval: number;
    if (isTimerRunning && !showResult) {
      interval = window.setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, showResult]);

  // Handle answer selection with feedback delay
  const handleSelectAnswer = useCallback((index: number) => {
    if (selectedAnswer !== null) return; // Prevent multiple selections
    
    setSelectedAnswer(index);
    setIsTimerRunning(false);
    
    // Delay showing result for visual feedback
    setTimeout(() => {
      const isCorrect = index === currentQuestion.correctAnswer;
      const result: QuizResult = {
        questionId: currentQuestion.id,
        date: currentQuestion.date,
        answered: true,
        correct: isCorrect,
        timeSpent: timeElapsed,
        attempts: attempts
      };
      saveResult(result);
      setShowResult(true);
    }, 800);
  }, [selectedAnswer, currentQuestion, timeElapsed, attempts]);

  // Reset quiz state for retry
  const handleRetry = useCallback(() => {
    setSelectedAnswer(null);
    setShowResult(false);
    setTimeElapsed(0);
    setIsTimerRunning(true);
    setAttempts(prev => prev + 1);
  }, []);

  // Share functionality with fallback
  const handleShare = useCallback(() => {
    const shareText = `I ${selectedAnswer === currentQuestion.correctAnswer ? 'solved' : 'attempted'} today's Daily Quiz Challenge in ${Math.floor(timeElapsed / 60)}:${(timeElapsed % 60).toString().padStart(2, '0')}! \n\nCan you beat my time?`;
    
    // Try native share API first, fallback to clipboard
    if (navigator.share) {
      navigator.share({
        title: 'Daily Quiz Challenge',
        text: shareText,
      }).catch(() => {
        navigator.clipboard.writeText(shareText);
        alert('Score copied to clipboard!');
      });
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Score copied to clipboard!');
    }
  }, [selectedAnswer, currentQuestion, timeElapsed]);

  // Screen transition handlers with smooth animations
  const handleViewHistory = useCallback(() => {
    setAnimation({ screen: 'history', isTransitioning: true });
    setTimeout(() => setAnimation({ screen: 'history', isTransitioning: false }), 400);
  }, []);

  const handleBackToQuiz = useCallback(() => {
    setAnimation({ screen: 'quiz', isTransitioning: true });
    setTimeout(() => setAnimation({ screen: 'quiz', isTransitioning: false }), 400);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden font-poppins">
      {/* Google Fonts Import */}
      <link 
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap" 
        rel="stylesheet" 
      />
      
      {/* Animated background layer */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#FFD29D] via-[#FFB563]/30 to-[#F85E00]/20">
        <BackgroundAnimation />
      </div>
      
      {/* Main content with transition animations */}
      <div className={`relative z-10 min-h-screen p-6 transition-all duration-500 ease-in-out ${
        animation.isTransitioning ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'
      }`}>
        <div className="max-w-2xl mx-auto">
          {animation.screen === 'history' ? (
            <HistoryScreen
              questions={sampleQuestions}
              results={allResults}
              onBack={handleBackToQuiz}
            />
          ) : (
            <>
              <header className="text-center mb-8 sm:mb-12">
                <div className="mb-4 sm:mb-6">
                  <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 sm:mb-6 drop-shadow-lg">
                    Daily Quiz
                  </h1>
                </div>
                {/* Current date display */}
                <p className="text-base sm:text-lg text-white/90 font-medium bg-black/10 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl inline-block">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </header>

              {/* Conditional rendering based on quiz state */}
              {!showResult ? (
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex justify-center">
                    <Timer seconds={timeElapsed} isRunning={isTimerRunning} />
                  </div>
                  <QuestionCard
                    question={currentQuestion}
                    selectedAnswer={selectedAnswer}
                    onSelectAnswer={handleSelectAnswer}
                    disabled={selectedAnswer !== null}
                  />
                </div>
              ) : (
                <ResultScreen
                  question={currentQuestion}
                  correct={selectedAnswer === currentQuestion.correctAnswer}
                  timeSpent={timeElapsed}
                  attempts={attempts}
                  onRetry={handleRetry}
                  onShare={handleShare}
                  onViewHistory={handleViewHistory}
                />
              )}
            </>
          )}
        </div>
      </div>
      
      {/* Custom CSS animations and font configuration */}
      <style jsx>{`
        .font-poppins {
          font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes bounce-in {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes fade-in-delayed {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }
        
        .animate-bounce-in {
          animation: bounce-in 0.8s ease-out;
        }
        
        .animate-fade-in-delayed {
          animation: fade-in-delayed 0.5s ease-out both;
        }
      `}</style>
    </div>
  );
};

export default DailyQuizContainer;