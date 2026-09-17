import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { BaseToastProps } from 'react-native-toast-message';
import { Feather } from '@expo/vector-icons'; 
import { a, l, td } from '../../constants/responsive';
import { fonts } from '@assets/fonts/fonts';

/*
  Definimos um componente base para nosso toast.
  Isso nos dá um visual coeso que se parece com as "pílulas" do iOS.
*/
export const ToastBase = ({ text1, text2, type }: {
  text1?: string;
  text2?: string;
  type: 'success' | 'error' | 'info';
}) => {
  const iconName = type === 'success' ? 'check-circle' : type === 'error' ? 'alert-triangle' : 'info';
  const iconColor = type === 'success' ? '#4CAF50' : type === 'error' ? '#F44336' : '#2196F3';
  const backgroundColor = '#333333'; // Um fundo escuro, estilo "Dynamic Island"

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Feather name={iconName} size={td(22)} color={iconColor} style={styles.icon} />
      <View style={styles.textContainer}>
        {text1 && <Text style={styles.text1}>{text1}</Text>}
        {text2 && <Text style={styles.text2}>{text2}</Text>}
      </View>
    </View>
  );
};


export const toastConfig = {
  
  success: ({ text1, text2 }: BaseToastProps) => (
    <ToastBase
      text1={text1}
      text2={text2}
      type="success"
    />
  ),

  
  error: ({ text1, text2 }: BaseToastProps) => (
    <ToastBase
      text1={text1}
      text2={text2}
      type="error"
    />
  ),


  info: ({ text1, text2 }: BaseToastProps) => (
    <ToastBase
      text1={text1}
      text2={text2}
      type="info"
    />
  ),
};

const styles = StyleSheet.create({
  container: {
    // A altura é flexível, mas definimos min-height
    width: '90%', // Usar porcentagem ou l()
    minHeight: a(50),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: l(15),
    paddingVertical: a(10),
    borderRadius: l(25), // Arredondamento alto para o visual "pílula"
    // Sombra para elevação (importante no iOS)
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // Elevação para Android
    elevation: 5,
  },
  icon: {
    marginRight: l(12),
  },
  textContainer: {
    flex: 1, 
  },
  text1: {
    fontSize: td(15),
    fontFamily:fonts.robotoMedium,
    color: '#FFFFFF',
  },
  text2: {
    fontSize: td(13),
    fontFamily:fonts.robotoMedium,
    color: '#E0E0E0',
  },
});
