import React, { useState, useEffect, useCallback } from 'react';

// Types
interface Pet {
  id: string;
  name: string;
  type: 'cat' | 'dog' | 'rabbit';
  happiness: number;
  hunger: number;
  energy: number;
  lastFed: Date;
  lastPlayed: Date;
  lastRested: Date;
}

interface Notification {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'success';
  timestamp: Date;
}

// SVG Pet Components
const CatSVG: React.FC<{ mood: string; isAnimating: string }> = ({ mood, isAnimating }) => (
  <svg width="150" height="150" viewBox="0 0 150 150" className={`${
    isAnimating === 'feed' ? 'animate-bounce-custom' : ''
  } ${
    isAnimating === 'play' ? 'animate-cat-stretch' : ''
  } ${
    isAnimating === 'rest' ? 'animate-cat-curl' : ''
  }`}>
    {/* Cat body */}
    <ellipse cx="75" cy="100" rx="35" ry="25" fill="#FF9F1C" className="drop-shadow-lg"/>
    {/* Cat head */}
    <circle cx="75" cy="65" r="30" fill="#FF9F1C" className="drop-shadow-lg"/>
    {/* Cat ears */}
    <polygon points="55,45 45,25 65,35" fill="#FFBF69" className={isAnimating === 'play' ? 'animate-wiggle' : ''}/>
    <polygon points="95,45 85,35 105,25" fill="#FFBF69" className={isAnimating === 'play' ? 'animate-wiggle' : ''}/>
    <polygon points="57,40 50,30 62,35" fill="#FF9F1C"/>
    <polygon points="93,40 88,35 100,30" fill="#FF9F1C"/>
    {/* Eyes */}
    <ellipse cx="65" cy="60" rx="6" ry={mood === 'happy' ? '8' : mood === 'sad' ? '4' : '6'} fill="#011627"/>
    <ellipse cx="85" cy="60" rx="6" ry={mood === 'happy' ? '8' : mood === 'sad' ? '4' : '6'} fill="#011627"/>
    {mood === 'happy' && <ellipse cx="65" cy="58" rx="2" ry="3" fill="white"/>}
    {mood === 'happy' && <ellipse cx="85" cy="58" rx="2" ry="3" fill="white"/>}
    {/* Nose */}
    <polygon points="75,70 70,75 80,75" fill="#2EC4B6"/>
    {/* Mouth */}
    {mood === 'happy' && <path d="M 70 80 Q 75 85 80 80" stroke="#011627" strokeWidth="2" fill="none"/>}
    {mood === 'sad' && <path d="M 70 85 Q 75 80 80 85" stroke="#011627" strokeWidth="2" fill="none"/>}
    {mood === 'neutral' && <line x1="75" y1="78" x2="75" y2="82" stroke="#011627" strokeWidth="2"/>}
    {/* Whiskers */}
    <line x1="45" y1="65" x2="35" y2="60" stroke="#011627" strokeWidth="1" className={isAnimating === 'play' ? 'animate-pulse' : ''}/>
    <line x1="45" y1="70" x2="35" y2="70" stroke="#011627" strokeWidth="1" className={isAnimating === 'play' ? 'animate-pulse' : ''}/>
    <line x1="105" y1="65" x2="115" y2="60" stroke="#011627" strokeWidth="1" className={isAnimating === 'play' ? 'animate-pulse' : ''}/>
    <line x1="105" y1="70" x2="115" y2="70" stroke="#011627" strokeWidth="1" className={isAnimating === 'play' ? 'animate-pulse' : ''}/>
    {/* Tail */}
    <path d="M 110 100 Q 130 90 125 70" stroke="#FF9F1C" strokeWidth="8" fill="none" className={mood === 'happy' ? 'animate-tail-wag' : ''} strokeLinecap="round"/>
  </svg>
);

