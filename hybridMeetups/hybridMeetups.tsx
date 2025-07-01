import React, { useState, useEffect, useMemo, useRef } from "react";

// Color Palette - 6 colors for consistent design
const colors = {
  primary: "#3B82F6",     // Blue - Primary actions, links
  secondary: "#10B981",   // Green - Success, positive sentiment
  accent: "#F59E0B",      // Amber - Warnings, highlights
  danger: "#EF4444",      // Red - Errors, negative sentiment
  neutral: "#6B7280",     // Gray - Text, borders
  background: "#F3F4F6",  // Light Gray - Backgrounds
};

// SVG Icon Components - self-contained icons
const Search = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const Users = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const MapPin = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const Video = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const CalendarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const Shield = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const Star = ({ className, ...props }: { className?: string } & React.SVGProps<SVGSVGElement>) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" {...props}>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const Plus = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const CloseIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ChevronDown = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

// UI Components - custom button, input, and form elements
const Button = ({ children, className, onClick, disabled, type = "button", variant = "default", style, ...props }: any) => (
  <button
    type={type}
    style={{
      backgroundColor: variant === "outline" ? "transparent" : 
                      variant === "destructive" ? colors.danger :
                      variant === "secondary" ? colors.secondary :
                      variant === "accent" ? colors.accent :
                      colors.primary,
      color: variant === "outline" ? colors.neutral : "white",
      border: variant === "outline" ? `1px solid ${colors.neutral}` : "none",
      ...style
    }}
    className={`px-4 py-2 rounded-lg font-semibold text-sm shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 ease-in-out active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${disabled ? "opacity-50 cursor-not-allowed hover:scale-100 hover:shadow-md" : ""} ${className || ""}`}
    onClick={onClick}
    disabled={disabled}
    {...props}
  >
    {children}
  </button>
);

const Input = ({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className || ""}`}
    {...props}
  />
);

const Label = ({ children, className, htmlFor }: any) => (
  <label htmlFor={htmlFor} className={`block text-sm font-medium text-gray-700 ${className || ""}`}>
    {children}
  </label>
);

const Checkbox = ({ checked, onCheckedChange, id }: any) => (
  <input
    type="checkbox"
    id={id}
    checked={checked}
    onChange={(e) => onCheckedChange(e.target.checked)}
    className="h-4 w-4 text-blue-600 rounded border-gray-300"
  />
);

// Select Components - custom dropdown with click-outside functionality
const Select = ({ children, value, onValueChange }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleValueChange = (newValue: string) => {
    onValueChange(newValue);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {React.Children.map(children, child => {
        if (child?.type === SelectTrigger) {
          return React.cloneElement(child, { 
            onClick: () => setIsOpen(!isOpen), 
            value,
            isOpen 
          });
        }
        if (child?.type === SelectContent) {
          return isOpen ? React.cloneElement(child, { 
            onValueChange: handleValueChange, 
            onClose: () => setIsOpen(false) 
          }) : null;
        }
        return child;
      })}
      {isOpen && <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />}
    </div>
  );
};

const SelectTrigger = ({ children, className, onClick, value, isOpen }: any) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-full px-3 py-2 text-left border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between ${className || ""}`}
  >
    <span>{children}</span>
    <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
  </button>
);

const SelectContent = ({ children, onValueChange, onClose }: any) => (
  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
    {React.Children.map(children, child => 
      React.cloneElement(child, { onValueChange, onClose })
    )}
  </div>
);

const SelectItem = ({ children, value, onValueChange, onClose }: any) => (
  <button
    type="button"
    className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
    onClick={() => {
      onValueChange(value);
      onClose();
    }}
  >
    {children}
  </button>
);

const SelectValue = ({ placeholder, value }: any) => (
  <span className={value ? "" : "text-gray-500"}>{value || placeholder}</span>
);

// Modal Dialog Components - overlay with click-outside-to-close
const Dialog = ({ open, onOpenChange, children }: any) => {
  if (!open) return null;
  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={() => onOpenChange(false)} />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4" onClick={() => onOpenChange(false)}>
        <div onClick={(e) => e.stopPropagation()}>
          {children}
        </div>
      </div>
    </>
  );
};

const DialogContent = ({ children, className }: any) => (
  <div className={`bg-white rounded-2xl shadow-2xl w-full max-h-[90vh] overflow-y-auto p-1 ${className || ""}`}>
    <div className="p-4 sm:p-6">
      {children}
    </div>
  </div>
);

const DialogHeader = ({ children }: any) => (
  <div className="pb-4">{children}</div>
);

const DialogTitle = ({ children, className }: any) => (
  <h2 className={`text-xl sm:text-2xl lg:text-3xl font-bold ${className || ""}`}>{children}</h2>
);

const DialogClose = () => null;
const DialogTrigger = ({ children }: any) => children;

// Simple Popover Components
const Popover = ({ children }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative">
      {React.Children.map(children, child => {
        if (child?.type === PopoverTrigger) {
          return React.cloneElement(child, { onClick: () => setIsOpen(!isOpen) });
        }
        if (child?.type === PopoverContent) {
          return isOpen ? child : null;
        }
        return child;
      })}
    </div>
  );
};

const PopoverTrigger = ({ children, onClick, asChild }: any) => {
  if (asChild) {
    return React.cloneElement(children, { onClick });
  }
  return <button type="button" onClick={onClick}>{children}</button>;
};

const PopoverContent = ({ children, className }: any) => (
  <div className={`absolute z-50 mt-2 bg-white border border-gray-300 rounded-md shadow-lg ${className || ""}`}>
    {children}
  </div>
);

// Calendar component (simplified)
const Calendar = ({ mode, selected, onSelect }: any) => {
  const [currentDate, setCurrentDate] = useState(selected || new Date());
  
  return (
    <div className="p-3">
      <input
        type="date"
        value={currentDate.toISOString().split('T')[0]}
        onChange={(e) => {
          const date = new Date(e.target.value);
          setCurrentDate(date);
          onSelect(date);
        }}
        className="w-full px-3 py-2 border border-gray-300 rounded-md"
      />
    </div>
  );
};

// Format date function
const format = (date: Date, formatStr: string) => {
  return date.toLocaleDateString();
};

// Simple animation components (replacing framer-motion)
const motion = {
  div: ({ children, initial, animate, exit, variants, className, ...props }: any) => (
    <div className={`transition-all duration-300 ${className || ""}`} {...props}>
      {children}
    </div>
  ),
};

const AnimatePresence = ({ children }: any) => children;
const easeInOut = [0.4, 0, 0.2, 1];

// SVG Icon Components
const PositiveIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M7,9.5C7,8.7 7.7,8 8.5,8C9.3,8 10,8.7 10,9.5C10,10.3 9.3,11 8.5,11C7.7,11 7,10.3 7,9.5M14,9.5C14,8.7 14.7,8 15.5,8C16.3,8 17,8.7 17,9.5C17,10.3 16.3,11 15.5,11C14.7,11 14,10.3 14,9.5M12,17.5C14.33,17.5 16.31,16.04 17,14H7C7.69,16.04 9.67,17.5 12,17.5Z"/>
  </svg>
);

const NegativeIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M7,9.5C7,8.7 7.7,8 8.5,8C9.3,8 10,8.7 10,9.5C10,10.3 9.3,11 8.5,11C7.7,11 7,10.3 7,9.5M14,9.5C14,8.7 14.7,8 15.5,8C16.3,8 17,8.7 17,9.5C17,10.3 16.3,11 15.5,11C14.7,11 14,10.3 14,9.5M17,14H7C7.69,11.96 9.67,10.5 12,10.5C14.33,10.5 16.31,11.96 17,14Z"/>
  </svg>
);

const NeutralIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M7,9.5C7,8.7 7.7,8 8.5,8C9.3,8 10,8.7 10,9.5C10,10.3 9.3,11 8.5,11C7.7,11 7,10.3 7,9.5M14,9.5C14,8.7 14.7,8 15.5,8C16.3,8 17,8.7 17,9.5C17,10.3 16.3,11 15.5,11C14.7,11 14,10.3 14,9.5M8,15H16V16H8V15Z"/>
  </svg>
);

const CommentIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M9,22A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22H9Z"/>
  </svg>
);

// Video Call Icons - microphone and camera controls
const MicrophoneIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z"/>
  </svg>
);

const MicrophoneOffIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19,11C19,12.19 18.66,13.3 18.1,14.28L16.87,13.05C17.14,12.43 17.3,11.74 17.3,11H19M15,5V11.18L13,9.18V5A3,3 0 0,1 12,2A3,3 0 0,1 15,5M4.27,3L21,19.73L19.73,21L15.54,16.81C14.77,17.27 13.91,17.58 13,17.72V21H11V17.72C7.72,17.23 5,14.41 5,11H7A5,5 0 0,0 12,16C12.81,16 13.6,15.8 14.31,15.43L10.18,11.3C10.18,11.3 10.18,11.3 10.18,11.3V5A3,3 0 0,1 12,2A3,3 0 0,1 15,5V11.18L13,9.18V5A1,1 0 0,0 12,4A1,1 0 0,0 11,5V9.18L4.27,3Z"/>
  </svg>
);

const CameraIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M17,10.5V7A1,1 0 0,0 16,6H4A1,1 0 0,0 3,7V17A1,1 0 0,0 4,18H16A1,1 0 0,0 17,17V13.5L21,17.5V6.5L17,10.5Z"/>
  </svg>
);

const CameraOffIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M21,6.5L17,10.5V7A1,1 0 0,0 16,6H9.83L21,17.17V6.5M2.39,1.73L1.11,3L3,4.89V17A1,1 0 0,0 4,18H16C16.13,18 16.25,17.96 16.36,17.9L19.11,20.64L20.84,19.36L2.39,1.73Z"/>
  </svg>
);

// Video Call Modal - full-screen video conference interface with working camera/mic controls
const VideoCallModal = ({ isOpen, onClose, eventTitle }: { isOpen: boolean; onClose: () => void; eventTitle: string }) => {
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [participants] = useState(['You', 'Host', 'John D.', 'Sarah M.']);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  useEffect(() => {
    if (isOpen && videoRef.current) {
      // Simulate video feed with getUserMedia
      navigator.mediaDevices?.getUserMedia({ video: isCameraOn, audio: isMicOn })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(() => {
          // Fallback for demo purposes
          console.log('Camera access denied or not available');
        });
    }
    
    return () => {
      // Cleanup
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isOpen, isCameraOn, isMicOn]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.9)' }}>
      <div className="w-full h-full max-w-7xl mx-auto p-4 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">{eventTitle} - Virtual Meeting</h2>
          <button
            onClick={onClose}
            className="px-6 py-3 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 focus:ring-4 focus:ring-red-300 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
            style={{ backgroundColor: colors.danger }}
          >
            Leave Call
          </button>
        </div>
        
        {/* Main Video Area */}
        <div className="flex-1 flex gap-4">
          {/* Video Grid */}
          <div className="flex-1 grid grid-cols-2 gap-4">
            {/* Main Video (You) */}
            <div className="relative rounded-lg overflow-hidden" style={{ backgroundColor: colors.neutral }}>
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
                style={{ display: isCameraOn ? 'block' : 'none' }}
              />
              {!isCameraOn && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-20 h-20 mx-auto mb-2 rounded-full flex items-center justify-center" 
                         style={{ backgroundColor: colors.primary }}>
                      <span className="text-2xl">You</span>
                    </div>
                    <p>Camera Off</p>
                  </div>
                </div>
              )}
              <div className="absolute bottom-2 left-2 text-white text-sm bg-black/50 px-2 py-1 rounded flex items-center gap-1">
                You {!isMicOn && <MicrophoneOffIcon className="w-4 h-4" />}
              </div>
            </div>
            
            {/* Other Participants */}
            {participants.slice(1, 4).map((participant, index) => (
              <div key={index} className="relative rounded-lg overflow-hidden" style={{ backgroundColor: colors.neutral }}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-20 h-20 mx-auto mb-2 rounded-full flex items-center justify-center" 
                         style={{ backgroundColor: `hsl(${index * 60}, 70%, 50%)` }}>
                      <span className="text-2xl">{participant[0]}</span>
                    </div>
                    <p>{participant}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Participants Sidebar */}
          <div className="w-64 rounded-lg p-4" style={{ backgroundColor: colors.background }}>
            <h3 className="font-bold mb-4" style={{ color: colors.neutral }}>
              Participants ({participants.length})
            </h3>
            <div className="space-y-2">
              {participants.map((participant, index) => (
                <div key={index} className="flex items-center gap-2 p-2 rounded" 
                     style={{ backgroundColor: 'white' }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm"
                       style={{ backgroundColor: index === 0 ? colors.primary : colors.neutral }}>
                    {participant[0]}
                  </div>
                  <span className="text-sm" style={{ color: colors.neutral }}>{participant}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Controls */}
        <div className="mt-4 flex justify-center items-center gap-4">
          <button
            onClick={() => setIsMicOn(!isMicOn)}
            className={`p-3 rounded-full text-white transition-all ${!isMicOn ? 'bg-red-500' : ''}`}
            style={{ backgroundColor: isMicOn ? colors.neutral : colors.danger }}
          >
            {isMicOn ? <MicrophoneIcon /> : <MicrophoneOffIcon />}
          </button>
          <button
            onClick={() => setIsCameraOn(!isCameraOn)}
            className={`p-3 rounded-full text-white transition-all ${!isCameraOn ? 'bg-red-500' : ''}`}
            style={{ backgroundColor: isCameraOn ? colors.neutral : colors.danger }}
          >
            {isCameraOn ? <CameraIcon /> : <CameraOffIcon />}
          </button>

          <button
            onClick={onClose}
            className="px-6 py-3 rounded-full text-white font-medium"
            style={{ backgroundColor: colors.danger }}
          >
            End Call
          </button>
        </div>
      </div>
    </div>
  );
};

interface Equipment {
  id: string;
  name: string;
  required: boolean;
  provided: boolean;
}

interface Event {
  id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  duration: string;
  type: "hybrid" | "virtual" | "in-person";
  venue: {
    name: string;
    address: string;
    capacity: number;
  };
  virtualLink: string;
  attendees: {
    inPerson: number;
    virtual: number;
    waitlist: number;
  };
  maxAttendees: {
    inPerson: number;
    virtual: number;
  };
  safetyRating: number;
  equipment: Equipment[];
  comments: {
    id: string;
    userName: string;
    text: string;
    timestamp: string;
    sentiment?: "positive" | "negative" | "neutral";
  }[];
  feedback: {
    id: string;
    rating: number;
    comment: string;
    userName: string;
    sentiment?: "positive" | "negative" | "neutral";
    timestamp: string;
  }[];
}

// User interface no longer needed since we're using direct name inputs

type FieldErrors = {
  title?: string;
  category?: string;
  date?: string;
  time?: string;
  venueName?: string;
  venueAddress?: string;
  capacity?: string;
  virtualLink?: string;
  virtualCapacity?: string;
};

type EventType = "in-person" | "virtual" | "hybrid";
type SafetyLevel = "All" | "high" | "medium" | "basic";

// Mock users are no longer needed since we're using name inputs directly
const mockEvents: Event[] = [
  {
    id: "1",
    title: "Community Coding Session",
    category: "Tech",
    date: "2025-07-15",
    time: "18:00",
    duration: "2 hours",
    type: "hybrid",
    venue: {
      name: "Innovation Hub",
      address: "123 Tech Lane",
      capacity: 50,
    },
    virtualLink: "http://example.com/coding-session-virtual",
    attendees: { inPerson: 30, virtual: 15, waitlist: 0 },
    maxAttendees: { inPerson: 40, virtual: 25 },
    safetyRating: 4.5, // High
    equipment: [
      { id: "eq1", name: "Projector", required: true, provided: true },
      {
        id: "eq2",
        name: "Whiteboard Markers",
        required: false,
        provided: true,
      },
      { id: "eq3", name: "Extension Cords", required: true, provided: false },
    ],
    comments: [],
    feedback: [],
  },
  {
    id: "2",
    title: "Board Game Strategy Night",
    category: "Social",
    date: "2025-07-20",
    time: "19:00",
    duration: "3 hours",
    type: "in-person",
    venue: {
      name: "The Game Cafe",
      address: "456 Fun Street",
      capacity: 20,
    },
    virtualLink: "",
    attendees: { inPerson: 20, virtual: 0, waitlist: 5 }, // 5 on waitlist as capacity is full
    maxAttendees: { inPerson: 20, virtual: 0 },
    safetyRating: 3.8, // Medium
    equipment: [
      { id: "eq4", name: "Chess Boards", required: true, provided: true },
      { id: "eq5", name: "Card Decks", required: false, provided: false },
    ],
    comments: [
      {
        id: "comm1",
        userName: "Alice Johnson",
        text: "Looking forward to this!",
        timestamp: "2025-07-01T10:00:00Z",
        sentiment: "positive",
      },
    ],
    feedback: [
      { 
        id: "fb1", 
        rating: 4, 
        comment: "Great event!", 
        userName: "John Smith", 
        sentiment: "positive",
        timestamp: "2025-07-02T14:00:00Z"
      }
    ],
  },
  {
    id: "3",
    title: "Online Yoga & Mindfulness",
    category: "Wellness",
    date: "2025-07-22",
    time: "09:00",
    duration: "1 hour",
    type: "virtual",
    venue: {
      name: "",
      address: "",
      capacity: 0,
    },
    virtualLink: "http://example.com/yoga-virtual",
    attendees: { inPerson: 0, virtual: 50, waitlist: 0 },
    maxAttendees: { inPerson: 0, virtual: 100 },
    safetyRating: 4.9, // High
    equipment: [],
    comments: [],
    feedback: [
      { 
        id: "fb2", 
        rating: 5, 
        comment: "Very relaxing session.", 
        userName: "Emma Wilson", 
        sentiment: "positive",
        timestamp: "2025-07-23T10:00:00Z"
      }
    ],
  },
  {
    id: "4",
    title: "Local Photography Walk",
    category: "Arts",
    date: "2025-07-25",
    time: "10:00",
    duration: "2.5 hours",
    type: "in-person",
    venue: {
      name: "City Park",
      address: "789 Green Avenue",
      capacity: 30,
    },
    virtualLink: "",
    attendees: { inPerson: 10, virtual: 0, waitlist: 0 },
    maxAttendees: { inPerson: 25, virtual: 0 },
    safetyRating: 1.5, // Basic
    equipment: [
      { id: "eq6", name: "Tripod", required: false, provided: false },
      { id: "eq7", name: "Extra Batteries", required: true, provided: false },
    ],
    comments: [],
    feedback: [
      { 
        id: "fb3", 
        rating: 4.5, 
        comment: "Good spots for photos!", 
        userName: "Mike Davis", 
        sentiment: "positive",
        timestamp: "2025-07-26T13:00:00Z"
      }
    ],
  },
];
const categories = ["All", "Tech", "Social", "Wellness", "Arts", "Music"];
const eventTypes = ["All", "hybrid", "virtual", "in-person"];
const safetyLevels = ["All", "high", "medium", "basic"]; // New safety levels

// Sentiment Analysis - analyzes comment text for positive/negative/neutral sentiment
const analyzeSentiment = (text: string): "positive" | "negative" | "neutral" => {
  const positiveWords = [
    "good", "great", "excellent", "amazing", "wonderful", "fantastic", 
    "awesome", "love", "best", "perfect", "outstanding", "brilliant",
    "superb", "marvelous", "terrific", "fabulous", "incredible",
    "enjoyable", "fun", "exciting", "helpful", "useful", "informative"
  ];
  
  const negativeWords = [
    "bad", "terrible", "awful", "horrible", "disappointing", "worst",
    "hate", "boring", "useless", "waste", "poor", "lacking", "inadequate",
    "frustrating", "annoying", "confusing", "difficult", "hard", "challenging",
    "problems", "issues", "failed", "broken", "wrong"
  ];

  const words = text.toLowerCase().split(/\s+/);
  let positiveScore = 0;
  let negativeScore = 0;

  words.forEach(word => {
    if (positiveWords.includes(word)) positiveScore++;
    if (negativeWords.includes(word)) negativeScore++;
  });

  if (positiveScore > negativeScore) return "positive";
  if (negativeScore > positiveScore) return "negative";
  return "neutral";
};

const GlobalStyles = () => (
  <style>{`
    /* Google Fonts Import */
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');
    
    /* Global Font Application */
    * {
      font-family: 'Poppins' !important;
    }
    
    /* Scrollbar Styles */
    ::-webkit-scrollbar {
      width: 0px; /* For Chrome, Safari, and Opera */
      height: 0px; /* For Chrome, Safari, and Opera */
    }
    ::-webkit-scrollbar-track {
      background: transparent;
    }
    ::-webkit-scrollbar-thumb {
      background: transparent;
    }
    * {
      scrollbar-width: none; /* For Firefox */
    }
  `}</style>
);
// Helper to generate hours and minutes
const generateTimeOptions = (limit: number) => {
  return Array.from({ length: limit }, (_, i) => i.toString().padStart(2, "0"));
};

const hours = generateTimeOptions(24);
const minutes = generateTimeOptions(60);

interface TimePickerProps {
  value: string;
  // Expected format "HH:mm"
  onChange: (time: string) => void;
  id?: string;
}
const TimePicker: React.FC<TimePickerProps> = ({ value, onChange, id }) => {
  const [open, setOpen] = React.useState(false);
  const [currentHour, currentMinute] = value ? value.split(":") : ["00", "00"];
  
  const handleHourChange = (hour: string) => {
    onChange(`${hour}:${currentMinute}`);
    setOpen(false);
  };
  
  const handleMinuteChange = (minute: string) => {
    onChange(`${currentHour}:${minute}`);
    setOpen(false);
  };

  return (
    <div className="relative">
        <Button
          variant="outline"
        className="w-full justify-start text-left font-normal"
        onClick={() => setOpen(!open)}
          id={id}
        >
          {value ? value : "Select time"}
        <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute z-20 mt-2 bg-white border border-gray-300 rounded-md shadow-lg p-4">
            <div className="flex gap-2">
          <Select value={currentHour} onValueChange={handleHourChange}>
            <SelectTrigger className="w-[80px]">
              <SelectValue placeholder="HH" />
            </SelectTrigger>
            <SelectContent>
              {hours.map((hour) => (
                <SelectItem key={hour} value={hour}>
                  {hour}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="self-center text-lg">:</span>
          <Select value={currentMinute} onValueChange={handleMinuteChange}>
            <SelectTrigger className="w-[80px]">
              <SelectValue placeholder="MM" />
            </SelectTrigger>
            <SelectContent>
              {minutes.map((minute) => (
                <SelectItem key={minute} value={minute}>
                  {minute}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
          </div>
        </>
      )}
    </div>
  );
};

export default function HybridMeetupApp() {
  // State Management - events, UI modals, filters, and user interactions
  const [showLanding, setShowLanding] = useState(true);
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedSafetyLevel, setSelectedSafetyLevel] =
    useState<SafetyLevel>("All"); // New state for safety filter
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [joiningEventId, setJoiningEventId] = useState<string | null>(null);
  const [joiningEventType, setJoiningEventType] = useState<
    "in-person" | "virtual" | "waitlist" | null
  >(null);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [feedbackUserName, setFeedbackUserName] = useState("");
  const [commentUserName, setCommentUserName] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [newEvent, setNewEvent] = useState<
    Omit<Event, "id" | "comments" | "safetyRating" | "feedback"> & {
      equipmentName?: string;
      equipmentRequired?: boolean;
      equipmentProvided?: boolean;
      covidSafetyLevel: SafetyLevel | ""; // New field for create event form
    }
  >({
    title: "",
    category: "",
    date: "",
    time: "",
    duration: "",
    type: "hybrid",
    venue: { name: "", address: "", capacity: 0 },
    virtualLink: "",
    attendees: { inPerson: 0, virtual: 0, waitlist: 0 },
    maxAttendees: { inPerson: 0, virtual: 0 },
    equipment: [],
    covidSafetyLevel: "",
  });
  const [joinedEvents, setJoinedEvents] = useState<{
    [key: string]: "in-person" | "virtual" | "waitlist";
  }>({});
  const [feedbackGiven, setFeedbackGiven] = useState<{
    [key: string]: boolean;
  }>({});
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [videoCallEvent, setVideoCallEvent] = useState<Event | null>(null);

  useEffect(() => {
    // Simulate user joining events on initial load for testing purposes
    // setJoinedEvents({ "1": "in-person" });
  }, []);

  // Filter events based on search, category, type, and safety level
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch = event.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || event.category === selectedCategory;
      const matchesType = selectedType === "All" || event.type === selectedType;
      const matchesSafety =
        selectedSafetyLevel === "All" ||
        (selectedSafetyLevel === "high" && event.safetyRating > 4) ||
        (selectedSafetyLevel === "medium" &&
          event.safetyRating >= 2 &&
          event.safetyRating <= 4) ||
        (selectedSafetyLevel === "basic" &&
          event.safetyRating >= 0 &&
          event.safetyRating <= 1.9);

      return matchesSearch && matchesCategory && matchesType && matchesSafety;
    });
  }, [events, searchTerm, selectedCategory, selectedType, selectedSafetyLevel]);

  const handleCreateEvent = () => {
    // Determine safetyRating and maxAttendees based on covidSafetyLevel
    let determinedSafetyRating: number = 0;
    let determinedMaxAttendeesInPerson: number = 0;

    if (newEvent.type !== "virtual") {
      switch (newEvent.covidSafetyLevel) {
        case "high":
          determinedSafetyRating = 4.5 + Math.random() * 0.5; // 4.5 to 5.0
          determinedMaxAttendeesInPerson = Math.floor(
            newEvent.venue.capacity * 0.5
          );
          break;
        case "medium":
          determinedSafetyRating = 2.0 + Math.random() * 2.0; // 2.0 to 4.0
          determinedMaxAttendeesInPerson = Math.floor(
            newEvent.venue.capacity * 0.75
          );
          break;
        case "basic":
          determinedSafetyRating = 0.0 + Math.random() * 1.0; // 0.0 to 1.0
          determinedMaxAttendeesInPerson = newEvent.venue.capacity;
          break;
        default:
          determinedSafetyRating = 0; // Fallback if no safety level is selected
          determinedMaxAttendeesInPerson = newEvent.venue.capacity;
          break;
      }
    } else {
      // For virtual events, safety rating is high by default, and capacity is as specified by user
      determinedSafetyRating = 4.5 + Math.random() * 0.5; // Always high for virtual
      determinedMaxAttendeesInPerson = 0;
    }

    const id = (events.length + 1).toString();
    const newEventWithDefaults: Event = {
      ...newEvent,
      id,
      attendees: { inPerson: 0, virtual: 0, waitlist: 0 },
      safetyRating: determinedSafetyRating,
      comments: [],
      maxAttendees: {
        inPerson: determinedMaxAttendeesInPerson,
        virtual:
          newEvent.type === "in-person" ? 0 : newEvent.maxAttendees.virtual,
      },
      equipment: newEvent.equipment || [],
      feedback: [],
    };

    setEvents((prev) => [...prev, newEventWithDefaults]);
    // Reset form state
    setNewEvent({
      title: "",
      category: "",
      date: "",
      time: "",
      duration: "",
      type: "hybrid",
      venue: { name: "", address: "", capacity: 0 },
      virtualLink: "",
      attendees: { inPerson: 0, virtual: 0, waitlist: 0 },
      maxAttendees: { inPerson: 0, virtual: 0 },
      equipment: [],
      covidSafetyLevel: "",
    });

    setErrors({});
    setShowCreateModal(false);
  };

  const handleJoinClick = (
    eventId: string,
    type: "in-person" | "virtual" | "waitlist"
  ) => {
    if (joinedEvents[eventId]) {
      return;
    }

    const event = events.find((e) => e.id === eventId);
    if (!event) return;

    let joinType = type;
    if (type === "in-person") {
      if (event.attendees.inPerson >= event.maxAttendees.inPerson) {
        joinType = "waitlist";
      }
    } else if (type === "virtual") {
      if (event.attendees.virtual >= event.maxAttendees.virtual) {
        joinType = "waitlist";
      }
    }

    setJoiningEventId(eventId);
    setJoiningEventType(joinType);
    setShowJoinModal(true);
  };

  const joinEvent = () => {
    if (!joiningEventId || !joiningEventType) return;
    
    // Find the event being joined
    const eventBeingJoined = events.find(e => e.id === joiningEventId);
    
    setEvents((prevEvents) =>
      prevEvents.map((event) => {
        if (event.id === joiningEventId) {
          const updatedAttendees = { ...event.attendees };
          if (joiningEventType === "in-person") {
            updatedAttendees.inPerson += 1;
          } else if (joiningEventType === "virtual") {
            updatedAttendees.virtual += 1;
          } else if (joiningEventType === "waitlist") {
            updatedAttendees.waitlist += 1;
          }
          return { ...event, attendees: updatedAttendees };
        }
        return event;
      })
    );
    setJoinedEvents((prev) => ({
      ...prev,
      [joiningEventId]: joiningEventType,
    }));
    setShowJoinModal(false);
    
    // If joining virtual, open video call
    if (joiningEventType === "virtual" && eventBeingJoined) {
      setVideoCallEvent(eventBeingJoined);
      setShowVideoCall(true);
    }
    
    setJoiningEventId(null);
    setJoiningEventType(null);
  };

  function DatePickerField({
    date,
    onChange,
  }: {
    date?: Date;
    onChange: (date: Date) => void;
  }) {
    const [isOpen, setIsOpen] = useState(false);
    
    const handleDateSelect = (selectedDate: Date) => {
      onChange(selectedDate);
      setIsOpen(false);
    };

    return (
      <div className="relative">
        <Button 
          variant="outline" 
          className="justify-start text-left w-full"
          onClick={() => setIsOpen(!isOpen)}
        >
            {date ? format(date, "PPP") : <span>Pick a date</span>}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
            <div className="absolute z-20 mt-2 bg-white border border-gray-300 rounded-md shadow-lg">
          <Calendar
            mode="single"
            required={true}
            selected={date}
                onSelect={handleDateSelect}
            autoFocus
          />
            </div>
          </>
        )}
      </div>
    );
  }

  function validate() {
    const errs: FieldErrors = {};
    if (!newEvent.title) errs.title = "Title is required";
    if (!newEvent.category) errs.category = "Category is required";
    if (!newEvent.date) errs.date = "Date is required";
    if (!newEvent.time) errs.time = "Time is required";
    if (newEvent.type !== "virtual") {
      if (!newEvent.venue.name) errs.venueName = "Venue name is required";
      if (!newEvent.venue.address)
        errs.venueAddress = "Venue address is required";
      if (newEvent.venue.capacity <= 0)
        errs.capacity = "Capacity must be greater than 0";
    }
    if (newEvent.type !== "in-person") {
      if (!newEvent.virtualLink) errs.virtualLink = "Virtual link is required";
      if (newEvent.maxAttendees.virtual <= 0)
        errs.virtualCapacity = "Virtual capacity must be greater than 0";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  const handleLeaveEvent = (eventId: string) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) => {
        if (event.id === eventId) {
          const updatedAttendees = { ...event.attendees };
          const userJoinType = joinedEvents[eventId];

          if (userJoinType === "in-person") {
            updatedAttendees.inPerson = Math.max(
              0,
              updatedAttendees.inPerson - 1
            );
          } else if (userJoinType === "virtual") {
            updatedAttendees.virtual = Math.max(
              0,
              updatedAttendees.virtual - 1
            );
          } else if (userJoinType === "waitlist") {
            updatedAttendees.waitlist = Math.max(
              0,
              updatedAttendees.waitlist - 1
            );
          }
          return { ...event, attendees: updatedAttendees };
        }
        return event;
      })
    );
    setJoinedEvents((prev) => {
      const newJoined = { ...prev };
      delete newJoined[eventId];
      return newJoined;
    });
    setFeedbackGiven((prev) => {
      const newFeedback = { ...prev };
      delete newFeedback[eventId];
      return newFeedback;
    });
    setSelectedEvent(null); // Close event details after leaving
  };

  const handleCommentSubmit = (eventId: string, commentText: string, userName: string) => {
    if (!commentText.trim() || !userName.trim()) return;
    const sentiment = analyzeSentiment(commentText);
    setEvents((prevEvents) =>
      prevEvents.map((event) => {
        if (event.id === eventId) {
          const newComment = {
            id: Date.now().toString(),
            userName: userName,
            text: commentText,
            timestamp: new Date().toISOString(),
            sentiment: sentiment,
          };
          return {
            ...event,
            comments: [...event.comments, newComment],
          };
        }
        return event;
      })
    );
  };

  const handleSubmitFeedback = () => {
    if (!selectedEvent || feedbackRating === 0 || !feedbackUserName.trim()) return;
    const sentiment = feedbackComment.trim() ? analyzeSentiment(feedbackComment) : "neutral";
    
    setEvents((prevEvents) =>
      prevEvents.map((event) => {
        if (event.id === selectedEvent) {
          const newFeedback = {
            id: Date.now().toString(),
              rating: feedbackRating,
              comment: feedbackComment,
            userName: feedbackUserName,
            sentiment: sentiment,
            timestamp: new Date().toISOString(),
          };
          
          return {
            ...event,
            feedback: [...event.feedback, newFeedback],
          };
        }
        return event;
      })
    );
    setShowFeedbackModal(false);
    setFeedbackRating(0);
    setFeedbackComment("");
    setFeedbackUserName("");
    setFeedbackGiven(prev => ({ ...prev, [selectedEvent]: true }));
  };

  const handleToggleEquipmentProvided = (
    eventId: string,
    equipmentId: string
  ) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) => {
        if (event.id === eventId) {
          return {
            ...event,
            equipment: event.equipment.map((item) =>
              item.id === equipmentId
                ? { ...item, provided: !item.provided }
                : item
            ),
          };
        }
        return event;
      })
    );
  };

  const handleOpenChange = (open: boolean) => {
    setShowCreateModal(open);
    if (!open) {
      setNewEvent({
        title: "",
        category: "",
        date: "",
        time: "",
        duration: "",
        type: "hybrid",
        venue: { name: "", address: "", capacity: 0 },
        virtualLink: "",
        attendees: { inPerson: 0, virtual: 0, waitlist: 0 },
        maxAttendees: { inPerson: 0, virtual: 0 },
        equipment: [],
        covidSafetyLevel: "",
      });
      setErrors({});
    }
  };

  const onSubmit = () => {
    if (!validate()) return;
    handleCreateEvent();
  };

  // --- Statistics Calculation ---
  const totalEvents = events.length;
  const totalAttendees = events.reduce(
    (sum, event) => sum + event.attendees.inPerson + event.attendees.virtual,
    0
  );

  const averageRating = useMemo(() => {
    const allFeedback = events.flatMap(event => event.feedback);
    if (allFeedback.length === 0) return 0;
    const totalRatings = allFeedback.reduce((sum, feedback) => sum + feedback.rating, 0);
    return totalRatings / allFeedback.length;
  }, [events]);

  const eventTypeCounts = useMemo(() => {
    return events.reduce((acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1;
      return acc;
    }, {} as Record<EventType, number>);
  }, [events]);

  const sentimentStats = useMemo(() => {
    const allComments = events.flatMap(event => event.comments);
    const allFeedback = events.flatMap(event => event.feedback);
    const allSentiments = [...allComments, ...allFeedback].map(item => item.sentiment).filter(Boolean);
    
    const counts = allSentiments.reduce((acc, sentiment) => {
      acc[sentiment!] = (acc[sentiment!] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      positive: counts.positive || 0,
      negative: counts.negative || 0,
      neutral: counts.neutral || 0,
      total: allSentiments.length
    };
  }, [events]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setSelectedType("All");
    setSelectedSafetyLevel("All");
  };

  // Animation variants for modals
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.3, ease: easeInOut },
    }, // use imported ease
    exit: {
      opacity: 0,
      scale: 0.95,
      y: -20,
      transition: { duration: 0.2, ease: easeInOut },
    }, // use imported ease
  };

  // Animation variants for event cards
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (showLanding) {
    return (
      // Added motion.div for landing page transition
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="min-h-screen flex items-center justify-center p-4"
        style={{ backgroundColor: colors.background }}
      >
        <GlobalStyles />

        <div className="text-center bg-white/90 backdrop-blur-md p-10 rounded-3xl shadow-2xl max-w-lg" 
             style={{ borderColor: colors.primary, borderWidth: '2px' }}>
          <h1 className="text-5xl font-extrabold tracking-tight mb-4"
              style={{ 
                background: `linear-gradient(to right, ${colors.primary}, ${colors.secondary})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
            HybridHub Meetups
          </h1>
          <p className="text-lg mb-6" style={{ color: colors.neutral }}>
            Connecting communities, one event at a time. Join hybrid, virtual,
            and in-person meetups.
          </p>
          <button
            className="mt-4 px-8 py-4 text-white text-lg font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 hover:-translate-y-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 active:scale-95 focus:ring-4 focus:ring-blue-300 transform"
            style={{ backgroundColor: colors.primary }}
            onClick={() => setShowLanding(false)}
          >
            Get Started
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50 text-gray-800">
      {/* Global Scrollbar Styles */}
      <GlobalStyles />

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg py-4 px-6 md:px-10 sticky top-0 z-20">
        {/* Centered title */}
        <div className="flex justify-center">
          <h1 className="text-4xl font-black tracking-tight"
              style={{ 
                background: `linear-gradient(to right, ${colors.primary}, ${colors.secondary})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
            HybridHub
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 flex-grow flex">
        {/* Main content area now a flex container */}
        <div className="flex flex-col lg:flex-row lg:space-x-8 w-full">
          {/* Left Column: Filter Options */}
          <aside className="w-full lg:w-1/4 bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-lg mb-8 lg:mb-0 lg:max-h-[calc(100vh-140px)] lg:overflow-y-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Filters</h3>

            {/* Search Input */}
            <div className="relative w-full mb-6">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search events..."
                className="w-full pl-12 pr-4 py-2.5 rounded-full border-2 border-transparent focus:ring-4 focus:ring-cyan-300 focus:border-cyan-500 bg-white/70 text-gray-900 shadow-md transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Categories Dropdown */}
            <div className="mb-6">
              <Label
                htmlFor="category-filter"
                className="text-lg font-medium mb-3 block"
              >
                Category
              </Label>
              <Select
                value={selectedCategory}
                onValueChange={(value) => setSelectedCategory(value)}
              >
                <SelectTrigger id="category-filter" className="w-full">
                  <SelectValue placeholder="Select a category" value={selectedCategory} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Event Types Dropdown */}
            <div className="mb-6">
              <Label
                htmlFor="event-type-filter"
                className="text-lg font-medium mb-3 block"
              >
                Event Type
              </Label>
              <Select
                value={selectedType}
                onValueChange={(value) =>
                  setSelectedType(value as Event["type"] | "All")
                }
              >
                <SelectTrigger id="event-type-filter" className="w-full">
                  <SelectValue placeholder="Select event type" value={selectedType} />
                </SelectTrigger>
                <SelectContent>
                  {eventTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type === "in-person"
                        ? "In-person"
                        : type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* COVID Safety Filter Dropdown */}
            <div className="mb-6">
              <Label
                htmlFor="safety-level-filter"
                className="text-lg font-medium mb-3 block"
              >
                COVID Safety Level
              </Label>
              <Select
                value={selectedSafetyLevel}
                onValueChange={(value) =>
                  setSelectedSafetyLevel(value as SafetyLevel)
                }
              >
                <SelectTrigger id="safety-level-filter" className="w-full">
                  <SelectValue placeholder="Select safety level" value={selectedSafetyLevel} />
                </SelectTrigger>
                <SelectContent>
                  {safetyLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Reset Filters Button */}
            <button
              onClick={handleResetFilters}
              className="w-full flex items-center justify-center bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-800 px-6 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 mb-4 font-semibold border border-gray-300 active:scale-95"
            >
              Reset Filters
            </button>

            {/* Create Event Button */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="w-full flex items-center justify-center text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 mt-6 font-semibold bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 active:scale-95 focus:ring-4 focus:ring-blue-300"
              style={{ backgroundColor: colors.primary }}
            >
              <Plus className="w-5 h-5 mr-2" /> Create New Event
            </button>
          </aside>

          {/* Center Column: Event List (Now Scrollable) */}
          <section className="w-full lg:w-2/4 lg:max-h-[calc(100vh-140px)] overflow-y-auto pr-4">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Upcoming Events
            </h2>
            {/* Added motion.div for staggered children animation */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.1, // Each child will animate with a delay
                  },
                },
              }}
            >
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event) => (
                  // Each event card is a motion.div with its own animation
                  <motion.div
                    key={event.id}
                    variants={cardVariants}
                    transition={{ duration: 0.5 }}
                    className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-blue-100 transform transition duration-300 hover:scale-[1.03] hover:shadow-2xl cursor-pointer overflow-hidden"
                    onClick={() => setSelectedEvent(event.id)}
                  >
                    <div className="p-6">
                      {/* Category & Safety Rating */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                          {event.category}
                        </span>
                        <div className="flex items-center text-sm font-medium text-gray-700">
                          {event.safetyRating > 4 && (
                            <Shield className="w-5 h-5 text-green-500 mr-1.5" />
                          )}
                          <Star
                            className={`w-5 h-5 ${
                              event.safetyRating > 3
                                ? "text-yellow-400"
                                : "text-gray-400"
                            }`}
                          />
                          <span className="ml-1.5">
                            {event.safetyRating?.toFixed(1) || "N/A"}
                          </span>
                        </div>
                      </div>

                      {/* Event Title */}
                      <h2 className="text-2xl font-extrabold text-gray-900 mb-2 truncate">
                        {event.title}
                      </h2>

                      {/* Date and Time */}
                      <p className="text-gray-700 mb-4 flex items-center font-medium">
                        <CalendarIcon className="w-5 h-5 mr-2.5 text-blue-500" />
                        {event.date} at {event.time} ({event.duration})
                      </p>

                      {/* Location / Type */}
                      <div className="flex flex-wrap items-center text-sm text-gray-700 mb-5 gap-x-4 gap-y-2">
                        {["in-person", "hybrid"].includes(event.type) && (
                          <div className="flex items-center">
                            <MapPin className="w-5 h-5 mr-2 text-blue-500" />
                            <span className="font-medium">
                              {event.venue?.name || "TBD"}
                            </span>
                          </div>
                        )}
                        {event.type !== "in-person" && (
                          <div className="flex items-center">
                            <Video className="w-5 h-5 mr-2 text-blue-500" />
                            <span className="font-medium">Online</span>
                          </div>
                        )}
                      </div>

                      {/* Attendee Info & Capacity */}
                      <div className="flex items-center justify-between text-sm text-gray-800">
                        <div className="flex items-center flex-wrap gap-2">
                          <Users className="w-5 h-5 mr-1 text-blue-500" />
                          <span className="font-semibold">
                            {(event.attendees.inPerson || 0) +
                              (event.attendees.virtual || 0)}{" "}
                            Attendees
                          </span>
                          {event.attendees.waitlist > 0 && (
                            <span className="ml-2 text-yellow-700 font-bold">
                              ({event.attendees.waitlist} Waitlist)
                            </span>
                          )}
                        </div>
                        {event.type !== "virtual" && (
                          <span
                            className={`px-3.5 py-1.5 rounded-full text-xs font-bold ${
                              event.attendees.inPerson >=
                              event.maxAttendees.inPerson
                                ? "bg-red-200 text-red-900"
                                : "bg-green-200 text-green-900"
                            }`}
                          >
                            {event.attendees.inPerson >=
                            event.maxAttendees.inPerson
                              ? "Full Capacity"
                              : `${
                                  event.maxAttendees.inPerson -
                                  event.attendees.inPerson
                                } Spots Left`}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="col-span-full text-center text-gray-700 text-xl py-12 font-semibold">
                  No events found matching your criteria. Try a different
                  search!
                </p>
              )}
            </motion.div>
          </section>

          {/* Right Column: Stats */}
          <aside className="w-full lg:w-1/4 bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-lg mt-8 lg:mt-0 lg:max-h-[calc(100vh-140px)] lg:overflow-y-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              Statistics
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg shadow-sm">
                <span className="font-medium text-gray-700">Total Events:</span>
                <span className="font-bold text-blue-700 text-xl">
                  {totalEvents}
                </span>
              </div>
              <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg shadow-sm">
                <span className="font-medium text-gray-700">
                  Total Attendees:
                </span>
                <span className="font-bold text-blue-700 text-xl">
                  {totalAttendees}
                </span>
              </div>
              <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg shadow-sm">
                <span className="font-medium text-gray-700">
                  Average Rating:
                </span>
                <span className="font-bold text-blue-700 text-xl">
                  {averageRating.toFixed(1)} / 5
                </span>
              </div>

              <h4 className="text-lg font-bold text-gray-800 mt-6 mb-3">
                Events by Type:
              </h4>
              <ul className="space-y-2">
                {Object.entries(eventTypeCounts).map(([type, count]) => (
                  <li
                    key={type}
                    className="flex items-center justify-between bg-blue-50 p-3 rounded-lg shadow-sm"
                  >
                    <span className="text-gray-700">
                      {type.charAt(0).toUpperCase() + type.slice(1)}:
                    </span>
                    <span className="font-bold text-blue-700">{count}</span>
                  </li>
                ))}
              </ul>

              {sentimentStats.total > 0 && (
                <>
                  <h4 className="text-lg font-bold text-gray-800 mt-6 mb-3">
                    Sentiment Analysis:
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg shadow-sm">
                      <span className="text-gray-700 flex items-center gap-2">
                        <PositiveIcon className="w-4 h-4" />
                        Positive:
                      </span>
                      <span className="font-bold text-green-700">
                        {sentimentStats.positive} ({((sentimentStats.positive / sentimentStats.total) * 100).toFixed(1)}%)
                      </span>
                    </div>
                    <div className="flex items-center justify-between bg-yellow-50 p-3 rounded-lg shadow-sm">
                      <span className="text-gray-700 flex items-center gap-2">
                        <NeutralIcon className="w-4 h-4" />
                        Neutral:
                      </span>
                      <span className="font-bold text-yellow-700">
                        {sentimentStats.neutral} ({((sentimentStats.neutral / sentimentStats.total) * 100).toFixed(1)}%)
                      </span>
                    </div>
                    <div className="flex items-center justify-between bg-red-50 p-3 rounded-lg shadow-sm">
                      <span className="text-gray-700 flex items-center gap-2">
                        <NegativeIcon className="w-4 h-4" />
                        Negative:
                      </span>
                      <span className="font-bold text-red-700">
                        {sentimentStats.negative} ({((sentimentStats.negative / sentimentStats.total) * 100).toFixed(1)}%)
                      </span>
                    </div>
                    <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg shadow-sm">
                      <span className="text-gray-700">Total Feedback:</span>
                      <span className="font-bold text-gray-700">{sentimentStats.total}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </aside>
        </div>
      </main>

      {/* Event Detail Modal */}
      {/* Added AnimatePresence and motion.div for modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto"
            onClick={() => setSelectedEvent(null)}
          >
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-3xl overflow-y-auto max-h-[95vh] transform transition-all duration-300 scale-100 opacity-100 relative" onClick={(e) => e.stopPropagation()}>
              {/* Close Button */}
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 hover:scale-110 transition-transform"
                aria-label="Close modal"
              >
                <CloseIcon className="w-9 h-9" />
              </button>

              {/* Find the selected event */}
              {(() => {
                const event = events.find((e) => e.id === selectedEvent);
                if (!event)
                  return <p className="text-gray-700">Event not found.</p>;

                return (
                  <div key={event.id}>
                    {/* Title & Category */}
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-cyan-500">
                      {event.title}
                    </h2>
                    <p className="text-gray-700 mb-6 text-lg font-medium">
                      {event.category}
                    </p>

                    {/* Event Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-8 text-gray-800">
                      <div className="flex items-center text-base">
                        <CalendarIcon className="w-6 h-6 mr-3.5 text-blue-600" />
                        <span className="font-medium">
                          {event.date} at {event.time} ({event.duration})
                        </span>
                      </div>
                      <div className="flex items-center text-base">
                        <Users className="w-6 h-6 mr-3.5 text-blue-600" />
                        <span className="font-medium">
                          {event.attendees.inPerson} In-person,{" "}
                          {event.attendees.virtual} Virtual
                          {event.attendees.waitlist > 0 &&
                            `, ${event.attendees.waitlist} On Waitlist`}
                        </span>
                      </div>
                      {event.type !== "virtual" && (
                        <div className="flex items-center text-base">
                          <MapPin className="w-6 h-6 mr-3.5 text-blue-600" />
                          <span className="font-medium">
                            {event.venue?.name}, {event.venue?.address}{" "}
                            (Capacity: {event.venue.capacity})
                          </span>
                        </div>
                      )}
                      {event.type !== "in-person" && (
                        <div className="flex items-center text-base">
                          <Video className="w-6 h-6 mr-3.5" style={{ color: colors.primary }} />
                          {joinedEvents[event.id] === "virtual" ? (
                            <button
                              onClick={() => {
                                setVideoCallEvent(event);
                                setShowVideoCall(true);
                              }}
                              className="font-bold hover:underline"
                              style={{ color: colors.primary }}
                            >
                              Join Video Call
                            </button>
                          ) : (
                            <span style={{ color: colors.neutral }}>
                              Virtual meeting available after joining virtually
                            </span>
                          )}
                        </div>
                      )}
                      <div className="flex items-center text-base">
                        <Shield className="w-6 h-6 mr-3.5 text-blue-600" />
                        <span className="font-medium">
                          {" "}
                          Safety Rating: {event.safetyRating.toFixed(1)} / 5
                        </span>
                      </div>
                    </div>

                    {/* Equipment Checklist */}
                    {event.equipment?.length > 0 && (
                      <div className="mb-8 bg-blue-50/70 p-5 rounded-lg">
                        <h3 className="text-xl font-bold text-blue-900 mb-4">
                          Equipment Checklist
                        </h3>
                        <div className="space-y-3">
                          {event.equipment.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center gap-4 text-base"
                            >
                              <input
                                type="checkbox"
                                id={`equipment-${event.id}-${item.id}`}
                                className="form-checkbox h-5 w-5 text-blue-600 rounded cursor-pointer border-gray-400 focus:ring-blue-500"
                                checked={item.provided}
                                onChange={() =>
                                  handleToggleEquipmentProvided(
                                    event.id,
                                    item.id
                                  )
                                }
                              />
                              <label
                                htmlFor={`equipment-${event.id}-${item.id}`}
                                className="cursor-pointer flex-grow"
                              >
                                <span
                                  className={
                                    item.required
                                      ? "font-bold text-gray-800"
                                      : "font-medium text-gray-700"
                                  }
                                >
                                  {item.name}
                                  {item.required && (
                                    <span className="text-red-600 ml-1.5">
                                      *
                                    </span>
                                  )}
                                </span>
                              </label>
                              {item.provided && (
                                <span className="text-green-700 text-sm font-semibold">
                                  {" "}
                                  (Provided by Event){" "}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Existing Feedback Display */}
                    {event.feedback.length > 0 && (
                      <div className="mb-8 bg-green-50/70 p-5 rounded-lg">
                        <h3 className="text-xl font-bold text-green-900 mb-4">
                          Previous Feedback ({event.feedback.length})
                        </h3>
                        <div className="space-y-4 max-h-64 overflow-y-auto">
                          {event.feedback.map((feedback) => (
                            <div key={feedback.id} className="bg-white p-4 rounded-lg shadow-sm border border-green-200">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-medium text-gray-700">By:</span>
                                <span className="font-bold text-gray-800">{feedback.userName}</span>
                                {feedback.sentiment && (
                                  <span 
                                    className={`text-sm font-medium ${
                                      feedback.sentiment === "positive" ? "text-green-600" :
                                      feedback.sentiment === "negative" ? "text-red-600" : "text-yellow-600"
                                    }`} 
                                    title={`Sentiment: ${feedback.sentiment}`}
                                  >
                                    {feedback.sentiment === "positive" ? <PositiveIcon className="w-4 h-4" /> :
                                     feedback.sentiment === "negative" ? <NegativeIcon className="w-4 h-4" /> : <NeutralIcon className="w-4 h-4" />}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-medium text-gray-700">Rating:</span>
                                <div className="flex items-center">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`w-4 h-4 ${
                                        star <= feedback.rating
                                          ? "text-yellow-400"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                  <span className="ml-2 font-bold text-gray-800">
                                    {feedback.rating}/5
                                  </span>
                                </div>
                              </div>
                              {feedback.comment && (
                                <div className="mb-2">
                                  <span className="font-medium text-gray-700">Comment:</span>
                                  <p className="text-gray-800 mt-1 italic">"{feedback.comment}"</p>
                                </div>
                              )}
                              <p className="text-xs text-gray-500">
                                {new Date(feedback.timestamp).toLocaleString()}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-8">
                      {joinedEvents[event.id] ? (
                        <button
                          onClick={() => handleLeaveEvent(event.id)}
                          className="w-full sm:w-auto flex-1 py-3.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 focus:ring-4 focus:ring-red-300"
                        >
                          Leave Event
                        </button>
                      ) : (
                        <>
                          {event.type !== "virtual" && (
                            <button
                              onClick={() =>
                                handleJoinClick(event.id, "in-person")
                              }
                              className="w-full sm:w-auto flex-1 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 focus:ring-4 focus:ring-blue-300"
                            >
                              {event.attendees.inPerson >=
                              event.maxAttendees.inPerson
                                ? "Join Waitlist (In-person)"
                                : "Join In-person"}
                            </button>
                          )}
                          {event.type !== "in-person" && (
                            <button
                              onClick={() =>
                                handleJoinClick(event.id, "virtual")
                              }
                              className="w-full sm:w-auto flex-1 py-3.5 bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 focus:ring-4 focus:ring-indigo-300"
                            >
                              {event.attendees.virtual >=
                              event.maxAttendees.virtual
                                ? "Join Waitlist (Virtual)"
                                : "Join Virtual"}
                            </button>
                          )}
                        </>
                      )}
                      {joinedEvents[event.id] && joinedEvents[event.id] !== "waitlist" && !feedbackGiven[event.id] && (
                        <button
                          onClick={() => {
                            setSelectedEvent(event.id); // Ensure the selected event is set
                            setShowFeedbackModal(true);
                          }}
                          className="w-full sm:w-auto flex-1 py-3.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 focus:ring-4 focus:ring-green-300"
                        >
                          Give Feedback
                        </button>
                      )}
                    </div>

                    {/* Comments Section */}
                    <div className="mt-10">
                      <h3 className="text-2xl font-bold text-gray-900 mb-5">
                        Comments ({event.comments.length})
                      </h3>
                      <div className="space-y-5 max-h-72 overflow-y-auto pr-3">
                        {event.comments.length > 0 ? (
                          event.comments.map((comment) => {
                            const getSentimentColor = (sentiment?: string) => {
                              switch (sentiment) {
                                case "positive": return "text-green-600";
                                case "negative": return "text-red-600";
                                case "neutral": return "text-yellow-600";
                                default: return "text-gray-600";
                              }
                            };
                            
                            const getSentimentIcon = (sentiment?: string) => {
                              switch (sentiment) {
                                case "positive": return <PositiveIcon className="w-4 h-4" />;
                                case "negative": return <NegativeIcon className="w-4 h-4" />;
                                case "neutral": return <NeutralIcon className="w-4 h-4" />;
                                default: return <CommentIcon className="w-4 h-4" />;
                              }
                            };

                            return (
                              <div
                                key={comment.id}
                                className="bg-gray-100 p-4 rounded-lg shadow-sm flex items-start space-x-4"
                              >
                                <img
                                  src={`https://ui-avatars.com/api/?name=${comment.userName}&background=0D8ABC&color=fff`}
                                  alt={comment.userName}
                                  width={40}
                                  height={40}
                                  className="w-12 h-12 rounded-full object-cover border-2 border-white"
                                />
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                  <p className="font-bold text-gray-800 text-lg">
                                      {comment.userName}
                                    </p>
                                    {comment.sentiment && (
                                      <span 
                                        className={`text-sm font-medium ${getSentimentColor(comment.sentiment)}`} 
                                        title={`Sentiment: ${comment.sentiment}`}
                                      >
                                        {getSentimentIcon(comment.sentiment)}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-base text-gray-700">
                                    {comment.text}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1.5">
                                    {new Date(
                                      comment.timestamp
                                    ).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <p className="text-gray-600 text-center py-6">
                            No comments yet. Be the first to share your
                            thoughts!
                          </p>
                        )}
                      </div>

                      {/* Add Comment */}
                      <div className="mt-6 space-y-3">
                        <div className="flex flex-col sm:flex-row gap-3">
                          <input
                            type="text"
                            placeholder="Your name..."
                            className="sm:w-1/3 rounded-full border-2 border-gray-300 focus:ring-4 focus:ring-cyan-300 focus:border-cyan-500 bg-white text-gray-900 py-3 px-5 transition-all"
                            value={commentUserName}
                            onChange={(e) => setCommentUserName(e.target.value)}
                            id="comment-name-input"
                          />
                        <input
                          type="text"
                          placeholder="Add a public comment..."
                          className="flex-grow rounded-full border-2 border-gray-300 focus:ring-4 focus:ring-cyan-300 focus:border-cyan-500 bg-white text-gray-900 py-3 px-5 transition-all"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                if (commentUserName.trim() && e.currentTarget.value.trim()) {
                              handleCommentSubmit(
                                event.id,
                                    e.currentTarget.value,
                                    commentUserName
                              );
                              e.currentTarget.value = "";
                                  setCommentUserName("");
                                }
                            }
                          }}
                          id="comment-input"
                        />
                        <button
                          onClick={() => {
                            const inputEl = document.getElementById(
                              "comment-input"
                            ) as HTMLInputElement;
                              if (inputEl?.value.trim() && commentUserName.trim()) {
                                handleCommentSubmit(event.id, inputEl.value, commentUserName);
                              inputEl.value = "";
                                setCommentUserName("");
                            }
                          }}
                            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!commentUserName.trim()}
                        >
                          Post
                        </button>
                        </div>
                        {!commentUserName.trim() && (
                          <p className="text-sm text-gray-500">Please enter your name to post a comment.</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create New Event Modal */}
      <Dialog open={showCreateModal} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent className="w-[95vw] max-w-xs sm:max-w-sm md:max-w-md lg:max-w-2xl xl:max-w-4xl max-h-[90vh] overflow-y-auto mx-2 sm:mx-4">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold text-gray-800">
              Create New Event
            </DialogTitle>
            <DialogClose />
          </DialogHeader>
          <div className="space-y-4 sm:space-y-6 py-2 sm:py-4">
            {/* Title */}
            <div>
              <Label htmlFor="title" className="text-sm sm:text-base lg:text-lg font-medium">
                Title *
              </Label>
              <Input
                id="title"
                className="mt-2 text-base"
                value={newEvent.title}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, title: e.target.value })
                }
              />
              {errors.title && (
                <p className="text-red-600 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <Label htmlFor="category" className="text-sm sm:text-base lg:text-lg font-medium">
                Category *
              </Label>
              <div className="mt-2">
              <Select
                value={newEvent.category}
                onValueChange={(v) => setNewEvent({ ...newEvent, category: v })}
              >
                  <SelectTrigger id="category" className="text-base">
                    <SelectValue placeholder="Select a category" value={newEvent.category} />
                </SelectTrigger>
                <SelectContent>
                  {categories
                    .filter((c) => c !== "All")
                    .map((cat) => (
                        <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              </div>
              {errors.category && (
                <p className="text-red-600 text-sm mt-1">{errors.category}</p>
              )}
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
              <div className="space-y-2">
                <Label htmlFor="date" className="text-sm sm:text-base lg:text-lg font-medium">
                  Date *
                </Label>
                <DatePickerField
                  date={newEvent.date ? new Date(newEvent.date) : undefined}
                  onChange={(d) =>
                    setNewEvent({ ...newEvent, date: format(d, "yyyy-MM-dd") })
                  }
                />
                {errors.date && (
                  <p className="text-red-600 text-sm mt-1">{errors.date}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="time" className="text-lg font-medium">
                  Time *
                </Label>
                <TimePicker
                  id="time"
                  value={newEvent.time}
                  onChange={(t) => setNewEvent({ ...newEvent, time: t })}
                />
                {errors.time && (
                  <p className="text-red-600 text-sm mt-1">{errors.time}</p>
                )}
              </div>
            </div>

            {/* Duration */}
            <div>
              <Label htmlFor="duration" className="text-lg font-medium">
                Duration
              </Label>
              <Input
                id="duration"
                className="mt-2 text-base"
                value={newEvent.duration}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, duration: e.target.value })
                }
                placeholder="e.g., 2 hours, 90 minutes"
              />
            </div>

            {/* Event Type */}
            <div>
              <Label htmlFor="type" className="text-sm sm:text-base lg:text-lg font-medium">
                Event Type *
              </Label>
              <div className="mt-2">
              <Select
                value={newEvent.type}
                onValueChange={(v) =>
                  setNewEvent({ ...newEvent, type: v as EventType })
                }
              >
                  <SelectTrigger id="type" className="text-base">
                    <SelectValue placeholder="Select event type" value={newEvent.type} />
                </SelectTrigger>
                <SelectContent>
                  {eventTypes
                    .filter((t) => t !== "All")
                    .map((type) => (
                        <SelectItem key={type} value={type}>
                          {type === "in-person" ? "In-person" : type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              </div>
            </div>

            {/* Venue Details (Conditional for non-virtual) */}
            {newEvent.type !== "virtual" && (
              <div className="space-y-6 border-t pt-6 mt-6">
                <h3 className="text-xl font-bold text-gray-800">
                  Venue Details
                </h3>
                <div>
                  <Label htmlFor="venueName" className="text-lg font-medium">
                    Venue Name *
                  </Label>
                  <Input
                    id="venueName"
                    className="mt-2 text-base"
                    value={newEvent.venue.name}
                    onChange={(e) =>
                      setNewEvent({
                        ...newEvent,
                        venue: { ...newEvent.venue, name: e.target.value },
                      })
                    }
                  />
                  {errors.venueName && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.venueName}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="venueAddress" className="text-lg font-medium">
                    Venue Address *
                  </Label>
                  <Input
                    id="venueAddress"
                    className="mt-2 text-base"
                    value={newEvent.venue.address}
                    onChange={(e) =>
                      setNewEvent({
                        ...newEvent,
                        venue: { ...newEvent.venue, address: e.target.value },
                      })
                    }
                  />
                  {errors.venueAddress && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.venueAddress}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="capacity" className="text-lg font-medium">
                    Capacity *
                  </Label>
                  <Input
                    id="capacity"
                    type="number"
                    min="1"
                    max="10000"
                    className="mt-2 text-base"
                    value={newEvent.venue.capacity || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Only allow numbers
                      if (value === '' || /^\d+$/.test(value)) {
                      setNewEvent({
                        ...newEvent,
                        venue: {
                          ...newEvent.venue,
                            capacity: value === '' ? 0 : parseInt(value),
                          },
                        });
                      }
                    }}
                    onKeyPress={(e) => {
                      // Prevent non-numeric characters
                      if (!/\d/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab' && e.key !== 'Enter') {
                        e.preventDefault();
                      }
                    }}
                    placeholder="Enter capacity (numbers only)"
                  />
                  {errors.capacity && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.capacity}
                    </p>
                  )}
                </div>

                {/* COVID Safety Level for In-Person/Hybrid */}
                <div>
                  <Label
                    htmlFor="covidSafetyLevel"
                    className="text-sm sm:text-base lg:text-lg font-medium"
                  >
                    COVID Safety Level *
                  </Label>
                  <div className="mt-2">
                  <Select
                    value={newEvent.covidSafetyLevel}
                    onValueChange={(v) =>
                      setNewEvent({
                        ...newEvent,
                        covidSafetyLevel: v as SafetyLevel,
                      })
                    }
                  >
                    <SelectTrigger
                      id="covidSafetyLevel"
                        className="text-base"
                    >
                        <SelectValue placeholder="Select safety level" value={newEvent.covidSafetyLevel} />
                    </SelectTrigger>
                    <SelectContent>
                      {safetyLevels
                        .filter((l) => l !== "All") // 'All' is for filtering, not creation
                        .map((level) => (
                          <SelectItem
                            key={level}
                            value={level}
                          >
                            {level.charAt(0).toUpperCase() + level.slice(1)}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Virtual Link (Conditional for non-in-person) */}
            {newEvent.type !== "in-person" && (
              <div className="space-y-4 border-t pt-6 mt-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                  Virtual Event Details
                </h3>
                <div>
                  <Label htmlFor="virtualLink" className="text-sm sm:text-base lg:text-lg font-medium">
                  Virtual Link *
                </Label>
                <Input
                  id="virtualLink"
                  className="mt-2 text-base"
                  value={newEvent.virtualLink}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, virtualLink: e.target.value })
                  }
                  placeholder="e.g., https://zoom.us/j/123456789"
                />
                {errors.virtualLink && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.virtualLink}
                  </p>
                )}
                </div>
                <div>
                  <Label htmlFor="virtualCapacity" className="text-sm sm:text-base lg:text-lg font-medium">
                    Virtual Capacity *
                  </Label>
                  <Input
                    id="virtualCapacity"
                    type="number"
                    min="1"
                    max="10000"
                    className="mt-2 text-base"
                    value={newEvent.maxAttendees.virtual || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Only allow numbers
                      if (value === '' || /^\d+$/.test(value)) {
                        setNewEvent({
                          ...newEvent,
                          maxAttendees: {
                            ...newEvent.maxAttendees,
                            virtual: value === '' ? 0 : parseInt(value),
                          },
                        });
                      }
                    }}
                    onKeyPress={(e) => {
                      // Prevent non-numeric characters
                      if (!/\d/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab' && e.key !== 'Enter') {
                        e.preventDefault();
                      }
                    }}
                    placeholder="Enter virtual capacity (numbers only)"
                  />
                  {errors.virtualCapacity && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.virtualCapacity}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Equipment (Add/Remove) */}
            <div className="space-y-3 sm:space-y-4 border-t pt-4 sm:pt-6 mt-4 sm:mt-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800">Equipment</h3>
              {newEvent.equipment.map((eq, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg"
                >
                  <Input
                    type="text"
                    value={eq.name}
                    onChange={(e) => {
                      const updatedEquipment = [...newEvent.equipment];
                      updatedEquipment[index].name = e.target.value;
                      setNewEvent({ ...newEvent, equipment: updatedEquipment });
                    }}
                    placeholder="Equipment Name"
                    className="flex-grow text-base"
                  />
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={`required-${index}`}
                      checked={eq.required}
                      onCheckedChange={(checked) => {
                        const updatedEquipment = [...newEvent.equipment];
                        updatedEquipment[index].required = !!checked;
                        setNewEvent({
                          ...newEvent,
                          equipment: updatedEquipment,
                        });
                      }}
                    />
                    <Label htmlFor={`required-${index}`} className="text-base">
                      Required
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={`provided-${index}`}
                      checked={eq.provided}
                      onCheckedChange={(checked) => {
                        const updatedEquipment = [...newEvent.equipment];
                        updatedEquipment[index].provided = !!checked;
                        setNewEvent({
                          ...newEvent,
                          equipment: updatedEquipment,
                        });
                      }}
                    />
                    <Label htmlFor={`provided-${index}`} className="text-base">
                      Provided
                    </Label>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      const updatedEquipment = newEvent.equipment.filter(
                        (_, i) => i !== index
                      );
                      setNewEvent({ ...newEvent, equipment: updatedEquipment });
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() =>
                  setNewEvent({
                    ...newEvent,
                    equipment: [
                      ...newEvent.equipment,
                      {
                        id: Date.now().toString(),
                        name: "",
                        required: false,
                        provided: false,
                      },
                    ],
                  })
                }
                className="w-full text-blue-600 border-blue-600 hover:bg-blue-50"
              >
                Add Equipment
              </Button>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              onClick={onSubmit}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-cyan-600 transition-all duration-300"
            >
              Create Event
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Join Event Modal */}
      {/* Added AnimatePresence and motion.div for modal */}
      <AnimatePresence>
        {showJoinModal && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowJoinModal(false)}
          >
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setShowJoinModal(false)}
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 hover:scale-110 transition-transform"
                aria-label="Close modal"
              >
                <CloseIcon className="w-8 h-8" />
              </button>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                Confirm Join
              </h2>
              <div className="py-4 text-center">
                {joiningEventType === "waitlist" ? (
                  <p className="text-lg text-gray-700">
                    This event is at full capacity. Do you want to join the
                    waitlist?
                  </p>
                ) : (
                  <p className="text-lg text-gray-700">
                    Are you sure you want to join this event{" "}
                    <span className="font-bold text-blue-600">
                      {joiningEventType === "in-person"
                        ? "(In-person)"
                        : "(Virtual)"}
                    </span>
                    ?
                  </p>
                )}
              </div>
              <div className="flex justify-around gap-4 mt-4">
                <Button
                  onClick={() => setShowJoinModal(false)}
                  className="flex-1 py-3 bg-gray-300 text-gray-800 font-bold rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </Button>
                <Button
                  onClick={joinEvent}
                  className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Confirm
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feedback Modal */}
      {/* Added AnimatePresence and motion.div for modal */}
      <AnimatePresence>
        {showFeedbackModal && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowFeedbackModal(false)}
          >
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 hover:scale-110 transition-transform"
                aria-label="Close feedback modal"
              >
                <CloseIcon className="w-8 h-8" />
              </button>
              <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                Give Feedback
              </h2>
              <div className="space-y-6">
                <div>
                  <Label
                    htmlFor="feedback-name"
                    className="text-lg font-medium mb-2 block"
                  >
                    Your Name *
                  </Label>
                  <input
                    id="feedback-name"
                    type="text"
                    className="w-full p-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent text-base"
                    value={feedbackUserName}
                    onChange={(e) => setFeedbackUserName(e.target.value)}
                    placeholder="Enter your name..."
                  />
                </div>
                <div>
                  <Label
                    htmlFor="rating"
                    className="text-lg font-medium mb-2 block"
                  >
                    Overall Rating *
                  </Label>
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-10 h-10 cursor-pointer transition-colors ${
                          star <= feedbackRating
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                        onClick={() => setFeedbackRating(star)}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <Label
                    htmlFor="comment"
                    className="text-lg font-medium mb-2 block"
                  >
                    Comments (Optional)
                  </Label>
                  <textarea
                    id="comment"
                    className="w-full p-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent text-base"
                    rows={4}
                    value={feedbackComment}
                    onChange={(e) => setFeedbackComment(e.target.value)}
                    placeholder="Share your thoughts about the event..."
                  ></textarea>
                  {feedbackComment.trim() && (
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-sm text-gray-600">Sentiment Analysis:</span>
                      <span className={`text-sm font-medium ${
                        analyzeSentiment(feedbackComment) === "positive" ? "text-green-600" :
                        analyzeSentiment(feedbackComment) === "negative" ? "text-red-600" : "text-yellow-600"
                      }`}>
                        <div className="flex items-center gap-1">
                          {analyzeSentiment(feedbackComment) === "positive" ? <PositiveIcon className="w-4 h-4" /> :
                           analyzeSentiment(feedbackComment) === "negative" ? <NegativeIcon className="w-4 h-4" /> : <NeutralIcon className="w-4 h-4" />}
                          {analyzeSentiment(feedbackComment) === "positive" ? "Positive" :
                           analyzeSentiment(feedbackComment) === "negative" ? "Negative" : "Neutral"}
                        </div>
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleSubmitFeedback}
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-cyan-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!feedbackUserName.trim() || feedbackRating === 0}
              >
                Submit Feedback
              </button>
              {(!feedbackUserName.trim() || feedbackRating === 0) && (
                <p className="text-sm text-gray-500 text-center mt-2">
                  Please fill in your name and select a rating.
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Minimal Concise Footer */}
      <footer className="text-white/80 text-sm py-4" style={{ backgroundColor: colors.neutral }}>
        <div className="container mx-auto px-4 flex items-center justify-center">
          © 2025 HybridHub Meetups. All rights reserved.
        </div>
      </footer>

      {/* Video Call Modal */}
      <VideoCallModal 
        isOpen={showVideoCall}
        onClose={() => setShowVideoCall(false)}
        eventTitle={videoCallEvent?.title || ''}
      />
    </div>
  );
}