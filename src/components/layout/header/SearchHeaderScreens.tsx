// src/components/headers/ClientSearchHeader.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { a, l, td } from '@/constants/responsive';
import { Colors } from '@/colors/color';
import { fonts } from '@/assets/fonts/fonts';

type HeaderScreensProps = {
  title: string;
  onBack: () => void;
  filtered: number;
  searchValue: string;
  onSearchChange: (text: string) => void;
};

export const SearchHeaderScreens = ({
  title,
  onBack, 
  filtered,
  searchValue,
  onSearchChange
}: HeaderScreensProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.headerWrapper, { paddingTop: insets.top }]}>
      
      <View style={styles.topRow}>
        <TouchableOpacity onPress={onBack} style={styles.btnBack} hitSlop={15}>
          <Ionicons name="arrow-back" size={td(22)} color="#0F172A" />
        </TouchableOpacity>

        <View pointerEvents="none" style={styles.titleContainer}>
          <Text numberOfLines={1} style={styles.title}>{title}</Text>
        </View>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>{filtered}</Text>
        </View>
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchInputWrapper}>
          <Ionicons name="search" size={td(18)} color={Colors.corScreen} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nome ou telefone..."
            placeholderTextColor={Colors.placeholder}
            value={searchValue}
            onChangeText={onSearchChange}
            autoCorrect={false}
            keyboardType="default"
            clearButtonMode="while-editing" // Nativo iOS
          />
          { searchValue.length > 0 && (
            <TouchableOpacity onPress={() => onSearchChange('')} hitSlop={10}>
              <Ionicons name="close-circle" size={td(18)} color={Colors.placeholder} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  headerWrapper: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    zIndex: 10,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: l(20),
    height: a(44),
    position: 'relative',
  },
  btnBack: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    zIndex: 2,
    width: td(40),
  },
  titleContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: td(18),
    fontFamily: fonts?.robotoBold || 'System',
    color: '#0F172A',
    textAlign: 'center',
  },
  badge: {
    minWidth: td(28),
    height: td(28),
    paddingHorizontal: td(8),
    borderRadius: td(14),
    backgroundColor: '#FF7A0015', 
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  badgeText: {
    fontSize: td(14),
    fontFamily: fonts?.robotoBold || 'System',
    color: '#FF7A00',
  },
  searchRow: {
    paddingHorizontal: l(20),
    paddingBottom: a(10),
    paddingTop: a(4),
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.corContainer,
    borderRadius: td(12),
    paddingHorizontal: l(10),
    height: a(40),
  },
  searchInput: {
    flex: 1,
    height: '100%',
    marginLeft: l(8),
    fontSize: td(15),
    fontFamily: fonts?.robotoRegular || 'System',
    color: Colors.placeholder,
  },
});