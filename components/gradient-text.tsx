import React from 'react';
import { Text, StyleSheet } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';

type GradientTextProps = {
  children: string;
  className?: string;
  style?: object;
};

/**
 * Renders text with a vertical gradient from white (top) to gray (bottom).
 * Uses MaskedView so the gradient is visible only through the text shape.
 */
export function GradientText({ children, className, style }: GradientTextProps) {
  return (
    <MaskedView
      maskElement={
        <Text className={className} style={[styles.maskText, style]}>
          {children}
        </Text>
      }
      style={styles.maskContainer}
    >
      <LinearGradient
        colors={['#ffffff', '#a3a3a3']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
    </MaskedView>
  );
}

const styles = StyleSheet.create({
  maskContainer: {
    alignSelf: 'center',
  },
  maskText: {
    backgroundColor: 'transparent',
  },
});
