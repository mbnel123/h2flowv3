import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { KeepAwake } from 'expo-keep-awake';

// Import your contexts and hooks
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useTimerLogic } from '../hooks/useTimerLogic';

// Import components (to be created)
import CircularProgress from '../components/CircularProgress';
import PhaseDisplay from '../components/PhaseDisplay';
import StatsDisplay from '../components/StatsDisplay';

const { width, height } = Dimensions.get('window');

interface FastingPhase {
  hours: number;
  title: string;
  description: string;
  emoji: string;
}

const FASTING_PHASES: FastingPhase[] = [
  { hours: 0, title: "Fast Begins", description: "Using glucose from last meal", emoji: "🌟" },
  { hours: 6, title: "Glycogen Use", description: "Using stored energy", emoji: "⚡" },
  { hours: 12, title: "Ketosis Start", description: "Fat burning begins", emoji: "🔥" },
  { hours: 18, title: "Deep Ketosis", description: "Mental clarity improves", emoji: "🧠" },
  { hours: 24, title: "Autophagy", description: "Cellular repair starts", emoji: "🔄" },
  { hours: 48, title: "Deep Autophagy", description: "Maximum cleansing", emoji: "✨" },
  { hours: 72, title: "Immune Reset", description: "Complete renewal", emoji: "🛡️" }
];

export default function TimerScreen() {
  const { user } = useAuth();
  const { theme, isDark } = useTheme();
  const [showStopConfirmation, setShowStopConfirmation] = useState(false);

  // Use your timer logic hook (adapted for React Native)
  const {
    isActive,
    elapsedTime,
    targetHours,
    loading,
    fastingStreak,
    handleStartFast,
    pauseFast,
    resumeFast,
    stopFast,
  } = useTimerLogic(user?.uid);

  // Helper functions
  const getProgress = (): number => {
    if (!targetHours) return 0;
    const targetSeconds = targetHours * 3600;
    return Math.min((elapsedTime / targetSeconds) * 100, 100);
  };

  const getCurrentPhase = (): FastingPhase => {
    const hours = elapsedTime / 3600;
    return FASTING_PHASES.slice().reverse().find(phase => hours >= phase.hours) || FASTING_PHASES[0];
  };

  const getNextPhase = (): FastingPhase | null => {
    const hours = elapsedTime / 3600;
    return FASTING_PHASES.find(phase => hours < phase.hours) || null;
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    handleStartFast();
  };

  const handlePausePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    pauseFast();
  };

  const handleResumePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    resumeFast();
  };

  const handleStopPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setShowStopConfirmation(true);
  };

  const confirmStop = () => {
    stopFast();
    setShowStopConfirmation(false);
  };

  const currentPhase = getCurrentPhase();
  const nextPhase = getNextPhase();
  const progress = getProgress();

  // Keep screen awake during active fasting
  if (isActive) {
    KeepAwake.activate();
  } else {
    KeepAwake.deactivate();
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#111827' : '#F9FAFB' }]}>
      <LinearGradient
        colors={isDark ? ['#111827', '#1F2937', '#111827'] : ['#F9FAFB', '#F3F4F6', '#F9FAFB']}
        style={styles.gradient}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header with stats */}
          {fastingStreak && (
            <StatsDisplay 
              streak={fastingStreak} 
              isDark={isDark}
              isActive={isActive}
            />
          )}

          {/* Main Timer Circle */}
          <View style={styles.timerContainer}>
            <CircularProgress
              progress={progress}
              size={width * 0.7}
              strokeWidth={12}
              isDark={isDark}
            />
            
            {/* Timer Display */}
            <View style={styles.timerContent}>
              <Text style={[styles.timeText, { color: isDark ? '#F9FAFB' : '#111827' }]}>
                {formatTime(elapsedTime)}
              </Text>
              <Text style={[styles.targetText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                of {targetHours}h goal
              </Text>
              <Text style={[styles.progressText, { color: '#3B82F6' }]}>
                {Math.round(progress)}%
              </Text>
            </View>
          </View>

          {/* Current Phase */}
          {isActive && (
            <PhaseDisplay 
              currentPhase={currentPhase}
              nextPhase={nextPhase}
              elapsedTime={elapsedTime}
              isDark={isDark}
            />
          )}

          {/* Control Buttons */}
          <View style={styles.controlsContainer}>
            {!isActive ? (
              <Pressable
                style={[styles.primaryButton, styles.startButton]}
                onPress={handleStartPress}
                disabled={loading}
              >
                <LinearGradient
                  colors={['#3B82F6', '#1D4ED8']}
                  style={styles.buttonGradient}
                >
                  <Ionicons name="play" size={24} color="white" />
                  <Text style={styles.primaryButtonText}>Start Fast</Text>
                </LinearGradient>
              </Pressable>
            ) : (
              <View style={styles.activeControls}>
                <Pressable
                  style={[styles.secondaryButton, { borderColor: isDark ? '#374151' : '#E5E7EB' }]}
                  onPress={handlePausePress}
                  disabled={loading}
                >
                  <Ionicons name="pause" size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
                  <Text style={[styles.secondaryButtonText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                    Pause
                  </Text>
                </Pressable>

                <Pressable
                  style={[styles.secondaryButton, styles.stopButton]}
                  onPress={handleStopPress}
                  disabled={loading}
                >
                  <Ionicons name="stop" size={20} color="#EF4444" />
                  <Text style={[styles.secondaryButtonText, { color: '#EF4444' }]}>
                    Stop
                  </Text>
                </Pressable>
              </View>
            )}
          </View>
        </ScrollView>
      </LinearGradient>

      {/* Stop Confirmation Modal */}
      {showStopConfirmation && (
        <View style={styles.modalOverlay}>
          <View style={[styles.modal, { backgroundColor: isDark ? '#1F2937' : 'white' }]}>
            <Text style={[styles.modalTitle, { color: isDark ? '#F9FAFB' : '#111827' }]}>
              Stop Your Fast?
            </Text>
            <Text style={[styles.modalText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
              Are you sure you want to end your fast? You've been fasting for {formatTime(elapsedTime)}.
            </Text>
            
            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, { backgroundColor: isDark ? '#374151' : '#F3F4F6' }]}
                onPress={() => setShowStopConfirmation(false)}
              >
                <Text style={[styles.modalButtonText, { color: isDark ? '#F9FAFB' : '#111827' }]}>
                  Continue
                </Text>
              </Pressable>
              
              <Pressable
                style={[styles.modalButton, styles.modalStopButton]}
                onPress={confirmStop}
              >
                <Text style={styles.modalStopButtonText}>Stop Fast</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
  },
  timerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 40,
  },
  timerContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  targetText: {
    fontSize: 14,
    marginBottom: 8,
  },
  progressText: {
    fontSize: 18,
    fontWeight: '600',
  },
  controlsContainer: {
    width: '100%',
    marginTop: 40,
  },
  primaryButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  startButton: {
    height: 60,
  },
  buttonGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  activeControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  secondaryButton: {
    flex: 1,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderRadius: 12,
    gap: 8,
  },
  stopButton: {
    borderColor: '#EF4444',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modal: {
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 350,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalStopButton: {
    backgroundColor: '#EF4444',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  modalStopButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});
