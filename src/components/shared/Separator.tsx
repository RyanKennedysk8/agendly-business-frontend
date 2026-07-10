import { Colors } from '@/colors/color';
import { td } from '@/constants/responsive';
import { View, StyleSheet } from 'react-native';

export function Separator() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  separator: {
    height: td(0.3),
    backgroundColor: Colors.border,
    borderRadius:td(14),
  },
});