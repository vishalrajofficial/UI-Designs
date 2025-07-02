import React, { useState, useEffect } from 'react';

// Type definitions for conference data
interface Speaker {
  id: string;
  name: string;
  title: string;
  company: string;
  bio: string;
  avatar: string;
}

interface Session {
  id: string;
  title: string;
  description: string;
  time: string;
  duration: string;
  track: string;
  room: string;
  speakers: Speaker[];
  tags: string[];
}

// Sample conference session data
const mockSessions: Session[] = [
  {
    id: '1',
    title: 'Building Scalable React Applications',
    description: 'Learn best practices for building large-scale React applications with TypeScript, including architecture patterns and performance optimization.',
    time: '09:00 AM',
    duration: '45 min',
    track: 'Frontend',
    room: 'Hall A',
    speakers: [{
      id: 's1',
      name: 'Sarah Chen',
      title: 'Senior Frontend Engineer',
      company: 'TechCorp',
      bio: 'Sarah has over 8 years of experience building web applications. She specializes in React, TypeScript, and modern frontend architecture.',
      avatar: 'https://i.pravatar.cc/150?img=1'
    }],
    tags: ['React', 'TypeScript', 'Architecture']
  },
  {
    id: '2',
    title: 'Microservices Architecture Deep Dive',
    description: 'Explore the intricacies of microservices design, deployment strategies, and best practices for distributed systems.',
    time: '10:00 AM',
    duration: '60 min',
    track: 'Backend',
    room: 'Hall B',
    speakers: [{
      id: 's2',
      name: 'Michael Rodriguez',
      title: 'Cloud Architect',
      company: 'CloudSolutions',
      bio: 'Michael is a cloud architecture expert with extensive experience in designing and implementing microservices at scale.',
      avatar: 'https://i.pravatar.cc/150?img=3'
    }],
    tags: ['Microservices', 'Cloud', 'DevOps']
  },
  {
    id: '3',
    title: 'AI-Powered User Experiences',
    description: 'Discover how to integrate AI and machine learning into your applications to create intelligent, personalized user experiences.',
    time: '11:30 AM',
    duration: '45 min',
    track: 'AI/ML',
    room: 'Hall C',
    speakers: [{
      id: 's3',
      name: 'Dr. Emily Watson',
      title: 'AI Research Lead',
      company: 'AI Labs',
      bio: 'Dr. Watson leads AI research initiatives and has published numerous papers on practical AI applications in software.',
      avatar: 'https://i.pravatar.cc/150?img=5'
    }],
    tags: ['AI', 'Machine Learning', 'UX']
  },
  {
    id: '4',
    title: 'Mobile Development with React Native',
    description: 'Build cross-platform mobile applications using React Native, covering navigation, performance, and native module integration.',
    time: '02:00 PM',
    duration: '90 min',
    track: 'Mobile',
    room: 'Workshop Room 1',
    speakers: [{
      id: 's4',
      name: 'James Park',
      title: 'Mobile Developer',
      company: 'AppStudio',
      bio: 'James has built over 20 mobile applications and is passionate about creating smooth, native-like experiences with React Native.',
      avatar: 'https://i.pravatar.cc/150?img=8'
    }],
    tags: ['React Native', 'Mobile', 'Cross-platform']
  },
  {
    id: '5',
    title: 'Security Best Practices for Modern Apps',
    description: 'Essential security practices every developer should know, from authentication to data protection and vulnerability prevention.',
    time: '03:45 PM',
    duration: '45 min',
    track: 'Security',
    room: 'Hall A',
    speakers: [{
      id: 's5',
      name: 'Lisa Thompson',
      title: 'Security Engineer',
      company: 'SecureNet',
      bio: 'Lisa specializes in application security and helps organizations build secure software from the ground up.',
      avatar: 'https://i.pravatar.cc/150?img=9'
    }],
    tags: ['Security', 'Best Practices', 'Authentication']
  }
];

