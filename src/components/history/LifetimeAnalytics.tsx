// src/components/history/LifetimeAnalytics.tsx
import React from 'react';
import { TrendingUp, Clock, Award, BarChart3, Zap, Shield } from 'lucide-react';

interface LifetimeAnalyticsProps {
  stats: {
    totalFasts: number;
    totalHours: number;
    averageDuration: number;
    longestFast: number;
    completionRate: number;
    thisWeekFasts: number;
    ketosisHours: number;
    autophagyHours: number;
    damagedCellsCleared: number;
    immuneResets: number;
    growthHormoneHours: number;
  };
}

const LifetimeAnalytics: React.FC<LifetimeAnalyticsProps> = ({ stats }) => {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">📊 Lifetime Fasting Analytics</h2>
      
      {/* Basic Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center mb-2">
            <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
            <span className="text-sm font-medium text-blue-800">Total Fasts</span>
          </div>
          <div className="text-2xl font-bold text-blue-900">{stats.totalFasts}</div>
          <div className="text-xs text-blue-600">{stats.thisWeekFasts} this week</div>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center mb-2">
            <Clock className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-sm font-medium text-green-800">Total Hours</span>
          </div>
          <div className="text-2xl font-bold text-green-900">{Number(stats.totalHours).toFixed(2)}h</div>
          <div className="text-xs text-green-600">{Number(stats.totalHours / 24).toFixed(2)} days total</div>
        </div>
        
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
          <div className="flex items-center mb-2">
            <BarChart3 className="w-5 h-5 text-purple-600 mr-2" />
            <span className="text-sm font-medium text-purple-800">Average Duration</span>
          </div>
          <div className="text-2xl font-bold text-purple-900">{Number(stats.averageDuration).toFixed(2)}h</div>
        </div>
        
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
          <div className="flex items-center mb-2">
            <Award className="w-5 h-5 text-orange-600 mr-2" />
            <span className="text-sm font-medium text-orange-800">Longest Fast</span>
          </div>
          <div className="text-2xl font-bold text-orange-900">{Number(stats.longestFast).toFixed(2)}h</div>
        </div>
      </div>

      {/* Advanced Biological Metrics */}
      <div className="grid grid-cols-1 gap-6 mb-6">
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-emerald-800 mb-4 flex items-center">
            <Zap className="w-5 h-5 mr-2" />
            Metabolic & Cellular Health
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-emerald-700 mb-1">Ketosis Hours</div>
              <div className="text-2xl font-bold text-emerald-900">{Number(stats.ketosisHours).toFixed(2)}h</div>
              <div className="text-xs text-emerald-600">Fat burning time</div>
            </div>
            <div>
              <div className="text-sm text-emerald-700 mb-1">Autophagy Hours</div>
              <div className="text-2xl font-bold text-emerald-900">{Number(stats.autophagyHours).toFixed(2)}h</div>
              <div className="text-xs text-emerald-600">Cellular cleaning time</div>
            </div>
            <div>
              <div className="text-sm text-emerald-700 mb-1">Est. Cells Repaired</div>
              <div className="text-xl font-bold text-emerald-900">{Number(stats.damagedCellsCleared / 1000000).toFixed(2)}M</div>
              <div className="text-xs text-emerald-600">Damaged cells cleared</div>
            </div>
            <div>
              <div className="text-sm text-emerald-700 mb-1">Growth Hormone Hours</div>
              <div className="text-2xl font-bold text-emerald-900">{Number(stats.growthHormoneHours).toFixed(2)}h</div>
              <div className="text-xs text-emerald-600">Enhanced GH production</div>
            </div>
          </div>
          <p className="text-xs text-emerald-600 mt-4">
            *Estimates based on scientific research. Individual results may vary.
          </p>
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-sky-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Immune System & Performance
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-blue-700 mb-1">Success Rate</div>
              <div className="text-3xl font-bold text-blue-900">{Number(stats.completionRate).toFixed(2)}%</div>
              <div className="text-xs text-blue-600">Completion Rate</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-blue-700 mb-1">Immune Resets</div>
              <div className="text-3xl font-bold text-blue-900">{stats.immuneResets}</div>
              <div className="text-xs text-blue-600">72+ hour fasts</div>
            </div>
            <div className="w-24 h-24 relative">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="#E5E7EB" strokeWidth="8" fill="transparent" />
                <circle
                  cx="50" cy="50" r="40" stroke="#3B82F6" strokeWidth="8" fill="transparent"
                  strokeDasharray={251} strokeDashoffset={251 - (stats.completionRate / 100) * 251}
                  strokeLinecap="round" className="transition-all duration-1000"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LifetimeAnalytics;
