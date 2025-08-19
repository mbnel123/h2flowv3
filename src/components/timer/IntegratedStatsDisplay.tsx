// src/components/IntegratedStatsDisplay.tsx
import React from 'react';
import { Flame, TrendingUp, Clock, Target } from 'lucide-react';
import { FastStreak } from '../firebase/databaseService';

interface IntegratedStatsDisplayProps {
  streak: FastStreak;
  loading: boolean;
  resolvedTheme: string;
  isActive: boolean;
  elapsedTime: number;
  targetHours: number;
}

const IntegratedStatsDisplay: React.FC<IntegratedStatsDisplayProps> = ({ 
  streak, 
  loading, 
  resolvedTheme, 
  isActive, 
  elapsedTime, 
  targetHours 
}) => {
  const getStreakEmoji = (streakDays: number) => {
    if (streakDays >= 100) return '🔥💎';
    if (streakDays >= 50) return '🔥⭐';
    if (streakDays >= 30) return '🔥🚀';
    if (streakDays >= 14) return '🔥💪';
    if (streakDays >= 7) return '🔥✨';
    if (streakDays >= 3) return '🔥🌟';
    if (streakDays >= 1) return '🔥';
    return '💭';
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  if (loading) {
    return (
      <div className="px-6 py-3">
        <div className={`rounded-xl p-4 border transition-theme ${
          resolvedTheme === 'dark' 
            ? 'bg-gray-800/50 border-gray-700' 
            : 'bg-white/50 border-gray-200'
        }`}>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center">
                <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-lg animate-pulse mx-auto mb-2"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded animate-pulse mb-1"></div>
                <div className="h-2 bg-gray-300 dark:bg-gray-600 rounded animate-pulse w-2/3 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-3">
      <div className={`rounded-xl p-4 border backdrop-blur-sm transition-theme ${
        resolvedTheme === 'dark' 
          ? 'bg-gray-800/70 border-gray-700' 
          : 'bg-white/70 border-gray-200'
      }`}>
        <div className="grid grid-cols-3 gap-4">
          {/* Streak */}
          <div className="text-center">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2 ${
              streak.currentStreak > 0 
                ? 'bg-gradient-to-br from-orange-500 to-red-500' 
                : resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
              <span className="text-lg">
                {streak.currentStreak > 0 ? getStreakEmoji(streak.currentStreak) : '💭'}
              </span>
            </div>
            <div className={`font-bold text-sm transition-theme ${
              resolvedTheme === 'dark' ? 'text-gray-100' : 'text-gray-800'
            }`}>
              {streak.currentStreak} day{streak.currentStreak !== 1 ? 's' : ''}
            </div>
            <div className={`text-xs transition-theme ${
              resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Current streak
            </div>
          </div>

          {/* Current Fast / Best Streak */}
          <div className="text-center">
            {isActive ? (
              <>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2 ${
                  resolvedTheme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-100'
                }`}>
                  <Clock className={`w-5 h-5 ${
                    resolvedTheme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                  }`} />
                </div>
                <div className={`font-bold text-sm transition-theme ${
                  resolvedTheme === 'dark' ? 'text-gray-100' : 'text-gray-800'
                }`}>
                  {formatTime(elapsedTime)}
                </div>
                <div className={`text-xs transition-theme ${
                  resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Current fast
                </div>
              </>
            ) : (
              <>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2 ${
                  resolvedTheme === 'dark' ? 'bg-purple-900/30' : 'bg-purple-100'
                }`}>
                  <TrendingUp className={`w-5 h-5 ${
                    resolvedTheme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                  }`} />
                </div>
                <div className={`font-bold text-sm transition-theme ${
                  resolvedTheme === 'dark' ? 'text-gray-100' : 'text-gray-800'
                }`}>
                  {streak.longestStreak} day{streak.longestStreak !== 1 ? 's' : ''}
                </div>
                <div className={`text-xs transition-theme ${
                  resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Best streak
                </div>
              </>
            )}
          </div>

          {/* Target / Progress */}
          <div className="text-center">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2 ${
              resolvedTheme === 'dark' ? 'bg-emerald-900/30' : 'bg-emerald-100'
            }`}>
              <Target className={`w-5 h-5 ${
                resolvedTheme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'
              }`} />
            </div>
            <div className={`font-bold text-sm transition-theme ${
              resolvedTheme === 'dark' ? 'text-gray-100' : 'text-gray-800'
            }`}>
              {isActive ? `${Math.round((elapsedTime / (targetHours * 3600)) * 100)}%` : `${targetHours}h`}
            </div>
            <div className={`text-xs transition-theme ${
              resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {isActive ? 'Progress' : 'Next target'}
            </div>
          </div>
        </div>

        {/* Next milestone for active streaks */}
        {streak.currentStreak > 0 && (
          <div className={`mt-3 pt-3 border-t transition-theme ${
            resolvedTheme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          }`}>
            {(() => {
              const milestones = [7, 14, 21, 30, 50, 100, 365];
              const nextMilestone = milestones.find(m => m > streak.currentStreak);
              if (!nextMilestone) return null;
              
              const daysToGo = nextMilestone - streak.currentStreak;
              const progress = (streak.currentStreak / nextMilestone) * 100;
              
              return (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs transition-theme ${
                      resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Next: {nextMilestone} days
                    </span>
                    <span className={`text-xs font-medium transition-theme ${
                      resolvedTheme === 'dark' ? 'text-orange-400' : 'text-orange-600'
                    }`}>
                      {daysToGo} to go!
                    </span>
                  </div>
                  <div className={`h-1.5 rounded-full transition-theme ${
                    resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                  }`}>
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-500"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Motivational message for beginners */}
        {streak.currentStreak === 0 && (
          <div className={`mt-3 pt-3 border-t transition-theme ${
            resolvedTheme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <p className={`text-xs text-center transition-theme ${
              resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              🎯 Complete your first fast to start your streak!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default IntegratedStatsDisplay;
