// components/shared/IOSWheelPicker.tsx
import React, { useRef, useCallback } from 'react';
import { View, Text, StyleSheet, NativeSyntheticEvent, NativeScrollEvent, FlatList, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { l, a, td } from '@/constants/responsive';
import { fonts } from '@/assets/fonts/fonts';
import { Colors } from '@/colors/color';

interface WheelItem {
  label: string;
  value: number;
}

interface IOSWheelPickerProps {
  data: WheelItem[];
  selectedValue: number;
  onValueChange: (value: number) => void;
  unit: string;
}

const ITEM_HEIGHT = a(44);
const VISIBLE_ITEMS = 5;

export function IOSWheelPicker({ data, selectedValue, onValueChange, unit }: IOSWheelPickerProps) {
  const flatListRef = useRef<FlatList>(null);
  const selectedIndex = data.findIndex((item) => item.value === selectedValue);

  const handleScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetY = event.nativeEvent.contentOffset.y;
      const index = Math.round(offsetY / ITEM_HEIGHT);
      const clampedIndex = Math.max(0, Math.min(index, data.length - 1));

      if (data[clampedIndex] && data[clampedIndex].value !== selectedValue) {
        onValueChange(data[clampedIndex].value);
        Haptics.selectionAsync();
      }
    },
    [data, selectedValue, onValueChange]
  );

  return (
    <View style={styles.pickerContainer}>
      <FlatList
        ref={flatListRef}
        data={data}
        keyExtractor={(item) => `${unit}-${item.value}`}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        onMomentumScrollEnd={handleScrollEnd}
        initialScrollIndex={selectedIndex >= 0 ? selectedIndex : 0}
        getItemLayout={(_, index) => ({
            length: ITEM_HEIGHT,
            offset: ITEM_HEIGHT * index,
            index,
        })}
        
        /* PROPS DE COMPATIBILIDADE E ESTÉTICA ANDROID */
        overScrollMode="never" 
        nestedScrollEnabled={true} 
        removeClippedSubviews={Platform.OS === 'android'} 
        
        contentContainerStyle={{
            paddingVertical: (ITEM_HEIGHT * (VISIBLE_ITEMS - 1)) / 2,
        }}
        renderItem={({ item }) => {
            const isSelected = item.value === selectedValue;
            return (
            <View style={styles.itemRow}>
                <Text style={[styles.itemText, isSelected && styles.itemTextSelected]}>
                {item.label}
                </Text>
            </View>
            );
        }}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  pickerContainer: {
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    flex: 1,
  },
  itemRow: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    fontSize: td(18),
    fontFamily: fonts?.robotoRegular || 'System',
    color: Colors.corTextLight,
    opacity: 0.4,
  },
  itemTextSelected: {
    fontSize: td(21),
    fontFamily: fonts?.robotoBold || 'System',
    color: Colors.corText,
    opacity: 1,
  },
});