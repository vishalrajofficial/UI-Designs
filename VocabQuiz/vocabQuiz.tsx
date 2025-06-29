'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Type definitions
interface Word {
  word: string;
  translation: string;
  options: string[];
}

interface Language {
  name: string;
  code: string;
  words: Word[];
}

// Quiz data - 5 words per language
const languages: Language[] = [
  {
    name: 'Spanish',
    code: 'es',
    words: [
      { word: 'Gato', translation: 'Cat', options: ['Dog', 'Cat', 'Bird', 'Fish'] },
      { word: 'Libro', translation: 'Book', options: ['Book', 'Pen', 'Paper', 'Desk'] },
      { word: 'Agua', translation: 'Water', options: ['Fire', 'Earth', 'Water', 'Air'] },
      { word: 'Amigo', translation: 'Friend', options: ['Enemy', 'Friend', 'Stranger', 'Family'] },
      { word: 'Sol', translation: 'Sun', options: ['Moon', 'Star', 'Sun', 'Cloud'] }
    ]
  },
  {
    name: 'French',
    code: 'fr',
    words: [
      { word: 'Chien', translation: 'Dog', options: ['Cat', 'Dog', 'Mouse', 'Horse'] },
      { word: 'Maison', translation: 'House', options: ['Car', 'Tree', 'House', 'Building'] },
      { word: 'Pain', translation: 'Bread', options: ['Bread', 'Cake', 'Rice', 'Pasta'] },
      { word: 'Fleur', translation: 'Flower', options: ['Tree', 'Grass', 'Leaf', 'Flower'] },
      { word: 'Mer', translation: 'Sea', options: ['Lake', 'River', 'Sea', 'Ocean'] }
    ]
  },
  {
    name: 'Japanese',
    code: 'ja',
    words: [
      { word: '犬 (Inu)', translation: 'Dog', options: ['Dog', 'Cat', 'Bird', 'Fish'] },
      { word: '本 (Hon)', translation: 'Book', options: ['Pen', 'Book', 'Note', 'Paper'] },
      { word: '木 (Ki)', translation: 'Tree', options: ['Flower', 'Grass', 'Tree', 'Plant'] },
      { word: '月 (Tsuki)', translation: 'Moon', options: ['Sun', 'Star', 'Moon', 'Sky'] },
      { word: '友達 (Tomodachi)', translation: 'Friend', options: ['Teacher', 'Student', 'Parent', 'Friend'] }
    ]
  }
];

