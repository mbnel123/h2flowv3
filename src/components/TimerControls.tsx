// src/components/TimerControls.tsx
import React from 'react';
import { Play, Pause, Square } from 'lucide-react';
import { FastTemplate } from '../services/templateService.ts';

interface TimerControlsProps {
  isActive: boolean;
  startTime: number | null;
  loading: boolean;
  isOnline: boolean;
  resolvedTheme: string;
  recentTemplates: FastTemplate[];
  showCelebrations: boolean;
  onStartFast: () => void;
  onResumeFast: () => void;
  onPauseFast: () => void;
  onStopConfirmation: () => void;
  onShowTemplateSelector: () => void;
  onSelectTemplate: (template: FastTemplate) => void;
  onToggleCelebrations: () => void;
}

const TimerControls: React.FC<TimerControlsProps> = ({
  isActive,
  startTime,
  loading,
  isOnline,
  resolvedTheme,
  recentTemplates,
  showCelebrations,
  onStartFast,
  onResumeFast,
  onPauseFast,
  onStopConfirmation,
  onShowTemplateSelector,
  onSelectTemplate,
  onToggleCelebrations
}) => {
  return (
    <div className="p-6">
      {/* Quick Template Access */}
      {!isActive && recentTemplates.length > 0 && (
        <div className="mb-4">
          <p className={`text-sm mb-2 transition-theme ${
            resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Recent templates:
          </p>
          <div className="flex space-x-2 overflow-x-auto">
            {recentTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => onSelectTemplate(template)}
                className={`flex-shrink-0 flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  resolvedTheme === 'dark'
                    ? 'bg-gray-700 hover:bg-gray-600'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <span className="text-lg">{template.icon}</span>
                <span className={`text-sm font-medium transition-theme ${
                  resolvedTheme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  {template.name}
                </span>
                <span className={`text-xs transition-theme ${
                  resolvedTheme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                }`}>
                  {template.duration}h
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Control Buttons */}
      <div className="flex justify-center space-x-4">
        {!isActive ? (
          startTime ? (
            <>
              <button 
                onClick={onResumeFast} 
                disabled={loading || !isOnline}
                className="text-white px-12 py-4 rounded-2xl font-semibold text-lg transition-opacity hover:opacity-90 flex items-center shadow-lg disabled:opacity-50"
                style={{background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)'}}
              >
                <Play className="w-6 h-6 mr-3" />Resume Fast
              </button>
              <button 
                onClick={onStopConfirmation} 
                disabled={loading || !isOnline}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-2xl font-semibold transition-all flex items-center shadow-lg disabled:opacity-50"
              >
                <Square className="w-5 h-5 mr-2" />Stop Fast
              </button>
            </>
          ) : (
            <div className="flex space-x-4">
              <button 
                onClick={onStartFast} 
                disabled={loading || !isOnline}
                className="text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-opacity hover:opacity-90 flex items-center shadow-lg disabled:opacity-50"
                style={{background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)'}}
              >
                <Play className="w-6 h-6 mr-3" />
                {loading ? 'Starting...' : 'Start Fast'}
              </button>
              
              <button 
                onClick={onShowTemplateSelector} 
                disabled={loading || !isOnline}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-colors flex items-center shadow-lg disabled:opacity-50"
              >
                📋 Templates
              </button>
            </div>
          )
        ) : (
          <>
            <button 
              onClick={onPauseFast} 
              disabled={loading || !isOnline}
              className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-4 rounded-2xl font-semibold transition-all flex items-center shadow-lg disabled:opacity-50"
            >
              <Pause className="w-5 h-5 mr-2" />Pause
            </button>
            <button 
              onClick={onStopConfirmation} 
              disabled={loading || !isOnline}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-4 rounded-2xl font-semibold transition-all shadow-lg disabled:opacity-50"
            >
              🍎 Break Fast
            </button>
          </>
        )}
      </div>
      
      {/* Offline Warning */}
      {!isOnline && (
        <div className="text-center mt-3">
          <p className="text-xs text-orange-600">
            Some features disabled while offline
          </p>
        </div>
      )}

      {/* Celebration Toggle */}
      {isActive && (
        <div className="flex justify-center mt-4">
          <button
            onClick={onToggleCelebrations}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              showCelebrations 
                ? resolvedTheme === 'dark'
                  ? 'bg-blue-900/20 text-blue-400 hover:bg-blue-900/30'
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                : resolvedTheme === 'dark'
                ? 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {showCelebrations ? '🎉 Celebrations ON' : '🔇 Celebrations OFF'}
          </button>
        </div>
      )}
    </div>
  );
};

export default TimerControls;
