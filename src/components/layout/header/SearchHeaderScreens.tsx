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
  placeHolder: string;
  onBack: () => void;
  filtered: number;
  searchValue: string;
  onSearchChange: (text: string) => void;
};

export const SearchHeaderScreens = ({
  title,
  placeHolder,
  onBack,  
  filtered,
  searchValue,
  onSearchChange
}: HeaderScreensProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.headerWrapper, { paddingTop: insets.top }]}>
      
      <View style={styles.topRow}>
        <View style={{flexDirection:"row"}}>
          <TouchableOpacity onPress={onBack} style={styles.btnBack}>
            <Ionicons name="chevron-back-outline" size={td(24)} color={Colors.corText} />
          </TouchableOpacity>

          <View style={styles.titleContainer}>
            <Text numberOfLines={1} style={styles.title}>{title}</Text>
          </View>
        </View> 
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{filtered}</Text>
        </View>
      </View>


      <View style={styles.searchRow}>
        <View style={styles.searchInputWrapper}>
          <Ionicons
            name="search"
            size={td(17)}
            color={Colors.corTextSearch}
          />

          <TextInput
            style={styles.searchInput}
            placeholder={placeHolder}
            placeholderTextColor={Colors.corTextSearch}
            value={searchValue}
            onChangeText={onSearchChange}
            autoCorrect={false}
            clearButtonMode="while-editing"
          />

          {searchValue.length > 0 && (
            <TouchableOpacity
              onPress={() => onSearchChange('')}
              hitSlop={10}
            >
              <Ionicons
                name="close-circle"
                size={td(18)}
                color={Colors.gray}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  headerWrapper: {
    backgroundColor: Colors.white
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: l(15),
    height: a(44)
  },
  btnBack: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingRight:l(10)
  },
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: td(20),
    fontFamily: fonts?.robotoBold,
    color: Colors.corText,
    textAlign: 'center',
  },
  badge: {
    minWidth: td(28),
    height: td(28),
    paddingHorizontal: td(8),
    borderRadius: td(14),
    backgroundColor: Colors.corContainer, 
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: td(14),
    fontFamily: fonts?.robotoBold || 'System',
    color: Colors.corText,
  },
  searchRow: {
    paddingHorizontal: l(10),
  },

  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: a(30),
    backgroundColor: "#F0F0F0",
    borderRadius: td(10),
    paddingHorizontal: l(12),
    marginBottom:a(10),
    borderWidth: 1,
    borderColor: "#E3E3E3",
  },

  searchInput: {
    flex: 1,
    marginLeft: l(8),
    fontSize: td(14),
    fontFamily: fonts?.robotoRegular,
    color:Colors.corText
  },
});