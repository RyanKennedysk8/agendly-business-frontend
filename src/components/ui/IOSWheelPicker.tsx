import React, { useRef, useCallback, useEffect } from 'react';
import { View, StyleSheet, NativeSyntheticEvent, NativeScrollEvent, Platform, TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  useAnimatedReaction,
  SharedValue,
  runOnJS,
} from 'react-native-reanimated';
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

// Reduzido para condensar a renderização dos números e aproximá-los no cilindro
const ITEM_HEIGHT = a(34); 
const VISIBLE_ITEMS = 7; 

const AnimatedWheelItem = ({ 
  item, 
  index, 
  scrollY 
}: { 
  item: WheelItem; 
  index: number; 
  scrollY: SharedValue<number>
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    const itemPosition = index * ITEM_HEIGHT;
    const distance = scrollY.value - itemPosition;

    const rotateX = interpolate(
      distance,
      [-ITEM_HEIGHT * 3, 0, ITEM_HEIGHT * 3],
      [45, 0, -45],
      Extrapolation.CLAMP
    );

    const opacity = interpolate(
      distance,
      [-ITEM_HEIGHT * 3, -ITEM_HEIGHT, 0, ITEM_HEIGHT, ITEM_HEIGHT * 3],
      [0.1, 0.4, 1, 0.4, 0.1],
      Extrapolation.CLAMP
    );

    const scale = interpolate(
      distance,
      [-ITEM_HEIGHT * 3, 0, ITEM_HEIGHT * 3],
      [0.85, 1.15, 0.85],
      Extrapolation.CLAMP
    );

    return {
      opacity,
      transform: [
        { perspective: 800 },
        { rotateX: `${rotateX}deg` },
        { scale },
      ],
    };
  });

  return (
    <View style={styles.itemRow}>
      <Animated.Text style={[styles.itemText, animatedStyle]}>
        {item.label}
      </Animated.Text>
    </View>
  );
};

export function IOSWheelPicker({ data, selectedValue, onValueChange, unit }: IOSWheelPickerProps) {
  const flatListRef = useRef<Animated.FlatList<WheelItem>>(null);
  const selectedIndex = data.findIndex((item) => item.value === selectedValue);
  
  const scrollY = useSharedValue(selectedIndex >= 0 ? selectedIndex * ITEM_HEIGHT : 0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const triggerHaptic = useCallback(() => {
    Haptics.selectionAsync();
  }, []);

  useAnimatedReaction(
    () => Math.round(scrollY.value / ITEM_HEIGHT),
    (currentIndex, previousIndex) => {
      if (currentIndex !== previousIndex && previousIndex !== null) {
        if (currentIndex >= 0 && currentIndex < data.length) {
          runOnJS(triggerHaptic)();
        }
      }
    }
  );

  const handleScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetY = event.nativeEvent.contentOffset.y;
      const index = Math.round(offsetY / ITEM_HEIGHT);
      const clampedIndex = Math.max(0, Math.min(index, data.length - 1));

      if (data[clampedIndex] && data[clampedIndex].value !== selectedValue) {
        onValueChange(data[clampedIndex].value);
      }
    },
    [data, selectedValue, onValueChange]
  );

  // Manipulador imperativo de mudança de estado acionado pelas setas
  const handleStep = (direction: 'up' | 'down') => {
    const currentIndex = Math.round(scrollY.value / ITEM_HEIGHT);
    let newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    // Boundary guards
    if (newIndex < 0) newIndex = 0;
    if (newIndex >= data.length) newIndex = data.length - 1;

    if (newIndex !== currentIndex) {
      flatListRef.current?.scrollToOffset({
        offset: newIndex * ITEM_HEIGHT,
        animated: true,
      });
      onValueChange(data[newIndex].value);
    }
  };

  // Reatividade de sincronização: Força o scroll se o pai mutar a state diretamente
  useEffect(() => {
    const targetIndex = data.findIndex(item => item.value === selectedValue);
    const currentIndex = Math.round(scrollY.value / ITEM_HEIGHT);
    
    if (targetIndex !== -1 && targetIndex !== currentIndex) {
      flatListRef.current?.scrollToOffset({
        offset: targetIndex * ITEM_HEIGHT,
        animated: true,
      });
    }
  }, [selectedValue, data]);

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity 
        style={styles.arrowControl} 
        onPress={() => handleStep('up')}
        activeOpacity={0.7}
      >
        <Ionicons name="chevron-up" size={td(24)} color={Colors.gray} />
      </TouchableOpacity>

      <View style={styles.pickerContainer}>
        <Animated.FlatList
          ref={flatListRef as any}
          data={data}
          keyExtractor={(item) => `${unit}-${item.value}`}
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_HEIGHT}
          decelerationRate="fast"
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          onMomentumScrollEnd={handleScrollEnd}
          initialScrollIndex={selectedIndex >= 0 ? selectedIndex : 0}
          getItemLayout={(_, index) => ({
            length: ITEM_HEIGHT,
            offset: ITEM_HEIGHT * index,
            index,
          })}
          overScrollMode="never" 
          nestedScrollEnabled={true} 
          removeClippedSubviews={Platform.OS === 'android'} 
          contentContainerStyle={{
            paddingVertical: (ITEM_HEIGHT * (VISIBLE_ITEMS - 1)) / 2,
          }}
          renderItem={({ item, index }) => (
            <AnimatedWheelItem 
              item={item} 
              index={index} 
              scrollY={scrollY} 
            />
          )}
        />
      </View>

      <TouchableOpacity 
        style={styles.arrowControl} 
        onPress={() => handleStep('down')}
        activeOpacity={0.7}
        
      >
        <Ionicons name="chevron-down" size={td(24)} color={Colors.gray} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: l(80), // Largura fixa restringe o componente, aproximando as colunas no flex do pai
    alignItems: 'center',
  },
  arrowControl: {
    paddingVertical: a(8),
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10
  },
  pickerContainer: {
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    width: '100%',
  },
  itemRow: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    fontSize: td(20),
    fontFamily: fonts?.robotoRegular,
    color: Colors.corText,
  },
});