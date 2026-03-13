import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { l, td } from '@constants/responsive';
import { Colors } from '@colors/color';

type DetailSearchHeaderProps = { 
  onBack: () => void; 
  onSearchPress: () => void; 
};

export const DetailSearchHeader = ({ onBack, onSearchPress }: DetailSearchHeaderProps) => {
  return ( 
    <View style={styles.containerId}>
      <TouchableOpacity style={styles.boxIcon} onPress={onBack}>
        <Ionicons name='arrow-back' size={td(20)} color={Colors.white} />
      </TouchableOpacity>
      <View style={styles.rightActions}>
        <TouchableOpacity style={styles.boxIcon}>
          <Ionicons name='heart-outline' size={td(20)} color={Colors.white} /> 
        </TouchableOpacity>
        <TouchableOpacity style={styles.boxIcon} onPress={onSearchPress}>
          <Ionicons name='search' size={td(20)} color={Colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const size = td(35);

const styles = StyleSheet.create({
  containerId: { 
    paddingHorizontal: l(10),
    overflow: 'visible',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  rightActions: {
    justifyContent: "center", 
    alignItems: "center", 
    gap: 10, 
    flexDirection: "row" 
  },
  boxIcon: {
    height: size,
    width: size,
    borderRadius: size / 2,
    backgroundColor: Colors.corScreenDisable,
    justifyContent: "center",
    alignItems: "center",
  }
});