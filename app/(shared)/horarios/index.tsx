
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { l, a, td } from '@/constants/responsive';
import { Colors } from '@/colors/color';
import { fonts } from '@/assets/fonts/fonts';
import { useOperatingHoursStore } from '@/store/useOperatingHoursStore';

const DAYS_TRANSLATION: Record<string, string> = {
  MONDAY: 'Segunda-feira', TUESDAY: 'Terça-feira', WEDNESDAY: 'Quarta-feira',
  THURSDAY: 'Quinta-feira', FRIDAY: 'Sexta-feira', SATURDAY: 'Sábado', SUNDAY: 'Domingo'
};

export default function HorariosScreen() {
  const router = useRouter();
  const { schedule, context } = useOperatingHoursStore();

  const handleSave = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={td(24)} color={Colors.corText} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>
          {context === 'COMPANY' ? 'Seu horário de funcionamento' : 'Horário do Profissional'}
        </Text>
        <Text style={styles.subtitle}>Quando os clientes podem reservar com você?</Text>

        <View style={styles.list}>
          {Object.entries(schedule).map(([dayKey, dayData]) => (
            <TouchableOpacity 
              key={dayKey} 
              style={styles.dayRow}
              onPress={() => router.push(`/(shared)/horarios/${dayKey}` as any)}
            >
              <Text style={styles.dayName}>{DAYS_TRANSLATION[dayKey]}</Text>
              <View style={styles.dayStatus}>
                <Text style={[styles.timeText, !dayData.isOpen && styles.closedText]}>
                  {dayData.isOpen ? `${dayData.openTime} - ${dayData.closeTime}` : 'Fechado'}
                </Text>
                <Ionicons name="chevron-forward" size={td(18)} color="#CBD5E1" />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.btnSave} onPress={handleSave}>
          <Text style={styles.btnSaveText}>Continuar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },

  header: {
    paddingHorizontal: l(20),
    paddingTop: a(10),
    paddingBottom: a(10),
  },

  backBtn: {
    width: td(40),
    height: td(40),
    justifyContent: 'center',
  },

  content: {
    flex: 1,
    paddingHorizontal: l(20),
  },

  title: {
    fontSize: td(24),
    fontFamily: fonts?.robotoBold,
    color: '#1E293B',
    marginBottom: a(8),
  },

  subtitle: {
    fontSize: td(14),
    fontFamily: fonts?.robotoRegular,
    color: '#64748B',
    marginBottom: a(24),
  },

  list: {
    borderTopWidth: 1,
    borderColor: '#F1F5F9',
  },

  dayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: a(20),
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
  },

  dayName: {
    fontSize: td(16),
    fontFamily: fonts?.robotoMedium,
    color: '#1E293B',
  },

  dayStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: l(10),
  },

  timeText: {
    fontSize: td(15),
    fontFamily: fonts?.robotoRegular,
    color: '#475569',
  },

  closedText: {
    color: '#94A3B8',
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