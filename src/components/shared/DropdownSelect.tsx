import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Pressable, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { scale as l, verticalScale as a, moderateScale as td } from 'react-native-size-matters';
import { fonts } from '@/assets/fonts/fonts';

export interface DropdownItem {
  id: string;
  name: string;
}

interface DropdownSelectProps {
  label: string;
  options: DropdownItem[];
  placeholder: string;
  // Propriedades Single Select
  selectedValue?: string | null;
  onSelect?: (id: string) => void;
  // Propriedades Multi Select
  multiSelect?: boolean;
  selectedValues?: string[];
  onMultiSelect?: (ids: string[]) => void;
}

export function DropdownSelect({ 
  label, 
  options, 
  placeholder,
  selectedValue,
  onSelect,
  multiSelect = false,
  selectedValues = [],
  onMultiSelect
}: DropdownSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [buttonLayout, setButtonLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });

  // Resolve o texto exibido no gatilho
  const getTriggerText = () => {
    if (multiSelect) {
      if (selectedValues.length === 0) return placeholder;
      if (selectedValues.includes('ALL')) return 'Todos (Padrão)';
      if (selectedValues.length === 1) return options.find(o => o.id === selectedValues[0])?.name || placeholder;
      return `${selectedValues.length} selecionados`;
    }
    return options.find(o => o.id === selectedValue)?.name || placeholder;
  };

  const isActive = multiSelect ? selectedValues.length > 0 : !!selectedValue;
  const triggerText = getTriggerText();

  const handleToggle = (event: any) => {
    event.currentTarget.measure((fx: number, fy: number, width: number, height: number, px: number, py: number) => {
      setButtonLayout({ x: px, y: py, width, height });
      setIsOpen(!isOpen);
    });
  };

  const handleItemPress = (id: string) => {
    if (multiSelect && onMultiSelect) {
      if (id === 'ALL') {
        onMultiSelect(['ALL']);
      } else {
        // Se clicar em um especifico, remove o 'ALL' e faz o toggle do ID
        let newSelection = selectedValues.filter(val => val !== 'ALL');
        if (newSelection.includes(id)) {
          newSelection = newSelection.filter(val => val !== id);
        } else {
          newSelection.push(id);
        }
        // Se desmarcou tudo, volta pro TODOS nativamente
        if (newSelection.length === 0) newSelection = ['ALL'];
        
        onMultiSelect(newSelection);
      }
    } else if (onSelect) {
      onSelect(id);
      setIsOpen(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      
      <TouchableOpacity 
        style={[styles.triggerButton, isOpen && styles.triggerButtonActive]} 
        activeOpacity={0.7} 
        onPress={handleToggle}
      >
        <Text style={[styles.triggerText, isActive && styles.triggerTextActive]} numberOfLines={1}>
          {triggerText}
        </Text>
        <Ionicons name={isOpen ? "chevron-up" : "chevron-down"} size={td(18)} color="#64748B" />
      </TouchableOpacity>

      {isOpen && (
        <Modal visible={isOpen} transparent animationType="none" onRequestClose={() => setIsOpen(false)}>
          <Pressable style={styles.modalOverlay} onPress={() => setIsOpen(false)}>
            <View 
              style={[
                styles.dropdownPopover, 
                { top: buttonLayout.y + buttonLayout.height + a(4), left: buttonLayout.x, width: buttonLayout.width }
              ]}
            >
              <ScrollView style={styles.scroll} nestedScrollEnabled showsVerticalScrollIndicator={true} keyboardShouldPersistTaps="handled">
                {options.map((option) => {
                  const isSelected = multiSelect 
                    ? selectedValues.includes(option.id)
                    : option.id === selectedValue;
                    
                  return (
                    <TouchableOpacity 
                      key={option.id} 
                      style={[styles.optionRow, isSelected && styles.optionRowSelected]}
                      activeOpacity={0.7}
                      onPress={() => handleItemPress(option.id)}
                    >
                      <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                        {option.name}
                      </Text>
                      
                      {/* Checkbox visual para multi-select ou checkmark simples para single */}
                      {multiSelect ? (
                        <View style={[styles.checkbox, isSelected && styles.checkboxActive]}>
                           {isSelected && <Ionicons name="checkmark" size={td(12)} color="#FFFFFF" />}
                        </View>
                      ) : (
                        isSelected && <Ionicons name="checkmark" size={td(16)} color="#FF7A00" />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </Pressable>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: a(20) },
  label: { fontSize: td(14), fontFamily: fonts?.robotoMedium || 'System', color: '#334155', marginBottom: a(8) },
  triggerButton: { height: a(48), backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: td(10), paddingHorizontal: l(16), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  triggerButtonActive: { borderColor: '#FF7A00', backgroundColor: '#FFFFFF' },
  triggerText: { flex: 1, fontSize: td(15), fontFamily: fonts?.robotoRegular || 'System', color: '#94A3B8', paddingRight: l(8) },
  triggerTextActive: { color: '#0F172A', fontFamily: fonts?.robotoMedium || 'System' },
  modalOverlay: { flex: 1, backgroundColor: 'transparent' },
  dropdownPopover: { position: 'absolute', backgroundColor: '#FFFFFF', borderRadius: td(10), maxHeight: a(240), borderWidth: 1, borderColor: '#E2E8F0', shadowColor: '#0F172A', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 5, zIndex: 999 },
  scroll: { maxHeight: a(240) },
  optionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: l(16), height: a(44), borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  optionRowSelected: { backgroundColor: '#FFF7ED' },
  optionText: { fontSize: td(14.5), fontFamily: fonts?.robotoRegular || 'System', color: '#334155' },
  optionTextSelected: { color: '#FF7A00', fontFamily: fonts?.robotoBold || 'System' },
  checkbox: { width: td(18), height: td(18), borderRadius: td(4), borderWidth: 1.5, borderColor: '#CBD5E1', justifyContent: 'center', alignItems: 'center' },
  checkboxActive: { backgroundColor: '#FF7A00', borderColor: '#FF7A00' }
});