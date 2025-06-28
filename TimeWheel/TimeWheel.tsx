import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';

// --- TYPE DEFINITIONS ---
interface Activity {
  id: string;
  name: string;
  hours: number;
  color: string;
}

interface Point {
  x: number;
  y: number;
}

// --- COLOR PALETTE ---
const PALETTE = {
  YELLOW: '#F2C57C',
  TAN: '#DDAE7E',
  GREEN: '#7FB685',
  DARK_GREEN: '#426A5A',
  RED: '#EF6F6C',
};

// --- INITIAL DATA ---
const initialIdealData: Activity[] = [
  { id: '1', name: 'Sleep', hours: 8, color: PALETTE.DARK_GREEN },
  { id: '2', name: 'Deep Work', hours: 4, color: PALETTE.GREEN },
  { id: '3', name: 'Lunch & Break', hours: 1.5, color: PALETTE.TAN },
  { id: '4', name: 'Shallow Work', hours: 3, color: PALETTE.YELLOW },
  { id: '5', name: 'Exercise', hours: 1, color: PALETTE.RED },
  { id: '6', name: 'Dinner & Family', hours: 2.5, color: PALETTE.DARK_GREEN },
  { id: '7', name: 'Leisure', hours: 4, color: PALETTE.TAN },
];

const initialActualData: Activity[] = [
  { id: '1', name: 'Sleep', hours: 7, color: PALETTE.DARK_GREEN },
  { id: '2', name: 'Deep Work', hours: 2, color: PALETTE.GREEN },
  { id: '3', name: 'Lunch & Break', hours: 1, color: PALETTE.TAN },
  { id: '4', name: 'Meetings & Email', hours: 5, color: PALETTE.YELLOW },
  { id: '5', name: 'Commute', hours: 1.5, color: PALETTE.RED },
  { id: '6', name: 'Dinner & Family', hours: 2, color: PALETTE.DARK_GREEN },
  { id: '7', name: 'Leisure', hours: 5.5, color: PALETTE.TAN },
];

// --- HELPER FUNCTIONS ---

// Converts polar coordinates (angle, radius) to Cartesian coordinates (x, y)
const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number): Point => {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
};

// Describes an SVG arc path
const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number): string => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
};

// Formats hours into a more readable string (e.g., 2.5 -> 2h 30m)
const formatHours = (hours: number): string => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    if (m === 0) return `${h}h`;
    if (h === 0) return `${m}m`;
    return `${h}h ${m}m`;
};


