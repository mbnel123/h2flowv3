import React from 'react';
import { View, Text, StyleSheet, StatusBar, useColorScheme, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle } from 'react-native-svg';

const Tab = createBottomTabNavigator();
const { width, height } = Dimensions.get('window');

// Theme colors matching your webapp exactly
const colors = {
  light: {
    primary: '#3B82F6',
    secondary: '#1D4ED8', 
    background: '#FFFFFF',
    backgroundSecondary: '#F9FAFB',
    backgroundTertiary: '#F3F4F6',
    text: '#111827',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    gradient: ['#F9FAFB', '#F3F4F6', '#F9FAFB']
  },
  dark: {
    primary: '#3B82F6',
    secondary: '#1D4ED8',
    background: '#111827',
    backgroundSecondary: '#1F2937',
    backgroundTertiary: '#374151',
    text: '#F9FAFB',
    textSecondary: '#9CA3AF',
    border: '#374151',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    gradient: ['#111827', '#1F2937', '#111827']
  }
};

// Circular Progress Component (exact match to webapp)
const CircularProgress = ({ progress, elapsedTime, targetHours, theme }) => {
  const size = 320;
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return {
      hours: hours.toString().padStart(2, '0'),
      minutes: minutes.toString().padStart(2, '0'),
      seconds: remainingSeconds.toString().padStart(2, '0')
    };
  };

  const timeDisplay = formatTime(elapsedTime);

  return (
    <View style={styles.circularProgressContainer}>
      <Svg width={size} height={size} style={styles.progressSvg}>
        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={theme.border}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#gradient)"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7DD3FC" />
            <stop offset="50%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0EA5E9" />
          </linearGradient>
        </defs>
      </Svg>
      
      {/* Center content */}
      <View style={[styles.centerContent, { backgroundColor: theme.background, borderColor: theme.border }]}>
        <Text style={[styles.mainTime, { color: theme.text }]}>
          {timeDisplay.hours}
          <Text style={[styles.timeUnit, { color: theme.textSecondary }]}>h</Text>
        </Text>
        <Text style={[styles.subTime, { color: theme.text }]}>
          {timeDisplay.minutes}
          <Text style={[styles.timeUnit, { color: theme.textSecondary }]}>m</Text>
          {' '}
          {timeDisplay.seconds}
          <Text style={[styles.timeUnit, { color: theme.textSecondary }]}>s</Text>
        </Text>
        <Text style={[styles.targetText, { color: theme.textSecondary }]}>
          Target: {targetHours} hours
        </Text>
      </View>

      {/* Progress badge */}
      <View style={[styles.progressBadge, { backgroundColor: theme.background, borderColor: theme.border }]}>
        <Text style={[styles.progressText, { color: theme.primary }]}>
          {Math.round(progress)}%
        </Text>
      </View>
    </View>
  );
};

