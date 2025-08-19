// src/components/TimerHeader.tsx
import React from 'react';
import { Droplets, Info, Settings } from 'lucide-react';
import { ThemeToggle } from "../../contexts/ThemeContext";
import { ConnectionStatus, MultiDeviceActivity } from './TimerComponents.tsx';

interface TimerHeaderProps {
  resolvedTheme: string;
  setCurrentView: (view: string) => void;
  syncStatus: 'connected' | 'connecting' | 'offline' | 'error';
  isOnline: boolean;
  lastSyncTime: Date | null;
  multiDeviceActivity: string | null;
  getProgress: () => number;
}

const TimerHeader: React.FC<TimerHeaderProps> = ({
  resolvedTheme,
  setCurrentView,
  syncStatus,
  isOnline,
  lastSyncTime,
  multiDeviceActivity,
  getProgress
}) => {
  return (
    <div className={`relative p-6 border-b shadow-sm transition-theme ${
      resolvedTheme === 'dark'
        ? 'bg-gray-800 border-gray-700'
        : 'bg-white border-gray-200'
    }`}>
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div 
            className="w-12 h-12 rounded-2xl flex items-center justify-center mr-4 shadow-md" 
            style={{background: 'linear-gradient(135deg, #60A5FA 0%, #2563EB 100%)'}}
          >
            <span className="text-sm font-bold text-white">H₂F</span>
          </div>
          <div>
            <h1 className={`text-2xl font-bold transition-theme ${
              resolvedTheme === 'dark' ? 'text-gray-100' : 'text-gray-800'
            }`}>
              H2Flow
            </h1>
            <p className={`text-sm font-medium transition-theme ${
              resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Extended Water Fasting
            </p>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <button 
            onClick={() => setCurrentView('water')} 
            className={`p-3 rounded-xl transition-all ${
              resolvedTheme === 'dark'
                ? 'bg-gray-700 hover:bg-gray-600'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <Droplets className={`w-5 h-5 transition-theme ${
              resolvedTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`} />
          </button>
          <button 
            onClick={() => setCurrentView('info')} 
            className={`p-3 rounded-xl transition-all ${
              resolvedTheme === 'dark'
                ? 'bg-gray-700 hover:bg-gray-600'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <Info className={`w-5 h-5 transition-theme ${
              resolvedTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`} />
          </button>
          <button 
            onClick={() => setCurrentView('history')} 
            className={`p-3 rounded-xl transition-all ${
              resolvedTheme === 'dark'
                ? 'bg-gray-700 hover:bg-gray-600'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <span className={`transition-theme ${
              resolvedTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>📊</span>
          </button>
          <button 
            onClick={() => setCurrentView('settings')} 
            className={`p-3 rounded-xl transition-all ${
              resolvedTheme === 'dark'
                ? 'bg-gray-700 hover:bg-gray-600'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <Settings className={`w-5 h-5 transition-theme ${
              resolvedTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`} />
          </button>
          <ThemeToggle variant="icon" size="md" />
        </div>
      </div>
      
      {/* Connection status and multi-device activity */}
      <div className="mt-3 flex justify-between items-center">
        <ConnectionStatus 
          syncStatus={syncStatus}
          isOnline={isOnline}
          lastSyncTime={lastSyncTime}
        />
        {multiDeviceActivity && (
          <MultiDeviceActivity activity={multiDeviceActivity} />
        )}
      </div>
      
      {/* Progress bar */}
      <div className={`absolute bottom-0 left-0 right-0 h-0.5 transition-theme ${
        resolvedTheme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
      }`}>
        <div 
          className="h-full transition-all duration-1000" 
          style={{
            background: resolvedTheme === 'dark' 
              ? 'linear-gradient(90deg, #60A5FA 0%, #3B82F6 100%)' 
              : 'linear-gradient(90deg, #38BDF8 0%, #0EA5E9 100%)',
            width: `${getProgress()}%`
          }}
        ></div>
      </div>
    </div>
  );
};

export default TimerHeader;
