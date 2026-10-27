import React from 'react';
import {
  InputAccessoryView,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { a, l, td } from '@/constants/responsive';
import { fonts } from '@/assets/fonts/fonts';
import { Colors } from '@/colors/color';

type KeyboardDoneAccessoryProps = {
  nativeID: string;
  label?: string;
  onDone?: () => void;
};

export function KeyboardDoneAccessory({
  nativeID,
  label = 'Concluído',
  onDone,
}: KeyboardDoneAccessoryProps) {
  if (Platform.OS !== 'ios') {
    return null;
  }

  return (
    <InputAccessoryView nativeID={nativeID}>
      <View style={styles.container}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            Keyboard.dismiss();
            onDone?.();
          }}
        >
          <Text style={styles.buttonText}>{label}</Text>
        </TouchableOpacity>
      </View>
    </InputAccessoryView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: l(16),
    paddingVertical: a(10),
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },

  buttonText: {
    fontSize: td(15),
    fontFamily: fonts.robotoMedium,
    color: Colors.corButton,
  },
});
