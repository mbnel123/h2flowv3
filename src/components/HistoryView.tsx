import React, { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, Clock, Award, BarChart3, Zap, Shield, User, LogOut, Calendar } from 'lucide-react';
import { User as FirebaseUser } from 'firebase/auth';
import { onAuthStateChange, logout } from '../firebase/authService';
import { getFastHistory, Fast } from '../firebase/databaseService';

interface HistoryViewProps {
  setCurrentView: (view: string) => void;
}

// Enhanced Loading Skeleton Component
const HistoryLoadingSkeleton = () => (
  <div className="min-h-screen bg-white">
    {/* Header Skeleton */}
    <div className="p-6 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-9 h-9 bg-gray-200 animate-pulse rounded-full mr-3"></div>
          <div className="h-5 w-32 bg-gray-200 animate-pulse rounded"></div>
        </div>
        <div className="w-20 h-8 bg-red-100 animate-pulse rounded-lg"></div>
      </div>
    </div>

    <div className="p-6">
      {/* User Profile Skeleton */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-gray-300 to-gray-400 animate-pulse rounded-full mr-4"></div>
            <div>
              <div className="h-8 w-32 bg-gray-200 animate-pulse rounded mb-2"></div>
              <div className="h-4 w-48 bg-gray-200 animate-pulse rounded mb-1"></div>
              <div className="h-3 w-24 bg-gray-200 animate-pulse rounded"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Fasting Patterns Skeleton */}
      <div className="mb-8">
        <div className="h-6 w-48 bg-gray-200 animate-pulse rounded mb-6"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[1,2,3].map(i => (
            <div key={i} className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-6">
              <div className="flex items-center mb-3">
                <div className="w-5 h-5 bg-gray-200 animate-pulse rounded mr-2"></div>
                <div className="h-4 w-20 bg-gray-200 animate-pulse rounded"></div>
              </div>
              <div className="space-y-2">
                <div>
                  <div className="h-8 w-8 bg-gray-200 animate-pulse rounded mb-1"></div>
                  <div className="h-3 w-16 bg-gray-200 animate-pulse rounded"></div>
                </div>
                <div>
                  <div className="h-6 w-12 bg-gray-200 animate-pulse rounded mb-1"></div>
                  <div className="h-3 w-20 bg-gray-200 animate-pulse rounded"></div>
                </div>
                <div className="h-3 w-32 bg-gray-200 animate-pulse rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Statistics Overview Skeleton */}
      <div className="mb-8">
        <div className="h-6 w-56 bg-gray-200 animate-pulse rounded mb-6"></div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          {[1,2,3,4].map(i => (
            <div key={i} className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <div className="flex items-center mb-2">
                <div className="w-5 h-5 bg-gray-200 animate-pulse rounded mr-2"></div>
                <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
              </div>
              <div className="h-8 w-12 bg-gray-200 animate-pulse rounded mb-1"></div>
              <div className="h-3 w-20 bg-gray-200 animate-pulse rounded"></div>
            </div>
          ))}
        </div>

        {/* Advanced metrics skeleton */}
        <div className="grid grid-cols-1 gap-6 mb-6">
          {[1,2].map(i => (
            <div key={i} className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <div className="w-5 h-5 bg-gray-200 animate-pulse rounded mr-2"></div>
                <div className="h-5 w-48 bg-gray-200 animate-pulse rounded"></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[1,2,3,4].map(j => (
                  <div key={j}>
                    <div className="h-4 w-24 bg-gray-200 animate-pulse rounded mb-1"></div>
                    <div className="h-8 w-16 bg-gray-200 animate-pulse rounded mb-1"></div>
                    <div className="h-3 w-20 bg-gray-200 animate-pulse rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fast History Skeleton */}
      <div>
        <div className="h-5 w-24 bg-gray-200 animate-pulse rounded mb-4"></div>
        <div className="space-y-3">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="h-5 w-20 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-6 w-24 bg-gray-200 animate-pulse rounded-full"></div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                <div className="h-4 w-32 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-4 w-28 bg-gray-200 animate-pulse rounded"></div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="h-3 w-40 bg-gray-200 animate-pulse rounded mb-2"></div>
                <div className="flex flex-wrap gap-1">
                  {[1,2,3].map(j => (
                    <div key={j} className="h-6 w-16 bg-gray-200 animate-pulse rounded-full"></div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const HistoryView: React.FC<HistoryViewProps> = ({ setCurrentView }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [fastHistory, setFastHistory] = useState<Fast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Listen to auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user);
      if (!user) {
        setCurrentView('auth');
      } else {
        loadFastHistory(user.uid);
      }
    });

    return () => unsubscribe();
  }, [setCurrentView]);

  // Load fast history from Firebase
  const loadFastHistory = async (userId: string) => {
    try {
      setLoading(true);
      const { fasts, error } = await getFastHistory(userId);
      if (error) {
        setError(error);
      } else {
        setFastHistory(fasts);
      }
    } catch (err) {
      setError('Failed to load fast history');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setCurrentView('welcome');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Enhanced statistics calculation
  const calculateAdvancedStats = () => {
    const completedFasts = fastHistory.filter(fast => fast.status === 'completed');
    const totalFasts = fastHistory.length;
    const totalHours = fastHistory.reduce((sum, fast) => {
      return sum + (fast.actualDuration || fast.plannedDuration);
    }, 0);
    const averageDuration = totalFasts > 0 ? Math.round(totalHours / totalFasts) : 0;
    const longestFast = Math.max(...fastHistory.map(fast => fast.actualDuration || fast.plannedDuration), 0);
    const completionRate = totalFasts > 0 ? Math.round((completedFasts.length / totalFasts) * 100) : 0;
    
    // Calculate yearly averages
    const now = new Date();
    const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    const thisYearFasts = fastHistory.filter(fast => new Date(fast.startTime) >= oneYearAgo);
    const fastsPerYear = thisYearFasts.length;
    const hoursPerYear = thisYearFasts.reduce((sum, fast) => sum + (fast.actualDuration || fast.plannedDuration), 0);
    
    // Calculate monthly averages
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const thisMonthFasts = fastHistory.filter(fast => new Date(fast.startTime) >= oneMonthAgo);
    const fastsPerMonth = thisMonthFasts.length;
    const hoursPerMonth = thisMonthFasts.reduce((sum, fast) => sum + (fast.actualDuration || fast.plannedDuration), 0);
    
    // Calculate weekly averages
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thisWeekFasts = fastHistory.filter(fast => new Date(fast.startTime) >= oneWeekAgo);
    
    // Calculate ketosis hours (12+ hour fasts)
    const ketosisHours = fastHistory
      .filter(fast => (fast.actualDuration || fast.plannedDuration) >= 12)
      .reduce((sum, fast) => sum + Math.max(0, (fast.actualDuration || fast.plannedDuration) - 12), 0);
    
    // Calculate autophagy hours (24+ hour fasts)
    const autophagyHours = fastHistory
      .filter(fast => (fast.actualDuration || fast.plannedDuration) >= 24)
      .reduce((sum, fast) => sum + Math.max(0, (fast.actualDuration || fast.plannedDuration) - 24), 0);
    
    // Calculate damaged cells cleared (rough scientific estimate)
    const damagedCellsCleared = Math.round(autophagyHours * 1200000); // ~1.2M cells per hour estimate
    
    // Calculate immune system resets (72+ hour fasts)
    const immuneResets = fastHistory.filter(fast => (fast.actualDuration || fast.plannedDuration) >= 72).length;
    
    // Calculate growth hormone boost hours (estimated)
    const growthHormoneHours = fastHistory.reduce((sum, fast) => {
      const duration = fast.actualDuration || fast.plannedDuration;
      if (duration >= 16) return sum + duration;
      return sum;
    }, 0);
    
    // Account age calculation
    const oldestFast = fastHistory.reduce((oldest, fast) => {
      const fastDate = new Date(fast.startTime);
      return fastDate < oldest ? fastDate : oldest;
    }, new Date());
    
    const accountAgeDays = Math.floor((now.getTime() - oldestFast.getTime()) / (1000 * 60 * 60 * 24));

    return {
      totalFasts,
      totalHours,
      averageDuration,
      longestFast,
      completionRate,
      ketosisHours,
      autophagyHours,
      damagedCellsCleared,
      immuneResets,
      growthHormoneHours,
      thisWeekFasts: thisWeekFasts.length,
      fastsPerYear,
      hoursPerYear,
      fastsPerMonth,
      hoursPerMonth,
      accountAgeDays
    };
  };

  const stats = calculateAdvancedStats();

  // Calculate streaks (consecutive days with a fast)
  const getFastStreak = () => {
    if (fastHistory.length === 0) return 0;
    const sorted = [...fastHistory].sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
    let streak = 1;
    let lastDate = new Date(sorted[0].startTime);
    for (let i = 1; i < sorted.length; i++) {
      const currentDate = new Date(sorted[i].startTime);
      const diff = (lastDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24);
      if (diff <= 1.5) {
        streak++;
        lastDate = currentDate;
      } else {
        break;
      }
    }
    return streak;
  };

  // Quarterly trend: % verschil met vorig kwartaal
  const getQuarterlyTrend = () => {
    const now = new Date();
    const currentQuarter = Math.floor(now.getMonth() / 3);
    const prevQuarter = (currentQuarter + 3 - 1) % 4;
    const currentYear = now.getFullYear();
    const getQuarterFasts = (year: number, quarter: number) => fastHistory.filter(fast => {
      const d = new Date(fast.startTime);
      return d.getFullYear() === year && Math.floor(d.getMonth() / 3) === quarter;
    });
    const currentQ = getQuarterFasts(currentYear, currentQuarter);
    const prevQ = getQuarterFasts(currentYear, prevQuarter);
    const currentAvg = currentQ.length > 0 ? currentQ.reduce((a, b) => a + (b.actualDuration || b.plannedDuration), 0) / currentQ.length : 0;
    const prevAvg = prevQ.length > 0 ? prevQ.reduce((a, b) => a + (b.actualDuration || b.plannedDuration), 0) / prevQ.length : 0;
    if (prevAvg === 0) return null;
    return Math.round(((currentAvg - prevAvg) / prevAvg) * 100);
  };

  // Predictive: voorspelling op basis van laatste 4 fasts
  const getNextPrediction = () => {
    if (fastHistory.length < 2) return null;
    const sorted = [...fastHistory].sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
    const recent = sorted.slice(0, 4);
    const avg = recent.reduce((a, b) => a + (b.actualDuration || b.plannedDuration), 0) / recent.length;
    return Math.round(avg);
  };

  // Records
  const getPersonalRecords = () => {
    if (fastHistory.length === 0) return {};
    return {
      longestFast: Math.max(...fastHistory.map(f => f.actualDuration || f.plannedDuration)),
      mostFastsInWeek: Math.max(...[...Array(52)].map((_, i) => {
        const weekStart = new Date(new Date().getFullYear(), 0, 1 + i * 7);
        const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
        return fastHistory.filter(f => new Date(f.startTime) >= weekStart && new Date(f.startTime) < weekEnd).length;
      })),
      mostHoursInMonth: Math.max(...[...Array(12)].map((_, i) => {
        const month = i;
        return fastHistory.filter(f => new Date(f.startTime).getMonth() === month).reduce((a, b) => a + (b.actualDuration || b.plannedDuration), 0);
      })),
    };
  };

  // Eenvoudige grafiekdata: fastduur per maand
  const getMonthlyChartData = () => {
    const months = Array.from({ length: 12 }, (_, i) => i);
    return months.map(month => fastHistory.filter(f => new Date(f.startTime).getMonth() === month).reduce((a, b) => a + (b.actualDuration || b.plannedDuration), 0));
  };

  const streak = getFastStreak();
  const quarterlyTrend = getQuarterlyTrend();
  const nextPrediction = getNextPrediction();
  const records = getPersonalRecords();
  const monthlyChart = getMonthlyChartData();

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🔒</div>
          <p className="text-gray-600">Please log in to view your profile</p>
        </div>
      </div>
    );
  }

  // Show enhanced loading skeleton instead of basic loading
  if (loading) {
    return <HistoryLoadingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* --- Advanced Analytics --- */}
      <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-blue-200 flex flex-wrap gap-8 items-center justify-between">
        {/* Streak teller */}
        <div className="flex flex-col items-center">
          <span className="text-4xl">🔥</span>
          <div className="text-lg font-bold text-blue-900">{streak} day streak</div>
          <div className="text-xs text-gray-500">Consecutive fasting days</div>
        </div>
        {/* Kwartaaltrend */}
        <div className="flex flex-col items-center">
          <span className="text-4xl">📈</span>
          <div className="text-lg font-bold text-green-900">
            {quarterlyTrend !== null ? (quarterlyTrend > 0 ? '+' : '') + quarterlyTrend + '%' : '–'}
          </div>
          <div className="text-xs text-gray-500">Quarterly trend</div>
        </div>
        {/* Voorspelling */}
        <div className="flex flex-col items-center">
          <span className="text-4xl">🔮</span>
          <div className="text-lg font-bold text-purple-900">
            {nextPrediction ? `${nextPrediction}h` : '–'}
          </div>
          <div className="text-xs text-gray-500">Predicted next fast</div>
        </div>
        {/* Records */}
        <div className="flex flex-col items-center">
          <span className="text-4xl">🏅</span>
          <div className="text-xs text-gray-500">PRs</div>
          <div className="text-sm text-gray-700">Longest: {records.longestFast ? Math.round(records.longestFast) : '–'}h</div>
          <div className="text-sm text-gray-700">Most/wk: {records.mostFastsInWeek || '–'}</div>
          <div className="text-sm text-gray-700">Most/mo: {records.mostHoursInMonth ? Math.round(records.mostHoursInMonth) : '–'}h</div>
        </div>
        {/* Eenvoudige grafiek */}
        <div className="flex flex-col items-center">
          <span className="text-4xl">📊</span>
          <svg width="120" height="40">
            {monthlyChart.map((val, i) => (
              <rect
                key={i}
                x={i * 10}
                y={40 - (val / Math.max(...monthlyChart, 1)) * 35}
                width="8"
                height={(val / Math.max(...monthlyChart, 1)) * 35}
                fill="#6366f1"
                opacity={val > 0 ? 1 : 0.2}
              />
            ))}
          </svg>
          <div className="text-xs text-gray-500">Hours/month</div>
        </div>
      </div>

      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button onClick={() => setCurrentView('timer')} className="p-2 rounded-full hover:bg-gray-100 transition-colors mr-3">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-medium text-gray-800">Personal Dashboard</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border-b border-red-200">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <div className="p-6">
        {/* User Profile Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{user.displayName || 'Faster'}</h2>
                <p className="text-gray-600">{user.email}</p>
                <p className="text-sm text-gray-500">Fasting for {stats.accountAgeDays} days</p>
              </div>
            </div>
          </div>
        </div>

        {/* Yearly and Monthly Averages */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">📈 Your Fasting Patterns</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
              <div className="flex items-center mb-3">
                <Calendar className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-sm font-medium text-green-800">This Year</span>
              </div>
              <div className="space-y-2">
                <div>
                  <div className="text-2xl font-bold text-green-900">{stats.fastsPerYear}</div>
                  <div className="text-xs text-green-600">Total fasts</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-green-800">{Math.round(stats.hoursPerYear)}h</div>
                  <div className="text-xs text-green-600">Total hours</div>
                </div>
                <div className="text-xs text-green-600">
                  Average: {stats.fastsPerYear > 0 ? Math.round(stats.hoursPerYear / stats.fastsPerYear) : 0}h per fast
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-sky-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-center mb-3">
                <Calendar className="w-5 h-5 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-blue-800">This Month</span>
              </div>
              <div className="space-y-2">
                <div>
                  <div className="text-2xl font-bold text-blue-900">{stats.fastsPerMonth}</div>
                  <div className="text-xs text-blue-600">Total fasts</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-blue-800">{Math.round(stats.hoursPerMonth)}h</div>
                  <div className="text-xs text-blue-600">Total hours</div>
                </div>
                <div className="text-xs text-blue-600">
                  Projected yearly: {Math.round(stats.fastsPerMonth * 12)} fasts
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
              <div className="flex items-center mb-3">
                <BarChart3 className="w-5 h-5 text-purple-600 mr-2" />
                <span className="text-sm font-medium text-purple-800">All Time Averages</span>
              </div>
              <div className="space-y-2">
                <div>
                  <div className="text-2xl font-bold text-purple-900">{Math.round(stats.averageDuration)}h</div>
                  <div className="text-xs text-purple-600">Average duration</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-purple-800">{stats.completionRate}%</div>
                  <div className="text-xs text-purple-600">Success rate</div>
                </div>
                <div className="text-xs text-purple-600">
                  {stats.accountAgeDays > 0 ? Math.round((stats.totalFasts / stats.accountAgeDays) * 30) : 0} fasts/month avg
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Statistics Overview */}
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
              <div className="text-2xl font-bold text-green-900">{stats.totalHours}h</div>
              <div className="text-xs text-green-600">{Math.round(stats.totalHours / 24)} days total</div>
            </div>
            
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
              <div className="flex items-center mb-2">
                <BarChart3 className="w-5 h-5 text-purple-600 mr-2" />
                <span className="text-sm font-medium text-purple-800">Average Duration</span>
              </div>
              <div className="text-2xl font-bold text-purple-900">{stats.averageDuration}h</div>
            </div>
            
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
              <div className="flex items-center mb-2">
                <Award className="w-5 h-5 text-orange-600 mr-2" />
                <span className="text-sm font-medium text-orange-800">Longest Fast</span>
              </div>
              <div className="text-2xl font-bold text-orange-900">{Math.round(stats.longestFast)}h</div>
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
                  <div className="text-2xl font-bold text-emerald-900">{stats.ketosisHours}h</div>
                  <div className="text-xs text-emerald-600">Fat burning time</div>
                </div>
                <div>
                  <div className="text-sm text-emerald-700 mb-1">Autophagy Hours</div>
                  <div className="text-2xl font-bold text-emerald-900">{stats.autophagyHours}h</div>
                  <div className="text-xs text-emerald-600">Cellular cleaning time</div>
                </div>
                <div>
                  <div className="text-sm text-emerald-700 mb-1">Est. Cells Repaired</div>
                  <div className="text-xl font-bold text-emerald-900">{(stats.damagedCellsCleared / 1000000).toFixed(1)}M</div>
                  <div className="text-xs text-emerald-600">Damaged cells cleared</div>
                </div>
                <div>
                  <div className="text-sm text-emerald-700 mb-1">Growth Hormone Hours</div>
                  <div className="text-2xl font-bold text-emerald-900">{stats.growthHormoneHours}h</div>
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
                  <div className="text-3xl font-bold text-blue-900">{stats.completionRate}%</div>
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

        {/* Fast History */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📅 Recent Fasts</h3>
          {fastHistory.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-4">📊</div>
              <p>No fasting history yet. Start your first fast to see your progress!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {fastHistory.slice(0, 10).map(fast => (
                <div key={fast.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-800">
                      {fast.plannedDuration}h Fast
                    </h4>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      fast.status === 'completed'
                        ? 'bg-green-100 text-green-800' 
                        : fast.status === 'stopped_early'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {fast.status === 'completed' ? '✓ Completed' : 
                       fast.status === 'stopped_early' ? '⏱️ Stopped Early' : '🔄 Active'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                    <div>
                      <span className="font-medium">Date:</span> {new Date(fast.startTime).toLocaleDateString('nl-NL')}
                    </div>
                    <div>
                      <span className="font-medium">Duration:</span> {Math.round(fast.actualDuration || fast.plannedDuration)} hours
                    </div>
                  </div>
                  
                  {/* Enhanced phase information */}
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="text-xs text-gray-500 mb-2">Biological benefits achieved:</div>
                    <div className="flex flex-wrap gap-1">
                      {Math.round(fast.actualDuration || fast.plannedDuration) >= 12 && (
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                          Ketosis ({Math.max(0, Math.round(fast.actualDuration || fast.plannedDuration) - 12)}h)
                        </span>
                      )}
                      {Math.round(fast.actualDuration || fast.plannedDuration) >= 24 && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                          Autophagy ({Math.max(0, Math.round(fast.actualDuration || fast.plannedDuration) - 24)}h)
                        </span>
                      )}
                      {Math.round(fast.actualDuration || fast.plannedDuration) >= 48 && (
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                          Deep Autophagy
                        </span>
                      )}
                      {Math.round(fast.actualDuration || fast.plannedDuration) >= 72 && (
                        <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                          Immune Reset
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Achievements Section */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🏆 Achievements</h3>
          <div className="grid grid-cols-1 gap-3">
            {stats.totalFasts >= 5 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center">
                <span className="text-2xl mr-3">🎯</span>
                <div>
                  <div className="font-medium text-yellow-800">Dedicated Faster</div>
                  <div className="text-sm text-yellow-600">Completed 5+ fasts</div>
                </div>
              </div>
            )}
            
            {stats.longestFast >= 24 && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 flex items-center">
                <span className="text-2xl mr-3">🔄</span>
                <div>
                  <div className="font-medium text-purple-800">Autophagy Master</div>
                  <div className="text-sm text-purple-600">Reached 24+ hour fast</div>
                </div>
              </div>
            )}
            
            {stats.longestFast >= 48 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
                <span className="text-2xl mr-3">🛡️</span>
                <div>
                  <div className="font-medium text-green-800">Cellular Warrior</div>
                  <div className="text-sm text-green-600">Reached 48+ hour fast</div>
                </div>
              </div>
            )}

            {stats.immuneResets >= 1 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center">
                <span className="text-2xl mr-3">🌟</span>
                <div>
                  <div className="font-medium text-blue-800">Immune Reset Champion</div>
                  <div className="text-sm text-blue-600">Completed 72+ hour fast</div>
                </div>
              </div>
            )}
            
            {stats.completionRate >= 80 && stats.totalFasts >= 3 && (
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 flex items-center">
                <span className="text-2xl mr-3">💎</span>
                <div>
                  <div className="font-medium text-indigo-800">Consistency Champion</div>
                  <div className="text-sm text-indigo-600">80%+ completion rate</div>
                </div>
              </div>
            )}

            {stats.ketosisHours >= 100 && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-center">
                <span className="text-2xl mr-3">⚡</span>
                <div>
                  <div className="font-medium text-emerald-800">Ketosis Explorer</div>
                  <div className="text-sm text-emerald-600">100+ hours in ketosis</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryView;
