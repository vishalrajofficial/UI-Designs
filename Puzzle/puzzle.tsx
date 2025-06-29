import React, { useState, useEffect, useCallback, useMemo } from 'react';

// Tile types - represent different circuit pieces
enum TileType {
  Empty = 0,
  Straight = 1,    // —— or ||
  Corner = 2,      // L-shaped
  TJunction = 3,   // T-shaped
  Cross = 4,       // + shaped
  Start = 5,       // Starting point
  End = 6,         // Ending point
}

// Direction enum for tile connections
enum Direction {
  North = 0,
  East = 1,
  South = 2,
  West = 3,
}

interface Tile {
  type: TileType;
  rotation: number; // 0, 90, 180, 270 degrees
  connections: Direction[]; // Which directions this tile connects to
  locked: boolean; // For start/end tiles
}

interface Position {
  row: number;
  col: number;
}

const CircuitPuzzle: React.FC = () => {
  const [grid, setGrid] = useState<Tile[][]>([]);
  const [gridSize] = useState({ rows: 7, cols: 7 });
  const [isCompleted, setIsCompleted] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [startPos, setStartPos] = useState<Position>({ row: 0, col: 0 });
  const [endPos, setEndPos] = useState<Position>({ row: 6, col: 6 });
  const [animatingTiles, setAnimatingTiles] = useState<Set<string>>(new Set());
  const [connectedPath, setConnectedPath] = useState<Set<string>>(new Set());

  // Get connections for each tile type based on rotation
  const getConnections = (type: TileType, rotation: number): Direction[] => {
    const baseConnections: Record<TileType, Direction[]> = {
      [TileType.Empty]: [],
      [TileType.Straight]: [Direction.East, Direction.West],
      [TileType.Corner]: [Direction.North, Direction.East],
      [TileType.TJunction]: [Direction.North, Direction.East, Direction.West],
      [TileType.Cross]: [Direction.North, Direction.East, Direction.South, Direction.West],
      [TileType.Start]: [Direction.East],
      [TileType.End]: [Direction.West],
    };

    const connections = baseConnections[type] || [];
    
    // Rotate connections based on rotation angle
    const rotationSteps = rotation / 90;
    return connections.map(dir => (dir + rotationSteps) % 4);
  };

  // Initialize grid with guaranteed solvable puzzle
  const initializeGrid = useCallback(() => {
    const newGrid: Tile[][] = [];
    
    // Step 1: Initialize empty grid
    for (let row = 0; row < gridSize.rows; row++) {
      newGrid[row] = [];
      for (let col = 0; col < gridSize.cols; col++) {
        newGrid[row][col] = {
          type: TileType.Empty,
          rotation: 0,
          connections: [],
          locked: false,
        };
      }
    }
    
    // Step 2: Create a guaranteed working path from start to end
    const createSolutionPath = () => {
      // Set start tile
      newGrid[startPos.row][startPos.col] = {
        type: TileType.Start,
        rotation: 0, // Will be set based on path direction
        connections: [],
        locked: false,
      };
      
      // Set end tile
      newGrid[endPos.row][endPos.col] = {
        type: TileType.End,
        rotation: 0, // Will be set based on path direction
        connections: [],
        locked: false,
      };
      
      // Create L-shaped path: horizontal first, then vertical
      const pathTiles: Position[] = [];
      
      // Horizontal segment
      const minCol = Math.min(startPos.col, endPos.col);
      const maxCol = Math.max(startPos.col, endPos.col);
      for (let col = minCol + 1; col < maxCol; col++) {
        pathTiles.push({ row: startPos.row, col });
        newGrid[startPos.row][col] = {
          type: TileType.Straight,
          rotation: 0, // Horizontal
          connections: getConnections(TileType.Straight, 0),
          locked: false,
        };
      }
      
      // Corner tile (if needed)
      if (startPos.row !== endPos.row && startPos.col !== endPos.col) {
        const cornerRow = startPos.row;
        const cornerCol = endPos.col;
        pathTiles.push({ row: cornerRow, col: cornerCol });
        
        // Determine corner rotation
        let cornerRotation = 0;
        if (endPos.row > startPos.row) {
          cornerRotation = 180; // Turn from west to south
        } else {
          cornerRotation = 90; // Turn from west to north
        }
        
        newGrid[cornerRow][cornerCol] = {
          type: TileType.Corner,
          rotation: cornerRotation,
          connections: getConnections(TileType.Corner, cornerRotation),
          locked: false,
        };
      }
      
      // Vertical segment
      const minRow = Math.min(startPos.row, endPos.row);
      const maxRow = Math.max(startPos.row, endPos.row);
      for (let row = minRow + 1; row < maxRow; row++) {
        pathTiles.push({ row, col: endPos.col });
        newGrid[row][endPos.col] = {
          type: TileType.Straight,
          rotation: 90, // Vertical
          connections: getConnections(TileType.Straight, 90),
          locked: false,
        };
      }
      
      // Set start tile direction
      if (startPos.row === endPos.row) {
        // Same row - point horizontally
        newGrid[startPos.row][startPos.col].rotation = startPos.col < endPos.col ? 0 : 180;
      } else if (startPos.col === endPos.col) {
        // Same column - point vertically
        newGrid[startPos.row][startPos.col].rotation = startPos.row < endPos.row ? 90 : 270;
      } else {
        // L-shaped - start pointing right
        newGrid[startPos.row][startPos.col].rotation = 0;
      }
      newGrid[startPos.row][startPos.col].connections = getConnections(
        TileType.Start, 
        newGrid[startPos.row][startPos.col].rotation
      );
      
      // Set end tile direction
      if (startPos.row === endPos.row) {
        // Same row - receive horizontally
        newGrid[endPos.row][endPos.col].rotation = startPos.col < endPos.col ? 180 : 0;
      } else if (startPos.col === endPos.col) {
        // Same column - receive vertically
        newGrid[endPos.row][endPos.col].rotation = startPos.row < endPos.row ? 270 : 90;
      } else {
        // L-shaped - end receiving from above/below
        newGrid[endPos.row][endPos.col].rotation = startPos.row < endPos.row ? 270 : 90;
      }
      newGrid[endPos.row][endPos.col].connections = getConnections(
        TileType.End, 
        newGrid[endPos.row][endPos.col].rotation
      );
      
      return pathTiles;
    };
    
    const solutionPath = createSolutionPath();
    const pathSet = new Set(solutionPath.map(p => `${p.row},${p.col}`));
    pathSet.add(`${startPos.row},${startPos.col}`);
    pathSet.add(`${endPos.row},${endPos.col}`);
    
    // Step 3: Fill remaining empty tiles with random types
    for (let row = 0; row < gridSize.rows; row++) {
      for (let col = 0; col < gridSize.cols; col++) {
        if (newGrid[row][col].type === TileType.Empty) {
          // Random tile type distribution
          const rand = Math.random();
          let type: TileType;
          if (rand < 0.4) type = TileType.Straight;
          else if (rand < 0.7) type = TileType.Corner;
          else if (rand < 0.9) type = TileType.TJunction;
          else type = TileType.Cross;
          
          const rotation = Math.floor(Math.random() * 4) * 90;
          newGrid[row][col] = {
            type,
            rotation,
            connections: getConnections(type, rotation),
            locked: false,
          };
        }
      }
    }
    
    // Step 4: Scramble by rotating tiles (but keep solution possible)
    const tilesToScramble: Position[] = [];
    for (let row = 0; row < gridSize.rows; row++) {
      for (let col = 0; col < gridSize.cols; col++) {
        tilesToScramble.push({ row, col });
      }
    }
    
    // Shuffle and rotate 60-80% of tiles
    const shuffled = tilesToScramble.sort(() => Math.random() - 0.5);
    const numToRotate = Math.floor(tilesToScramble.length * (0.6 + Math.random() * 0.2));
    
    for (let i = 0; i < numToRotate; i++) {
      const pos = shuffled[i];
      const tile = newGrid[pos.row][pos.col];
      
      // Rotate 1-3 times (90°, 180°, or 270°)
      const rotations = 1 + Math.floor(Math.random() * 3);
      for (let r = 0; r < rotations; r++) {
        tile.rotation = (tile.rotation + 90) % 360;
        tile.connections = getConnections(tile.type, tile.rotation);
      }
    }
    
    return newGrid;
  }, [gridSize, startPos, endPos, getConnections]);

  // Check if two tiles are connected
  const tilesConnect = (tile1: Tile, pos1: Position, tile2: Tile, pos2: Position): boolean => {
    // Check if tiles are adjacent
    const rowDiff = pos2.row - pos1.row;
    const colDiff = pos2.col - pos1.col;
    
    if (Math.abs(rowDiff) + Math.abs(colDiff) !== 1) return false;
    
    let dir1ToDir2: Direction;
    let dir2ToDir1: Direction;
    
    if (rowDiff === -1) {
      dir1ToDir2 = Direction.North;
      dir2ToDir1 = Direction.South;
    } else if (rowDiff === 1) {
      dir1ToDir2 = Direction.South;
      dir2ToDir1 = Direction.North;
    } else if (colDiff === -1) {
      dir1ToDir2 = Direction.West;
      dir2ToDir1 = Direction.East;
    } else {
      dir1ToDir2 = Direction.East;
      dir2ToDir1 = Direction.West;
    }
    
    return tile1.connections.includes(dir1ToDir2) && tile2.connections.includes(dir2ToDir1);
  };

  // Check if there's a path from start to end and track the path
  const checkCompletionAndPath = useCallback(() => {
    const visited = new Set<string>();
    const parent = new Map<string, string>();
    const queue: Position[] = [startPos];
    const startKey = `${startPos.row},${startPos.col}`;
    visited.add(startKey);
    
    while (queue.length > 0) {
      const current = queue.shift()!;
      const currentKey = `${current.row},${current.col}`;
      
      // Check if we reached the end
      if (current.row === endPos.row && current.col === endPos.col) {
        // Reconstruct path
        const path = new Set<string>();
        let key = currentKey;
        while (key) {
          path.add(key);
          key = parent.get(key) || '';
        }
        return { completed: true, path };
      }
      
      // Check all adjacent tiles
      const directions = [
        { row: -1, col: 0 },
        { row: 1, col: 0 },
        { row: 0, col: -1 },
        { row: 0, col: 1 },
      ];
      
      for (const dir of directions) {
        const newRow = current.row + dir.row;
        const newCol = current.col + dir.col;
        const key = `${newRow},${newCol}`;
        
        if (
          newRow >= 0 && newRow < gridSize.rows &&
          newCol >= 0 && newCol < gridSize.cols &&
          !visited.has(key)
        ) {
          const currentTile = grid[current.row][current.col];
          const nextTile = grid[newRow][newCol];
          
          if (tilesConnect(currentTile, current, nextTile, { row: newRow, col: newCol })) {
            visited.add(key);
            parent.set(key, currentKey);
            queue.push({ row: newRow, col: newCol });
          }
        }
      }
    }
    
    return { completed: false, path: new Set<string>() };
  }, [grid, startPos, endPos, gridSize]);

  // Rotate a tile
  const rotateTile = (row: number, col: number) => {
    if (showSolution) return;
    
    const key = `${row},${col}`;
    setAnimatingTiles(prev => new Set(prev).add(key));
    
    setTimeout(() => {
      setAnimatingTiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(key);
        return newSet;
      });
    }, 300);
    
    setGrid(prevGrid => {
      const newGrid = [...prevGrid];
      const tile = { ...newGrid[row][col] };
      tile.rotation = (tile.rotation + 90) % 360;
      tile.connections = getConnections(tile.type, tile.rotation);
      newGrid[row][col] = tile;
      return newGrid;
    });
  };

  // Async solution generator to prevent UI freezing
  const generateSolution = async (): Promise<Tile[][]> => {
    const cloneGrid = (grid: Tile[][]): Tile[][] =>
      grid.map(row => row.map(tile => ({ ...tile })));

    const testGrid = cloneGrid(grid);
    const maxAttempts = 1000;
    let attempt = 0;

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const checkPathExists = (testGrid: Tile[][]): boolean => {
      const visited = new Set<string>();
      const queue: Position[] = [startPos];
      visited.add(`${startPos.row},${startPos.col}`);

      while (queue.length > 0) {
        const current = queue.shift()!;
        if (current.row === endPos.row && current.col === endPos.col) return true;

        const directions = [
          { row: -1, col: 0 },
          { row: 1, col: 0 },
          { row: 0, col: -1 },
          { row: 0, col: 1 },
        ];

        for (const dir of directions) {
          const newRow = current.row + dir.row;
          const newCol = current.col + dir.col;
          const key = `${newRow},${newCol}`;

          if (
            newRow >= 0 && newRow < gridSize.rows &&
            newCol >= 0 && newCol < gridSize.cols &&
            !visited.has(key)
          ) {
            const currentTile = testGrid[current.row][current.col];
            const nextTile = testGrid[newRow][newCol];

            if (tilesConnect(currentTile, current, nextTile, { row: newRow, col: newCol })) {
              visited.add(key);
              queue.push({ row: newRow, col: newCol });
            }
          }
        }
      }

      return false;
    };

    // Async brute-force loop with yielding
    while (attempt < maxAttempts) {
      for (let row = 0; row < gridSize.rows; row++) {
        for (let col = 0; col < gridSize.cols; col++) {
          const tile = testGrid[row][col];
          const rotation = Math.floor(Math.random() * 4) * 90;
          tile.rotation = rotation;
          tile.connections = getConnections(tile.type, rotation);
        }
      }

      if (checkPathExists(testGrid)) {
        return testGrid;
      }

      attempt++;

      // Yield every 25 attempts to let UI update
      if (attempt % 25 === 0) {
        await delay(0); // gives control back to the browser
      }
    }

    // If no solution found, return best-effort reset grid
    return testGrid;
  };

  // Randomize the grid
  const randomizeGrid = () => {
    setIsCompleted(false);
    setShowSolution(false);
    setTimer(0);
    setIsTimerRunning(true);
    setGrid(initializeGrid());
  };

  // Toggle solution
  const toggleSolution = async () => {
    if (showSolution) {
      setShowSolution(false);
      randomizeGrid();
    } else {
      setShowSolution(true);
      setIsTimerRunning(false);
      const solved = await generateSolution();
      setGrid(solved);
    }
  };

  // Timer effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (isTimerRunning && !isCompleted) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isTimerRunning, isCompleted]);

  // Check completion effect
  useEffect(() => {
    if (grid.length > 0) {
      const result = checkCompletionAndPath();
      setConnectedPath(result.path);
      if (result.completed) {
        setIsCompleted(true);
        setIsTimerRunning(false);
      } else {
        setIsCompleted(false);
      }
    }
  }, [grid, checkCompletionAndPath]);

  // Initialize grid on mount
  useEffect(() => {
    setGrid(initializeGrid());
  }, [initializeGrid]);

  // Format timer display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Render tile SVG based on type and rotation
  const renderTileSVG = (tile: Tile, row: number, col: number) => {
    const isAnimating = animatingTiles.has(`${row},${col}`);
    const isConnected = connectedPath.has(`${row},${col}`);
    const svgClass = `w-full h-full transition-all duration-500 ease-out ${
      isAnimating ? 'animate-pulse scale-110' : 'scale-100'
    }`;
    
    const pathColor = isConnected 
      ? '#F4A261' // Bright orange for connected paths
      : tile.type === TileType.Start || tile.type === TileType.End 
        ? '#E76F51' 
        : '#E9C46A';
    const strokeWidth = isConnected ? 14 : 12; // Slightly thicker for connected paths
    
    return (
      <div className="w-full h-full relative overflow-hidden">
        <svg
          className={svgClass}
          viewBox="0 0 100 100"
          style={{ 
            transform: `rotate(${tile.rotation}deg)`,
            transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
            filter: isAnimating 
              ? 'drop-shadow(0 0 8px rgba(244, 162, 97, 0.8))' 
              : isConnected 
                ? 'drop-shadow(0 0 6px rgba(244, 162, 97, 0.9)) drop-shadow(0 0 12px rgba(244, 162, 97, 0.5))' 
                : 'none'
          }}
        >
        {tile.type === TileType.Straight && (
          <line x1="0" y1="50" x2="100" y2="50" stroke={pathColor} strokeWidth={strokeWidth} />
        )}
        
        {tile.type === TileType.Corner && (
          <path d="M 50 0 L 50 50 L 100 50" fill="none" stroke={pathColor} strokeWidth={strokeWidth} />
        )}
        
        {tile.type === TileType.TJunction && (
          <>
            <line x1="0" y1="50" x2="100" y2="50" stroke={pathColor} strokeWidth={strokeWidth} />
            <line x1="50" y1="0" x2="50" y2="50" stroke={pathColor} strokeWidth={strokeWidth} />
          </>
        )}
        
        {tile.type === TileType.Cross && (
          <>
            <line x1="0" y1="50" x2="100" y2="50" stroke={pathColor} strokeWidth={strokeWidth} />
            <line x1="50" y1="0" x2="50" y2="100" stroke={pathColor} strokeWidth={strokeWidth} />
          </>
        )}
        
                {tile.type === TileType.Start && (
          <>
            <circle cx="50" cy="50" r="20" fill={pathColor} stroke={isConnected ? '#E9C46A' : 'none'} strokeWidth={isConnected ? 3 : 0} />
            <line x1="50" y1="50" x2="100" y2="50" stroke={pathColor} strokeWidth={strokeWidth} />
            <text x="50" y="55" textAnchor="middle" fill="#264653" fontSize="16" fontWeight="bold">S</text>
          </>
        )}
        
        {tile.type === TileType.End && (
          <>
            <circle cx="50" cy="50" r="20" fill={pathColor} stroke={isConnected ? '#E9C46A' : 'none'} strokeWidth={isConnected ? 3 : 0} />
            <line x1="0" y1="50" x2="50" y2="50" stroke={pathColor} strokeWidth={strokeWidth} />
            <text x="50" y="55" textAnchor="middle" fill="#264653" fontSize="16" fontWeight="bold">E</text>
          </>
        )}
       </svg>
       </div>
     );
   };

  return (
    <div className="min-h-screen bg-[#2A9D8F] flex items-center justify-center p-4 sm:p-6 lg:p-8" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'Source Code Pro', 'Menlo', 'Consolas'" }}>
      <div className="max-w-4xl w-full mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#264653] mb-2 sm:mb-4 tracking-tight">
            Path Puzzle
          </h1>
          <p className="text-[#264653] text-base sm:text-lg px-4 opacity-80">
            Rotate the tiles to connect the path from start to end!
          </p>
        </div>

                {/* Game Info Bar */}
        <div className="bg-[#264653] rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0 shadow-lg border border-[#2A9D8F]/30">
          {/* Cool Digital Timer */}
          <div className="flex items-center gap-3 bg-[#2A9D8F]/20 rounded-lg px-4 py-2 border border-[#2A9D8F]/40">
            <div className="relative">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#E9C46A] animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#F4A261] rounded-full animate-ping"></div>
            </div>
                         <div className="text-[#E9C46A] text-lg sm:text-xl font-bold tracking-wider" style={{ fontFamily: "'Orbitron', 'Exo 2', 'Rajdhani', 'Space Mono', 'Share Tech Mono'" }}>
               {formatTime(timer)}
             </div>
          </div>
          
          {isCompleted && (
            <div className="text-[#E9C46A] font-bold text-lg sm:text-xl animate-bounce flex items-center gap-2 bg-[#E9C46A]/10 rounded-lg px-4 py-2 border-2 border-[#E9C46A]/50">
              <div className="relative">
                <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#F4A261] rounded-full animate-ping"></div>
              </div>
              <span className="animate-pulse">Puzzle Completed!</span>
            </div>
          )}
          
          {/* Cool Modern Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={randomizeGrid}
              className="group relative px-4 sm:px-6 py-3 bg-gradient-to-r from-[#E9C46A] to-[#F4A261] hover:from-[#F4A261] hover:to-[#E76F51] text-[#264653] font-bold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl active:scale-95 shadow-lg text-sm sm:text-base border-2 border-[#F4A261]/30 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <div className="relative flex items-center gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
                </svg>
                New Puzzle
              </div>
            </button>
            
            <button
              onClick={toggleSolution}
              className="group relative px-4 sm:px-6 py-3 bg-gradient-to-r from-[#F4A261] to-[#E76F51] hover:from-[#E76F51] hover:to-[#F4A261] text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl active:scale-95 shadow-lg text-sm sm:text-base border-2 border-[#E76F51]/30 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <div className="relative flex items-center gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                  {showSolution ? (
                    <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
                  ) : (
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                  )}
                </svg>
                {showSolution ? 'Hide Solution' : 'Show Solution'}
              </div>
            </button>
          </div>
        </div>

                         {/* Game Grid */}
        <div className={`bg-[#E9C46A] p-3 sm:p-4 lg:p-6 rounded-2xl shadow-2xl transition-all duration-1000 ${
          isCompleted ? 'animate-pulse shadow-[#F4A261]/50 shadow-2xl' : ''
        }`}>
          <div
            className={`grid gap-0.5 sm:gap-1 mx-auto transition-all duration-700 w-full max-w-xs sm:max-w-md lg:max-w-xl ${
              isCompleted ? 'scale-105' : 'scale-100'
            }`}
            style={{
              gridTemplateColumns: `repeat(${gridSize.cols}, 1fr)`,
            }}
          >
            {grid.map((row, rowIndex) =>
              row.map((tile, colIndex) => (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => rotateTile(rowIndex, colIndex)}
                  disabled={showSolution}
                  className={`
                    aspect-square bg-[#264653] rounded-lg p-2 transition-all duration-300 ease-out transform-gpu
                    ${showSolution 
                      ? 'cursor-not-allowed opacity-80' 
                      : 'cursor-pointer hover:bg-[#2A9D8F] hover:scale-110 hover:shadow-xl active:scale-95 active:bg-[#E76F51]'
                    }
                    ${isCompleted ? 'ring-4 ring-[#F4A261] ring-opacity-70 shadow-2xl' : 'shadow-lg hover:shadow-2xl'}
                  `}
                >
                  {renderTileSVG(tile, rowIndex, colIndex)}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 sm:mt-8 text-center text-[#E9C46A] px-4">
          <p className="text-xs sm:text-sm">
            Click on tiles to rotate them 90° clockwise. Connect S (Start) to E (End) to complete the puzzle!
          </p>
        </div>
      </div>
    </div>
  );
};

export default CircuitPuzzle;