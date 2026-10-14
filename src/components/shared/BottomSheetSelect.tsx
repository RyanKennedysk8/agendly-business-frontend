import React from 'react';
import { Modal, View, Text, StyleSheet, Pressable, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { scale as l, verticalScale as a, moderateScale as td } from 'react-native-size-matters';
import { fonts } from '@/assets/fonts/fonts';

// O Animated.View precisa ser extraído para funcionar perfeitamente dentro do Modal
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface SelectItem {
  id: string;
  name: string;
}

interface BottomSheetSelectProps {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  data: SelectItem[];
  selectedIds: string[];
  onSelect: (ids: string[]) => void;
  multiSelect?: boolean;
}

export function BottomSheetSelect({
  isVisible,
  onClose,
  title,
  data,
  selectedIds,
  onSelect,
  multiSelect = false,
}: BottomSheetSelectProps) {
  const insets = useSafeAreaInsets();

  if (!isVisible) return null;

  const handleToggle = (id: string) => {
    if (multiSelect) {
      if (selectedIds.includes(id)) {
        onSelect(selectedIds.filter((item) => item !== id));
      } else {
        onSelect([...selectedIds, id]);
      }
    } else {
      onSelect([id]);
      onClose(); // Auto-close na seleção única
    }
  };

  const renderItem = ({ item }: { item: SelectItem }) => {
    const isSelected = selectedIds.includes(item.id);

    return (
      <TouchableOpacity 
        style={styles.itemRow} 
        activeOpacity={0.7} 
        onPress={() => handleToggle(item.id)}
      >
        <Text style={[styles.itemText, isSelected && styles.itemTextSelected]}>
          {item.name}
        </Text>
        
        <View style={[styles.radioCircle, isSelected && styles.radioCircleSelected]}>
          {isSelected && <Ionicons name="checkmark" size={td(14)} color="#FFFFFF" />}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="none" // A animação é controlada pelo Reanimated
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Backdrop escuro com animação de Fade */}
        <AnimatedPressable 
          style={styles.backdrop} 
          entering={FadeIn.duration(200)} 
          exiting={FadeOut.duration(200)} 
          onPress={onClose} 
        />

        {/* Container principal que sobe da base */}
        <Animated.View 
          style={[styles.sheetContainer, { paddingBottom: Math.max(insets.bottom, a(20)) }]}
          entering={SlideInDown.duration(250)}
          exiting={SlideOutDown.duration(200)}
        >
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={onClose} hitSlop={15} style={styles.closeBtn}>
              <Ionicons name="close" size={td(24)} color="#64748B" />
            </TouchableOpacity>
          </View>

          <View style={styles.listContainer}>
            <FlashList
              data={data}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              extraData={selectedIds}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>Nenhuma opção encontrada.</Text>
                </View>
              }
            />
          </View>

          {/* Botão de confirmação visível apenas no multiSelect */}
          {multiSelect && (
            <TouchableOpacity style={styles.confirmButton} onPress={onClose} activeOpacity={0.8}>
              <Text style={styles.confirmButtonText}>Confirmar Seleção ({selectedIds.length})</Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(15, 23, 42, 0.5)' },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: td(24),
    borderTopRightRadius: td(24),
    minHeight: '40%',
    maxHeight: '80%',
    paddingHorizontal: l(20),
    paddingTop: a(20),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 20,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: a(16) },
  title: { fontSize: td(18), fontFamily: fonts?.robotoBold || 'System', color: '#0F172A' },
  closeBtn: { backgroundColor: '#F8FAFC', padding: td(6), borderRadius: td(18) },
  listContainer: { flexShrink: 1, minHeight: a(200) },
  itemRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: a(16), borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  itemText: { fontSize: td(15), fontFamily: fonts?.robotoMedium || 'System', color: '#334155' },
  itemTextSelected: { color: '#FF7A00', fontFamily: fonts?.robotoBold || 'System' },
  radioCircle: { width: td(22), height: td(22), borderRadius: td(11), borderWidth: 2, borderColor: '#CBD5E1', justifyContent: 'center', alignItems: 'center' },
  radioCircleSelected: { backgroundColor: '#FF7A00', borderColor: '#FF7A00' },
  emptyContainer: { paddingVertical: a(40), alignItems: 'center' },
  emptyText: { fontSize: td(14), color: '#94A3B8', fontFamily: fonts?.robotoRegular || 'System' },
  confirmButton: { marginTop: a(16), backgroundColor: '#FF7A00', height: a(50), borderRadius: td(12), justifyContent: 'center', alignItems: 'center' },
  confirmButtonText: { color: '#FFFFFF', fontSize: td(16), fontFamily: fonts?.robotoBold || 'System' }
});