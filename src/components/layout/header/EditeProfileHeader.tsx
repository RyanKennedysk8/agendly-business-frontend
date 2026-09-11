import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { a, l, td } from '@/constants/responsive';
import { fonts } from '@/assets/fonts/fonts';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/colors/color';

type EditeProfileHeaderProps = {
  title: string;
  onBack: () => void;
  rightComponent?: React.ReactNode; 
};

export const EditeProfileHeader = ({ title, onBack, rightComponent }: EditeProfileHeaderProps) => {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[styles.containerProfileCustom, { paddingTop: insets.top, height: a(40) + insets.top }]}>
      <View style={styles.sideContainer}>
        <TouchableOpacity style={styles.btnIcon} onPress={onBack} hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}>
          <Ionicons name='chevron-back' size={td(26)} color={Colors.corText}/>
        </TouchableOpacity>
      </View>
      
      <View style={styles.centerContainer}>
        <Text style={styles.txtTitle} numberOfLines={1}>
          {title}
        </Text>
      </View>
      
      <View style={[styles.sideContainer, { alignItems: 'flex-end' }]}>
        {rightComponent}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerProfileCustom: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: l(16),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor:Colors.borderHairLine
  },
  sideContainer: {
    width: td(60),
    justifyContent: 'center',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnIcon: {
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  txtTitle: {
    fontSize: td(16),
    fontFamily: fonts.robotoBold, 
    color: Colors.corText
  }
});