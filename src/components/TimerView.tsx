import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Droplets, Info, Settings } from 'lucide-react';
import { User } from 'firebase/auth';
import { onAuthStateChange } from '../firebase/authService';
import { 
  startFast, 
  endFast, 
  getCurrentFast, 
  updateFastStatus,
  subscribeToCurrentFast,
  Fast 
} from '../firebase/databaseService';
import { notificationService } from '../services/notificationService.ts';
import { serviceWorkerManager } from '../services/serviceWorkerManager.ts';
import { FastTemplate, templateService } from '../services/templateService.ts';
import TemplateSelector from './TemplateSelector.tsx';
import { TimerCelebrations, useMilestoneTracker } from './SuccessAnimations.tsx';
import { ThemeToggle, useTheme } from '../contexts/ThemeContext.tsx';
import { 
  TimerLoadingSkeleton, 
  CircularProgress, 
  ConnectionStatus, 
  MultiDeviceActivity,
  TemplateInfo,
  PhaseInfo,
  NextPhaseInfo
} from './TimerComponents.tsx';

interface TimerViewProps {
  setCurrentView: (view: string) => void;
}

const TimerView: React.FC<TimerViewProps> = ({ setCurrentView }) => {
  const { resolvedTheme } = useTheme();

  // Firebase state
  const [user, setUser] = useState<User | null>(null);
  const [currentFast, setCurrentFast] = useState<Fast | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Real-time sync state
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [syncStatus, setSyncStatus] = useState<'connected' | 'connecting' | 'offline' | 'error'>('connecting');
  const [multiDeviceActivity, setMultiDeviceActivity] = useState<string | null>(null);

  // Phase notification state
  const [scheduledPhaseNotifications, setScheduledPhaseNotifications] = useState<string[]>([]);
  const [lastPhaseNotified, setLastPhaseNotified] = useState<number>(-1);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  // Background timer state
  const [backgroundTimerActive, setBackgroundTimerActive] = useState(false);
  const [serviceWorkerStatus, setServiceWorkerStatus] = useState<'loading' | 'active' | 'error' | 'unsupported'>('loading');

  // Template state
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<FastTemplate | null>(null);
  const [recentTemplates, setRecentTemplates] = useState<FastTemplate[]>([]);

  // Timer state
  const [isActive, setIsActive] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [targetHours, setTargetHours] = useState(24);
  const [dailyWaterIntake, setDailyWaterIntake] = useState(0);
  const [showStopConfirmation, setShowStopConfirmation] = useState(false);

  // Success animations state
  const [previousElapsedTime, setPreviousElapsedTime] = useState(0);
  const [personalRecord, setPersonalRecord] = useState(0);
  const [showCelebrations, setShowCelebrations] = useState(true);

  // Real-time listener ref
  const realtimeUnsubscribe = useRef<(() => void) | null>(null);

  // Success animations integration - FIXED
  const { 
    celebrations,
    removeCelebration,
    checkMilestones, 
    checkGoalCompletion, 
    checkPersonalRecord,
    checkFastCompletion,
    resetTracking // Add this
  } = useMilestoneTracker();

  // Fasting phases
  const fastingPhases = [
    { hours: 0, title: "Fast Begins", description: "Using glucose from last meal" },
    { hours: 6, title: "Glycogen Use", description: "Using stored energy" },
    { hours: 12, title: "Ketosis Start", description: "Fat burning begins" },
    { hours: 18, title: "Deep Ketosis", description: "Mental clarity improves" },
    { hours: 24, title: "Autophagy", description: "Cellular repair starts" },
    { hours: 48, title: "Deep Autophagy", description: "Maximum cleansing" },
    { hours: 72, title: "Immune Reset", description: "Complete renewal" }
  ];

  // Helper functions
  const getProgress = () => {
    const targetSeconds = targetHours * 3600;
    return Math.min((elapsedTime / targetSeconds) * 100, 100);
  };

  const getCurrentPhase = () => {
    const hours = elapsedTime / 3600;
    return fastingPhases.slice().reverse().find(phase => hours >= phase.hours) || fastingPhases[0];
  };

  const getNextPhase = () => {
    const hours = elapsedTime / 3600;
    return fastingPhases.find(phase => hours < phase.hours);
  };

  const getTimeToNextPhase = () => {
    const nextPhase = getNextPhase();
    if (!nextPhase) return null;
    const hoursToNext = nextPhase.hours - (elapsedTime / 3600);
    const hours = Math.floor(hoursToNext);
    const minutes = Math.floor((hoursToNext - hours) * 60);
    return { hours, minutes, nextPhase };
  };

  // Initialize services
  useEffect(() => {
    setNotificationPermission(notificationService.getPermissionStatus());
    
    const initServiceWorker = async () => {
      const success = await serviceWorkerManager.initializeServiceWorker();
      setServiceWorkerStatus(success ? 'active' : 'unsupported');
    };
    
    initServiceWorker();

    const updateRecentTemplates = () => {
      setRecentTemplates(templateService.getRecentlyUsed(3));
    };
    
    const unsubscribeTemplates = templateService.subscribe(updateRecentTemplates);
    updateRecentTemplates();
    
    return () => unsubscribeTemplates();
  }, []);

  // Auth and real-time setup
  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user);
      if (!user) {
        if (realtimeUnsubscribe.current) {
          realtimeUnsubscribe.current();
          realtimeUnsubscribe.current = null;
        }
        setCurrentView('auth');
      } else {
        setupRealtimeSync(user.uid);
      }
    });
    return () => unsubscribe();
  }, [setCurrentView]);

  // Setup real-time sync
  const setupRealtimeSync = async (userId: string) => {
    try {
      setSyncStatus('connecting');
      if (realtimeUnsubscribe.current) {
        realtimeUnsubscribe.current();
      }

      await loadCurrentFast(userId);

      const unsubscribe = subscribeToCurrentFast(userId, (updatedFast) => {
        handleRealtimeUpdate(updatedFast);
        setLastSyncTime(new Date());
        setSyncStatus('connected');
      });

      realtimeUnsubscribe.current = unsubscribe;
    } catch (err) {
      console.error('Failed to setup real-time sync:', err);
      setSyncStatus('error');
    }
  };

  // Handle real-time updates
  const handleRealtimeUpdate = (updatedFast: Fast | null) => {
    if (!updatedFast) {
      if (currentFast) {
        setMultiDeviceActivity('Fast ended on another device');
        setTimeout(() => setMultiDeviceActivity(null), 3000);
      }
      setCurrentFast(null);
      setIsActive(false);
      setStartTime(null);
      setElapsedTime(0);
      setDailyWaterIntake(0);
      return;
    }

    setCurrentFast(updatedFast);

    if (updatedFast.status === 'active') {
      setIsActive(true);
      const fastStartTime = new Date(updatedFast.startTime).getTime();
      setStartTime(fastStartTime);
      const now = Date.now();
      const elapsedSeconds = Math.floor((now - fastStartTime) / 1000);
      setElapsedTime(elapsedSeconds);
    } else {
      setIsActive(updatedFast.status === 'active');
    }

    setTargetHours(updatedFast.plannedDuration);
    const totalWater = updatedFast.waterIntake?.reduce((total, entry) => total + entry.amount, 0) || 0;
    setDailyWaterIntake(totalWater);
  };

  // Load current fast
  const loadCurrentFast = async (userId: string) => {
    try {
      setError(null);
      const result = await getCurrentFast(userId);
      
      if (result.error) {
        setError(`Failed to load data: ${result.error}`);
        setSyncStatus('error');
        return;
      }
      
      const { fast } = result;
      
      if (fast) {
        setCurrentFast(fast);
        
        if (fast.status === 'active') {
          setIsActive(true);
          const fastStartTime = new Date(fast.startTime).getTime();
          setStartTime(fastStartTime);
          const now = Date.now();
          const elapsedSeconds = Math.floor((now - fastStartTime) / 1000);
          setElapsedTime(elapsedSeconds);
        } else {
          setIsActive(false);
          setStartTime(null);
          setElapsedTime(0);
        }
        
        setTargetHours(fast.plannedDuration);
        const totalWater = fast.waterIntake?.reduce((total, entry) => total + entry.amount, 0) || 0;
        setDailyWaterIntake(totalWater);
      } else {
        setCurrentFast(null);
        setIsActive(false);
        setStartTime(null);
        setElapsedTime(0);
        setDailyWaterIntake(0);
      }
      
      setSyncStatus('connected');
    } catch (err) {
      console.error('loadCurrentFast error:', err);
      setError('Failed to load fasting data: ' + (err instanceof Error ? err.message : String(err)));
      setSyncStatus('error');
    } finally {
      setInitialLoading(false);
    }
  };

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && startTime) {
      interval = setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - startTime) / 1000);
        setPreviousElapsedTime(elapsedTime);
        setElapsedTime(elapsed);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, startTime]);

  // Milestone checking - COMPLETELY FIXED VERSION
  useEffect(() => {
    if (isActive && showCelebrations && elapsedTime > 0) {
      const currentHours = elapsedTime / 3600;
      
      // ONLY check milestones when we cross hour boundaries
      checkMilestones(currentHours);
      
      // Check goal completion
      checkGoalCompletion(targetHours, currentHours);
      
      // Check personal record
      if (personalRecord > 0) {
        checkPersonalRecord(currentHours, personalRecord);
      }
    }
  }, [Math.floor(elapsedTime / 3600), isActive, showCelebrations]); // Only trigger when HOUR changes

  // Reset tracking when starting a new fast
  useEffect(() => {
    if (isActive && startTime && previousElapsedTime === 0 && elapsedTime < 60) {
      // New fast started, reset all milestone tracking
      console.log('🆕 New fast detected, resetting tracking');
      resetTracking();
    }
  }, [isActive, startTime, elapsedTime, previousElapsedTime, resetTracking]);

  // Action handlers
  const handleStartFast = async () => {
    if (!user) {
      setError('Please log in to start fasting');
      return;
    }
    
    if (!targetHours || targetHours <= 0 || targetHours > 168) {
      setError('Please set a valid target duration in Settings (1-168 hours)');
      return;
    }

    if (!isOnline) {
      setError('Cannot start fast while offline');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await startFast(user.uid, targetHours);
      
      if (result.error) {
        setError(`Failed to start fast: ${result.error}`);
      } else if (result.id) {
        setLastPhaseNotified(-1);
        setPreviousElapsedTime(0);
        setShowCelebrations(true);
        
        // Reset milestone tracking for new fast
        resetTracking();
        
        if (notificationPermission !== 'granted') {
          const permission = await notificationService.requestPermission();
          setNotificationPermission(permission);
        }
        
        if (serviceWorkerStatus === 'active') {
          const backgroundSuccess = await serviceWorkerManager.startBackgroundTimer({
            userId: user.uid,
            fastId: result.id,
            startTime: new Date(),
            targetHours,
            plannedDuration: targetHours
          });
          
          if (backgroundSuccess) {
            setBackgroundTimerActive(true);
          }
        }
      } else {
        setError('Unexpected response from server');
      }
    } catch (err) {
      setError('Failed to start fast: ' + (err instanceof Error ? err.message : String(err)));
    }
    
    setLoading(false);
  };

  const pauseFast = async () => {
    if (!currentFast?.id || !isOnline) return;
    try {
      await updateFastStatus(currentFast.id, 'paused');
    } catch (err) {
      setError('Failed to pause fast');
    }
  };

  const resumeFast = async () => {
    if (!currentFast?.id || !isOnline) return;
    try {
      await updateFastStatus(currentFast.id, 'active');
    } catch (err) {
      setError('Failed to resume fast');
    }
  };

  const stopFast = async () => {
    if (!currentFast?.id) return;
    
    if (!isOnline) {
      setError('Cannot stop fast while offline');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await endFast(currentFast.id);
      if (error) {
        setError(error);
      } else {
        setShowStopConfirmation(false);
        
        if (showCelebrations) {
          checkFastCompletion(elapsedTime / 3600, targetHours);
        }
        
        if (backgroundTimerActive && user) {
          await serviceWorkerManager.stopBackgroundTimer(user.uid);
          setBackgroundTimerActive(false);
        }
      }
    } catch (err) {
      setError('Failed to end fast');
    }
    
    setLoading(false);
  };

  const handleSelectTemplate = (template: FastTemplate) => {
    setCurrentTemplate(template);
    setTargetHours(template.duration);
  };

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setSyncStatus('connecting');
    };

    const handleOffline = () => {
      setIsOnline(false);
      setSyncStatus('offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (realtimeUnsubscribe.current) {
        realtimeUnsubscribe.current();
      }
    };
  }, []);

  const currentPhase = getCurrentPhase();
  const nextPhaseInfo = getTimeToNextPhase();

  if (!user) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-theme ${
        resolvedTheme === 'dark' ? 'bg-gray-900' : 'bg-white'
      }`}>
        <div className="text-center">
          <div className="text-4xl mb-4">🔒</div>
          <p className={`transition-theme ${
            resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Please log in to use the timer
          </p>
        </div>
      </div>
    );
  }

  if (initialLoading) {
    return <TimerLoadingSkeleton />;
  }

  return (
    <div className={`min-h-screen flex flex-col transition-theme ${
      resolvedTheme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100'
    }`}>
      {/* Success Animations - FIXED */}
      {showCelebrations && (
        <TimerCelebrations
          celebrations={celebrations}
          onRemoveCelebration={(id) => {
            removeCelebration(id);
            console.log('🎉 Celebration completed');
          }}
        />
      )}

      {/* Header */}
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

      {error && (
        <div className={`p-4 border-b transition-theme ${
          resolvedTheme === 'dark'
            ? 'bg-red-900/20 border-red-800'
            : 'bg-red-50 border-red-200'
        }`}>
          <p className={`text-sm transition-theme ${
            resolvedTheme === 'dark' ? 'text-red-400' : 'text-red-600'
          }`}>
            {error}
          </p>
          <button 
            onClick={() => setError(null)}
            className={`text-xs mt-1 underline transition-theme ${
              resolvedTheme === 'dark' 
                ? 'text-red-300 hover:text-red-200' 
                : 'text-red-800 hover:text-red-900'
            }`}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Timer Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-4">
        {/* Current Template Info */}
        {currentTemplate && !isActive && (
          <TemplateInfo 
            template={currentTemplate}
            onRemove={() => setCurrentTemplate(null)}
          />
        )}

        <div className="relative mb-6">
          <CircularProgress 
            progress={getProgress()} 
            elapsedTime={elapsedTime}
            targetHours={targetHours}
          />
          <div className={`absolute top-4 right-4 rounded-full px-3 py-1 shadow-lg border transition-theme ${
            resolvedTheme === 'dark' 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}>
            <span className="text-sm font-semibold text-sky-600">{Math.round(getProgress())}%</span>
          </div>
        </div>
        
        {isActive && (
          <div className="text-center max-w-lg space-y-4">
            <PhaseInfo 
              currentPhase={currentPhase}
              dailyWaterIntake={dailyWaterIntake}
              elapsedTime={elapsedTime}
            />

            {nextPhaseInfo && (
              <NextPhaseInfo nextPhase={nextPhaseInfo} />
            )}
          </div>
        )}
      </div>

      {/* Control Buttons */}
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
                  onClick={() => handleSelectTemplate(template)}
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

        <div className="flex justify-center space-x-4">
          {!isActive ? (
            startTime ? (
              <>
                <button 
                  onClick={resumeFast} 
                  disabled={loading || !isOnline}
                  className="text-white px-12 py-4 rounded-2xl font-semibold text-lg transition-opacity hover:opacity-90 flex items-center shadow-lg disabled:opacity-50"
                  style={{background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)'}}
                >
                  <Play className="w-6 h-6 mr-3" />Resume Fast
                </button>
                <button 
                  onClick={() => setShowStopConfirmation(true)} 
                  disabled={loading || !isOnline}
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-2xl font-semibold transition-all flex items-center shadow-lg disabled:opacity-50"
                >
                  <Square className="w-5 h-5 mr-2" />Stop Fast
                </button>
              </>
            ) : (
              <div className="flex space-x-4">
                <button 
                  onClick={handleStartFast} 
                  disabled={loading || !isOnline}
                  className="text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-opacity hover:opacity-90 flex items-center shadow-lg disabled:opacity-50"
                  style={{background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)'}}
                >
                  <Play className="w-6 h-6 mr-3" />
                  {loading ? 'Starting...' : 'Start Fast'}
                </button>
                
                <button 
                  onClick={() => setShowTemplateSelector(true)} 
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
                onClick={pauseFast} 
                disabled={loading || !isOnline}
                className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-4 rounded-2xl font-semibold transition-all flex items-center shadow-lg disabled:opacity-50"
              >
                <Pause className="w-5 h-5 mr-2" />Pause
              </button>
              <button 
                onClick={() => setShowStopConfirmation(true)} 
                disabled={loading || !isOnline}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-4 rounded-2xl font-semibold transition-all shadow-lg disabled:opacity-50"
              >
                🍎 Break Fast
              </button>
            </>
          )}
        </div>
        
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
              onClick={() => setShowCelebrations(!showCelebrations)}
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

      {/* Stop Confirmation Modal */}
      {showStopConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-black/70 flex items-center justify-center z-50">
          <div className={`rounded-lg p-6 mx-4 max-w-sm w-full transition-theme ${
            resolvedTheme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h3 className={`text-lg font-semibold mb-4 transition-theme ${
              resolvedTheme === 'dark' ? 'text-gray-100' : 'text-gray-800'
            }`}>
              Stop Your Fast?
            </h3>
            <p className={`mb-6 transition-theme ${
              resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Are you sure you want to end your fast? You've been fasting for {Math.floor(elapsedTime / 3600)}h {Math.floor((elapsedTime % 3600) / 60)}m.
            </p>
            <div className="flex space-x-3">
              <button 
                onClick={() => setShowStopConfirmation(false)} 
                disabled={loading}
                className={`flex-1 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 ${
                  resolvedTheme === 'dark'
                    ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                Continue Fasting
              </button>
              <button 
                onClick={stopFast} 
                disabled={loading || !isOnline}
                className="flex-1 bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Stopping...' : 'Stop Fast'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Template Selector Modal */}
      {showTemplateSelector && user && (
        <TemplateSelector
          userId={user.uid}
          selectedDuration={targetHours}
          onSelectTemplate={handleSelectTemplate}
          onClose={() => setShowTemplateSelector(false)}
        />
      )}
    </div>
  );
};

export default TimerView;
