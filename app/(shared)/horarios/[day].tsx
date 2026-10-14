import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

import { l, a, td } from '@/constants/responsive';
import { Colors } from '@/colors/color';
import { fonts } from '@/assets/fonts/fonts';
import { useOperatingHoursStore } from '@/store/useOperatingHoursStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const DAYS_TRANSLATION: Record<string, string> = {
  MONDAY: 'Segunda-feira', TUESDAY: 'Terça-feira', WEDNESDAY: 'Quarta-feira',
  THURSDAY: 'Quinta-feira', FRIDAY: 'Sexta-feira', SATURDAY: 'Sábado', SUNDAY: 'Domingo'
};

// Helper matemático local
const timeToMinutes = (time: string) => {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
};

export default function DiaDetalheScreen() {
  const router = useRouter();
  const { day } = useLocalSearchParams<{ day: string }>();
  const { schedule, updateDay, addBreak, removeBreak } = useOperatingHoursStore();
  const insets = useSafeAreaInsets();
  const dayData = schedule[day];
  if (!dayData) return null;

  const handleTimePress = (field: 'openTime' | 'closeTime', currentValue: string) => {
    router.push({
      pathname: '/(shared)/horarios/selecionar-hora',
      params: { day, field, value: currentValue, title: field === 'openTime' ? 'Início' : 'Fim' }
    } as any);
  };

  const handleBreakTimePress = (breakId: string, field: 'start' | 'end', currentValue: string) => {
    router.push({
      pathname: '/(shared)/horarios/selecionar-hora',
      params: { day, field, breakId, value: currentValue, title: field === 'start' ? 'Início do Intervalo' : 'Fim do Intervalo' }
    } as any);
  };


  const handleConfirm = () => {
    if (dayData.isOpen) {
      const openMins = timeToMinutes(dayData.openTime);
      const closeMins = timeToMinutes(dayData.closeTime);

      // Regra 1: Fim não pode ser menor ou igual ao Início
      if (closeMins <= openMins) {
        Toast.show({ 
          type: 'error', 
          text1: 'Horário Inválido', 
          text2: 'O horário de término deve ser após o horário de início.' 
        });
        return; // Interrompe e não deixa sair da tela
      }

      // Validações dos Intervalos
      if (dayData.breaks && dayData.breaks.length > 0) {
        for (const brk of dayData.breaks) {
          const breakStartMins = timeToMinutes(brk.start);
          const breakEndMins = timeToMinutes(brk.end);

          // Regra 2: Fim do intervalo não pode ser menor ou igual ao início
          if (breakEndMins <= breakStartMins) {
            Toast.show({ 
              type: 'error', 
              text1: 'Intervalo Inválido', 
              text2: 'O fim do intervalo deve ser após o seu início.' 
            });
            return;
          }

          // Regra 3: O Intervalo tem que caber dentro do expediente
          if (breakStartMins < openMins || breakEndMins > closeMins) {
            Toast.show({ 
              type: 'error', 
              text1: 'Intervalo Inválido', 
              text2: 'O intervalo deve estar dentro do horário de trabalho.' 
            });
            return;
          }
        }
      }
    }

    // Se passou em todas as validações lógicas, permite voltar
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, {paddingTop:insets.top + a(5)}]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={td(24)} color={Colors.corText} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{DAYS_TRANSLATION[day]}</Text>
        </View>
        <View style={styles.switchWrapper}>
          <Switch 
            value={dayData.isOpen} 
            onValueChange={(val) => updateDay(day, { isOpen: val })}
            trackColor={{ true: Colors.green, false: '#E2E8F0' }}
          />
          <Text style={styles.switchLabel}>{dayData.isOpen ? 'Aberto' : 'Fechado'}</Text>
        </View>
      </View>

      {dayData.isOpen && (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.helperText}>
            Defina o seu horário de trabalho aqui. Vá para Dias de abertura se precisar ajustar o horário para um único dia.
          </Text>

          <View style={styles.timeCardRow}>
            <TouchableOpacity style={styles.timeInput} onPress={() => handleTimePress('openTime', dayData.openTime)}>
              <Text style={styles.timeLabel}>INÍCIO</Text>
              <View style={styles.timeValueRow}>
                <Text style={styles.timeValue}>{dayData.openTime}</Text>
                <Ionicons name="chevron-down" size={td(18)} color="#94A3B8" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.timeInput} onPress={() => handleTimePress('closeTime', dayData.closeTime)}>
              <Text style={styles.timeLabel}>FIM</Text>
              <View style={styles.timeValueRow}>
                <Text style={styles.timeValue}>{dayData.closeTime}</Text>
                <Ionicons name="chevron-down" size={td(18)} color="#94A3B8" />
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.breaksSection}>
            <Text style={styles.breaksTitle}>Intervalos</Text>
            
            {dayData.breaks.map((brk) => (
              <View key={brk.id} style={styles.breakRow}>
                 
                 <View style={styles.breakTimeGroup}>
                   <TouchableOpacity style={styles.breakTimeInput} onPress={() => handleBreakTimePress(brk.id, 'start', brk.start)}>
                     <Text style={styles.breakText}>{brk.start}</Text>
                     <Ionicons name="chevron-down" size={td(14)} color="#94A3B8" />
                   </TouchableOpacity>
                   
                   <Text style={{ marginHorizontal: l(8), color: '#94A3B8' }}>-</Text>
                   
                   <TouchableOpacity style={styles.breakTimeInput} onPress={() => handleBreakTimePress(brk.id, 'end', brk.end)}>
                     <Text style={styles.breakText}>{brk.end}</Text>
                     <Ionicons name="chevron-down" size={td(14)} color="#94A3B8" />
                   </TouchableOpacity>
                 </View>

                 <TouchableOpacity onPress={() => removeBreak(day, brk.id)} style={{ padding: l(8) }}>
                   <Ionicons name="trash-outline" size={td(20)} color="#F43F5E" />
                 </TouchableOpacity>
              </View>
            ))}

            <TouchableOpacity style={styles.addBreakBtn} onPress={() => addBreak(day)}>
              <Ionicons name="add" size={td(20)} color="#1E293B" />
              <Text style={styles.addBreakText}>Adicionar intervalo</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      <View style={styles.footer}>
        <TouchableOpacity style={styles.btnSave} onPress={handleConfirm}>
          <Text style={styles.btnSaveText}>OK</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: l(20),
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
  },

  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: l(10),
  },

  backBtn: {
    padding: l(4),
  },

  headerTitle: {
    fontSize: td(22),
    fontFamily: fonts?.robotoBold,
    color: '#1E293B',
  },

  switchWrapper: {
    alignItems: 'center',
  },

  switchLabel: {
    fontSize: td(12),
    color: '#64748B',
    marginTop: a(4),
  },

  content: {
    flex: 1,
    padding: l(20),
  },

  helperText: {
    fontSize: td(13),
    color: '#64748B',
    lineHeight: td(20),
    marginBottom: a(20),
  },

  timeCardRow: {
    flexDirection: 'row',
    gap: l(10),
    marginBottom: a(30),
  },

  timeInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: td(8),
    padding: l(12),
  },

  timeLabel: {
    fontSize: td(10),
    color: '#94A3B8',
    marginBottom: a(4),
    fontWeight: '600',
  },

  timeValueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  timeValue: {
    fontSize: td(18),
    fontFamily: fonts?.robotoBold,
    color: '#1E293B',
  },

  breaksSection: {
    backgroundColor: '#F8FAFC',
    marginHorizontal: -l(20),
    padding: l(20),
  },

  breaksTitle: {
    fontSize: td(16),
    fontFamily: fonts?.robotoBold,
    color: '#1E293B',
    marginBottom: a(16),
  },

  breakRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: a(12),
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
  },

  breakTimeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  breakTimeInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: l(12),
    paddingVertical: a(8),
    borderRadius: td(6),
    gap: l(8),
  },

  breakText: {
    fontSize: td(15),
    color: '#1E293B',
    fontFamily: fonts?.robotoMedium,
  },

  addBreakBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: l(10),
    paddingVertical: a(16),
  },

  addBreakText: {
    fontSize: td(15),
    color: '#1E293B',
    fontFamily: fonts?.robotoMedium,
  },

  footer: {
    padding: l(20),
    borderTopWidth: 1,
    borderColor: '#F1F5F9',
  },

  btnSave: {
    backgroundColor: Colors.corButton,
    height: a(40),
    borderRadius: td(10),
    justifyContent: 'center',
    alignItems: 'center',
  },

  btnSaveText: {
    color: '#FFF',
    fontSize: td(16),
    fontFamily: fonts?.robotoBold,
  },
});