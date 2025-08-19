// src/components/history/AchievementsSection.tsx
import React from 'react';
import { FastStreak } from '../../firebase/databaseService';

interface AchievementsSectionProps {
  stats: {
    totalFasts: number;
    longestFast: number;
    immuneResets: number;
    completionRate: number;
    ketosisHours: number;
  };
  fastingStreak: FastStreak | null;
}

const AchievementsSection: React.FC<AchievementsSectionProps> = ({ stats, fastingStreak }) => {
  const achievements = [];

  // Basic achievements
  if (stats.totalFasts >= 5) {
    achievements.push({
      emoji: '🎯',
      title: 'Dedicated Faster',
      description: 'Completed 5+ fasts',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-800',
      subtextColor: 'text-yellow-600'
    });
  }

  if (stats.longestFast >= 24) {
    achievements.push({
      emoji: '🔄',
      title: 'Autophagy Master',
      description: 'Reached 24+ hour fast',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-800',
      subtextColor: 'text-purple-600'
    });
  }

  if (stats.longestFast >= 48) {
    achievements.push({
      emoji: '🛡️',
      title: 'Cellular Warrior',
      description: 'Reached 48+ hour fast',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-800',
      subtextColor: 'text-green-600'
    });
  }

  if (stats.immuneResets >= 1) {
    achievements.push({
      emoji: '🌟',
      title: 'Immune Reset Champion',
      description: 'Completed 72+ hour fast',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
      subtextColor: 'text-blue-600'
    });
  }

  if (stats.completionRate >= 80 && stats.totalFasts >= 3) {
    achievements.push({
      emoji: '💎',
      title: 'Consistency Champion',
      description: '80%+ completion rate',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      textColor: 'text-indigo-800',
      subtextColor: 'text-indigo-600'
    });
  }

  if (stats.ketosisHours >= 100) {
    achievements.push({
      emoji: '⚡',
      title: 'Ketosis Explorer',
      description: '100+ hours in ketosis',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      textColor: 'text-emerald-800',
      subtextColor: 'text-emerald-600'
    });
  }

  // Streak achievements
  if (fastingStreak && fastingStreak.currentStreak >= 7) {
    achievements.push({
      emoji: '🔥',
      title: 'Week Warrior',
      description: '7+ day fasting streak',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      textColor: 'text-orange-800',
      subtextColor: 'text-orange-600'
    });
  }

  if (fastingStreak && fastingStreak.currentStreak >= 30) {
    achievements.push({
      emoji: '🔥🚀',
      title: 'Monthly Master',
      description: '30+ day fasting streak',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-800',
      subtextColor: 'text-red-600'
    });
  }

  if (fastingStreak && fastingStreak.longestStreak >= 100) {
    achievements.push({
      emoji: '🔥💎',
      title: 'Legendary Faster',
      description: '100+ day streak achieved',
      bgColor: 'bg-gradient-to-r from-purple-50 to-pink-50',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-800',
      subtextColor: 'text-purple-600'
    });
  }

  if (achievements.length === 0) {
    return (
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🏆 Achievements</h3>
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-4">🎯</div>
          <p>Keep fasting to unlock achievements!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">🏆 Achievements</h3>
      <div className="grid grid-cols-1 gap-3">
        {achievements.map((achievement, index) => (
          <div 
            key={index}
            className={`${achievement.bgColor} border ${achievement.borderColor} rounded-lg p-4 flex items-center`}
          >
            <span className="text-2xl mr-3">{achievement.emoji}</span>
            <div>
              <div className={`font-medium ${achievement.textColor}`}>{achievement.title}</div>
              <div className={`text-sm ${achievement.subtextColor}`}>{achievement.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AchievementsSection;
