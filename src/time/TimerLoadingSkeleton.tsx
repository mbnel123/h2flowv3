// src/components/timer/TimerLoadingSkeleton.tsx
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface TimerLoadingSkeletonProps {
  theme: {
    gradient: string[];
    background: string;
    backgroundSecondary: string;
    border: string;
    text: string;
  };
}

const SkeletonItem: React.FC<{ width: number; height: number; style?: any; theme: any }> = ({ 
  width, 
  height, 
  style, 
  theme 
}) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop
