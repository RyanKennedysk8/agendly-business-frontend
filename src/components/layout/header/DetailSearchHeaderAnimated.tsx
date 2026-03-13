import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { Extrapolation, interpolate, SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { l, td, a } from '@constants/responsive';
import { Colors } from '@colors/color';
import { fonts } from '@assets/fonts/fonts';

type DetailSearchHeaderAnimatedProps = { 
  onBack: () => void; 
  onSearchPress: () => void; 
  scrollY: SharedValue<number>;
  searchTerm: string;
  setSearchTerm: (t: string) => void;
  lojaNome: string;
  onClear: () => void;
  isFavorite?: boolean;
  onHeartPress?: () => void;
}; 

export const DetailSearchHeaderAnimated = ({  
  onBack, onSearchPress, scrollY, lojaNome, isFavorite, onHeartPress
}: DetailSearchHeaderAnimatedProps) => {
  const BASE_HEIGHT = a(50);
  const insets = useSafeAreaInsets();

  const animatedBackgroundStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [150, 200], [0, 1], Extrapolation.CLAMP);
    return {
      backgroundColor: `rgba(255, 255, 255, ${opacity})`,
      borderBottomWidth: opacity > 0.5 ? 1 : 0,
      elevation: opacity > 0.9 ? 0 : 0,
      shadowOpacity: opacity > 0.9 ? 0.1 : 0,
      borderColor: Colors.corContainer
    };
  });
  
  const defaultLayerStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [100, 150], [1, 0], Extrapolation.CLAMP);
    return { 
      opacity,
      transform: [{ translateY: interpolate(scrollY.value, [100, 150], [0, -10], Extrapolation.CLAMP) }],
      pointerEvents: scrollY.value > 120 ? 'none' : 'auto' 
    } as any;
  }); 

  const inputLayerStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [150, 200], [0, 1], Extrapolation.CLAMP);
    return { 
      opacity,
      transform: [{ translateY: interpolate(scrollY.value, [150, 200], [10, 0], Extrapolation.CLAMP) }],
      pointerEvents: scrollY.value > 150 ? 'auto' : 'none'
    } as any;
  });

  return ( 
    <Animated.View style={[styles.containerId, animatedBackgroundStyle]}>
      <View style={{ height: BASE_HEIGHT, marginTop: insets.top, flexDirection: "row", alignItems: "center"}}>
        <TouchableOpacity style={styles.boxIconTransparente} onPress={onBack}>
          <Ionicons name='arrow-back' size={td(20)} color={Colors.black} />
        </TouchableOpacity>

        <View style={{ flex: 1, justifyContent: 'center', height: '100%' }}>
          <Animated.View style={[styles.rightIconsContainer, defaultLayerStyle]}>
            <TouchableOpacity onPress={onHeartPress} style={styles.boxIconGlass}>
              <Ionicons 
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={td(20)}  
                color={isFavorite ? Colors.red : Colors.black}/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.boxIconGlass} onPress={onSearchPress}>
              <Ionicons name='search' size={td(20)} color={Colors.black} />
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={[styles.inputContainerAbsolute, inputLayerStyle]}>
            <TouchableOpacity style={styles.textInput} onPress={onSearchPress}>
              <Ionicons name="search" size={td(14)} color="#aaa" />
              <Text style={styles.miniInput}>Buscar em {lojaNome}...</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  containerId: { 
    paddingHorizontal: l(10),
    overflow: 'visible',
  },
  boxIconTransparente: {
    height: td(35),
    width: td(35),
    borderRadius: td(17.5),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  rightIconsContainer: {
    flexDirection: "row",
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    gap: l(10)
  },
  boxIconGlass: {
    height: td(35),
    width: td(35),
    borderRadius: td(17.5),
    backgroundColor: 'rgba(255, 255, 255, 1)',
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainerAbsolute: {
    position: "absolute",
    right: 0,
    left: 0,
    justifyContent: 'center',
  },
  textInput: { 
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: td(8),
    paddingLeft: l(5),
    paddingRight: l(5),
    backgroundColor: '#f5f5f5',
    height: a(35),
    flex: 1, 
  },
  miniInput: { 
    flex: 1,
    marginLeft: l(5),
    fontSize: td(13),
    fontFamily: fonts.robotoRegular,
    color: Colors.placeholder,
  }
});