const DogSVG: React.FC<{ mood: string; isAnimating: string }> = ({ mood, isAnimating }) => (
  <svg width="150" height="150" viewBox="0 0 150 150" className={`${
    isAnimating === 'feed' ? 'animate-bounce-custom' : ''
  } ${
    isAnimating === 'play' ? 'animate-dog-jump' : ''
  } ${
    isAnimating === 'rest' ? 'animate-pulse-custom' : ''
  }`}>
    {/* Dog body */}
    <ellipse cx="75" cy="105" rx="40" ry="30" fill="#2EC4B6" className="drop-shadow-lg"/>
    {/* Dog head */}
    <ellipse cx="75" cy="65" rx="25" ry="30" fill="#2EC4B6" className="drop-shadow-lg"/>
    {/* Dog ears */}
    <ellipse cx="55" cy="50" rx="8" ry="15" fill="#CBF3F0" className={isAnimating === 'play' ? 'animate-ear-flap' : ''}/>
    <ellipse cx="95" cy="50" rx="8" ry="15" fill="#CBF3F0" className={isAnimating === 'play' ? 'animate-ear-flap' : ''}/>
    {/* Snout */}
    <ellipse cx="75" cy="80" rx="12" ry="8" fill="#FFBF69"/>
    {/* Eyes */}
    <circle cx="68" cy="60" r={mood === 'happy' ? '7' : mood === 'sad' ? '5' : '6'} fill="#011627"/>
    <circle cx="82" cy="60" r={mood === 'happy' ? '7' : mood === 'sad' ? '5' : '6'} fill="#011627"/>
    {mood === 'happy' && <circle cx="68" cy="57" r="2" fill="white"/>}
    {mood === 'happy' && <circle cx="82" cy="57" r="2" fill="white"/>}
    {/* Nose */}
    <ellipse cx="75" cy="75" rx="3" ry="2" fill="#011627"/>
    {/* Mouth */}
    {mood === 'happy' && <path d="M 65 85 Q 75 95 85 85" stroke="#011627" strokeWidth="2" fill="none"/>}
    {mood === 'sad' && <path d="M 65 90 Q 75 85 85 90" stroke="#011627" strokeWidth="2" fill="none"/>}
    {mood === 'neutral' && <line x1="70" y1="88" x2="80" y2="88" stroke="#011627" strokeWidth="2"/>}
    {/* Tongue (when happy) */}
    {mood === 'happy' && <ellipse cx="75" cy="92" rx="4" ry="2" fill="#FF9F1C"/>}
    {/* Tail */}
    <path d="M 115 100 Q 135 80 130 60" stroke="#2EC4B6" strokeWidth="10" fill="none" 
          className={mood === 'happy' ? 'animate-tail-wag-fast' : mood === 'neutral' ? 'animate-tail-wag-slow' : ''} strokeLinecap="round"/>
    {/* Legs */}
    <ellipse cx="55" cy="130" rx="6" ry="10" fill="#2EC4B6"/>
    <ellipse cx="70" cy="130" rx="6" ry="10" fill="#2EC4B6"/>
    <ellipse cx="80" cy="130" rx="6" ry="10" fill="#2EC4B6"/>
    <ellipse cx="95" cy="130" rx="6" ry="10" fill="#2EC4B6"/>
  </svg>
);