export default function VocabQuiz() {
  // Quiz state management
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [shuffledWords, setShuffledWords] = useState<Word[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [showLanguagePopup, setShowLanguagePopup] = useState(true);

  // Load custom fonts on component mount
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Comfortaa:wght@400;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  // Shuffle function for randomizing questions
  const shuffleArray = (array: Word[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Event handlers
  const handleLanguageSelect = (language: Language) => {
    setSelectedLanguage(language);
    setShuffledWords(shuffleArray(language.words));
    setShowLanguagePopup(false);
  };

  const handleAnswer = (answer: string) => {
    if (showResult) return;
    
    setSelectedAnswer(answer);
    const correct = answer === shuffledWords[currentQuestion]?.translation;
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < 4) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizComplete(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setQuizComplete(false);
    setShowLanguagePopup(true);
    setSelectedLanguage(null);
    setShuffledWords([]);
  };

  // Calculate progress percentage
  const progress = ((currentQuestion + (showResult ? 1 : 0)) / 5) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#F7FFF7' }}>
      {/* Global font styles */}
      <style jsx global>{`
        * {
          font-family: 'Poppins', 'Comfortaa' !important;
        }
      `}</style>

      {/* Language Selection Modal */}
      <AnimatePresence>
        {showLanguagePopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4"
            style={{ 
              background: 'linear-gradient(135deg, rgba(26, 83, 92, 0.95) 0%, rgba(78, 205, 196, 0.85) 50%, rgba(255, 107, 107, 0.9) 100%)'
            }}
          >
                        {/* App title with icon - mobile optimized */}
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6, type: 'spring' }}
              className="mb-6 px-4"
            >
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    repeatType: 'reverse'
                  }}
                  className="mb-1 sm:mb-0"
                >
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Book base */}
                    <path d="M4 19.5C4 18.119 4 17.429 4.466 17C4.932 16.571 5.637 16.571 7.047 16.571H16.953C18.363 16.571 19.068 16.571 19.534 17C20 17.429 20 18.119 20 19.5C20 20.881 20 21.571 19.534 22C19.068 22.429 18.363 22.429 16.953 22.429H7.047C5.637 22.429 4.932 22.429 4.466 22C4 21.571 4 20.881 4 19.5Z" fill="#FFE66D" stroke="#F7FFF7" strokeWidth="1.5"/>
                    {/* Book pages */}
                    <path d="M4 8C4 5.235 4 3.852 4.859 3C5.717 2.148 7.117 2.148 9.917 2.148H14.083C16.883 2.148 18.283 2.148 19.141 3C20 3.852 20 5.235 20 8V16H4V8Z" fill="#4ECDC4" stroke="#F7FFF7" strokeWidth="1.5"/>
                    {/* Speech bubble */}
                    <circle cx="12" cy="9" r="3" fill="#FF6B6B" stroke="#F7FFF7" strokeWidth="1"/>
                    <path d="M10.5 9L11.5 10L13.5 8" stroke="#F7FFF7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    {/* Book binding */}
                    <path d="M12 2V16" stroke="#F7FFF7" strokeWidth="1" strokeLinecap="round"/>
                  </svg>
                </motion.div>
                <div className="text-center sm:text-left">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight" style={{ color: '#F7FFF7', fontFamily: 'Comfortaa', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
                    Vocabulary Quiz
                  </h1>
                </div>
              </div>
            </motion.div>
             
            {/* Floating background particles */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full opacity-20"
                  style={{
                    backgroundColor: i % 4 === 0 ? '#FFE66D' : i % 4 === 1 ? '#4ECDC4' : i % 4 === 2 ? '#FF6B6B' : '#F7FFF7',
                    width: Math.random() * 100 + 20,
                    height: Math.random() * 100 + 20,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    x: [0, Math.random() * 200 - 100],
                    y: [0, Math.random() * 200 - 100],
                    scale: [1, Math.random() * 0.5 + 0.8, 1],
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: Math.random() * 10 + 10,
                    repeat: Infinity,
                    repeatType: 'reverse',
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </div>

            <motion.div
              initial={{ scale: 0.8, opacity: 0, rotateY: -180 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              exit={{ scale: 0.8, opacity: 0, rotateY: 180 }}
              transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
              className="relative w-full max-w-md p-8 rounded-3xl shadow-2xl backdrop-blur-sm"
              style={{ 
                backgroundColor: 'rgba(247, 255, 247, 0.95)',
                border: '2px solid rgba(78, 205, 196, 0.3)'
              }}
            >
                                            <motion.div
                 initial={{ y: -20, opacity: 0 }}
                 animate={{ y: 0, opacity: 1 }}
                 transition={{ delay: 0.3, duration: 0.4 }}
                 className="mb-6 text-center"
               >
                 <h2 className="text-2xl font-bold" style={{ color: '#1A535C', fontFamily: 'Comfortaa' }}>
                   Choose Your Target Language to test your vocabulary
                 </h2>
               </motion.div>
              
              <div className="space-y-4">
                                 {languages.map((lang, index) => (
                   <motion.button
                     key={lang.code}
                     initial={{ x: -50, opacity: 0 }}
                     animate={{ x: 0, opacity: 1 }}
                     transition={{ delay: 0.1 + index * 0.05, duration: 0.3 }}
                     whileHover={{ 
                       scale: 1.05,
                       boxShadow: '0 8px 25px rgba(78, 205, 196, 0.4)',
                       transition: { duration: 0.1 }
                     }}
                     whileTap={{ 
                       scale: 0.95,
                       transition: { duration: 0.05 }
                     }}
                    onClick={() => handleLanguageSelect(lang)}
                    className="w-full py-4 px-6 rounded-2xl font-medium text-lg transition-all relative overflow-hidden"
                    style={{ 
                      backgroundColor: index === 0 ? '#4ECDC4' : index === 1 ? '#FFE66D' : '#FF6B6B',
                      color: index === 1 ? '#3C3C3C' : '#F7FFF7',
                      boxShadow: `0 4px 15px ${index === 0 ? 'rgba(78, 205, 196, 0.3)' : index === 1 ? 'rgba(255, 230, 109, 0.3)' : 'rgba(255, 107, 107, 0.3)'}`
                    }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-white opacity-0"
                      whileHover={{ opacity: 0.1 }}
                      transition={{ duration: 0.2 }}
                    />
                    {lang.name}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Quiz Interface */}
      {selectedLanguage && !quizComplete && shuffledWords.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Progress indicator */}
          <div className="mb-6">
            <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: '#3C3C3C' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: '#FFE66D' }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-sm font-medium" style={{ color: '#3C3C3C' }}>
                Question {currentQuestion + 1} of 5
              </span>
              <span className="text-sm font-medium" style={{ color: '#1A535C' }}>
                Score: {score}
              </span>
            </div>
          </div>

          {/* Word display card */}
          <motion.div
            key={currentQuestion}
            initial={{ rotateY: -180, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div 
              className="rounded-3xl p-8 shadow-xl mb-6"
              style={{ 
                backgroundColor: '#1A535C',
                minHeight: '200px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <motion.h3
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                className="text-4xl font-bold text-center"
                style={{ color: '#F7FFF7', fontFamily: 'Comfortaa' }}
              >
                {shuffledWords[currentQuestion]?.word}
              </motion.h3>
            </div>

                        {/* Multiple choice buttons */}
            <div className="grid grid-cols-2 gap-4">
              {shuffledWords[currentQuestion]?.options.map((option, index) => (
                 <motion.button
                   key={option}
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: index * 0.05, duration: 0.2 }}
                   whileHover={!showResult ? { 
                     scale: 1.05,
                     transition: { duration: 0.1 }
                   } : {}}
                   whileTap={!showResult ? { 
                     scale: 0.95,
                     transition: { duration: 0.05 }
                   } : {}}
                  onClick={() => handleAnswer(option)}
                  disabled={showResult}
                                     className={`py-4 px-6 rounded-2xl font-medium transition-all ${
                     showResult && option === shuffledWords[currentQuestion]?.translation
                       ? 'ring-4'
                       : ''
                   }`}
                   style={{
                     backgroundColor: 
                       showResult && option === selectedAnswer
                         ? isCorrect ? '#4ECDC4' : '#FF6B6B'
                         : showResult && option === shuffledWords[currentQuestion]?.translation
                         ? '#4ECDC4'
                         : '#F7FFF7',
                     color: 
                       showResult && (option === selectedAnswer || option === shuffledWords[currentQuestion]?.translation)
                         ? '#F7FFF7'
                         : '#3C3C3C',
                     border: `2px solid ${showResult && option === shuffledWords[currentQuestion]?.translation ? '#4ECDC4' : '#3C3C3C'}`,
                    ringColor: '#FFE66D',
                    transform: showResult && option === selectedAnswer && isCorrect ? 'scale(1.1)' : 'scale(1)'
                  }}
                >
                  {option}
                </motion.button>
              ))}
            </div>

            {/* Answer feedback with next button */}
            <AnimatePresence>
              {showResult && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="mt-6 text-center flex flex-col items-center"
                >
                  <motion.div
                    animate={isCorrect ? {
                      rotate: [0, -10, 10, -10, 10, 0],
                      transition: { duration: 0.5 }
                    } : {
                      x: [0, -10, 10, -10, 10, 0],
                      transition: { duration: 0.5 }
                    }}
                    className="flex justify-center items-center mb-4"
                  >
                    {isCorrect ? (
                      <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(78, 205, 196, 0.2)' }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20 6L9 17L4 12" stroke="#4ECDC4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(255, 107, 107, 0.2)' }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M18 6L6 18" stroke="#FF6B6B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M6 6L18 18" stroke="#FF6B6B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    )}
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                    className="text-center mb-4"
                  >
                    {isCorrect ? (
                      <p className="text-xl font-semibold" style={{ color: '#4ECDC4' }}>
                        Correct!
                      </p>
                    ) : (
                      <p className="text-lg font-medium" style={{ color: '#FF6B6B' }}>
                        The correct answer is: <span className="font-bold">{shuffledWords[currentQuestion]?.translation}</span>
                      </p>
                    )}
                  </motion.div>
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.2 }}
                    whileHover={{ 
                      scale: 1.05,
                      transition: { duration: 0.1 }
                    }}
                    whileTap={{ 
                      scale: 0.95,
                      transition: { duration: 0.05 }
                    }}
                    onClick={nextQuestion}
                    className="mt-4 py-3 px-8 rounded-full font-medium"
                    style={{ 
                      backgroundColor: '#FFE66D', 
                      color: '#3C3C3C',
                      boxShadow: '0 4px 15px rgba(255, 230, 109, 0.3)'
                    }}
                  >
                    Next Question
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}

      {/* Final results screen */}
      {quizComplete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md text-center"
        >
          <motion.div
            animate={{ 
              rotate: [0, 360],
              transition: { duration: 1 }
            }}
            className="mb-8 flex justify-center"
          >
            <svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.5 4.5L10.5 2.5L9.5 4.5L7.5 5.5L9.5 6.5L10.5 8.5L11.5 6.5L13.5 5.5L11.5 4.5Z" fill="#FFE66D"/>
              <path d="M18.5 7.5L17 4L15.5 7.5L12 9L15.5 10.5L17 14L18.5 10.5L22 9L18.5 7.5Z" fill="#4ECDC4"/>
              <path d="M8.5 15.5L7 12L5.5 15.5L2 17L5.5 18.5L7 22L8.5 18.5L12 17L8.5 15.5Z" fill="#FF6B6B"/>
              <path d="M16 16L15 14L14 16L12 17L14 18L15 20L16 18L18 17L16 16Z" fill="#1A535C"/>
              <circle cx="6" cy="8" r="1" fill="#FFE66D"/>
              <circle cx="18" cy="18" r="1" fill="#4ECDC4"/>
              <circle cx="3" cy="12" r="0.5" fill="#FF6B6B"/>
              <circle cx="21" cy="14" r="0.5" fill="#1A535C"/>
              <circle cx="12" cy="12" r="1.5" fill="#FFE66D"/>
            </svg>
          </motion.div>
          <h2 className="text-4xl font-bold mb-4" style={{ color: '#1A535C', fontFamily: 'Comfortaa' }}>
            Quiz Complete!
          </h2>
          <div className="mb-8 p-6 rounded-3xl" style={{ backgroundColor: '#4ECDC4' }}>
            <p className="text-2xl font-medium" style={{ color: '#F7FFF7' }}>
              Your Score: {score}/5
            </p>
            <p className="text-lg mt-2" style={{ color: '#F7FFF7' }}>
              {score === 5 ? 'Perfect!' : score >= 3 ? 'Great job!' : 'Keep practicing!'}
            </p>
          </div>
          <motion.button
            whileHover={{ 
              scale: 1.05,
              transition: { duration: 0.1 }
            }}
            whileTap={{ 
              scale: 0.95,
              transition: { duration: 0.05 }
            }}
            onClick={resetQuiz}
            className="py-4 px-8 rounded-full font-medium text-lg"
            style={{ 
              backgroundColor: '#FFE66D', 
              color: '#3C3C3C',
              boxShadow: '0 4px 15px rgba(255, 230, 109, 0.3)'
            }}
          >
            Start New Quiz
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}