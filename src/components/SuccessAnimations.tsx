import React, { useState, useEffect, useRef } from 'react';
import { Trophy, Star, Zap, Heart, Target, Award } from 'lucide-react';

// Success Animation Component
interface SuccessAnimationProps {
  type: 'milestone' | 'goal_reached' | 'phase_transition' | 'achievement_unlocked' | 'fast_completed';
  title: string;
  description: string;
  icon?: string;
  onClose: () => void;
  autoClose?: boolean;
  duration?: number;
}

export const SuccessAnimation: React.FC<SuccessAnimationProps> = ({ 
  type, 
  title, 
  description, 
  icon, 
  onClose, 
  autoClose = true, 
  duration = 4000 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    // Trigger entrance animation
    setTimeout(() => setIsVisible(true), 100);
    
    if (autoClose) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      setShouldRender(false);
      onClose();
    }, 500);
  };

  const getAnimationClasses = () => {
    const baseClasses = "fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-500";
    
    switch (type) {
      case 'milestone':
        return `${baseClasses} ${isVisible ? 'bg-black bg-opacity-50' : 'bg-transparent'}`;
      case 'phase_transition':
        return `${baseClasses} ${isVisible ? 'bg-gradient-to-br from-blue-900/30 to-purple-900/30' : 'bg-transparent'}`;
      case 'goal_reached':
        return `${baseClasses} ${isVisible ? 'bg-gradient-to-br from-green-900/30 to-emerald-900/30' : 'bg-transparent'}`;
      case 'achievement_unlocked':
        return `${baseClasses} ${isVisible ? 'bg-gradient-to-br from-yellow-900/30 to-orange-900/30' : 'bg-transparent'}`;
      case 'fast_completed':
        return `${baseClasses} ${isVisible ? 'bg-gradient-to-br from-purple-900/30 to-pink-900/30' : 'bg-transparent'}`;
      default:
        return `${baseClasses} ${isVisible ? 'bg-black bg-opacity-50' : 'bg-transparent'}`;
    }
  };

  const getCardClasses = () => {
    const baseClasses = "bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl transform transition-all duration-500";
    
    if (isVisible) {
      return `${baseClasses} scale-100 opacity-100 rotate-0`;
    } else {
      return `${baseClasses} scale-75 opacity-0 ${type === 'milestone' ? 'rotate-12' : '-rotate-6'}`;
    }
  };

  const getIconComponent = () => {
    switch (type) {
      case 'milestone':
        return <Target className="w-12 h-12 text-blue-600" />;
      case 'phase_transition':
        return <Zap className="w-12 h-12 text-purple-600" />;
      case 'goal_reached':
        return <Trophy className="w-12 h-12 text-green-600" />;
      case 'achievement_unlocked':
        return <Award className="w-12 h-12 text-yellow-600" />;
      case 'fast_completed':
        return <Heart className="w-12 h-12 text-pink-600" />;
      default:
        return <Star className="w-12 h-12 text-blue-600" />;
    }
  };

  if (!shouldRender) return null;

  return (
    <div className={getAnimationClasses()} onClick={handleClose}>
      <div className={getCardClasses()} onClick={(e) => e.stopPropagation()}>
        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-ping opacity-75`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random() * 2}s`
              }}
            ></div>
          ))}
        </div>

        {/* Main content */}
        <div className="relative z-10">
          {/* Icon or Emoji */}
          <div className="mb-6 flex justify-center">
            {icon ? (
              <div className="text-6xl animate-bounce">{icon}</div>
            ) : (
              <div className="animate-pulse">
                {getIconComponent()}
              </div>
            )}
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-3 animate-pulse">
            {title}
          </h2>

          {/* Description */}
          <p className="text-gray-600 mb-6 leading-relaxed">
            {description}
          </p>

          {/* Progress bar animation */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-6 overflow-hidden">
            <div 
              className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-2000 ease-out"
              style={{ 
                width: isVisible ? '100%' : '0%',
                transition: 'width 2s ease-out'
              }}
            ></div>
          </div>

          {/* Action button */}
          <button
            onClick={handleClose}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            Awesome! 🎉
          </button>
        </div>
      </div>
    </div>
  );
};