const RabbitSVG: React.FC<{ mood: string; isAnimating: string }> = ({ mood, isAnimating }) => (
  <svg width="150" height="150" viewBox="0 0 150 150" className={`${
    isAnimating === 'feed' ? 'animate-bounce-custom' : ''
  } ${
    isAnimating === 'play' ? 'animate-rabbit-hop' : ''
  } ${
    isAnimating === 'rest' ? 'animate-pulse-custom' : ''
  }`}>
    {/* Rabbit body */}
    <ellipse cx="75" cy="100" rx="30" ry="35" fill="#CBF3F0" className="drop-shadow-lg"/>
    {/* Rabbit head */}
    <circle cx="75" cy="70" r="25" fill="#CBF3F0" className="drop-shadow-lg"/>
    {/* Long ears */}
    <ellipse cx="65" cy="40" rx="6" ry="20" fill="#FFBF69" className={isAnimating === 'play' ? 'animate-ear-twitch' : ''}/>
    <ellipse cx="85" cy="40" rx="6" ry="20" fill="#FFBF69" className={isAnimating === 'play' ? 'animate-ear-twitch' : ''}/>
    <ellipse cx="65" cy="42" rx="3" ry="15" fill="#FF9F1C"/>
    <ellipse cx="85" cy="42" rx="3" ry="15" fill="#FF9F1C"/>
    {/* Eyes */}
    <circle cx="68" cy="65" r={mood === 'happy' ? '6' : mood === 'sad' ? '4' : '5'} fill="#011627"/>
    <circle cx="82" cy="65" r={mood === 'happy' ? '6' : mood === 'sad' ? '4' : '5'} fill="#011627"/>
    {mood === 'happy' && <circle cx="68" cy="63" r="2" fill="white"/>}
    {mood === 'happy' && <circle cx="82" cy="63" r="2" fill="white"/>}
    {/* Nose */}
    <ellipse cx="75" cy="75" rx="2" ry="3" fill="#2EC4B6"/>
    {/* Mouth */}
    {mood === 'happy' && <path d="M 70 80 Q 75 85 80 80" stroke="#011627" strokeWidth="2" fill="none"/>}
    {mood === 'sad' && <path d="M 70 85 Q 75 80 80 85" stroke="#011627" strokeWidth="2" fill="none"/>}
    {mood === 'neutral' && <path d="M 72 82 L 75 80 L 78 82" stroke="#011627" strokeWidth="2" fill="none"/>}
    {/* Buck teeth (when happy) */}
    {mood === 'happy' && <rect x="73" y="82" width="2" height="4" fill="white"/>}
    {mood === 'happy' && <rect x="76" y="82" width="2" height="4" fill="white"/>}
    {/* Fluffy tail */}
    <circle cx="105" cy="95" r="8" fill="#FFBF69" className={mood === 'happy' ? 'animate-wiggle' : ''}/>
    {/* Hind legs */}
    <ellipse cx="60" cy="125" rx="10" ry="8" fill="#CBF3F0"/>
    <ellipse cx="90" cy="125" rx="10" ry="8" fill="#CBF3F0"/>
  </svg>
);

// Initial pets data
const initialPets: Pet[] = [
  {
    id: '1',
    name: 'Whiskers',
    type: 'cat',
    happiness: 80,
    hunger: 50,
    energy: 70,
    lastFed: new Date(),
    lastPlayed: new Date(),
    lastRested: new Date(),
  },
  {
    id: '2',
    name: 'Buddy',
    type: 'dog',
    happiness: 90,
    hunger: 40,
    energy: 85,
    lastFed: new Date(),
    lastPlayed: new Date(),
    lastRested: new Date(),
  },
  {
    id: '3',
    name: 'Hoppy',
    type: 'rabbit',
    happiness: 75,
    hunger: 60,
    energy: 65,
    lastFed: new Date(),
    lastPlayed: new Date(),
    lastRested: new Date(),
  },
];

