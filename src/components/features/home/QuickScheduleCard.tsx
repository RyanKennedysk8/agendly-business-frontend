// src/components/features/home/QuickScheduleCard.tsx
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { td, a, l } from '@/constants/responsive';
import { fonts } from '@/assets/fonts/fonts';
import { Colors } from '@/colors/color';

interface QuickScheduleCardProps {
  onPress: () => void;
}

export const QuickScheduleCard: React.FC<QuickScheduleCardProps> = ({ onPress }) => {
  return (
    <Pressable 
      style={({ pressed }) => [
        styles.container,
        pressed && styles.containerPressed // Dá um feedback visual de clique
      ]}
      onPress={onPress}
    >
      {/* ÍCONE DE DESTAQUE */}
      <View style={styles.iconWrapper}>
        <Ionicons name="calendar-outline" size={td(24)} color="#FFFFFF" />
        <View style={styles.plusBadge}>
          <Ionicons name="add" size={td(12)} color={Colors.corScreen} />
        </View>
      </View>

      {/* TEXTOS DIRETOS */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>Agendamento Manual</Text>
        <Text style={styles.subtitle}>Criar um novo agendamento rápido</Text>
      </View>

      {/* INDICADOR DE NAVEGAÇÃO */}
      <View style={styles.arrowWrapper}>
        <Ionicons name="chevron-forward" size={td(20)} color={Colors.corScreen}  />
      </View>
    </Pressable>
  );
};

// ============================================================================
// STYLESHEET
// ============================================================================
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: td(16),
    padding: td(16),
    marginBottom: a(24),
    borderWidth: 1,
    borderColor: '#E2E8F0',
    // Sombra sutil para descolar do fundo
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  containerPressed: {
    transform: [{ scale: 0.98 }], // Microinteração suave
  },
  iconWrapper: {
    width: td(48),
    height: td(48),
    borderRadius: td(14),
    backgroundColor: Colors.corScreen,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: l(16),
    position: 'relative',
  },
  plusBadge: {
    position: 'absolute',
    bottom: -td(4),
    right: -td(4),
    backgroundColor: '#FFFFFF',
    borderRadius: td(10),
    width: td(20),
    height: td(20),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: td(16),
    fontFamily: fonts?.robotoBold || 'System',
    color: '#0F172A',
    marginBottom: a(2),
  },
  subtitle: {
    fontSize: td(13),
    fontFamily: fonts?.robotoRegular || 'System',
    color: '#64748B',
  },
  arrowWrapper: {
    width: td(32),
    height: td(32),
    borderRadius: td(16),
    backgroundColor: Colors.corContainer, // Fundo laranja ultra transparente
    justifyContent: 'center',
    alignItems: 'center',
  },
});