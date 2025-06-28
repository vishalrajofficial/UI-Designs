import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';

// Types
interface Asset {
  id: string;
  symbol: string;
  name: string;
  type: 'stock' | 'crypto';
  price: number;
  previousPrice: number;
  change: number;
  changePercent: number;
  history: number[];
  volume: number;
  marketCap: number;
}

interface Alert {
  id: string;
  assetId: string;
  condition: 'above' | 'below' | 'change';
  value: number;
  isActive: boolean;
  triggered: boolean;
  message?: string;
}

interface PortfolioSummary {
  totalValue: number;
  totalChange: number;
  totalChangePercent: number;
  dayGain: number;
}

// SVG Icons
const TrendUpIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
    <polyline points="17 6 23 6 23 12"></polyline>
  </svg>
);

const TrendDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline>
    <polyline points="17 18 23 18 23 12"></polyline>
  </svg>
);

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.35-4.35"></path>
  </svg>
);

const AlertIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="12"></line>
    <line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>
);

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

// Tooltip Component with smart positioning
const Tooltip: React.FC<{ content: string; children: React.ReactNode; position?: 'top' | 'bottom' | 'left' | 'right' }> = ({ 
  content, 
  children, 
  position = 'bottom' 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [actualPosition, setActualPosition] = useState(position);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Smart positioning to keep tooltip on screen
  useEffect(() => {
    if (isVisible && tooltipRef.current && containerRef.current) {
      const tooltip = tooltipRef.current;
      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      const tooltipRect = tooltip.getBoundingClientRect();
      
      let newPosition = position;
      
      // Check if tooltip goes off screen and adjust position
      if (position === 'top' && containerRect.top - tooltipRect.height < 10) {
        newPosition = 'bottom';
      } else if (position === 'bottom' && containerRect.bottom + tooltipRect.height > window.innerHeight - 10) {
        newPosition = 'top';
      } else if (position === 'left' && containerRect.left - tooltipRect.width < 10) {
        newPosition = 'right';
      } else if (position === 'right' && containerRect.right + tooltipRect.width > window.innerWidth - 10) {
        newPosition = 'left';
      }
      
      if (newPosition !== actualPosition) {
        setActualPosition(newPosition);
      }
    }
  }, [isVisible, position, actualPosition]);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 -mt-1',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 -mb-1',
    left: 'left-full top-1/2 -translate-y-1/2 -ml-1',
    right: 'right-full top-1/2 -translate-y-1/2 -mr-1'
  };

  return (
    <div 
      ref={containerRef}
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div 
          ref={tooltipRef}
          className={`absolute z-[9999] px-3 py-2 text-xs text-white bg-gray-900 rounded-md whitespace-nowrap shadow-lg ${positionClasses[actualPosition]} animate-fade-in`}
          style={{ pointerEvents: 'none' }}
        >
          {content}
          <div className={`absolute w-2 h-2 bg-gray-900 rotate-45 ${arrowClasses[actualPosition]}`}></div>
        </div>
      )}
    </div>
  );
};

// Loading Skeleton Component
const LoadingSkeleton = () => (
  <div className="animate-pulse">
    <div className="bg-[#415A77] rounded-xl p-4 sm:p-6 border border-[#415A77]">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="h-6 bg-[#778DA9] rounded w-16 mb-2"></div>
          <div className="h-4 bg-[#778DA9] rounded w-32 mb-2"></div>
          <div className="h-5 bg-[#778DA9] rounded w-12"></div>
        </div>
        <div className="h-8 w-8 bg-[#778DA9] rounded-lg"></div>
      </div>
      <div className="mb-4">
        <div className="h-8 bg-[#778DA9] rounded w-24 mb-2"></div>
        <div className="h-5 bg-[#778DA9] rounded w-32"></div>
      </div>
      <div className="mb-4">
        <div className="h-12 bg-[#778DA9] rounded w-full"></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="h-4 bg-[#778DA9] rounded w-12 mb-1"></div>
          <div className="h-5 bg-[#778DA9] rounded w-16"></div>
        </div>
        <div>
          <div className="h-4 bg-[#778DA9] rounded w-16 mb-1"></div>
          <div className="h-5 bg-[#778DA9] rounded w-20"></div>
        </div>
      </div>
    </div>
  </div>
);

// Mini chart component for displaying price trends
const Sparkline: React.FC<{ data: number[]; color: string; width?: number; height?: number }> = ({ 
  data, 
  color, 
  width = 120, 
  height = 40 
}) => {
  // Normalize data points to fit within SVG dimensions
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        className="transition-all duration-300"
      />
      <defs>
        <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={`0,${height} ${points} ${width},${height}`}
        fill={`url(#gradient-${color})`}
        className="transition-all duration-300"
      />
    </svg>
  );
};

// Main Dashboard Component
const FinanceDashboard: React.FC = () => {
  // Core state management
  const [assets, setAssets] = useState<Asset[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'stock' | 'crypto'>('all');
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal and UI state
  const [showAlertConfig, setShowAlertConfig] = useState(false);
  const [selectedAssetForAlert, setSelectedAssetForAlert] = useState<string | null>(null);
  const [triggeredAlerts, setTriggeredAlerts] = useState<Alert[]>([]);
  
  // Alert modal form state
  const [alertCondition, setAlertCondition] = useState<'above' | 'below' | 'change'>('above');
  const [alertValue, setAlertValue] = useState('');

  // Base asset configuration - static data that doesn't change
  const baseAssetConfig = useMemo(() => [
    { id: 'stock-0', symbol: 'AAPL', name: 'Apple Inc.', type: 'stock' as const, basePrice: 150 },
    { id: 'stock-1', symbol: 'GOOGL', name: 'Alphabet Inc.', type: 'stock' as const, basePrice: 2800 },
    { id: 'stock-2', symbol: 'MSFT', name: 'Microsoft Corp.', type: 'stock' as const, basePrice: 400 },
    { id: 'stock-3', symbol: 'AMZN', name: 'Amazon.com Inc.', type: 'stock' as const, basePrice: 3400 },
    { id: 'stock-4', symbol: 'TSLA', name: 'Tesla Inc.', type: 'stock' as const, basePrice: 250 },
    { id: 'crypto-0', symbol: 'BTC', name: 'Bitcoin', type: 'crypto' as const, basePrice: 65000 },
    { id: 'crypto-1', symbol: 'ETH', name: 'Ethereum', type: 'crypto' as const, basePrice: 3500 },
    { id: 'crypto-2', symbol: 'SOL', name: 'Solana', type: 'crypto' as const, basePrice: 180 },
    { id: 'crypto-3', symbol: 'ADA', name: 'Cardano', type: 'crypto' as const, basePrice: 1.2 },
    { id: 'crypto-4', symbol: 'DOT', name: 'Polkadot', type: 'crypto' as const, basePrice: 25 }
  ], []);

  // Optimized data generation - only updates prices and related metrics
  const generateUpdatedAssets = useCallback((currentAssets: Asset[]): Asset[] => {
    const generateHistory = (basePrice: number): number[] => {
      const history: number[] = [];
      let price = basePrice;
      for (let i = 0; i < 20; i++) {
        price = price * (1 + (Math.random() - 0.5) * 0.02);
        history.push(price);
      }
      return history;
    };

    return baseAssetConfig.map((config, index) => {
      const existingAsset = currentAssets.find(asset => asset.id === config.id);
      const priceVariation = config.type === 'crypto' ? 0.15 : 0.1;
      const currentPrice = config.basePrice * (1 + (Math.random() - 0.5) * priceVariation);
      const previousPrice = existingAsset?.price || config.basePrice;
      
      return {
        ...config,
        price: currentPrice,
        previousPrice,
        change: currentPrice - previousPrice,
        changePercent: ((currentPrice - previousPrice) / previousPrice) * 100,
        history: existingAsset?.history || generateHistory(config.basePrice),
        volume: existingAsset?.volume || Math.floor(Math.random() * (config.type === 'crypto' ? 1000000000 : 100000000)),
        marketCap: existingAsset?.marketCap || Math.floor(currentPrice * Math.random() * (config.type === 'crypto' ? 10000000000 : 1000000000))
      };
    });
  }, [baseAssetConfig]);

  // Initialize mock data on component mount with loading state
  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      // Simulate API call delay for better loading state demo
      await new Promise(resolve => setTimeout(resolve, 1500));
      setAssets(generateUpdatedAssets([]));
      setIsLoading(false);
    };
    
    initializeData();
  }, [generateUpdatedAssets]);

  // Auto-refresh data every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setAssets(prevAssets => generateUpdatedAssets(prevAssets));
    }, 10000);

    return () => clearInterval(interval);
  }, [generateUpdatedAssets]);

  // Monitor price changes and trigger alerts
  useEffect(() => {
    const newTriggeredAlerts: Alert[] = [];
    
    alerts.forEach(alert => {
      if (!alert.isActive) return;
      
      const asset = assets.find(a => a.id === alert.assetId);
      if (!asset) return;

      let triggered = false;
      let message = '';

      switch (alert.condition) {
        case 'above':
          if (asset.price > alert.value) {
            triggered = true;
            message = `${asset.symbol} is above $${alert.value}`;
          }
          break;
        case 'below':
          if (asset.price < alert.value) {
            triggered = true;
            message = `${asset.symbol} is below $${alert.value}`;
          }
          break;
        case 'change':
          if (Math.abs(asset.changePercent) > alert.value) {
            triggered = true;
            message = `${asset.symbol} changed by ${asset.changePercent.toFixed(2)}%`;
          }
          break;
      }

      if (triggered && !alert.triggered) {
        newTriggeredAlerts.push({ ...alert, triggered: true, message });
      }
    });

    if (newTriggeredAlerts.length > 0) {
      setTriggeredAlerts(prev => [...prev, ...newTriggeredAlerts]);
      setAlerts(prev => prev.map(alert => {
        const triggered = newTriggeredAlerts.find(t => t.id === alert.id);
        return triggered ? { ...alert, triggered: true } : alert;
      }));
    }
  }, [assets, alerts]);

  // Calculate portfolio totals and performance metrics
  const portfolioSummary = useMemo<PortfolioSummary>(() => {
    const totalValue = assets.reduce((sum, asset) => sum + asset.price, 0);
    const totalPreviousValue = assets.reduce((sum, asset) => sum + asset.previousPrice, 0);
    const totalChange = totalValue - totalPreviousValue;
    const totalChangePercent = (totalChange / totalPreviousValue) * 100;
    
    return {
      totalValue,
      totalChange,
      totalChangePercent,
      dayGain: totalChange
    };
  }, [assets]);

  // Apply search and type filters to asset list
  const filteredAssets = useMemo(() => {
    return assets.filter(asset => {
      const matchesSearch = asset.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          asset.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || asset.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [assets, searchTerm, filterType]);

  // Create new alert and close modal
  const addAlert = (assetId: string, condition: 'above' | 'below' | 'change', value: number) => {
    const newAlert: Alert = {
      id: Date.now().toString(),
      assetId,
      condition,
      value,
      isActive: true,
      triggered: false
    };
    setAlerts(prev => [...prev, newAlert]);
    setShowAlertConfig(false);
    setSelectedAssetForAlert(null);
    setAlertCondition('above');
    setAlertValue('');
  };

  // Handle alert creation with validation
  const handleCreateAlert = () => {
    const value = parseFloat(alertValue);
    if (!isNaN(value) && selectedAssetForAlert) {
      addAlert(selectedAssetForAlert, alertCondition, value);
    }
  };

  // Delete alert from both active and triggered lists
  const removeAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    setTriggeredAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  // Hide triggered alert banner
  const dismissTriggeredAlert = (alertId: string) => {
    setTriggeredAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  return (
    <div className="min-h-screen bg-[#0D1B2A] text-[#E0E1DD]" style={{ fontFamily: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
        
        @keyframes slideIn {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-slide-in {
          animation: slideIn 0.3s ease-out;
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>

      {/* Sliding alert banners for triggered conditions */}
      <div className="fixed top-0 left-0 right-0 z-50">
        {triggeredAlerts.map((alert, index) => (
          <div
            key={alert.id}
            className="bg-red-600 text-white px-6 py-3 flex items-center justify-between animate-slide-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center gap-3">
              <AlertIcon />
              <span className="font-medium">{alert.message}</span>
            </div>
                         <Tooltip content="Dismiss alert" position="left">
               <button
                 onClick={() => dismissTriggeredAlert(alert.id)}
                 className="hover:bg-red-700 p-1 rounded transition-colors"
               >
                 <CloseIcon />
               </button>
             </Tooltip>
          </div>
        ))}
      </div>

            {/* Header */}
      <header className="bg-[#1B263B] border-b border-[#415A77] sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <h1 className="text-xl sm:text-2xl font-bold">Financial Dashboard</h1>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search assets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-48 lg:w-64 pl-10 pr-4 py-2 bg-[#415A77] text-[#E0E1DD] placeholder-[#778DA9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#778DA9] transition-all"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#778DA9] pointer-events-none">
                  <SearchIcon />
                </div>
              </div>
                             <div className="flex gap-1 sm:gap-2">
                {(['all', 'stock', 'crypto'] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    title={`Filter by ${type === 'all' ? 'all assets' : type + ' assets'}`}
                    className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                      filterType === type
                        ? 'bg-[#415A77] text-[#E0E1DD]'
                        : 'bg-[#0D1B2A] text-[#778DA9] hover:bg-[#415A77]/50'
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                {/* Portfolio Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {isLoading ? (
            // Loading skeletons for summary cards
            <>
              {[...Array(4)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-[#415A77] rounded-xl p-6 border border-[#415A77]">
                    <div className="h-4 bg-[#778DA9] rounded w-20 mb-2"></div>
                    <div className="h-8 bg-[#778DA9] rounded w-32"></div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <>
              <div 
                className="bg-[#1B263B] rounded-xl p-6 border border-[#415A77] hover:border-[#778DA9] transition-colors animate-fade-in"
                title="Total value of all assets in your portfolio"
              >
                <h3 className="text-sm text-[#778DA9] mb-2">Total Value</h3>
                <p className="text-2xl font-bold">${portfolioSummary.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
              <div 
                className="bg-[#1B263B] rounded-xl p-6 border border-[#415A77] hover:border-[#778DA9] transition-colors animate-fade-in" 
                style={{ animationDelay: '0.1s' }}
                title="Today's profit or loss"
              >
                <h3 className="text-sm text-[#778DA9] mb-2">Day Gain/Loss</h3>
                <p className={`text-2xl font-bold ${portfolioSummary.dayGain >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {portfolioSummary.dayGain >= 0 ? '+' : ''}{portfolioSummary.dayGain.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div 
                className="bg-[#1B263B] rounded-xl p-6 border border-[#415A77] hover:border-[#778DA9] transition-colors animate-fade-in" 
                style={{ animationDelay: '0.2s' }}
                title="Percentage change from yesterday"
              >
                <h3 className="text-sm text-[#778DA9] mb-2">Total Change</h3>
                <p className={`text-2xl font-bold ${portfolioSummary.totalChangePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {portfolioSummary.totalChangePercent >= 0 ? '+' : ''}{portfolioSummary.totalChangePercent.toFixed(2)}%
                </p>
              </div>
              <div 
                className="bg-[#1B263B] rounded-xl p-6 border border-[#415A77] hover:border-[#778DA9] transition-colors animate-fade-in" 
                style={{ animationDelay: '0.3s' }}
                title="Number of active price alerts"
              >
                <h3 className="text-sm text-[#778DA9] mb-2">Active Alerts</h3>
                <p className="text-2xl font-bold">{alerts.filter(a => a.isActive).length}</p>
              </div>
            </>
          )}
        </div>

         {/* Active Alerts Section */}
         {alerts.length > 0 && (
           <div className="mb-6 sm:mb-8">
             <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Active Alerts</h2>
             <div className="space-y-3">
               {alerts.map(alert => {
                 const asset = assets.find(a => a.id === alert.assetId);
                 if (!asset) return null;
                 
                 return (
                   <div
                     key={alert.id}
                     className={`bg-[#1B263B] rounded-lg p-3 sm:p-4 border ${
                       alert.triggered ? 'border-red-400' : 'border-[#415A77]'
                     } flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in`}
                   >
                     <div>
                       <p className="font-medium">{asset.symbol} - {asset.name}</p>
                       <p className="text-sm text-[#778DA9]">
                         Alert when {alert.condition} {alert.value}
                         {alert.condition === 'change' ? '%' : ''}
                       </p>
                     </div>
                     <Tooltip content="Remove this alert">
                       <button
                         onClick={() => removeAlert(alert.id)}
                         className="p-2 hover:bg-[#415A77] rounded-lg transition-colors"
                       >
                         <CloseIcon />
                       </button>
                     </Tooltip>
                   </div>
                 );
               })}
             </div>
           </div>
         )}

                  {/* Assets Grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
           {isLoading ? (
             // Loading skeletons for asset cards
             [...Array(6)].map((_, index) => (
               <LoadingSkeleton key={index} />
             ))
           ) : (
             filteredAssets.map((asset, index) => (
            <div
              key={asset.id}
              className="bg-[#1B263B] rounded-xl p-4 sm:p-6 border border-[#415A77] hover:border-[#778DA9] transition-all hover:transform hover:scale-[1.02] animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold">{asset.symbol}</h3>
                  <p className="text-sm text-[#778DA9]">{asset.name}</p>
                  <span className="inline-block px-2 py-1 mt-2 text-xs bg-[#415A77] rounded-full">
                    {asset.type.toUpperCase()}
                  </span>
                </div>
                                 <Tooltip content="Set price alert for this asset" position="left">
                   <button
                     onClick={() => {
                       setSelectedAssetForAlert(asset.id);
                       setShowAlertConfig(true);
                     }}
                     className="p-2 hover:bg-[#415A77] rounded-lg transition-colors"
                   >
                     <AlertIcon />
                   </button>
                 </Tooltip>
              </div>

              <div className="mb-4">
                <p className="text-2xl font-bold mb-1">
                  ${asset.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <div className="flex items-center gap-2">
                  {asset.change >= 0 ? <TrendUpIcon /> : <TrendDownIcon />}
                  <span className={`font-medium ${asset.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {asset.change >= 0 ? '+' : ''}{asset.change.toFixed(2)} ({asset.changePercent.toFixed(2)}%)
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <div className="w-full max-w-full">
                  <Sparkline
                    data={asset.history}
                    color={asset.change >= 0 ? '#4ade80' : '#f87171'}
                    width={250}
                    height={50}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-[#778DA9]">Volume</p>
                  <p className="font-medium">{(asset.volume / 1000000).toFixed(2)}M</p>
                </div>
                <div>
                  <p className="text-[#778DA9]">Market Cap</p>
                  <p className="font-medium">${(asset.marketCap / 1000000000).toFixed(2)}B</p>
                </div>
                             </div>
             </div>
             ))
           )}
         </div>

        {/* Modal for setting up price/change alert conditions */}
        {showAlertConfig && selectedAssetForAlert && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowAlertConfig(false)}>
            <div className="bg-[#1B263B] rounded-xl p-4 sm:p-6 w-full max-w-md animate-fade-in" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-xl font-semibold mb-4">Configure Alert</h3>
                             <div className="space-y-4">
                <div>
                  <label className="block text-sm text-[#778DA9] mb-2">Condition</label>
                  <select
                    value={alertCondition}
                    onChange={(e) => setAlertCondition(e.target.value as 'above' | 'below' | 'change')}
                    className="w-full px-4 py-2 bg-[#415A77] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#778DA9]"
                  >
                    <option value="above">Price Above</option>
                    <option value="below">Price Below</option>
                    <option value="change">Change Percent Greater Than</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-[#778DA9] mb-2">Value</label>
                  <input
                    type="number"
                    value={alertValue}
                    onChange={(e) => setAlertValue(e.target.value)}
                    className="w-full px-4 py-2 bg-[#415A77] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#778DA9]"
                    placeholder="Enter value"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleCreateAlert}
                    title="Create alert with specified conditions"
                    className="flex-1 bg-[#415A77] hover:bg-[#778DA9] px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Create Alert
                  </button>
                  <button
                    onClick={() => setShowAlertConfig(false)}
                    title="Cancel alert creation"
                    className="flex-1 bg-[#0D1B2A] hover:bg-[#415A77]/50 px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        
      </main>
    </div>
  );
};

export default FinanceDashboard;