const PetSimulationApp: React.FC = () => {
  // Core state management
  const [pets, setPets] = useState<Pet[]>(initialPets);
  const [selectedPetId, setSelectedPetId] = useState<string>('1');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isAnimating, setIsAnimating] = useState<string>(''); // Tracks current animation type
  
  const selectedPet = pets.find(pet => pet.id === selectedPetId) || pets[0];

  // Add notification
  const addNotification = useCallback((message: string, type: 'info' | 'warning' | 'success' = 'info') => {
    const newNotification: Notification = {
      id: Date.now().toString(),
      message,
      type,
      timestamp: new Date(),
    };
    setNotifications(prev => [newNotification, ...prev].slice(0, 5));
  }, []);

  // Auto-update pet stats over time
  useEffect(() => {
    const interval = setInterval(() => {
      setPets(prevPets => 
        prevPets.map(pet => ({
          ...pet,
          happiness: Math.max(0, pet.happiness - 1), // Slowly decrease happiness
          hunger: Math.min(100, pet.hunger + 2), // Hunger increases over time
          energy: Math.max(0, pet.energy - 1), // Energy depletes naturally
        }))
      );
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Check pet status and send notifications
  useEffect(() => {
    pets.forEach(pet => {
      if (pet.hunger > 80) {
        addNotification(`${pet.name} is very hungry!`, 'warning');
      }
      if (pet.happiness < 30) {
        addNotification(`${pet.name} is feeling sad`, 'warning');
      }
      if (pet.energy < 20) {
        addNotification(`${pet.name} is exhausted!`, 'warning');
      }
    });
  }, [pets, addNotification]);

  // Pet interaction handlers
  const feedPet = () => {
    setIsAnimating('feed');
    setPets(prevPets =>
      prevPets.map(pet =>
        pet.id === selectedPetId
          ? {
              ...pet,
              hunger: Math.max(0, pet.hunger - 30), // Reduce hunger significantly
              happiness: Math.min(100, pet.happiness + 10), // Small happiness boost
              lastFed: new Date(),
            }
          : pet
      )
    );
    addNotification(`${selectedPet.name} enjoyed the meal!`, 'success');
    setTimeout(() => setIsAnimating(''), 1000); // Clear animation after 1s
  };

  const playWithPet = () => {
    if (selectedPet.energy < 20) { // Check if pet has enough energy
      addNotification(`${selectedPet.name} is too tired to play!`, 'warning');
      return;
    }
    setIsAnimating('play');
    setPets(prevPets =>
      prevPets.map(pet =>
        pet.id === selectedPetId
          ? {
              ...pet,
              happiness: Math.min(100, pet.happiness + 20), // Major happiness boost
              energy: Math.max(0, pet.energy - 15), // Playing uses energy
              hunger: Math.min(100, pet.hunger + 10), // Playing makes hungry
              lastPlayed: new Date(),
            }
          : pet
      )
    );
    addNotification(`${selectedPet.name} had fun playing!`, 'success');
    setTimeout(() => setIsAnimating(''), 1000);
  };

  const restPet = () => {
    setIsAnimating('rest');
    setPets(prevPets =>
      prevPets.map(pet =>
        pet.id === selectedPetId
          ? {
              ...pet,
              energy: Math.min(100, pet.energy + 30),
              happiness: Math.min(100, pet.happiness + 5),
              lastRested: new Date(),
            }
          : pet
      )
    );
    addNotification(`${selectedPet.name} is taking a nice nap!`, 'success');
    setTimeout(() => setIsAnimating(''), 2000);
  };

  // Calculate pet mood based on stats
  const getPetMood = (pet: Pet): string => {
    if (pet.happiness > 70 && pet.energy > 50 && pet.hunger < 50) return 'happy';
    if (pet.happiness < 30 || pet.energy < 20 || pet.hunger > 80) return 'sad';
    return 'neutral';
  };

  // Get color for stat bars (inverse = red when high, like hunger)
  const getStatColor = (value: number, inverse: boolean = false): string => {
    if (inverse) {
      if (value > 70) return 'bg-red-500';
      if (value > 40) return 'bg-yellow-500';
      return 'bg-green-500';
    }
    if (value > 70) return 'bg-green-500';
    if (value > 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen bg-[#011627] text-white font-['Poppins',_'Inter',_'Segoe_UI',_'Roboto',_'Helvetica_Neue',_Arial,_sans-serif] p-6">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-10deg); }
          75% { transform: rotate(10deg); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        
        @keyframes cat-stretch {
          0%, 100% { transform: scaleX(1) scaleY(1); }
          50% { transform: scaleX(1.2) scaleY(0.8); }
        }
        
        @keyframes cat-curl {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(0.9) rotate(5deg); }
        }
        
        @keyframes dog-jump {
          0%, 100% { transform: translateY(0) scaleY(1); }
          50% { transform: translateY(-30px) scaleY(1.1); }
        }
        
        @keyframes rabbit-hop {
          0%, 100% { transform: translateY(0); }
          25% { transform: translateY(-15px); }
          50% { transform: translateY(-25px); }
          75% { transform: translateY(-10px); }
        }
        
        @keyframes tail-wag {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(20deg); }
        }
        
        @keyframes tail-wag-fast {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(15deg); }
          75% { transform: rotate(-15deg); }
        }
        
        @keyframes tail-wag-slow {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(10deg); }
        }
        
        @keyframes ear-flap {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-15deg); }
        }
        
        @keyframes ear-twitch {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(5deg); }
          75% { transform: rotate(-5deg); }
        }
        
        .animate-bounce-custom {
          animation: bounce 0.5s ease-in-out;
        }
        
        .animate-wiggle {
          animation: wiggle 0.5s ease-in-out;
        }
        
        .animate-pulse-custom {
          animation: pulse 1s ease-in-out;
        }
        
        .animate-cat-stretch {
          animation: cat-stretch 1s ease-in-out;
        }
        
        .animate-cat-curl {
          animation: cat-curl 2s ease-in-out;
        }
        
        .animate-dog-jump {
          animation: dog-jump 0.8s ease-in-out;
        }
        
        .animate-rabbit-hop {
          animation: rabbit-hop 0.6s ease-in-out;
        }
        
        .animate-tail-wag {
          animation: tail-wag 0.5s ease-in-out infinite;
        }
        
        .animate-tail-wag-fast {
          animation: tail-wag-fast 0.3s ease-in-out infinite;
        }
        
        .animate-tail-wag-slow {
          animation: tail-wag-slow 1s ease-in-out infinite;
        }
        
        .animate-ear-flap {
          animation: ear-flap 0.4s ease-in-out;
        }
        
        .animate-ear-twitch {
          animation: ear-twitch 0.3s ease-in-out infinite;
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center gap-4 mb-8">
          <svg width="48" height="48" viewBox="0 0 150 150" className="flex-shrink-0">
            {/* Cute generic pet icon */}
            <ellipse cx="75" cy="100" rx="35" ry="30" fill="#2EC4B6" className="drop-shadow-lg"/>
            <circle cx="75" cy="65" r="28" fill="#2EC4B6" className="drop-shadow-lg"/>
            {/* Ears */}
            <ellipse cx="60" cy="45" rx="8" ry="15" fill="#CBF3F0"/>
            <ellipse cx="90" cy="45" rx="8" ry="15" fill="#CBF3F0"/>
            {/* Eyes */}
            <circle cx="68" cy="60" r="6" fill="#011627"/>
            <circle cx="82" cy="60" r="6" fill="#011627"/>
            <circle cx="68" cy="58" r="2" fill="white"/>
            <circle cx="82" cy="58" r="2" fill="white"/>
            {/* Nose */}
            <ellipse cx="75" cy="72" rx="3" ry="2" fill="#011627"/>
            {/* Mouth */}
            <path d="M 70 78 Q 75 83 80 78" stroke="#011627" strokeWidth="2" fill="none"/>
            {/* Collar */}
            <ellipse cx="75" cy="90" rx="20" ry="4" fill="#FF9F1C"/>
            <circle cx="85" cy="90" r="3" fill="#FFBF69"/>
          </svg>
          <h1 className="text-4xl font-bold text-[#FFBF69]">
            Pet Simulator
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Pet Selection and Stats */}
          <div className="lg:col-span-1 space-y-4">
            {/* Pet Selection Card */}
            <div className="bg-[#2EC4B6] bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-[#2EC4B6] border-opacity-30">
              <h2 className="text-xl font-semibold mb-4 text-[#CBF3F0]">My Pets</h2>
              <div className="space-y-3">
                {pets.map(pet => (
                  <button
                    key={pet.id}
                    onClick={() => setSelectedPetId(pet.id)}
                    className={`w-full p-3 rounded-lg transition-all ${
                      selectedPetId === pet.id
                        ? 'bg-[#011627] text-[#CBF3F0] border-2 border-[#2EC4B6]'
                        : 'bg-[#2EC4B6] bg-opacity-20 hover:bg-opacity-30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 flex-shrink-0">
                        {pet.type === 'cat' && (
                          <svg width="24" height="24" viewBox="0 0 150 150" className="w-full h-full">
                            <ellipse cx="75" cy="100" rx="35" ry="25" fill="#FF9F1C"/>
                            <circle cx="75" cy="65" r="30" fill="#FF9F1C"/>
                            <polygon points="55,45 45,25 65,35" fill="#FFBF69"/>
                            <polygon points="95,45 85,35 105,25" fill="#FFBF69"/>
                            <ellipse cx="65" cy="60" rx="6" ry={getPetMood(pet) === 'happy' ? '8' : getPetMood(pet) === 'sad' ? '4' : '6'} fill="#011627"/>
                            <ellipse cx="85" cy="60" rx="6" ry={getPetMood(pet) === 'happy' ? '8' : getPetMood(pet) === 'sad' ? '4' : '6'} fill="#011627"/>
                            <polygon points="75,70 70,75 80,75" fill="#2EC4B6"/>
                          </svg>
                        )}
                        {pet.type === 'dog' && (
                          <svg width="24" height="24" viewBox="0 0 150 150" className="w-full h-full">
                            <ellipse cx="75" cy="105" rx="40" ry="30" fill="#2EC4B6"/>
                            <ellipse cx="75" cy="65" rx="25" ry="30" fill="#2EC4B6"/>
                            <ellipse cx="55" cy="50" rx="8" ry="15" fill="#CBF3F0"/>
                            <ellipse cx="95" cy="50" rx="8" ry="15" fill="#CBF3F0"/>
                            <ellipse cx="75" cy="80" rx="12" ry="8" fill="#FFBF69"/>
                            <circle cx="68" cy="60" r={getPetMood(pet) === 'happy' ? '7' : getPetMood(pet) === 'sad' ? '5' : '6'} fill="#011627"/>
                            <circle cx="82" cy="60" r={getPetMood(pet) === 'happy' ? '7' : getPetMood(pet) === 'sad' ? '5' : '6'} fill="#011627"/>
                            <ellipse cx="75" cy="75" rx="3" ry="2" fill="#011627"/>
                          </svg>
                        )}
                        {pet.type === 'rabbit' && (
                          <svg width="24" height="24" viewBox="0 0 150 150" className="w-full h-full">
                            <ellipse cx="75" cy="100" rx="30" ry="35" fill="#CBF3F0"/>
                            <circle cx="75" cy="70" r="25" fill="#CBF3F0"/>
                            <ellipse cx="65" cy="40" rx="6" ry="20" fill="#FFBF69"/>
                            <ellipse cx="85" cy="40" rx="6" ry="20" fill="#FFBF69"/>
                            <circle cx="68" cy="65" r={getPetMood(pet) === 'happy' ? '6' : getPetMood(pet) === 'sad' ? '4' : '5'} fill="#011627"/>
                            <circle cx="82" cy="65" r={getPetMood(pet) === 'happy' ? '6' : getPetMood(pet) === 'sad' ? '4' : '5'} fill="#011627"/>
                            <ellipse cx="75" cy="75" rx="2" ry="3" fill="#2EC4B6"/>
                            <circle cx="105" cy="95" r="8" fill="#FFBF69"/>
                          </svg>
                        )}
                      </div>
                      <span className="font-medium flex-1">{pet.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Pet Stats Card */}
            <div className="bg-[#FFBF69] bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-[#FFBF69] border-opacity-30">
              <h2 className="text-xl font-semibold mb-4 text-[#FFBF69]">
                {selectedPet.name}'s Stats
              </h2>
                             <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Happiness</span>
                    <span className="text-sm">{selectedPet.happiness}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${getStatColor(selectedPet.happiness)}`}
                      style={{ width: `${selectedPet.happiness}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Hunger</span>
                    <span className="text-sm">{selectedPet.hunger}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${getStatColor(selectedPet.hunger, true)}`}
                      style={{ width: `${selectedPet.hunger}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Energy</span>
                    <span className="text-sm">{selectedPet.energy}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${getStatColor(selectedPet.energy)}`}
                      style={{ width: `${selectedPet.energy}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Area - Interactive Pet Display */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-[#2EC4B6] via-[#CBF3F0] to-[#FFBF69] bg-opacity-10 backdrop-blur-sm rounded-xl p-8 border border-[#CBF3F0] border-opacity-30 min-h-[500px] flex flex-col">
              {/* Pet Display */}
              <div className="flex-1 flex items-center justify-center">
                <div className="select-none transition-all duration-300">
                  {/* Render selected pet with mood and animations */}
                  {selectedPet.type === 'cat' && (
                    <CatSVG mood={getPetMood(selectedPet)} isAnimating={isAnimating} />
                  )}
                  {selectedPet.type === 'dog' && (
                    <DogSVG mood={getPetMood(selectedPet)} isAnimating={isAnimating} />
                  )}
                  {selectedPet.type === 'rabbit' && (
                    <RabbitSVG mood={getPetMood(selectedPet)} isAnimating={isAnimating} />
                  )}
                </div>
              </div>
              
              {/* Pet Name and Mood */}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-[#011627]">{selectedPet.name}</h3>
                <p className="text-[#011627] opacity-75">
                  Feeling {getPetMood(selectedPet)}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-4">
                <button
                  onClick={feedPet}
                  className="bg-[#FF9F1C] hover:bg-[#FFBF69] text-[#011627] font-semibold py-3 px-4 rounded-lg transition-all transform hover:scale-105 active:scale-95"
                >
                  Feed
                </button>
                <button
                  onClick={playWithPet}
                  className="bg-[#2EC4B6] hover:bg-[#CBF3F0] text-[#011627] font-semibold py-3 px-4 rounded-lg transition-all transform hover:scale-105 active:scale-95"
                >
                  Play
                </button>
                <button
                  onClick={restPet}
                  className="bg-[#FFBF69] hover:bg-[#FF9F1C] text-[#011627] font-semibold py-3 px-4 rounded-lg transition-all transform hover:scale-105 active:scale-95"
                >
                  Rest
                </button>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Notifications and Summary */}
          <div className="lg:col-span-1">
            <div className="bg-[#CBF3F0] bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-[#CBF3F0] border-opacity-30">
              <h2 className="text-xl font-semibold mb-4 text-[#CBF3F0]">
                Notifications
              </h2>
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-gray-400 text-sm">No notifications yet!</p>
                ) : (
                  // Display recent notifications with color coding
                  notifications.map(notification => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg text-sm ${
                        notification.type === 'warning'
                          ? 'bg-yellow-500 bg-opacity-20 border border-yellow-500 border-opacity-30'
                          : notification.type === 'success'
                          ? 'bg-green-500 bg-opacity-20 border border-green-500 border-opacity-30'
                          : 'bg-blue-500 bg-opacity-20 border border-blue-500 border-opacity-30'
                      }`}
                    >
                      <p className="font-medium">{notification.message}</p>
                      <p className="text-xs opacity-75 mt-1">
                        {notification.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Daily Summary Card */}
            <div className="mt-4 bg-[#FF9F1C] bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-[#FF9F1C] border-opacity-30">
              <h2 className="text-xl font-semibold mb-4 text-[#FF9F1C]">
                Daily Summary
              </h2>
              <div className="space-y-2 text-sm">
                <p>Last fed: {selectedPet.lastFed.toLocaleTimeString()}</p>
                <p>Last played: {selectedPet.lastPlayed.toLocaleTimeString()}</p>
                <p>Last rested: {selectedPet.lastRested.toLocaleTimeString()}</p>
                <div className="mt-4 pt-4 border-t border-gray-600">
                  <p className="font-semibold">Tips:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs opacity-75">
                    <li>Feed your pet when hunger reaches 70%</li>
                    <li>Play regularly to keep happiness high</li>
                    <li>Let your pet rest when energy is low</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetSimulationApp;