// src/components/layout/header/SearchHeaderScreens.tsx
import React, { useEffect, useState, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, TextInput, Animated, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { a, l, td } from '@/constants/responsive';
import { Colors } from '@/colors/color';
import { fonts } from '@/assets/fonts/fonts';

type HeaderScreensProps = {
  title: string;
  placeHolder: string;
  onBack: () => void;
  searchValue: string;
  onSearchChange: (text: string) => void;
  scrollY: Animated.Value;
};

export const SearchHeaderScreens = ({
  title,
  placeHolder,
  onBack,
  searchValue,
  onSearchChange,
  scrollY
}: HeaderScreensProps) => {
  const insets = useSafeAreaInsets();

  // 1. Controle de Estado do StatusBar
  const [barStyle, setBarStyle] = useState<'light-content' | 'dark-content'>('light-content');
  const currentBarStyle = useRef<'light-content' | 'dark-content'>('light-content');

  // Interceptador do valor animado para atualizar o StatusBar no exato momento da transição
  useEffect(() => {
    const threshold = a(40); // Ponto exato onde o fade das cores ocorre

    const listenerId = scrollY.addListener(({ value }) => {
      const nextStyle = value > threshold ? 'dark-content' : 'light-content';
      
      // O useRef evita que o setBarStyle seja chamado milhares de vezes por segundo no scroll
      if (currentBarStyle.current !== nextStyle) {
        currentBarStyle.current = nextStyle;
        setBarStyle(nextStyle);
      }
    });

    return () => {
      scrollY.removeListener(listenerId);
    };
  }, [scrollY]);

  // 2. Interpolações de layout e cor 
  const searchHeight = scrollY.interpolate({
    inputRange: [0, a(60)],
    outputRange: [a(50), 0],
    extrapolate: 'clamp'
  });

  const searchOpacity = scrollY.interpolate({
    inputRange: [0, a(40)],
    outputRange: [1, 0],
    extrapolate: 'clamp'
  });

  const searchMargin = scrollY.interpolate({
    inputRange: [0, a(60)],
    outputRange: [a(10), 0],
    extrapolate: 'clamp'
  });

  const gradientOpacity = scrollY.interpolate({
    inputRange: [0, a(40)],
    outputRange: [1, 0],
    extrapolate: 'clamp'
  });

  const borderOpacity = scrollY.interpolate({
    inputRange: [0, a(50)],
    outputRange: ['rgba(0,0,0,0)', 'rgba(0,0,0,0.1)'],
    extrapolate: 'clamp'
  });

  const lightContentOpacity = scrollY.interpolate({
    inputRange: [0, a(40)],
    outputRange: [1, 0],
    extrapolate: 'clamp'
  });

  const darkContentOpacity = scrollY.interpolate({
    inputRange: [0, a(40)],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  });

  return (
    <Animated.View 
      style={[
        styles.headerWrapper, 
        { paddingTop: insets.top, borderBottomColor: borderOpacity }
      ]}
    >
      {/* Aplicação Dinâmica do StatusBar */}
      <StatusBar 
        barStyle={barStyle} 
        backgroundColor="transparent" 
        translucent 
        animated={true} 
      />

      <Animated.View style={[StyleSheet.absoluteFill, { opacity: gradientOpacity }]}>
        <LinearGradient
          colors={['rgba(255, 122, 0, 1)', 'rgba(255, 154, 60, 0.8)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      <View style={styles.topRow}>
        <TouchableOpacity onPress={onBack} style={styles.btnBack}>
          <Animated.View style={{ position: 'absolute', opacity: lightContentOpacity }}>
            <Ionicons name="chevron-back-outline" size={td(24)} color="#FFFFFF" />
          </Animated.View>
          <Animated.View style={{ opacity: darkContentOpacity }}>
            <Ionicons name="chevron-back-outline" size={td(24)} color={Colors.corText || '#1E293B'} />
          </Animated.View>
        </TouchableOpacity>

        <View style={styles.titleWrapper}>
          <Animated.Text numberOfLines={1} style={[styles.title, { color: '#FFFFFF', position: 'absolute', opacity: lightContentOpacity }]}>
            {title}
          </Animated.Text>
          <Animated.Text numberOfLines={1} style={[styles.title, { color: Colors.corText || '#1E293B', opacity: darkContentOpacity }]}>
            {title}
          </Animated.Text>
        </View>

        <View style={styles.badge} />
      </View>

      <Animated.View 
        style={[
          styles.searchContainer, 
          { height: searchHeight, opacity: searchOpacity, marginBottom: searchMargin }
        ]}
      >
        <View style={styles.searchInputWrapper}>
          <Ionicons name="search" size={td(17)} color={Colors.corTextSearch} />
          
          <TextInput
            style={styles.searchInput}
            placeholder={placeHolder}
            placeholderTextColor={Colors.corTextSecondary}
            value={searchValue}
            onChangeText={onSearchChange}
            autoCorrect={false}
            clearButtonMode="while-editing"
            
          />

          {searchValue.length > 0 && (
            <TouchableOpacity onPress={() => onSearchChange('')} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
              <Ionicons name="close-circle" size={td(18)} color={Colors.gray} />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  headerWrapper: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    elevation: 4, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: l(15),
    height: a(50),
  },
  btnBack: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: l(40),
  },
  titleWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: td(18),
    fontFamily: fonts.robotoMedium,
  },
  badge: {
    width: l(40),
  },
  searchContainer: {
    paddingHorizontal: l(15),
    justifyContent: 'flex-end',
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: a(40),
    backgroundColor: '#F8FAFC', 
    borderRadius: td(12),
    paddingHorizontal: l(12),
  },
  searchInput: {
    flex: 1,
    marginLeft: l(8),
    fontSize: td(14),
    fontFamily: fonts?.robotoRegular,
    color: Colors.corText,
  },
});