function TimerScreen() {
  const isDark = useColorScheme() === 'dark';
  const theme = isDark ? colors.dark : colors.light;
  
  const [isActive, setIsActive] = React.useState(false);
  const [elapsedTime, setElapsedTime] = React.useState(0);
  const [targetHours, setTargetHours] = React.useState(24);
  const [loading, setLoading] = React.useState(false);

  // Calculate progress percentage
  const getProgress = () => {
    const targetSeconds = targetHours * 3600;
    return Math.min((elapsedTime / targetSeconds) * 100, 100);
  };

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

  // Get current phase
  const getCurrentPhase = () => {
    const hours = elapsedTime / 3600;
    return fastingPhases.slice().reverse().find(phase => hours >= phase.hours) || fastingPhases[0];
  };

  // Get next phase
  const getNextPhase = () => {
    const hours = elapsedTime / 3600;
    return fastingPhases.find(phase => hours < phase.hours);
  };

  // Timer logic
  React.useEffect(() => {
    let interval;
    
    if (isActive) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive]);

  const handleStartFast = () => {
    console.log('Starting fast...');
    setIsActive(true);
  };

  const handleStopFast = () => {
    console.log('Stopping fast...');
    setIsActive(false);
    setElapsedTime(0);
  };

  const handlePauseFast = () => {
    console.log('Pausing fast...');
    setIsActive(false);
  };

  const currentPhase = getCurrentPhase();
  const nextPhase = getNextPhase();

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={theme.gradient}
        style={styles.screen}
      >
        <StatusBar 
          barStyle={isDark ? 'light-content' : 'dark-content'} 
          backgroundColor="transparent"
          translucent
        />
        
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: theme.border }]}>
          <View style={styles.headerLeft}>
            <View style={[styles.appIcon, { backgroundColor: theme.primary }]}>
              <Text style={styles.appIconText}>H₂F</Text>
            </View>
            <View>
              <Text style={[styles.headerTitle, { color: theme.text }]}>H2Flow</Text>
              <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>Extended Water Fasting</Text>
            </View>
          </View>
          <View style={[styles.syncIndicator, { backgroundColor: theme.success }]}>
            <Text style={styles.syncText}>●</Text>
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          {/* Integrated Stats (if active) */}
          {isActive && (
            <View style={[styles.statsCard, { backgroundColor: theme.backgroundSecondary, borderColor: theme.border }]}>
              <View style={styles.statRow}>
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: theme.text }]}>0</Text>
                  <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Current Streak</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: theme.text }]}>0ml</Text>
                  <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Water Today</Text>
                </View>
              </View>
            </View>
          )}

          {/* Circular Progress */}
          <CircularProgress 
            progress={getProgress()} 
            elapsedTime={elapsedTime}
            targetHours={targetHours}
            theme={theme}
          />

          {/* Phase Info */}
          {isActive && (
            <View style={[styles.phaseCard, { backgroundColor: theme.background, borderColor: theme.border }]}>
              <Text style={[styles.phaseTitle, { color: theme.text }]}>
                {currentPhase.title}
              </Text>
              <Text style={[styles.phaseDescription, { color: theme.textSecondary }]}>
                {currentPhase.description}
              </Text>
              
              <View style={styles.phaseStats}>
                <View style={styles.phaseStatItem}>
                  <Text style={[styles.phaseStatValue, { color: theme.text }]}>
                    0ml
                  </Text>
                  <Text style={[styles.phaseStatLabel, { color: theme.textSecondary }]}>
                    Water today
                  </Text>
                </View>
                <View style={styles.phaseStatItem}>
                  <Text style={[styles.phaseStatValue, { color: theme.text }]}>
                    {Math.floor(elapsedTime / 3600)}h
                  </Text>
                  <Text style={[styles.phaseStatLabel, { color: theme.textSecondary }]}>
                    Elapsed
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Next Phase Info */}
          {isActive && nextPhase && (
            <View style={[styles.nextPhaseCard, { 
              backgroundColor: isDark ? 'rgba(56, 189, 248, 0.1)' : 'rgba(56, 189, 248, 0.05)',
              borderColor: isDark ? 'rgba(56, 189, 248, 0.3)' : 'rgba(56, 189, 248, 0.2)'
            }]}>
              <Text style={[styles.nextPhaseLabel, { color: theme.primary }]}>
                Next: {nextPhase.title}
              </Text>
              <Text style={[styles.nextPhaseTime, { color: theme.primary }]}>
                {Math.max(0, Math.floor((nextPhase.hours * 3600 - elapsedTime) / 3600))}h {Math.max(0, Math.floor(((nextPhase.hours * 3600 - elapsedTime) % 3600) / 60))}m remaining
              </Text>
              <Text style={[styles.nextPhaseDescription, { color: theme.primary }]}>
                {nextPhase.description}
              </Text>
            </View>
          )}
        </View>

        {/* Control Buttons */}
        <View style={styles.controlsContainer}>
          {!isActive ? (
            <TouchableOpacity 
              onPress={handleStartFast}
              disabled={loading}
              activeOpacity={0.8}
              style={styles.startButtonContainer}
            >
              <LinearGradient
                colors={['#3B82F6', '#1D4ED8']}
                style={styles.startButton}
              >
                <Text style={styles.startButtonText}>Start Fast</Text>
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <View style={styles.activeControls}>
              <TouchableOpacity 
                onPress={handlePauseFast}
                style={[styles.controlButton, { backgroundColor: theme.warning }]}
                activeOpacity={0.8}
              >
                <Text style={styles.controlButtonText}>Pause</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={handleStopFast}
                style={[styles.controlButton, { backgroundColor: theme.error }]}
                activeOpacity={0.8}
              >
                <Text style={styles.controlButtonText}>Stop Fast</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

function WaterScreen() {
  const isDark = useColorScheme() === 'dark';
  const theme = isDark ? colors.dark : colors.light;

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={theme.gradient}
        style={styles.screen}
      >
        <View style={[styles.header, { borderBottomColor: theme.border }]}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            Water Intake
          </Text>
        </View>

        <View style={styles.content}>
          <View style={[styles.waterContainer, { backgroundColor: theme.backgroundSecondary, borderColor: theme.border }]}>
            <Text style={[styles.waterAmount, { color: theme.primary }]}>0ml</Text>
            <Text style={[styles.waterGoal, { color: theme.textSecondary }]}>of 2500ml goal</Text>
            
            <View style={[styles.progressBar, { backgroundColor: theme.backgroundTertiary }]}>
              <View style={[styles.progressFill, { backgroundColor: theme.primary, width: '0%' }]} />
            </View>
          </View>

          <View style={styles.quickAddContainer}>
            {[250, 500, 750].map(amount => (
              <TouchableOpacity 
                key={amount}
                style={[styles.quickAddButton, { backgroundColor: theme.backgroundSecondary, borderColor: theme.border }]}
                activeOpacity={0.7}
              >
                <Text style={[styles.quickAddText, { color: theme.text }]}>+{amount}ml</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

function HistoryScreen() {
  const isDark = useColorScheme() === 'dark';
  const theme = isDark ? colors.dark : colors.light;

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={theme.gradient}
        style={styles.screen}
      >
        <View style={[styles.header, { borderBottomColor: theme.border }]}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            Fasting History
          </Text>
        </View>
        
        <View style={styles.content}>
          <View style={[styles.emptyState, { backgroundColor: theme.backgroundSecondary }]}>
            <Text style={[styles.emptyStateText, { color: theme.textSecondary }]}>
              📊 No fasting sessions yet
            </Text>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

function SettingsScreen() {
  const isDark = useColorScheme() === 'dark';
  const theme = isDark ? colors.dark : colors.light;

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={theme.gradient}
        style={styles.screen}
      >
        <View style={[styles.header, { borderBottomColor: theme.border }]}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            Settings
          </Text>
        </View>
        
        <View style={styles.content}>
          <View style={[styles.settingsCard, { backgroundColor: theme.backgroundSecondary, borderColor: theme.border }]}>
            <Text style={[styles.settingsTitle, { color: theme.text }]}>
              ⚙️ App Settings
            </Text>
            <Text style={[styles.settingsSubtitle, { color: theme.textSecondary }]}>
              Notifications, themes, and more
            </Text>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const TabIcon = ({ name, focused }) => {
  const isDark = useColorScheme() === 'dark';
  const theme = isDark ? colors.dark : colors.light;
  
  const icons = {
    Timer: '⏱️',
    Water: '💧', 
    History: '📊',
    Settings: '⚙️'
  };

  return (
    <Text style={{ 
      fontSize: 24, 
      opacity: focused ? 1 : 0.6,
      color: focused ? theme.primary : theme.textSecondary 
    }}>
      {icons[name]}
    </Text>
  );
};

export default function App() {
  const isDark = useColorScheme() === 'dark';
  const theme = isDark ? colors.dark : colors.light;

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon name={route.name} focused={focused} />
          ),
          tabBarStyle: {
            backgroundColor: theme.background,
            borderTopColor: theme.border,
            borderTopWidth: 1,
            paddingBottom: 8,
            paddingTop: 8,
            height: 80,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
            marginTop: 4,
          },
          tabBarActiveTintColor: theme.primary,
          tabBarInactiveTintColor: theme.textSecondary,
        })}
      >
        <Tab.Screen name="Timer" component={TimerScreen} />
        <Tab.Screen name="Water" component={WaterScreen} />
        <Tab.Screen name="History" component={HistoryScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  screen: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  appIconText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  syncIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  syncText: {
    fontSize: 8,
    color: 'white',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    alignItems: 'center',
  },
  statsCard: {
    width: '100%',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  circularProgressContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  progressSvg: {
    transform: [{ rotate: '-90deg' }],
  },
  centerContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  mainTime: {
    fontSize: 48,
    fontWeight: '300',
    marginBottom: 4,
  },
  subTime: {
    fontSize: 20,
    fontWeight: '300',
    marginBottom: 8,
  },
  timeUnit: {
    fontSize: 16,
  },
  targetText: {
    fontSize: 14,
    fontWeight: '500',
  },
  progressBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
  },
  phaseCard: {
    width: '100%',
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  phaseTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  phaseDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  phaseStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  phaseStatItem: {
    alignItems: 'center',
  },
  phaseStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  phaseStatLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  nextPhaseCard: {
    width: '100%',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 20,
    alignItems: 'center',
  },
  nextPhaseLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  nextPhaseTime: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  nextPhaseDescription: {
    fontSize: 14,
    textAlign: 'center',
  },
  controlsContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  startButtonContainer: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  startButton: {
    paddingVertical: 18,
    paddingHorizontal: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  activeControls: {
    flexDirection: 'row',
    gap: 12,
  },
  controlButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  controlButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  waterContainer: {
    padding: 30,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    width: '100%',
    marginBottom: 30,
  },
  waterAmount: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  waterGoal: {
    fontSize: 16,
    marginBottom: 20,
  },
  progressBar: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  quickAddContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  quickAddButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  quickAddText: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    padding: 40,
    borderRadius: 16,
    alignItems: 'center',
    width: '100%',
  },
  emptyStateText: {
    fontSize: 18,
    textAlign: 'center',
  },
  settingsCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    width: '100%',
  },
  settingsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  settingsSubtitle: {
    fontSize: 14,
  },
});
