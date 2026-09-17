// app/(main)/(stack)/servicos/selecao-tempo.tsx
import { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { l, a, td } from '@/constants/responsive';
import { fonts } from '@/assets/fonts/fonts';
import { Colors } from '@/colors/color';
import { IOSWheelPicker } from '@/components/ui/IOSWheelPicker';
import { EditeProfileHeader } from '@/components/layout/header';
import { useServiceFormStore } from '@/store/useServiceFormStore';

export default function SelecaoTempoScreen() {
  const router = useRouter();
  const form = useServiceFormStore(); // Consome a store

  const initialTotal = form.durationInMinutes || 30; // Lê o valor atual da store
  const [hours, setHours] = useState(Math.floor(initialTotal / 60));
  const [minutes, setMinutes] = useState(initialTotal % 60);

  const hoursData = useMemo(() => {
    return Array.from({ length: 13 }, (_, i) => ({
      label: `${i} h`,
      value: i,
    }));
  }, []);

  const minutesData = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const val = i * 5;
      return {
        label: `${val} min`,
        value: val,
      };
    });
  }, []);

  
  const handleConfirm = () => {
    const totalMinutes = hours * 60 + minutes;
    if (totalMinutes === 0) return;
  
    form.setField('durationInMinutes', totalMinutes); // Atualiza a memória
    router.back(); // Apenas volta! O estado já está salvo.
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Stack.Screen options={{ headerShown: false }} />

      <Stack.Screen
        options={{
          headerShown: true,
          header: () => (
            <EditeProfileHeader
              title={"Duração do Serviço"}
              onBack={() => router.back()}
            />
          ),
        }}
      />

     
      {/* Corpo com a Roleta Estilo iOS */}
      <View style={styles.pickerWrapper}>
        {/* Faixa Central de Destaque Nativa */}
        <View style={styles.selectionOverlay} pointerEvents="none" />

        <View style={styles.pickersRow}>
          <IOSWheelPicker
            data={hoursData}
            selectedValue={hours}
            onValueChange={setHours}
            unit="hours"
          />
          <IOSWheelPicker
            data={minutesData}
            selectedValue={minutes}
            onValueChange={setMinutes}
            unit="minutes"
          />
        </View>
      </View>

      {/* Resumo e Botão de Confirmação */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm} activeOpacity={0.8}>
          <Text style={styles.confirmText}>OK</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const ITEM_HEIGHT = a(44);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    height: a(52),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: l(16),
    borderBottomWidth: 1,
    borderColor: Colors.borderHairLine,
  },
  backButton: {
    width: td(40),
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: td(16),
    fontFamily: fonts?.robotoBold || 'System',
    color: Colors.corText,
  },
  pickerWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: l(24),
  },
  selectionOverlay: {
    position: 'absolute',
    height: ITEM_HEIGHT,
    width: '100%',
    backgroundColor: Colors.corContainer,
    borderRadius: td(10),
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  pickersRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
  },
  footer: {
    paddingHorizontal: l(20),
    paddingTop: a(14),
    paddingBottom: a(28),
    backgroundColor: '#FFFFFF',
    gap: a(12),
  },
  summaryBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: l(4),
  },
  summaryLabel: {
    fontSize: td(13),
    fontFamily: fonts?.robotoRegular || 'System',
    color: Colors.corTextSecondary,
  },
  summaryValue: {
    fontSize: td(15),
    fontFamily: fonts?.robotoBold || 'System',
    color: Colors.corButton,
  },
  confirmButton: {
    backgroundColor: Colors.corButton,
    height: a(40),
    borderRadius: td(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmText: {
    fontSize: td(15),
    fontFamily: fonts?.robotoBold || 'System',
    color: '#FFFFFF',
  },
});