import React, { useState } from 'react';
import TimerView from './components/TimerView';
import HistoryView from './components/HistoryView';
import InfoView from './components/InfoView';
import WaterView from './components/WaterView';
import SettingsView from './components/SettingsView';
import AuthComponent from './components/AuthComponent';
import WelcomeScreen from './components/WelcomeScreen';

function App() {
  const [currentView, setCurrentView] = useState<string>('welcome');

  const renderCurrentView = () => {
    switch (currentView) {
      case 'welcome':
        return <WelcomeScreen setCurrentView={setCurrentView} />;
      case 'auth':
        return <AuthComponent setCurrentView={setCurrentView} />;
      case 'timer':
        return <TimerView setCurrentView={setCurrentView} />;
      case 'history':
        return <HistoryView setCurrentView={setCurrentView} />;
      case 'info':
        return <InfoView setCurrentView={setCurrentView} />;
      case 'water':
        return <WaterView setCurrentView={setCurrentView} />;
      case 'settings':
        return <SettingsView setCurrentView={setCurrentView} />;
      default:
        return <TimerView setCurrentView={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen transition-theme bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {renderCurrentView()}
    </div>
  );
}

export default App;
