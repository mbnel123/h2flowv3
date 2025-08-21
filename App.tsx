import React from 'react';
import { View, Text, StyleSheet, StatusBar, useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';

const Tab = createBottomTabNavigator();

// Theme colors matching your webapp
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
  }
};

function TimerScreen() {
  const isDark = useColorScheme() === 'dark';
  const theme = isDark ? colors.dark : colors.light;

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
        {/* Timer Circle Placeholder */}
        <View style={[styles.timerContainer, { borderColor: theme.border }]}>
          <View style={[styles.timerCircle, { backgroundColor: theme.backgroundSecondary }]}>
            <Text style={[styles.timerText, { color: theme.text }]}>00:00:00</Text>
            <Text style={[styles.timerSubtext, { color: theme.textSecondary }]}>
              Ready to start
            </Text>
          </View>
        </View>

        {/* Phase Info */}
        <View style={[styles.phaseCard, { backgroundColor: theme.backgroundSecondary, borderColor: theme.border }]}>
          <Text style={[styles.phaseTitle, { color: theme.text }]}>
            🌟 Fast Begins
          </Text>
          <Text style={[styles.phaseDescription, { color: theme.textSecondary }]}>
            Using glucose from last meal
          </Text>
        </View>

        {/* Start Button */}
        <LinearGradient
          colors={['#3B82F6', '#1D4ED8']}
          style={styles.startButton}
        >
          <Text style={styles.startButtonText}>Start Fast</Text>
        </LinearGradient>
      </View>
    </LinearGradient>
  );
}

function WaterScreen() {
  const isDark = useColorScheme() === 'dark';
  const theme = isDark ? colors.dark : colors.light;

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
          Water Intake
        </Text>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Water Progress */}
        <View style={[styles.waterContainer, { backgroundColor: theme.backgroundSecondary, borderColor: theme.border }]}>
          <Text style={[styles.waterAmount, { color: theme.primary }]}>0ml</Text>
          <Text style={[styles.waterGoal, { color: theme.textSecondary }]}>of 2500ml goal</Text>
          
          {/* Progress Bar */}
          <View style={[styles.progressBar, { backgroundColor: theme.backgroundTertiary }]}>
            <View style={[styles.progressFill, { backgroundColor: theme.primary, width: '0%' }]} />
          </View>
        </View>

        {/* Quick Add Buttons */}
        <View style={styles.quickAddContainer}>
          {[250, 500, 750].map(amount => (
            <View 
              key={amount}
              style={[styles.quickAddButton, { backgroundColor: theme.backgroundSecondary, borderColor: theme.border }]}
            >
              <Text style={[styles.quickAddText, { color: theme.text }]}>+{amount}ml</Text>
            </View>
          ))}
        </View>
      </View>
    </LinearGradient>
  );
}

function HistoryScreen() {
  const isDark = useColorScheme() === 'dark';
  const theme = isDark ? colors.dark : colors.light;

  return (
    <LinearGradient
      colors={isDark 
        ? ['#111827', '#1F2937', '#111827'] 
        : ['#F9FAFB', '#F3F4F6', '#F9FAFB']
      }
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
  );
}

function SettingsScreen() {
  const isDark = useColorScheme() === 'dark';
  const theme = isDark ? colors.dark : colors.light;

  return (
    <LinearGradient
      colors={isDark 
        ? ['#111827', '#1F2937', '#111827'] 
        : ['#F9FAFB', '#F3F4F6', '#F9FAFB']
      }
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
  );
}

const TabIcon = ({ name, focused }: { name: string, focused: boolean }) => {
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
      {icons[name as keyof typeof icons]}
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
  screen: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
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
    padding: 20,
    alignItems: 'center',
  },
  timerContainer: {
    alignItems: 'center',
    marginVertical: 40,
  },
  timerCircle: {
    width: 280,
    height: 280,
    borderRadius: 140,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 8,
    borderColor: '#3B82F6',
  },
  timerText: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  timerSubtext: {
    fontSize: 16,
  },
  phaseCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 30,
    width: '100%',
    alignItems: 'center',
  },
  phaseTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  phaseDescription: {
    fontSize: 14,
    textAlign: 'center',
  },
  startButton: {
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
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
