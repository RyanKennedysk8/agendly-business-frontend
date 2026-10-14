import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { l, a, td } from '@/constants/responsive';
import { fonts } from '@/assets/fonts/fonts';
import { Colors } from '@/colors/color';
import { useOperatingHoursStore } from '@/store/useOperatingHoursStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IOSWheelPicker } from '@/components/ui/IOSWheelPicker';

const ITEM_HEIGHT = a(34); // Sincronizado com o IOSWheelPicker

export default function SelecionarHoraScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { day, field, breakId, value, title } = useLocalSearchParams<{ 
    day: string, 
    field: string, 
    breakId?: string, 
    value: string, 
    title: string 
  }>();
  
  const { updateTimeWithValidation, updateBreakTimeWithValidation } = useOperatingHoursStore();

  // Converte a string "HH:mm" para Number, pois o IOSWheelPicker espera value: number
  const initialHour = value ? parseInt(value.split(':')[0], 10) : 9;
  const initialMinute = value ? parseInt(value.split(':')[1], 10) : 0;

  const [selectedHour, setSelectedHour] = useState<number>(initialHour);
  const [selectedMinute, setSelectedMinute] = useState<number>(initialMinute);

  // Memoriza os arrays para evitar re-renderizações desnecessárias na FlatList animada
  const hoursData = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => ({
      label: i.toString().padStart(2, '0'),
      value: i,
    }));
  }, []);

  const minutesData = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const val = i * 5;
      return {
        label: val.toString().padStart(2, '0'),
        value: val,
      };
    });
  }, []);

  const handleSave = () => {
    // Formata de volta para "HH:mm" antes de enviar para a store
    const formattedHour = String(selectedHour).padStart(2, '0');
    const formattedMinute = String(selectedMinute).padStart(2, '0');
    const formattedTime = `${formattedHour}:${formattedMinute}`;
    
    let isValid = false;

    if (breakId) {
      isValid = updateBreakTimeWithValidation(day, breakId, field as 'start' | 'end', formattedTime);
    } else {
      isValid = updateTimeWithValidation(day, field as 'openTime' | 'closeTime', formattedTime);
    }
    
    if (isValid) {
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      {/* Header mantido com a sua lógica de insets */}
      <View style={[styles.header, { paddingTop: insets.top + a(5) }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.8}>
          <Ionicons name="arrow-back" size={td(24)} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={{ width: td(40) }} /> 
      </View>

      {/* Mesma arquitetura de UI do SelecaoTempoScreen */}
      <View style={styles.pickerWrapper}>
        <View style={styles.selectionOverlay} pointerEvents="none" />
        
        <View style={styles.pickersRow}>
          <IOSWheelPicker
            data={hoursData}
            selectedValue={selectedHour}
            onValueChange={setSelectedHour}
            unit="hours"
          />
          
          <IOSWheelPicker
            data={minutesData}
            selectedValue={selectedMinute}
            onValueChange={setSelectedMinute}
            unit="minutes"
          />
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.btnSave} onPress={handleSave} activeOpacity={0.8}>
          <Text style={styles.btnSaveText}>OK</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFFFFF' 
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'flex-start',
    paddingHorizontal: l(15),
    paddingBottom: a(10), 
  },
  backBtn: { 
    padding: l(4),
    width: td(40), 
  },
  headerTitle: { 
    fontSize: td(20), 
    fontFamily: fonts?.robotoBold, 
    color: '#1E293B' 
  },
  pickerWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: l(40),
  },
  selectionOverlay: {
    position: 'absolute',
    height: ITEM_HEIGHT,
    width: '100%',
    backgroundColor: Colors.corContainer, // Mantém o padrão de cor do vidro
    borderRadius: td(10),
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  pickersRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  separatorContainer: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: l(10),
  },
  separatorText: {
    fontSize: td(20),
    fontFamily: fonts?.robotoBold,
    color: Colors.corText,
    marginBottom: a(4), 
  },
  footer: { 
    padding: l(20) 
  },
  btnSave: { 
    backgroundColor: Colors.corButton, 
    height: a(40), 
    borderRadius: td(10), 
    marginBottom:a(10),
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  btnSaveText: { 
    color: '#FFFFFF', 
    fontSize: td(16), 
    fontFamily: fonts?.robotoBold 
  },
});