function TimerScreen() {
  const isDark = useColorScheme() === 'dark';
  const theme = isDark ? colors.dark : colors.light;
  
  // Mock timer state - we'll replace this with real logic later
  const [isActive, setIsActive] = React.useState(false);
  const [elapsedTime, setElapsedTime] = React.useState(0);
  const [targetHours, setTargetHours] = React.useState(24);
  const [loading, setLoading] = React.useState(false);

  // Format time for display
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return {
      hours: hours.toString().padStart(2, '0'),
      minutes: minutes.toString().padStart(2, '0'),
      seconds: remainingSeconds.toString().padStart(2, '0')
    };
  };

  // Calculate progress percentage
  const getProgress = () => {
    const targetSeconds = targetHours * 3600;
    return Math.min((elapsedTime / targetSeconds) * 100, 100);
  };

  // Fasting phases
  const fastingPhases = [
    { hours: 0, title: "Fast Begins", description: "Using glucose from last meal", emoji: "🌟" },
    { hours: 6, title: "Glycogen Use", description: "Using stored energy", emoji: "⚡" },
    { hours: 12, title: "Ketosis Start", description: "Fat burning begins", emoji: "🔥" },
    { hours: 18, title: "Deep Ketosis", description: "Mental clarity improves", emoji: "🧠" },
    { hours: 24, title: "Autophagy", description: "Cellular repair starts", emoji: "🔄" },
    { hours: 48, title: "Deep Autophagy", description: "Maximum cleansing", emoji: "✨" },
    { hours: 72, title: "Immune Reset", description: "Complete renewal", emoji: "🛡️" }
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
    let interval: NodeJS.Timeout;
    
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
    setIsActive(true);
  };

  const handleStopFast = () => {
    setIsActive(false);
    setElapsedTime(0);
  };

  const currentPhase = getCurrentPhase();
  const nextPhase = getNextPhase();
  const timeDisplay = formatTime(elapsedTime);

  return (
    <LinearGradient
      colors={isDark 
        ? ['#111827', '#1F2937', '#111827'] 
        : ['#F9FAFB', '#F3F4F6', '#F9FAFB']
      }
      style={styles.screen}
    >
      <StatusBar 
        barStyle={isDark ? 'light-content' : 'dark-content'} 
        backgroundColor={theme.background}
      />
      
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          H2Flow Timer
        </Text>
        <View style={[styles.syncIndicator, { backgroundColor: theme.success }]}>
          <Text style={styles.syncText}>●</Text>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Timer Circle */}
        <View style={styles.timerContainer}>
          <View style={[styles.timerCircle, { backgroundColor: theme.backgroundSecondary, borderColor: theme.primary }]}>
            <Text style={[styles.timerText, { color: theme.text }]}>
              {timeDisplay.hours}:{timeDisplay.minutes}:{timeDisplay.seconds}
            </Text>
            <Text style={[styles.timerSubtext, { color: theme.textSecondary }]}>
              {isActive ? `${Math.round(getProgress())}% complete` : 'Ready to start'}
            </Text>
            {isActive && (
              <Text style={[styles.targetText, { color: theme.textSecondary }]}>
                Target: {targetHours}h
              </Text>
            )}
          </View>
          
          {/* Progress indicator */}
          {isActive && (
            <View style={[styles.progressIndicator, { backgroundColor: theme.backgroundSecondary, borderColor: theme.border }]}>
              <Text style={[styles.progressText, { color: theme.primary }]}>
                {Math.round(getProgress())}%
              </Text>
            </View>
          )}
        </View>

        {/* Phase Info */}
        <View style={[styles.phaseCard, { backgroundColor: theme.backgroundSecondary, borderColor: theme.border }]}>
          <Text style={[styles.phaseTitle, { color: theme.text }]}>
            {currentPhase.emoji} {currentPhase.title}
          </Text>
          <Text style={[styles.phaseDescription, { color: theme.textSecondary }]}>
            {currentPhase.description}
          </Text>
          
          {isActive && (
            <View style={styles.phaseStats}>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: theme.text }]}>
                  {Math.floor(elapsedTime / 3600)}h
                </Text>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                  Elapsed
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: theme.text }]}>
                  0ml
                </Text>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                  Water today
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Next Phase Info */}
        {isActive && nextPhase && (
          <View style={[styles.nextPhaseCard, { backgroundColor: theme.primary + '20', borderColor: theme.primary + '40' }]}>
            <Text style={[styles.nextPhaseTitle, { color: theme.primary }]}>
              Next: {nextPhase.emoji} {nextPhase.title}
            </Text>
            <Text style={[styles.nextPhaseDescription, { color: theme.primary }]}>
              In {Math.max(0, Math.floor((nextPhase.hours * 3600 - elapsedTime) / 3600))}h {Math.max(0, Math.floor(((nextPhase.hours * 3600 - elapsedTime) % 3600) / 60))}m
            </Text>
          </View>
        )}

        {/* Control Buttons */}
        <View style={styles.controlButtons}>
          {!isActive ? (
            <LinearGradient
              colors={['#3B82F6', '#1D4ED8']}
              style={styles.startButton}
            >
              <TouchableOpacity 
                onPress={handleStartFast}
                disabled={loading}
                style={styles.buttonTouchable}
                activeOpacity={0.8}
              >
                <Text style={styles.startButtonText}>Start Fast</Text>
              </TouchableOpacity>
            </LinearGradient>
          ) : (
            <View style={styles.activeControls}>
              <TouchableOpacity 
                onPress={() => setIsActive(false)}
                style={[styles.pauseButton, { backgroundColor: theme.warning }]}
                activeOpacity={0.8}
              >
                <Text style={[styles.pauseButtonText, { color: 'white' }]}>Pause</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={handleStopFast}
                style={[styles.stopButton, { backgroundColor: theme.error }]}
                activeOpacity={0.8}
              >
                <Text style={[styles.stopButtonText, { color: 'white' }]}>Stop Fast</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </LinearGradient>
  );
}