// COMPLETELY REWRITTEN Milestone Tracker Hook
export const useMilestoneTracker = () => {
  const [celebrations, setCelebrations] = useState<Array<{
    id: string;
    type: SuccessAnimationProps['type'];
    title: string;
    description: string;
    icon?: string;
  }>>([]);

  // Use refs to track milestones that have been shown - persist across re-renders
  const shownMilestonesRef = useRef<Set<number>>(new Set());
  const hasReachedGoalRef = useRef(false);
  const hasShownPersonalRecordRef = useRef(false);
  const hasCompletedFastRef = useRef(false);
  const lastCheckedHourRef = useRef(-1);

  const addCelebration = (celebration: Omit<SuccessAnimationProps, 'onClose'>) => {
    const id = `${Date.now()}-${Math.random()}`;
    console.log('🎉 Adding celebration:', celebration.title);
    setCelebrations(prev => [...prev, { ...celebration, id }]);
  };

  const removeCelebration = (id: string) => {
    console.log('🗑️ Removing celebration:', id);
    setCelebrations(prev => prev.filter(c => c.id !== id));
  };

  // Reset all tracking when a new fast starts
  const resetTracking = () => {
    console.log('🔄 Resetting milestone tracking');
    shownMilestonesRef.current = new Set();
    hasReachedGoalRef.current = false;
    hasShownPersonalRecordRef.current = false;
    hasCompletedFastRef.current = false;
    lastCheckedHourRef.current = -1;
    setCelebrations([]); // Clear any existing celebrations
  };

  // Check for milestone achievements - ONLY CALL WHEN HOUR CHANGES
  const checkMilestones = (elapsedHours: number) => {
    const currentHour = Math.floor(elapsedHours);
    
    // Only check if we've moved to a new hour
    if (currentHour <= lastCheckedHourRef.current) {
      return;
    }
    
    console.log(`🕐 Checking milestones for hour ${currentHour}, last checked: ${lastCheckedHourRef.current}`);
    lastCheckedHourRef.current = currentHour;

    const milestones = [
      { hours: 6, title: "Glycogen Depletion!", description: "Your body is now switching to fat for fuel. Great start!", icon: "⚡" },
      { hours: 12, title: "Ketosis Activated!", description: "Fat burning mode is now active. Mental clarity incoming!", icon: "🧠" },
      { hours: 16, title: "Growth Hormone Boost!", description: "Your growth hormone is surging. Recovery mode activated!", icon: "💪" },
      { hours: 18, title: "Deep Ketosis!", description: "You're in the zone! Maximum fat burning and mental focus.", icon: "🎯" },
      { hours: 24, title: "Autophagy Initiated!", description: "Cellular cleanup has begun. Your body is healing itself!", icon: "🔄" },
      { hours: 36, title: "Autophagy Peak!", description: "Maximum cellular renewal. You're a fasting warrior!", icon: "⚔️" },
      { hours: 48, title: "Deep Autophagy!", description: "Advanced cellular repair. Your body is rebuilding itself!", icon: "🛠️" },
      { hours: 72, title: "Immune System Reset!", description: "Complete immune system regeneration. Incredible achievement!", icon: "🛡️" }
    ];

    milestones.forEach(milestone => {
      if (elapsedHours >= milestone.hours && !shownMilestonesRef.current.has(milestone.hours)) {
        console.log(`🎯 Milestone reached: ${milestone.hours}h - ${milestone.title}`);
        shownMilestonesRef.current.add(milestone.hours);
        addCelebration({
          type: 'phase_transition',
          title: milestone.title,
          description: milestone.description,
          icon: milestone.icon
        });
      }
    });
  };

  // Check for goal completion
  const checkGoalCompletion = (targetHours: number, elapsedHours: number) => {
    if (elapsedHours >= targetHours && !hasReachedGoalRef.current) {
      console.log(`🏆 Goal reached: ${targetHours}h`);
      hasReachedGoalRef.current = true;
      addCelebration({
        type: 'goal_reached',
        title: "Goal Achieved!",
        description: `Amazing! You've completed your ${targetHours}h fast. Your dedication is inspiring!`,
        icon: "🏆"
      });
    }
  };

  // Check for personal records
  const checkPersonalRecord = (currentDuration: number, previousRecord: number) => {
    if (currentDuration > previousRecord && previousRecord > 0 && !hasShownPersonalRecordRef.current) {
      console.log(`📈 Personal record: ${currentDuration}h > ${previousRecord}h`);
      hasShownPersonalRecordRef.current = true;
      addCelebration({
        type: 'achievement_unlocked',
        title: "New Personal Record!",
        description: `You've beaten your previous record of ${Math.round(previousRecord)}h! You're getting stronger!`,
        icon: "📈"
      });
    }
  };

  // Check for fast completion (only called when fast actually ends)
  const checkFastCompletion = (actualDuration: number, targetDuration: number) => {
    if (hasCompletedFastRef.current) {
      console.log('🚫 Fast completion already shown');
      return;
    }
    
    console.log(`🏁 Fast completed: ${actualDuration}h / ${targetDuration}h`);
    hasCompletedFastRef.current = true;
    const completionRate = (actualDuration / targetDuration) * 100;
    
    if (completionRate >= 100) {
      addCelebration({
        type: 'fast_completed',
        title: "Fast Completed!",
        description: `Congratulations! You've successfully completed your ${targetDuration}h fast. Time to break it mindfully!`,
        icon: "🎊"
      });
    } else if (completionRate >= 80) {
      addCelebration({
        type: 'fast_completed',
        title: "Excellent Progress!",
        description: `You completed ${Math.round(completionRate)}% of your goal. That's still a fantastic achievement!`,
        icon: "👏"
      });
    } else if (completionRate >= 50) {
      addCelebration({
        type: 'fast_completed',
        title: "Good Effort!",
        description: `You made it ${Math.round(completionRate)}% of the way. Every fast is progress toward your goals!`,
        icon: "💪"
      });
    }
  };

  return {
    celebrations,
    addCelebration,
    removeCelebration,
    checkMilestones,
    checkGoalCompletion,
    checkPersonalRecord,
    checkFastCompletion,
    resetTracking
  };
};

// Floating Success Message Component (for smaller celebrations)
interface FloatingMessageProps {
  message: string;
  type: 'success' | 'info' | 'warning';
  duration?: number;
  onClose: () => void;
}

export const FloatingMessage: React.FC<FloatingMessageProps> = ({ 
  message, 
  type, 
  duration = 3000, 
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
    
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getTypeClasses = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500 text-white';
      case 'info':
        return 'bg-blue-500 text-white';
      case 'warning':
        return 'bg-yellow-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className={`fixed top-4 right-4 z-50 transform transition-all duration-300 ${
      isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <div className={`px-6 py-4 rounded-lg shadow-lg ${getTypeClasses()} max-w-sm`}>
        <div className="flex items-center">
          <span className="mr-2">
            {type === 'success' && '✅'}
            {type === 'info' && 'ℹ️'}
            {type === 'warning' && '⚠️'}
          </span>
          <p className="font-medium">{message}</p>
        </div>
      </div>
    </div>
  );
};

// Confetti Animation Component
export const ConfettiAnimation: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute w-3 h-3 opacity-80"
          style={{
            left: `${Math.random() * 100}%`,
            backgroundColor: ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'][Math.floor(Math.random() * 6)],
            animation: `confetti-fall 3s linear forwards`,
            animationDelay: `${Math.random() * 3}s`,
            transform: `rotate(${Math.random() * 360}deg)`
          }}
        />
      ))}
      
      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

// Progress Ring Component for visual milestone tracking
interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  showPercentage?: boolean;
  children?: React.ReactNode;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 120,
  strokeWidth = 8,
  color = '#3B82F6',
  showPercentage = true,
  children
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      
      <div className="absolute inset-0 flex items-center justify-center">
        {children || (showPercentage && (
          <span className="text-lg font-bold text-gray-700">
            {Math.round(progress)}%
          </span>
        ))}
      </div>
    </div>
  );
};

// Animated Counter Component
interface AnimatedCounterProps {
  value: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 1000,
  suffix = '',
  prefix = ''
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      setDisplayValue(Math.floor(progress * value));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [value, duration]);

  return (
    <span className="font-bold">
      {prefix}{displayValue.toLocaleString()}{suffix}
    </span>
  );
};

// Main component for TimerView integration
export const TimerCelebrations: React.FC<{
  celebrations: Array<{
    id: string;
    type: SuccessAnimationProps['type'];
    title: string;
    description: string;
    icon?: string;
  }>;
  onRemoveCelebration: (id: string) => void;
}> = ({ celebrations, onRemoveCelebration }) => {
  return (
    <>
      {celebrations.map((celebration) => (
        <SuccessAnimation
          key={celebration.id}
          type={celebration.type}
          title={celebration.title}
          description={celebration.description}
          icon={celebration.icon}
          onClose={() => onRemoveCelebration(celebration.id)}
        />
      ))}
    </>
  );
};
