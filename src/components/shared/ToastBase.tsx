import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import { BaseToastProps } from 'react-native-toast-message';
import { Feather } from '@expo/vector-icons';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { a, l, td } from '../../constants/responsive';
import { fonts } from '@assets/fonts/fonts';

type ToastType = 'success' | 'error' | 'info';

const TOAST_COLORS: Record<ToastType, string> = {
  success: '#3FAE5A',
  error: '#D9534F',
  info: '#4387C5',
};

const TOAST_ICONS: Record<ToastType, keyof typeof Feather.glyphMap> = {
  success: 'check',
  error: 'alert-triangle',
  info: 'info',
};

export const ToastBase = ({
  text1,
  text2,
  type,
}: {
  text1?: string;
  text2?: string;
  type: ToastType;
}) => {
  const backgroundColor = TOAST_COLORS[type];
  const iconName = TOAST_ICONS[type];

  const scale = useSharedValue(0.94);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(-6);

  useEffect(() => {
    opacity.value = withTiming(1, {
      duration: 160,
      easing: Easing.out(Easing.quad),
    });

    translateY.value = withTiming(0, {
      duration: 220,
      easing: Easing.out(Easing.cubic),
    });

    scale.value = withSpring(1, {
      damping: 18,
      stiffness: 220,
      mass: 0.6,
    });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      {
        translateY: translateY.value,
      },
      {
        scale: scale.value,
      },
    ],
  }));

  return (
    <Animated.View style={[styles.wrapper, animatedStyle]}>
      <View
        style={[
          styles.container,
          {
            backgroundColor,
          },
        ]}
      >
        <View style={styles.highlight} />

        <View style={styles.iconContainer}>
          <Feather
            name={iconName}
            size={td(16)}
            color="#FFFFFF"
          />
        </View>

        <View style={styles.textContainer}>
          {text1 && (
            <Text
              style={styles.text1}
              
            >
              {text1}
            </Text>
          )}

          {text2 && (
            <Text
              style={styles.text2}
            
            >
              {text2}
            </Text>
          )}
        </View>
      </View>
    </Animated.View>
  );
};

export const toastConfig = {
  success: ({ text1, text2 }: BaseToastProps) => (
    <ToastBase
      text1={text1}
      text2={text2}
      type="success"
    />
  ),

  error: ({ text1, text2 }: BaseToastProps) => (
    <ToastBase
      text1={text1}
      text2={text2}
      type="error"
    />
  ),

  info: ({ text1, text2 }: BaseToastProps) => (
    <ToastBase
      text1={text1}
      text2={text2}
      type="info"
    />
  ),
};

const styles = StyleSheet.create({
  wrapper: {
    width: 'auto',
    alignSelf: 'center',
    maxWidth:"90%"
  },

  container: {
    minHeight: a(44),

    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: l(13),
    paddingVertical: a(7),

    borderRadius: l(22),

    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.16)',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.18,
    shadowRadius: 9,

    elevation: 6,

    overflow: 'hidden',
  },

  highlight: {
    position: 'absolute',

    top: 0,
    left: l(16),
    right: l(16),

    height: a(1),

    backgroundColor: 'rgba(255, 255, 255, 0.30)',
  },

  iconContainer: {
    width: a(25),
    height: a(25),

    alignItems: 'center',
    justifyContent: 'center',

    marginRight: l(8),

    borderRadius: a(13),

    backgroundColor: 'rgba(255, 255, 255, 0.14)',
  },

  textContainer: {
    flexShrink: 1,
    justifyContent: 'center',
  },

  text1: {
    fontSize: td(14),

    fontFamily: fonts.robotoMedium,

    color: '#FFFFFF',

    letterSpacing: 0,
  },

  text2: {
    marginTop: a(1),

    fontSize: td(12),

    fontFamily: fonts.robotoMedium,

    color: 'rgba(255, 255, 255, 0.78)',
  },
});