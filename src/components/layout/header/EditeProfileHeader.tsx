import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { a, l, td } from '@/constants/responsive';
import { fonts } from '@/assets/fonts/fonts';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/colors/color';

type EditeProfileHeaderProps = {
  title: string;
  onBack: () => void;
};

export const EditeProfileHeader = ({ title, onBack }: EditeProfileHeaderProps) => {
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
      <View style={styles.sideContainer}/>
    </View>
  );
};

const styles = StyleSheet.create({
  containerProfileCustom: {
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: l(16)
  },
  sideContainer: {
    width:l(40),
    justifyContent: 'center',
    paddingRight:l(10)
  },
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnIcon: {
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  txtTitle: {
    fontSize: td(18),
    fontFamily: fonts.robotoBold, 
    color:Colors.corTextTitle
  }
});