// Profile component - defined outside main component to prevent re-creation on renders
const ProfileContent = ({
  userName,
  setUserName,
  savedSessions,
  setActiveTab,
}: {
  userName: string;
  setUserName: (val: string) => void;
  savedSessions: Set<string>;
  setActiveTab: (tab: 'home' | 'schedule' | 'profile') => void;
}) => (
  <div className="mb-20">
    <h1 className="text-2xl font-bold text-[#0F172A] mb-6">Profile</h1>
    
    {/* User Profile Card */}
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6">
      {/* Avatar and Name Section - Mobile Optimized */}
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#E0F2FE] flex items-center justify-center mb-4 shadow-lg">
          <span className="text-3xl sm:text-4xl font-bold text-[#0284C7]">
            {userName.split(' ').map(n => n[0]).join('')}
          </span>
        </div>
        <div className="w-full max-w-xs">
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full text-xl sm:text-2xl font-semibold text-[#0F172A] bg-transparent border-b-2 border-gray-300 focus:border-[#0284C7] outline-none transition-colors text-center pb-2 mb-2 min-h-[44px]"
            placeholder="Your Name"
          />
          <p className="text-gray-600 text-base">Conference Attendee</p>
        </div>
      </div>
      
      {/* Personal Stats - Mobile Optimized */}
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-[#0F172A] mb-4">My Activity</h3>
        <div className="bg-[#F0F9FF] rounded-lg p-4 flex justify-between items-center min-h-[60px]">
          <span className="text-gray-700 font-medium text-base">Sessions Saved</span>
          <span className="text-2xl font-bold text-[#0284C7]">{savedSessions.size}</span>
        </div>
        <div className="bg-[#F0F9FF] rounded-lg p-4 flex justify-between items-center min-h-[60px]">
          <span className="text-gray-700 font-medium text-base">Conference Days</span>
          <span className="text-2xl font-bold text-[#0284C7]">3</span>
        </div>
        <div className="bg-[#F0F9FF] rounded-lg p-4 flex justify-between items-center min-h-[60px]">
          <span className="text-gray-700 font-medium text-base">Networking Events</span>
          <span className="text-2xl font-bold text-[#0284C7]">5</span>
        </div>
      </div>
    </div>

    {/* Quick Actions - Mobile Friendly */}
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mt-6">
      <h2 className="text-lg font-semibold text-[#0F172A] mb-4">Quick Actions</h2>
      <div className="space-y-3">
        <button 
          onClick={() => setActiveTab('schedule')}
          className="w-full bg-[#0284C7] text-white rounded-lg p-4 font-medium text-base hover:bg-[#0369A1] transition-colors min-h-[48px] flex items-center justify-center"
        >
          View My Schedule
        </button>
                  <button 
            onClick={() => setActiveTab('home')}
            className="w-full bg-[#38BDF8] text-white border-2 border-[#38BDF8] rounded-lg p-4 font-medium text-base hover:bg-[#0284C7] transition-colors min-h-[48px] flex items-center justify-center"
          >
          Browse Sessions
        </button>
      </div>
    </div>
  </div>
);

const ConferenceCompanion: React.FC = () => {
  // App state management
  const [sessions] = useState<Session[]>(mockSessions);
  const [filteredSessions, setFilteredSessions] = useState<Session[]>(mockSessions);
  const [selectedTrack, setSelectedTrack] = useState<string>('All');
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'schedule' | 'profile'>('home');
  const [userName, setUserName] = useState<string>('John Doe');
  const [savedSessions, setSavedSessions] = useState<Set<string>>(new Set());

  // Extract unique track names for filtering
  const tracks = ['All', ...Array.from(new Set(sessions.map(s => s.track)))];

  // Update filtered sessions when track selection changes
  useEffect(() => {
    if (selectedTrack === 'All') {
      setFilteredSessions(sessions);
    } else {
      setFilteredSessions(sessions.filter(s => s.track === selectedTrack));
    }
  }, [selectedTrack, sessions]);

  // Bookmark/unbookmark sessions for user's schedule
  const toggleSavedSession = (sessionId: string) => {
    setSavedSessions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sessionId)) {
        newSet.delete(sessionId);
      } else {
        newSet.add(sessionId);
      }
      return newSet;
    });
  };

  // Navigation and UI icons
  const HomeIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );

  const ScheduleIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );

  const ProfileIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );

  const BookmarkIcon = ({ filled }: { filled: boolean }) => (
    <svg className="w-5 h-5" fill={filled ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
    </svg>
  );

  const ClockIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const LocationIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );

  const ChevronDownIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );

  // Individual session card with expand/collapse functionality
  const SessionCard = React.memo(({ session }: { session: Session }) => {
    const isExpanded = expandedCard === session.id;
    const isSaved = savedSessions.has(session.id);

    return (
      <div
        className={`bg-white rounded-xl shadow-lg p-6 mb-4 transition-all duration-300 transform hover:scale-[1.02] cursor-pointer ${
          isExpanded ? 'shadow-2xl' : ''
        }`}
        onClick={() => setExpandedCard(isExpanded ? null : session.id)}
      >
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-[#38BDF8] text-white">
                {session.track}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-[#0F172A] mb-2">
              {session.title}
            </h3>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleSavedSession(session.id);
            }}
            className={`p-2 rounded-lg transition-colors ${
              isSaved ? 'text-[#0284C7]' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <BookmarkIcon filled={isSaved} />
          </button>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
          <div className="flex items-center gap-1">
            <ClockIcon />
            <span>{session.time}</span>
          </div>
          <div className="flex items-center gap-1">
            <LocationIcon />
            <span>{session.room}</span>
          </div>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {session.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {session.tags.map(tag => (
            <span
              key={tag}
              className="text-xs px-2 py-1 rounded-md bg-[#A5F3FC] text-[#0F172A]"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Expansion Indicator */}
        <div className="flex items-center justify-center mt-2">
          <div className={`w-8 h-1 rounded-full transition-all duration-300 ${
            isExpanded ? 'bg-[#0284C7] rotate-180' : 'bg-gray-300'
          }`}></div>
        </div>

        {/* Expanded Content */}
        <div
          className={`overflow-hidden transition-all duration-500 ${
            isExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="border-t border-gray-100 pt-4 mt-4">
            {/* Full Description */}
            <div className="mb-4">
              <h4 className="font-semibold text-[#0F172A] mb-2">Session Details</h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                {session.description}
              </p>
            </div>

            {/* Session Info */}
            <div className="mb-4">
              <h4 className="font-semibold text-[#0F172A] mb-2">Session Info</h4>
              <div className="bg-[#F0F9FF] rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Time</span>
                  <span className="text-sm font-medium text-[#0F172A]">{session.time}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Duration</span>
                  <span className="text-sm font-medium text-[#0F172A]">{session.duration}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Room</span>
                  <span className="text-sm font-medium text-[#0F172A]">{session.room}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Track</span>
                  <span className="text-sm font-medium text-[#0F172A]">{session.track}</span>
                </div>
              </div>
            </div>

            {/* Speaker Details */}
            <div>
              <h4 className="font-semibold text-[#0F172A] mb-3">Speaker</h4>
              {session.speakers.map(speaker => (
                <div key={speaker.id} className="bg-white border border-gray-100 rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    <img
                      src={speaker.avatar}
                      alt={speaker.name}
                      className="w-16 h-16 rounded-full object-cover flex-shrink-0 border-2 border-[#E0F2FE]"
                    />
                    <div className="flex-1 min-w-0">
                      <h5 className="font-semibold text-[#0F172A] text-base">{speaker.name}</h5>
                      <p className="text-sm text-[#0284C7] font-medium mb-1">
                        {speaker.title}
                      </p>
                      <p className="text-sm text-gray-600 mb-3">
                        {speaker.company}
                      </p>
                      <div className="bg-[#F0F9FF] rounded-lg p-3">
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {speaker.bio}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  });

  // Main sessions list with filtering
  const HomeContent = () => (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0F172A] mb-2">
          Welcome to TechConf 2024
        </h1>
        <p className="text-gray-600">
          Discover sessions, connect with speakers, and make the most of your conference experience.
        </p>
      </div>

      {/* Track Filter */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-[#0F172A] mb-3">Filter by Track</h2>
        <div className="flex gap-2 overflow-x-auto sm:overflow-x-visible sm:flex-wrap pb-2 scrollbar-hide">
          {tracks.map(track => (
            <button
              key={track}
              onClick={() => setSelectedTrack(track)}
              className={`px-4 py-2 rounded-full whitespace-nowrap flex-shrink-0 transition-all ${
                selectedTrack === track
                  ? 'bg-[#0284C7] text-white'
                  : 'bg-[#F0F9FF] text-[#0284C7] hover:bg-[#A5F3FC]'
              }`}
            >
              {track}
            </button>
          ))}
        </div>
      </div>

      {/* Sessions List */}
      <div className="mb-20">
        <h2 className="text-lg font-semibold text-[#0F172A] mb-4">
          {selectedTrack === 'All' ? 'All Sessions' : `${selectedTrack} Sessions`}
        </h2>
        {filteredSessions.map((session: Session) => (
          <SessionCard key={session.id} session={session} />
        ))}
      </div>
    </div>
  );

  // User's saved sessions view
  const ScheduleContent = () => (
    <div className="mb-20">
      <h1 className="text-2xl font-bold text-[#0F172A] mb-6">My Schedule</h1>
      
      {savedSessions.size === 0 ? (
        <div className="text-center py-12">
          <ScheduleIcon />
          <p className="text-gray-600 mt-4">
            No sessions saved yet. Bookmark sessions from the home tab to see them here.
          </p>
        </div>
      ) : (
        <div>
          <p className="text-gray-600 mb-4">
            You have {savedSessions.size} session{savedSessions.size !== 1 ? 's' : ''} saved
          </p>
          {sessions
            .filter(session => savedSessions.has(session.id))
            .map((session: Session) => (
              <SessionCard key={session.id} session={session} />
            ))}
        </div>
      )}
    </div>
  );



  // Initialize custom styles and fonts
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Libertinus+Math&display=swap');
      
      body {
        font-family: 'Libertinus Math', serif;
      }
      
      .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
      
      .scrollbar-hide::-webkit-scrollbar {
        display: none;
      }
      
      .line-clamp-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#F0F9FF]">
      {/* Main app container with background */}
      
      {/* Content area with tab-based navigation */}
      <div className="max-w-lg sm:max-w-3xl mx-auto px-4 pt-6 pb-20">
        {activeTab === 'home' && <HomeContent />}
        {activeTab === 'schedule' && <ScheduleContent />}
        {activeTab === 'profile' && (
          <ProfileContent
            userName={userName}
            setUserName={setUserName}
            savedSessions={savedSessions}
            setActiveTab={setActiveTab}
          />
        )}
      </div>

      {/* Fixed Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-lg mx-auto">
          <div className="flex justify-around items-center py-2">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center gap-1 px-6 py-2 rounded-lg transition-all ${
                activeTab === 'home'
                  ? 'text-[#0284C7] bg-[#F0F9FF]'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-[#A5F3FC]'
              }`}
            >
              <HomeIcon />
              <span className="text-xs font-medium">Home</span>
            </button>
            
            <button
              onClick={() => setActiveTab('schedule')}
              className={`flex flex-col items-center gap-1 px-6 py-2 rounded-lg transition-all ${
                activeTab === 'schedule'
                  ? 'text-[#0284C7] bg-[#F0F9FF]'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-[#A5F3FC]'
              }`}
            >
              <ScheduleIcon />
              <span className="text-xs font-medium">Schedule</span>
            </button>
            
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex flex-col items-center gap-1 px-6 py-2 rounded-lg transition-all ${
                activeTab === 'profile'
                  ? 'text-[#0284C7] bg-[#F0F9FF]'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-[#A5F3FC]'
              }`}
            >
              <ProfileIcon />
              <span className="text-xs font-medium">Profile</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default ConferenceCompanion;