// --- MAIN COMPONENT: TimeWheel ---
const TimeWheel: React.FC = () => {
    const [idealActivities, setIdealActivities] = useState<Activity[]>(initialIdealData);
    const [actualActivities, setActualActivities] = useState<Activity[]>(initialActualData);
    const [isComparisonMode, setIsComparisonMode] = useState<boolean>(false);
    const [activeSet, setActiveSet] = useState<'ideal' | 'actual'>('ideal');

    const [hoveredSegment, setHoveredSegment] = useState<Activity | null>(null);
    const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
    
    const svgRef = useRef<SVGSVGElement>(null);

    // Determine which dataset to use based on active set
    const activities = activeSet === 'ideal' ? idealActivities : actualActivities;
    const comparisonActivities = activeSet === 'ideal' ? actualActivities : idealActivities;
    const setActivities = activeSet === 'ideal' ? setIdealActivities : setActualActivities;

    // Calculate segment angles and positions for the wheel
    const segments = useMemo(() => {
        let cumulativeAngle = 0;
        const totalHours = 24;

        return activities.map((activity, index) => {
            // Convert hours to degrees (360° = 24 hours)
            const angle = (activity.hours / totalHours) * 360;
            const startAngle = cumulativeAngle;
            const endAngle = cumulativeAngle + angle;
            cumulativeAngle = endAngle;

            // Calculate comparison angle for inner ring
            const comparisonHours = comparisonActivities[index]?.hours || 0;
            const comparisonAngle = (comparisonHours / totalHours) * 360;

            return { ...activity, startAngle, endAngle, comparisonAngle };
        });
    }, [activities, comparisonActivities]);
    
    // --- DRAG HANDLING LOGIC ---
    // Convert mouse position to angle for drag calculations
    const getAngleFromPoint = useCallback((point: Point) => {
        if (!svgRef.current) return 0;
        const svgRect = svgRef.current.getBoundingClientRect();
        const svgSize = svgRect.width;
        const center = { x: svgSize / 2, y: svgSize / 2 };

        const dx = point.x - center.x;
        const dy = point.y - center.y;
        
        // Convert to degrees with 0° at top (12 o'clock)
        let angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
        if (angle < 0) angle += 360;
        return angle;
    }, []);
    
    const handleDragStart = (e: React.MouseEvent<SVGCircleElement> | React.TouchEvent<SVGCircleElement>, index: number) => {
        e.preventDefault();
        setDraggingIndex(index);
    };

    const handleDragMove = useCallback((e: MouseEvent | TouchEvent) => {
        if (draggingIndex === null) return;
        
        e.preventDefault();

        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

        if (!svgRef.current) return;
        const svgRect = svgRef.current.getBoundingClientRect();
        const point = { x: clientX - svgRect.left, y: clientY - svgRect.top };
        
        const currentAngle = getAngleFromPoint(point);
        
        const draggedSegment = segments[draggingIndex];
        const prevSegmentIndex = (draggingIndex - 1 + segments.length) % segments.length;
        const prevSegment = segments[prevSegmentIndex];

        // Normalize angle difference to prevent jumps
        let angleDiff = currentAngle - draggedSegment.startAngle;
        if (angleDiff < -180) angleDiff += 360;
        if (angleDiff > 180) angleDiff -= 360;
        
        // Convert angle change to hours
        let hoursChange = (angleDiff / 360) * 24;
        
        const MIN_HOURS = 0.25; // 15 minutes minimum segment
        const newPrevHours = prevSegment.hours + hoursChange;
        const newDraggedHours = draggedSegment.hours - hoursChange;

        // Prevent segments from becoming too small
        if (newPrevHours < MIN_HOURS || newDraggedHours < MIN_HOURS) return;
        
        const newActivities = [...activities];
        newActivities[prevSegmentIndex] = { ...newActivities[prevSegmentIndex], hours: newPrevHours };
        newActivities[draggingIndex] = { ...newActivities[draggingIndex], hours: newDraggedHours };
        
        setActivities(newActivities);

    }, [draggingIndex, segments, activities, getAngleFromPoint, setActivities]);

    const handleDragEnd = useCallback(() => {
        setDraggingIndex(null);
    }, []);

    useEffect(() => {
        if (draggingIndex !== null) {
            window.addEventListener('mousemove', handleDragMove);
            window.addEventListener('mouseup', handleDragEnd);
            window.addEventListener('touchmove', handleDragMove, { passive: false });
            window.addEventListener('touchend', handleDragEnd);
        }

        return () => {
            window.removeEventListener('mousemove', handleDragMove);
            window.removeEventListener('mouseup', handleDragEnd);
            window.removeEventListener('touchmove', handleDragMove);
            window.removeEventListener('touchend', handleDragEnd);
        };
    }, [draggingIndex, handleDragMove, handleDragEnd]);


    // --- RENDER CONSTANTS ---
    const SVG_SIZE = 500;
    const CENTER = SVG_SIZE / 2;
    const STROKE_WIDTH = SVG_SIZE * 0.12;
    const RADIUS = SVG_SIZE * 0.35;
    const HANDLE_RADIUS = 10;

    // Priority: hovered > dragging > default for center display
    const displayedInfo = hoveredSegment || 
        (draggingIndex !== null ? segments[draggingIndex] : null) || 
        (isComparisonMode ? null : segments[0]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gray-100 p-3 sm:p-5 box-border font-sans">
            <div className="flex flex-col lg:flex-row items-center gap-5 lg:gap-10 w-full max-w-6xl">
                <div className="relative w-full max-w-md sm:max-w-lg lg:flex-1 lg:max-w-2xl min-w-[280px] aspect-square p-4">
                    <svg 
                        ref={svgRef}
                        viewBox="0 0 400 400" 
                        className="w-full h-full"
                        style={{ filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.1))' }}
                    >
                        <defs>
                            <filter id="soft-glow" x="-50%" y="-50%" width="200%" height="200%">
                                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                                <feMerge> 
                                    <feMergeNode in="coloredBlur"/>
                                    <feMergeNode in="SourceGraphic"/>
                                </feMerge>
                            </filter>
                            <filter id="hover-glow" x="-50%" y="-50%" width="200%" height="200%">
                                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                                <feMerge> 
                                    <feMergeNode in="coloredBlur"/>
                                    <feMergeNode in="SourceGraphic"/>
                                </feMerge>
                            </filter>
                        </defs>
                        
                        {/* Activity Segments */}
                        {segments.map((segment, index) => {
                            const startAngle = segment.startAngle;
                            const endAngle = segment.endAngle;
                            const outerRadius = 160;
                            const innerRadius = 80;
                            
                            // Convert degrees to radians (subtract 90° to start at top)
                            const startAngleRad = (startAngle - 90) * Math.PI / 180;
                            const endAngleRad = (endAngle - 90) * Math.PI / 180;
                            
                            const x1 = 200 + outerRadius * Math.cos(startAngleRad);
                            const y1 = 200 + outerRadius * Math.sin(startAngleRad);
                            const x2 = 200 + outerRadius * Math.cos(endAngleRad);
                            const y2 = 200 + outerRadius * Math.sin(endAngleRad);
                            
                            const x3 = 200 + innerRadius * Math.cos(endAngleRad);
                            const y3 = 200 + innerRadius * Math.sin(endAngleRad);
                            const x4 = 200 + innerRadius * Math.cos(startAngleRad);
                            const y4 = 200 + innerRadius * Math.sin(startAngleRad);
                            
                            const largeArc = endAngle - startAngle > 180 ? 1 : 0;
                            
                            // Create SVG path for donut segment
                            const pathData = [
                                `M ${x1} ${y1}`,                                           // Move to start
                                `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2}`, // Outer arc
                                `L ${x3} ${y3}`,                                           // Line to inner
                                `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4}`, // Inner arc (reverse)
                                'Z'                                                        // Close path
                            ].join(' ');
                            
                            // Handle position for dragging
                            const handleAngle = startAngle;
                            const handleAngleRad = (handleAngle - 90) * Math.PI / 180;
                            const handleRadius = outerRadius + 15;
                            const handleX = 200 + handleRadius * Math.cos(handleAngleRad);
                            const handleY = 200 + handleRadius * Math.sin(handleAngleRad);
                            
                                                            return (
                                    <g key={segment.id}>
                                        {/* Comparison ring (inner) - render first so it's behind */}
                                        {isComparisonMode && comparisonActivities[index] && (
                                        (() => {
                                            const compActivity = comparisonActivities[index];
                                            const compAngle = (compActivity.hours / 24) * 360;
                                            const compStartAngle = comparisonActivities.slice(0, index).reduce((acc, act) => acc + (act.hours / 24) * 360, 0);
                                            const compEndAngle = compStartAngle + compAngle;
                                            
                                            const compStartRad = (compStartAngle - 90) * Math.PI / 180;
                                            const compEndRad = (compEndAngle - 90) * Math.PI / 180;
                                            
                                            const compOuterRadius = 75;
                                            const compInnerRadius = 35;
                                            
                                            const cx1 = 200 + compOuterRadius * Math.cos(compStartRad);
                                            const cy1 = 200 + compOuterRadius * Math.sin(compStartRad);
                                            const cx2 = 200 + compOuterRadius * Math.cos(compEndRad);
                                            const cy2 = 200 + compOuterRadius * Math.sin(compEndRad);
                                            
                                            const cx3 = 200 + compInnerRadius * Math.cos(compEndRad);
                                            const cy3 = 200 + compInnerRadius * Math.sin(compEndRad);
                                            const cx4 = 200 + compInnerRadius * Math.cos(compStartRad);
                                            const cy4 = 200 + compInnerRadius * Math.sin(compStartRad);
                                            
                                            const compLargeArc = compAngle > 180 ? 1 : 0;
                                            
                                            const compPath = [
                                                `M ${cx1} ${cy1}`,
                                                `A ${compOuterRadius} ${compOuterRadius} 0 ${compLargeArc} 1 ${cx2} ${cy2}`,
                                                `L ${cx3} ${cy3}`,
                                                `A ${compInnerRadius} ${compInnerRadius} 0 ${compLargeArc} 0 ${cx4} ${cy4}`,
                                                'Z'
                                            ].join(' ');
                                            
                                                                                            return (
                                                    <path
                                                        d={compPath}
                                                        fill={compActivity.color}
                                                        stroke="rgba(255,255,255,0.3)"
                                                        strokeWidth="1"
                                                        opacity="0.7"
                                                        style={{ pointerEvents: 'none' }}
                                                    />
                                                );
                                            })()
                                        )}
                                        
                                        {/* Main segment - render on top for proper hover detection */}
                                        <path
                                            d={pathData}
                                            fill={segment.color}
                                            stroke="rgba(255,255,255,0.2)"
                                            strokeWidth="1"
                                            style={{ 
                                                filter: hoveredSegment?.id === segment.id ? 'url(#hover-glow)' : 'url(#soft-glow)',
                                                transition: 'opacity 0.2s ease, filter 0.2s ease',
                                                transform: hoveredSegment?.id === segment.id ? 'scale(1.02)' : 'scale(1)',
                                                transformOrigin: 'center'
                                            }}
                                            onMouseEnter={() => setHoveredSegment(segment)}
                                            onMouseLeave={() => setHoveredSegment(null)}
                                            className="cursor-pointer"
                                        />
                                    
                                                                            {/* Drag handle */}
                                        {!isComparisonMode && (
                                            <circle
                                                cx={handleX}
                                                cy={handleY}
                                                r="8"
                                                fill="white"
                                                stroke={segment.color}
                                                strokeWidth="3"
                                                className="cursor-ew-resize hover:stroke-4 transition-all duration-200"
                                                style={{ 
                                                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                                                }}
                                                onMouseDown={(e) => handleDragStart(e, index)}
                                                onTouchStart={(e) => handleDragStart(e, index)}
                                            />
                                        )}
                                </g>
                            );
                        })}
                        
                        {/* Center circle */}
                        <circle 
                            cx="200" 
                            cy="200" 
                            r={isComparisonMode ? "40" : "75"}
                            fill="white" 
                            stroke="rgba(0,0,0,0.1)"
                            strokeWidth="1"
                            style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.1))' }}
                        />
                    </svg>
                    
                    {/* Center Information Display */}
                    <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none ${
                        isComparisonMode ? 'px-2 py-1 max-w-20 sm:max-w-24' : 'px-2 py-2'
                    }`}>
                        {displayedInfo ? (
                            <>
                                <h3 className={`font-semibold text-gray-800 mb-0.5 leading-tight ${
                                    isComparisonMode 
                                        ? 'text-xs sm:text-sm' 
                                        : 'text-xs sm:text-sm md:text-base lg:text-lg'
                                }`}
                                style={isComparisonMode ? { 
                                    fontSize: window.innerWidth <= 640 ? '10px' : undefined // Smaller text on mobile
                                } : {}}>
                                    {isComparisonMode 
                                        ? (displayedInfo.name.length > 8 
                                            ? displayedInfo.name.substring(0, 6) + '...' 
                                            : displayedInfo.name)
                                        : displayedInfo.name}
                                </h3>
                                
                                {isComparisonMode && hoveredSegment ? (
                                    // Show both values when hovering in comparison mode
                                    (() => {
                                        const segmentIndex = segments.findIndex(s => s.id === hoveredSegment.id);
                                        const currentData = activities[segmentIndex];
                                        const comparisonData = comparisonActivities[segmentIndex];
                                        
                                        return (
                                            <>
                                                <p className="text-xs text-gray-600 mb-0.5 leading-tight" style={{ 
                                                    fontSize: window.innerWidth <= 640 ? '9px' : undefined 
                                                }}>
                                                    {activeSet === 'ideal' ? 'Ideal' : 'Actual'}: {formatHours(currentData?.hours || 0)}
                                                </p>
                                                <p className="text-xs text-gray-600 leading-tight" style={{ 
                                                    fontSize: window.innerWidth <= 640 ? '9px' : undefined 
                                                }}>
                                                    {activeSet === 'ideal' ? 'Actual' : 'Ideal'}: {formatHours(comparisonData?.hours || 0)}
                                                </p>
                                            </>
                                        );
                                    })()
                                ) : (
                                    // Show single value in normal mode or when dragging
                                    <>
                                        <p className={`text-gray-600 mb-0.5 ${
                                            isComparisonMode 
                                                ? 'text-xs sm:text-xs' 
                                                : 'text-xs sm:text-sm md:text-base'
                                        }`}>
                                            {formatHours(displayedInfo.hours)}
                                        </p>
                                        <p className={`text-gray-500 ${
                                            isComparisonMode 
                                                ? 'text-xs sm:text-xs' 
                                                : 'text-xs sm:text-sm md:text-base'
                                        }`}>
                                            {((displayedInfo.hours / 24) * 100).toFixed(1)}%
                                        </p>
                                    </>
                                )}
                                
                                {draggingIndex !== null && !isComparisonMode && (
                                    <p className="text-xs text-blue-600 mt-0.5 animate-pulse">
                                        Adjusting...
                                    </p>
                                )}
                            </>
                        ) : isComparisonMode ? (
                            <>
                                <h3 className="text-xs sm:text-sm font-semibold text-gray-700 leading-tight mb-0.5" style={{ 
                                    fontSize: window.innerWidth <= 640 ? '10px' : undefined 
                                }}>Compare</h3>
                                <p className="text-xs text-gray-500 leading-tight" style={{ 
                                    fontSize: window.innerWidth <= 640 ? '9px' : undefined 
                                }}>Outer: {activeSet === 'ideal' ? 'Ideal' : 'Actual'}</p>
                                <p className="text-xs text-gray-500 leading-tight" style={{ 
                                    fontSize: window.innerWidth <= 640 ? '9px' : undefined 
                                }}>Inner: {activeSet === 'ideal' ? 'Actual' : 'Ideal'}</p>
                            </>
                        ) : (
                            <>
                                <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-gray-700 leading-tight">24 Hours</h3>
                                <p className="text-xs sm:text-xs md:text-sm text-gray-500">Drag handles to adjust</p>
                            </>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-4 w-full max-w-md lg:max-w-sm lg:w-80">
                    <div className="bg-white p-4 sm:p-5 rounded-xl shadow-sm">
                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                           <span className="text-sm sm:text-base text-gray-700">Comparison Mode</span>
                                                            <button
                                onClick={() => setIsComparisonMode(prev => !prev)}
                                className={`px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-md text-xs sm:text-sm transition-all duration-200 ease-in-out transform ${
                                    isComparisonMode 
                                        ? 'bg-[#426A5A] text-white border-[#426A5A] hover:bg-[#355248] hover:scale-105' 
                                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:border-gray-400 hover:scale-105'
                                }`}
                            >
                                {isComparisonMode ? 'ON' : 'OFF'}
                            </button>
                        </div>
                        {!isComparisonMode && (
                            <div className="flex flex-col sm:flex-row gap-2">
                                <button
                                    className={`flex-1 px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-md text-xs sm:text-sm transition-all duration-200 ease-in-out transform ${
                                        activeSet === 'ideal' 
                                            ? 'bg-[#426A5A] text-white border-[#426A5A] hover:bg-[#355248] hover:scale-105' 
                                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:border-gray-400 hover:scale-105 hover:shadow-md'
                                    }`}
                                    onClick={() => setActiveSet('ideal')}
                                >
                                    Edit Ideal Day
                                </button>
                                <button
                                    className={`flex-1 px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-md text-xs sm:text-sm transition-all duration-200 ease-in-out transform ${
                                        activeSet === 'actual' 
                                            ? 'bg-[#426A5A] text-white border-[#426A5A] hover:bg-[#355248] hover:scale-105' 
                                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:border-gray-400 hover:scale-105 hover:shadow-md'
                                    }`}
                                    onClick={() => setActiveSet('actual')}
                                >
                                    Edit Actual Day
                                </button>
                            </div>
                        )}
                    </div>

                                        <div className="bg-white p-4 sm:p-5 rounded-xl shadow-sm">
                        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-800">
                            {isComparisonMode ? "Ideal Day Legend" : `${activeSet === 'ideal' ? 'Ideal' : 'Actual'} Day Legend`}
                        </h3>
                        <div className="space-y-2 sm:space-y-3">
                            {activities.map(activity => (
                                <div key={activity.id} className="flex items-center">
                                    <div 
                                        className="w-4 h-4 sm:w-5 sm:h-5 rounded-sm mr-2 sm:mr-3 flex-shrink-0" 
                                        style={{ backgroundColor: activity.color }}
                                    />
                                    <span className="text-gray-700 text-xs sm:text-sm">
                                        {activity.name} - {formatHours(activity.hours)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// To use this component, you can render it inside your main App component like this:
export default function App() {
    return <TimeWheel />;
}