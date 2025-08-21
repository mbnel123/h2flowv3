// src/screens/HistoryScreen.tsx
import React from 'react';
import { View, Text, SafeAreaView, StyleSheet, useColorScheme } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const colors = {
  light: {
    primary: '#3B82F6',
    background: '#FFFFFF',
    text: '#111827',
    textSecondary: '#6B7280',
    gradient: ['#F9FAFB', '#F3F4F6', '#F9FAFB']
  },
  dark: {
    primary: '#3B82F6',
    background: '#111827',
    text: '#F9FAFB',
    textSecondary: '#9CA3AF',
    gradient: ['#111827', '#1F2937', '#111827']
  }
};

const HistoryScreen: React.FC = () => {
  const isDark = useColorScheme() === 'dark';
  con
