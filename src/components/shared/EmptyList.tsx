import React from 'react';
import { View, Text, Image, StyleSheet, ImageSourcePropType, ViewStyle } from 'react-native';
import { Colors } from '@colors/color'; 
import { a, l, td } from '@constants/responsive';
import { fonts } from '@assets/fonts/fonts';

interface EmptyListProps {
  message: string;
  subMessage?:string;
  imageSource?: ImageSourcePropType;
  containerStyle?: ViewStyle;
}

export const EmptyList = React.memo(({ 
  message, 
  imageSource = require("@assets/images/SearchSad.png"), 
  containerStyle,
  subMessage
}: EmptyListProps) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Image 
        source={imageSource} 
        style={styles.image} 
        resizeMode="contain"
      />
      <Text style={styles.text}>
        {message}
      </Text>
      <Text style={styles.text}>
        {subMessage}
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: a(40), 
    paddingHorizontal: l(20),
  },
  image: {
    width: td(120), 
    height: td(120),
    marginBottom: a(10),
    borderRadius: td(60), 
    opacity: 0.9,
  },
  text: {
    fontSize: td(14),
    fontFamily: fonts.robotoMedium,
    color: Colors.corTextSecondary, 
    textAlign: 'center',
    lineHeight: td(20),
  },
});