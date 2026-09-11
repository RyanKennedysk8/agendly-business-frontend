import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Pressable, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { scale as l, verticalScale as a, moderateScale as td } from 'react-native-size-matters';
import { fonts } from '@/assets/fonts/fonts';
import { Colors } from '@/colors/color';

export interface DropdownItem {
  id: string;
  name: string;
}

interface DropdownSelectProps {
  label: string;
  options: DropdownItem[];
  placeholder: string;
  selectedValue?: string | null;
  onSelect?: (id: string) => void;
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
        let newSelection = selectedValues.filter(val => val !== 'ALL');
        if (newSelection.includes(id)) {
          newSelection = newSelection.filter(val => val !== id);
        } else {
          newSelection.push(id);
        }
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
        style={[styles.triggerButton,  !isOpen && isActive && styles.triggerButtonFilled]} 
        activeOpacity={0.7} 
        onPress={handleToggle}
      >
        <Text style={[styles.triggerText, isActive && styles.triggerTextActive]} numberOfLines={1}>
          {triggerText}
        </Text>
        <Ionicons name={isOpen ? "chevron-up" : "chevron-down"} size={td(18)} color={isOpen ? "#FF7A00" : "#94A3B8"} />
      </TouchableOpacity>

      {isOpen && (
        <Modal visible={isOpen} transparent animationType="fade" onRequestClose={() => setIsOpen(false)}>
          <Pressable style={styles.modalOverlay} onPress={() => setIsOpen(false)}>
            <View 
              style={[
                styles.dropdownPopover, 
                { top: buttonLayout.y + buttonLayout.height + a(6), left: buttonLayout.x, width: buttonLayout.width }
              ]}
            >
              <ScrollView style={styles.scroll} nestedScrollEnabled showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                {options.map((option) => {
                  const isSelected = multiSelect 
                    ? selectedValues.includes(option.id)
                    : option.id === selectedValue;
                    
                  return (
                    <TouchableOpacity 
                      key={option.id} 
                      style={styles.optionRow}
                      activeOpacity={0.7}
                      onPress={() => handleItemPress(option.id)}
                    >
                      <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                        {option.name}
                      </Text>
                      
                      {multiSelect ? (
                        <View style={[styles.checkbox, isSelected && styles.checkboxActive]}>
                           {isSelected && <Ionicons name="checkmark" size={td(12)} color={Colors.white} />}
                        </View>
                      ) : (
                        isSelected && <Ionicons name="checkmark-circle" size={td(20)} color={Colors.corText} />
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
  container: { 
  },
  label: { 
    fontSize: td(13), 
    fontFamily: fonts?.robotoMedium || 'System', 
    color: Colors.corTextStrong, 
    marginBottom: a(8) 
  },
  triggerButton: { 
    height: a(44), 
    borderWidth: StyleSheet.hairlineWidth, 
    borderColor: Colors.borderHairLine, 
    borderRadius: td(12), 
    paddingHorizontal: l(14), 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between' 
  },
  triggerButtonFilled: {
    backgroundColor: '#FFFFFF', // Muda o fundo para branco quando possui valor preenchido
    borderColor: '#E2E8F0',
  },
  triggerText: { 
    flex: 1, 
    fontSize: td(14), 
    fontFamily: fonts?.robotoRegular, 
    color: Colors.placeholder, 
    paddingRight: l(8) 
  },
  triggerTextActive: { 
    color: Colors.corText, 
    fontFamily: fonts?.robotoMedium
  },
  modalOverlay: {
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.05)' // Leve escurecimento fora do popover
  },
  dropdownPopover: { 
    position: 'absolute', 
    backgroundColor: '#FFFFFF', 
    borderRadius: td(12), 
    maxHeight: a(240), 
    borderWidth: 1, 
    borderColor: '#F1F5F9', 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12, 
    shadowRadius: 16, 
    elevation: 8, 
    zIndex: 999 
  },
  scroll: { 
    maxHeight: a(240),
    margin:td(10)
  },
  optionRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: l(16), 
    borderRadius:td(10),
    height: a(48), 
    borderBottomWidth: 1, 
    borderBottomColor: '#F8FAFC'
  },
  optionRowSelected: { 
    backgroundColor: Colors.corContainer,
  },
  optionText: { 
    fontSize: td(14.5), 
    fontFamily: fonts?.robotoRegular || 'System', 
    color: '#334155' 
  },
  optionTextSelected: { 
    color: Colors.corText, 
    fontFamily: fonts.robotoMedium
  },
  checkbox: { 
    width: td(20), 
    height: td(20), 
    borderRadius: td(6), 
    borderWidth: 1.5, 
    borderColor: '#CBD5E1', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  checkboxActive: { 
    backgroundColor:Colors.corText, 
    borderColor: Colors.corText 
  }
});