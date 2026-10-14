// src/components/layout/header/SearchHeaderScreens.tsx
import React from 'react';
import { View, TouchableOpacity, StyleSheet, TextInput, StatusBar, Text } from 'react-native';
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
  // A propriedade scrollY foi removida
};

export const SearchHeaderScreens = ({
  title,
  placeHolder,
  onBack,
  searchValue,
  onSearchChange,
}: HeaderScreensProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.headerWrapper, { paddingTop: insets.top }]}>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="transparent" 
        translucent 
      />

      {/* Degradê atualizado para a cor da marca */}
      <LinearGradient
        colors={["rgba(0,139,139, 1)",  "rgba(0,139,139, 0.5)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.topRow}>
        <TouchableOpacity onPress={onBack} style={styles.btnBack}>
          <Ionicons name="chevron-back-outline" size={td(26)} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.titleWrapper}>
          <Text numberOfLines={1} style={styles.title}>
            {title}
          </Text>
        </View>

        <View style={styles.badge} />
      </View>

      <View style={styles.searchContainer}>
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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerWrapper: {
    elevation: 4, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
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
    color: '#FFFFFF',
  },
  badge: {
    width: l(40),
  },
  searchContainer: {
    paddingHorizontal: l(15),
    paddingBottom: a(10), // Substitui a margem animada
    justifyContent: 'flex-end',
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: a(40),
    backgroundColor: '#FFFFFF', // Mantém contraste alto contra o gradiente laranja
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