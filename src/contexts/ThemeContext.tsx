import React, { createContext, useContext, useEffect, useState } from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';

// Theme types
type Theme = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

// Theme Context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Theme Provider Component
interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = 'system',
  storageKey = 'h2flow-theme'
}) => {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light');

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem(storageKey) as Theme;
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      setThemeState(savedTheme);
    } else {
      setThemeState(defaultTheme);
    }
  }, [defaultTheme, storageKey]);

  // Update resolved theme based on current theme and system preference
  useEffect(() => {
    const updateResolvedTheme = () => {
      if (theme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        setResolvedTheme(systemTheme);
      } else {
        setResolvedTheme(theme);
      }
    };

    updateResolvedTheme();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        updateResolvedTheme();
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    
    if (resolvedTheme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
  }, [resolvedTheme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem(storageKey, newTheme);
  };

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook to use theme
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Theme Toggle Button Component
interface ThemeToggleProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'icon' | 'dropdown' | 'switch';
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  size = 'md', 
  variant = 'icon',
  className = '' 
}) => {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  if (variant === 'icon') {
    return (
      <button
        onClick={toggleTheme}
        className={`${sizeClasses[size]} rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 flex items-center justify-center ${className}`}
        title={`Current theme: ${theme} (${resolvedTheme})`}
      >
        {resolvedTheme === 'dark' ? (
          <Moon className={`${iconSizes[size]} text-gray-600 dark:text-gray-300`} />
        ) : (
          <Sun className={`${iconSizes[size]} text-gray-600 dark:text-gray-300`} />
        )}
      </button>
    );
  }

  if (variant === 'dropdown') {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`${sizeClasses[size]} rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 flex items-center justify-center ${className}`}
        >
          {theme === 'system' ? (
            <Monitor className={`${iconSizes[size]} text-gray-600 dark:text-gray-300`} />
          ) : resolvedTheme === 'dark' ? (
            <Moon className={`${iconSizes[size]} text-gray-600 dark:text-gray-300`} />
          ) : (
            <Sun className={`${iconSizes[size]} text-gray-600 dark:text-gray-300`} />
          )}
        </button>

        {isOpen && (
          <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
            <button
              onClick={() => {
                setTheme('light');
                setIsOpen(false);
              }}
              className={`w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center ${
                theme === 'light' ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              <Sun className="w-4 h-4 mr-3" />
              Light
            </button>
            <button
              onClick={() => {
                setTheme('dark');
                setIsOpen(false);
              }}
              className={`w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center ${
                theme === 'dark' ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              <Moon className="w-4 h-4 mr-3" />
              Dark
            </button>
            <button
              onClick={() => {
                setTheme('system');
                setIsOpen(false);
              }}
              className={`w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center ${
                theme === 'system' ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              <Monitor className="w-4 h-4 mr-3" />
              System
            </button>
          </div>
        )}

        {isOpen && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
        )}
      </div>
    );
  }

  if (variant === 'switch') {
    return (
      <label className={`relative inline-flex items-center cursor-pointer ${className}`}>
        <input
          type="checkbox"
          className="sr-only"
          checked={resolvedTheme === 'dark'}
          onChange={toggleTheme}
        />
        <div className={`relative w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full transition-colors duration-200 ${
          resolvedTheme === 'dark' ? 'bg-blue-600' : ''
        }`}>
          <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 flex items-center justify-center ${
            resolvedTheme === 'dark' ? 'transform translate-x-5' : ''
          }`}>
            {resolvedTheme === 'dark' ? (
              <Moon className="w-3 h-3 text-blue-600" />
            ) : (
              <Sun className="w-3 h-3 text-yellow-500" />
            )}
          </div>
        </div>
      </label>
    );
  }

  return null;
};

// Dark mode utility classes for components
export const darkModeClasses = {
  // Backgrounds
  bg: {
    primary: 'bg-white dark:bg-gray-900',
    secondary: 'bg-gray-50 dark:bg-gray-800',
    tertiary: 'bg-gray-100 dark:bg-gray-700',
    card: 'bg-white dark:bg-gray-800',
    overlay: 'bg-black/50 dark:bg-black/70'
  },
  
  // Text colors
  text: {
    primary: 'text-gray-900 dark:text-gray-100',
    secondary: 'text-gray-600 dark:text-gray-400',
    tertiary: 'text-gray-500 dark:text-gray-500',
    muted: 'text-gray-400 dark:text-gray-600'
  },
  
  // Borders
  border: {
    primary: 'border-gray-200 dark:border-gray-700',
    secondary: 'border-gray-300 dark:border-gray-600',
    light: 'border-gray-100 dark:border-gray-800'
  },
  
  // Interactive elements
  hover: {
    bg: 'hover:bg-gray-50 dark:hover:bg-gray-800',
    bgSecondary: 'hover:bg-gray-100 dark:hover:bg-gray-700'
  },
  
  // Gradients (dark mode friendly)
  gradient: {
    primary: 'from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20',
    secondary: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
    accent: 'from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20'
  }
};

// Auto dark mode activation based on time
export const useAutoDarkMode = (startHour = 20, endHour = 7) => {
  const { theme, setTheme } = useTheme();
  
  useEffect(() => {
    if (theme !== 'system') return;
    
    const checkTime = () => {
      const now = new Date();
      const hour = now.getHours();
      
      const isDarkTime = hour >= startHour || hour < endHour;
      
      // This would require extending the theme system to support auto modes
      // For now, we'll just track if it's "dark time"
      console.log(`Auto dark mode: ${isDarkTime ? 'enabled' : 'disabled'} (${hour}:00)`);
    };
    
    checkTime();
    const interval = setInterval(checkTime, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [theme, startHour, endHour, setTheme]);
};
